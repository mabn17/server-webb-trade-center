/*!
 * By:
 * Martin Borg
 */

import { Request } from 'express';
import { VerifyCallback } from 'jsonwebtoken';
import * as ioServer from 'socket.io';

export interface UserToken {
  id?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  assets?: number;
};

export interface AuthInfoRequest extends Request {
  user?: {
    id?: number,
    email?: string,
    first_name?: string,
    last_name?: string,
    assets?: number
  };
  io?: ioServer.Server;
}

export interface Veryfied extends VerifyCallback {
  decoded?: UserToken;
}
