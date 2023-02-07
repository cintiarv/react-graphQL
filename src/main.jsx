import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
// integrating subcriptions logic
import { split, HttpLink } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { ApolloClient } from '@apollo/client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from '@apollo/react-hooks'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'

const httpLink = new HttpLink({
  uri: 'http://localhost:8000/graphql'
})

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:8000/graphql'
}))

// create a split link
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>
)
