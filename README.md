<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/18fqEV98cG6zqvpTN60T5oRazN8uIXjtH

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## ETL + dbt Commands

Run the ETL pipeline and regenerate outputs:

```
python etl/etl_pipeline.py
```

Seed DuckDB, run models, tests, and snapshots:

```
cd dbt
dbt seed
dbt build
dbt snapshot
```

## How to Interpret the Comparison Tests

The comparison tests in [dbt/tests/](dbt/tests/) validate that dbt models match
the ETL output seeds exactly:

- If a comparison test passes, the dbt model and the ETL output are identical.
- If a comparison test fails, it returns the differing rows (either missing or extra).
- To investigate, run the failing test and inspect the result set to see which
   columns or values diverge between the model and the ETL output.

## Ignored dbt Artifacts

Generated dbt artifacts are ignored in git (`dbt/target/`, `dbt/logs/`, and
`dbt/warehouse.duckdb`). To regenerate them, run:

```
cd dbt
dbt seed
dbt build
dbt snapshot
```
