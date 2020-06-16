<script>export let segment;</script>

<a
  class="navbar-item"
  class:has-text-weight-bold={segment === 'reports'}
  href="/reports">
  Reports
</a>
<a
  class="navbar-item"
  class:has-text-weight-bold={segment === 'stats'}
  href="/stats">
  Stats
</a>
