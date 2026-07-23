# Makefile

.PHONY: docs test-python dbt-build

docs:
	@echo "Review Markdown documentation and GitHub Actions markdown lint workflow."

test-python:
	python -m pytest python/tests

dbt-build:
	@echo "Configure profiles.yml and warehouse credentials, then run:"
	@echo "dbt deps --project-dir dbt"
	@echo "dbt build --project-dir dbt"
