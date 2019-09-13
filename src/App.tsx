import React from 'react';
// import * as _ from 'lodash';
import { Flex, Txt, Provider, Container } from 'rendition';
import './App.css';
import { BrowserRouter as Router, Route, Link, withRouter } from 'react-router-dom';
import OrdersList from './components/OrdersList'
import Order from './components/Order'
import ProcessingInfo from './components/ProcessingInfo'

const NavBar = withRouter(() => {
  return (
    <Container>
      <Txt fontSize={24}>
        <Link to='/'>Orders</Link>
      </Txt>
    </Container>
  )
})

const AppRouter = () => {
  return (
    <Router>
      <Provider>
        <Flex
          flexDirection='column'
          p='2em'
        >
          <NavBar/>

          <Route path='/' exact component={OrdersList} />
          <Route path='/order/:id/' component={Order} />
          <Route path='/order/:id/processing/:count' component={ProcessingInfo} />
        </Flex>
      </Provider>
    </Router>
  );
}

export default AppRouter;
