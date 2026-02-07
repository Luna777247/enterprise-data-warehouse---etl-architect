with diff as (
  (select * from {{ ref('dim_customers') }}
   except select * from {{ ref('etl_dim_customers') }})
  union all
  (select * from {{ ref('etl_dim_customers') }}
   except select * from {{ ref('dim_customers') }})
)
select * from diff
