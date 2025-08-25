<script lang="ts">
  import StoreRef from "../../../store/props/storeRef";
  import store from "../../../store/store";
  import ShadeNote from "./ShadeNote.svelte";

  $: tracks = (() => {
    const trackIndex = $store.control.melody.trackIndex;
    // 自身以外のスコアトラックでフィルター
    return $store.data.scoreTracks.filter(
      (_, i) => i !== trackIndex || $store.control.mode === "harmonize"
    );
  })();

  $: scrollLimitProps = StoreRef.getScrollLimitProps($store.ref.grid);

  const colorArr = ["#faa", "#aabeff", "#ffa", "#afa", "#aff", "#ced"];
</script>

{#if scrollLimitProps != null}
  {#each tracks as track, i}
    {#each track.notes as note}
      <ShadeNote
        {note}
        noteColor={colorArr[i % colorArr.length]}
        {scrollLimitProps}
      />
    {/each}
  {/each}
{/if}
