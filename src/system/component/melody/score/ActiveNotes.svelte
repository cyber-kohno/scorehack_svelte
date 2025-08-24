<script lang="ts">
  import type StoreMelody from "../../../store/props/storeMelody";
  import store from "../../../store/store";
  import Note from "./Note.svelte";

  $: notes = (() => {
    const layer = $store.data.tracks[
      $store.control.melody.trackIndex
    ] as StoreMelody.ScoreTrack;
    return layer.notes;
  })();

  $: scrollPos = (() => {
    const ref = $store.ref.grid;
    if (ref == undefined) return [];
    const scrollPos = ref.scrollLeft + ref.getBoundingClientRect().width / 2;
    return scrollPos;
  })();
</script>

{#each notes as note, index}
  <Note {note} {index} {scrollPos} />
{/each}
