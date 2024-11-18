import process from 'node:process';
import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  tableConfig: {
    coordinates: {
      x: process.env.TABLE_MAX_X_COORDINATE,
      y: process.env.TABLE_MAX_Y_COORDINATE,
    },
  },
}));
