import React from 'react';
import { Outlet } from 'react-router-dom';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink,  } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { Container } from 'react-bootstrap';
import { setContext } from '@apollo/client/link/context';

import Header from "./components/Header/Header.jsx";

import './style.css';
// uncomment these once components are created
// import Footer from './components/Footer/Footer';

const httpLink = createHttpLink({
  uri: '/graphql',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // console.log("App.jsx - Token: ", token);
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});


const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message }) => {
      if (message === 'Authentication token is invalid, please log in' || message === 'Context creation failed: Token expired!') {
        localStorage.removeItem('id_token');
        window.location.replace('/');
      }
    });
  }
  
})
const client = new ApolloClient({
  link: errorLink.concat(authLink).concat(httpLink),
  cache: new InMemoryCache(),
});



function App() {
  
  return (
    <ApolloProvider client={client}>
      <Container fluid>
        <Header/>
        <Outlet />
        {/* <Footer /> */}
      </Container>
    </ApolloProvider>
  );
}

export default App
