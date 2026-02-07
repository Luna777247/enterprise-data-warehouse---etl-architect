with sales as (
  select * from {{ ref('stg_sales') }}
),
dim_customers as (
  select * from {{ ref('dim_customers') }}
),
dim_products as (
  select * from {{ ref('dim_products') }}
),
dim_date as (
  select * from {{ ref('dim_date') }}
)

select
  row_number() over (order by sales.transaction_id) as sales_key,
  dim_date.date_key,
  dim_customers.customer_key,
  dim_products.product_key,
  sales.quantity,
  sales.revenue as total_amount
from sales
left join dim_date
  on dim_date.sale_date = sales.sale_date
left join dim_customers
  on dim_customers.cust_id = sales.cust_id
left join dim_products
  on dim_products.prod_id = sales.prod_id
