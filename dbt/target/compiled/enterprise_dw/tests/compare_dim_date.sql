with diff as (
  (select * from "warehouse"."analytics"."dim_date"
   except select * from "warehouse"."analytics_analytics"."etl_dim_date")
  union all
  (select * from "warehouse"."analytics_analytics"."etl_dim_date"
   except select * from "warehouse"."analytics"."dim_date")
)
select * from diff