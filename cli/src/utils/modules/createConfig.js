// @ts-check

import fs from 'node:fs';
import path from 'node:path';
// import { createRequire } from 'node:module';
import { input, select } from '@inquirer/prompts';
import capitalizeFirstLetter from './capitalizeFirstLetter.js';
import { getParentConfig } from './getConfig.js';
import { editParentConfig } from './editConfig.js';

// const require = createRequire(import.meta.url);

const iconRegex = /^[a-zA-Z0-9_-]+$/;

const pathRegex = /^[a-zA-Z0-9_@.-]+$/;

/**
 * 检查图标
 * @param {string} icon
 * @param {boolean} canEmpty 是否可以为空
 * @returns
 */
function checkIcon(icon, canEmpty = false) {
  if (icon.trim() === '') {
    return canEmpty ? true : '图标不能为空';
  } else if (!iconRegex.test(icon)) {
    return '图标只能包含字母、数字、部分符号(-, _)';
  } else {
    return true;
  }
}

/**
 * 创建配置
 * @param {string} title
 * @param {string} nodePath
 * @param {string} type
 * @returns {Promise<[any, () => void]>}
 */
async function createConfig(title, nodePath, type = 'node') {
  const typeName = type === 'node' ? '节点' : '根';

  const label = await input({
    message: `${typeName}显示名称:`,
    default: title,
    validate: (label) => (label.trim() === '' ? '名称不能为空' : true)
  });

  const relativePath = await input({
    message: `${typeName}路由路径:`,
    default: title,
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

  const icon =
    (await input({
      message: `${typeName}图标(置空为没有图标):`,
      default: '',
      validate: (icon) => checkIcon(icon ?? '', true)
    })) ?? '';

  const tagType = await select({
    message: `${typeName}标签类型:`,
    choices: [
      {
        name: '不设置标签',
        value: null
      },
      {
        name: '文本',
        value: 'text'
      },
      {
        name: 'icon',
        value: 'icon'
      },
      {
        name: 'react组件',
        value: 'component',
        disabled: '暂不支持由脚本创建'
      }
    ]
  });

  const tag = await (async () => {
    if (tagType === 'text') {
      return await input({
        message: '标签文本:',
        validate: (tag) => (tag?.trim() === '' ? '标签文本不能为空' : true)
      });
    } else if (tagType === 'icon') {
      return (
        (await input({
          message: '标签图标:',
          validate: (icon) => checkIcon(icon ?? '', false)
        })) ?? ''
      );
    } else if (tagType === 'component') {
      return await input({
        message: '标签组件:',
        validate: (component) => (component.trim() === '' ? '不能为空' : true)
      });
    } else {
      return null;
    }
  })();

  const component = await (async () => {
    if (type === 'node') {
      return `() => <${capitalizeFirstLetter(title)} />`;
    } else {
      return null;
    }
  })();

  const changeFather = await (async () => {
    const fatherConfig = getParentConfig(nodePath);

    const childrenSort = fatherConfig.childrenSort ?? {};

    const choices = [];

    for (const key in childrenSort) {
      const index = childrenSort[key];
      choices[index] = key;
    }

    const dirName = nodePath.replace(/\\/g, '/').split('/').pop() + '';

    if (choices.length === 0) {
      fatherConfig.childrenSort = {
        [dirName]: 0
      };
      return () => {
        editParentConfig(nodePath, fatherConfig);
      };
    }

    const answer = await select({
      message: '此节点将被插入到',
      default: 0,
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
          });
          return p;
        },
        []
      )
    });

    fatherConfig.childrenSort = choices
      .reduce(
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
      )
      .reduce(
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
      editParentConfig(nodePath, fatherConfig);
    };
  })();

  const config = {
    label,
    path: '/' + relativePath,
    entryFilePath: component
      ? `/pages/study${nodePath.replace(/\\/g, '/').split('/src/pages/study')[1] || ''}/index.tsx`
      : '',
    icon: icon.trim() === '' ? null : icon,
    tag: tagType
      ? {
          type: tagType,
          value: tag
        }
      : null,
    component,
    type,
    childrenSort: {}
  };

  const configPath = path.join(nodePath, 'nodeConfig.json');

  return [
    config,
    () => {
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      changeFather();
    }
  ];
}

export default createConfig;
