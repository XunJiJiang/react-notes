// @ts-check

import { join } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';

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

/**
 *
 * @param {string} dirPath
 * @returns {Config}
 */
export default function getConfig(dirPath) {
  const configPath = join(dirPath, 'nodeConfig.json');

  if (!existsSync(configPath)) {
    throw new Error(
      `The node ${configPath} does not exist.\n节点 ${dirPath} 不存在, 没有发现配置文件 <nodeConfig.json>`
    );
  }

  const configJSON = readFileSync(configPath, 'utf-8');

  const config = JSON.parse(configJSON);

  return config;
}

/**
 *
 * @param {string} dirPath
 * @returns {Config}
 */
export function getParentConfig(dirPath) {
  const parentConfigPath = join(
    dirPath.replace(/\\/g, '/').split('/').slice(0, -1).join('/')
  );

  return getConfig(parentConfigPath);
}
