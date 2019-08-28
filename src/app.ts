/*!
 * By:
 * Martin Borg
 */

import * as express from 'express';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as bodyparser from 'body-parser';


import { auth } from './routes/auth';
import { responses } from './methods/responses';

const app = express();

// Middlewares
app.use(cors());
app.options('*', cors());
app.disable('x-powered-by');

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// Routes
app.use('/', auth);

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

export { app };
