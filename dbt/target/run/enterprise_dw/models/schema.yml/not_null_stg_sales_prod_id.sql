
    select
      count(*) as failures,
      count(*) != 0 as should_warn,
      count(*) != 0 as should_error
    from (
      
    
  
    
    



select prod_id
from "warehouse"."analytics"."stg_sales"
where prod_id is null



  
  
      
    ) dbt_internal_test