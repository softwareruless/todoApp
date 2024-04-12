import { useState } from 'react';
import { signin } from '../../hooks/request';
import styles from '../../assets/css/styles.module.scss';
import Router from 'next/router';

function testFunc() {
  console.log('test log');
}

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();

    const data = { email, password };
    var signinResult = await signin(data, Router.push('/'));
    // var signinResult = await post('/api/users/signin', data);

    console.log('signinResult', signinResult);
  };

  return (
    <>
      <form onSubmit={onSubmit} className="col-11 m-auto">
        <h1>Signin</h1>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="text"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* {errors} */}

        <button className="btn btn-primary">Sign Up</button>
      </form>
    </>
  );
};

export default Signin;
