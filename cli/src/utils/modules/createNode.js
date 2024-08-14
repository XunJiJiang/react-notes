// @ts-check

import fs from 'node:fs';
import path from 'node:path';
import { input, confirm, editor } from '@inquirer/prompts';
import detectLineEnding from './detectLineEnding.js';
// import capitalizeFirstLetter from './capitalizeFirstLetter.js';
import get__dirname from './get__dirname.js';
import createConfig from './createConfig.js';

const __dirname = get__dirname();

/**
 * 
 * @param {string} title 
 * @param {string} lineEnding 
 * @returns 
 */
// TODO: 将组件名Use改为基于title的组件名
const createCodeTemplate = (title, lineEnding = '\r\n') => {
  return `import PageTemplate from '@components/page-template/index.tsx';${lineEnding}import markdown from './${title}.md?raw';${lineEnding}${lineEnding}const Component = () => {${lineEnding}  return (${lineEnding}    <>${lineEnding}      <PageTemplate markdown={markdown}>${lineEnding}      </PageTemplate>${lineEnding}    </>${lineEnding}  )${lineEnding}};\n\nexport default Component;\n`
}

const CONTENTS_OBJECT = path.resolve(__dirname, './src/contents/index.tsx');

const CONTENTS_PATH = path.resolve(__dirname, './src/contents/contents.tsx');

/** 
 * 键入笔记配置并写入文件
 * @param {string} title
 * @param {string} nodePath
 * @returns {Promise<{massage: string; status: string; task: () => void}>}
  */
async function _inputNodeConfig (title, nodePath) {

  const createConfigTask = (await createConfig(title, nodePath, 'node'))[1];

  return {
    massage: '配置成功',
    status: '200',
    task: createConfigTask
  };
}

const titleRegex = /^[a-zA-Z][a-zA-Z0-9_-]+$/;

/**
 * 
 * @param {string} pathText 
 * @param {(e: string) => void} error 
 * @returns 
 */
async function _createNode (pathText, error) {
  // 被用于真实文件夹命名
  const dirName = await input({
    message: '节点文件夹名 (--exit 退出):',
    validate: (name) => {
      if (name.trim() === '') {
        return '文件夹名不能为空';
      } else if (name === '--exit') {
        return true;
      }
      return titleRegex.test(name) ? true : '文件夹名只能包含字母、数字、下划线和短横线, 不能以数字或符号开头';
    }
  });

  if (dirName === '--exit') {
    return Promise.reject('取消创建');
  }

  const nodePath = path.resolve(__dirname, pathText, dirName);

  let createDir = () => {};

  if (fs.existsSync(nodePath)) {
    const answer = await confirm({
      message: '节点已存在, 是否覆盖?',
      default: false
    });
    if (answer === false) {
      return await createNode(pathText, error);
    }
  } else {
    createDir = () => {
      fs.mkdirSync(path.resolve(__dirname, nodePath));
    };    
  }
  
  const { task: writeConfig } = await _inputNodeConfig(dirName, nodePath);

  const isCustomizeMD = await confirm({
    message: '要自定义初始markdown内容吗?',
    default: false
  });

  const markdown = await (async () => {
    if (isCustomizeMD) {
      return await editor({
        message: '编辑markdown内容',
        postfix: '.md',
        waitForUseInput: false,
        default: `# ${dirName}`
      });
    } else {
      return `# ${dirName}`;
    }
  })();

  // 创建文件夹
  createDir();

  // 创建配置文件
  writeConfig();

  // 创建\更新md文件
  const markdownFilePath = path.join(nodePath, `${dirName}.md`);
  fs.writeFileSync(markdownFilePath, markdown);

  // 创建\更新js文件
  const codeFilePath = path.join(nodePath, `index.tsx`);
  fs.writeFileSync(codeFilePath, createCodeTemplate(dirName, detectLineEnding(CONTENTS_PATH)));

  return Promise.resolve('创建成功');
}

/**
 * 
 * @param {string} pathText 
 * @param {(e: string) => void} error 
 * @returns 
 */
async function createNode (pathText, error = () => {}) {
  return await _createNode(pathText, error);
}

export default createNode;
