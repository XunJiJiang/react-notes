type ImgType = {
  replacementPath: string;
  originalPath: string;
  title: string;
};

/**
 * markdown 图片路径格式化
 * @param markdown markdown 文本
 * @param imgs 图片路径数组
 * @returns 返回格式化后的 markdown 文本
 */
const markdownImgPathFormatting = (markdown: string, imgs: ImgType[]) => {
  let _markdown = markdown;
  imgs.forEach((img) => {
    _markdown = _markdown.replace(
      new RegExp(`!\\[.*\\]\\(${img.originalPath}\\)`),
      `![${img.title}](${img.replacementPath})`
    );
  });
  return _markdown;
};

export default markdownImgPathFormatting;
