<script lang="ts">
  import Layout from "../../../const/layout";
  import StoreMelody from "../../../store/props/storeMelody";
  import type StoreRef from "../../../store/props/storeRef";
  import store from "../../../store/store";

  export let note: StoreMelody.Note;
  export let noteColor: string;
  export let scrollLimitProps: StoreRef.ScrollLimitProps;

  $: [isDisp, left, width] = (() => {
    const beatSide = StoreMelody.calcBeatSide(note);
    const [left, width] = [beatSide.pos, beatSide.len].map(
      (v) => v * $store.env.beatWidth
    );
    const isDisp =
      Math.abs(scrollLimitProps.scrollMiddleX - (left + width / 2)) <=
      scrollLimitProps.rectWidth;
    return [isDisp, left, width];
  })();

  const PL = Layout.pitch;
  const MARGIN = -10;
</script>

{#if isDisp}
  <div class="itemwrap" style:left="{left}px" style:width="{width}px">
    <div
      class="note"
      style:top="{Layout.getPitchTop(note.pitch) - MARGIN}px"
      style:height="{PL.ITEM_HEIGHT + MARGIN * 2}px"
      style:background-color={noteColor}
    ></div>
  </div>
{/if}

<style>
  .itemwrap {
    display: inline-block;
    position: absolute;
    top: 0;
    height: var(--pitch-frame-height);
    z-index: 2;
    box-sizing: border-box;
    /* background-color: rgba(240, 248, 255, 0.201); */
  }

  .note {
    display: inline-block;
    position: absolute;
    left: 0;
    width: 100%;
    z-index: 2;
    border-radius: 0 12px 12px 0;
  }
</style>
