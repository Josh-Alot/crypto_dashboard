/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly ETHERSCAN_API_KEY?: string;
  readonly REOWN_PROJECT_ID?: string;
  readonly PROJECT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

