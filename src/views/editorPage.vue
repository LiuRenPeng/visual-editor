<template>
  <div class="editor-wrapper">
    <!-- 顶部按钮栏 -->
    <div class="editor-header">
      <div class="editor-header-left" v-if="isEdit">
        <!-- <Button icon="el-icon-files" name="图层面板" :active="showLayers" @click="handleClickBtn('layers')"></Button> -->
        <Button icon="el-icon-box" name="组件面板" :active="showComponents" @click="handleClickBtn('components')"></Button>
        <Button icon="el-icon-s-cooperation" name="工具面板" :active="showTools" @click="handleClickBtn('tools')"></Button>
        <Button icon="el-icon-s-operation" name="配置面板" :active="showOptions" @click="handleClickBtn('options')"></Button>
      </div>
      <div class="editor-header-center">
        <el-button-group>
          <Button icon="el-icon-monitor" name="pc端" :active="isPc" @click="handleChangeType"></Button>
          <Button icon="el-icon-mobile" name="移动端" :active="!isPc" @click="handleChangeType"></Button>
        </el-button-group>
      </div>
      <div class="editor-header-right">
        <Button v-if="isEdit" icon="el-icon-upload" name="保存" @click="handleSave"></Button>
        <Button v-else icon="el-icon-edit-outline" name="编辑" @click="handleSave"></Button>
        <Button icon="el-icon-view" name="预览" @click="handlePreview"></Button>
        <Button icon="el-icon-s-promotion" name="发布" @click="handleSubmit"></Button>
      </div>
    </div>
    <div class="editor-content">
      <!-- 左侧组件列表区域，展示所有可选组件，并支持拖拽到中间操作区域，且不可直接使用 -->
      <div :class="['editor-components-panel',showComponents?'show':'']">
        <div class="panel-title">组件列表</div>
        <PreviewMenu :config="editorConfig" @dragstart="menuDraggier.dragstart" @dragend="menuDraggier.dragend"></PreviewMenu>
      </div>
      <!-- 中间操作区域，拖拽操作组件的位置，层级，删除 -->
      <div class="editor-body">
        <div :class="['editor-tools-panel',showTools?'show':'' ]">
          <Button icon="el-icon-refresh-left" name="撤销" @click="handleClickTool('back')"></Button>
          <Button icon="el-icon-refresh-right" name="重做" @click="handleClickTool('reback')"></Button>
          <Button icon="el-icon-download" name="导入" @click="handleClickTool('in')"></Button>
          <Button icon="el-icon-upload2" name="导出" @click="handleClickTool('out')"></Button>
          <Button icon="el-icon-delete" name="清空" @click="handleClickTool('clear')"></Button>
        </div>
        <div class="editor-container">
          <EditorCanvas :editorStyle="editorStyle" :dragHandler="menuDraggier.dragHandler" :blocks="blocks" />
        </div>
      </div>
      <!-- 右侧配置区域，设置当前选中组件的配置属性 -->
      <div :class="['editor-options-panel', showOptions?'show':'']">
        <div class="panel-title">设置项</div>
        <div class="options-item">
          <span class="options-item-label">画布宽度：</span>
          <el-input v-model="canvasWidth"></el-input>
        </div>
        <div class="options-item">
          <span class="options-item-label">画布高度：</span>
          <el-input v-model="canvasHeight"></el-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed} from 'vue';
import Button from '../components/baseComponents/Button.vue';
import EditorCanvas from '../components/editor/EditorCanvas.vue';
import PreviewMenu from '../components/editor/PreviewMenu';

import visualConfig from '../components/visualConfig/componentsList';
import { useModel, createEvent, createNewBlock } from '../components/function/utils';

