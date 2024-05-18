/**
 * 获取字符串长度(px)
 * @param {String} msg 字符串
 * @param {Object} style 样式
 * @param {Number} style.fontSize 字体大小
 * @param {String} style.fontFamily 字体
 * @returns {Number} 字符串长度(px)
 */
const getStringWidth = (
  msg: string,
  _style: {
    fontSize?: number;
    fontFamily?: string;
  }
) => {
  const style = {
    fontSize: _style.fontSize ?? 12,
    fontFamily: _style.fontFamily ?? 'initial',
  };
  const { fontSize, fontFamily } = style;
  const stringWidthDom = document.createElement('span');
  stringWidthDom.innerHTML = msg;
  stringWidthDom.style.position = 'absolute';
  stringWidthDom.style.left = '-9999px';
  if (fontSize) stringWidthDom.style.fontSize = fontSize + 'px';
  else stringWidthDom.style.fontSize = 'initial';
  stringWidthDom.style.fontFamily = fontFamily;
  document.body.appendChild(stringWidthDom);
  const width = stringWidthDom.offsetWidth;
  document.body.removeChild(stringWidthDom);
  return width;
};

export default getStringWidth;
