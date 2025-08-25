<script lang="ts">
  import store from "../../../store/store";
  import BaseBlock from "./BaseBlock.svelte";
  import ChordBlock from "./ChordBlock.svelte";
  import GridFocus from "./GridFocus.svelte";
  import Cursor from "../../melody/Cursor.svelte";
  import StoreRef from "../../../store/props/storeRef";
  import TimelineLastMargin from "../TimelineLastMargin.svelte";
  import ShadeTracks from "../../melody/score/ShadeTracks.svelte";
  import ActiveTrack from "../../melody/score/ActiveTrack.svelte";

  $: cache = $store.cache;

  $: isMelodyMode = (() => $store.control.mode === "melody")();

  $: isDispCursor =
    isMelodyMode &&
    $store.preview.timerKeys == null &&
    $store.control.melody.focus === -1;

  $: scrollLimitProps = StoreRef.getScrollLimitProps($store.ref.grid);
</script>

<div class="wrap" bind:this={$store.ref.grid}>
  {#if scrollLimitProps != null}
    {#each cache.baseCaches as baseCache}
      <BaseBlock {baseCache} {scrollLimitProps} />
    {/each}
    {#each cache.chordCaches as chordCache, index}
      <ChordBlock {chordCache} {index} />
    {/each}
    <TimelineLastMargin />
  {/if}
  <GridFocus />
  {#if isDispCursor}
    <Cursor />
  {/if}

  <div class="noteswrap" data-isMelodyMode={isMelodyMode}>
    {#if isMelodyMode}
      <ActiveTrack />
    {/if}
    <ShadeTracks />
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
    opacity: 0.8;
  }
</style>
