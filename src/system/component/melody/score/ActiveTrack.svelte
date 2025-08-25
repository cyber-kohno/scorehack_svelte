<script lang="ts">
  import type StoreMelody from "../../../store/props/storeMelody";
  import StoreRef from "../../../store/props/storeRef";
  import useReducerMelody from "../../../store/reducer/reducerMelody";
  import store from "../../../store/store";
  import Note from "./Note.svelte";

  $: reducer = useReducerMelody($store);

  $: notes = reducer.getCurrScoreTrack().notes;

  $: scrollLimitProps = StoreRef.getScrollLimitProps($store.ref.grid);
</script>

{#if scrollLimitProps != null}
  {#each notes as note, index}
    <Note {note} {index} {scrollLimitProps} />
  {/each}
{/if}
