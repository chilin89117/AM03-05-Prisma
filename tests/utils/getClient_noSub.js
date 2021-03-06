import ApolloClient from 'apollo-boost';

const getClient = (jwt) => {
  return new ApolloClient({
    uri: 'http://localhost:4000',
    request(operation) {
      if(jwt) operation.setContext({
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });
    }
  });
};

export {getClient as default};
