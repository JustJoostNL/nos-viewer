import { EventEmitter } from "events";
import deepEqual from "deep-equal";
import { BaseDirectory, appDataDir } from "@tauri-apps/api/path";
import { mkdir, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { IConfig } from "./config_types";

import { defaultConfig } from "./defaultConfig";

const configEventEmitter = new EventEmitter();

let globalConfig: IConfig = {
  ...defaultConfig,
};

export function removeDefaultConfig(config: IConfig): Partial<IConfig> {
  return Object.fromEntries(
    Object.entries(config).filter(
      ([key, value]) => !deepEqual(defaultConfig[key as keyof IConfig], value),
    ),
  );
}

export async function intializeConfig() {
  const config = await readConfig();

  globalConfig = {
    ...defaultConfig,
    ...config,
  };
}

async function hasConfig() {
  try {
    await readTextFile("config.json", { baseDir: BaseDirectory.AppData });
    return true;
  } catch (err) {
    return false;
  }
}

async function ensurePathExists() {
  const appDataDirPath = await appDataDir();
  await mkdir(appDataDirPath, { recursive: true });
}

async function readConfig(): Promise<IConfig> {
  try {
    const configJSON = await readTextFile("config.json", {
      baseDir: BaseDirectory.AppData,
    });
    return JSON.parse(configJSON);
  } catch (err) {
    return defaultConfig;
  }
}

async function getConfig() {
  if (!(await hasConfig())) return defaultConfig;
  const config = await readConfig();
  return {
    ...defaultConfig,
    ...config,
  };
}

async function setConfig(config: IConfig) {
  const configJSON = JSON.stringify(removeDefaultConfig(config));
  configEventEmitter.emit("change", config);

  await ensurePathExists();
  await writeTextFile("config.json", configJSON, {
    baseDir: BaseDirectory.AppData,
  });

  globalConfig = {
    ...defaultConfig,
    ...removeDefaultConfig(config),
  };
}

async function patchConfig(configPatch: Partial<IConfig>) {
  const config = await getConfig();
  const newConfig = { ...config, ...configPatch };
  await setConfig(newConfig);
}

export { globalConfig, configEventEmitter, getConfig, setConfig, patchConfig };
