/*!
 * By:
 * Martin Borg
 */

import * as express from 'express';
import { AuthInfoRequest } from '../@Interfaces/ExpressRequest';
import { Authentication } from '../models/Auth/Auth';

const authen = new Authentication();
const auth: express.Router = express.Router();

auth.post('/register',
  (req: AuthInfoRequest, res: express.Response, next: express.NextFunction) =>
    authen.register(res, req)
);

export { auth };
