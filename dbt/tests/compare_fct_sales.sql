with diff as (
  (select * from {{ ref('fct_sales') }}
   except select * from {{ ref('etl_fct_sales') }})
  union all
  (select * from {{ ref('etl_fct_sales') }}
   except select * from {{ ref('fct_sales') }})
)
select * from diff
