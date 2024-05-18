import fs from 'fs';
import path from 'path';
import { input } from '@inquirer/prompts';
import detectLineEnding from './detectLineEnding.js';
import capitalizeFirstLetter from './capitalizeFirstLetter.js';
import get__dirname from './get__dirname.js';
import createConfig from './createConfig.js';

const __dirname = get__dirname();

const createCodeTemplate = (title, lineEnding = '\r\n') => {
  return `import PageTemplate from '@components/page-template/index.tsx';${lineEnding}import markdown from './${title}.md?raw';${lineEnding}${lineEnding}export default function Use () {${lineEnding}  return (${lineEnding}    <>${lineEnding}      <PageTemplate markdown={markdown}>${lineEnding}      </PageTemplate>${lineEnding}    </>${lineEnding}  )${lineEnding}}`
}

const CONTENTS_OBJECT = path.resolve(__dirname, './src/contents/index.tsx');

const CONTENTS_PATH = path.resolve(__dirname, './src/contents/contents.tsx');

/** 
 * 键入笔记配置并写入文件
 * @param {*} title
 * @param {*} notePath
*/
async function _inputNoteConfig (title, notePath) {

  await createConfig(title, notePath, 'note');

  return Promise.resolve('配置成功');
}

const titleRegex = /^[a-zA-Z][a-zA-Z0-9_-]+$/;

/**
 * 
 * @param {*} pathText 
 * @param {*} error 
 * @returns 
 */
async function _createNote (pathText, error) {
  const title = await input({
    message: '笔记标题 (exit 退出):',
    validate: (title) => {
      if (title.trim() === '') {
        return '标题不能为空';
      } else if (title === 'exit') {
        return true;
      }
      return titleRegex.test(title) ? true : '标题只能包含字母、数字、下划线和短横线, 不能以数字或符号开头';
    }
  });

  if (title === 'exit') {
    return Promise.reject('取消创建');
  }

  const notePath = path.resolve(__dirname, pathText, title);

  if (fs.existsSync(notePath)) {
    const answer = await input({
      message: '文件夹已存在, 是否覆盖? y/n',
      default: 'n',
      validate: (answer) => {
        return ['y', 'n'].includes(answer) ? true : '请键入 y 或 n';
      }
    });
    if (answer === 'n') {
      return await createNote(pathText, error);
    }
  } else {
    fs.mkdirSync(path.resolve(__dirname, notePath));
  }

  // 创建\更新md文件
  const markdownFilePath = path.join(notePath, `${title}.md`);
  fs.writeFileSync(markdownFilePath, `# ${title}`);
  // 创建\更新js文件
  const codeFilePath = path.join(notePath, `index.tsx`);
  fs.writeFileSync(codeFilePath, createCodeTemplate(title, detectLineEnding(CONTENTS_PATH)));

  await _inputNoteConfig(title, notePath);

  return Promise.resolve('创建成功');
}

async function createNote (pathText, error = () => {}) {
  return await _createNote(pathText, error);
}

export default createNote;
