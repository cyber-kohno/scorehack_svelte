<script lang="ts">
  import StoreOutline from "../../store/props/storeOutline";
  import StoreRef from "../../store/props/storeRef";
  import store from "../../store/store";
  import Element from "./element/Element.svelte";
  import ChordSelector from "./item/ChordSelector.svelte";

  $: elements = (() => {
    const elementSeq = $store.control.outline.focus;
    const elementCaches = $store.cache.elementCaches;
    const limitProps = StoreRef.getScrollLimitProps($store.ref.outline);
    if (limitProps == null) return [];
    // let start = elementSeq - 12;
    // if (start < 0) start = 0;
    // let end = elementSeq + 12;
    // if (end > elementCaches.length) end = elementCaches.length;
    return elementCaches.filter(
      (el, i) =>
        Math.abs(elementSeq - i) < 12 ||
        Math.abs(
          limitProps.scrollMiddleY -
            (el.outlineTop + StoreOutline.getElementViewHeight(el) / 2)
        ) <= limitProps.rectHeight
    );
  })();

  $: isDispChordSelector = (() => {
    const control = $store.control;
    const element = elements[control.outline.focus];
    return (
      // control.melody.dialog == null &&
      control.mode === "harmonize" &&
      $store.input.holdC &&
      element.type === "chord" &&
      (element.data as StoreOutline.DataChord).degree != undefined
    );
  })();
</script>

<div class="wrap" bind:this={$store.ref.outline}>
  {#each elements as element}
    <Element {element} />
  {/each}
  <div
    class="lastmargin"
    style:top="{$store.cache.outlineTailPos}px"
    style:height="{300}px"
  ></div>
</div>
<div class="list-second">
  {#if isDispChordSelector}
    <ChordSelector />
  {/if}
</div>

<style>
  .wrap {
    display: inline-block;
    position: relative;
    width: 100%;
    height: var(--element-list-height);
    /* background-color: #ced3e9; */
    background: linear-gradient(to right, #91a2b6, #b1b1b1);
    overflow: hidden;
  }

  .lastmargin {
    display: inline-block;
    position: absolute;
    z-index: 1;
    left: 0;
    width: 100%;
    /* background-color: aliceblue; */
  }
  .list-second {
    display: inline-block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    /* background-color: rgba(126, 188, 243, 0.349); */
  }
</style>
