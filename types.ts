
export interface Column {
  name: string;
  type: string;
  isPK?: boolean;
  isFK?: boolean;
  ref?: string;
  description: string;
  stats?: {
    nullPercentage: number;
    distinctCount: number;
  };
}

export interface Table {
  id: string;
  name: string;
  type: 'fact' | 'dimension' | 'staging' | 'raw';
  columns: Column[];
  rows: any[];
}

export interface DbtModel {
  name: string;
  sql: string;
  yml: string;
  tests: string[];
  description: string;
}

export interface KPIData {
  name: string;
  value: number;
  change: number;
  data: { date: string; value: number }[];
}

export type ViewType = 'pipeline' | 'explorer' | 'schema' | 'analytics' | 'ai';

export interface PipelineLog {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
}
