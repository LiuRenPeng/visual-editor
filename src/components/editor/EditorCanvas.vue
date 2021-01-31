<!-- 画布组件 -->
<template>
  <div ref="canvasRef" :class="['editor-canvas', isPc?'':'mobile']" 
    :style="`width:${canvasWidth}px;height:${canvasHeight}px`">
    <EditorBlock v-for="(block, index) in blocks" :key="`block_${block.name}_${index}`" :block="block" ></EditorBlock>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import EditorBlock from './EditorBlock';
export default {
  name: 'EditorCanvas',
  components:{
    EditorBlock
  },
  props: {
    isPc:{
      type: Boolean,
      default: true
    },
    editorStyle:{
      type: Object
    },
    dragHandler:{
      type: Object
    },
    blocks:{
      type: Array
    }
  },
  setup(props){
    const canvasRef = ref(null)
    const canvasWidth = computed(()=>props.editorStyle.canvasWidth);
    const canvasHeight = computed(()=>props.editorStyle.canvasHeight);
    onMounted(()=>{
      console.log('editorCanvas mounted')
      canvasRef.value.addEventListener('dragenter', props.dragHandler.dragenter)
      canvasRef.value.addEventListener('dragover', props.dragHandler.dragover)
      canvasRef.value.addEventListener('dragleave', props.dragHandler.dragleave)
      canvasRef.value.addEventListener('drop', props.dragHandler.drop)
    })
    onUnmounted(()=>{
      canvasRef.value.removeEventListener('dragenter', props.dragHandler.dragenter)
      canvasRef.value.removeEventListener('dragover', props.dragHandler.dragover)
      canvasRef.value.removeEventListener('dragleave', props.dragHandler.dragleave)
      canvasRef.value.removeEventListener('drop', props.dragHandler.drop)
    })

    /*计算选中与未选中的block数据*/
    // const focusData = computed(() => {
    //   let focus = [];
    //   let unFocus = [];
    //   (props.blocks || []).forEach(block => (block.focus ? focus : unFocus).push(block))
    //   return {
    //     focus,      // 此时选中的数据
    //     unFocus    // 此时未选中的数据
    //   }
    // })

    // const methods = {
    //   // 画布点击
    //   canvasMouseDown(e){
    //     e.preventDefault()
    //     if (e.currentTarget !== e.target) return;
    //     if (!e.shiftKey) {
    //       /*点击空白处，清空所有选中的block*/
    //       methods.clearFocus()
    //       state.selectBlock = null
    //     }
    //   },
    //   // 组件点击
    //   blockMousedown: (e, block) => {
    //     if (e.shiftKey) {
    //       /* 如果摁住了shift键，如果此时没有选中的block，就选中这个block，否则去掉 */
    //       if (focusData.value.focus.length <= 1) {
    //           block.focus = true
    //       } else {
    //           block.focus = !block.focus
    //       }
    //     } else {
    //       /*如果点击的这个block没有被选中，才清空这个其他选中的block，否则不做任何事情。放置拖拽多个block，取消其他block的选中状态*/
    //       if (!block.focus) {
    //           block.focus = true
    //           methods.clearFocus(block)
    //       }
    //     }
    //     state.selectBlock = block
    //     blockDraggier.mousedown(e)
    //   },
    //   clearFocus : (block) => {
    //     let blocks = (props.blocks || []);
    //     if (blocks.length === 0) return
    //     if (block) {
    //         blocks = blocks.filter(item => item !== block)
    //     }
    //     blocks.forEach(block => block.focus = false)
    //   },
    //   updateBlocks: (blocks) => {
    //     dataModel.value = {...dataModel.value, blocks,}
    //   }
    // }
    /*处理block选中的相关动作*/
    // const canvasMouseDown = (e) => {
    //   e.preventDefault()
    //   if (e.currentTarget !== e.target) {
    //     return
    //   }
    //   if (!e.shiftKey) {
    //     /*点击空白处，清空所有选中的block*/
    //     methods.clearFocus()
    //     state.selectBlock = null
    //   }
    // }
    // const focusHandler = (() => {
    //   return {
    //     container: {
    //       onMousedown: (e) => {
    //         e.preventDefault()
    //         if (e.currentTarget !== e.target) {
    //             return
    //         }
    //         if (!e.shiftKey) {
    //             /*点击空白处，清空所有选中的block*/
    //             methods.clearFocus()
    //             state.selectBlock = null
    //         }
    //       },
    //     },
    //     block: {
    //       onMousedown: (e, block) => {
    //         if (e.shiftKey) {
    //           /*如果摁住了shift键，如果此时没有选中的block，就选中这个block，否则令这个block的选中状态去翻*/
    //           if (focusData.value.focus.length <= 1) {
    //               block.focus = true
    //           } else {
    //               block.focus = !block.focus
    //           }
    //         } else {
    //           /*如果点击的这个block没有被选中，才清空这个其他选中的block，否则不做任何事情。放置拖拽多个block，取消其他block的选中状态*/
    //           if (!block.focus) {
    //               block.focus = true
    //               methods.clearFocus(block)
    //           }
    //         }
    //         state.selectBlock = block
    //         blockDraggier.mousedown(e)
    //       },
    //     },
    //   }
    // })();
    return {
      canvasRef,
      canvasWidth,
      canvasHeight,
      // canvasMouseDown,
      // focusData,
      // ...methods
    }
  }
}
</script>

<style lang="less">
.editor-canvas{
  background: #ffffff;
  width: 960px;
  height: 540px;
  box-shadow: 0 0 10px #aaaaaa;
  position: relative;
  &.mobile{
    width: 375px;
    height: 812px;
  }
}
</style>