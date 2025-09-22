<script lang="ts">
  import ChordInfoHeader from "../ChordInfoHeader.svelte";
  import FocusableContent from "../FocusableContent.svelte";
  import BackingFrame from "./backing/BackingFrame.svelte";
  import VoicingChooser from "./voicing/VoicingChooser.svelte";
</script>

<div class="wrap">
  <ChordInfoHeader />
  <FocusableContent isFocus={true}>
    <VoicingChooser />
  </FocusableContent>
  <BackingFrame />
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
