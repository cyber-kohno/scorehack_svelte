<script lang="ts">
  import store from "../../../store/store";

  $: width = 400;
  $: pos = $store.preview.linePos * $store.env.beatWidth - width;
</script>

<div class="wrap" style:left="{pos}px">
    <div class="shade" style:width="{width}px"></div>
    <div class="line"></div>
</div>

<style>
  .wrap {
    display: inline-block;
    position: absolute;
    top: 0;
    z-index: 12;
    height: var(--pitch-frame-height);
    background-color: rgba(255, 255, 249, 0.359);
  }
  .shade {
    display: inline-block;
    position: relative;
    height: 100%;
    background: linear-gradient(
      to Right,
      rgba(255, 251, 39, 0.001),
      rgba(255, 251, 39, 0.709)
    );
  }
  .line {
    display: inline-block;
    position: relative;
    width: 6px;
    height: 100%;
    background-color: rgba(170, 167, 0, 0.85);
  }
</style>
