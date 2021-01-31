import {ref, watch} from 'vue';

export function useModel(getter, emitter) {
  const state = ref(getter());
  watch(getter, val=>{
    if(val !== state.value){
      state.value = val
    }
  })
  return {
    get(){
      return state.value
    },
    set(val){
      if(state.value !== val){
        state.value = val
        emitter(val)
      }
    }
  }
}

export function createEvent() {
  let listeners = []
  return {
      on: (cb) => {
          listeners.push(cb)
      },
      off: (cb) => {
          const index = listeners.indexOf(cb)
          if (index > -1) listeners.splice(index, 1)
      },
      emit: () => {
          listeners.forEach(item => item())
      },
  }
}

export function createNewBlock({component, left, top}){
  return {
      top,
      left,
      key: component.key,
      label: component.label,
      component: component.render(),
      adjustPosition: true,
      focus: false,
      zIndex: 0,
      width: 0,
      height: 0,
      hasResize: false,
  }
}

export function createComponents() {
  // 保存组件与key的映射关系
  const componentsMap = {}
  // 保存可供使用的组件列表
  const componentsList = []
  return {
    componentsMap,
    componentsList,
    /**
     * 注册一个新组件
     * key: 组件的类型
     * component: {preview:()=>{}, render:()=>{}}
     */
    registry:(key, component)=>{
      componentsList.push({key, ...component})
      componentsMap[key] = component
    }
  }
}