/*!
 * By:
 * Martin Borg
 */

import './lib/env';
import { app } from './app';
import { SocketServer } from './setup';
import * as http from 'http';

const mode = process.env.NODE_ENV || 'dev';
const port: string = process.env.PORT || '8080';
const server: http.Server = http.createServer(app);

module.exports = new SocketServer(server, mode, port).init();
