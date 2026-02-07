with diff as (
  (select * from {{ ref('stg_sales') }}
   except select * from {{ ref('etl_stg_sales') }})
  union all
  (select * from {{ ref('etl_stg_sales') }}
   except select * from {{ ref('stg_sales') }})
)
select * from diff
