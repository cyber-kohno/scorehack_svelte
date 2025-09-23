<script lang="ts">
  import useReducerArrange from "../../../store/reducer/reducerArrange";
  import store from "../../../store/store";
  import ChordInfoHeader from "../ChordInfoHeader.svelte";
  import FocusableContent from "../FocusableContent.svelte";
  import BackingFrame from "./backing/BackingFrame.svelte";
  import VoicingChooser from "./voicing/VoicingChooser.svelte";

  $: reducer = useReducerArrange($store);
  $: editor = reducer.getPianoEditor();
</script>

<div class="wrap">
  <ChordInfoHeader />
  <FocusableContent isFocus={editor.control === "voicing"}>
    <VoicingChooser />
  </FocusableContent>
  {#if editor.backing != null}
    <BackingFrame />
  {/if}
</div>

<style>
  .wrap {
    display: inline-block;
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #abe4ea;
  }
</style>
