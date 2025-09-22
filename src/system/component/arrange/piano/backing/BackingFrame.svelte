<script lang="ts">
</script>

<div class="wrap">
  <div class="left">
    <div class="layerdiv"></div>
    <div class="recorddiv"></div>
    <div class="pedaldiv"></div>
  </div>
  <div class="right">
    <div class="layerdiv"></div>
    <div class="recorddiv"></div>
    <div class="pedaldiv"></div>
  </div>
</div>

<style>
  .wrap {
    display: inline-block;
    position: relative;
    /* width: 100%; */
    /* width: 100%;
    height: 100%; */
    background-color: #93d98d;
    * {
      vertical-align: top;
    }
  }
  .left {
    display: inline-block;
    position: relative;
    width: var(--ap-backing-record-width);
    height: 100%;
    background-color: #073d02;
  }
  .layerdiv {
    display: inline-block;
    position: relative;
    width: 100%;
    height: var(--ap-backing-header-height);
    background-color: #d342c7;
  }
  .recorddiv {
    display: inline-block;
    position: relative;
    width: 100%;
    height: var(--ap-backing-table-height);
    background-color: #d3c742;
  }
  .pedaldiv {
    display: inline-block;
    position: relative;
    width: 100%;
    height: var(--ap-backing-pedal-height);
    background-color: #000000;
  }
  .right {
    display: inline-block;
    position: relative;
    /* width: 100%; */
    width: calc(100% - var(--ap-backing-record-width));
    background-color: #bababa;
  }
</style>
