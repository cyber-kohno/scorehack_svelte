<script lang="ts">

</script>

<div class="frame">
  <div class="wrap">
  </div>
</div>

<style>
  .frame {
    display: inline-block;
    position: absolute;
    z-index: 5;
    top: 10px;
    left: 10px;
    width: 700px;
    height: 700px;
    /* background-color: #003650; */
    background-color: #cfcfd3;
    /* border: 2px solid #fb0000; */
    box-sizing: border-box;
    /* opacity: 0.99; */
    box-shadow: 10px 10px 15px -10px;
    /* border-radius: 4px; */
  }

  .wrap {
    display: inline-block;
    position: relative;
    margin: 4px 0 0 4px;
    width: calc(100% - 8px);
    height: calc(100% - 8px);
    background-color: rgba(240, 248, 255, 0.101);
    overflow: hidden;
  }

</style>
