import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metric
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '3m', target: 300 },
    { duration: '2m', target: 500 },
    { duration: '5m', target: 500 },
    { duration: '2m', target: 800 },
    { duration: '3m', target: 800 },
    { duration: '2m', target: 100 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000', 'p(99)<10000'], // Sesuaikan sesuai server
    http_req_failed: ['rate<0.05'],
    errors: ['rate<0.05'],
    checks: ['rate>0.95'],
  },
  maxRedirects: 4,
  userAgent: 'K6LoadTest/1.0',
};

// === USER SCENARIOS ===
export default function () {
  const rand = Math.random();

  if (rand < 0.35) {
    browsing_news();
  } else if (rand < 0.55) {
    view_companies();
  } else if (rand < 0.70) {
    browse_ebooks();
  } else {
    rfid_check();
  }

  sleep(Math.random() * 3 + 1); // 1-4 detik
}

// === FUNCTIONS ===
function browsing_news() {
  group('News - Public', () => {
    let res = http.get('http://localhost:8000/api/news?page=1&limit=50');
    check(res, { 'status 200': (r) => r.status === 200 }) || errorRate.add(1);

    let body = safeJSONParse(res);
    check(body, { 'news has data': (b) => Array.isArray(b) && b.length > 0 }) || errorRate.add(1);

    // Ambil random news ID dari array
    const newsId = body.length > 0 ? body[Math.floor(Math.random() * body.length)].id : 1;
    res = http.get(`http://localhost:8000/api/news/${newsId}`);
    check(res, { 'news detail 200 or 404': (r) => r.status === 200 || r.status === 404 }) || errorRate.add(1);
  });
}

function view_companies() {
  group('Companies - Public', () => {
    let res = http.get('http://localhost:8000/api/company');
    check(res, { 'status 200': (r) => r.status === 200 }) || errorRate.add(1);

    let body = safeJSONParse(res);
    check(body, { 'company has data': (b) => Array.isArray(b) && b.length > 0 }) || errorRate.add(1);
  });
}

function browse_ebooks() {
  group('Ebooks - Public', () => {
    let res = http.get('http://localhost:8000/api/ebooks');
    check(res, { 'ebooks list 200': (r) => r.status === 200 }) || errorRate.add(1);

    let body = safeJSONParse(res);
    check(body, { 'ebooks has data': (b) => b.data && Array.isArray(b.data) && b.data.length > 0 }) || errorRate.add(1);

    // Ambil random ebook ID dari array
    const ebookId = body.data.length > 0 ? body.data[Math.floor(Math.random() * body.data.length)].id : 1;
    res = http.get(`http://localhost:8000/api/ebooks/${ebookId}`);
    check(res, { 'ebook detail 200 or 404': (r) => r.status === 200 || r.status === 404 }) || errorRate.add(1);
  });
}

function rfid_check() {
  group('RFID Attendance - Public', () => {
    const uid = '0092090003'; // Contoh UID
    let res = http.get(`http://localhost:8000/api/presensi/check/${uid}`);
    check(res, { 'status 200 or 422': (r) => r.status === 200 || r.status === 422 }) || errorRate.add(1);

    safeJSONParse(res);
  });
}

// === Utility ===
function safeJSONParse(res) {
  if (res.status === 200 && res.headers['Content-Type']?.includes('application/json')) {
    try {
      return JSON.parse(res.body);
    } catch (e) {
      console.warn('⚠️ Failed parse JSON:', e);
      errorRate.add(1);
    }
  }
  return [];
}

// === Teardown ===
export function teardown() {
  console.log('🏁 Public stress test selesai!');
}
