import axios from 'axios';
import React, { useState } from 'react';

function UseRequest({ url, method, body, onSuccess }) {
  const [errors, setErrors] = useState([]);

  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await axios[method](
        process.env.NEXT_PUBLIC_SERVER_URL + url,
        body
      );

      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Oooops....</h4>
          <ul className="my-0">
            {err.response?.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
}

export default UseRequest;
