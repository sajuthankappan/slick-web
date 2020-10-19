<script>
  import { onMount } from 'svelte';
  import dayjs from 'dayjs';

  let appVersion;
  let builtAtLocal;

  onMount(async () => {
    appVersion = process.env.SLICK_VERSION;
    const builtAtString = process.env.SLICK_BUILT_AT;
    builtAtLocal = dayjs(builtAtString).format('MMM D YYYY h:mm:ss a');
  });
</script>

<svelte:head>
  <title>About</title>
</svelte:head>
<div class="container">
  <div class="box">
    <h1 class="title has-text-centered">About</h1>
  </div>
  <section class="section">
    <div class="box">
      <p>Version {appVersion}</p>
      <p>Built at {builtAtLocal}</p>
    </div>
  </section>
</div>
