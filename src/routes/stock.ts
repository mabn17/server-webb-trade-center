/*!
 * By:
 * Martin Borg
 */

import * as express from 'express';
import { AuthInfoRequest } from '../@Interfaces/ExpressRequest';
import { Stocks } from '../models/stocks';
import { Authentication } from '../models/authentication';

const stock: express.Router = express.Router();

stock.get('/stocks', (_req: AuthInfoRequest, res: express.Response, _next: express.NextFunction) =>
  Stocks.getAllStocks(res)
);

stock.get('/history/stocks', (_req: AuthInfoRequest, res: express.Response, _next: express.NextFunction) =>
  Stocks.getAllHistory(res)
);

stock.get('/stocks/user', (req: AuthInfoRequest, res: express.Response, next: express.NextFunction) =>
  Authentication.verify(req, res, next),
    (req: AuthInfoRequest, res: express.Response, _next: express.NextFunction) =>
      Stocks.getPersonalStocks(res, req)
);

stock.put('/stocks', (req: AuthInfoRequest, res: express.Response, _next: express.NextFunction) =>
  Stocks.updateAllStockPrices(res, req)
);

export { stock };
