// @ts-check

import fs from 'fs';
import path from 'path';
import { input, select } from '@inquirer/prompts';
import capitalizeFirstLetter from './capitalizeFirstLetter.js';

const iconRegex = /^[a-zA-Z0-9_-]+$/;

const pathRegex = /^[a-zA-Z0-9_@.-]+$/;

/**
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
 * 创建配置
 * @param {string} title 
 * @param {string} nodePath 
 * @param {string} type 
 * @returns 
 */
async function createConfig (title, nodePath, type = 'node') {

  const typeName = type === 'node' ? '笔记' : '目录';

  const label = await input({
    message: `${typeName}显示名称:`,
    default: title,
    validate: (label) => {
      return label.trim() === '' ? '名称不能为空' : true;
    }
  });

  const relativePath = await input({
    message: `${typeName}相对路径:`,
    default: `${title}`,
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

  const icon = await input({
    message: `${typeName}图标(默认没有图标):`,
    default: '',
    validate: (icon) => checkIcon(icon, true)
  });

  const tagType = await select({
    message: `${typeName}标签类型:`,
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
      disabled: '目录本身支持, 但脚本暂不支持'
    }]
  });

  const tag = await ((async () => {
    if (tagType === 'text') {
      return await input({
        message: '标签文本:',
        validate: (tag) => {
          return tag.trim() === '' ? '标签文本不能为空' : true;
        }
      });
    } else if (tagType === 'icon') {
      return await input({
        message: '标签图标:',
        validate: (icon) => checkIcon(icon, false)
      });
    } else if (tagType === 'component') {
      return await input({
        message: '标签组件:',
        validate: (component) => {
          return component.trim() === '' ? '不能为空' : true;
        }
      });
    } else {
      return null;
    }
  })());

  const component = await ((async () => {
    if (type === 'node') {
      return `() => <${capitalizeFirstLetter(title)} />`;
    } else {
      return null;
    }
  })());

  const config = {
    label,
    path: '/' + relativePath,
    entryFilePath: component ? `/pages/study${(nodePath.replace(/\\/g, '/').split('/src/pages/study')[1] || '')}/index.tsx` : '',
    icon: icon.trim() === '' ? null : icon,
    tag: tagType ? {
      type: tagType,
      value: tag
    } : null,
    component,
    type
  };

  const configPath = path.join(nodePath, 'nodeConfig.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

  return config;
}

export default createConfig;
