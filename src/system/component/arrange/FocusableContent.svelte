<script lang="ts">
  export let isFocus: boolean;
</script>

<div class="wrap" data-focus={isFocus}>
  {#if !isFocus}
    <div class="blind"></div>
  {/if}
  <slot />
</div>

<style>
  .wrap {
    display: block;
    position: relative;
    background-color: rgba(255, 255, 255, 0.195);
    padding: 4px;
  }
  .blind {
    display: inline-block;
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 12, 83, 0.125);
  }
  .wrap[data-focus="true"] {
    background-color: rgba(255, 0, 0, 0.56);
  }
</style>
