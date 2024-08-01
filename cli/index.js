import { execSync } from 'child_process';
import path from 'path';
import {
  csl,
  getDirectory,
  createSelect,
  createNote,
  createDirectory,
  updateContents,
  get__dirname
} from './src/utils/index.js';

const __dirname = get__dirname();

csl.title('Create Note');

const rootPageDirectoryPath = path.resolve(__dirname, './src/pages/study');

/** 创建和处理选择文件夹的选项 */
async function logSelect (message, directoryPath = './src/pages/study') {

  // 获取 ../src/pages/study 目录下的所有文件夹
  const studyPath = path.resolve(__dirname, directoryPath);

  const studyDirs = getDirectory(studyPath);

  const choices = ['创建笔记', '创建目录', '退出', '返回上一级', ...studyDirs].map((choice) => {
    if (choice === '返回上一级' && studyPath.endsWith('\\src\\pages\\study')) {
      return {
        name: choice,
        value: choice,
        disabled: '已经是根目录了'
      };
    } else {
      return {
        name: choice,
        value: choice
      };
    }
  });

  const answer = await createSelect(
    message
    + '\n'
    + csl.createColor('cyan')(
        '当前路径> root'
        + (studyPath.replace(/\\/g, '/').split('/src/pages/study')[1] || '')
        + '/'
      )
    + '\n'
    + csl.createColor('green')('>'),
    choices
  );

  
  if (answer === '创建笔记') {
    try {
      const result = await createNote(studyPath);
      csl.success(result);
    } catch (error) {
      csl.warn(error);
    } finally {
      return await logSelect(message, studyPath);
    }
  } else if (answer === '创建目录') {
    try {
      const newDirectoryPath = await createDirectory(studyPath);
      return await logSelect(message, newDirectoryPath);
    } catch (error) {
      csl.warn(error);
    } finally {
      return await logSelect(message, studyPath);
    }
  } else if (answer === '退出') {
    csl.color('期待与您的再次相遇');
    await updateContents(rootPageDirectoryPath);
    execSync(`npx prettier --write ${path.resolve(__dirname, './src/contents/index.tsx')}`);
    return;
  } else if (answer === '返回上一级') {
    return await logSelect(message, path.resolve(studyPath, '../'));
  } else {
    return await logSelect(message, path.resolve(studyPath, answer));
  }
}

logSelect('选择文件夹', './src/pages/study');

