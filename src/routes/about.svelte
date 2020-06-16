<script context="module">
  import moment from 'moment';

  export async function preload() {
    const appVersion = '0.4.4';
    const builtAt = moment().format('DD MMM YYYY, h:mm:ss a');
    return { appVersion, builtAt };
  }
</script>

<script>
  export let builtAt;
  export let appVersion;
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
      <p>Built at {builtAt}</p>
    </div>
  </section>
</div>
