import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';

import React from 'react';
import Layout from '../components/layout';

function App({ Component, pageProps, currentUser }) {
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  console.log('currentUser', currentUser);

  return getLayout(<Component {...pageProps} />);
}

App.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps;
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return {
    pageProps,
    ...data,
  };
};

export default App;
