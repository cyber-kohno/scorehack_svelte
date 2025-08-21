<script lang="ts">
  import store from "../../../store/store";
  import MeasureBlock from "./MeasureBlock.svelte";
</script>

<div class="wrap">
  {#each $store.cache.baseCaches as baseCache}
    <MeasureBlock {baseCache} />
  {/each}
</div>

<style>
  .wrap {
    display: inline-block;
    position: relative;
    background-color: #b6ebe4;
    min-width: 100%;
    width: var(--beat-sum);
    height: var(--memori-height);
  }
</style>
