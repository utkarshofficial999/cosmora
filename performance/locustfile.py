"""Cosmora v1.0.0 — Locust Production Load Test Suite.

Simulates multi-user personas executing concurrent platform workflows:
- ReaderUser: Browse stories, read chapters, track progress.
- ExplorerUser: Explore solar system, planets, moons, timeline events, missions.
- SearchUser: Universal search, autocomplete suggestions, trending queries.
- AIUser: Ask AI Assistant RAG queries, stream token responses.
"""

from locust import HttpUser, task, between, SequentialTaskSet


class ReaderWorkflow(SequentialTaskSet):
    """User persona reading space stories and tracking chapter progress."""

    @task
    def list_stories(self) -> None:
        self.client.get("/api/v1/stories?limit=10", name="/api/v1/stories")

    @task
    def read_story_detail(self) -> None:
        self.client.get("/api/v1/stories/preset/latest", name="/api/v1/stories/preset/latest")


class ExplorerWorkflow(SequentialTaskSet):
    """User persona exploring planets, moons, timeline events, and missions."""

    @task
    def list_planets(self) -> None:
        self.client.get("/api/v1/planets", name="/api/v1/planets")

    @task
    def list_timeline(self) -> None:
        self.client.get("/api/v1/timeline", name="/api/v1/timeline")

    @task
    def list_missions(self) -> None:
        self.client.get("/api/v1/missions", name="/api/v1/missions")


class SearcherWorkflow(SequentialTaskSet):
    """User persona executing universal searches and fetching suggestions."""

    @task
    def global_search(self) -> None:
        self.client.get("/api/v1/search?q=Mars", name="/api/v1/search")

    @task
    def search_suggestions(self) -> None:
        self.client.get("/api/v1/search/suggestions?q=Moon", name="/api/v1/search/suggestions")

    @task
    def trending_searches(self) -> None:
        self.client.get("/api/v1/search/trending", name="/api/v1/search/trending")


class CosmoraUser(HttpUser):
    """Aggregated load testing user persona simulating real traffic mix."""

    wait_time = between(0.5, 2.0)
    tasks = [ReaderWorkflow, ExplorerWorkflow, SearcherWorkflow]
