<script>
  import { onMount } from 'svelte';
  import { stores } from '@sapper/app';
  import { currentUser } from '../stores';
  import { getGroup } from '../helpers/data/reports';
  import Loading from '../components/Loading.svelte';
  import HttpError from '../components/HttpError.svelte';
  import IdPickerLevel from '../components/IdPickerLevel.svelte';

  let groupPromise;
  let groupId;

  const { page } = stores();
  const { query } = $page;


  async function retrieveGroup() {
    const idToken = await $currentUser.getIdToken();
    const group = await getGroup(groupId, idToken);
    return group;
  }

  onMount(async () => {
    if (query && query.groupId) {
      groupId = query.groupId;
      groupPromise = retrieveGroup();
    }
  });

  async function handleRetrieveGroupClicked(e) {
    e.preventDefault();
    groupId = e.detail.id;
    groupPromise = retrieveGroup();
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

    {#await groupPromise}
      <Loading />
    {:then group}
      {#if group}
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
                {#each group.sites as site, i}
                  <tr>
                    <th>{site._id.$oid}</th>
                    <td>
                      <a href={`/trend/?siteId=${site._id.$oid}`}>{site.name}</a>
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
