
  
    
    

    create  table
      "warehouse"."analytics"."dim_date__dbt_tmp"
  
    as (
      with distinct_dates as (
  select distinct sale_date
  from "warehouse"."analytics"."stg_sales"
)

select
  cast(replace(cast(sale_date as varchar), '-', '') as int) as date_key,
  sale_date,
  extract(year from sale_date) as year,
  extract(month from sale_date) as month,
  extract(day from sale_date) as day,
  extract(week from sale_date) as week_of_year
from distinct_dates
    );
  
  