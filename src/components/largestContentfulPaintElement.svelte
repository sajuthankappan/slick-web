<script>
  export let data;
</script>

<div class="table-container">
  <table class="table">
    <thead>
      <tr>
        <th>Path</th>
        <th>Selector</th>
        <th>Snippet</th>
      </tr>
    </thead>
    <tbody>
      {#each data.details.items as item}
        <tr>
          <td>{item.node.path}</td>
          <td>{item.node.selector}</td>
          <td>{item.node.snippet}</td>
        </tr>    
      {/each}
    </tbody>
  </table>
</div>