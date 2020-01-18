<template>
  <!-- Local -->
  <div class="local-content">
    <label for="file">
      <div class="upload-area" @drop="fileUpload">
        <div class="top-line">
          <hr class="row-line row-line-top" />
        </div>
        <div class="collmn-line right-line"></div>
        <div class="bottom-line">
          <hr class="row-line row-line-bottom" />
        </div>
        <div class="collmn-line left-line"></div>
        <p class="upload-area-img"></p>
        <span class="upload-area-text">Please drag or click to upload</span>
        <input
          id="file"
          type="file"
          style="display: none;"
          ref="inputBtn"
          @change="fileUpload"
        />
      </div>
    </label>
    <!-- result -->
    <ul id="result-list" class="show-result" v-if="appPicsList.length > 0">
      <li class="thumb-box" v-for="(item, ind) in appPicsList" :key="ind">
        <div class="detail">
          <div class="thumb-left ellp">
            <!-- <img class="thumb" src="static/img/image.svg" alt=""> -->
            <span class="thumb-name" :title="item.name">{{ item.name }}</span>
          </div>
          <div class="prev-size size">
            <span>
              <!-- 123.5 KB -->
              {{ item.size | sizeFormat }}
            </span>
          </div>
        </div>
        <div class="thumb-right ellp">
          <!-- <img class="dir" src="static/img/wenjianjia.svg" alt="">
          <span class="ellp" :title="item.path">{{ item.path }}</span> -->
          <div
            class="progress"
            :class="{
              compressing: item.isSupport && !item.compressedSize,
              success: item.isSupport && item.compressedSize,
              error: !item.isSupport
            }"
          >
            <div class="bar" style="width: 100%;" v-if="item.isSupport"></div>
            <div class="bar" style="width: 100%;" v-else>
              This file type is not supported
            </div>
            <!-- <span class="compressing">Compressing</span>
            <span class="finished">Finished</span> -->
          </div>
        </div>
        <div class="status">
          <span class="next-size size">
            <!-- 678.9 kb -->
            {{ item.compressedSize | sizeFormat }}
          </span>
          <div class="find-percent">
            <span
              class="find"
              v-if="item.compressedSize"
              @click="openPath(item.compressedPath)"
              >查看</span
            >
            <span class="percent" v-if="item.compressedSize"
              >-{{
                Math.ceil(
                  ((item.size - item.compressedSize) / item.size) * 100
                )
              }}%</span
            >
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import fs from 'fs'
import { ipcRenderer } from 'electron'
import { Vue, Component, Watch } from 'vue-property-decorator'
// import { State, Action, Mutation } from 'vuex-class'
import { CounterModule } from '@/renderer/store/modules/Counter'
import { GlobalSettingsModule } from '@/renderer/store/modules/GlobalSettings'
import { LocalOperateModule } from '@/renderer/store/modules/LocalOperate'
import { SettingsModule } from '@/renderer/store/modules/Settings'
import { validityApi } from '../lib/validate'
@Component({
  name: 'Local'
})
export default class Local extends Vue {
  get globalKey() {
    return SettingsModule.globalKey
  }

  private isSingle: boolean = true // 是否是单个文件或单个文件夹
  private appPicsList: Object[] = [] // 渲染待压缩图片列表

