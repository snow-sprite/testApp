declare module 'echarts' {
  interface Vue {
    echarts: any
  }
  interface Graphic {
    RadialGradient: any
  }
}
declare module 'vue/types/vue' {
  interface Vue {
    [key: string]: any
  }
}
