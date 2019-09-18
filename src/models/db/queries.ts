/*!
 * By:
 * Martin Borg
 */

import * as sqlite3 from 'sqlite3';
import { Response } from 'express';

import { db } from '../../db/database';
import { responses } from '../../methods/responses';

class Database {
  private db: sqlite3.Database;

  constructor() {
    this.db = db;
  }

  public getDB() {
    return this.db;
  }

  public get(sql: string, params: Array<any> = []): any {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  public all(sql: string, params: Array<any> = []): any {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  public run(sql: string, params: Array<any> = []): any {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

function randomizePrice(min = 10.10, max = 10000.10) {
  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'test') {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
  }

  return 15.5;
}

function sendError(
  res: Response, source: string, title: string, details: string, status: number
) {
  return res.status(status).json(
    responses.getErrorMessage(source, title, details, status)
  );
}

export { Database, randomizePrice, sendError };
