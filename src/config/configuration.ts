import { registerAs } from '@nestjs/config';

export type TableConfig = {
  maxCoordinates: {
    x: number;
    y: number;
  };
};

export type Config = {
  nodeEnv: string;
  tableConfig: TableConfig;
};

export default registerAs(
  'configuration',
  (): Config => ({
    nodeEnv: process.env.NODE_ENV ?? 'development',
    tableConfig: {
      maxCoordinates: {
        x: Number.parseInt(process?.env.TABLE_MAX_X_COORDINATE ?? '5', 10),
        y: Number.parseInt(process?.env.TABLE_MAX_Y_COORDINATE ?? '5', 10),
      },
    },
  }),
);
