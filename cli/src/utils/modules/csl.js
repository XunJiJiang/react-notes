// @ts-check

import figlet from 'figlet';
import chalk from 'chalk';
import gradient from 'gradient-string';

/**
 * @typedef CslLog
 * @type {Function}
 * @param {...any} msg
 */

/**
 * @typedef CslTitle
 * @type {Function}
 * @param {string} title 
 * @param {string | Array} colors 
 */

/**
 * @typedef CslType
 * @type {Function}
 * @param {string} message
 */

/**
 * @typedef CslColor
 * @type {Function}
 * @param {string} message
 * @param {string | Array} colors
 */

/**
 * @typedef CslCreateColor
 * @type {Function}
 * @param {string | Array} colors
 * @returns {CslType}
 */

/**
 * 控制台输出
 * @param  {...any} msg
 */
function csl (...msg) {
  csl.log(...msg);
};

const cslFunc = ['log', 'title', 'error', 'warn', 'info', 'success', 'color', 'createColor'];

/**
 * 控制台输出
 * @param {...any} msg 
 */
csl.log = (...msg) => {
  console.log(...msg);
};

/**
 * 创建颜色
 * @param {string | Array | null} colors 
 * @returns {CslType}
 */
csl.createColor = (colors = null) => {
  if (typeof colors === 'string') {
    return chalk[colors];
  } else if (Array.isArray(colors)) {
    return gradient(colors);
  } else {
    return gradient([
      {color: 'cyan', pos: 0},
      {color: 'pink', pos: 0.9}
    ]);
  }
}

const DEFAULT_TEXT = 'Hello World > 没有任何内容';

/**
 * 控制台输出标题
 * @param {string} title 
 * @param {string | Array | null} colors 
 */
csl.title = (title = DEFAULT_TEXT, colors = null) => {
  const titleGradient = csl.createColor(colors);
  const msg = figlet.textSync(title);
  csl(titleGradient(msg));
};

// 对勾图标： \u2714
// 叉号图标： \u2718
// 警告图标： \u26A0
// 信息图标： \u2139
// 问号图标： \u2753
// 叹号图标： \u2757

csl.error = (message = DEFAULT_TEXT) => {
  csl(chalk.red('\u2718 ' + message));
};

csl.warn = (message = DEFAULT_TEXT) => {
  csl(chalk.yellow('! ' + message));
};

csl.info = (message = DEFAULT_TEXT) => {
  csl(chalk.white('\u2170 ' + message));
};

csl.success = (message = DEFAULT_TEXT) => {
  csl(chalk.green('\u2713 ' + message));
};

/**
 * 
 * @param {any} message 
 * @param {string | Array | null} colors 
 * @returns 
 */
csl.color = (message, colors = null) => {
  const color = csl.createColor(colors);
  csl(color(message));
};

/**
 * 控制台输出
 * @param  {...any} msg 
 * @property {CslLog} log 
 * @property {CslTitle} title
 * @property {CslType} error
 * @property {CslType} warn
 * @property {CslType} info
 * @property {CslType} success
 * @property {CslColor} color
 * @property {CslCreateColor} createColor
 */
const _csl = new Proxy(csl, {
  apply (target, thisArg, args) {
    return target(...args);
  },
  get (target, prop, receiver) {
    if (typeof prop === 'symbol') return;

    if (cslFunc.includes(prop)) {
      // target[prop] 存在. 返回 target[prop]
      return target[prop];
    } else if (chalk[prop]) {
      // chalk[prop] 存在. 返回一个调用了chalk[prop]的函数
      return (...args) => target(chalk[prop](...args));
    } else {
      // 其他情况. 返回 target
      return target;
    }
  }
});

export default _csl;
