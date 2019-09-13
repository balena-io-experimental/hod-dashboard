import React, { useState, useEffect } from 'react';
import * as _ from 'lodash';
// eslint-disable-next-line
import { BrowserRouter as Route, Link } from 'react-router-dom';
import { Container, Provider, Txt } from 'rendition'
import tradeGecko from '../tradeGeckoApi'
import Spinner from './Spinner'

const OrdersList = () => {
  const [orders, setOrders] = useState();
  useEffect(() => {
    const getOrders = async () => {
      try {
        const { orders }: any = await tradeGecko.get('orders')
        const unfulfilledOrders = _.filter(orders, { status: 'active' })
        setOrders(unfulfilledOrders)
      } catch (err) {
        console.error(err)
      }
    }

    getOrders()
  }, [])

  if (_.isUndefined(orders)) {
    return (
      <Provider>
        <Container>
          <Spinner/>
        </Container>
      </Provider>
    )
  }
  if (_.isEmpty(orders)) {
    return (
      <Provider>
        <Container>
          <Txt fontSize={20}>
            There are no unfulfilled orders!
          </Txt>
        </Container>
      </Provider>
    )
  }
  return (
    <Provider>
      <Container fontSize={16} textAlign='center'>
        {orders.map((order: any) => (
          <Txt key={order.id}>
            <Link to={`/order/${order.id}`}>
              Order {order.id}
            </Link>
          </Txt>
        ))}
      </Container>
    </Provider>
  )
}

export default OrdersList