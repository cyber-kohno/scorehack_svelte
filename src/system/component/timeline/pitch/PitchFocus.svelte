<script lang="ts">
  import Layout from "../../../const/layout";
  import useReducerMelody from "../../../store/reducer/reducerMelody";
  import store from "../../../store/store";

  $: reducer = useReducerMelody($store);

  $: top = (() => {
    const notes = reducer.getCurrScoreTrack().notes;
    const melody = $store.control.melody;
    const { pitch } = melody.focus === -1 ? melody.cursor : notes[melody.focus];
    return (Layout.pitch.NUM - 1 - pitch) * Layout.pitch.ITEM_HEIGHT;
  })();
</script>

<div class="wrap" style:top="{top}px"></div>

<style>
  .wrap {
    display: inline-block;
    position: absolute;
    left: 0;
    width: 100%;
    height: var(--pitch-item-height);
    z-index: 2;
    background-color: rgba(179, 255, 0, 0.334);
  }
</style>
