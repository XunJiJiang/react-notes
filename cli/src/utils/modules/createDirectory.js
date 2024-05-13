import fs from 'fs';
import path from 'path';
import csl from './csl.js';
import { input } from '@inquirer/prompts';
import createConfig from './createConfig.js';

const directoryRegex = /^[a-zA-Z0-9_-]+$/;


/**
 * 创建目录
 * @param {*} directoryPath 当前目录完整路径
 * @returns 新的目录完整路径
 */
async function createDirectory (directoryPath) {
  const directoryName = await input({
    message: '目录名称:',
    default: 'new-directory',
    validate: (directoryName) => {
      if (directoryName.trim() === '') {
        return '目录名称不能为空';
      } else if (!directoryRegex.test(directoryName)) {
        return '目录名称只能包含字母、数字、下划线和短横线';
      } else {
        return true;
      }
    }
  });

  const newDirectoryPath = path.resolve(directoryPath, directoryName);

  if (fs.existsSync(newDirectoryPath)) {
    csl.warn('目录已存在');
    return newDirectoryPath;
  }

  fs.mkdirSync(newDirectoryPath);

  await createConfig(directoryName, newDirectoryPath, 'directory');

  csl.success('目录创建成功');

  return newDirectoryPath;
}

export default createDirectory;
