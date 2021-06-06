import axios from 'axios';

export async function getServerStatus() {
  try {
    // TODO get url from env config
    const res = await axios.get('http://localhost:3000/status');
    return res;
  } catch (error) {
    console.error('Error getting server status: ', error); // TODO error logs
    throw error;
  }
}

export async function checkInternetConnection() {
  return new Promise((resolve, reject) => {
    require('dns').resolve('www.google.com', err => {
      if (err) return reject(new Error(err.type));
      resolve(true);
    });
  });
}