  mounted() {
    this.listenFileList()
  }
  private fileUpload(e: any) {
    // 拖拽文件上传
    e.preventDefault()
    e.stopPropagation()
    let fileDataPath: Object[] = []
    if (e.type === 'drop') {
      fileDataPath = e.dataTransfer.files
    } else {
      fileDataPath = e.target.files
    }
    GlobalSettingsModule.SET_GLOBAL_LOAING_TEXT('')
    GlobalSettingsModule.OPEN_GLOBAL_LOAING_STATE()
    validityApi()
      .then(() => {
        GlobalSettingsModule.SET_GLOBAL_LOAING_TEXT('Start Compressing..')
        GlobalSettingsModule.TOGGLE_GLOBAL_LOADING_ERROR_BOX(false)
        setTimeout(_ => {
          GlobalSettingsModule.SET_GLOBAL_LOAING_TEXT('')
          GlobalSettingsModule.TOGGLE_GLOBAL_LOADING_ERROR_BOX(false)
          GlobalSettingsModule.CLOSE_GLOBAL_LOAING_STATE()
        }, 2000)
        if (fileDataPath.length === 1) {
          let fileStat = fs.lstatSync(
            (fileDataPath[0] as { [key: string]: any }).path
          )
          if (fileStat.isFile()) {
            // 文件
            if (
              /^image/gi.test((fileDataPath[0] as { [key: string]: any }).type)
            ) {
              // 支持的图片格式
              ipcRenderer.send(
                'uploadSingleImgMessage',
                (fileDataPath[0] as { [key: string]: any }).path,
                SettingsModule.globalKey,
                this.isSingle
              )
            } else {
              // 不支持的格式
              GlobalSettingsModule.SET_GLOBAL_LOAING_TEXT(
                '请上传合法的图片文件:（'
              )
              GlobalSettingsModule.TOGGLE_GLOBAL_LOADING_ERROR_BOX(true)
              setTimeout(_ => {
                GlobalSettingsModule.SET_GLOBAL_LOAING_TEXT('')
                GlobalSettingsModule.TOGGLE_GLOBAL_LOADING_ERROR_BOX(false)
                GlobalSettingsModule.CLOSE_GLOBAL_LOAING_STATE()
              }, 2000)
            }
          } else {
            // 文件夹
            for (let f of fileDataPath) {
              let filePath = (f as { [key: string]: any }).path
              ipcRenderer.send(
                'uploadMultipleMessage',
                filePath,
                this.globalKey,
                this.isSingle
              )
            }
          }
        } else if (fileDataPath.length > 1) {
          // 多文件 || 多文件夹
          this.isSingle = false
          let fileObj = {}
          for (let f of fileDataPath) {
            ;(fileObj as { [key: string]: any })[
              (f as { [key: string]: any }).type
            ] = 1
          }
          let type
          if (Object.keys(fileObj).length > 1) {
            // TODO: 根据具体需求提示错误
            // this.$store.commit('SET_GLOBAL_LOAING_TEXT', '您上传的格式暂不支持:(')
            // this.$store.commit('TOGGLE_GLOBAL_LOADING_ERROR_BOX', true)
            type = 'dirs_images'
          } else {
            if (Object.keys(fileObj)[0] === '') {
              type = 'dirs'
            } else if (/^image/gi.test(Object.keys(fileObj)[0])) {
              type = 'imgs'
            }
          }
          for (let f of fileDataPath) {
            let filePath = (f as { [key: string]: any }).path
            ipcRenderer.send(
              'uploadMultipleMessage',
              filePath,
              this.globalKey,
              this.isSingle,
              type
            )
          }
        }
      })
      .catch(err => {
        GlobalSettingsModule.SET_GLOBAL_LOAING_TEXT(
          `verification failed with code:${err.status}`
        )
        GlobalSettingsModule.TOGGLE_GLOBAL_LOADING_ERROR_BOX(true)
        setTimeout(_ => {
          GlobalSettingsModule.SET_GLOBAL_LOAING_TEXT('')
          GlobalSettingsModule.TOGGLE_GLOBAL_LOADING_ERROR_BOX(false)
          GlobalSettingsModule.CLOSE_GLOBAL_LOAING_STATE()
        }, 2000)
        // this.$electron.ipcRenderer.send('validateApiLocalError', err)
      })
  }
  private listenFileList() {
    // 监听ipcMain事件
    // 获取要压缩的图片列表
    ipcRenderer.on('filesList', (e, data: Object[]) => {
      if (data) {
        // 这里在本地缓存中存一份 渲染列表
        sessionStorage.setItem('singleImgList', JSON.stringify(data))
        let sessionStorageData: string | null = sessionStorage.getItem(
          'singleImgList'
        )
        if (sessionStorageData) {
          let realRenderList = JSON.parse(sessionStorageData)
          this.appPicsList = realRenderList
        }
      }
    })
    // 获取已经压缩完成的列表 重新计数，重绘图表
    ipcRenderer.on('finishedItem', (event, data: Object[]) => {
      if (data) {
        CounterModule.getCompressedCount(this.globalKey)
        this.appPicsList = data
      }
    })
    // 所有任务已完成，发出通知
    ipcRenderer.on('AllDone', event => {
      if (!('Notification' in window)) {
        console.log('This browser does not support desktop notification')
        return false
      }
      let localNotification = new Notification('Compression succeeded', {
        body: '🎉🎉🎉congratulations!',
        icon: '../../../build/icons/logo.png'
      })
      localNotification.onclick = () => {
        console.log('通知被点击')
      }
    })
    // 压缩数量超过限制500张，提醒
    ipcRenderer.on('limitCountErrorEvent', event => {
      GlobalSettingsModule.SET_GLOBAL_LOAING_TEXT('当前Key本月已达到上限500！')
      GlobalSettingsModule.TOGGLE_GLOBAL_LOADING_ERROR_BOX(true)
      setTimeout(_ => {
        GlobalSettingsModule.SET_GLOBAL_LOAING_TEXT('')
        GlobalSettingsModule.TOGGLE_GLOBAL_LOADING_ERROR_BOX(false)
        GlobalSettingsModule.CLOSE_GLOBAL_LOAING_STATE()
      }, 2000)
    })
  }
  private openPath(path: string) {
    // 根据path打开对话框
    LocalOperateModule.openPath(path)
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

div.progress {
  width: 100%;
  height: 100%;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  float: left;
  white-space: nowrap;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  position: relative;
}
div.progress div.bar:after {
  content: 'Compressing';
}
div.progress.success div.bar:after {
  content: 'Finished';
}
div.progress div.bar {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  -webkit-box-shadow: rgba(0, 0, 0, 0.08) 0 -0.96rem 1.6rem 0 inset;
  box-shadow: rgba(0, 0, 0, 0.08) 0 -0.96rem 1.6rem 0 inset;
  -webkit-animation: progress 1.5s linear 0s infinite;
  -moz-animation: progress 1.5s linear 0s infinite;
  -o-animation: progress 1.5s linear 0s infinite;
  -ms-animation: progress 1.5s linear 0s infinite;
  animation: progress 1.5s linear 0s infinite;
  background: -webkit-linear-gradient(
    315deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0) 31%,
    rgba(0, 0, 0, 0.05) 33%,
    rgba(0, 0, 0, 0.05) 67%,
    rgba(0, 0, 0, 0) 69%
  );
  background: -moz-linear-gradient(
    315deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0) 31%,
    rgba(0, 0, 0, 0.05) 33%,
    rgba(0, 0, 0, 0.05) 67%,
    rgba(0, 0, 0, 0) 69%
  );
  background: -o-linear-gradient(
    315deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0) 31%,
    rgba(0, 0, 0, 0.05) 33%,
    rgba(0, 0, 0, 0.05) 67%,
    rgba(0, 0, 0, 0) 69%
  );
  background: -ms-linear-gradient(
    315deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0) 31%,
    rgba(0, 0, 0, 0.05) 33%,
    rgba(0, 0, 0, 0.05) 67%,
    rgba(0, 0, 0, 0) 69%
  );
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0) 31%,
    rgba(0, 0, 0, 0.05) 33%,
    rgba(0, 0, 0, 0.05) 67%,
    rgba(0, 0, 0, 0) 69%
  );
  -webkit-background-size: 4.8rem 2.2rem;
  -moz-background-size: 4.8rem 2.2rem;
  background-size: 4.8rem 2.2rem;
}

