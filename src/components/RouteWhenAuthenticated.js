import { isAuthenticated } from '../firebase';
import Route from 'react-router-dom/Route';
import Redirect from 'react-router-dom/Redirect';
import React from 'react';

const RouteWhenAuthenticated = ({component: Component, componentProps: componentProps, ...rest}) => (
    <Route {...rest} render={props => (
      isAuthenticated() ? (
        <Component {...componentProps} {...props}/>
        ) : (
        <Redirect to={ {
          pathname: '/login',
          state: {from: props.location}
        } } />
      ))
    }/>
)

export default RouteWhenAuthenticated;
