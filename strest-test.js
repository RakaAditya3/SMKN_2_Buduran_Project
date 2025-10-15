import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// === METRIC CUSTOM ===
const errorRate = new Rate('errors');

// === KONFIGURASI LOAD TEST ===
export const options = {
    stages: [
        { duration: '10s', target: 10 },  // naik ke 10 user
        { duration: '20s', target: 10 },  // stabil
        { duration: '10s', target: 0 },   // turun
    ],
    thresholds: {
        http_req_duration: ['p(95)<2000'], // 95% request < 2 detik
        http_req_failed: ['rate<0.05'],    // <5% gagal
        errors: ['rate<0.05'],
    },
    userAgent: 'K6LoadTest/PresensiCheck',
};

// === BASE URL ===
const BASE_URL = 'http://backend.test/api';


// === UID YANG DITES ===
const UID = 'UID1';

// === FUNGSI UTAMA ===
export default function () {
    group('Presensi - Check UID1', () => {
        const url = `${BASE_URL}/presensi/check/${UID}`;
        const res = http.get(url, { headers: { Accept: 'application/json' } });

        // Validasi response
        const ok = check(res, {
            'status 200/422/404': (r) =>
                [200, 404, 422].includes(r.status),
            'response JSON valid': (r) => {
                try {
                    const body = JSON.parse(r.body);
                    return typeof body === 'object' && body !== null;
                } catch {
                    return false;
                }
            },
        });

        if (!ok) {
            errorRate.add(1);
            console.error(`❌ Error ${res.status} | ${res.body}`);
        }
    });

    sleep(1);
}

// === TEARDOWN ===
export function teardown() {
    console.log('🏁 Stress test presensi/check selesai tanpa error fatal.');
}
