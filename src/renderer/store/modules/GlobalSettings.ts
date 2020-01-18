import { Module, VuexModule, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/renderer/store'

// export interface IGlobalSettings {
//   isShowGlobalLoading: boolean
//   globalLoadingText: string
//   isShowGlobalErrorBox: boolean
// }
@Module({ name: 'GlobalSettings', store, dynamic: true })
export default class GlobalSettings extends VuexModule {
  // 全局loading
  public isShowGlobalLoading: boolean = false
  // 全局loading文案
  public globalLoadingText: string = ''
  // 展示全局错误提示
  public isShowGlobalErrorBox: boolean = false

  @Mutation
  public OPEN_GLOBAL_LOAING_STATE() {
    this.isShowGlobalLoading = true
  }
  @Mutation
  public CLOSE_GLOBAL_LOAING_STATE() {
    this.isShowGlobalLoading = false
  }
  @Mutation
  public TOGGLE_GLOBAL_LOADING_ERROR_BOX(status: boolean) {
    this.isShowGlobalErrorBox = status
  }
  @Mutation
  public SET_GLOBAL_LOAING_TEXT(text: string) {
    this.globalLoadingText = text
  }
}

export const GlobalSettingsModule = getModule(GlobalSettings)
