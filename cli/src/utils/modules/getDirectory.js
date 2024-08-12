// @ts-check

import fs from 'fs';
import path from 'path';
import get__dirname from './get__dirname.js';

const __dirname = get__dirname();

/**
 * 获取指定路径下的所有文件夹
 * @param {string} directoryPath 
 * @param {(e: string) => void} error 
 * @returns 
 */
function getDirectory (directoryPath, error = () => {}) {

  const dirPath = path.resolve(__dirname, directoryPath);

  if (!fs.existsSync(dirPath)) {
    error(`The path ${dirPath} does not exist.`);
    return [];
  }

  const directory = fs.readdirSync(dirPath).filter((file) => {
    return fs.statSync(path.resolve(dirPath, file)).isDirectory();
  });

  return directory;
}

export default getDirectory;
