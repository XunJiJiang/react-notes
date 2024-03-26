/** 
 * 获取字符串长度(px)
 * @param {String} msg 字符串
 * @param {Number} fontSize 字体大小
 * @returns {Number} 字符串长度(px)
*/
export default function getStringWidth(msg, fontSize = 12) {
    const stringWidthDom = document.createElement('span');
    stringWidthDom.innerHTML = msg;
    stringWidthDom.style.position = 'absolute';
    stringWidthDom.style.left = '-9999px';
    if (fontSize) stringWidthDom.style.fontSize = fontSize + 'px';
    else stringWidthDom.style.fontSize = 'initial';
    document.body.appendChild(stringWidthDom);
    const width = stringWidthDom.offsetWidth;
    document.body.removeChild(stringWidthDom);
    return width;
};