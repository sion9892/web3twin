/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_NEYNAR_API_KEY?: string
  readonly VITE_COINBASE_API_KEY?: string
  readonly VITE_WALLETCONNECT_PROJECT_ID?: string
  readonly VITE_BASE_RPC_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}


