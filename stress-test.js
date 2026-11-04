import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5249';
const EMAIL = __ENV.LOGIN_EMAIL || 'admin@gmail.com';
const PASSWORD = __ENV.LOGIN_PASSWORD || '12345678';

export const options = {
  stages: [
    { duration: '2m', target: 10 },
    { duration: '3m', target: 20 },
    { duration: '3m', target: 40 },
    { duration: '3m', target: 60 },
    { duration: '3m', target: 80 },
    { duration: '3m', target: 100 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<800'],
  },
};

export default function () {
  const res = http.post(`${BASE_URL}/api/login`, {
    email: EMAIL,
    password: PASSWORD,
  });

  check(res, {
    'status 200': (r) => r.status === 200,
    'ada token': (r) => r.json('data.token') !== undefined,
  });

  sleep(1);
}
