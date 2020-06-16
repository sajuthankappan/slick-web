<script>
  import { slide } from 'svelte/transition';

  export let error;
</script>

{#if error}
  <div class="notification is-danger" in:slide>
    {error}
  </div>
{/if}