import { Mutation, Module, VuexModule, getModule } from 'vuex-module-decorators'
import store from '@/renderer/store'

@Module({ name: 'Settings', store, dynamic: true })
export default class Settings extends VuexModule {
  public globalKey: string = '' // 全局变量key

  @Mutation
  public setGlobalKey(currentKey: string) {
    this.globalKey = currentKey
  }
}
export const SettingsModule = getModule(Settings)
