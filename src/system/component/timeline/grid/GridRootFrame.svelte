<script lang="ts">
  import { onMount } from "svelte";
  import store, { createStoreUtil } from "../../../store/store";
  import BaseBlock from "./BaseBlock.svelte";
  import ChordBlock from "./ChordBlock.svelte";
  import GridFocus from "./GridFocus.svelte";
  import Cursor from "../../melody/Cursor.svelte";
  import OtherTrackNotes from "../../melody/score/OtherTrackNotes.svelte";
  import ActiveNotes from "../../melody/score/ActiveNotes.svelte";

  $: cache = $store.cache;

  // let ref: HTMLElement | undefined = undefined;
  // onMount(() => ($store.ref.grid = ref));

  $: isDispCursor =
    $store.control.mode === "melody" &&
    $store.preview.timerKeys == null &&
    $store.control.melody.focus === -1;
  $: isMelodyMode = (() => $store.control.mode === "melody")();
</script>

<div class="wrap" bind:this={$store.ref.grid}>
  {#each cache.baseCaches as baseCache}
    <BaseBlock {baseCache}/>
  {/each}
  {#each cache.chordCaches as chordCache, index}
    <ChordBlock {chordCache} {index} />
  {/each}
  <GridFocus />
  {#if isDispCursor}
    <Cursor />
  {/if}

  <div class="noteswrap" data-isMelodyMode={isMelodyMode}>
    <ActiveNotes />
    <OtherTrackNotes />
  </div>
</div>

<style>
  .wrap {
    display: inline-block;
    position: relative;
    /* background-color: #fb5800; */
    width: calc(100% - var(--pitch-width));
    height: 100%;
    overflow: hidden;
    vertical-align: top;
  }

  .noteswrap {
    background-color: #647d92;
    display: inline-block;
    position: relative;
  }
  .noteswrap[data-isMelodyMode="false"] {
    opacity: 0.6;
  }
</style>
