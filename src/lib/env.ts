/*!
 * By:
 * Martin Borg
 */

import { resolve } from 'path';
import { config } from 'dotenv';

let path: string;

switch (process.env.NODE_ENV) {
  case 'test':
    path = '../../config/env/.env.test';
    break;
  case 'production':
    path = '../../config/env/.env.production';
    break;
  default:
    path = '../../config/env/.env.development';
}

config({ path: resolve(__dirname, path) });
