with diff as (
  (select * from {{ ref('dim_date') }}
   except select * from {{ ref('etl_dim_date') }})
  union all
  (select * from {{ ref('etl_dim_date') }}
   except select * from {{ ref('dim_date') }})
)
select * from diff
