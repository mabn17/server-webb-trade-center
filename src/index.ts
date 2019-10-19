/*!
 * By:
 * Martin Borg
 */

import * as express from 'express';
import './lib/env';
import { app } from './app';
import { Router } from 'express';
import { SocketServer } from './setup';
import * as http from 'http';
import { responses } from './methods/responses';
import { Stocks } from './models/stocks';

const mode = process.env.NODE_ENV || 'dev';
const port: string = process.env.PORT || '8080';
const server: http.Server = http.createServer(app);

console.log('Now running', process.env.NODE_ENV, 'mode.');

const build = new SocketServer(server, mode, port).init();

app.set('socketio', build);
module.exports = build;

app.use('/', Router().get('/update', (req, res, _next) => {
  setTimeout(() => {
    req.app.get('socketio').emit('stock update', 'updated from server');
  }, 1000);

  return Stocks.updateAllStockPrices(res, req);
}));

/**
 * |--------------------------------------------------
 * | GET /*
 * | Response for non recognized routes
 * | @retuns statusCode 404
 * |--------------------------------------------------
 */

app.all(
  '/**',
  (
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    res
      .status(404)
      .json(
        responses.getErrorMessage(req.url, 'Unknown route.', `Route '${req.url}' does not exists.`, 404)
      );
  }
);
