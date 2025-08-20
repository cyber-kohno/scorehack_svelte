<script lang="ts">
  import { onMount } from "svelte";
  import useInputRoot from "./system/input/inputRoot";
  import MainFrame from "./system/MainFrame.svelte";
  import store, { createStoreUtil } from "./system/store/store";
  import DesignInitializer from "./system/util/disignInitializer";

  onMount(() => {
    DesignInitializer.initConstProps();
  });

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
  <MainFrame />
</main>
