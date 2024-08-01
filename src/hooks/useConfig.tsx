import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { defaultConfig } from "../lib/config/defaultConfig";
import { IConfig } from "../lib/config/config_types";
import { configEventEmitter, getConfig, setConfig } from "../lib/config/config";

export const ConfigContext = createContext<IConfig>(defaultConfig);

export function useConfig() {
  const currentConfig = useContext(ConfigContext);

  const _setConfig = useCallback(async (config: IConfig) => {
    await setConfig(config);
  }, []);

  const updateConfig = useCallback(
    async (config: Partial<IConfig>) => {
      await setConfig({ ...currentConfig, ...config });
    },
    [currentConfig],
  );

  return {
    config: currentConfig,
    setConfig: _setConfig,
    updateConfig,
  };
}

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<IConfig>(defaultConfig);

  useEffect(() => {
    const configChangeHandler = (newConfig: IConfig) => {
      setConfig(newConfig);
    };

    configEventEmitter.on("change", configChangeHandler);

    return () => {
      configEventEmitter.off("change", configChangeHandler);
    };
  }, []);

  useEffect(() => {
    getConfig().then((newConfig) =>
      setConfig({ ...defaultConfig, ...newConfig }),
    );
  }, []);

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
}
