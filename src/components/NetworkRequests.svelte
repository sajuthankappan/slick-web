<script>
  export let data;
</script>

<div class="table-container">
  <table class="table">
    <thead>
      <tr>
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
      {#each data.details.items as item}
        <tr>
          <td>{item.url}</td>
          <td>{item.startTime}</td>
          <td>{item.endTime}</td>
          <td>{item.finished}</td>
          <td>{item.endTime}</td>
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