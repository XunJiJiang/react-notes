// @ts-check

import {
  rmdirSync,
  unlinkSync,
  existsSync,
  readdirSync,
  statSync
} from 'node:fs';
import { resolve } from 'node:path';
import { confirm } from '@inquirer/prompts';
import get__dirname from './get__dirname.js';
import { getParentConfig } from './getConfig.js';
import { editParentConfig } from './editConfig.js';

const __dirname = get__dirname();

/**
 *
 * @param {string} dirPath
 * @returns {boolean}
 */
function deleteFile(dirPath) {
  if (statSync(dirPath).isFile()) {
    unlinkSync(dirPath);
    return true;
  }

  const files = readdirSync(dirPath);

  for (const file of files) {
    deleteFile(resolve(dirPath, file));
  }

  rmdirSync(dirPath);

  return true;
}

/**
 *
 * @param {string} nodePath
 * @returns {Promise<string>}
 */
async function deleteNode(nodePath) {
  const result = await confirm({
    message: `确认删除节点 ${nodePath} 及其全部子节点吗?`,
    default: false
  });

  if (!result) {
    throw '取消删除';
  }

  const dirPath = resolve(__dirname, nodePath);

  const dirName = dirPath.replace(/\\/g, '/').split('/').pop() + '';

  if (!existsSync(dirPath)) {
    throw `The path ${dirPath} does not exist.`;
  }

  deleteFile(dirPath);

  const parentConfig = getParentConfig(dirPath);

  const childrenSort = parentConfig.childrenSort ?? {};

  const dirIndex = childrenSort[dirName];

  /** @type {{ [key: string]: number }} */
  const newSort = {};

  for (const key in childrenSort) {
    const index = childrenSort[key];
    if (key === dirName) continue;
    if (index > dirIndex) {
      newSort[key] = index - 1;
    } else {
      newSort[key] = index;
    }
  }

  parentConfig.childrenSort = newSort;

  editParentConfig(dirPath, parentConfig);

  return '删除完成';
}

export default deleteNode;
