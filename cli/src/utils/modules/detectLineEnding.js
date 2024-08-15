// @ts-check

import fs from 'node:fs';

/**
 * 获取文件的换行符
 * @param {string} file path | string
 * @param {string} type path | string
 * @returns
 */
function detectLineEnding(file, type = 'path') {
  const content = (() => {
    if (type === 'path') {
      return fs.readFileSync(file, 'utf-8');
    } else if (type === 'string') {
      return file;
    } else {
      return '';
    }
  })();
  if (content.includes('\r\n')) {
    // crlf
    return '\r\n';
  } else if (content.includes('\n')) {
    // lf
    return '\n';
  } else {
    // cr
    return '\r';
  }
}

export default detectLineEnding;
