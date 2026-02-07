{% snapshot etl_stg_sales_snapshot %}
{{
  config(
    target_schema='snapshots',
    unique_key='transaction_id',
    strategy='check',
    check_cols=['sale_date', 'cust_id', 'prod_id', 'quantity', 'revenue']
  )
}}

select *
from {{ ref('etl_stg_sales') }}

{% endsnapshot %}

{% snapshot etl_dim_customers_snapshot %}
{{
  config(
    target_schema='snapshots',
    unique_key='customer_key',
    strategy='check',
    check_cols=['cust_id', 'name', 'segment', 'region']
  )
}}

select *
from {{ ref('etl_dim_customers') }}

{% endsnapshot %}

{% snapshot etl_dim_products_snapshot %}
{{
  config(
    target_schema='snapshots',
    unique_key='product_key',
    strategy='check',
    check_cols=['prod_id', 'name', 'category', 'unit_price']
  )
}}

select *
from {{ ref('etl_dim_products') }}

{% endsnapshot %}

{% snapshot etl_dim_date_snapshot %}
{{
  config(
    target_schema='snapshots',
    unique_key='date_key',
    strategy='check',
    check_cols=['sale_date', 'year', 'month', 'day', 'week_of_year']
  )
}}

select *
from {{ ref('etl_dim_date') }}

{% endsnapshot %}

{% snapshot etl_fct_sales_snapshot %}
{{
  config(
    target_schema='snapshots',
    unique_key='sales_key',
    strategy='check',
    check_cols=['date_key', 'customer_key', 'product_key', 'quantity', 'total_amount']
  )
}}

select *
from {{ ref('etl_fct_sales') }}

{% endsnapshot %}
