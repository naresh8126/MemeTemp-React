import React, { cloneElement, Children } from 'react'
import { Route, Navigate } from 'react-router-dom'

const PrivateRoute = ({ children, authed, ...rest }) =>
  <Route
    {...rest}
    render={(props) => authed ?
      <div>
        {Children.map(children, child => cloneElement(child, { ...child.props }))}
      </div>
      :
      <Navigate to={{ pathname: '/', state: { from: props.location } }} />}
  />

export default PrivateRoute