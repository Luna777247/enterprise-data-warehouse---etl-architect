with diff as (
  (select * from "warehouse"."analytics"."fct_sales"
   except select * from "warehouse"."analytics_analytics"."etl_fct_sales")
  union all
  (select * from "warehouse"."analytics_analytics"."etl_fct_sales"
   except select * from "warehouse"."analytics"."fct_sales")
)
select * from diff