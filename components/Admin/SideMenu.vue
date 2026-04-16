<template>
  <v-list class="sidebar-container pa-3 bg-transparent aresa-sidebar" nav>
    <v-list-item
      to="/admin/"
      value="dashboard"
      class="nav-item mb-2"
      prepend-icon="mdi-grid-large"
      title="Dashboard"
      density="comfortable"
    />

    <div class="nav-section-label">Master Records</div>

    <v-list-group value="master" class="nav-group mb-1">
      <template #activator="{ props }">
        <v-list-item
          v-bind="props"
          class="nav-item"
          prepend-icon="mdi-layers-outline"
          title="Master Data"
        />
      </template>

      <div class="nav-submenu">
        <v-list-item to="/admin/master/users" title="User Management" />
        <v-list-item to="/admin/master/perusahaan" title="Daftar Perusahaan" />
        <v-list-item
          to="/admin/master/perusahaan/cabang"
          title="Kantor Cabang"
        />
        <v-list-item to="/admin/master/dokumen" title="Arsip Dokumen" />
        <v-list-item to="/admin/master/kategori/objek" title="Kategori Objek" />
        <v-list-item to="/admin/master/kategori/unmanage" title="Unmanaged" />
      </div>
    </v-list-group>

    <div class="nav-section-label">Operasional Perizinan</div>

    <v-list-item
      to="/admin/master/kategori/item"
      title="Kategori Item"
      prepend-icon="mdi-tag-multiple-outline"
      class="nav-item mb-1"
    />

    <v-list-group value="penawaran" class="nav-group mb-1">
      <template #activator="{ props }">
        <v-list-item
          v-bind="props"
          class="nav-item"
          prepend-icon="mdi-file-edit-outline"
          title="Penawaran"
        />
      </template>

      <div class="nav-submenu">
        <v-list-item to="/admin/penawaran/" title="Penawaran">
          <template #append>
            <span class="status-badge orange">2</span>
          </template>
        </v-list-item>
        <v-list-item to="/admin/penawaran/sent" title="Terkirim" />
        <v-list-item to="/admin/penawaran/spk" title="SPK" />
        <v-list-item to="/admin/penawaran/rejected" title="Dibatalkan" />
      </div>
    </v-list-group>

    <v-list-item
      to="/admin/penawaran/proses"
      class="nav-item mb-1"
      title="Dalam Proses"
      prepend-icon="mdi-sync"
    >
      <template #append>
        <span class="status-badge blue">0</span>
      </template>
    </v-list-item>

    <v-list-item
      to="/admin/penawaran/pemberkasan"
      class="nav-item mb-1"
      title="Pemberkasan"
      prepend-icon="mdi-folder-sync-outline"
    >
      <template #append>
        <span class="status-badge gray">1</span>
      </template>
    </v-list-item>

    <v-list-group value="invoice" class="nav-group mb-1">
      <template #activator="{ props }">
        <v-list-item
          v-bind="props"
          class="nav-item"
          prepend-icon="mdi-receipt-text-outline"
          title="Invoice"
        />
      </template>

      <div class="nav-submenu">
        <v-list-item to="/admin/invoice/" title="Semua Invoice" />
        <v-list-item to="/admin/invoice/disetujui" title="Disetujui" />
        <v-list-item to="/admin/invoice/dikirim" title="Dikirim" />
        <v-list-item to="/admin/invoice/diterima" title="Diterima" />
        <v-list-item to="/admin/invoice/selesai" title="Selesai" />
      </div>
    </v-list-group>

    <div class="nav-section-label">Web Content</div>
    <v-list-item
      to="/admin/blog"
      title="Berita & Blog"
      prepend-icon="mdi-newspaper-variant-outline"
      class="nav-item mb-1"
    />
    <v-list-item
      to="/admin/projects"
      title="Portfolio Project"
      prepend-icon="mdi-briefcase-variant-outline"
      class="nav-item mb-1"
    />
  </v-list>
</template>

<script setup lang="ts"></script>

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
