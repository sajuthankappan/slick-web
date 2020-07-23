<script>
  import { onMount } from 'svelte';
  import { stores } from '@sapper/app';
  import { currentUser } from '../stores';
  import { getGroupSites } from '../helpers/data/reports';
  import Loading from '../components/Loading.svelte';
  import HttpError from '../components/HttpError.svelte';
  import IdPickerLevel from '../components/IdPickerLevel.svelte';

  let groupSitesPromise;
  let groupId;

  const { page } = stores();
  const { query } = $page;


  async function retrieveGroupSites() {
    const idToken = await $currentUser.getIdToken();
    const group = await getGroupSites(groupId, idToken);
    return group;
  }

  onMount(async () => {
    if (query && query.groupId) {
      groupId = query.groupId;
      groupSitesPromise = retrieveGroupSites();
    }
  });

  async function handleRetrieveGroupClicked(e) {
    e.preventDefault();
    groupId = e.detail.id;
    groupSitesPromise = retrieveGroupSites();
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
      id={groupId}
      showVersion={false}
      on:retrieve={handleRetrieveGroupClicked}
    />

    {#await groupSitesPromise}
      <Loading />
    {:then groupSites}
      {#if groupSites}
        <div class="columns">
          <div class="column">
            <table class="table">
              <caption>Sites</caption>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {#each groupSites as groupSite, i}
                  <tr>
                    <th>{groupSite.siteId.$oid}</th>
                    <td>
                      <a href={`/trend/?siteId=${groupSite.siteId.$oid}`}>{groupSite.siteName}</a>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {/if}
    {:catch error}
      <HttpError {error} />
    {/await}
  </section>
</div>
