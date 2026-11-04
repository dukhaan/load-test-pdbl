import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5249';
const EMAIL = __ENV.LOGIN_EMAIL || 'admin@toko-jus.local';
const PASSWORD = __ENV.LOGIN_PASSWORD || 'Admin#2024';

export const options = {
  stages: [
    { duration: '10s', target: 1 },
    { duration: '50s', target: 1 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<800'],
  },
};

export default function () {
  const res = http.post(`${BASE_URL}/login.html`, {
    email: EMAIL,
    password: PASSWORD,
  });

  check(res, {
    'status 200': (r) => r.status === 200,
    'ada token': (r) => r.json('data.token') !== undefined,
  });

  sleep(1);
}
