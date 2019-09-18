/*!
 * By:
 * Martin Borg
 */

import { Response } from 'express';
import { AuthInfoRequest } from '../@Interfaces/ExpressRequest';
import { db } from '../db/database';
import { responses } from '../methods/responses';
import { Stocks } from './stocks';

function get(sql: string, params = []): any {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

const Personals = {
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
   * Sells stocks and update user assets.
   * @param res express.Response
   * @param req AuthInfoRequest (extended express.req)
   */
  sellPersonalStocks: function(res: Response, req: AuthInfoRequest) {
    let { stockToSell, amountToSell } = req.body;
    amountToSell = parseInt(amountToSell);
    const user = req.user || {};

    if (user === {} && process.env.NODE_ENV !== 'test') {
      return Personals
        .sendError(
          res, '/user/stocks/sell', 'Token error',
          'Could not accsess the user-token in header: x-access-token.', 400
        );
    }

    if (!stockToSell || !amountToSell) {
      return Personals
        .sendError(
          res, '/user/stocks/sell', 'Parameter error',
          'There are missing parameters in your request', 404
        );
    }

    const userId = req.user ? req.user.id : 1;

    db.get('SELECT * FROM user_stocks WHERE buyer_id = ? AND item_name = ? AND amount >= ?',
      userId, stockToSell, amountToSell,
      (err: any, row: any) => {
        if (err) {
          return Personals
           .sendError(res, '/user/stock/sell', 'Database error.', err.message, 500);
        }

        if (row === undefined) {
          return Stocks
           .sendError(res, '/user/stock/sell', 'Not found', 'Could not find any matches', 404);
        }

        const newAmount = row.amount - amountToSell;

        db.run('UPDATE user_stocks SET amount = ? WHERE buyer_id = ? AND item_name = ?',
          newAmount, userId, stockToSell,
          (error: any) => {
            if (error) {
              return Stocks
                .sendError(res, '/user/stock/sell', 'Update failed', error.message, 500);
            }

            return res.status(200).json({
              data: {
                message: 'Stocks sucsessfully sold'
              }
            });
          });
      });
  },

  /**
   * Buys stocks and update user assets.
   * @param res express.Response
   * @param req AuthInfoRequest (extended express.req)
   */
  buyPersonalStocks: function (res: Response, req: AuthInfoRequest) {
    let { stockToBuy, amountToBuy } = req.body;
    amountToBuy = parseInt(amountToBuy);
    const user = req.user || {};

    if (user === {} && process.env.NODE_ENV !== 'test') {
      return Personals
        .sendError(
          res, '/user/stocks/sell', 'Token error',
          'Could not accsess the user-token in header: x-access-token.', 400
        );
    }

    if (!stockToBuy || !amountToBuy) {
      return Personals
        .sendError(
          res, '/user/stocks/sell', 'Parameter error',
          'There are missing parameters in your request', 404
        );
    }

    const userId = req.user ? req.user.id : 1;

    db.get('SELECT assets FROM users WHERE id = ?',
      userId, async (err, row) => {
        if (err) {
          return Personals
           .sendError(res, '/user/stock/buy', 'Database error.', err.message, 500);
        }

        if (row === undefined) {
          return Personals
           .sendError(res, '/user/stock/buy', 'Not found', 'Could not find any matches', 404);
        }

        const item = await get('SELECT * FROM items WHERE name = ?', stockToBuy);
        const user_stocks = await get('SELECT * FROM user_stocks WHERE item_name = ? AND buyer_id = ?', [stockToBuy, userId]);
        if (!item) {
          return Personals
            .sendError(
              res, '/user/stocks/buy', 'Value Error',
              `${stockToBuy} is not a valid item`
              , 400
            );
        }

        if (row.assets < (amountToBuy * item.price)) {
          return Personals
            .sendError(
              res, '/user/stocks/buy', 'Value Error',
              `Not enought assets to buy items for (you have: ${row.assets} it costs ${(amountToBuy * item.price)}).`
              , 400
            );
        }

        const nr_of_items = user_stocks ? user_stocks.amount : 0;
        const newAmount = (nr_of_items + amountToBuy);
        const oldPrice = item.price;

        db.run(`INSERT INTO user_stocks(item_name, amount, buyer_id, buy_in_price)
          VALUES(?, ?, ?, ?) ON CONFLICT(item_name, buyer_id) DO UPDATE SET
          amount=?, buy_in_price=?`, stockToBuy, newAmount, userId, oldPrice, newAmount, oldPrice,
          (err: any, finniszhed) => {
            if (err) {
              return Personals
                .sendError(res, '/user/stock/buy', 'Database error.', err.message, 500);
            }

            return res.status(201).json({
              message: 'ALL IS WORKED, did exist'
            });
          });
      });
  }
};

export { Personals };
