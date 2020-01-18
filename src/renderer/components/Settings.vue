<template>
  <!-- Settings -->
  <div class="settings-content">
    <div class="set-title">
      <span>Set your Api keys here</span>
      <div class="set-apikey-text" @click="openExternal">去获取Apikey..</div>
    </div>
    <div class="api-keys-list">
      <div class="api-key" v-for="(apiKey, ind) in keysList" :key="ind">
        <input
          type="text"
          class="settings-key"
          placeholder="Tinypng Api key..."
          :value="apiKey"
          @input="updateCurrentApiKey(ind)"
          ref="inputs"
        />
        <div class="switch-box is-success">
          <input
            :id="'apiKey' + ind"
            name="apiKey"
            class="switch-box-input"
            type="radio"
            :checked="activeKeyInd === ind"
            @click="setActiveKey(ind)"
          />
          <label :for="'apiKey' + ind" class="switch-box-slider"></label>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { shell, Input } from 'electron'
import { Component, Watch } from 'vue-property-decorator'
// import { State, Action, Mutation } from 'vuex-class'
import { CounterModule } from '@/renderer/store/modules/Counter'
import { SettingsModule } from '@/renderer/store/modules/Settings'

@Component({
  name: 'Settings'
})
export default class Settings extends Vue {
  private tinypngApiLink: string = 'https://tinypng.com/developers'
  private keysList: string[] = [
    'fvDPnGNpDZRJsrtR5KdM4Qcbp8RvcYhN',
    // '8qv069yMQM9KGBj2yk6HnSpskZTYB7KK',
    '',
    '',
    '',
    ''
  ]
  private activeKeyInd: number = 0 // 激活的key索引
  private activeKey: string = '' // 激活的key

  mounted() {
    this.activeKeyInd = Number(localStorage.getItem('keyInd')) || 0
    this.activeKey = localStorage.getItem('activeKey') || ''
    if (!localStorage.getItem('tinyKeys')) {
      localStorage.setItem('tinyKeys', JSON.stringify([]))
      let localTinyKeys: string | null = localStorage.getItem('tinyKeys')
      if (
        localTinyKeys &&
        localTinyKeys !== 'undefind' &&
        localTinyKeys !== 'null'
      ) {
        let localTinyKeysParsed = JSON.parse(localTinyKeys)
        for (let k of this.keysList) {
          localTinyKeysParsed.push(k)
        }
        localStorage.setItem('tinyKeys', JSON.stringify(localTinyKeysParsed))
      }
    } else {
      let localTinyKeys: string | null = localStorage.getItem('tinyKeys')
      if (
        localTinyKeys &&
        localTinyKeys !== 'undefind' &&
        localTinyKeys !== 'null'
      ) {
        this.keysList = JSON.parse(localTinyKeys)
      }
    }
    SettingsModule.setGlobalKey(this.keysList[this.activeKeyInd])
  }
  private setActiveKey(ind: number) {
    // 设置当前激活的key
    this.activeKeyInd = ind
    this.activeKey = this.keysList[ind]
    localStorage.setItem('keyInd', '' + ind)
    CounterModule.getCompressedCount(this.keysList[ind])
    localStorage.setItem('activeKey', JSON.stringify(this.keysList[ind]))
  }
  private updateCurrentApiKey(ind: number) {
    // 监听当前对input apikey的操作
    if (ind === this.activeKeyInd) {
      this.activeKey = (this.$refs.inputs as HTMLElement)[ind].value
      localStorage.setItem('activeKey', JSON.stringify(this.activeKey))
      // this.setGlobalKey(this.activeKey)
      SettingsModule.setGlobalKey(this.keysList[this.activeKeyInd])
    }
    this.keysList[ind] = this.$refs.inputs[ind].value
    localStorage.setItem('tinyKeys', JSON.stringify(this.keysList))
  }
  private openExternal() {
    // 打开外部链接
    shell.openExternal(this.tinypngApiLink)
  }
}
</script>

<style scoped></style>
