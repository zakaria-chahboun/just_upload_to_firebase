<script>
  export let message = "";
  export let type = "is-warning";
</script>

<style>
  .fly {
    position: fixed;
    z-index: 800;
    width: 100%;
  }
</style>

<!-- <div class="columns"> -->
  <!-- Just a space for decoration -->
  <!-- <div class="column is-2" />
  <div class="column"> -->
    <div class="notification {type} fly">
      <button class="delete" on:click />
      <strong>{message}</strong>
    </div>
  <!-- </div> -->
  <!-- Just a space for decoration -->
  <!-- <div class="column is-2" />
</div> -->
