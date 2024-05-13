import fs from 'fs';
import path from 'path';
import { input } from '@inquirer/prompts';
import detectLineEnding from './detectLineEnding.js';
import capitalizeFirstLetter from './capitalizeFirstLetter.js';
import get__dirname from './get__dirname.js';
import createConfig from './createConfig.js';

const __dirname = get__dirname();

const createCodeTemplate = (title, lineEnding = '\r\n') => {
  return `import PageTemplate from '@components/page-template/index.js';${lineEnding}import markdown from './${title}.md';${lineEnding}${lineEnding}export default function Use () {${lineEnding}  return (${lineEnding}    <>${lineEnding}      <PageTemplate markdown={markdown}>${lineEnding}      </PageTemplate>${lineEnding}    </>${lineEnding}  )${lineEnding}}`
}

const CONTENTS_OBJECT = path.resolve(__dirname, './src/contents/index.js');

const CONTENTS_PATH = path.resolve(__dirname, './src/contents/contents.js');

/**
 * 更新文件导入和导出信息
 * @param {*} title 
 * @param {*} notePath 
 */
async function _updateImport (title, notePath) {
  const contents_path = fs.readFileSync(CONTENTS_PATH, 'utf-8');
  const contents = fs.readFileSync(CONTENTS_OBJECT, 'utf-8');
  const contents_path_line_end = detectLineEnding(CONTENTS_PATH);
  const contents_line_end = detectLineEnding(CONTENTS_OBJECT);

  const contentsPathArr = contents_path.split(contents_path_line_end);
  const contentsArr = contents.split(contents_line_end);

  const _title = capitalizeFirstLetter(title);

  const _nodePathArr = notePath.replace(/\\/g, '/').split('/src/pages/study/')[1].split('/');

  const newContentsPath = contentsPathArr.reduce((acc, cur) => {
    if (cur.includes('/* import contents in @pages end */')) {
      const _nodePath = _nodePathArr.reduce((acc, cur) => {
        return `${acc}/${cur}`;
      }, '@pages/study') + '/index.js';
      acc.push(`import ${_title} from '${_nodePath}'`);
      acc.push('/* import contents in @pages end */');
    } else if (cur.includes('/* export contents end */')) {
      acc.push(`  ${_title},`);
      acc.push('/* export contents end */');
    } else {
      acc.push(cur);
    }
    return acc;
  }, []).join(contents_path_line_end);

  const newContentsArr = contentsArr.reduce((acc, cur) => {
    if (cur.includes('/* import contents in contents.js end */')) {
      acc.push(`  ${_title},`);
      acc.push('/* import contents in contents.js end */');
    } else {
      acc.push(cur);
    }
    return acc;
  }, []);

  // const contentsObject =
  //   JSON.parse(newContentsArr.join('')
  //     .split('/* contents assignment start */')[1]
  //     .split('const contents = ')[1]
  //     .split(';')[0]);
  
  // _nodePathArr.forEach(key => {
  //   if (key in contentsObject) {
  //     contentsObject = contentsObject[key];
  //   }
  // });

  const newContents = newContentsArr.join(contents_line_end);

  fs.writeFileSync(CONTENTS_PATH, newContentsPath);

  fs.writeFileSync(CONTENTS_OBJECT, newContents);
}

// 未完待续
/**
 * 深度搜索
 * 如果没有则创建对象
 * @param {*} obj 
 * @param {*} keys 
 * @returns 
 */
// function deepSearchOrCreate(obj, keys, title) {
//   const key = keys[0];
//   if (keys.length === 1) {
//     obj
//   } else if (key in obj) {
//     return deepSearchOrCreate(obj[key], keys.slice(1));
//   } else {
//     return null;

//   }
// }

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
    // await _updateImport(title, notePath);
  }

  // 创建\更新md文件
  const markdownFilePath = path.join(notePath, `${title}.md`);
  fs.writeFileSync(markdownFilePath, `# ${title}`);
  // 创建\更新js文件
  const codeFilePath = path.join(notePath, `index.js`);
  fs.writeFileSync(codeFilePath, createCodeTemplate(title, detectLineEnding(CONTENTS_PATH)));

  await _inputNoteConfig(title, notePath);

  return Promise.resolve('创建成功');
}

async function createNote (pathText, error = () => {}) {
  return await _createNote(pathText, error);
}

export default createNote;
