<script lang="ts">
  import PianoEditFrame from "./component/arrange/piano/PianoEditFrame.svelte";
  import RootHeader from "./component/header/RootHeader.svelte";
  import OutlineFrame from "./component/outline/OutlineFrame.svelte";
  import TerminalFrame from "./component/terminal/TerminalFrame.svelte";
  import TimelineFrame from "./component/timeline/TimelineFrame.svelte";
  import store from "./store/store";

  $: isDispTerminal = $store.terminal != null;
  $: isDispPianoEditor = $store.control.outline.pianoEditor != null;
</script>

<div class="wrap">
  <RootHeader />
  <div class="main">
    <OutlineFrame />
    <TimelineFrame />
  </div>
  {#if isDispTerminal}
    <TerminalFrame />
  {/if}
  {#if isDispPianoEditor}
    <PianoEditFrame />
  {/if}
</div>

<style>
  .wrap {
    display: inline-block;
    position: relative;
    width: 100%;
    height: 100%;
    background-color: rgb(155, 216, 216);
  }

  .main {
    display: inline-block;
    position: relative;
    width: 100%;
    height: calc(100% - var(--root-header-height));
    background-color: #aced09;
  }
</style>
