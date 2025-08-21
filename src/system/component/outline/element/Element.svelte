<script lang="ts">
  import type StoreCache from "../../../store/props/storeCache";
  import store from "../../../store/store";
  import FocusCover from "../../common/FocusCover.svelte";
  import DataChord from "./data/DataChord.svelte";
  import DataInit from "./data/DataInit.svelte";
  import DataModulate from "./data/DataModulate.svelte";
  import DataSection from "./data/DataSection.svelte";
  import DataTempo from "./data/DataTempo.svelte";

  export let element!: StoreCache.ElementCache;
  export let index!: number;

  $: isFocus = $store.control.outline.focus === index;

  $: data = element.data;
</script>

<div class="wrap" data-type={element.type}>
  {#if element.type === "init"}
    <DataInit {data} />
  {:else if element.type === "section"}
    <DataSection data={element.data} />
  {:else if element.type === "chord"}
    <DataChord {data} elementSeq={index} />
  {:else if element.type === "modulate"}
    <DataModulate {data} elementSeq={index} />
  {:else if element.type === "tempo"}
    <DataTempo {data} elementSeq={index} />
  {/if}

  <FocusCover isDisplay={isFocus} bgColor="#ffec3d6c" />
</div>

<style>
  .wrap {
    display: inline-block;
    position: relative;
    /* background-color: rgba(30, 255, 0, 0.119); */
    width: 180px;
    min-height: 60px;
    margin-top: 4px;
    margin-left: 25px;
  }
  .wrap[data-type="init"] {
    margin-left: 4px;
  }
  .wrap[data-type="section"] {
    margin-left: 10px;
  }
</style>
