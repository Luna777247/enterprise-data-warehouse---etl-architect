with diff as (
  (select * from "warehouse"."analytics"."dim_customers"
   except select * from "warehouse"."analytics_analytics"."etl_dim_customers")
  union all
  (select * from "warehouse"."analytics_analytics"."etl_dim_customers"
   except select * from "warehouse"."analytics"."dim_customers")
)
select * from diff