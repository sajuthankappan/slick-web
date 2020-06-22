<script>export let segment;</script>

<a
  class="navbar-item"
  class:has-text-weight-bold={segment === 'site'}
  href="/site">
  Site
</a>
<a
  class="navbar-item"
  class:has-text-weight-bold={segment === 'report'}
  href="/report">
  Report
</a>
<a
  class="navbar-item"
  class:has-text-weight-bold={segment === 'stats'}
  href="/stats">
  Stats
</a>
