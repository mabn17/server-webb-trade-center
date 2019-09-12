/*!
 * By:
 * Martin Borg
 */

import * as express from 'express';
import { AuthInfoRequest } from '../@Interfaces/ExpressRequest';
import { Stocks } from '../models/stocks';

const stock: express.Router = express.Router();

stock.get('/stocks', (_req: AuthInfoRequest, res: express.Response, _next: express.NextFunction) =>
    Stocks.getAllStocks(res)
);

stock.get('/stocks/test', (req: AuthInfoRequest, res: express.Response, _next: express.NextFunction) =>
    Stocks.updateAllStockPrices(res, req)
);

export { stock };
