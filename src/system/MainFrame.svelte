<script lang="ts">
  import RootHeader from "./component/header/RootHeader.svelte";
  import OutlineFrame from "./component/outline/OutlineFrame.svelte";
  import TimelineFrame from "./component/timeline/TimelineFrame.svelte";
  import Layout from "./const/layout";
</script>

<div class="wrap">
  <RootHeader />
  <div class="main" style:height="calc(100% - {Layout.root.HEADER}px)">
    <OutlineFrame />
    <TimelineFrame />
  </div>
</div>

<style>
  .wrap {
    display: inline-block;
    position: relative;
    width: 100%;
    height: 100%;
    background-color: rgb(155, 216, 216);
  }

  .main {
    display: inline-block;
    position: relative;
    width: 100%;
    background-color: #aced09;
  }
</style>
