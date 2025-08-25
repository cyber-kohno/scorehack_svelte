<script lang="ts">
  import store from "../../store/store";
  import Element from "./element/Element.svelte";

  $: elements = (() => {
    const elementSeq = $store.control.outline.focus;
    const elementCaches = $store.cache.elementCaches;
    let start = elementSeq - 12;
    if (start < 0) start = 0;
    let end = elementSeq + 12;
    if (end > elementCaches.length) end = elementCaches.length;
    return elementCaches.slice(start, end);
  })();
</script>

<div class="wrap" bind:this={$store.ref.outline}>
  {#each elements as element}
    <Element {element} />
  {/each}
</div>

<style>
  .wrap {
    display: inline-block;
    position: relative;
    width: 100%;
    height: var(--element-list-height);
    background-color: #ced3e9;
    overflow: hidden;
  }
</style>
