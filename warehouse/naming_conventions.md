# Naming Conventions

## Datasets

Use lower snake case: `analytics_marts`.

## Tables

- `stg_` for staging
- `int_` for intermediate
- `fct_` for facts
- `dim_` for dimensions
- `agg_` for approved aggregates

## Columns

Use lower snake case and explicit suffixes: `_id`, `_at`, `_date`, `_flag`, `_rate`, `_count`.

## Dates

Store timestamps in UTC unless documented otherwise. Convert presentation timezone in reporting layer.
