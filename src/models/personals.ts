/*!
 * By:
 * Martin Borg
 */

import { Response } from 'express';
import { AuthInfoRequest } from '../@Interfaces/ExpressRequest';
import { Database, sendError } from './db/queries';

const Personals = {
  /**
   * Sells stocks and update user assets.
   * @param res express.Response
   * @param req AuthInfoRequest (extended express.req)
   */
  sellPersonalStocks: async function(res: Response, req: AuthInfoRequest) {
    const DataB = new Database();
    const user = req.user || {};

    let { stockToSell, amountToSell } = req.body;
    amountToSell = parseInt(amountToSell);

    if (user === {} && process.env.NODE_ENV !== 'test') {
      return sendError(res, '/user/stocks/sell', 'Token error',
          'Could not accsess the user-token in header: x-access-token.', 400
        );
    }

    if (!stockToSell || (!amountToSell || amountToSell <= 0)) {
      return sendError(
          res, '/user/stocks/sell', 'Parameter error',
          'There are missing parameters in your request', 404
        );
    }

    const userId = req.user ? req.user.id : 1;
    let sql = 'SELECT * FROM user_stocks WHERE buyer_id = ? AND item_name = ? AND amount >= ?';
    let params = [userId, stockToSell, amountToSell];

    DataB.get(sql, params).then((user_stocks: any) => {
      if (user_stocks === undefined) {
        return sendError(res, '/user/stock/sell', 'Not found', 'Could not find any matches', 404);
      }

      const newAmount = user_stocks.amount - amountToSell;
      DataB.run('UPDATE user_stocks SET amount = ? WHERE buyer_id = ? AND item_name = ?', [newAmount, userId, stockToSell])
        .then(() => res.status(200).json({ data: { message: 'Stocks sucsessfully sold' } }))
        .catch((err: any) => sendError(res, '/user/stock/sell', 'Update failed', err.message, 500));

    }).catch((err: any) => sendError(res, '/user/stock/sell', 'Update failed', err.message, 500));
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
      return sendError(res, '/user/stocks/sell', 'Token error',
          'Could not accsess the user-token in header: x-access-token.', 400
        );
    }

    if (!stockToBuy || (!amountToBuy || amountToBuy <= 0)) {
      return sendError(res, '/user/stocks/sell', 'Parameter error',
          'There are missing parameters in your request', 404
        );
    }

    const userId = req.user ? req.user.id : 1;
    const DataB = new Database();

    DataB.get('SELECT assets FROM users WHERE id = ?', [ userId ]).then(async (row: any) => {
      if (row === undefined) {
        return sendError(res, '/user/stock/buy', 'Not found', 'Could not find any matches', 404);
      }

      const item = await DataB.get('SELECT * FROM items WHERE name = ?', [ stockToBuy ]);
      const user_stocks = await DataB.get(
        'SELECT * FROM user_stocks WHERE item_name = ? AND buyer_id = ?', [stockToBuy, userId]
      );

      if (!item) {
        return sendError(res, '/user/stocks/buy', 'Value Error', `${stockToBuy} is not a valid item`, 400);
      }

      if (row.assets < (amountToBuy * item.price)) {
        return sendError(res, '/user/stocks/buy', 'Value Error',
            `Not enought assets to buy items for (you have: ${row.assets} it costs ${(amountToBuy * item.price)}).`, 400
          );
      }

      const nr_of_items = user_stocks ? user_stocks.amount : 0;
      const newAmount = (nr_of_items + amountToBuy);
      const oldPrice = item.price;
      const sql = `
        INSERT INTO user_stocks(item_name, amount, buyer_id, buy_in_price)
          VALUES(?, ?, ?, ?)
        ON CONFLICT(item_name, buyer_id) DO UPDATE
          SET amount=?, buy_in_price=?
      `;
      const params = [stockToBuy, newAmount, userId, oldPrice, newAmount, oldPrice];

      DataB.run(sql, params)
        .then(() => res.status(201).json({ message: 'Stocks has been updated.' }))
        .catch((err: any) => sendError(res, '/user/stock/buy', 'Database error.', err.message, 500));

    }).catch((err: any) => sendError(res, '/user/stock/buy', 'Database error.', err.message, 500));
  },

  getPersonalData: function(res: Response, req: AuthInfoRequest) {
    const user = req.user || {};

    if (user === {} && process.env.NODE_ENV !== 'test') {
      return sendError(res, '/user/stocks/sell', 'Token error',
          'Could not accsess the user-token in header: x-access-token.', 400
        );
    }

    const DataB = new Database();
    const userId = req.user ? req.user.id : 1;

    DataB.get('SELECT * FROM users WHERE id = ?', [ userId ])
      .then((user: any) => res.status(200).json({ data: user }))
      .catch((_err: any) => sendError(res, '/user/self', 'Auth Error', 'Could not find your user.', 401));
  },

  updatePersonalAmount: function(res: Response, req: AuthInfoRequest) {
    const user = req.user || {};
    const { newAmount } = req.body;

    if (user === {} && process.env.NODE_ENV !== 'test') {
      return sendError(res, '/user/update/assets', 'Token error',
          'Could not accsess the user-token in header: x-access-token.', 401
        );
    }

    if (!newAmount || isNaN(newAmount) || parseFloat(newAmount) <= 0) {
      return sendError(res, '/user/update/assets', 'Value error',
        'No new amount has been spesified', 400
      );
    }

    const DataB = new Database();
    const userId = user.id ? user.id : 1;

    DataB.run('UPDATE users SET assets = assets + ? WHERE id = ?', [ newAmount, userId ])
      .then(() => res.status(202).json({ data: 'Your new amount has been placed' }))
      .catch((err: any) => sendError(res, '/user/update/assets', 'Update error', err.message, 500));
  }
};

export { Personals };
