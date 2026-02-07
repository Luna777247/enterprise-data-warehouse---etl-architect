select
  row_number() over (order by cust_id) as customer_key,
  cast(cust_id as int) as cust_id,
  cast(name as varchar) as name,
  cast(segment as varchar) as segment,
  cast(region as varchar) as region
from {{ source('raw', 'customers') }}
