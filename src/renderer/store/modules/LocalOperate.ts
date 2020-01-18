import {
  Module,
  Action,
  VuexModule,
  Mutation,
  getModule
} from 'vuex-module-decorators'
import store from '@/renderer/store'
const { shell } = require('electron').remote

@Module({ name: 'LocalOperate', store, dynamic: true })
export default class LocalOperate extends VuexModule {
  @Mutation
  OPEN_DIR_DIALOG(path: string) {
    shell.showItemInFolder(path)
  }

  @Action
  openPath(path: string) {
    this.OPEN_DIR_DIALOG(path)
  }
}

export const LocalOperateModule = getModule(LocalOperate)
