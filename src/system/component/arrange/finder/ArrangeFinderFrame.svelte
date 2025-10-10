<script lang="ts">
  import ScrollRateFrame from "../../common/ScrollRateFrame.svelte";
  import FinderConditionFrame from "./condition/FinderConditionFrame.svelte";
</script>

<div class="wrap">
  <FinderConditionFrame />
  <div class="list-base">
    <ScrollRateFrame
      {ref}
      dir={"y"}
      frameLength={300}
      frameWidth={10}
      dependencies={[finder.cursorBacking]}
    />
    <div class="list-inner" bind:this={ref}>
      {#if finder.list.length === 0}
        <div class="msg">No matching presets found.</div>
      {:else}
        {#each finder.list as preset, backingIndex}
          <PBPresetItem {finder} usageBkg={preset} {backingIndex} />
        {/each}
      {/if}
    </div>
  </div>
</div>

<style>
  .wrap {
    display: inline-block;
    position: absolute;
    left: 4px;
    top: 4px;

    width: 500px;
    height: 600px;
    background-color: black;
    border: 1px solid #1efe00;
    box-sizing: border-box;
    z-index: 5;
    border-radius: 4px;
    opacity: 0.99;
  }

  .info {
    display: inline-block;
    position: relative;
    background-color: rgba(200, 231, 240, 0.842);
    width: 100%;
    height: 40px;
  }
  .list-base {
    display: inline-block;
    position: relative;
    width: 100%;
    height: calc(100% - 40px);
  }
  .list-inner {
    display: inline-block;
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgb(44, 44, 44);
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .msg {
    display: inline-block;
    position: relative;
    /* background-color: rgb(125, 11, 11); */
    width: 100%;
    height: 30px;
    font-size: 18px;
    line-height: 22px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.658);
    padding: 0 0 0 4px;
    box-sizing: border-box;
  }
</style>
