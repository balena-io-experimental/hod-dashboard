import React, { useState } from 'react'
import { Box, Button, Container, Txt, ProgressBar } from 'rendition'
import io from 'socket.io-client'
import qs from 'query-string'
import tradeGecko from '../tradeGeckoApi'
import Spinner from './Spinner'
import fetch from '../fetch'

const ProcessingInfo = (props: any) => {
  const query = qs.parse(props.location.search)
  const finId = query.id || ''
  const orderId = props.match.params.id
  const deviceIp = process.env.REACT_APP_DEVICE_URL || 'localhost'
  const wsPort = process.env.REACT_APP_WS_PORT || '8080'
  const deviceUrl = `http://${deviceIp}:${wsPort}`
  const count = props.match.params.count
  
  const [ processing, setProcessing ] = useState(false)
  const [ done, setDone ] = useState(false)
  const [ deviceInfo, setDeviceInfo ] = useState<any>(false)
  const [ deviceConfig, setDeviceConfig ] = useState<any>(false)
  const [ osImage, setOsImage ] = useState<any>(false)
  const [ deviceImage, setDeviceImage ] = useState<any>(false)
  const [ flashing, setFlashing ] = useState<any>(false)

  const socket = io(deviceUrl)
  socket.on('connect', () => {
    socket.emit('identify', 'hod-dashboard')
  });
  socket.on('flash-progress', async (data: any) => {
    setFlashing(data)
  })

  socket.emit('qr-read', 'miao')

  socket.on('usbboot', () => {
    setProcessing(true)
    processBoard()
  })
  socket.on('detach', () => {
    setDone(true)
    socket.emit('count')
  })

  const processBoard = async () => {
    try {
      const { order: { notes: notesB64 } }: any = await tradeGecko.get(`orders/${orderId}`)
      const notes = JSON.parse(atob(notesB64))
      const deviceUuid = notes.devices[parseInt(count)]
      let deviceInfo = {}
      setDeviceInfo(deviceInfo)
      deviceInfo = await fetch(`${deviceUrl}/v1/device/${deviceUuid}/`, {
        method: 'GET'
      })
      setDeviceInfo(deviceInfo)
      let deviceConfig = {}
      setDeviceConfig(deviceConfig)
      deviceConfig = (await fetch(`${deviceUrl}/v1/config/`, {
        method: 'POST',
        body: JSON.stringify(deviceInfo)
      })).content
      console.log('deviceConfig', deviceConfig)
      setDeviceConfig(deviceConfig)
      let osImage = {}
      setOsImage(osImage)
      osImage = await fetch(`${deviceUrl}/v1/image/`, {
        method: 'POST',
        body: JSON.stringify(deviceConfig)
      })
      console.log('osImage', osImage)
      setOsImage(osImage)
      let deviceImage = {}
      setDeviceImage(deviceImage)
      deviceImage = await fetch(`${deviceUrl}/v1/deviceimage/`, {
        method: 'POST'
      })
      console.log('deviceImage', deviceImage)
      setDeviceImage(deviceImage)
      deviceImage = await fetch(`${deviceUrl}/v1/flash/`, {
        method: 'POST'
      })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Container textAlign='center'>
      <Txt fontSize={20}>Your order is processing</Txt>
      {!processing ? (<Spinner/>) : (
          <Box fontSize={16}>
            {deviceInfo ? (
              <Txt>
                Getting device information
              </Txt>
            ) : null}
            {deviceConfig ? (
              <Txt>
                Getting device configuration
              </Txt>
            ) : null}
            {osImage ? (
              <Txt>
                Downloading OS image
              </Txt>
            ) : null}
            {deviceImage ? (
              <Txt>
                Generating device image
              </Txt>
            ) : null}
            {flashing ? (
              <ProgressBar
                style={{width:'500px'}}
                value={done || flashing.percentage}
                info={flashing.type === 'verifying'}
                success={flashing.type === 'flashing'}>
                {`${flashing.type} ${flashing.percentage}%`}
              </ProgressBar>
            ) : null}
            {done ? (
              <Button onClick={() => props.history.goBack()}>
                Done
              </Button>
            ) : null}
          </Box>
      )}
    </Container>
  )
}

export default ProcessingInfo
