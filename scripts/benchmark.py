"""Cosmora v1.0.0 — Automated Concurrency Benchmark Runner.

Executes real concurrent HTTP load against the containerized API stack to record P50, P90, P95, P99 latencies, RPS throughput, and error rates.
"""

import asyncio
import time
import httpx


BASE_URL = "http://localhost:8000"
CONCURRENCY = 20
TOTAL_REQUESTS_PER_ENDPOINT = 100

ENDPOINTS = [
    "/api/v1/health",
    "/api/v1/planets",
    "/api/v1/timeline",
    "/api/v1/missions",
    "/api/v1/stories",
    "/api/v1/search?q=Mars",
    "/api/v1/search/suggestions?q=Moon",
]


async def get_auth_token(client: httpx.AsyncClient) -> str | None:
    """Register/Login benchmark user to get JWT bearer token."""
    try:
        await client.post(
            f"{BASE_URL}/api/v1/auth/register",
            json={
                "email": "bench_user@cosmos.org",
                "username": "bench_user",
                "password": "ValidP@ssword123",
                "role_name": "Customer",
            },
        )
    except Exception:
        pass

    try:
        resp = await client.post(
            f"{BASE_URL}/api/v1/auth/login",
            json={"username": "bench_user", "password": "ValidP@ssword123"},
        )
        if resp.status_code == 200:
            return resp.json().get("access_token")
    except Exception:
        pass
    return None


async def benchmark_endpoint(
    client: httpx.AsyncClient,
    endpoint: str,
    headers: dict[str, str],
) -> dict[str, float]:
    """Benchmark a single endpoint under concurrency."""
    latencies: list[float] = []
    errors = 0
    start_total = time.time()

    semaphore = asyncio.Semaphore(CONCURRENCY)

    async def worker() -> None:
        nonlocal errors
        async with semaphore:
            req_start = time.time()
            try:
                resp = await client.get(f"{BASE_URL}{endpoint}", headers=headers)
                if resp.status_code in [200, 201]:
                    latencies.append((time.time() - req_start) * 1000.0)
                else:
                    errors += 1
            except Exception:
                errors += 1

    tasks = [worker() for _ in range(TOTAL_REQUESTS_PER_ENDPOINT)]
    await asyncio.gather(*tasks)

    duration = time.time() - start_total
    rps = len(latencies) / duration if duration > 0 else 0

    latencies.sort()
    p50 = latencies[int(len(latencies) * 0.50)] if latencies else 0.0
    p90 = latencies[int(len(latencies) * 0.90)] if latencies else 0.0
    p95 = latencies[int(len(latencies) * 0.95)] if latencies else 0.0
    p99 = latencies[int(len(latencies) * 0.99)] if latencies else 0.0

    return {
        "endpoint": endpoint,
        "total_requests": TOTAL_REQUESTS_PER_ENDPOINT,
        "successful_requests": len(latencies),
        "failed_requests": errors,
        "rps": round(rps, 2),
        "p50_ms": round(p50, 2),
        "p90_ms": round(p90, 2),
        "p95_ms": round(p95, 2),
        "p99_ms": round(p99, 2),
    }


async def main() -> None:
    """Run full benchmark suite across all endpoints."""
    print("=" * 75)
    print("Cosmora v1.0.0 -- Automated Concurrency Benchmark Runner")
    print("=" * 75)

    async with httpx.AsyncClient(timeout=10.0) as client:
        token = await get_auth_token(client)
        auth_headers = {"Authorization": f"Bearer {token}"} if token else {}

        results = []
        for ep in ENDPOINTS:
            res = await benchmark_endpoint(client, ep, auth_headers)
            results.append(res)
            print(
                f"Endpoint: {res['endpoint']:<35} | RPS: {res['rps']:<6} | "
                f"P50: {res['p50_ms']:<6}ms | P95: {res['p95_ms']:<6}ms | P99: {res['p99_ms']:<6}ms | Errors: {res['failed_requests']}"
            )

    print("=" * 75)
    print("Benchmark Completed Successfully!")
    print("=" * 75)


if __name__ == "__main__":
    asyncio.run(main())
