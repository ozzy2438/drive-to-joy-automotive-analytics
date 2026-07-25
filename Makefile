PYTHON ?= python3
VENV ?= python/.venv
VENV_PYTHON := $(VENV)/bin/python
DBT := $(VENV)/bin/dbt
SEED ?= 20260723
DAYS ?= 30
SESSIONS ?= 1000
SCALE_REQUESTED_SESSIONS ?= 120000
OUTPUT ?= data/processed/local_foundation
WAREHOUSE_DB ?= data/processed/drive_to_joy_local.duckdb
RUNTIME_DATA ?=
RUNTIME_DATA_ARG := $(if $(strip $(RUNTIME_DATA)),--runtime-data ../$(RUNTIME_DATA),)
DASHBOARD_FIXTURE_INPUT ?= data/synthetic/dashboard_fixtures/v1/metric_inputs.csv
DASHBOARD_FIXTURE_DB ?= data/processed/dashboard_fixtures.duckdb

.PHONY: setup test-python generate-data validate-data load-warehouse dbt-build-local warehouse-smoke warehouse-scale dbt-seed-local dbt-parse semantic-check dashboard-fixture-load dashboard-fixtures dashboard-reconcile lint-markdown check

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

load-warehouse: generate-data
	cd python && .venv/bin/python -m src.warehouse.load_local_warehouse \
		--foundation ../$(OUTPUT) \
		--database ../$(WAREHOUSE_DB) $(RUNTIME_DATA_ARG)

dbt-build-local: load-warehouse
	DTJ_DUCKDB_PATH=$(WAREHOUSE_DB) $(DBT) build \
		--project-dir dbt \
		--profiles-dir dbt/ci \
		--target local \
		--no-partial-parse

warehouse-smoke: DAYS=30
warehouse-smoke: SESSIONS=1000
warehouse-smoke: OUTPUT=data/processed/local_foundation
warehouse-smoke: WAREHOUSE_DB=data/processed/drive_to_joy_local.duckdb
warehouse-smoke: dbt-build-local

warehouse-scale: DAYS=180
# Consent-denied journeys intentionally have no session ID. Request enough
# journeys for the governed output to exceed 100,000 identified sessions.
warehouse-scale: SESSIONS=$(SCALE_REQUESTED_SESSIONS)
warehouse-scale: OUTPUT=data/processed/local_foundation_scale
warehouse-scale: WAREHOUSE_DB=data/processed/drive_to_joy_scale.duckdb
warehouse-scale: dbt-build-local

dbt-parse:
	$(DBT) parse \
		--project-dir dbt \
		--profiles-dir dbt/ci \
		--target ci \
		--no-partial-parse

semantic-check:
	cd python && .venv/bin/python -m src.semantic.metric_contracts \
		--repository-root ..

dashboard-fixture-load:
	cd python && .venv/bin/python -m src.semantic.build_dashboard_fixtures \
		--input ../$(DASHBOARD_FIXTURE_INPUT) \
		--database ../$(DASHBOARD_FIXTURE_DB)

dashboard-fixtures: dashboard-fixture-load
	DTJ_DUCKDB_PATH=$(DASHBOARD_FIXTURE_DB) $(DBT) build \
		--project-dir dbt \
		--profiles-dir dbt/ci \
		--target local \
		--no-partial-parse \
		--select agg_dashboard_fixture_results \
		--vars '{semantic_source_adapter: dashboard_fixture}'
	cd python && .venv/bin/python -m src.semantic.validate_dashboard_fixtures \
		--repository-root .. \
		--database ../$(DASHBOARD_FIXTURE_DB)

dashboard-reconcile: semantic-check
	cd python && .venv/bin/python -m src.semantic.reconcile_dashboards \
		--repository-root .. \
		--database ../$(WAREHOUSE_DB)

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

check: test-python warehouse-smoke semantic-check dashboard-fixtures dashboard-reconcile dbt-parse lint-markdown