div.progress div.bar:after {
  position: absolute;
  margin: 0;
  width: 100%;
  height: 100%;
  padding: 3px 0;
  font-size: 16px;
  font-weight: normal;
  text-align: center;
  opacity: 0.9;
  -ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=90)';
  filter: alpha(opacity=90);
  line-height: 1em;
  color: #fff;
}
div.progress.error div.bar,
div.progress.limited div.bar {
  width: 100%;
  background-color: #f94c00;
  -webkit-animation: none;
  -moz-animation: none;
  -o-animation: none;
  -ms-animation: none;
  animation: none;
  background-image: none;
  text-shadow: none;
  text-align: center;
  color: #fff;
  font-weight: bold;
  -webkit-font-smoothing: antialiased;
  line-height: 20px;
  font-size: 14px;
}
div.progress.success div.bar {
  background: #94e623;
}

div.progress.compressing div.bar {
  width: 100%;
  background-color: #3ee283;
}

@-moz-keyframes progress {
  from {
    background-position: 0;
  }

  to {
    background-position: 4.8rem;
  }
}

@-webkit-keyframes progress {
  from {
    background-position: 0;
  }

  to {
    background-position: 4.8rem;
  }
}

@-o-keyframes progress {
  from {
    background-position: 0;
  }

  to {
    background-position: 4.8rem;
  }
}

@keyframes progress {
  from {
    background-position: 0;
  }

  to {
    background-position: 4.8rem;
  }
}
</style>
