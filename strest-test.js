import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 1000,       
  duration: '1m',
};

export default function () {
  // backend
 http.get("http://localhost:3000/Pages/Extrakurikuler");

  sleep(1);
}
