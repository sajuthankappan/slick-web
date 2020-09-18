<script>
  import { createEventDispatcher } from 'svelte';
  import { slide } from 'svelte/transition';
  import { currentUser } from '../stores';
  import { deleteAuditSummary } from '../helpers/data/reports';
  import HttpError from './HttpError.svelte';
  import Loading from './Loading.svelte';

  export let auditSummaryId;

  let isActive = true;
  let deleteAuditSummaryPromise;

  const dispatch = createEventDispatcher();

  async function handleCloseClicked(e) {
    e.preventDefault();
    isActive = false;
    dispatch('close', { message: 'Cancelled' });
  }

  async function handleSubmitted(e) {
    e.preventDefault();
    const idToken = await $currentUser.getIdToken();
    deleteAuditSummaryPromise = deleteAuditSummary(auditSummaryId, idToken);
  }
</script>

<div class="modal" class:is-active={isActive} >
  <form on:submit={handleSubmitted}>
    <div class="modal-background" />
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Delete Audit</p>
        <button class="delete" aria-label="close"  on:click={handleCloseClicked} />
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label" for="auditSummaryId">Audit ID</label>
          <div class="control">
            <input class="input" type="text" id="auditSummaryId" bind:value={auditSummaryId} readonly>
          </div>
        </div>
        {#if deleteAuditSummaryPromise}
          {#await deleteAuditSummaryPromise}
            <Loading />
          {:then}
            <div class="notification is-success" in:slide>
              Deleted
            </div>
          {:catch error}
            <HttpError {error} />
          {/await}
        {/if}
      </section>
      <footer class="modal-card-foot">
        <button class="button is-primary" type="submit">Delete</button>
        <button class="button" on:click={handleCloseClicked}>Close</button>
      </footer>
    </div>
  </form>
</div>
