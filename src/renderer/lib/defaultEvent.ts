// vue mixin { dragEvent }
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'defaultDragEvent'
})
export class defaultDragEvent extends Vue {
  mounted() {
    this.disableDocumentDrag()
  }
  public disableDocumentDrag() {
    document.addEventListener('dragenter', this.disableDragEvent)
    document.addEventListener('dragover', this.disableDragEvent)
    document.addEventListener('drop', this.disableDragEvent)
  }
  public disableDragEvent(e: any) {
    e.stopPropagation()
    e.preventDefault()
  }
}

// vue mixin { refreshEvent }
@Component({
  name: 'defaultRefreshEvent'
})
export class defaultRefreshEvent extends Vue {
  mounted() {
    this.disableRefreshEvent()
  }
  public disableRefreshEvent() {
    // windows默认禁用f5刷新， 这里主要是禁止ctrl+R刷新
    document.addEventListener('keydown', function(event) {
      event = event || window.event
      let code = event.keyCode || event.which
      if ((event.metaKey || event.ctrlKey) && code === 82) {
        event.preventDefault()
        event.stopPropagation()
        event.cancelBubble = true
        return false
      }
    })
  }
}
