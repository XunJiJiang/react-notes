import { select, Separator } from '@inquirer/prompts';

/**
 * 创建选择框
 * @param {*} message 
 * @param {*} choices 
 * @param {*} separator 
 * @returns 
 */
async function createSelect (message, choices, separator = false) {
  choices = createSelect.addSeparator(choices, separator);
  return await select({
    message,
    choices,
  });
}

/**
 * 在选择框的选项中添加分隔符
 * @param {*} choices 
 * @param {*} separator 
 * @returns 
 */
createSelect.addSeparator = (choices, separator) => {
  const separatorType = typeof separator;
  if (separatorType === 'number' && separator > 0) {
    choices.splice(separator, 0, new Separator());
  } else if (Array.isArray(separator) && separator.length > 0) {
    let addedNumber = 0;
    separator.forEach((index) => {
      choices.splice(index + addedNumber, 0, new Separator());
      addedNumber++;
    });
  } else if (separatorType === 'function') {
    choices = separator(choices);
  } else if (separatorType === 'boolean' && separator) {
    choices = choices.reduce((acc, cur) => {
      acc.push(cur, new Separator());
      return acc;
    }, []);
  }

  return choices;
}

export default createSelect;
