<script lang="ts">
  import useReducerTermianl from "../../store/reducer/reducerTerminal";
  import store from "../../store/store";
  import History from "./History.svelte";

  $: reducer = useReducerTermianl($store);
  // $: {getTerminal} = useReducerTermianl($store);
  $: terminal = reducer.getTerminal();

  $: [commandLeft, commandRight] = reducer.splitCommand();
</script>

<div class="frame">
  <div class="wrap" bind:this={$store.ref.terminal}>
    <div class="histories">
      {#each terminal.histories as history}
        <History {history} />
      {/each}
    </div>
    <div class="command">
      <span class="target">{terminal.target + ">"}</span>{commandLeft}<span
        class="cursor"
      ></span>{commandRight}
    </div>
    <div class="lastmargin"></div>
  </div>
</div>

<style>
  .frame {
    display: inline-block;
    position: absolute;
    z-index: 4;
    top: 10px;
    left: 10px;
    width: 700px;
    height: 700px;
    /* background-color: #003650; */
    background-color: #192055;
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

  .histories {
    display: inline-block;
    position: relative;
    width: 100%;
    /* background-color: #c2eaef2c; */
  }
  .command {
    display: inline-block;
    position: relative;
    width: 100%;
    height: 24px;
    background-color: #ffffff42;

    font-size: 18px;
    font-weight: 400;
    line-height: 21px;
    color: white;

    * {
      vertical-align: top;
    }
  }
  .target {
    color: yellow;
  }

  @keyframes blinkAnimation {
    0%,
    100% {
      opacity: 0; /* 完全に非表示 */
    }
    50% {
      opacity: 1; /* 完全に表示 */
    }
  }

  .cursor {
    display: inline-block;
    position: relative;
    margin: 3px 0 0 0;
    width: 2px;
    height: calc(100% - 6px);
    background-color: #ffff3d;
    margin-right: -2px;
    animation: blinkAnimation 1s step-start infinite; /* 点滅するアニメーション */
  }
  .lastmargin {
    width: 100%;
    height: 100px;
    /* background-color: #ffffff41; */
  }
</style>
