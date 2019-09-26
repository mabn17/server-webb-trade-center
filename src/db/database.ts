/*!
 * By:
 * Martin Borg
 */

import * as sqlite3 from 'sqlite3';
import * as path from 'path';

let db: sqlite3.Database;
const sqlite = sqlite3.verbose();
const sqlFile = process.env.SQL_FILE || 'wtc';

const fileName: string = `../../src/db/${sqlFile}.sqlite`;
const filePath: string = path.join(__dirname, fileName);

db = new sqlite.Database(filePath);

console.log('Now using Sqlite Database: ', filePath);

export { db };
