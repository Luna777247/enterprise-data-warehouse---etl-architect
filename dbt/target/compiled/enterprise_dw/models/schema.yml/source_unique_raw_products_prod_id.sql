
    
    

select
    prod_id as unique_field,
    count(*) as n_records

from "warehouse"."analytics_raw"."products"
where prod_id is not null
group by prod_id
having count(*) > 1


