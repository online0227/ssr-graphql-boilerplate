import React from 'react';
import { Query } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import { GET_CURRENT_USER } from '../queries';
import * as Cookies from 'es-cookie';

const withAuth = conditionFunc => Component => props => {
  
  if (props.unitTesting === 'true') {
    return <Component {...props} />
  }

  return (

    <Query query={GET_CURRENT_USER}>

      {({ data, loading, error, refetch }) => {

        if (loading) return null

        if (typeof document !== 'undefined') {

          const tokenExpired = Cookies.get('token');

          if (tokenExpired == undefined) { 
            return <Redirect to="/signin" />
          }
        }

        if (props.session.getCurrentUser == null) {
          return <Redirect to="/signin" />
        }
        return conditionFunc(data) ? <Component {...props} /> : <Redirect to="/signin" />

      }}


    </Query>

  )

};


export default withAuth;