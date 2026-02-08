## Tong quan

Du an mo phong quy trinh ETL + dbt cho kho du lieu doanh nghiep, kem ung dung
giao dien de quan sat pipeline, schema va so lieu mau.

## Thanh phan chinh

- UI dashboard (Vite + React) trong thu muc root.
- ETL script trong [etl/](etl/).
- Du an dbt trong [dbt/](dbt/).
- Du lieu mau va ket qua ETL trong [dbt/seeds/](dbt/seeds/).

## Chay giao dien

**Yeu cau:** Node.js

1. Cai dependencies:

```
npm install
```

2. Dat `GEMINI_API_KEY` trong [/.env.local](.env.local).

3. Chay app:

```
npm run dev
```

## ETL + dbt

Chay ETL va tao lai output:

```
python etl/etl_pipeline.py
```

Seed DuckDB, chay models, tests va snapshots:

```
cd dbt
dbt seed
dbt build
dbt snapshot
```

## Hieu ket qua comparison tests

Tests trong [dbt/tests/](dbt/tests/) so sanh output cua dbt voi seed ETL:

- Pass: dbt model trung khop hoan toan voi output ETL.
- Fail: tra ve cac dong lech (thieu hoac du).
- De dieu tra, chay test loi va xem ket qua de tim cot/gia tri khac nhau.

## Artifact dbt bi bo qua

dbt artifacts duoc bo qua trong git: `dbt/target/`, `dbt/logs/`,
`dbt/warehouse.duckdb`. Can tao lai thi chay:

```
cd dbt
dbt seed
dbt build
dbt snapshot
```
