<script lang="ts">
  import type StoreCache from "../../../store/props/storeCache";
  import store from "../../../store/store";
  import FocusCover from "../../common/FocusCover.svelte";

  export let element!: StoreCache.ElementCache;
  export let index!: number;

  $: isFocus = $store.control.outline.focus === index;

</script>

<div class="wrap">
  <FocusCover isDisplay={isFocus} bgColor="#ffec3d6c" />
</div>

<style>
  .wrap {
    display: inline-block;
    position: relative;
    background-color: #f00;
    width: 180px;
    height: 60px;
    margin-top: 4px;
  }
</style>
