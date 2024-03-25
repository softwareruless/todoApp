import axios from 'axios';
import { useState } from 'react';

const jsonHead = {
  'Content-Type': 'application/json',
};

function parseData(data) {
  const formData = new FormData();

  for (let [key, value] of Object.entries(data)) {
    if (key === 'Photo' || key === 'File') {
      console.log('key', Object.values(value));
      // var items = Object.values(value);

      for (let i = 0; i < value.length; i++) {
        var item = value[i];
        console.log('item', item);
        formData.append(key, item);
      }
    } else {
      formData.append(key, value);
    }
  }

  return formData;
}

function request(url, data = false, method = 'get', type = 'JSON', onSuccess) {
  var body = null;
  return new Promise(async (resolve, reject) => {
    if (data && method === 'post') {
      body = type === 'JSON' ? JSON.stringify(data) : parseData(data);
    }

    try {
      const response = await axios[method](
        process.env.NEXT_PUBLIC_SERVER_URL + url,
        body,
        {
          headers: type === 'JSON' ? jsonHead : jsonHead,
        }
      );

      if (response?.status === 401) {
        window.location.href = '/auth/signin';
      }

      if (response.statusText === 'OK') {
        console.log('success response', response);

        resolve(response);
      } else {
        console.log('error response', response);
        reject(response);
      }
    } catch (error) {
      console.log('catch error response', error.response);
      reject(error.response);
    }
  });
}

async function requestNoPromise(
  url,
  data = false,
  method = 'get',
  type = 'JSON'
) {
  try {
    var body = null;
    if (data && method === 'post') {
      body = type === 'JSON' ? JSON.stringify(data) : parseData(data);
    }

    const response = await axios[method](
      process.env.NEXT_PUBLIC_SERVER_URL + url,
      body,
      {
        headers: type === 'JSON' ? jsonHead : jsonHead,
      }
    );

    if (response?.status === 401) {
      window.location.href = '/auth/signin';
    }

    if (response.statusText === 'OK') {
      return response;
    } else {
      return response.response.data;
    }
  } catch (error) {
    return error;
  }
}

export const post = (url, data) => request(url, data, 'post');
export const postNoPromise = (url, data) => requestNoPromise(url, data, 'post');
export const postForm = (url, data) => request(url, data, 'post', 'FORM');
export const get = (url) => request(url);
