<script lang="ts">
  import useReducerCache from "../../../store/reducer/reducerCache";
  import store from "../../../store/store";

  $: reduerCache = useReducerCache($store);

  $: values = reduerCache.getFocusInfo();
</script>

<div
  class="wrap"
  style:left="{values.left}px"
  style:width="{values.width}px"
  data-isChord={values.isChord}
></div>

<style>
  .wrap {
    display: inline-block;
    position: absolute;
    top: var(--pitch-top-margin);
    height: var(--pitch-frame-height);
    z-index: 2;
    background-color: rgba(0, 255, 255, 0.334);
  }
  .wrap[data-isChord="false"] {
    background-color: #d90000;
  }
</style>
