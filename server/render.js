import React from "react"
import { renderToString } from "react-dom/server"
import { StaticRouter } from "react-router"
import Routes from "../client/components/Routes"

import { flushChunkNames, clearChunks } from "react-universal-component/server"
import flushChunks from "webpack-flush-chunks"

import ApolloClient from 'apollo-client';
import { getDataFromTree, ApolloProvider } from 'react-apollo';
import { InMemoryCache } from "apollo-cache-inmemory";
import config from "./config";
import fetch from 'node-fetch';
import { createHttpLink } from 'apollo-link-http';import { setContext } from 'apollo-link-context';

const link = createHttpLink({  uri: config.server_address + '/graphql',  credentials: 'same-origin',
  fetch: fetch,
});export default ({ clientStats }) => (req, res) => {  let site = "www";
  if (req.hostname !== config.domain) {
    site = req.hostname.split(".")[0]
  }

  const slug = req.url.split("/").reverse()[0]
  const context = { site }
  const token = req.cookies.token ? req.cookies.token : null;
  const authLink = setContext((_, { headers }) => {    return {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
      }
    }
  });  const client = new ApolloClient({
    ssrMode: true,    link: authLink.concat(link),
    cache: new InMemoryCache(),
  });

  const initialComponents = (
    <ApolloProvider client={client}>
      <StaticRouter location={req.originalUrl} context={context}>
        <Routes />
      </StaticRouter>
    </ApolloProvider>
  );

  getDataFromTree(initialComponents)
    .then(() => {
      const content = renderToString(initialComponents);
      const initialState = client.extract();

      const template = () => {
        clearChunks();
        const names = flushChunkNames();        const { js, styles, cssHash } = flushChunks(clientStats, {
          chunkNames: names
        })

        return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>ssr-graphql-boilerplate</title>
              <link rel="shortcut icon" href="/public/img/favicon.ico" />
              <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" />
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css" />
              ${styles}
            </head>
            <body data-spy="scroll" data-target="#navbarResponsive">
              <div id="root">${content}</div>
              <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
              <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
              <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
              <script src="https://use.fontawesome.com/releases/v5.9.0/js/all.js"></script>
              <script src="https://cdn.ckeditor.com/4.6.2/standard/ckeditor.js"></script>
              ${js}
              <script>
                window.__APOLLO_STATE__ = ${JSON.stringify(initialState)};
              </script>
              ${cssHash}
            </body>
          </html>
        `
      }

      res.send(template())
    });
}
