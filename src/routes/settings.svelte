<script>
  import { slide } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { clearDataCache } from '../helpers/cache-helper';
  import { warn, info } from '../helpers/logger';


  let messages = [];
  let showClearCache = true;
  let showEnableNotification = true;
  let notificationGranted = false;
  let notificationDenied = false;

  function addMessage(message) {
    messages.unshift(message);
    messages = messages;
  }

  onMount(async () => {
    if (!('serviceWorker' in navigator)) {
      warn('ServiceWorker not available');
      showClearCache = false;
    }

    if (!('unshiftManager' in window)) {
      warn('unshiftManager not available');
      showEnableNotification = false;
    }

    if (Notification.permission === 'granted') {
      notificationGranted = true;
    } else if (Notification.permission === 'denied') {
      warn('Notification was denied');
      notificationDenied = true;
    }
  });

  async function handleClearCacheClick() {
    messages = [];
    addMessage(clearDataCache());
  }

  async function handleEnableNotificationClick() {
    messages = [];
    try {
      const permission = await Notification.requestPermission();
  
      if (permission === 'granted') {
        notificationGranted = true;
      } else {
        addMessage('Notification not granted');
      }
    } catch (error) {
      error(error);
      addMessage(error);
    }
  }

  async function handleTestNotifyClick() {
    messages = [];
    // eslint-disable-next-line no-unused-vars
    const notification = new Notification('Test notitification!');

    notification.onshow = (event) => {
      addMessage('Notification shown');
      info(event);
    };

    notification.onclick = (event) => {
      addMessage('Notification clicked');
      info(event);
    };

    notification.onclose = (event) => {
      addMessage('Notification closed');
      info(event);
    };

    notification.onerror = (event) => {
      addMessage('Notification error');
      info(event);
    };
  }
</script>

<svelte:head>
  <title>Settings | Svelte</title>
</svelte:head>

<div class="container">
  <div class="box">
    <h1 class="title has-text-centered">Settings</h1>
  </div>
  <section class="section">
    <aside class="menu">
      <p class="menu-label">
        System
      </p>
      <ul class="menu-list">
        {#if showClearCache}
          <li>
            <a href="javascript:void(0)" on:click={handleClearCacheClick}>Clear Cached Data</a>
          </li>
        {/if}
        <li>
          {#if notificationGranted}
            <a href="javascript:void(0)" on:click={handleTestNotifyClick}>Test Notify</a>
          {:else if notificationDenied}
            <div class="notification is-danger">
              Notified was denied. Please check your browser permissions.
            </div>
          {:else if showEnableNotification}
            <a href="javascript:void(0)" on:click={handleEnableNotificationClick}>Enable Notification</a>
          {/if}
        </li>
      </ul>


    </aside>

    {#each messages as msg}
      <div class="notification is-info" in:slide>
        {msg}
      </div>
    {/each}
  </section>
</div>
