<script>
  export let data;
</script>

{#if data && data.length > 0}
  <div class="table-container is-size-7">
    <table class="table">
      <thead>
        <tr>
          <th>Warning</th>
        </tr>
      </thead>
      <tbody>
        {#each data as item}
          <tr>
            <td>
                {item}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{:else}
  <div>None / Pass</div>
{/if}