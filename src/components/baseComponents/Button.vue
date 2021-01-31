<template>
  <el-tooltip class="editor-btn-tip" effect="dark" :content="name" placement="bottom">
    <el-button :class="['editor-btn',active?'active':'']" :icon="icon" @click="handleClick"></el-button>
  </el-tooltip>
</template>

<script>
export default {
  name: 'Button',
  props: {
    icon: String,
    name: String,
    active: {
      type: Boolean,
      value: false
    }
  },
  emits: ['click'],
  setup(props, context){
    const methods = {
      handleClick(){
        context.emit("click")
      }
    }
    return {
      ...methods
    }
  }
}
</script>

<style lang="less">
@import '../../assets/less/common.less';
  .editor-btn{
    padding: 0 20px;
    font-size: @icon-size;
    text-align: center;
    line-height: 36px;
    border: 1px solid @blue;
    margin-left: 10px;
    cursor: pointer;
    background: #FFF;
    border: 1px solid #DCDFE6;
    color: #606266;
    &:hover{
      color: @blue;
      border-color: @bluelight;
      background-color: @bluebg;
    }
    &.active{
      color: #ffffff;
      border-color: @blue;
      background-color: @blue;
    }
  }
</style>