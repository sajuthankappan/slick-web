<script>
  import { createEventDispatcher } from 'svelte';

  export let id = '';
  export let label;
  export let showVersion = false;
  
  let lhVersion = '6.0.0';

  const dispatch = createEventDispatcher();

  async function handleRetrieveClick(e) {
    e.preventDefault();

    dispatch('retrieve', { id });
  }
</script>

<nav class="level">
  <!-- Left side -->
  <div class="level-left">
    <div class="level-item">
      <form on:submit={handleRetrieveClick}>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">{label}</label>
          </div>
          <div class="field-body">
            <div class="field has-addons">
              <div class="control">
                <input
                  class="input"
                  bind:value={id}
                  type="text" />
              </div>
              <div class="control">
                <button type="submit" class="button is-primary is-outlined">
                  Retrieve
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>

  <!-- Right side -->
  <div class="level-right">
    {#if showVersion}
      <p class="level-item">
        <a
          href="javascript:void(0)"
          on:click={() => {
            lhVersion = '6.0.0';
            dispatch('versionChange', { lhVersion });
          }}>
          <div class:has-text-weight-bold={lhVersion === '6.0.0'}>v6</div>
        </a>
      </p>
      <p class="level-item">
        <a
          href="javascript:void(0)"
          on:click={() => {
            lhVersion = '5.6.0';
            dispatch('versionChange', { lhVersion });
          }}>
          <div class:has-text-weight-bold={lhVersion === '5.6.0'}>v5</div>
        </a>
      </p>
    {/if}
  </div>
</nav>
