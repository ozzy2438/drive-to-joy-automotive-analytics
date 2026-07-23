# Scheduled Queries and Jobs

## Required schedules

| Job | Frequency | Output |
|---|---|---|
| Raw ingestion validation | Daily | Freshness status |
| dbt build | Daily or after source arrival | Analytics marts |
| Data quality checks | Daily | Quality results |
| Dashboard refresh | Daily/weekly based on audience | BI datasets |
| Experiment monitoring | Daily while active | SRM/guardrail status |

Every schedule must have owner, expected completion time and failure response.
