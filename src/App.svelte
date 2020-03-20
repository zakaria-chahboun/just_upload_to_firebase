<script>
  import Home from "./Home.svelte";
  import Types from "./Types.svelte";

  // Tabs
  let pages = [
    { title: "Home", icon: "fas fa-home", target: Home },
    { title: "Manage Types", icon: "fas fa-ellipsis-v", target: Types }
  ];

  let component = pages[0].target; // by defalut
</script>

<!-- nav bar -->
<nav class="navbar is-dark " role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="#">
      <img src="favicon.png" alt="LOGO" />
    </a>
  </div>
  <div class="navbar-menu">
    <div class="navbar-start">
      <!-- Tabs -->
      {#each pages as p}
        <a class="navbar-item" on:click={() => (component = p.target)}>
          <span class="icon">
            <i class={p.icon} />
          </span>   
          {p.title}
        </a>
      {/each}
    </div>
  </div>
</nav>

<svelte:component this={component} />
