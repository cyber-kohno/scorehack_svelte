<script lang="ts">
  import type StoreOutline from "../../../../store/props/storeOutline";
  import MusicTheory from "../../../../util/musicTheory";

  export let data!: StoreOutline.DataInit;

  $: [keyScaleName, tsName, tempo] = (() => {
    const keyScaleName = MusicTheory.getScaleName(data.tonality);

    const tsName = MusicTheory.getTSName(data.ts);
    return [keyScaleName, tsName, data.tempo];
  })();
</script>

<div class="wrap">
  <div class="keyscale">{keyScaleName}</div>
  <div class="ts">{tsName}</div>
  <div class="tempo">{tempo}</div>
</div>

<style>
  .wrap {
    display: inline-block;
    position: relative;
    width: 100%;
    /* background-color: #ffffff44; */
    /* より強調された影 */
    /* box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6); */
    /* border: 1px solid #fff; */
    padding: 0 2px 4px 2px;
    box-sizing: border-box;
    * {
      display: inline-block;
      position: relative;
      margin-top: 4px;
      width: 100%;
      background-color: #00a87e71;
      border-radius: 12px;
      color: rgb(255, 255, 255);
    }
  }

  .keyscale {
    height: 30px;
    text-align: center;
    font-size: 22px;
    font-weight: 600;
  }
  .ts {
    height: 30px;
    text-align: center;
    font-size: 22px;
    font-weight: 600;
  }
  .tempo {
    height: 30px;
    text-align: center;
    font-size: 22px;
    font-weight: 600;
  }
</style>
