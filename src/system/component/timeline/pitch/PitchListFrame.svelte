<script lang="ts">
  import Layout from "../../../const/layout";
  import MusicTheory from "../../../util/musicTheory";

  const pitchNames = [...Array(Layout.pitch.NUM).keys()]
    .map((v) => MusicTheory.getPitchKey(v).reverse().join(""))
    // 音程は低い順に下から並べる
    .reverse();
</script>

<div class="wrap">
  {#each pitchNames as pitch}
    <div class="item">{pitch}</div>
  {/each}
</div>

<style>
  .wrap {
    display: inline-block;
    position: relative;
    background-color: #16c450;
    width: var(--pitch-width);
    height: 100%;
    overflow: hidden;
    vertical-align: top;
  }
  .item {
    display: inline-block;
    position: relative;
    background-color: #82c0cf;
    width: 100%;
    height: var(--pitch-item-height);
    border: 1px solid #00000063;
    box-sizing: border-box;
    padding: 0 0 0 2px;
    font-size: 22px;
    font-weight: 600;
    line-height: 24px;
    color: #fafaffb2;
  }
</style>
