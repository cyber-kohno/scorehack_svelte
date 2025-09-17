<script lang="ts">
  import StoreRef from "../../../store/props/storeRef";
  import store from "../../../store/store";
  import ShadeNote from "./ShadeNote.svelte";

  const isDisp = (i: number) =>
    i !== $store.control.melody.trackIndex ||
    $store.control.mode === "harmonize";

  $: scoreTracks = $store.data.scoreTracks.filter((_, i) => isDisp(i));

  $: {
    console.log(scoreTracks.length);
  }

  $: scrollLimitProps = StoreRef.getScrollLimitProps($store.ref.grid);
</script>

{#if scrollLimitProps != null}
  {#each scoreTracks as track, trackIndex}
    {#each track.notes as _, noteIndex}
      <ShadeNote {trackIndex} {noteIndex} {scrollLimitProps} />
    {/each}
  {/each}
{/if}
