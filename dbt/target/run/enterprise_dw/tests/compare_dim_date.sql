
    select
      count(*) as failures,
      count(*) != 0 as should_warn,
      count(*) != 0 as should_error
    from (
      
        select *
        from "warehouse"."analytics_dbt_test__audit"."compare_dim_date"
    
      
    ) dbt_internal_test