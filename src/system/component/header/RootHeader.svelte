<script lang="ts">
  import Layout from "../../const/layout";
  import ModeSwitch from "./ModeSwitch.svelte";
</script>

<div class="wrap" style:height="{Layout.root.HEADER}px">
    <ModeSwitch name="Harmonize" isActive={true}/>
    <ModeSwitch name="Melody" isActive={false}/>
</div>

<style>
  .wrap {
    display: inline-block;
    position: relative;
    width: 100%;
    background-color: #a2b7c4;
  }
</style>
