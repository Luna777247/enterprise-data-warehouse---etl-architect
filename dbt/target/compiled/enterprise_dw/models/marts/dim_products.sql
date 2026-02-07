select
  row_number() over (order by prod_id) as product_key,
  cast(prod_id as int) as prod_id,
  cast(name as varchar) as name,
  cast(category as varchar) as category,
  cast(unit_price as numeric) as unit_price
from "warehouse"."analytics_raw"."products"