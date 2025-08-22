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
</script>

{#each notes as note, index}
  <Note {note} {index} />
{/each}
