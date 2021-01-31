/**
 * 预览组件列表
 */
import './preview_style.less'
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'PreviewMenu',
  props: {
    config:{
      type: Object
    }
  },
  emits: ["dragstart","dragsend"],
  setup(props,cxt){
    const componentsList = computed(()=>props.config.componentsList)

    const handleDragStart = (e, component) => {
      cxt.emit('dragstart', e, component)
    }
    const handleDragEnd = (e) => {
      cxt.emit('dragend', e)
    }

    return ()=>(
      <div class="preview-menu">
        {componentsList.value.map((component)=>(
          <div class="preview-menu-item" 
            draggable
            onDragstart={(e)=>handleDragStart(e,component)}
            onDragend={(e)=>handleDragEnd(e)}>
            <div class="preview-menu-item-label">{component.label}</div>
            <div class="preview-menu-item-comp">{component.preview()}</div>
          </div>)
        )}
      </div>
    )
  }
})