<script lang="ts">
  import { onMount } from "svelte";
  import store, { createStoreUtil } from "../../../store/store";
  import BaseBlock from "./BaseBlock.svelte";
  import ChordBlock from "./ChordBlock.svelte";
  import GridFocus from "./GridFocus.svelte";
  import Cursor from "../../melody/Cursor.svelte";

  $: cache = $store.cache;

  let ref: HTMLElement | undefined = undefined;
  onMount(() => ($store.ref.grid = ref));

  $: isDispCursor =
    $store.control.mode === "melody" && $store.preview.timerKeys == null;
</script>

<div class="wrap" bind:this={ref}>
  {#each cache.baseCaches as baseCache, index}
    <BaseBlock {baseCache} {index} />
  {/each}
  {#each cache.chordCaches as chordCache, index}
    <ChordBlock {chordCache} {index} />
  {/each}
  <GridFocus />
  {#if isDispCursor}
    <Cursor />
  {/if}
</div>

<style>
  .wrap {
    display: inline-block;
    position: relative;
    background-color: #647d92;
    width: calc(100% - var(--pitch-width));
    height: 100%;
    overflow: hidden;
    vertical-align: top;
  }
</style>
