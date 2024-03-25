import UseRequest from '../hooks/use-request';

function Landing({ currentUser }) {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are not signed in</h1>
  );
}

Landing.getInitialProps = async (context) => {
  var result = null;

  const { doRequest, errors } = UseRequest({
    url: '/api/users/currentuser',
    method: 'get',
    onSuccess: (response) => (result = response),
  });

  await doRequest();

  return result;
};

export default Landing;
