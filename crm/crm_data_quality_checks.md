# CRM Data Quality Checks

| Check | Rule | Severity |
|---|---|---|
| Lead hash missing | Web lead cannot join CRM | Critical |
| CRM lead delayed | Expected extract not received | Critical |
| Duplicate CRM key | One CRM ID maps unexpectedly | High |
| Invalid status | Status outside accepted set | High |
| Dealer missing | Lead requires dealer but lacks one | Medium |
| Qualification timestamp missing | Qualified status lacks timestamp | High |
| Match rate decline | Below agreed threshold | Critical |
| Outcome sequencing | Attendance without booking, order without valid path | High |
