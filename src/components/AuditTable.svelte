<script>
  export let data;
</script>

{#if data && data.items && data.items.length > 0}
  <div class="table-container is-size-7">
    <table class="table">
      <thead>
        <tr>
          {#each data.headings as heading}
            {#if (heading.itemType === 'text' || heading.itemType === 'url')}
              <th>{heading.text}</th>
            {:else}
              <th>{heading.text}</th>
            {/if}
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each data.items as item}
          <tr>
            {#each data.headings as heading}
              <td>
                {#if (heading.itemType === 'text' || heading.itemType === 'url')}
                  {item[heading.key]}
                {:else}
                  {JSON.stringify(item[heading.key])}
                {/if}
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{:else}
  <div>None / Pass</div>
{/if}