<script>
  import PEBTableBackLayer from "./PEBTableBackLayer.svelte";
  import PEBTableMainLayer from "./PEBTableMainLayer.svelte.svelte";
</script>

<div class="wrap">
  <PEBTableMainLayer />
  <PEBTableBackLayer />
</div>

<style>
  .wrap {
    display: inline-block;
    position: relative;
    width: 100%;
    height: var(--ap-backing-table-height);
  }
</style>
