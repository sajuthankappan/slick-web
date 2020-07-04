<script>
  export let data;
</script>

<style>
  .url {
    max-width: 500px;
  }
</style>

<div class="table-container is-size-7">
  <table class="table">
    <thead>
      <tr>
        <th>#</th>
        <th>URL</th>
        <th>Start Time</th>
        <th>End Time</th>
        <th>Finished</th>
        <th>Transfer Size</th>
        <th>Resource Size</th>
        <th>Status Code</th>
        <th>Mime Type</th>
        <th>Resource Type</th>
      </tr>
    </thead>
    <tbody>
      {#each data.details.items as item, index}
        <tr class:has-background-warning={item.statusCode !== 200}>
          <td>{index + 1}</td>
          <td><div class="url">{item.url}</div></td>
          <td>{Math.round(item.startTime)}</td>
          <td>{Math.round(item.endTime)}</td>
          <td>{item.finished}</td>
          <td>{item.transferSize}</td>
          <td>{item.resourceSize}</td>
          <td>{item.statusCode}</td>
          <td>{item.mimeType}</td>
          <td>{item.resourceType}</td>
        </tr>    
      {/each}
    </tbody>
  </table>
</div>