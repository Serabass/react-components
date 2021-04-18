export interface AjaxCacheSettings {
  enabled: boolean;
  lifetime: number;
  storage?: 'localstorage' | string;
}
