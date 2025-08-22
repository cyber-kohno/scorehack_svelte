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
    height: var(--pitch-frame-height);
    z-index: 2;
    background-color: #f6be224f;
  }
  .wrap[data-isChord="false"] {
    background-color: #d90000;
  }
</style>
