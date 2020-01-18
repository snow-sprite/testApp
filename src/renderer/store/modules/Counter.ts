import { Commit, Dispatch } from 'vuex'
import tinify from 'tinify'
import store from '@/renderer/store'
import { validityApi } from '../../lib/validate'
import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule
} from 'vuex-module-decorators'

export interface IState {
  count: number
}

@Module({ name: 'Counter', store, dynamic: true })
export default class Counter extends VuexModule {
  public count: number = 0

  @Mutation
  public CALCULATE_COUNT(count: number) {
    this.count = count
  }

  @Action
  getCompressedCount(apiKey: string) {
    // 设置0显示小仓鼠
    this.CALCULATE_COUNT(0)
    tinify.key = apiKey

    validityApi()
      .then(() => {
        let tiniCount: number = Number(tinify.compressionCount)
        this.CALCULATE_COUNT(tiniCount)
      })
      .catch(_ => {
        this.CALCULATE_COUNT(0)
      })
  }
}

export const CounterModule = getModule(Counter)
