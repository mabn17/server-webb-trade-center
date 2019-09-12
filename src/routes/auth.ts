/*!
 * By:
 * Martin Borg
 */

import * as express from 'express';
import { AuthInfoRequest } from '../@Interfaces/ExpressRequest';
import { Authentication } from '../models/authentication';

const auth: express.Router = express.Router();

auth.post('/register', (req: AuthInfoRequest, res: express.Response, _next: express.NextFunction) =>
  Authentication.create(res, req)
);

auth.post('/login', (req: AuthInfoRequest, res: express.Response, _next: express.NextFunction) =>
  Authentication.login(res, req)
);

export { auth };
