import { useEffect, useState } from 'react';
import { get } from '../hooks/request';

export default function Landing() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    get('/api/users/currentuser').then((response) => {
      setCurrentUser(response.currentUser);
    });
  }, []);

  return currentUser ? (
    <h1>You are signed in as : {currentUser?.email}</h1>
  ) : (
    <h1>You are not signed in</h1>
  );
}
