/*!
 * By:
 * Martin Borg
 */

import { Server } from 'http';
import * as ioServer from 'socket.io';

export class SocketServer {
  public static readonly PORT: string = '8080';
  private server: Server;
  private io: ioServer.Server;
  private mode: string;
  private port?: string;

  constructor(server: Server, mode: string, port?: string) {
    this.setMode(mode);
    this.config(port);
    this.createServer(server);
    this.sockets();
  }

  public getSockets() {
    return this.io;
  }

  private setMode(mode: string) {
    this.mode = mode;
  }

  private config(port?: string) {
    this.port = port || SocketServer.PORT;
  }

  private createServer(server: Server): void {
    this.server = server;
  }

  private sockets(): void {
    this.io = ioServer(this.server);
  }

  private getServer() {
    this.server.listen(this.port, () => {
        console.log(`Running server on port ${this.port}`);
    });
    this.server.on('error', err => {
      console.error(err);
    });
    this.server.on('listening', () => {
      console.log(process.env.MODE);
      console.info(`Listening on port ${this.port} (${this.mode})`);
    });

    this.io.on('connect', (socket) => {
        console.log('Connected client on port %s.', this.port);
        socket.on('stock update', (change: any) => {
          console.log('[server](stock update): %s', JSON.stringify(change));
          this.io.emit('stock update', change);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return this.io;
  }

  private getTestServer(): Server {
    return this.server.listen(this.port, () => {
      console.log(`Running server on port ${this.port}`);
    });
  }

  public init(): any {
    if (this.mode === 'test') {
      return this.getTestServer();
    }

    return this.getServer();
  }
}
