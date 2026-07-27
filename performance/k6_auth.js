import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 500 },
    { duration: '1m', target: 1000 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const payload = JSON.stringify({
    username: 'ai_user',
    password: 'ValidP@ssword123',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post('http://localhost:8000/api/v1/auth/login', payload, params);
  check(res, {
    'status is 200': (r) => r.status === 200,
    'token received': (r) => r.json('access_token') !== undefined,
  });

  sleep(1);
}
