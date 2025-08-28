<script lang="ts">
  import type StoreTerminal from "../../store/props/storeTerminal";
  import TBRecord from "./block/TBRecord.svelte";

  export let history!: StoreTerminal.OutputBlock;

  const convHtmlText = (str: string) => str.replace(/ /g, "\u00A0");
</script>

{#if history.type === "record"}
  <TBRecord texts={history.texts}/>
{:else if history.type === "table"}{/if}

<style>
</style>
