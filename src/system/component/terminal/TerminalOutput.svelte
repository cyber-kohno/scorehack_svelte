<script lang="ts">
  import type StoreTerminal from "../../store/props/storeTerminal";
  import TBRecord from "./block/TBRecord.svelte";

  export let output!: StoreTerminal.OutputBlock;

  const convHtmlText = (str: string) => str.replace(/ /g, "\u00A0");
</script>

{#if output.type === "record"}
  <TBRecord record={output.record}/>
{:else if output.type === "table"}{/if}

<style>
</style>
