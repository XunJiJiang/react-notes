// @ts-check

import fs from 'node:fs';
import path from 'node:path';
// import { createRequire } from 'node:module';
import getDirectory from '../getDirectory.js';
import getFiles from '../getFiles.js';
import get__dirname from '../get__dirname.js';
// import capitalizeFirstLetter from '../capitalizeFirstLetter.js';
import detectLineEnding from '../detectLineEnding.js';
// import csl from '../csl.js';
import getConfig from '../getConfig.js';

// const require = createRequire(import.meta.url);

/** @typedef {{dirName: string; files: string[]; directories: TypeStructure[]}} TypeStructure */

/**
 * @typedef {{
 *   type: string;
 *   value: string | null
 * } | null} Tag
 */

/**
 * @typedef {{
 *   label: string | null;
 *   path: string;
 *   entryFilePath: string | null;
 *   icon: string | null;
 *   tag: Tag;
 *   component: string | null;
 *   type: string;
 *   childrenSort: { [key: string]: number }
 * }} Config
 */

const __dirname = get__dirname();

/**
 *
 * @param {string} directoryPath
 * @returns {TypeStructure}
 */
function _readContentsStructure(directoryPath) {
  const dirPath = path.resolve(__dirname, directoryPath);

  const pathArr = dirPath.split(path.sep);

  const dirName = pathArr[pathArr.length - 1];

  const structure = {
    dirName,
    files: [...getFiles(dirPath)],
    directories: [...getDirectory(dirPath)].map((directory) => {
      return _readContentsStructure(path.resolve(dirPath, directory));
    })
  };

  return structure;
}

/**
 *
 * @param {TypeStructure} structure
 * @param {string} directoryPath
 * @returns
 */
function _readContentsConfigFile(structure, directoryPath = __dirname) {
  const configFile = structure.files.find((file) => {
    return file === 'nodeConfig.json';
  });

  /**
   * @type {{
   *   children?: any;
   * } & Config}
   */
  let config = {};

  if (configFile) {
    config = getConfig(path.resolve(__dirname, directoryPath));
  }

  if (structure.directories.length > 0) {
    const initDirIndex = [];
    config.children = structure.directories
      .map((directory) => {
        const child = _readContentsConfigFile(
          directory,
          path.resolve(directoryPath, directory.dirName)
        );
        initDirIndex.push(directory.dirName);
        return Object.keys(child).length === 0 ? null : child;
      })
      .filter((item) => item !== null)
      .reduce(
        /**
         *
         * @param {*} p
         * @param {*} c
         * @param {*} i
         * @returns {*}
         */
        (p, c, i) => {
          const index = config.childrenSort[initDirIndex[i]];
          p[index] = c;
          return p;
        },
        []
      );
  }

  return config;
}

/**
 * 目录结构文件路径
 */
const CONTENTS_FILE_PATH = path.resolve(__dirname, './src/contents/index.tsx');

/**
 * 目录组件引入路径
 */
const CONTENTS_IMPORT_FILE_PATH = path.resolve(
  __dirname,
  './src/contents/contents.tsx'
);

/**
 * 标签
 * <function>任意函数</function>
 * <type>类型</type>
 * <children>子节点</children>
 */

/**
 * 检测标签function
 */
const functionRegex = /<function>([\s\S]*?)<\/function>/;

/**
 * 检测标签type
 */
const typeRegex = /<type>([\s\S]*?)<\/type>/;

/**
 * 检测标签children
 */
const childrenRegex = /<children>([\s\S]*?)<\/children>/;

/**
 * 检测全部特殊符号, 除了_的转换成_
 * 每个单词的首字母大写
 * @param {String} str
 * @returns {String}
 */
// function replaceSpecialSymbol(str) {
//   return str
//     .replace(/[^a-zA-Z0-9_]/g, '_')
//     .replace(/_+/g, '_')
//     .split('_')
//     .map((word) => {
//       return capitalizeFirstLetter(word);
//     })
//     .join('');
// }

/**
 * @returns {(path: string) => string}
 */
function createPathMap() {
  const map = new Map();
  let mapI = 0;
  let trailingI = 0;
  return function (path) {
    if (!map.has(path)) {
      map.set(path, '_' + mapI++ + '');
    }
    return map.get(path) + '_' + trailingI++;
  };
}

/**
 * 检测是否匹配正则, 并返回匹配结果的值
 * @param {RegExp} regex 正则表达式
 * @param {String} content 内容
 * @returns {{
 *   value: string
 * } | null}
 */
function matchRegex(regex, content) {
  const match = content.match(regex);
  return match
    ? {
        value: match[1]
      }
    : null;
}

