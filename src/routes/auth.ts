/*!
 * By:
 * Martin Borg
 */

import * as express from 'express';
import { AuthInfoRequest } from '../@Interfaces/ExpressRequest';
import { authentication } from '../models/authentication';

const auth: express.Router = express.Router();

auth.post('/register', (req: AuthInfoRequest, res: express.Response, next: express.NextFunction) =>
  authentication.create(res, req)
);

auth.post('/login', (req: AuthInfoRequest, res: express.Response, next: express.NextFunction) =>
  authentication.login(res, req)
);

export { auth };
