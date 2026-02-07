
import { Table, DbtModel, KPIData } from './types';

export const RAW_SALES_DATA: Table = {
  id: 'raw_sales',
  name: 'raw_sales_transactions',
  type: 'raw',
  columns: [
    { name: 'id', type: 'INT', isPK: true, description: 'Internal transaction ID', stats: { nullPercentage: 0, distinctCount: 1000 } },
    { name: 'order_date', type: 'TIMESTAMP', description: 'Raw timestamp of order', stats: { nullPercentage: 0, distinctCount: 950 } },
    { name: 'cust_id', type: 'INT', description: 'Customer reference', stats: { nullPercentage: 2, distinctCount: 200 } },
    { name: 'prod_id', type: 'INT', description: 'Product reference', stats: { nullPercentage: 0, distinctCount: 50 } },
    { name: 'quantity', type: 'INT', description: 'Amount sold', stats: { nullPercentage: 5, distinctCount: 15 } },
    { name: 'revenue', type: 'DECIMAL', description: 'Total revenue before tax', stats: { nullPercentage: 1, distinctCount: 800 } }
  ],
  rows: Array.from({ length: 50 }, (_, i) => ({
    id: 1000 + i,
    order_date: `2023-11-${(i % 30) + 1} 14:20:01`,
    cust_id: 10 + (i % 5),
    prod_id: 200 + (i % 3),
    quantity: Math.floor(Math.random() * 10) + 1,
    revenue: (Math.random() * 500 + 50).toFixed(2)
  }))
};

export const DIM_PRODUCTS: Table = {
  id: 'dim_products',
  name: 'dim_products',
  type: 'dimension',
  columns: [
    { name: 'prod_key', type: 'INT', isPK: true, description: 'Surrogate Key', stats: { nullPercentage: 0, distinctCount: 3 } },
    { name: 'prod_id', type: 'INT', description: 'Source System ID', stats: { nullPercentage: 0, distinctCount: 3 } },
    { name: 'name', type: 'STRING', description: 'Product Marketing Name', stats: { nullPercentage: 0, distinctCount: 3 } },
    { name: 'category', type: 'STRING', description: 'High-level Category', stats: { nullPercentage: 0, distinctCount: 2 } },
    { name: 'unit_price', type: 'DECIMAL', description: 'Base Price', stats: { nullPercentage: 0, distinctCount: 3 } }
  ],
  rows: [
    { prod_key: 1, prod_id: 200, name: 'Enterprise Cloud Pro', category: 'SaaS', unit_price: 299.00 },
    { prod_key: 2, prod_id: 201, name: 'Data Connector XL', category: 'Tooling', unit_price: 150.00 },
    { prod_key: 3, prod_id: 202, name: 'Support Premium', category: 'Service', unit_price: 99.00 }
  ]
};

export const FACT_SALES: Table = {
  id: 'fact_sales',
  name: 'fct_sales',
  type: 'fact',
  columns: [
    { name: 'sales_key', type: 'INT', isPK: true, description: 'Fact Primary Key', stats: { nullPercentage: 0, distinctCount: 5000 } },
    { name: 'date_key', type: 'INT', isFK: true, ref: 'dim_date', description: 'Foreign Key to Date', stats: { nullPercentage: 0, distinctCount: 365 } },
    { name: 'customer_key', type: 'INT', isFK: true, ref: 'dim_customers', description: 'Foreign Key to Customer', stats: { nullPercentage: 0, distinctCount: 200 } },
    { name: 'product_key', type: 'INT', isFK: true, ref: 'dim_products', description: 'Foreign Key to Product', stats: { nullPercentage: 0, distinctCount: 50 } },
    { name: 'quantity', type: 'INT', description: 'Measure: Total Items', stats: { nullPercentage: 0, distinctCount: 20 } },
    { name: 'total_amount', type: 'DECIMAL', description: 'Measure: Net Revenue', stats: { nullPercentage: 0, distinctCount: 4500 } }
  ],
  rows: Array.from({ length: 20 }, (_, i) => ({
    sales_key: 5000 + i,
    date_key: 20231101 + (i % 10),
    customer_key: 1 + (i % 5),
    product_key: 1 + (i % 3),
    quantity: 2,
    total_amount: 598.00
  }))
};

export const DBT_MODELS: DbtModel[] = [
  {
    name: 'stg_sales',
    description: 'Cleaning and casting raw sales transactions.',
    sql: `SELECT\n  id AS transaction_id,\n  CAST(order_date AS DATE) AS sale_date,\n  cust_id,\n  prod_id,\n  quantity,\n  revenue\nFROM {{ source('raw', 'sales_transactions') }}`,
    yml: `version: 2\nmodels:\n  - name: stg_sales\n    columns:\n      - name: transaction_id\n        tests:\n          - unique\n          - not_null`,
    tests: ['unique', 'not_null']
  },
  {
    name: 'fct_sales',
    description: 'Final fact table for consumption by BI tools.',
    sql: `WITH sales AS (\n  SELECT * FROM {{ ref('stg_sales') }}\n)\nSELECT\n  {{ dbt_utils.generate_surrogate_key(['transaction_id']) }} AS sales_key,\n  sale_date AS date_key,\n  cust_id AS customer_key,\n  prod_id AS product_key,\n  quantity,\n  revenue AS total_amount\nFROM sales`,
    yml: `version: 2\nmodels:\n  - name: fct_sales\n    tests:\n      - relationships: { field: customer_key, to: ref('dim_customers'), field: customer_key }`,
    tests: ['relationships', 'not_null']
  }
];

export const KPI_DATA: KPIData[] = [
  {
    name: 'Total Revenue',
    value: 1254300,
    change: 12.5,
    data: [
      { date: 'Oct', value: 900000 },
      { date: 'Nov', value: 1050000 },
      { date: 'Dec', value: 1254300 }
    ]
  },
  {
    name: 'Active Customers',
    value: 452,
    change: -2.1,
    data: [
      { date: 'Oct', value: 460 },
      { date: 'Nov', value: 458 },
      { date: 'Dec', value: 452 }
    ]
  },
  {
    name: 'Conversion Rate',
    value: 3.8,
    change: 0.5,
    data: [
      { date: 'Oct', value: 3.2 },
      { date: 'Nov', value: 3.5 },
      { date: 'Dec', value: 3.8 }
    ]
  }
];
