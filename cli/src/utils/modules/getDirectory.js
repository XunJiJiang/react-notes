// @ts-check

import { statSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
// import { createRequire } from 'node:module';
import get__dirname from './get__dirname.js';
import getConfig from './getConfig.js';

// const require = createRequire(import.meta.url);

const __dirname = get__dirname();

/**
 * 获取指定路径下的所有文件夹
 * @param {string} directoryPath
 * @param {(e: string) => void} error
 * @returns
 */
function getDirectory(directoryPath, error = () => {}) {
  const dirPath = resolve(__dirname, directoryPath);

  const config = getConfig(dirPath);

  const childrenSort = config.childrenSort ?? {};

  if (!existsSync(dirPath)) {
    error(`The path ${dirPath} does not exist.`);
    return [];
  }

  const directory = [];

  readdirSync(dirPath).forEach((file) => {
    const isDir = statSync(resolve(dirPath, file)).isDirectory();
    const inBrotherDirNames = file in childrenSort;
    if (isDir && inBrotherDirNames) {
      directory[childrenSort[file]] = file;
    }
  });

  return directory;
}

export default getDirectory;
