// @ts-check

import { select, Separator } from '@inquirer/prompts';

/** @typedef {import('@inquirer/prompts').Separator} TypeSeparator */

/** @typedef {({name: string; value: string} | TypeSeparator)} TypeChoice*/

/** @typedef {Array<TypeChoice>} TypeChoices */

/**
 * 创建选择框
 * @param {string} message
 * @param {TypeChoices} choices
 * @param {number | number[] | Function | boolean} separator
 * @returns
 */
async function createSelect(message, choices, separator = false) {
  choices = createSelect.addSeparator(choices, separator);
  return await select({
    message,
    choices
  });
}

/**
 * 在选择框的选项中添加分隔符
 * @param {TypeChoices} choices
 * @param {number | number[] | Function | boolean} separator
 * @returns
 */
createSelect.addSeparator = (choices, separator) => {
  if (typeof separator === 'number' && separator > 0) {
    choices.splice(separator, 0, new Separator());
  } else if (Array.isArray(separator) && separator.length > 0) {
    let addedNumber = 0;
    separator.forEach((index) => {
      choices.splice(index + addedNumber, 0, new Separator());
      addedNumber++;
    });
  } else if (typeof separator === 'function') {
    choices = separator(choices);
  } else if (typeof separator === 'boolean' && separator) {
    choices = choices.reduce(
      /**
       * @param {TypeChoices} acc
       * @param {TypeChoice} cur
       */
      (acc, cur) => {
        acc.push(cur, new Separator());
        return acc;
      },
      []
    );
  }

  return choices;
};

export default createSelect;
