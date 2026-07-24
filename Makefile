PYTHON ?= python3
VENV ?= python/.venv
VENV_PYTHON := $(VENV)/bin/python
DBT := $(VENV)/bin/dbt
SEED ?= 20260723
DAYS ?= 30
SESSIONS ?= 1000
OUTPUT ?= data/processed/local_foundation

.PHONY: setup test-python generate-data validate-data dbt-seed-local dbt-parse lint-markdown check

setup:
	$(PYTHON) -m venv $(VENV)
	$(VENV_PYTHON) -m pip install --upgrade pip
	$(VENV_PYTHON) -m pip install -r python/requirements.txt -r dbt/requirements.txt

test-python:
	cd python && .venv/bin/python -m pytest

generate-data:
	cd python && .venv/bin/python -m src.pipeline \
		--output ../$(OUTPUT) \
		--seed $(SEED) \
		--days $(DAYS) \
		--sessions $(SESSIONS)

validate-data: generate-data
	@echo "Validated synthetic foundation; see $(OUTPUT)/manifest.json"

dbt-parse:
	$(DBT) parse \
		--project-dir dbt \
		--profiles-dir dbt/ci \
		--target ci \
		--no-partial-parse

dbt-seed-local:
	mkdir -p data/processed
	$(DBT) seed \
		--project-dir dbt \
		--profiles-dir dbt/ci \
		--target local
	$(DBT) test \
		--project-dir dbt \
		--profiles-dir dbt/ci \
		--target local \
		--select vehicle_catalogue dealers campaign_registry experiment_registry personalisation_audience_registry reference_minimum_volumes reference_campaign_focus_integrity reference_proprietary_brand_guard

lint-markdown:
	npx --yes markdownlint-cli2 "**/*.md"

check: test-python validate-data dbt-seed-local dbt-parse lint-markdown
