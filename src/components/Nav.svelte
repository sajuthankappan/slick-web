<script>
  import { onMount } from 'svelte';
  import { currentUser, currentUserClaims } from '../stores';
  import UserNavItems from './UserNavItems.svelte';
  import { signOut } from '../helpers/firebase/auth';

  export let segment;
  let menuOpen = false;

  onMount(async () => {
  });
</script>

<style>
  span {
    cursor: pointer;
  }
</style>

<nav
  class="navbar is-primary"
  role="navigation"
  aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item is-uppercase has-text-weight-bold" href="/">
      Slick
    </a>

    <span
      role="button"
      class="navbar-burger burger"
      class:is-active={menuOpen}
      aria-label="menu"
      aria-expanded="false"
      on:click={() => {
        menuOpen = !menuOpen;
      }}>
      <span aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </span>
  </div>

  <div
    class="navbar-menu"
    class:is-active={menuOpen}
    on:click={() => {
      menuOpen = !menuOpen;
    }}>
    {#if $currentUser && $currentUserClaims && $currentUserClaims.slickUser}
      <div class="navbar-start">
        <UserNavItems {segment} />
      </div>
      <div class="navbar-end">
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link is-arrowless" href="/profile">
            <span class="icon">
              <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 512 512'><title>User Menu</title><path d='M344,144c-3.92,52.87-44,96-88,96s-84.15-43.12-88-96c-4-55,35-96,88-96S348,90,344,144Z'/><path d='M256,304c-87,0-175.3,48-191.64,138.6C62.39,453.52,68.57,464,80,464H432c11.44,0,17.62-10.48,15.65-21.4C431.3,352,343,304,256,304Z' /></svg>
            </span>
          </a>
          <div class="navbar-dropdown is-right">
            <a
              class="navbar-item"
              class:has-text-weight-bold={segment === 'profile'}
              href="/profile">
              Profile
            </a>
            <a
              class="navbar-item"
              class:has-text-weight-bold={segment === 'settings'}
              href="/settings">
              Settings
            </a>
            <a class="navbar-item" on:click={signOut} href="/">
              Sign out
            </a>
          </div>
        </div>
      </div>
    {:else}
      <div class="navbar-end">
        <a class="navbar-item" href="/login">Sign in</a>
      </div>
    {/if}
  </div>
</nav>
