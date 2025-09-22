<script lang="ts">
  export let label: string;
</script>

<div class="wrap">{label}</div>

<style>
  .wrap {
    display: inline-block;
    position: relative;
    width: 100%;
    height: 30px;

    font-size: 20px;
    line-height: 26px;
    font-weight: 600;
    background-color: rgb(189, 189, 189);
    color: white;
    text-align: center;
    border-radius: 4px;
    border: 1px solid white;
    box-sizing: border-box;
  }
</style>
