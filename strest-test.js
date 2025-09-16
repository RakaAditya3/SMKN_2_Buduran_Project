import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 100,       
  duration: '30s',
};

export default function () {
  //  frontend
  http.get('http://localhost:3000/');

  // backend
  http.get('http://localhost:8000/api/berita');

  sleep(1);
}
