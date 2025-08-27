<script lang="ts">
  import StoreOutline from "../../store/props/storeOutline";
  import StoreRef from "../../store/props/storeRef";
  import store from "../../store/store";
  import Element from "./element/Element.svelte";

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
</style>
