<template>
  <v-list class="sidebar-container pa-3 bg-transparent aresa-sidebar" nav>
    <!-- DASHBOARD -->
    <v-list-item
      to="/admin/"
      class="nav-item mb-2"
      prepend-icon="mdi-view-dashboard-outline"
      title="Dashboard"
    />

    <!-- MASTER DATA -->
    <div class="nav-section-label">Master</div>

    <v-list-group value="master" class="nav-group mb-1">
      <template #activator="{ props }">
        <v-list-item
          v-bind="props"
          class="nav-item"
          prepend-icon="mdi-database-outline"
          title="Master"
        />
      </template>

      <div class="nav-submenu">
        <v-list-item to="/admin/master/pasien" title="Pasien" />
        <v-list-item to="/admin/master/dokter" title="Dokter" />
        <v-list-item to="/admin/master/poli" title="Poli / Departemen" />
        <v-list-item to="/admin/master/obat" title="Obat" />
        <v-list-item to="/admin/master/supplier" title="Supplier" />
        <v-list-item to="/admin/master/layanan" title="Tindakan / Layanan" />
        <v-list-item to="/admin/master/user" title="User Management" />
      </div>
    </v-list-group>

    <!-- OPERASIONAL -->
    <div class="nav-section-label">Operasional</div>

    <v-list-item
      to="/admin/pendaftaran"
      class="nav-item mb-1"
      prepend-icon="mdi-account-plus-outline"
      title="Pendaftaran / Antrian"
    />

    <v-list-item
      to="/admin/pemeriksaan"
      class="nav-item mb-1"
      prepend-icon="mdi-file-document-edit-outline"
      title="Rekam Medis"
    />

    <v-list-item
      to="/admin/resep-obat"
      class="nav-item mb-1"
      prepend-icon="mdi-pill"
      title="Resep Obat"
    />

    <!-- KEUANGAN -->
    <div class="nav-section-label">Keuangan</div>

    <v-list-item
      to="/admin/billing"
      class="nav-item mb-1"
      prepend-icon="mdi-cash-multiple"
      title="Billing / Transaksi"
    />

    <v-list-item
      to="/admin/invoice"
      class="nav-item mb-1"
      prepend-icon="mdi-receipt-text-outline"
      title="Invoice"
    />

    <!-- LAPORAN -->
    <div class="nav-section-label">Laporan</div>

    <v-list-item
      to="/admin/laporan/harian"
      class="nav-item mb-1"
      prepend-icon="mdi-calendar-today"
      title="Laporan Harian"
    />

    <v-list-item
      to="/admin/laporan/bulanan"
      class="nav-item mb-1"
      prepend-icon="mdi-calendar-month"
      title="Laporan Bulanan"
    />

    <!-- CONTENT (opsional kalau masih dipakai) -->
    <div class="nav-section-label">Content</div>

    <v-list-item
      to="/admin/blog"
      title="Blog"
      prepend-icon="mdi-post-outline"
      class="nav-item mb-1"
    />

    <v-list-item
      to="/admin/projects"
      title="Project"
      prepend-icon="mdi-briefcase-outline"
      class="nav-item mb-1"
    />
  </v-list>
</template>

<style scoped>
.sidebar-container {
  --nav-text: rgba(255, 255, 255, 0.6);
  --nav-active-bg: rgba(255, 255, 255, 0.08);
  --nav-hover-bg: rgba(255, 255, 255, 0.05);
  --primary-accent: #195de6;
}

.nav-section-label {
  padding: 20px 12px 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.2);
}

.nav-item {
  border-radius: 8px !important;
  color: var(--nav-text) !important;
  transition: all 0.2s ease;
  min-height: 40px !important;
}

.nav-item :deep(.v-list-item__prepend .v-icon) {
  opacity: 0.5;
  font-size: 19px;
  color: #ffffff !important;
  transition: opacity 0.2s ease;
}

.nav-item:hover {
  background-color: var(--nav-hover-bg) !important;
  color: #ffffff !important;
}
.nav-item:hover :deep(.v-list-item__prepend .v-icon) {
  opacity: 1;
}

.v-list-item--active.nav-item {
  background-color: var(--nav-active-bg) !important;
  color: #ffffff !important;
  font-weight: 600;
}
.v-list-item--active.nav-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 3px;
  background-color: var(--primary-accent);
  border-radius: 0 4px 4px 0;
}
.v-list-item--active.nav-item :deep(.v-list-item__prepend .v-icon) {
  opacity: 1;
}

.nav-submenu {
  margin-left: 12px;
  border-left: 1px solid rgba(255, 255, 255, 0.06);
  padding-left: 8px;
  margin-top: 2px;
  margin-bottom: 8px;
}

.nav-submenu :deep(.v-list-item) {
  min-height: 34px !important;
  font-size: 12.5px !important;
  color: rgba(255, 255, 255, 0.45) !important;
  border-radius: 6px !important;
  padding-inline: 12px !important;
}

.nav-submenu :deep(.v-list-item:hover) {
  background-color: rgba(255, 255, 255, 0.03) !important;
  color: #ffffff !important;
}

.nav-submenu :deep(.v-list-item--active) {
  color: #ffffff !important;
  background: transparent !important;
  font-weight: 600;
}

.status-badge {
  padding: 1px 6px;
  font-size: 9px;
  font-weight: 800;
  border-radius: 4px;
  line-height: 1.2;
}
.status-badge.orange {
  background: #ff7e00;
  color: #fff;
}
.status-badge.blue {
  background: var(--primary-accent);
  color: #fff;
}
.status-badge.gray {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.aresa-sidebar :deep(.v-list-group__indicator) {
  font-size: 14px;
  opacity: 0.3;
}
</style>
