import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 500 },
    { duration: '1m', target: 1000 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<150'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const queries = ['Mars', 'Moon', 'Apollo', 'ISRO', 'Black Hole'];
  const query = queries[Math.floor(Math.random() * queries.length)];

  const res1 = http.get(`http://localhost:8000/api/v1/search?q=${query}`);
  check(res1, { 'search status 200': (r) => r.status === 200 });

  const res2 = http.get(`http://localhost:8000/api/v1/search/suggestions?q=${query}`);
  check(res2, { 'suggestions status 200': (r) => r.status === 200 });

  sleep(0.5);
}
