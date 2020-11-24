<script>
  import { onMount } from 'svelte';
  // eslint-disable-next-line import/no-extraneous-dependencies
  import { stores } from '@sapper/app';
  import { currentUser, groupId } from '../stores';
  import { getGroupSites, getSite } from '../helpers/data/site';
  import HttpError from '../components/HttpError.svelte';
  import IdPickerLevel from '../components/IdPickerLevel.svelte';
  import Loading from '../components/Loading.svelte';
  import Site from '../components/Site.svelte';

  let groupSitesPromise;
  let sitePromise;
  let cloneSitePromise;

  const { page } = stores();
  const { query } = $page;


  async function retrieveGroupSites() {
    const idToken = await $currentUser.getIdToken();
    const group = await getGroupSites($groupId, idToken);
    return group;
  }

  onMount(async () => {
    if (query && query.groupId) {
      groupId.set(query.groupId);
    }
  
    if ($groupId) {
      groupSitesPromise = retrieveGroupSites();
    }
  });

  async function handleRetrieveGroupClicked(e) {
    e.preventDefault();
    sitePromise = null;
    cloneSitePromise = null;
    groupId.set(e.detail.id);
    groupSitesPromise = retrieveGroupSites();
  }

  async function handleEditSiteClicked(metaSite) {
    const idToken = await $currentUser.getIdToken();
    const siteId = metaSite._id.$oid;
    sitePromise = getSite(siteId, idToken);
  }

  async function getCloneSitePromise(metaSite) {
    const idToken = await $currentUser.getIdToken();
    const siteId = metaSite._id.$oid;
    const site = await getSite(siteId, idToken);
    site._id = null;
    site.name = null;
    return site;
  }

  async function handleCloneSiteClicked(site) {
    cloneSitePromise = getCloneSitePromise(site);
  }
</script>

<svelte:head>
  <title>Sites | Slick</title>
</svelte:head>

<div class="container">
  <div class="box">
    <h1 class="title has-text-centered">Sites</h1>
  </div>

  <section class="section">
    <IdPickerLevel
      label="Group ID"
      id={$groupId}
      showVersion={false}
      on:retrieve={handleRetrieveGroupClicked}
    />

    {#await groupSitesPromise}
      <Loading />
    {:then sites}
      {#if sites}
        <div class="columns">
          <div class="column">
            <table class="table">
              <caption>Sites</caption>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {#each sites as site, i}
                  <tr>
                    <td>
                      <a href={`/trend/?siteId=${site._id.$oid}`}>{site.name}</a>
                    </td>
                    <td>
                      <div class="buttons">
                        <a class="button is-small" href={`/trend/?siteId=${site._id.$oid}`}>Report</a>
                        <button
                          class="button is-small"
                          on:click={() => {
                            handleEditSiteClicked(site);
                          }}>
                          Edit
                        </button>
                        <button
                          class="button is-small"
                          on:click={() => {
                            handleCloneSiteClicked(site);
                          }}>
                          Clone
                        </button>
                      </div>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          {#await sitePromise}
            <Loading />
          {:then site}
            {#if site}
              <Site {site} />
            {/if}
          {/await}
        </div>
        <div>
          {#await cloneSitePromise}
            <Loading />
          {:then site}
            {#if site}
              <Site {site} />
            {/if}
          {/await}
        </div>
      {/if}
    {:catch error}
      <HttpError {error} />
    {/await}
  </section>
</div>
