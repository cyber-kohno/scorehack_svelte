<script lang="ts">
  import StoreRef from "../../../store/props/storeRef";
  import store from "../../../store/store";
  import ShadeNote from "./ShadeNote.svelte";

  $: isDisp = (i: number) =>
    i !== $store.control.melody.trackIndex ||
    $store.control.mode === "harmonize";

  $: scoreTracks = $store.data.scoreTracks;

  $: scrollLimitProps = StoreRef.getScrollLimitProps($store.ref.grid);
</script>

{#if scrollLimitProps != null}
  {#each scoreTracks as track, trackIndex}
    {#if isDisp(trackIndex)}
      {#each track.notes as _, noteIndex}
        <ShadeNote {trackIndex} {noteIndex} {scrollLimitProps} />
      {/each}
    {/if}
  {/each}
{/if}
