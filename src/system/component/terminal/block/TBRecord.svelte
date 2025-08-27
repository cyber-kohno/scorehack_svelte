<script lang="ts">
  import type StoreTerminal from "../../../store/props/storeTerminal";

  export let texts!: StoreTerminal.TextItem[] | undefined;
  if (texts == undefined) throw new Error();
</script>

{#each texts as text}
  <div class="record">
    <span data-highlight={text.highlight}>{text.str}</span>
</div>
{/each}

<style>
  .record {
    display: inline-block;
    position: relative;
    width: 100%;
    height: 24px;
    /* background-color: #ffda062c; */

    font-size: 18px;
    font-weight: 400;
    line-height: 21px;
    color: white;

    * {
      vertical-align: top;
    }
  }
</style>
