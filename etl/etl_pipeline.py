from __future__ import annotations

import csv
import json
from dataclasses import dataclass
from datetime import date, datetime
from pathlib import Path
from typing import Dict, Iterable, List

BASE_DIR = Path(__file__).resolve().parent
INPUT_DIR = BASE_DIR / "input"
OUTPUT_DIR = BASE_DIR / "output"


@dataclass(frozen=True)
class SalesRow:
    transaction_id: int
    sale_date: date
    cust_id: int
    prod_id: int
    quantity: int
    revenue: float


def read_csv_rows(path: Path) -> List[Dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        return list(reader)


def write_csv(path: Path, fieldnames: Iterable[str], rows: Iterable[Dict[str, object]]) -> None:
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


def load_customers(path: Path) -> List[Dict[str, object]]:
    with path.open(encoding="utf-8") as handle:
        payload = json.load(handle)
    return list(payload)


def parse_sales(rows: List[Dict[str, str]]) -> List[SalesRow]:
    parsed: List[SalesRow] = []
    for row in rows:
        parsed.append(
            SalesRow(
                transaction_id=int(row["transaction_id"]),
                sale_date=datetime.strptime(row["order_date"], "%Y-%m-%d").date(),
                cust_id=int(row["cust_id"]),
                prod_id=int(row["prod_id"]),
                quantity=int(row["quantity"]),
                revenue=float(row["revenue"]),
            )
        )
    return parsed


def build_dims(
    sales: List[SalesRow],
    customers: List[Dict[str, object]],
    products: List[Dict[str, str]],
) -> Dict[str, List[Dict[str, object]]]:
    dim_customers = []
    customer_key_map: Dict[int, int] = {}
    for idx, cust in enumerate(sorted(customers, key=lambda c: int(c["cust_id"]))):
        customer_key = idx + 1
        cust_id = int(cust["cust_id"])
        customer_key_map[cust_id] = customer_key
        dim_customers.append(
            {
                "customer_key": customer_key,
                "cust_id": cust_id,
                "name": cust["name"],
                "segment": cust["segment"],
                "region": cust["region"],
            }
        )

    dim_products = []
    product_key_map: Dict[int, int] = {}
    for idx, prod in enumerate(sorted(products, key=lambda p: int(p["prod_id"]))):
        product_key = idx + 1
        prod_id = int(prod["prod_id"])
        unit_price = float(prod["unit_price"])
        product_key_map[prod_id] = product_key
        dim_products.append(
            {
                "product_key": product_key,
                "prod_id": prod_id,
                "name": prod["name"],
                "category": prod["category"],
                "unit_price": f"{unit_price:.2f}",
            }
        )

    unique_dates = sorted({row.sale_date for row in sales})
    dim_date = []
    date_key_map: Dict[date, int] = {}
    for sale_date in unique_dates:
        date_key = int(sale_date.strftime("%Y%m%d"))
        date_key_map[sale_date] = date_key
        iso_week = sale_date.isocalendar().week
        dim_date.append(
            {
                "date_key": date_key,
                "sale_date": sale_date.isoformat(),
                "year": sale_date.year,
                "month": sale_date.month,
                "day": sale_date.day,
                "week_of_year": iso_week,
            }
        )

    return {
        "dim_customers": dim_customers,
        "dim_products": dim_products,
        "dim_date": dim_date,
        "customer_key_map": customer_key_map,
        "product_key_map": product_key_map,
        "date_key_map": date_key_map,
    }


def build_fact_sales(
    sales: List[SalesRow],
    customer_key_map: Dict[int, int],
    product_key_map: Dict[int, int],
    date_key_map: Dict[date, int],
) -> List[Dict[str, object]]:
    fact_rows = []
    for idx, row in enumerate(sorted(sales, key=lambda s: s.transaction_id)):
        fact_rows.append(
            {
                "sales_key": idx + 1,
                "date_key": date_key_map[row.sale_date],
                "customer_key": customer_key_map[row.cust_id],
                "product_key": product_key_map[row.prod_id],
                "quantity": row.quantity,
                "total_amount": f"{row.revenue:.2f}",
            }
        )
    return fact_rows


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    raw_sales_rows = read_csv_rows(INPUT_DIR / "raw_sales.csv")
    raw_products = read_csv_rows(INPUT_DIR / "products.csv")
    raw_customers = load_customers(INPUT_DIR / "customers_api.json")

    stg_sales = parse_sales(raw_sales_rows)
    dims = build_dims(stg_sales, raw_customers, raw_products)
    fact_sales = build_fact_sales(
        stg_sales,
        dims["customer_key_map"],
        dims["product_key_map"],
        dims["date_key_map"],
    )

    write_csv(
        OUTPUT_DIR / "stg_sales.csv",
        ["transaction_id", "sale_date", "cust_id", "prod_id", "quantity", "revenue"],
        [
            {
                "transaction_id": row.transaction_id,
                "sale_date": row.sale_date.isoformat(),
                "cust_id": row.cust_id,
                "prod_id": row.prod_id,
                "quantity": row.quantity,
                "revenue": f"{row.revenue:.2f}",
            }
            for row in stg_sales
        ],
    )

    write_csv(
        OUTPUT_DIR / "dim_customers.csv",
        ["customer_key", "cust_id", "name", "segment", "region"],
        dims["dim_customers"],
    )

    write_csv(
        OUTPUT_DIR / "dim_products.csv",
        ["product_key", "prod_id", "name", "category", "unit_price"],
        dims["dim_products"],
    )

    write_csv(
        OUTPUT_DIR / "dim_date.csv",
        ["date_key", "sale_date", "year", "month", "day", "week_of_year"],
        dims["dim_date"],
    )

    write_csv(
        OUTPUT_DIR / "fct_sales.csv",
        ["sales_key", "date_key", "customer_key", "product_key", "quantity", "total_amount"],
        fact_sales,
    )


if __name__ == "__main__":
    main()
