import http from 'k6/http';
import { check, group, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 500 },
    { duration: '1m', target: 2000 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  group('Public Browse', function () {
    http.get('http://localhost:8000/api/v1/planets');
    http.get('http://localhost:8000/api/v1/timeline');
    http.get('http://localhost:8000/api/v1/missions');
  });

  group('Search', function () {
    http.get('http://localhost:8000/api/v1/search?q=Mars');
    http.get('http://localhost:8000/api/v1/search/suggestions?q=Moon');
  });

  sleep(1);
}
