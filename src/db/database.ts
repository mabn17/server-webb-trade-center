/*!
 * By:
 * Martin Borg
 */

import * as sqlite3 from 'sqlite3';
import * as path from 'path';

const sqlite = sqlite3.verbose();
let db: sqlite3.Database;

const fileName: string = process.env.NODE_ENV === 'test'
  ? '../../src/db/test.sqlite'
  : '../../src/db/wtc.sqlite';

const filePath: string = path.join(__dirname, fileName);

db = new sqlite.Database(filePath);

console.log('Now using Sqlite Database: ', filePath);

export { db };
