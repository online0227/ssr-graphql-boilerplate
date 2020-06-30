import React from "react"
import ReactDOM from "react-dom"
import AppRoot from "./components/AppRoot"
import { AppContainer } from "react-hot-loader"

import { ApolloProvider } from 'react-apollo';import { createHttpLink } from 'apollo-link-http';import { createUploadLink } from "apollo-upload-client";
import { ApolloClient, InMemoryCache } from "apollo-boost";
import * as Cookies from 'es-cookie';
import { setContext } from 'apollo-link-context';

const link = createUploadLink({
  uri: '/graphql',
  credentials: 'same-origin',
});

const authLink = setContext((_, { headers }) => {
  const token = Cookies.get('token');  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__),  link: authLink.concat(link),
  dataIdFromObject: o => o._id,
  ssrMode: true,
});

function render(Component) {
  const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate;
  renderMethod(
    <ApolloProvider client={client}>
      <AppContainer>
        <Component />
      </AppContainer>
    </ApolloProvider>,
    document.getElementById("root")
  )
}
render(AppRoot)

if (module.hot) {  module.hot.accept("./components/AppRoot.js", () => {
    const NewAppRoot = require("./components/AppRoot.js").default
    render(NewAppRoot)
  })
}
