<script lang="ts">
  import store from "../../store/store";
  import Element from "./element/Element.svelte";

  $: elements = $store.cache.elementCaches;
</script>

<div class="wrap">
  {#each elements as element, index}
    <Element {element} {index} />
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