/**
 * 返回字符串中第一个非空白字符的索引和一个空白字符串
 * @param {String} str
 * @returns {{
 *   length: number,
 *   space: string
 * }}
 */
function getSpace(str) {
  let length = 0;
  let space = '';
  for (let i = 0; i < str.length; i++) {
    if (str[i] === ' ') {
      length++;
      space += ' ';
    } else {
      break;
    }
  }
  return {
    length,
    space
  };
}

/**
 * 检测是否为React元素
 * @param {string} component
 * @returns {boolean}
 */
function isReactElement(component) {
  const _component = matchRegex(functionRegex, component)?.value ?? component;
  // 删除包裹组件的() => <
  const _componentContent = _component
    .replace(/^\(\) => </, '')
    .replace(/>$/, '');
  // 判断第一个字符是否为大写字母
  return /^[A-Z]/.test(_componentContent);
}

/**
 * 将目录结构中的component属性值由字符串转成js函数
 * @param {Object} config
 * @returns {{
 *   contentText: string,
 *   componentPathList: Array<[string, string]>
 * }} contentText: 转换后的内容, componentPathList: 组件路径列表
 */
function _convertComponentToFunction(config) {
  const uniqueKey = createPathMap();

  const componentPathList = [];

  const json = JSON.stringify(
    config.children ?? [],
    (key, value) => {
      if (key === 'component' && typeof value === 'string') {
        if (matchRegex(functionRegex, value) !== null) return value;
        else return `<function>${value}</function>`;
      } else if (key === 'tag' && value !== null) {
        if (value.type === 'text') {
          return value.value;
        } else if (value.type === 'icon') {
          return {
            icon: value.value
          };
        } else if (value.type === 'component') {
          if (matchRegex(functionRegex, value) !== null) return value;
          else return `<function>${value.value}</function>`;
        } else {
          return null;
        }
      } else if (key === 'type') {
        return `<type>${value}</type>`;
      } else if (key === 'children') {
        if (JSON.stringify(value) === '[]') {
          return `<children>null</children>`;
        } else {
          return value;
        }
      } else if (!isNaN(parseInt(key))) {
        if (
          value.component !== null &&
          value.component &&
          isReactElement(value.component)
        ) {
          const _key = 'Comp' + uniqueKey(value.path);
          componentPathList.push([_key, `@${value.entryFilePath.slice(1)}`]);
          return {
            ...value,
            component: `<function>() => <${_key} /></function>`
          };
        } else {
          return value;
        }
      }
      return value;
    },
    2
  );

  const line_end = detectLineEnding(json, 'string');

  const contentText = json
    .split(line_end)
    .filter((line) => {
      if (matchRegex(typeRegex, line) !== null) {
        return false;
      } else if (matchRegex(childrenRegex, line)?.value === 'null') {
        return false;
      } else {
        return true;
      }
    })
    .map((line) => {
      const functionContent = matchRegex(functionRegex, line);
      if (functionContent !== null) {
        return `${getSpace(line).space}"component": ${functionContent.value},`;
      } else {
        return line;
      }
    })
    .join(line_end);

  return {
    contentText,
    componentPathList
  };
}

/**
 * 生成目录组件引入文件
 * @param {Array<[string, string]>} componentPathList
 */
function _generateContentsImportFile(componentPathList) {
  const contentsImport = componentPathList
    .map(([key, path]) => {
      return `import ${key} from '${path}';`;
    })
    .join('\n');

  const contentsExport = componentPathList
    .map(([key]) => {
      return `  ${key},`;
    })
    .join('\n');

  const contentsImportText = `${contentsImport}\n\nexport {\n${contentsExport.slice(0, contentsExport.length - 1)}\n};\n`;

  fs.writeFileSync(CONTENTS_IMPORT_FILE_PATH, contentsImportText);
}

/**
 * 生成目录结构js文件
 * @param {Array<[string, string]>} componentPathList
 * @param {string} contentText
 * @example
 */
function _generateContentsFile(componentPathList, contentText) {
  const contentsExport = componentPathList
    .map(([key]) => {
      return `  ${key},`;
    })
    .join('\n');

  const contentsText = `import {\n${contentsExport}\n} from './contents.tsx';\n\nconst contents = ${contentText};\n\nexport default contents;`;

  fs.writeFileSync(CONTENTS_FILE_PATH, contentsText);
}

/**
 * 更新目录结构js文件
 * @param {string} directoryPath
 */
async function updateContents(directoryPath) {
  const structure = _readContentsStructure(directoryPath);
  const config = _readContentsConfigFile(structure, directoryPath);
  const { contentText, componentPathList } =
    _convertComponentToFunction(config);
  _generateContentsImportFile(componentPathList);
  _generateContentsFile(componentPathList, contentText);
}

export default updateContents;
