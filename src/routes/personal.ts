/*!
 * By:
 * Martin Borg
 */

import * as express from 'express';
import { AuthInfoRequest } from '../@Interfaces/ExpressRequest';
import { Stocks } from '../models/stocks';
import { Authentication } from '../models/authentication';
import { Personals } from '../models/personals';

const personal: express.Router = express.Router();

personal.post('/user/stocks/sell', (req: AuthInfoRequest, res: express.Response, next: express.NextFunction) =>
  Authentication.verify(req, res, next),
  (req: AuthInfoRequest, res: express.Response, next: express.NextFunction) =>
    Personals.sellPersonalStocks(res, req)
);

personal.post('/user/stocks/buy', (req: AuthInfoRequest, res: express.Response, next: express.NextFunction) =>
  Authentication.verify(req, res, next),
  (req: AuthInfoRequest, res: express.Response, next: express.NextFunction) =>
    Personals.buyPersonalStocks(res, req)
);

export { personal };
