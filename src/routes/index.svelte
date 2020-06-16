<script>
  import { currentUser } from "../stores";

  export let currentUserName;
  $: currentUserName = $currentUser && $currentUser.displayName;
</script>

<svelte:head>
  <title>Slick</title>
</svelte:head>
<div class="container">
  <section class="hero">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">Welcome!</h1>
        <p>{currentUserName}</p>
      </div>
    </div>
  </section>

</div>
