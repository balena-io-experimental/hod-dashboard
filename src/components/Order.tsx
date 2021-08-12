import React, { useState, useEffect } from 'react'
import * as _ from 'lodash'
import { Card, Flex, Container, Txt } from 'rendition'
import io from 'socket.io-client'
import tradeGecko from '../tradeGeckoApi'
import Spinner from './Spinner'

const Order = (props: any) => {
  const orderId = props.match.params.id
  const { history } = props

  const [order, setOrder] = useState({})
  const [products, setProducts] = useState<any[]>([])
  const [notFound, setNotFound] = useState(false)
  const [count, setCount] = useState(0)

  const deviceUrl = process.env.REACT_APP_DEVICE_URL
  const wsPort = process.env.REACT_APP_WS_PORT
  const pathname = _.trimEnd(history.location.pathname, '/')

  const socket: SocketIOClient.Socket = io(`http://${deviceUrl}:${wsPort}`)
  socket.on('connect', () => {
    socket.emit('identify', 'hod-dashboard')
  });
  socket.on('qr-read', async (data: string) => {
    let processingPathname = `${pathname}/processing`
    history.push({
      pathname: processingPathname,
      state: {
        id: data,
        count
      }
    })
  })
  socket.on('count', () => setCount(count + 1))

  useEffect(() => {
    const getOrderData = async () => {
      try {
        const { order }: any = await tradeGecko.get(`orders/${orderId}`)
        console.log('notes', JSON.parse(atob(order.notes)))
        setOrder(order)
        setNotFound(!order)

        const orderLineItems = await Promise.all(_.map(order.order_line_item_ids, async (order_line_item_id) => {
          const { order_line_item }: any = await tradeGecko.get(`order_line_items/${order_line_item_id}`)
          return order_line_item
        }))
        const variants = await Promise.all(_.map(_.reject(orderLineItems, { line_type: 'shippingRate' }), async (orderLineItem) => {
          const { variant }: any = await tradeGecko.get(`variants/${orderLineItem.variant_id}`)
          return variant
        }))
        setProducts([...variants])
      } catch (err) {
        console.error(err)
      }
    }

    getOrderData()
    return () => {
      socket.close()
    }
  }, [orderId])

  if (notFound) {
    return (
      <Container>
        <Txt fontSize={20}>
          Order not found
        </Txt>
      </Container>
    ) 
  }
  return (
    <Container textAlign='center'>
      <Txt fontSize={20}>
        Order: <strong>{orderId}</strong>
      </Txt>
      {(!_.isEmpty(order)) ? (
        <Flex flexDirection='column'>
          <Txt fontSize={20}>
            Details
          </Txt>
          <Flex>
          {_.map(products, (item) => {
            return (
              <Card
                key={item.id}
                title={`Item: ${item.product_name}`}
                m={3}
              >
                <Txt>SKU: {item.sku}</Txt>
              </Card>
            )
          })}
          </Flex>
        </Flex>
      ) : (
        <Spinner/>
      )}
    </Container>
  )
}

export default Order
