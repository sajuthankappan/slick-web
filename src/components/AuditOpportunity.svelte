<script>
  export let data;
</script>

{#if data.items && data.items.length > 0}
  <div class="table-container is-size-7">
    <table class="table">
      <thead>
        <tr>
          {#each data.headings as heading}
            {#if heading.label}
              {#if (heading.valueType === 'text' || heading.valueType === 'url')}
                <th>{heading.label}</th>
              {:else}
                <th>{heading.label}</th>
              {/if}
            {/if}
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each data.items as item}
          <tr>
            {#each data.headings as heading}
              {#if heading.label}
                <td>
                  {#if (heading.valueType === 'text' || heading.valueType === 'url')}
                    {item[heading.key]}
                  {:else}
                    {JSON.stringify(item[heading.key])}
                  {/if}
                </td>
              {/if}
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{:else}
  <div>None / Pass</div>
{/if}