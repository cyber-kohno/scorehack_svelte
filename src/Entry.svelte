<script lang="ts">
  import { onMount } from "svelte";
  import useInputRoot from "./system/input/inputRoot";
  import MainFrame from "./system/MainFrame.svelte";
  import store, { createStoreUtil } from "./system/store/store";
  import DesignInitializer from "./system/util/disignInitializer";
  import useReducerCache from "./system/store/reducer/reducerCache";

  onMount(() => {
    const {lastStore, commit} = createStoreUtil($store);
    const { calculate } = useReducerCache(lastStore);
    DesignInitializer.initConstProps();
    calculate();
    commit();
  });

  $: isStandby = $store.cache.elementCaches.length === 0;

  $: {
    const { controlKeyDown, controlKeyUp } = useInputRoot(
      createStoreUtil($store)
    );
    window.onkeydown = controlKeyDown;
    window.onkeyup = controlKeyUp;

    DesignInitializer.initVariableProps($store);
  }
</script>

<main>
  {#if !isStandby}
    <MainFrame />
  {/if}
</main>
