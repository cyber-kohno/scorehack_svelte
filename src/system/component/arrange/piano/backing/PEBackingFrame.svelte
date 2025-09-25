<script lang="ts">
  import { readable } from "svelte/store";
  import ContextUtil from "../../../../store/contextUtil";
  import type StorePianoBacking from "../../../../store/props/arrange/piano/storePianoBacking";
  import FocusableContent from "../../FocusableContent.svelte";
  import LenFrame from "./PEBColFrame.svelte";
  import MeasureFrame from "./PEBMeasureFrame.svelte";
  import PedalFrame from "./PEBPedalFrame.svelte";
  import RecordFrame from "./PEBRecordFrame.svelte";
  import PEBTargetLayer from "./PEBTargetLayer.svelte";
  import TableFrame from "./table/PEBTableFrame.svelte";
  import store from "../../../../store/store";

  const editor = ContextUtil.get("pianoEditor");

  $: backing = (() => {
    const backing = $editor.backing;
    if (backing == null) throw new Error();
    return backing;
  })();

  const getColWidth = (col: StorePianoBacking.Col) => {
    return getColWidthCriteriaBeatWidth(col, 540);
  };

  const getColWidthCriteriaBeatWidth = (
    col: StorePianoBacking.Col,
    beatWidth: number
  ) => {
    const getDotRate = () => {
      switch (col.dot ?? 0) {
        case 0:
          return 1;
        case 1:
          return 1.5;
        case 2:
          return 1.75;
      }
      throw new Error(`col.dotが想定していない値である。[${col.dot}]`);
    };
    return Math.floor((beatWidth / col.div) * getDotRate());
  };

  $: layer = backing.layers[backing.layerIndex];
  $: {
    ContextUtil.set("backingProps", {
      backing,
      layer,
      getColWidth,
    });
  }

  // $: control = $editor.control;
  // $: {
  //   console.log(control);
  // }
</script>

<div class="wrap">
  <div class="left">
    <div class="headerdiv">
      <PEBTargetLayer />
    </div>
    <div class="recorddiv">
      <FocusableContent isFocus={$editor.control === "record"}
        ><RecordFrame /></FocusableContent
      >
    </div>
    <div class="pedaldiv"></div>
  </div>
  <div class="right">
    <div class="headerdiv">
      <FocusableContent isFocus={$editor.control === "col"}
        ><LenFrame /></FocusableContent
      >
      <MeasureFrame />
    </div>
    <div class="recorddiv">
      <FocusableContent isFocus={$editor.control === "notes"}
        ><TableFrame /></FocusableContent
      >
    </div>
    <div class="pedaldiv">
      <FocusableContent
        isFocus={$editor.control === "col" && backing.layerIndex === 0}
        ><PedalFrame /></FocusableContent
      >
    </div>
  </div>
</div>

<style>
  .wrap {
    display: inline-block;
    position: relative;
    /* width: 100%; */
    /* width: 100%;
    height: 100%; */
    /* background-color: #93d98d; */
    * {
      vertical-align: top;
    }
  }
  .left {
    display: inline-block;
    position: relative;
    width: var(--ap-backing-record-width);
    height: 100%;
    /* background-color: #073d02; */
  }
  .headerdiv {
    display: inline-block;
    position: relative;
    width: 100%;
    height: calc(var(--ap-backing-header-height) + 8px);
    /* background-color: #d342c78d; */
  }
  .recorddiv {
    display: inline-block;
    position: relative;
    width: 100%;
    height: calc(var(--ap-backing-table-height) + 8px);
    /* background-color: #d3c742aa; */
  }
  .pedaldiv {
    display: inline-block;
    position: relative;
    width: 100%;
    height: calc(var(--ap-backing-pedal-height) + 8px);
    /* background-color: #000000c5; */
  }
  .right {
    display: inline-block;
    position: relative;
    /* width: 100%; */
    width: calc(
      var(--ap-voicing-frame-width) - var(--ap-backing-record-width) + 8px
    );
    /* background-color: #bababa; */
  }
</style>
