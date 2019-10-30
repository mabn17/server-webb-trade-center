/*!
 * By:
 * Martin Borg
 */

import { Response } from 'express';
import { AuthInfoRequest } from '../@Interfaces/ExpressRequest';
import { Database, randomizePrice, sendError } from './db/queries';

function genRand(min: number, max: number, decimalPlaces: number) {
  const rand = Math.random() * (max - min) + min;
  const power = Math.pow(10, decimalPlaces);
  return Math.floor(rand * power) / power;
}

const Stocks = {
  /**
   * Gets all current stocks from the database.
   * @param res express.Response
   */
  getAllStocks: function (res: Response, noRes = false) {
    const DataB = new Database();

    DataB.all('SELECT * FROM items', []).then((items: any) => {
      if (items === undefined) {
        return sendError(res, '/stocks', 'User not found.', 'User with provided email not found.', 401);
      } else if (noRes) {
        return items;
      }
      return res.status(200).json({ items });
    }).catch((err: any) => sendError(res, '/stocks', 'Database error.', err.message, 500));
  },

  /**
   * Gets the price history of all stocks.
   * @param res express.Response
   */
  getAllHistory: function(res: Response) {
    const DataB = new Database();
    const sql = `
      SELECT
      A.id AS id,
      A.item_name AS item_name,
      A.when_time AS when_time,
      A.old_price AS old_price,
      B.price AS price
      FROM price_log AS A
      INNER JOIN items AS B ON A.item_name = B.name
      WHERE when_time
      BETWEEN datetime('now', '-6 days') AND
      datetime('now', 'localtime') ORDER BY id DESC LIMIT 350`;

    DataB.all(sql, []).then((data: any) => {
      if (data === undefined) {
        return sendError(res, '/history/stocks', 'No price log found.', 'No detected price changes in the given week', 401);
      }

      return res.status(200).json({ data });
    }).catch((err: any) => sendError(res, '/history/stocks', 'Database error.', err.message, 500));
  },

  /**
   * Updates all stock prices
   * @param res express.Response
   * @param req AuthInfoRequest (extended express.req)
   */
  updateAllStockPrices: async function (res: Response, req: AuthInfoRequest) {
    const DataB = new Database();

    DataB.all('SELECT * FROM items', []).then(async (rows: any) => {
      if (rows === undefined) {
        return sendError(res, '/stocks', 'No stocks found.', 'Could not find any stocks', 401);
      }

      for (let index = 0; index < rows.length; index++) {
        const row = rows[index];

        const price = genRand(0.1, 0.5, 2);

        if (process.env.NODE_ENV === 'test') {
          row.price = 15.5;
        } else if (Math.random() < 0.5 && row.price > price) {
          row.price -= price;
        } else {
          row.price += price;
        }

        // row.price = randomizePrice();
        await DataB.run('UPDATE items SET price = ? WHERE id = ?', [ row.price.toFixed(2), row.id ]);
      }

      return res.status(202).json({
        message: 'Stocks sucsessfylly updated'
      });
    }).catch((err: any) => sendError(res, '/stocks', 'Database error.', err.message, 500));
  },

  /**
   * Gets all personal user_stocks
   * @param res express.Response
   * @param req AuthInfoRequest (extended express.req)
   */
  getPersonalStocks: function(res: Response, req: AuthInfoRequest, noRes = false): any {
    const DataB = new Database();
    const user = req.user || {};

    if (user === {} && process.env.NODE_ENV !== 'test') {
      return sendError(
          res, '/sockets/:user', 'Token error',
          'Could not accsess the user-token in header: x-access-token.', 400
        );
    }

    const userId = req.user ? req.user.id : 1;
    const sql = `
      SELECT
        A.id AS id,
        A.item_name AS item_name,
        A.amount AS amount,
        A.buyer_id AS buyer_id,
        A.buy_in_price AS buy_in_price,
        A.buy_in_date AS buy_in_date,
        B.price AS price
      FROM user_stocks AS A
        INNER JOIN items AS B
      ON
        A.item_name = B.name
      WHERE
        A.buyer_id = ?
          AND
        A.amount > 0
    `;
    DataB.all(sql, [ userId ]).then((data: any) => {
      if (data === undefined) {
        return sendError(res, '/stocks/:user', 'No stocks found.', 'Could not find any stocks', 401);
      } else if (noRes) {
        return data;
      }

      res.status(200).json({
        data
      });
    }).catch((err: any) => sendError(res, '/sockets/:user', 'Database error.', err.message, 500));
  }

  // cronJob: async function() {
  //   const DataB = new Database();

  //   DataB.all('SELECT * FROM items', []).then(async (rows: any) => {
  //     for (let index = 0; index < rows.length; index++) {
        // const row = rows[index];
        // const price = genRand(0.1, 0.5, 2);

        // if (Math.random() < 0.5 && row.price > price) {
        //   row.price -= price;
        // } else {
        //   row.price += price;
        // }

  //       await DataB.run('UPDATE items SET price = ? WHERE id = ?', [ row.price.toFixed(2), row.id ]);
  //     }
  //   });
  // }
};

export { Stocks };
