import { useEffect, useState } from 'react';
import { get } from '../hooks/request';

export default function Landing() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    get('/api/users/currentuser').then((response) => {
      // console.log('response', response);
      setCurrentUser(response.currentUser);
    });
  }, []);

  // console.log('currentUser index.js', currentUser);

  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are not signed in</h1>
  );
}
