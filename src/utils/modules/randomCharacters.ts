type keys = 'uppercase' | 'lowercase' | 'number' | 'symbol';

type value = {
  value: string;
  length: number;
};

const CHARACTERS_map = new Map<keys, value>([
  [
    'uppercase',
    {
      value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      length: 26
    }
  ],
  [
    'lowercase',
    {
      value: 'abcdefghijklmnopqrstuvwxyz',
      length: 26
    }
  ],
  [
    'number',
    {
      value: '0123456789',
      length: 10
    }
  ],
  [
    'symbol',
    {
      value: '!@#$%^&*()_-+=` ~[]{}|;:,.<>?/\\"',
      length: 32
    }
  ]
]);

/**
 * 获取字符集
 * @param param
 * @param param.uppercase
 * @param param.lowercase
 * @param param.number
 * @param param.symbol
 * @returns
 */
function getCharacters({
  uppercase = true,
  lowercase = true,
  number = true,
  symbol = false
}) {
  let result = '';
  let length = 0;
  if (uppercase) {
    result += CHARACTERS_map.get('uppercase')!.value;
    length += CHARACTERS_map.get('uppercase')!.length;
  }
  if (lowercase) {
    result += CHARACTERS_map.get('lowercase')!.value;
    length += CHARACTERS_map.get('lowercase')!.length;
  }
  if (number) {
    result += CHARACTERS_map.get('number')!.value;
    length += CHARACTERS_map.get('number')!.length;
  }
  if (symbol) {
    result += CHARACTERS_map.get('symbol')!.value;
    length += CHARACTERS_map.get('symbol')!.length;
  }
  return [result, length];
}

/**
 * 随机字符
 * @param length
 * @param option
 * @param option.uppercase
 * @param option.lowercase
 * @param option.number
 * @param option.symbol
 * @returns
 */
const randomCharacters = (length = 6, option = {}) => {
  const [CHARACTERS, CHARACTERS_LENGTH] = getCharacters(option);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += String(CHARACTERS).charAt(
      Math.floor(Math.random() * Number(CHARACTERS_LENGTH))
    );
  }
  return result;
};

export default randomCharacters;
