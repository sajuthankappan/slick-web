<script>
  import GoogleAnalytics from 'sapper-google-analytics/GoogleAnalytics.svelte';
  // eslint-disable-next-line import/no-extraneous-dependencies
  import { stores } from '@sapper/app';
  import Nav from '../components/Nav.svelte';
  import FirebaseAuthObserver from '../components/FirebaseAuthObserver.svelte';
  import { loading } from '../stores';

  export let segment;
  // eslint-disable-next-line prefer-destructuring
  const gaKey = process.env.SLICK_GA_KEY;
</script>

<style lang="scss" global>
  @import "../style/global.scss";
</style>

<GoogleAnalytics {stores} id={gaKey}/>

<FirebaseAuthObserver {segment} />

{#if !$loading}
  <Nav {segment} />
  <main>
    <slot />
  </main>

  <footer class="footer">
    <div class="content has-text-centered">
      <p>
        <strong>Slick</strong>
        Let's make web pages slick!
      </p>
    </div>
  </footer>
{:else}
  <nav
    class="navbar is-primary"
    role="navigation"
    aria-label="main navigation">
    
  </nav>
  <section class="hero is-fullheight-with-navbar">
    <div class="hero-body">
      <div class="container has-text-centered">
        <h1 class="title">Slick</h1>
      </div>
    </div>
  </section>
{/if}
