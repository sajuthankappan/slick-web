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
        <th>Name</th>
        <th>URL</th>
        <th>Transfer Size</th>
        <th>Main Thread Time</th>
        <th>Blocking Time</th>
      </tr>
    </thead>
    <tbody>
      {#each data.details.items as item, index}
        <tr>
          <td>{index + 1}</td>
          <td>{item.entity.text}</td>
          <td><div class="url">{item.entity.url}</div></td>
          <td>{item.transferSize}</td>
          <td>{item.mainThreadTime}</td>
          <td>{item.blockingTime}</td>
        </tr>    
      {/each}
    </tbody>
  </table>
</div>