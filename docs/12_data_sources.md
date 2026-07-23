# Data Sources

## Data source policy

Drive to Joy uses synthetic core data, official sample analytics sources and public/open context data. No proprietary Honda Australia data is used.

## Recommended sources

| Source | Link | Project use |
|---|---|---|
| Google Analytics demo account | [Google Analytics demo account](https://support.google.com/analytics/answer/6367342) | GA4 reporting and exploration practice |
| Google Analytics BigQuery sample dataset | [Google sample dataset documentation](https://support.google.com/analytics/answer/10937659) | GA4-style BigQuery schema and query practice |
| GA4 export schema | [GA4 BigQuery export schema](https://support.google.com/analytics/answer/7029846) | Synthetic event schema design |
| GA4 ecommerce events | [GA4 ecommerce events reference](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce) | Event-design reference |
| BigQuery public datasets | [BigQuery public data](https://cloud.google.com/bigquery/public-data) | Public-data discovery and practice |
| FCAI VFACTS | [FCAI VFACTS publications](https://www.fcai.com.au/news/index/view/news/770) | Australian automotive market context |
| Australian Bureau of Statistics | [ABS statistics](https://www.abs.gov.au/statistics) | Aggregate geography and demographic context |
| ABS Data by Region | [ABS Data by Region](https://www.abs.gov.au/statistics/people/people-and-communities/regional-statistics/latest-release) | Regional segmentation context |
| Google Trends | [Google Trends](https://trends.google.com/trends/) | Automotive search-interest context |
| Australian government open data | [data.gov.au](https://data.gov.au/data) | Public datasets discovery |
| Microsoft experiment platform research | [Online controlled experiments at scale](https://www.microsoft.com/en-us/research/publication/online-controlled-experiments-at-large-scale/) | Experimentation methodology |
| Google controlled-experiment research | [Google research publication](https://research.google/pubs/pub36500/) | Experiment validity and interpretation |
| statsmodels | [statsmodels documentation](https://www.statsmodels.org/stable/index.html) | Power and statistical testing implementation |

## Core data strategy

Use official GA4 samples to understand event structures. Use public Australian sources for external market context. Use synthetic event, CRM, media, dealer, vehicle and experiment data for the core fictional automotive business model.

## Dataset documentation requirement

Every imported source must record source URL, licence/terms, download date, refresh cadence, intended use, fields used, privacy review and attribution requirement.
