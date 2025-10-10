<script lang="ts">
  import FinderConditionItem from "./FinderConditionItem.svelte";

</script>

<div class="info">
  <FinderConditionItem width={95} title={"TS"} value={info.ts} />
  <FinderConditionItem
    width={140}
    title={"Beat"}
    value={CacheUtil.getBeatInfo(info)}
  />
  <FinderConditionItem
    width={105}
    title={"Struct"}
    value={info.structCnt.toString()}
  />
</div>