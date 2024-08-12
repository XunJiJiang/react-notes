// @ts-check

import fs from 'fs';
import path from 'path';
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
const createCodeTemplate = (title, lineEnding = '\r\n') => {
  return `import PageTemplate from '@components/page-template/index.tsx';${lineEnding}import markdown from './${title}.md?raw';${lineEnding}${lineEnding}export default function Use () {${lineEnding}  return (${lineEnding}    <>${lineEnding}      <PageTemplate markdown={markdown}>${lineEnding}      </PageTemplate>${lineEnding}    </>${lineEnding}  )${lineEnding}}`
}

const CONTENTS_OBJECT = path.resolve(__dirname, './src/contents/index.tsx');

const CONTENTS_PATH = path.resolve(__dirname, './src/contents/contents.tsx');

/** 
 * 键入笔记配置并写入文件
 * @param {string} title
 * @param {string} nodePath
*/
async function _inputNodeConfig (title, nodePath) {

  await createConfig(title, nodePath, 'node');

  return Promise.resolve('配置成功');
}

const titleRegex = /^[a-zA-Z][a-zA-Z0-9_-]+$/;

/**
 * 
 * @param {string} pathText 
 * @param {(e: string) => void} error 
 * @returns 
 */
async function _createNode (pathText, error) {
  const title = await input({
    message: '节点标题 (--exit 退出):',
    validate: (title) => {
      if (title.trim() === '') {
        return '标题不能为空';
      } else if (title === '--exit') {
        return true;
      }
      return titleRegex.test(title) ? true : '标题只能包含字母、数字、下划线和短横线, 不能以数字或符号开头';
    }
  });

  if (title === '--exit') {
    return Promise.reject('取消创建');
  }

  const nodePath = path.resolve(__dirname, pathText, title);

  if (fs.existsSync(nodePath)) {
    const answer = await confirm({
      message: '节点已存在, 是否覆盖?',
      default: false
    });
    if (answer === false) {
      return await createNode(pathText, error);
    }
  } else {
    fs.mkdirSync(path.resolve(__dirname, nodePath));
  }
  
  await _inputNodeConfig(title, nodePath);

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
        default: `# ${title}`
      });
    } else {
      return `# ${title}`;
    }
  })();

  // 创建\更新md文件
  const markdownFilePath = path.join(nodePath, `${title}.md`);
  fs.writeFileSync(markdownFilePath, markdown);

  // 创建\更新js文件
  const codeFilePath = path.join(nodePath, `index.tsx`);
  fs.writeFileSync(codeFilePath, createCodeTemplate(title, detectLineEnding(CONTENTS_PATH)));

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
