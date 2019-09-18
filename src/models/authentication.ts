/*!
 * By:
 * Martin Borg
 */

import { Response, NextFunction } from 'express';
import { AuthInfoRequest, UserToken } from '../@Interfaces/ExpressRequest';
import { hash, compare } from 'bcrypt';
import { responses } from '../methods/responses';
import { verify, sign } from 'jsonwebtoken';
import { Database, sendError } from './db/queries';

const Authentication = {
  /**
   * Creates a new user in the database.
   * @param res express.Response
   * @param req AuthInfoRequest (extended express.req)
   */
  create: function (res: Response, req: AuthInfoRequest) {
    const DataB = new Database();
    const { email, password, firstName, lastName } = req.body;

    if (!responses.checkValues([email, password, firstName, lastName])) {
      return sendError(res, '/register', 'Missing values.', 'Double check so all values are filled in.', 401);
    }

    hash(password, 10, function(err: any, encrypted: string) {
      if (err) {
        return sendError(res, '/register', 'bcrypt error.', 'Error encrypting the given password.', 500);
      }

      const sql = 'INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)';
      const params = [email, encrypted, firstName, lastName];

      DataB.run(sql, params)
        .then(() => res.status(201).json({ data: { message: 'User successfully registered.' } }))
        .catch((_e: any) => sendError(res, '/register', 'Database error.', 'Email allready exists', 500));
    });
  },

  /**
   * Logs the user in and returns a valid JTW token
   * @param res express.Response
   * @param req AuthInfoRequest (extended express.req)
   */
  login: function(res: Response, req: AuthInfoRequest) {
    const DataB = new Database();
    const { email, password } = req.body;

    if (!responses.checkValues([email, password])) {
      return sendError(res, '/login', 'Missing values.', 'Email or password missing in request.', 401);
    }

    DataB.get('SELECT * FROM users WHERE email = ?', [ email ]).then((user: any) => {
      if (user === undefined) {
        return sendError(res, '/login', 'User not found.', 'User with provided email not found.', 401);
      }

      compare(password, user.password, (err, result) => {
        if (err) {
          return sendError(res, '/login', 'bcrypt error.', 'bcrypt error.', 500);
        }

        if (result) {
          const payload = {
            email: user.email, id: user.id, assets: user.assets,
            first_name: user.first_name, last_name: user.last_name
          };
          const jwtToken = sign(payload, process.env.SECRET, { expiresIn: '24h' });

          return res.status(200).json({
            data: {
              message: 'User logged in',
              user: payload,
              token: jwtToken
            }
          });
        }

        return sendError(res, '/login', 'Wrong password.', 'Password is incorrect.', 401);
      });
    }).catch((err: any) => sendError(res, '/login', 'Database Error.', err.message, 500));
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
      verify(token.toString(), process.env.SECRET, function(err, decoded: UserToken) {
        if (err) {
          return res.status(500).json(
            responses.getErrorMessage(req.path, 'Failed authentication.', err.message, 500)
          );
        }

        req.user = decoded;
        next();

        return undefined;
      });
    } else {
      return res.status(401).json(
        responses.getErrorMessage(req.path, 'No token.', 'No token provided in request headers.', 401)
      );
    }
  }
};

export { Authentication };
