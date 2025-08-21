<script lang="ts">
  import Layout from "../../const/layout";
  import StoreMelody from "../../store/props/storeMelody";
  import store from "../../store/store";

  $: noteInfo = (() => {
    const melody = $store.control.melody;
    const cursor = melody.cursor;
    const beatSize = StoreMelody.calcBeat(cursor.norm, cursor.pos);
    const left = $store.env.beatWidth * beatSize;
    const pitch = cursor.pitch;
    const isOverlap = melody.isOverlap;
    return { left, pitch, isOverlap };
  })();

  $: width = (() => {
    const melody = $store.control.melody;
    const cursor = melody.cursor;
    const beatSize = StoreMelody.calcBeat(cursor.norm, cursor.len);
    return $store.env.beatWidth * beatSize;
  })();

  $: unit = (() => {
    const melody = $store.control.melody;
    const cursor = melody.cursor;
    const tuplets = cursor.norm.tuplets;
    return `1/${cursor.norm.div * 4} ${!tuplets ? "" : ` ${tuplets}t`}`;
  })();
</script>

<div
  class="line"
  style:left="{noteInfo.left}px"
  data-isOverlap={noteInfo.isOverlap}
>
  <div
    class="flag"
    style:top="{Layout.getPitchTop(noteInfo.pitch)}px"
    style:width="{width - 10}px"
    data-isOverlap={noteInfo.isOverlap}
  ></div>
</div>

<style>
  .line {
    display: inline-block;
    position: absolute;
    top: 0;
    z-index: 2;
    width: 10px;
    height: var(--pitch-frame-height);
    background-color: #22ff00;
    opacity: 0.7;
  }
  .line[data-isOverlap="true"] {
    background-color: #ff0000;
  }
  .flag {
    display: inline-block;
    position: absolute;
    left: 10px;
    z-index: 2;
    height: var(--pitch-item-height);
    background-color: #22ff00;
    border-radius: 0 2px 2px 0;
  }
</style>
