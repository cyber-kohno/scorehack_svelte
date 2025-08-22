<script lang="ts">
  import Layout from "../../../const/layout";
  import type StoreCache from "../../../store/props/storeCache";
  import store from "../../../store/store";
  import MusicTheory from "../../../util/musicTheory";

  type PitchType = "tonic" | "other" | "scale";

  export let baseCache: StoreCache.BaseCache;

  $: beatDiv16Count = MusicTheory.getBeatDiv16Count(baseCache.scoreBase.ts);

  $: beatWidth = $store.env.beatWidth * (beatDiv16Count / 4);

  $: measureLines = (() => {
    console.log(baseCache);
    const list: {
      left: number;
      width: number;
    }[] = [];
    const cnt = baseCache.lengthBeat * beatDiv16Count;
    for (let i = 0; i < cnt; i++) {
      const left = (beatWidth / beatDiv16Count) * i;
      let width = 1;
      if (i % beatDiv16Count === 0) width = 3;
      list.push({ left, width });
    }
    return list;
  })();

  $: pitchItems = (() => {
    const pitchNum = Layout.pitch.NUM;
    const tonality = baseCache.scoreBase.tonality;
    const scaleList =
      tonality.scale === "major"
        ? MusicTheory.MAJOR_SCALE_INTERVALS
        : MusicTheory.MINOR_SCALE_INTERVALS;
    const list: {
      top: number;
      type: PitchType;
    }[] = [];
    for (let i = 0; i < pitchNum; i++) {
      const top = i * Layout.pitch.ITEM_HEIGHT;
      let type: PitchType = "other";

      const pitchIndex = pitchNum - 1 - i;

      const keyIndex = MusicTheory.getKeyIndex(pitchIndex, tonality.key12);
      if (keyIndex === 0) type = "tonic";
      else if (scaleList.includes(keyIndex)) type = "scale";
      list.push({ top, type });
    }
    return list;
  })();

  const getRecordColor = (type: PitchType) => {
    switch (type) {
      case "other":
        return "#00000041";
      case "tonic":
        return "#006aff68";
      case "scale":
        return "#ffffff48";
    }
  };
</script>

<div
  class="wrap"
  style:left="{baseCache.viewPosLeft}px"
  style:width="{baseCache.viewPosWidth}px"
>
  <!-- 16分音符毎の補助ライン -->
  {#each measureLines as line}
    <div
      class="line"
      style:left="{line.left}px"
      style:width="{line.width}px"
    ></div>
  {/each}

  <!-- 音程の補助ライン -->
  {#each pitchItems as pitch}
    <div
      class="pitch"
      style:top="{pitch.top}px"
      style:background-color="{getRecordColor(pitch.type)}"
    ></div>
  {/each}
</div>

<style>
  .wrap {
    display: inline-block;
    position: absolute;
    z-index: 1;

    background-color: #3e97ce86;
    top: 0;
    height: var(--pitch-frame-height);
  }

  .line {
    display: inline-block;
    position: absolute;
    z-index: 2;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.303);
  }

  .pitch {
    display: inline-block;
    position: absolute;
    z-index: 2;
    left: 0;
    width: 100%;
    height: var(--pitch-item-height);
    opacity: 0.2;
  }
</style>
