<script lang="ts">
  import Layout from "../../../const/layout";
  import StoreMelody from "../../../store/props/storeMelody";
  import useReducerCache from "../../../store/reducer/reducerCache";
  import store from "../../../store/store";
  import MusicTheory from "../../../util/musicTheory";
  import Factors from "./Factors.svelte";

  export let note: StoreMelody.Note;
  export let index: number;

  $: tonality = (() => {
    const { getBaseFromBeat } = useReducerCache($store);
    return getBaseFromBeat(StoreMelody.calcBeat(note.norm, note.pos)).scoreBase
      .tonality;
  })();

  $: noteInfo = (() => {
    const beatSize = StoreMelody.calcBeat(note.norm, note.pos);
    const left = $store.env.beatWidth * beatSize;
    const pitchIndex = note.pitch;
    const scaleIndex = (note.pitch - tonality.key12) % 12;
    return { left, pitchIndex, scaleIndex };
  })();

  $: width = (() => {
    const beatSize = StoreMelody.calcBeat(note.norm, note.len);
    return $store.env.beatWidth * beatSize;
  })();

  $: isScale = (() => {
    return MusicTheory.isScale(note.pitch, tonality);
  })();

  $: isFocus = (() => {
    return (
      $store.control.mode === "melody" && $store.control.melody.focus === index
    );
  })();

  $: getOperationHighlight = () => {
    if (!isFocus) return "#ffffff45";

    const input = $store.input;
    if (input.holdD) return "#7cffc4aa";
    else if (input.holdF) return "#232affaa";
    else if (input.holdC) return "#ffd53faa";
    else if (input.holdX) return "#ffa03baa";
    return "#ffffff88";
  };
</script>

<div
  class="column"
  style:left="{noteInfo.left}px"
  style:width="{width}px"
  style:background-color={getOperationHighlight()}
>
  <div
    class="frame"
    style:top="{Layout.getPitchTop(note.pitch) - 2}px"
    data-isScale={isScale}
  >
    <Factors {note} />
  </div>
</div>

<style>
  .column {
    display: inline-block;
    position: absolute;
    top: 0;
    height: var(--pitch-frame-height);
    z-index: 2;
    box-sizing: border-box;
    background-color: rgba(240, 248, 255, 0.201);
  }

  .frame {
    display: inline-block;
    position: absolute;
    left: 0;
    width: 100%;
    height: calc(var(--pitch-item-height) + 4px);
    z-index: 2;
    border-radius: 0 12px 12px 0;
    box-sizing: border-box;
    box-shadow: 10px 10px 15px -10px;
    background: linear-gradient(to bottom, #1ccf49d5, #b5e8adac, #1ccf49d5);
  }
  .frame[data-isScale="false"] {
    background: linear-gradient(to bottom, #eacb1dd5, #e8e1adac, #eacb1dd5);
  }
</style>
