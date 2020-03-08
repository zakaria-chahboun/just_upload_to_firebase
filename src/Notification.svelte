<script>
  export let message = "";
  export let type = "is-warning";
</script>

<style>

</style>

<div class="columns">
  <!-- Just a space for decoration -->
  <div class="column is-2" />
  <div class="column">
    <div class="notification {type}">
      <button class="delete" on:click />
      <strong>{message}</strong>
    </div>
  </div>
  <!-- Just a space for decoration -->
  <div class="column is-2" />
</div>
