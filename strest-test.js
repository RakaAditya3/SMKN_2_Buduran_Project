import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate } from 'k6/metrics';

// === CUSTOM METRIC ===
const errorRate = new Rate('errors');

// === CONFIGURATION ===
export const options = {
    stages: [
        { duration: '1m', target: 100 },  // warm-up
        { duration: '1m', target: 300 },  // naik
        { duration: '2m', target: 500 },  // puncak beban
        { duration: '1m', target: 0 },    // ramp-down
    ],
    thresholds: {
        http_req_failed: ['rate<0.05'], // max 5% gagal
        errors: ['rate<0.05'],
        checks: ['rate>0.95'],          // min 95% berhasil
    },
    userAgent: 'K6LoadTest/NewsOptimization',
};

// === BASE URL ===
const BASE_URL = 'http://backend.test/api';
// const BASE_URL = 'http://localhost:8000/api'; // backup kalau backend.test tidak resolve

// === MAIN TEST ===
export default function () {
    group('📚 News API Stress Test', () => {
        const headers = { 'Accept': 'application/json' };

        // === 1️⃣ Ambil daftar berita ===
        const listRes = http.get(`${BASE_URL}/news?page=1&limit=50`, { headers });
        const listOk = check(listRes, {
            'GET /news status 200': (r) => r.status === 200,
            'GET /news data array': (r) => Array.isArray(r.json()?.data),
        });

        if (!listOk) {
            errorRate.add(1);
            console.warn('⚠️ Gagal mengambil daftar berita.');
        }

        // === 2️⃣ Ambil detail berita acak ===
        const newsList = listRes.json()?.data || [];
        if (newsList.length > 0) {
            const randomNews = newsList[Math.floor(Math.random() * newsList.length)];
            const detailRes = http.get(`${BASE_URL}/news/${randomNews.id}`, { headers });

            const detailOk = check(detailRes, {
                'GET /news/{id} status 200': (r) => r.status === 200,
                'GET /news/{id} has title': (r) => r.json('title') !== undefined,
            });

            if (!detailOk) {
                errorRate.add(1);
                console.warn(`⚠️ Gagal ambil detail berita ID ${randomNews.id}`);
            }
        } else {
            console.warn('⚠️ Tidak ada data berita dari API /news.');
            errorRate.add(1);
        }

        sleep(Math.random() * 2 + 1); // jeda random 1–3 detik
    });
}

// === TEARDOWN ===
export function teardown() {
    console.log('🏁 Stress test News API (5 menit, 500 user) selesai.');
}
