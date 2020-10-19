<script>
  import { currentUser, currentUserClaims } from '../stores';
  import { signOut } from '../helpers/firebase/auth';
</script>

<svelte:head>
  <title>Profile | Slick</title>
</svelte:head>

<div class="container">
  {#if $currentUser}
    <section class="hero is-light">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            {$currentUser.displayName}
          </h1>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="field">
        <div class="label">Email</div>
        <div class="control">
          {$currentUser.email}
        </div>
      </div>
      <div class="field">
        <div class="label">Email Verified</div>
        <div class="control">
          {#if $currentUserClaims.email_verified}Yes{:else}No{/if}
        </div>
      </div>
      <div class="buttons has-addons is-right">
        <div class="control">
          <button class="button is-primary is-outlined" on:click={signOut}>
            Sign out
          </button>
        </div>
      </div>
    </section>
  {/if}
</div>
