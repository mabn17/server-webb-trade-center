/*!
 * By:
 * Martin Borg
 */

import * as express from 'express';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as bodyparser from 'body-parser';

import { auth } from './routes/auth';
import { stock } from './routes/stock';
import { personal } from './routes/personal';
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
app.use('/', stock);
app.use('/', personal);

export { app };
