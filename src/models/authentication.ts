/*!
 * By:
 * Martin Borg
 */

import { Response, NextFunction } from 'express';
import { AuthInfoRequest } from '../@Interfaces/ExpressRequest';
import { hash, compare } from 'bcrypt';
import { db } from '../db/database';
import { responses } from '../methods/responses';
import { verify, sign } from 'jsonwebtoken';

const authentication = {
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
   * Creates a new user in the database.
   * @param res express.Response
   * @param req AuthInfoRequest (extended express.req)
   */
  create: function (res: Response, req: AuthInfoRequest) {
    const { email, password } = req.body;

    if (!responses.checkValues([email, password])) {
      return authentication
        .sendError(res, '/register', 'Missing values.', 'Email or password missing in request.', 401);
    }

    hash(password, 10, function(err, encrypted) {
      if (err) {
        return authentication
          .sendError(res, '/register', 'bcrypt error.', 'Error encrypting the given password.', 500);
      }
      db.run('INSERT INTO users (email, password) VALUES (?, ?)',
        email,
        encrypted, (err: any) => {
          if (err) {
            return authentication
              .sendError(res, '/register', 'Database error.', err.message, 500);
          }

          return res.status(201).json({
            data: {
                message: 'User successfully registered.'
            }
          });
      });
    });
  },

  /**
   * Logs the user in and returns a valid JTW token
   * @param res express.Response
   * @param req AuthInfoRequest (extended express.req)
   */
  login: function(res: Response, req: AuthInfoRequest) {
    const { email, password } = req.body;

    if (!responses.checkValues([email, password])) {
      return authentication
        .sendError(res, '/login', 'Missing values.', 'Email or password missing in request.', 401);
    }

    db.get('SELECT * FROM users WHERE email = ?',
      email,
      (err, rows) => {
        if (err) {
          return authentication
            .sendError(res, '/login', 'Database error.', err.message, 500);
        }

        if (rows === undefined) {
          return authentication
            .sendError(res, '/login', 'User not found.', 'User with provided email not found.', 401);
        }

        const user = rows;

        compare(password, user.password, (err, result) => {
          if (err) {
            return authentication
             .sendError(res, '/login', 'bcrypt error.', 'bcrypt error.', 500);
          }

          if (result) {
            const payload = { email: user.email, id: user.id, assets: user.assets };
            const jwtToken = sign(payload, process.env.SECRET, { expiresIn: '24h' });

            return res.status(200).json({
              data: {
                message: 'User logged in',
                user: payload,
                token: jwtToken
              }
            });
          }

          return authentication
            .sendError(res, '/login', 'Wrong password.', 'Password is incorrect.', 401);
        });
      });
  },

  /**
   * Middleware to veryfy user accsess.
   * @param req AuthIntoRequest
   * @param res Response
   * @param next NextFunction
   */
  verify: function(req: AuthInfoRequest, res: Response, next: NextFunction) {
    if (process.env.NODE_ENV === 'test') {
      next();

      return undefined;
    }
    /* istanbul ignore next */
    const token = req.headers['x-access-token'];
    /* istanbul ignore next */
    if (token) {
      verify(token.toString(), process.env.SECRET, function(err, decoded) {
        if (err) {
          return authentication
            .sendError(res, req.path, 'Failed authentication.', err.message, 500);
        }

        req.user = decoded;
        next();

        return undefined;
      });
    } else {
      return authentication
        .sendError(res, req.path, 'No token.', 'No token provided in request headers.', 401);
    }
  }
};

export { authentication };
