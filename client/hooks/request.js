import axios from 'axios';
import { toast } from 'react-toastify';

function parseData(data) {
  const formData = new FormData();

  for (let [key, value] of Object.entries(data)) {
    if (key === 'Photo' || key === 'File') {
      for (let i = 0; i < value.length; i++) {
        var item = value[i];
        formData.append(key, item);
      }
    } else {
      formData.append(key, value);
    }
  }

  return formData;
}

function request(url, data = false, method = 'get', type = 'JSON', onSuccess) {
  // axios.defaults.withCredentials = true;
  const jsonHead = {
    'Content-Type': 'application/json',
    Authorization: localStorage.getItem('accessToken'),
  };
  var body = null;
  return new Promise(async (resolve, reject) => {
    if (data && method === 'post') {
      body = type === 'JSON' ? JSON.stringify(data) : parseData(data);
    }

    try {
      const response = await axios({
        method: method,
        url: process.env.NEXT_PUBLIC_SERVER_URL + url,
        body,
        headers: type === 'JSON' ? jsonHead : jsonHead,
      });

      if (response?.status === 401) {
        window.location.href = '/auth/signin';
      }
      if (response.statusText === 'OK') {
        if (onSuccess) {
          onSuccess();
        }
        resolve(response.data);
      } else {
        reject(response);
      }
    } catch (error) {
      var msg = '';

      error.response.data.errors.map((err) => {
        msg += err.message + '\n';
      });

      toast.error(msg);

      reject(error.response);
    }
  });
}

function signinRequest(
  data = false,
  method = 'post',
  type = 'JSON',
  onSuccess
) {
  const jsonHead = {
    'Content-Type': 'application/json',
  };

  return new Promise(async (resolve, reject) => {
    var body = JSON.stringify(data);
    var url = '/api/users/signin';

    try {
      const response = await axios[method](
        process.env.NEXT_PUBLIC_SERVER_URL + url,
        body,
        {
          headers: type === 'JSON' ? jsonHead : jsonHead,
        }
      );
      if (response.statusText === 'OK') {
        localStorage.setItem('accessToken', response.data.userjwt);

        if (onSuccess) {
          onSuccess();
        }
        resolve(response.data);
      } else {
        reject(response);
      }
    } catch (error) {
      var msg = '';

      error.response.data.errors.map((err) => {
        msg += err.message + '\n';
      });

      toast.error(msg);

      reject(error.response);
    }
  });
}

export const post = (url, data, onSuccess) =>
  request(url, data, 'post', onSuccess);
export const signin = (data, onSuccess) =>
  signinRequest(data, 'post', onSuccess);
export const postForm = (url, data, onSuccess) =>
  request(url, data, 'post', 'FORM', onSuccess);
export const get = (url, onSuccess) => request(url, onSuccess);
