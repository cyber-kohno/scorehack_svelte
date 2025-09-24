<script lang="ts">
  import useReducerArrange from "../../../../../store/reducer/reducerArrange";
  import store from "../../../../../store/store";

 
    import PBNotesCell from "./PEBTableCell.svelte";
  $: reducer = useReducerArrange($store);

  $: editor = reducer.getPianoEditor();
  $: backing = (() => {
    if (editor.backing == null) throw new Error();
    return editor.backing;
  })();
    $: layer = backing.layers[backing.layerIndex];
    // $: layerSub = backing.layers[backing.layerIndex === 0 ? 1 : 0];

</script>

<div class="wrap" style="z-index: 2;">
    {#each Array.from({ length: backing.recordNum }, (_, i) => backing.recordNum - 1 - i) as recordIndex}
        <div class="record">
            {#each layer.cols as len, colIndex}
            <PBNotesCell {colIndex} {recordIndex} col={len}/>
            {/each}
        </div>
    {/each}
</div>

<style>
    .wrap {
        display: inline-block;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }
    .record {
        display: inline-block;
        position: relative;
        margin: 1px 0 0 0;
        width: 100%;
        height: 24px;
        padding: 0;
        overflow-x: hidden;
        white-space: nowrap;
    }
</style>
