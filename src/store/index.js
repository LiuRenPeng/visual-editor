import { createStore } from 'vuex'

export default createStore({
  state: {
    componentsList:[{
      name: '文本组件',
      position: { // 组件位置
        x: 200,
        y: 200
      },
      options: { // 组件配置
        color: '',
        fontSize: '',
        background: '',
        innerHtml: '',
        border: ''
      }
    }]
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
