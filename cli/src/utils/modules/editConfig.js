// @ts-check
// 此组件和createConfig高度重合, 需要优化

// import { createRequire } from 'node:module';
import { join } from 'node:path';
import { existsSync, writeFileSync, readFileSync } from 'node:fs';
import { input, select } from '@inquirer/prompts';
import capitalizeFirstLetter from './capitalizeFirstLetter.js';
import csl from './csl.js';

// const require = createRequire(import.meta.url);

const iconRegex = /^[a-zA-Z0-9_-]+$/;

const pathRegex = /^[a-zA-Z0-9_@.-]+$/;

/**
 * TODO: 此函数是重复函数, 在createConfig已经存在
 * 检查图标
 * @param {string} icon 
 * @param {boolean} canEmpty 是否可以为空
 * @returns 
 */
function checkIcon (icon, canEmpty = false) {
  if (icon.trim() === '') {
    return canEmpty ? true : '图标不能为空';
  } else if (!iconRegex.test(icon)) {
    return '图标只能包含字母、数字、部分符号(-, _)';
  } else {
    return true;
  }
}

/**
 * 
 * @param {string} pathText
 * @returns {Promise<string>}
 */
async function editNode (pathText) {
  if (!existsSync(join(pathText, 'nodeConfig.json'))) {
    throw `节点 <${pathText}> 不存在.`
  }

  const dirName = pathText.replace(/\\/g, '/').split('/').pop() + '';;
  // const fatherDirName = pathText.replace(/\\/g, '/').split('/').slice(0, -1).pop();
  // join(pathText.replace(/\\/g, '/').split('/').slice(0, -1).join('/'), 'nodeConfig.json');

  // const config = require(join(pathText, 'nodeConfig.json'));
  const configFileContent = readFileSync(join(pathText, 'nodeConfig.json'), 'utf-8');
  const config = JSON.parse(configFileContent);

  const typeName = config.type === 'node' ? '节点' : '根';
  
  const label = await input({
    message: `${typeName}显示名称:`,
    default: config.label,
    validate: (label) => label.trim() === '' ? '名称不能为空' : true
  });

  const relativePath = await input({
    message: `${typeName}路由路径:`,
    default: config.path.slice(1),
    validate: (relativePath) => {
      if (relativePath.trim() === '') {
        return '路径不能为空';
      } else if (!pathRegex.test(relativePath)) {
        return '路径只能包含字母、数字、、部分符号(-, _, @, .)';
      } else {
        return true;
      }
    }
  });

  const icon = (await input({
    message: `${typeName}图标(置空为没有图标):`,
    default: config.icon ?? '',
    validate: (icon) => checkIcon(icon ?? '', true)
  })) ?? '';

  const oldTagType = config.tag ? config.tag.type : null;
  const oldTagValue = config.tag ? config.tag.value : null;

  const tagType = await select({
    message: `${typeName}标签类型:`,
    default: oldTagType,
    choices: [{
      name: '不设置标签',
      value: null
    }, {
      name: '文本',
      value: 'text'
    }, {
      name: 'icon',
      value: 'icon'
    }, {
      name: 'react组件',
      value: 'component',
      disabled: '暂不支持由脚本创建'
    }]
  });

  const tag = await ((async () => {
    const defaultTagValue = oldTagType === tagType ? oldTagValue : null;
    if (tagType === 'text') {
      return await input({
        message: '标签文本:',
        default: defaultTagValue,
        validate: (tag) => tag?.trim() === '' ? '标签文本不能为空' : true
      });
    } else if (tagType === 'icon') {
      return await input({
        message: '标签图标:',
        default: defaultTagValue,
        validate: (icon) => checkIcon(icon ?? '', false)
      });
    } else if (tagType === 'component') {
      return await input({
        message: '标签组件:',
        default: defaultTagValue,
        validate: (component) => component.trim() === '' ? '不能为空' : true
      });
    } else {
      return null;
    }
  })());

  const component = await ((async () => {
    if (config.type === 'node') {
      return `() => <${capitalizeFirstLetter(dirName)} />`;
    } else {
      return null;
    }
  })());

  const changeFather = await (async () => {
    const fatherConfigPath = join(pathText.replace(/\\/g, '/').split('/').slice(0, -1).join('/'), 'nodeConfig.json');
    const fatherConfigContent = existsSync(fatherConfigPath) ? readFileSync(fatherConfigPath, 'utf-8') : (() => {
      csl.error(`The path ${fatherConfigPath} does not exist.`);
      return '{}';
    })();
    const fatherConfig = JSON.parse(fatherConfigContent);
    const childrenSort = fatherConfig.childrenSort ?? {};

    const choices = [];

    const dirIndex = childrenSort[dirName];

    for (const key in childrenSort) {
      const index = childrenSort[key];
      if (key === dirName) continue;
      if (index > dirIndex) {
        choices[index - 1] = key;
      } else {
        choices[index] = key;
      }
    }

    if (choices.length === 0) {
      fatherConfig.childrenSort = {
        [dirName]: 0
      }
      return () => {
        writeFileSync(fatherConfigPath, JSON.stringify(fatherConfig, null, 2));
      }
    }

    const defaultIndex = fatherConfig.childrenSort[dirName];

    const answer = await select({
      message: '此节点将被插入到',
      default: defaultIndex,
      choices: choices.reduce(
        /**
         * 
         * @param {{value: number, name: string}[]} p 
         * @param {string} c 
         * @param {number} i 
         * @returns {{value: number, name: string}[]}
         */
        (p, c, i) => {
          if (i === 0) {
            p.push({
              value: 0,
              name: '第一位'
            });
          }
          p.push({
            value: i + 1,
            name: c + '后'
          })
          return p;
        },
        []
      )
    });
    
    fatherConfig.childrenSort = choices.reduce(
      /**
       * 
       * @param {string[]} p 
       * @param {string} c 
       * @param {number} i 
       * @returns {string[]}
       */
      (p, c, i) => {
        if (i === answer) {
          p.push(dirName);
        }
        p.push(c);
        return p;
      },
      []
    ).reduce(
      /**
       * 
       * @param {{[key: string]: number}} p 
       * @param {string} key 
       * @param {number} i 
       * @returns {{[key: string]: number}}
       */
      (p, key, i) => {
        p[key] = i;
        return p;
      },
      {}
    );

    // 当插入结尾时, 第一个reduce内的i === answer不会触发, 所以需要在这里判断
    if (choices.length === answer) {
      fatherConfig.childrenSort[dirName] = answer;
    }

    return () => {
      writeFileSync(fatherConfigPath, JSON.stringify(fatherConfig, null, 2));
    }
  })();

  const newConfig = {
    label,
    path: '/' + relativePath,
    entryFilePath: component ? `/pages/study${(pathText.replace(/\\/g, '/').split('/src/pages/study')[1] || '')}/index.tsx` : '',
    icon: icon.trim() === '' ? null : icon,
    tag: tagType ? {
      type: tagType,
      value: tag
    } : null,
    component,
    type: config.type,
    childrenSort: config.childrenSort
  };

  const configPath = join(pathText, 'nodeConfig.json');

  writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
  changeFather();

  return '编辑成功';
}

export default editNode;