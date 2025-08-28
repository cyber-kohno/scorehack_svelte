<script lang="ts">
  import type StoreOutline from "../../../store/props/storeOutline";
  import store from "../../../store/store";
  import MusicTheory from "../../../util/musicTheory";

  $: outline = $store.control.outline;

  $: [left, top] = (() => {
    const elementRef = $store.ref.elementRefs.find(
      (r) => r.seq === outline.focus
    );
    const outlineRef = $store.ref.outline;
    let left = 0;
    let top = 0;
    if (elementRef != undefined && outlineRef != null) {
      const frameTop = outlineRef.getBoundingClientRect().top;
      const rect = elementRef.ref.getBoundingClientRect();
      left = rect.right + 4;
      top = rect.top - frameTop;
    }
    return [left, top];
  })();

  $: symbol = (() => {
    const element = $store.data.elements[outline.focus];
    const chord = element.data as StoreOutline.DataChord;
    if (chord.degree == undefined)
      throw new Error("chord.degreeがundefinedであってはならない。");
    return chord.degree?.symbol;
  })();

  $: [cur, lower, upper, prev, next] = (() => {
    const cur = symbol;
    const symbolProps = MusicTheory.getSymbolProps(symbol);
    const lower = symbolProps.lower;
    const upper = symbolProps.upper;
    const prev = MusicTheory.getSameLevelSymbol(symbol, -1);
    const next = MusicTheory.getSameLevelSymbol(symbol, 1);
    return [cur, lower, upper, prev, next];
  })();

  const FRAME_WIDTH = 280;
  const FRAME_HEIGHT = 130;
  const ITEM_WIDTH = 90;
  const ITEM_HEIGHT = 40;

  const CENTER_TOP = FRAME_HEIGHT / 2 - ITEM_HEIGHT / 2;
  const CENTER_LEFT = FRAME_WIDTH / 2 - ITEM_WIDTH / 2;
</script>

<div
  class="frame"
  style="
        left: {left}px;
        top: {top}px;
    "
>
  <div
    class="item cur"
    style="
            top: {CENTER_TOP}px;
            left: {CENTER_LEFT}px;
        "
  >
    {cur}
  </div>
  {#if prev != undefined}
    <div
      class="item"
      style="
            top: {CENTER_TOP}px;
            left: {CENTER_LEFT - ITEM_WIDTH}px;
        "
    >
      {prev}
    </div>
  {/if}
  {#if next != undefined}
    <div
      class="item"
      style="
            top: {CENTER_TOP}px;
            left: {CENTER_LEFT + ITEM_WIDTH}px;
        "
    >
      {next}
    </div>
  {/if}
  {#if lower != undefined}
    <div
      class="item"
      style="
            top: {CENTER_TOP - ITEM_HEIGHT}px;
            left: {CENTER_LEFT}px;
        "
    >
      {lower}
    </div>
  {/if}
  {#if upper != undefined}
    <div
      class="item"
      style="
            top: {CENTER_TOP + ITEM_HEIGHT}px;
            left: {CENTER_LEFT}px;
        "
    >
      {upper}
    </div>
  {/if}
</div>

<style>
  .frame {
    display: inline-block;
    position: absolute;
    background-color: rgba(85, 124, 139, 0.8);
    border: 1px solid black;
    /* box-sizing: border-box; */
    width: 280px;
    height: 130px;
    z-index: 10;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6);
  }
  .item {
    display: inline-block;
    position: absolute;
    background-color: rgb(172, 168, 192);
    border: 1px solid rgba(255, 255, 255, 0.486);
    box-sizing: border-box;
    width: 90px;
    height: 40px;
    text-align: center;
    line-height: 44px;
    z-index: 10;
    color: white;
    font-size: 18px;
    font-weight: 600;
    border-radius: 4px;
    opacity: 0.7;
  }
  .cur {
    background-color: rgb(189, 92, 92);
    opacity: 1;
  }
</style>
