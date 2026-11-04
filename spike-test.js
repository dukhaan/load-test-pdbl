import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5249';
const EMAIL = __ENV.LOGIN_EMAIL || 'admin@gmail.com';
const PASSWORD = __ENV.LOGIN_PASSWORD || '12345678';

export const options = {
  stages: [
    { duration: '1m', target: 5 },
    { duration: '10s', target: 100 },
    { duration: '1m', target: 100 },
    { duration: '10s', target: 5 },
    { duration: '1m', target: 5 },
    { duration: '30s', target: 0 },
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
