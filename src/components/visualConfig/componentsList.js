import {createComponents} from '../function/utils';

const visualConfig = createComponents();

visualConfig.registry('text', {
  label: '文本',
  preview: ()=>'预览文本',
  render: ()=>'渲染文本'
})

visualConfig.registry('button', {
  label: '按钮',
  preview: ()=><el-button>按钮</el-button>,
  render: ()=><el-button>渲染按钮</el-button>
})

visualConfig.registry('input', {
  label: '输入框',
  preview: ()=><el-input/>,
  render: ()=><el-input/>
})

export default visualConfig