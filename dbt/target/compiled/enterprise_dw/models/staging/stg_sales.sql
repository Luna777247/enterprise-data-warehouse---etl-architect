select
  cast(transaction_id as int) as transaction_id,
  cast(order_date as date) as sale_date,
  cast(cust_id as int) as cust_id,
  cast(prod_id as int) as prod_id,
  cast(quantity as int) as quantity,
  cast(revenue as numeric) as revenue
from "warehouse"."analytics_raw"."sales_transactions"