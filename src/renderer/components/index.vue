<template>
  <div class="work-area">
    <ul class="tabs">
      <li
        class="tab tab-settings"
        v-for="(item, ind) in navList"
        :key="ind"
        @click="jumpMap(ind)"
      >
        <span
          :class="{
            'icon-local': item.name === 'Local',
            'icon-online': item.name === 'Online',
            'icon-settings': item.name === 'Settings'
          }"
          class="icon-left"
        ></span>
        <span class="tab-text">{{ item.name }}</span>
        <i :class="{ 'after-icon': activeNavInd === ind }"></i>
      </li>
      <div class="charts-loading" v-show="!count">
        <img src="../../../static/img/load/loading.gif" alt="" />
      </div>
      <div class="charts-box" v-show="count">
        <!-- <span class="charts-title">Usage of 500 pictures：{{ count }}</span> -->
        <div id="charts" class="charts"></div>
      </div>
      <p class="statement">
        <span>smaller and faster</span>
      </p>
      <!-- <i class="copyright">&copy;zhiozhou@Cid</i> -->
    </ul>
    <div class="content">
      <Local v-show="activeNavInd === 0" />
      <Online v-show="activeNavInd === 1" />
      <Settings v-show="activeNavInd === 2" />
    </div>
    <div class="global-loading-box" v-show="isShowGlobalLoading">
      <div class="global-loading-wrapper">
        <div class="loader" v-show="!isShowGlobalErrorBox">
          <div class="face">
            <div class="circle"></div>
          </div>
          <div class="face">
            <div class="circle"></div>
          </div>
        </div>
        <div class="global-loading-wrong" v-show="isShowGlobalErrorBox"></div>
        <div class="loading-text">{{ globalLoadingText }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from 'electron'
import { Vue, Component, Watch } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
// import { State, Action, namespace } from 'vuex-class'
import { CounterModule } from '@/renderer/store/modules/Counter'
import { GlobalSettingsModule } from '@/renderer/store/modules/GlobalSettings'
import { LocalOperateModule } from '@/renderer/store/modules/LocalOperate'
import { SettingsModule } from '@/renderer/store/modules/Settings'
import Local from '@/renderer/components/Local.vue'
import Online from '@/renderer/components/Online.vue'
import Settings from '@/renderer/components/Settings.vue'
import echarts from 'echarts'
interface INavList {
  name: string
}

// const counterModule = namespace('Counter')
// const globalSettingsModule = namespace('GlobalSettings')
// const localOpertateModule = namespace('LocalOperate')
// const settingsModule = namespace('Settings')

@Component({
  name: 'CompressYourImages',
  components: {
    Local,
    Online,
    Settings
  }
})
export default class CompressYourImages extends Vue {
  get count() {
    return CounterModule.count
  }
  get globalKey() {
    return SettingsModule.globalKey
  }
  get isShowGlobalLoading() {
    return GlobalSettingsModule.isShowGlobalLoading
  }
  get globalLoadingText() {
    return GlobalSettingsModule.globalLoadingText
  }
  get isShowGlobalErrorBox() {
    return GlobalSettingsModule.isShowGlobalErrorBox
  }

  private activeNavInd: number = 0 // 激活的nav
  private navList: INavList[] = [
    {
      name: 'Local'
    },
    {
      name: 'Online'
    },
    {
      name: 'Settings'
    }
  ]
  mounted() {
    // 获取当前apikey下载量
    this.getImagesCount()
    // 设置apicount值
    this.listenCount()
  }
  @Watch('count')
  onCountChange(newV: number, oldV: number) {
    // 设置图表
    if (newV) {
      this.setPieCharts()
    }
  }
  private jumpMap(ind: number) {
    this.activeNavInd = ind
  }
  private getImagesCount() {
    CounterModule.getCompressedCount(this.globalKey)
  }
  private setPieCharts() {
    let pieCharts = (echarts as any).init(document.getElementById('charts'))
    let options = {
      title: {
        show: false,
        text: 'Usage of 500 pictures',
        textStyle: {
          color: '#cdd0d5',
          fontSize: 16,
          fontWeight: 400
        },
        x: 'center',
        y: 'bottom'
      },
      series: [
        {
          type: 'pie',
          radius: '80%',
          center: ['50%', '50%'],
          selectedMode: 'single',
          label: {
            normal: {
              position: 'inner',
              formatter: '{b}({c}): {d}%'
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [
            { value: this.count, name: 'used', selected: true },
            { value: 500 - this.count, name: 'unused' }
          ]
        }
      ],
      color: [
        new (echarts as any).graphic.RadialGradient(0.5, 0.5, 1, [
          {
            offset: 0,
            color: 'rgb(255, 255, 255)'
          },
          {
            offset: 1,
            color: 'rgb(251, 118, 123)'
          }
        ]),
        new (echarts as any).graphic.RadialGradient(0.5, 0.5, 1, [
          {
            offset: 0,
            color: 'rgb(155, 155, 255)'
          },
          {
            offset: 1,
            color: 'rgb(129, 227, 238)'
          }
        ])
      ]
    }
    pieCharts.setOption(options)
  }
  private listenCount() {
    ipcRenderer.on('rebuildCount', (event, data: Object[]) => {
      if (data) {
        this.getImagesCount()
      }
    })
  }
}
</script>

<style>
.loader {
  width: 100px;
  height: 100px;
  font-size: 10px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  margin-bottom: 5px;
}

.loader .face {
  position: absolute;
  border-radius: 50%;
  border-style: solid;
  animation: animate 1.5s linear infinite;
}

.loader .face:nth-child(1) {
  width: 100%;
  height: 100%;
  color: gold;
  border-color: currentColor transparent transparent currentColor;
  border-width: 0.2em 0.2em 0em 0em;
  --deg: -45deg;
  animation-direction: normal;
}

.loader .face:nth-child(2) {
  width: 70%;
  height: 70%;
  color: lime;
  border-color: currentColor currentColor transparent transparent;
  border-width: 0.2em 0em 0em 0.2em;
  --deg: -135deg;
  animation-direction: reverse;
}

.loader .face .circle {
  position: absolute;
  width: 50%;
  height: 0.1em;
  top: 50%;
  left: 50%;
  background-color: transparent;
  transform: rotate(var(--deg));
  transform-origin: left;
}

.loader .face .circle::before {
  position: absolute;
  top: -0.5em;
  right: -0.5em;
  content: '';
  width: 1em;
  height: 1em;
  background-color: currentColor;
  border-radius: 50%;
  box-shadow: 0 0 2em, 0 0 4em, 0 0 6em, 0 0 8em, 0 0 10em,
    0 0 0 0.5em rgba(255, 255, 0, 0.1);
}

@keyframes animate {
  to {
    transform: rotate(1turn);
  }
}
</style>
