// @ts-check

import { execSync } from 'child_process';
import path from 'node:path';
import {
  csl,
  getDirectory,
  createSelect,
  createNode,
  editNode,
  updateContents,
  get__dirname,
  deleteNode
} from './src/utils/index.js';

const __dirname = get__dirname();

csl.title('Create Note');

const rootPageDirectoryPath = path.resolve(__dirname, './src/pages/study');

/** 创建和处理选择文件夹的选项 */
async function logSelect(message, directoryPath = './src/pages/study') {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // 获取 ../src/pages/study 目录下的所有文件夹
    const studyPath = path.resolve(__dirname, directoryPath);

    const studyDirs = getDirectory(studyPath);

    const choices = [
      '创建节点',
      '编辑节点',
      '删除节点',
      '返回上一级',
      '退出',
      ...studyDirs
    ].map((choice) => {
      if (
        ['编辑节点', '返回上一级', '删除节点'].includes(choice) &&
        studyPath.endsWith('\\src\\pages\\study')
      ) {
        return {
          name: choice,
          value: choice,
          disabled: ' '
        };
      } else {
        return {
          name: choice,
          value: choice
        };
      }
    });

    const answer = await createSelect(
      message +
        '\n' +
        csl.createColor('cyan')(
          '当前路径> root' +
            (studyPath.replace(/\\/g, '/').split('/src/pages/study')[1] || '') +
            '/'
        ) +
        '\n' +
        csl.createColor('green')('>'),
      choices
    );

    if (answer === '创建节点') {
      try {
        const result = await createNode(studyPath);
        csl.success(result);
      } catch (error) {
        csl.warn(error);
      }
    } else if (answer === '编辑节点') {
      try {
        const result = await editNode(studyPath);
        csl.success(result);
      } catch (error) {
        csl.warn(error);
      }
    } else if (answer === '删除节点') {
      try {
        const resule = await deleteNode(studyPath);
        csl.success(resule);
        return '--delete';
      } catch (error) {
        csl.warn(error);
      }
    } else if (answer === '返回上一级') {
      return '--back';
      // await logSelect(message, path.resolve(studyPath, '../'));
    } else if (answer === '退出') {
      csl.color('期待与您的再次相遇');
      await updateContents(rootPageDirectoryPath);
      execSync(
        `npx prettier --write ${path.resolve(__dirname, './src/contents/index.tsx')}`
      );
      return '--exit';
    } else {
      const _return = await logSelect(message, path.resolve(studyPath, answer));
      if (_return === '--exit') {
        return '--exit';
      }
    }
  }
}

logSelect('选择文件夹', './src/pages/study');
