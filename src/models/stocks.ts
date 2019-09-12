/*!
 * By:
 * Martin Borg
 */

import { Response } from 'express';
import { AuthInfoRequest } from '../@Interfaces/ExpressRequest';
import { db } from '../db/database';
import { responses } from '../methods/responses';

function randomizePrice(min = 10.10, max = 10000.10) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

const Stocks = {
  /**
   * Sends an error response
   * @param res express.Response
   */
  sendError: function(
    res: Response, source: string, title: string, details: string, status: number
  ) {
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
            .sendError(res, '/login', 'Database error.', err.message, 500);
        }

        if (rows === undefined) {
          return Stocks
            .sendError(res, '/login', 'User not found.', 'User with provided email not found.', 401);
        }

        const data = rows;

        if (noRes) {
          return data;
        }

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
  updateAllStockPrices: function (res: Response, req: AuthInfoRequest) {
    db.all('SELECT * FROM items',
      (err, rows) => {
        if (err) {
          return Stocks
            .sendError(res, '/login', 'Database error.', err.message, 500);
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
            (error, _updated) => {
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

        return res.status(200).json({
          message: 'Stocks sucsessfylly updated'
        });
      });
  }
};

export { Stocks };