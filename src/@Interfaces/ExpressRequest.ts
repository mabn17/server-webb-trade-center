/*!
 * By:
 * Martin Borg
 */

import { Request } from 'express';

export interface AuthInfoRequest extends Request {
  user?: object | string;
}
