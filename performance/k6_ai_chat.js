import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 100 },
    { duration: '1m', target: 500 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const payload = JSON.stringify({
    message: 'Tell me about the Apollo 11 moon landing.',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post('http://localhost:8000/api/v1/ai/chat', payload, params);
  check(res, {
    'ai status 200': (r) => r.status === 200,
    'answer present': (r) => r.json('answer') !== undefined,
  });

  sleep(2);
}
