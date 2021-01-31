/**
 * 画布渲染组件外壳
 */
import "./editor_block.less";
import { defineComponent, computed, onMounted, ref } from "vue";

export default defineComponent({
  props: {
    block: { type: Object, required: true }
  },
  setup(props) {
    const el = ref({});

    const classes = computed(() => [
      "editor-block",
      {
        "editor-block-focus": props.block.focus,
      },
    ]);

    const styles = computed(() => ({
      top: `${props.block.top}px`,
      left: `${props.block.left}px`,
      zIndex: props.block.zIndex,
    }));

    onMounted(() => {
      /* 添加组件的时候，自动调整位置上下左右居中 */
      const block = props.block;
      console.log(block)
      if (block.adjustPosition === true) {
        const { offsetWidth, offsetHeight } = el.value;
        block.left = block.left - offsetWidth / 2;
        block.top = block.top - offsetHeight / 2;
        block.height = offsetHeight;
        block.width = offsetWidth;
        block.adjustPosition = false;
      }
    });

    return () => {
      return (
        <div class={classes.value} style={styles.value} ref={el}>
          {props.block.component}
        </div>
      );
    };
  },
});
