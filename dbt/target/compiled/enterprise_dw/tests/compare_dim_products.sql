with diff as (
  (select * from "warehouse"."analytics"."dim_products"
   except select * from "warehouse"."analytics_analytics"."etl_dim_products")
  union all
  (select * from "warehouse"."analytics_analytics"."etl_dim_products"
   except select * from "warehouse"."analytics"."dim_products")
)
select * from diff