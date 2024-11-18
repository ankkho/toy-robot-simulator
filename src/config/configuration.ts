import process from 'node:process';
import { registerAs } from '@nestjs/config';

export type TableConfig = {
  maxCoordinates: {
    x: number;
    y: number;
  };
};

export type Config = {
  tableConfig: TableConfig;
};

export default registerAs(
  'configuration',
  (): Config => ({
    tableConfig: {
      maxCoordinates: {
        x: Number.parseInt(process.env.TABLE_MAX_X_COORDINATE ?? '5', 10),
        y: Number.parseInt(process.env.TABLE_MAX_Y_COORDINATE ?? '5', 10),
      },
    },
  }),
);