export default defineComponent({
  name: 'editorPage',
  props: {
    componentsJson: Object,
    modelValue: Object
  },
  components: {
    Button,
    EditorCanvas,
    PreviewMenu
  },
  setup(props,ctx){
    const canvasWidth = ref('');
    const canvasHeight = ref('');

    const dataModel = useModel(()=>props.modelValue, val=>ctx.emit('update:modelValue',val))
    console.log(dataModel)
    const editorStyle = computed(()=>({
      // width: `${dataModel.value.container.width}px`,
      // height:`${dataModel.value.container.height}px`,
      canvasWidth: `${canvasWidth.value}`,
      canvasHeight:`${canvasHeight.value}`,
    }))
    console.log(editorStyle.value)
    const isEdit = ref(true);
    const isPc = ref(true);
    const showLayers = ref(false);
    const showComponents = ref(true);
    const showOptions = ref(true);
    const showTools = ref(true);

    const editorConfig = ref(visualConfig); // 组件列表
    const blocks = ref([]); // 画布中渲染的组件

    const dragstart = createEvent()
    const dragend = createEvent()

    // 拖拽
    const menuDraggier = (() => {
      let component = null
      
      const dragHandler = {
          /*拖拽菜单组件，进入容器的时候，设置鼠标为可放置状态*/
          dragenter: (e) => e.dropEffect = 'move',
          /*拖拽菜单组件，鼠标在容器中移动的时候，禁用默认事件*/
          dragover: (e) => e.preventDefault(),
          /*如果拖拽过程中，鼠标离开了容器，设置鼠标为不可放置的状态*/
          dragleave: (e) => e.dropEffect = 'none',
          /*在容器中放置的时候，用事件对象的 offsetX，和offsetY添加一条组件数据*/
          drop: (e) => {
            console.log('放置组件')
            console.log(e)
            console.log(component)
              // const blocks = [...dataModel.value.blocks || []]
              blocks.value.push(createNewBlock({component, top: e.offsetY, left: e.offsetX,}))
              // methods.updateBlocks(blocks)
              dragend.emit()
          },
      }

      return {
          /*
          *  处理拖拽菜单组件开始动作
          */
          dragstart: (e, current) => {
            console.log('-------drag start--------')
            console.log(e)
            component = current
            dragstart.emit()
          },
          /*
          *  处理拖拽菜单组件结束动作
          */
          dragend: (e) => {
            console.log('-------drag end--------')
            console.log(e)
            component = null
          },

          dragHandler
      }
  })();

  /*对外暴露的一些方法*/
    // const methods = {
    //     clearFocus : (block) => {
    //         let blocks = (dataModel.value.blocks || []);
    //         if (blocks.length === 0) return
    //         if (block) {
    //             blocks = blocks.filter(item => item !== block)
    //         }
    //         blocks.forEach(block => block.focus = false)
    //     },
    //     updateBlocks: (blocks) => {
    //         dataModel.value = {...dataModel.value, blocks,}
    //     }
    // }

    const method = {
      handleClickTool(type){
        console.log(type)
      },
      handleSave(){
        isEdit.value = !isEdit.value
      },
      handlePreview(){
        // 切换到全屏展示
        console.log('预览')
      },
      handleSubmit(){
        // 生成外部访问链接
        console.log('发布')
      },
      handleClickBtn(type){
        if(type === 'layers'){
          showLayers.value = !showLayers.value
        } else if(type === 'components'){
          showComponents.value = !showComponents.value
        } else if(type === 'options'){
          showOptions.value = !showOptions.value
        } else {
          showTools.value = !showTools.value
        }
      },
      handleChangeType(){
        isPc.value = !isPc.value
      }
    }
    
    return {
      isEdit,
      isPc,
      showLayers,
      showComponents,
      showOptions,
      showTools,
      canvasWidth,
      canvasHeight,
      editorStyle,
      editorConfig,
      blocks,
      menuDraggier,
      ...method
    }
  }
});
</script>

<style lang="less" scoped>
@import '../assets/less/common.less';
.editor-wrapper{
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  color: @font-color;
  .editor-header{
    width: 100%;
    height: 60px;
    background: #ffffff;
    padding: 10px 30px;
    box-shadow: 0 2px 3px #dddddd;
    box-sizing: border-box;
    display: flex;
    z-index: 10;
    position: relative;
    .editor-header-left{
      margin-right: 30px;
    }
    .editor-header-center{
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      .editor-btn{
        margin: 0;
      }
    }
    .editor-header-right{
      margin-left: auto;
      display: flex;
    }
  }
  
  .editor-content{
    width: 100vw;
    height: 100%;
    overflow: hidden;
    display: flex;
    position: relative;
    .editor-components-panel{
      width: 0;
      background: #ffffff;
      transition: all 0.2s ease;
      border-right: 1px solid #cccccc;
      overflow: hidden;
      flex-shrink: 0;
      &.show{
        width: 200px;
      }
    }
    .editor-body{
      flex: 1;
      display: flex;
      flex-direction: column;
      max-width: 100vw;
      min-width: calc(100vw - 450px);
      .editor-tools-panel{
        height: 0;
        width: 100%;
        background: #ffffff;
        padding: 0 20px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #cccccc;
        transition: all 0.2s ease;
        z-index: 1;
        overflow: hidden;
        &.show{
          height: 60px;
        }
      }
      .editor-container{
        flex: 1;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(90deg, rgba(180, 180, 180, 0.4) 10%, rgba(0, 0, 0, 0) 10%), linear-gradient(rgba(180, 180, 180, 0.4) 10%, rgba(0, 0, 0, 0) 10%); 
        background-size: 10px 10px;
        position: relative;
        overflow-y: auto;
        overflow-x: auto;
        padding: 50px;
        box-sizing: border-box;
      }
    }
    .editor-options-panel{
      flex-shrink: 0;
      width: 0;
      height: 100%;
      background: #ffffff;
      border-left: 1px solid #cccccc;
      // position: absolute;
      // top: 0;
      // right: -250px;
      transition: all 0.2s ease;
      z-index: 2;
      &.show{
        width: 250px;
      }
      .options-item{
        margin: 20px;
        display: flex;
        // justify-content: center;
        align-items: center;
        .options-item-label{
          flex-shrink: 0;
        }
      }
    }
    .panel-title{
      line-height: 30px;
      font-size: 16px;
      color: #333333;
      font-weight: 600;
      padding: 16px 20px 0px;
    }
  }
}
</style>


