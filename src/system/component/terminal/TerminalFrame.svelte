<script lang="ts">
  import useReducerTermianl from "../../store/reducer/reducerTerminal";
  import store from "../../store/store";

  $: reducer = useReducerTermianl($store);
  // $: {getTerminal} = useReducerTermianl($store);
  $: terminal = reducer.getTerminal();
</script>

<div class="frame">
  <div class="wrap">
    <div class="command">
      <span class="target">{terminal.target + ">"}</span>
    </div>
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
  }

  .command {
    display: inline-block;
    position: relative;
    width: 100%;
    height: 24px;
    background-color: #76ff062c;

    font-size: 18px;
    font-weight: 400;
    line-height: 21px;
    color: white;
  }
  .target {
    color: yellow;
  }
</style>
