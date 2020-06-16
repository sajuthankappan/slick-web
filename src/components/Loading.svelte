<script>
  import { onMount, onDestroy } from 'svelte';
  import NProgress from 'nprogress';

  onMount(async () => {
    NProgress.start();
  });
  
  onDestroy(() => NProgress.done());
</script>
