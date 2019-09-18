/*!
 * By:
 * Martin Borg
 */

import { Response } from 'express';
import { AuthInfoRequest } from '../@Interfaces/ExpressRequest';
import { db } from '../db/database';
import { responses } from '../methods/responses';

function randomizePrice(min = 10.10, max = 10000.10) {
  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'test') {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
  }

  return 15.5;
}

const Stocks = {
  /**
   * Sends an error response
   * @param res express.Response
   */
  sendError: function(
    res: Response, source: string, title: string, details: string, status: number
  ) {
    /* istanbul ignore next */
    return res.status(status).json(
      responses.getErrorMessage(source, title, details, status)
    );
  },

  /**
   * Gets all current stocks from the database.
   * @param res express.Response
   */
  getAllStocks: function (res: Response, noRes = false) {
    db.all('SELECT * FROM items',
      (err, rows) => {
        if (err) {
          return Stocks
            .sendError(res, '/stocks', 'Database error.', err.message, 500);
        }

        if (rows === undefined) {
          return Stocks
            .sendError(res, '/stocks', 'User not found.', 'User with provided email not found.', 401);
        }

        const items = rows;

        if (noRes) {
          return items;
        }

        return res.status(200).json({
          items
        });
      });
  },

  /**
   * Gets the price history of all stocks.
   * @param res express.Response
   */
  getAllHistory: function(res: Response) {
    db.all(`SELECT * FROM price_log WHERE when_time BETWEEN datetime('now', '-6 days') AND datetime('now', 'localtime')`,
    (err, rows) => {
      if (err) {
        return Stocks
        .sendError(res, '/history/stocks', 'Database error.', err.message, 500);
      }

      if (rows === undefined) {
        Stocks
          .sendError(res, '/history/stocks', 'No price log found.', 'No detected price changes in the given week', 401);
      }

      const data = rows;

      return res.status(200).json({
        data
      });
    });
  },

  /**
   * Updates all stock prices
   * @param res express.Response
   * @param req AuthInfoRequest (extended express.req)
   */
  updateAllStockPrices: function (res: Response, _req: AuthInfoRequest) {
    db.all('SELECT * FROM items',
      (err, rows) => {
        if (err) {
          return Stocks
            .sendError(res, '/stocks', 'Database error.', err.message, 500);
        }

        if (rows === undefined) {
          return Stocks
            .sendError(res, '/stocks', 'No stocks found.', 'Could not find any stocks', 401);
        }

        for (let index = 0; index < rows.length; index++) {
          const row = rows[index];

          row.price = randomizePrice();
          db.run('UPDATE items SET price = ? WHERE id = ?',
            row.price, row.id,
            (error: any, _updated: any) => {
              if (error) {
                return Stocks
                  .sendError(
                    res, '/stocks', 'Update Error.',
                    `Problem updating ${row.name}`, 500
                  );
              }
            }
          );
        }

        return res.status(202).json({
          message: 'Stocks sucsessfylly updated'
        });
      });
  },

  /**
   * Gets all personal user_stocks
   * @param res express.Response
   * @param req AuthInfoRequest (extended express.req)
   */
  getPersonalStocks: function(res: Response, req: AuthInfoRequest, noRes = false): any {
    const user = req.user || {};

    if (user === {} && process.env.NODE_ENV !== 'test') {
      return Stocks
        .sendError(
          res, '/sockets/:user', 'Token error',
          'Could not accsess the user-token in header: x-access-token.', 400
        );
    }

    const userId = req.user ? req.user.id : 1;

    db.all('SELECT * FROM user_stocks WHERE buyer_id = ?',
      userId, (err, rows) => {
        if (err) {
          return Stocks
            .sendError(res, '/sockets/:user', 'Database error.', err.message, 500);
        }

        if (rows === undefined) {
          return Stocks
            .sendError(res, '/stocks/:user', 'No stocks found.', 'Could not find any stocks', 401);
        }

        const data = rows;

        if (noRes) {
          return rows;
        }

        return res.status(200).json({
          data
        });
      });
  }
};

export { Stocks };
