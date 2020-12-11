import { NativeScriptConfig } from '@nativescript/core'

export default {
  id: 'org.adroit360gh.legoncitiesfc',
  appResourcesPath: 'App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none',
  },
  appPath: 'src',
} as NativeScriptConfig
