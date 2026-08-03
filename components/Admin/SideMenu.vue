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
    <div class="nav-section-label">Master Data</div>

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
        <v-list-item to="/admin/master/poli" title="Poli" />
        <v-list-item to="/admin/master/obat" title="Obat" />
        <v-list-item to="/admin/master/supplier" title="Supplier" />
        <v-list-item to="/admin/master/layanan" title="Layanan" />
        <v-list-item to="/admin/master/user" title="User" />
      </div>
    </v-list-group>

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <!-- OPERASIONAL MEDIS -->
    <div class="nav-section-label">Operasional Medis</div>

    <v-list-item
      to="/admin/pendaftaran"
      class="nav-item mb-1"
      prepend-icon="mdi-account-plus-outline"
      title="Pendaftaran"
    />

    <!-- Resep & Tindakan idealnya diinput di dalam proses Pemeriksaan ini -->
    <v-list-item
      to="/admin/pemeriksaan"
      class="nav-item mb-1"
      prepend-icon="mdi-file-document-edit-outline"
      title="Pemeriksaan & RM"
    />

    <!-- FARMASI & LOGISTIK -->
    <div class="nav-section-label">Farmasi & Logistik</div>

    <v-list-item
      to="/admin/farmasi/antrian-resep"
      class="nav-item mb-1"
      prepend-icon="mdi-clipboard-clock"
      title="Antrian Resep"
    />

    <v-list-item
      to="/admin/farmasi/penyerahan-obat"
      class="nav-item mb-1"
      prepend-icon="mdi-hospital-box"
      title="Penyerahan Obat"
    />

    <v-list-item
      to="/admin/farmasi/pembelian-stok"
      class="nav-item mb-1"
      prepend-icon="mdi-plus-box-multiple-outline"
      title="Stok Masuk (Supplier)"
    />

    <v-list-item
      to="/admin/farmasi/mutasi-stok"
      class="nav-item mb-1"
      prepend-icon="mdi-swap-horizontal"
      title="Mutasi & Penyesuaian"
    />

    <!-- KEUANGAN & KASIR -->
    <div class="nav-section-label">Keuangan</div>

    <!-- Menggabungkan konsep Billing dan Pembayaran ke dalam satu menu Kasir utama -->
    <v-list-item
      to="/admin/kasir"
      class="nav-item mb-1"
      prepend-icon="mdi-cash-register"
      title="Kasir / Pembayaran"
    />

    <v-list-item
      to="/admin/invoice"
      class="nav-item mb-1"
      prepend-icon="mdi-file-text-outline"
      title="Riwayat Invoice"
    />
  </v-list>
</template>

<style scoped>
.sidebar-container {
  --nav-text: rgba(255, 255, 255, 0.65);
  --nav-active-bg: rgba(255, 255, 255, 0.08);
  --nav-hover-bg: rgba(255, 255, 255, 0.05);
  --primary-accent: #5c6bc0;
}

.nav-section-label {
  padding: 18px 10px 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.25);
}

.nav-item {
  border-radius: 10px !important;
  color: var(--nav-text) !important;
  transition: 0.2s;
  min-height: 42px !important;
}

.nav-item:hover {
  background: var(--nav-hover-bg) !important;
  color: #fff !important;
}

.v-list-item--active.nav-item {
  background: var(--nav-active-bg) !important;
  color: #fff !important;
  font-weight: 600;
  border-left: 3px solid var(--primary-accent) !important;
  border-radius: 0 10px 10px 0 !important;
}

.nav-submenu {
  margin-left: 12px;
  padding-left: 10px;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
}

.nav-submenu :deep(.v-list-item) {
  font-size: 12.5px;
  min-height: 34px;
  color: rgba(255, 255, 255, 0.5);
  border-radius: 6px !important;
  margin-bottom: 2px;
}

.nav-submenu :deep(.v-list-item--active) {
  background: transparent !important;
  color: #fff !important;
  font-weight: 600;
}
</style>