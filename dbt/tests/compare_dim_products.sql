with diff as (
  (select * from {{ ref('dim_products') }}
   except select * from {{ ref('etl_dim_products') }})
  union all
  (select * from {{ ref('etl_dim_products') }}
   except select * from {{ ref('dim_products') }})
)
select * from diff
