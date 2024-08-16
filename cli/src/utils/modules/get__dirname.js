// @ts-check

import process from 'node:process';
import path from 'node:path';

function get__dirname() {
  const arg = process.argv[2];
  const __dirname = path.resolve();
  return arg === 'in-cli' ? path.resolve(__dirname, '../') : __dirname;
}

export default get__dirname;
