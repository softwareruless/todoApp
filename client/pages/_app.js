import 'bootstrap/dist/css/bootstrap.css';

import React from 'react';
import Layout from '../components/layout';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { get } from '../hooks/request';

function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  // const [currentUser, setCurrentUser] = useState(null);

  // get('/api/users/currentuser').then((response) => {
  //   setCurrentUser(response.data);
  // });

  // console.log('currentUser app.js', currentUser);

  return getLayout(
    <>
      <ToastContainer />
      <Component {...pageProps} />
    </>
  );
}

App.getInitialProps = async (appContext) => {
  let pageProps;
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return {
    pageProps,
  };
};

export default App;
