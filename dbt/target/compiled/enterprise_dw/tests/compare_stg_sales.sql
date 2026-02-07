with diff as (
  (select * from "warehouse"."analytics"."stg_sales"
   except select * from "warehouse"."analytics_analytics"."etl_stg_sales")
  union all
  (select * from "warehouse"."analytics_analytics"."etl_stg_sales"
   except select * from "warehouse"."analytics"."stg_sales")
)
select * from diff