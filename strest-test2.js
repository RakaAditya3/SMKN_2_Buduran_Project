import http from 'k6/http';
import { sleep } from 'k6';


export const options = {
  vus: 100,     
  duration: '20s',
};


export function setup() {

  const payload = JSON.stringify({
    email: 'admin@gmail.com',
    password: 'artisan',
  });

  const headers = { 'Content-Type': 'application/json' };

  const res = http.post('http://localhost:8000/api/login', payload, { headers });

  const body = JSON.parse(res.body);


  return body.token; 
}

// Fungsi utama untuk tiap VU
export default function (token) {
  const headers = {
    Authorization: `Bearer ${token}`, 
  };

  const res = http.get('http://localhost:8000/api/admin/news', { headers });

  sleep(1);
}
