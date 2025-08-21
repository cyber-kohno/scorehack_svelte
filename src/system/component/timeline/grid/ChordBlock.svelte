<script lang="ts">
  import type StoreCache from "../../../store/props/storeCache";

  export let chordCache: StoreCache.ChordCache;
  export let index: number;
</script>

<div
  class="wrap"
  style:left="{chordCache.viewPosLeft}px"
  style:width="{chordCache.viewPosWidth}px"
></div>

<style>
  .wrap {
    display: inline-block;
    position: absolute;
    z-index: 1;

    background-color: #ffffff20;
    top: 0;
    height: 100%;
  }
</style>
