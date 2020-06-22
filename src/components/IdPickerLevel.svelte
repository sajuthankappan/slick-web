<script>
  import { createEventDispatcher, onMount } from 'svelte';

  export let initialId = '';
  export let label;
  
  let id;
  let lhVersion = 'v6';

  const dispatch = createEventDispatcher();

  onMount(async () => {
    id = initialId;
  });

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
    <p class="level-item">
      <a
        href="javascript:void(0)"
        on:click={() => {
          lhVersion = 'v6';
          dispatch('versionChange', { lhVersion });
        }}>
        <div class:has-text-weight-bold={lhVersion === 'v6'}>v6</div>
      </a>
    </p>
    <p class="level-item">
      <a
        href="javascript:void(0)"
        on:click={() => {
          lhVersion = 'v5';
          dispatch('versionChange', { lhVersion });
        }}>
        <div class:has-text-weight-bold={lhVersion === 'v5'}>v5</div>
      </a>
    </p>
  </div>
</nav>
