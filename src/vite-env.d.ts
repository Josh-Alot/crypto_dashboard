/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ETHERSCAN_API_KEY?: string;
  readonly VITE_REOWN_PROJECT_ID?: string;
  readonly PROJECT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

