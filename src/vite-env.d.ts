/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FONTE_EXERCICIOS?: 'mock' | 'wger'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
