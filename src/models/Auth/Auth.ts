/*!
 * By:
 * Martin Borg
 */

import { Response, NextFunction } from 'express';
import { AuthInfoRequest } from '../../@Interfaces/ExpressRequest';

import { hash, compare } from 'bcrypt';
import { verify, sign } from 'jsonwebtoken';

import { db } from '../../db/database';
import { responses } from '../../methods/responses';

export class Authentication {
  private readonly HASH_NR: number = 10;

  private returnError(
    source: string, title: string,
    detail: string, status: number,
    res: Response
  ) {
    return res.status(status)
      .json(responses.getErrorMessage(source, title, detail, status));
  }

  public register(res: Response, req: AuthInfoRequest) {
    const that = this;
    const { email, pass } = req.body;

    if (!responses.checkValues([email, pass])) {
      return this.returnError(
        '/register', 'Missing values.',
        'Email or password missing in request.', 401, res
      );
    }

    hash(pass, this.HASH_NR, function(err, encrypted) {
      if (err) {
        return that.returnError(
          '/register', 'bcrypt error.',
          'Error encrypting the given password.',
          500, res
        );
      }

      db.run('INSERT INTO users (email, password) VALUES (?, ?)',
        email, encrypted, (err: any) => {
          if (err) {
            return that.returnError(
              '/register', 'Database error.', err.message, 500, res
            );
          }
          return res.status(201).json({
            data: { message: 'User successfully registered.' }
          });
        });
    });
  }
}
