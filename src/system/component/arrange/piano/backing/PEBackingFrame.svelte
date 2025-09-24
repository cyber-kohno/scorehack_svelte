<script lang="ts">
  import useReducerArrange from "../../../../store/reducer/reducerArrange";
  import store from "../../../../store/store";
  import FocusableContent from "../../FocusableContent.svelte";
  import LenFrame from "./PEBColFrame.svelte";
  import MeasureFrame from "./PEBMeasureFrame.svelte";
  import PedalFrame from "./PEBPedalFrame.svelte";
  import RecordFrame from "./PEBRecordFrame.svelte";
  import TableFrame from "./PEBTableFrame.svelte";

  $: reducer = useReducerArrange($store);
  $: editor = reducer.getPianoEditor();
</script>

<div class="wrap">
  <div class="left">
    <div class="headerdiv"></div>
    <div class="recorddiv">
      <FocusableContent isFocus={editor.control === 'record'}><RecordFrame /></FocusableContent>
    </div>
    <div class="pedaldiv"></div>
  </div>
  <div class="right">
    <div class="headerdiv">
      <FocusableContent isFocus={editor.control === 'col'}><LenFrame /></FocusableContent>
      <MeasureFrame />
    </div>
    <div class="recorddiv">
      <FocusableContent isFocus={editor.control === 'notes'}><TableFrame /></FocusableContent>
    </div>
    <div class="pedaldiv">
      <FocusableContent isFocus={editor.control === 'col'}><PedalFrame /></FocusableContent>
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
