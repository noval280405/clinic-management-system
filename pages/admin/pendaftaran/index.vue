<template>
  <ConfirmationDialog ref="confirmationDialog" />

  <v-dialog
    v-model="data.dialoghapus"
    :width="$vuetify.display.mdAndUp ? '30%' : '380'"
  >
    <v-card>
      <v-card-title
        style="background-color: #0d52af"
        class="text-white font-weight-bold pa-5"
      >
        <span class="ml-5">HAPUS DATA PENDAFTARAN</span>
      </v-card-title>

      <v-card-text>
        <v-alert
          type="warning"
          class="mb-4 text-body-2"
          border="start"
          variant="tonal"
          density="comfortable"
          text="Data akan dihapus secara permanen dan tidak dapat dipulihkan. Pastikan Anda yakin sebelum melanjutkan."
        />

        <p class="text-center">
          Untuk melanjutkan proses penghapusan, silakan ketik ID Biaya berikut:
          <br />
          <span class="text-red"> "{{ data.id_pendaftaran }}" </span>
        </p>

        <a-text-field
          v-model="data.nama_id"
          label="Konfirmasi ID Biaya"
          :placeholder="data.id_pendaftaran"
          variant="outlined"
          density="comfortable"
          color="red-darken-2"
          class="mt-5"
          :rules="[
            (v) => !!v || 'ID tidak boleh kosong',
            (v) => v == data.id_pendaftaran || 'ID tidak cocok',
          ]"
          clearable
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="red" variant="flat" @click="data.dialoghapus = false">
          Batal
        </v-btn>

        <v-btn
          :disabled="data.nama_id != data.id_pendaftaran"
          color="primary"
          variant="flat"
          @click="hapuspendaftaran"
        >
          Hapus
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="data.dialogPasien"
    :width="$vuetify.display.mdAndUp ? '1040px' : '95%'"
    transition="dialog-bottom-transition"
  >
    <!-- Main Container Card dengan Background Soft Gray Premium -->
    <v-card
      class="rounded-2xl border-none overflow-hidden pa-0"
      style="
        background-color: #f8fafc;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
      "
    >
      <!-- ================= HEADER: PREMIUM SOLID GREEN GRADIENT (Pembeda Sub-Modal Pasien Baru) ================= -->
      <v-card-title
        class="d-flex justify-space-between align-start pt-5 px-6 pb-4 text-white"
        style="background: linear-gradient(135deg, #059669 0%, #10b981 100%)"
      >
        <div class="d-flex align-center ga-3">
          <div class="d-flex flex-column">
            <span
              class="text-body-1 font-weight-black text-white tracking-wide"
              style="line-height: 1; font-size: 1.5rem !important"
            >
              Registrasi Pasien Baru
            </span>
            <span
              class="text-caption text-emerald-100 font-weight-medium mt-0.5"
              style="font-size: 11px !important; letter-spacing: 0.2px"
            >
              Pencatatan Demografi Kependudukan, Validasi Nomor Penjaminan, dan
              Manajemen Kontak Darurat
            </span>
          </div>
        </div>

        <v-btn
          variant="text"
          size="32"
          color="white"
          class="rounded-lg"
          style="
            background: rgba(255, 255, 255, 0.12);
            min-width: 32px;
            height: 32px;
            padding: 0;
          "
          @click="data.dialogPasien = false"
        >
          <v-icon size="18">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- ================= BODY: DUAL-COLUMN INDEPENDENT WHITE BOXES ================= -->
      <v-card-text class="pa-6">
        <v-row>
          <!-- === KOLOM 1: IDENTITAS DEMOGRAFI, KONTAK & ADMINISTRASI === -->
          <v-col cols="12" md="6" class="d-flex">
            <v-card
              variant="flat"
              class="pa-4 rounded-xl border flex-grow-1 bg-white d-flex flex-column justify-space-between ga-2"
              style="border-color: #e2e8f0 !important"
            >
              <!-- Sub-Blok Identitas & Kontak -->
              <div class="d-flex flex-column ga-2">
                <div class="d-flex align-center ga-2 mb-2">
                  <v-icon color="emerald-darken-3" size="18"
                    >mdi-card-account-details-outline</v-icon
                  >
                  <span
                    class="text-caption text-uppercase font-weight-black text-slate-800 tracking-wider"
                  >
                    01. Profil & Kontak Kependudukan
                  </span>
                </div>

                <v-row dense>
                  <v-col cols="12">
                    <a-text-field
                      label="Nomor Induk Kependudukan (NIK)"
                      v-model="new_pasien.nik"
                      placeholder="Masukkan 16 digit NIK KTP"
                      prepend-inner-icon="mdi-card-bulleted-outline"
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>
                  <v-col cols="12">
                    <a-text-field
                      label="Nama Lengkap Pasien"
                      v-model="new_pasien.nama_pasien"
                      placeholder="Sesuai dokumen identitas resmi"
                      prepend-inner-icon="mdi-account"
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <a-select
                      label="Jenis Kelamin"
                      v-model="new_pasien.jenis_kelamin"
                      :items="['Laki-laki', 'Perempuan']"
                      prepend-inner-icon="mdi-gender-male-female"
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <a-date-picker
                      label="Tanggal Lahir"
                      v-model="new_pasien.tanggal_lahir"
                      density="comfortable"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <a-text-field
                      label="Nomor HP/WhatsApp"
                      v-model="new_pasien.no_hp"
                      placeholder="08xxxxxxxxxx"
                      prepend-inner-icon="mdi-phone-outline"
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <a-text-field
                      label="Alamat Email"
                      v-model="new_pasien.email"
                      placeholder="pasien@email.com"
                      prepend-inner-icon="mdi-email-outline"
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>
                  <v-col cols="12">
                    <a-text-field
                      label="Alamat Domisili Rumah"
                      v-model="new_pasien.alamat"
                      placeholder="Nama jalan, RT/RW, nomor rumah, kelurahan"
                      prepend-inner-icon="mdi-map-marker-outline"
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>
                </v-row>
              </div>

              <!-- Sub-Blok Finansial Jaminan / Administrasi -->
              <div
                class="d-flex flex-column ga-2 mt-3 pt-2"
                style="border-top: 1px dashed #e2e8f0"
              >
                <div class="d-flex align-center ga-2 mb-2">
                  <v-icon color="emerald-darken-3" size="18"
                    >mdi-wallet-membership</v-icon
                  >
                  <span
                    class="text-caption text-uppercase font-weight-black text-slate-800 tracking-wider"
                  >
                    02. Penjaminan Layanan Medis
                  </span>
                </div>

                <v-row dense>
                  <v-col
                    :cols="
                      new_pasien.jenis_pasien === 'umum' ||
                      !new_pasien.jenis_pasien
                        ? '12'
                        : '6'
                    "
                  >
                    <a-select
                      label="Jenis Debitur/Pasien"
                      v-model="new_pasien.jenis_pasien"
                      :items="['umum', 'bpjs', 'asuransi']"
                      prepend-inner-icon="mdi-credit-card-outline"
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>

                  <v-col cols="6" v-if="new_pasien.jenis_pasien === 'bpjs'">
                    <a-text-field
                      label="Nomor JKN BPJS"
                      v-model="new_pasien.no_bpjs"
                      placeholder="000xxxxxxxxxx"
                      prepend-inner-icon="mdi-numeric-box-multiple-outline"
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>

                  <v-col cols="6" v-if="new_pasien.jenis_pasien === 'asuransi'">
                    <a-text-field
                      label="Nomor Polis Asuransi"
                      v-model="new_pasien.no_asuransi"
                      placeholder="Ketik kode kartu asuransi"
                      prepend-inner-icon="mdi-shield-key-outline"
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </v-col>

          <!-- === KOLOM 2: REKAM KLINIS AWAL & DATA PENANGGUNG JAWAB === -->
          <v-col cols="12" md="6" class="d-flex">
            <v-card
              variant="flat"
              class="pa-4 rounded-xl border flex-grow-1 bg-white d-flex flex-column justify-space-between ga-2"
              style="border-color: #e2e8f0 !important"
            >
              <!-- Sub-Blok Rekam Klinis Awal -->
              <div class="d-flex flex-column ga-2">
                <div class="d-flex align-center ga-2 mb-2">
                  <v-icon color="emerald-darken-3" size="18"
                    >mdi-heart-pulse</v-icon
                  >
                  <span
                    class="text-caption text-uppercase font-weight-black text-slate-800 tracking-wider"
                  >
                    03. Indikator Medis & Alergi
                  </span>
                </div>

                <v-row dense>
                  <v-col cols="12" sm="4">
                    <a-select
                      label="Gol. Darah"
                      v-model="new_pasien.golongan_darah"
                      :items="['A', 'B', 'AB', 'O']"
                      prepend-inner-icon="mdi-water-outline"
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>
                  <v-col cols="12" sm="8">
                    <a-text-field
                      label="Kontraindikasi Alergi Obat/Makanan"
                      v-model="new_pasien.alergi"
                      placeholder="Isi '-' jika tidak ada alergi"
                      prepend-inner-icon="mdi-alert-octagon-outline"
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>
                  <v-col cols="12">
                    <a-text-field
                      label="Riwayat Komorbid / Penyakit Bawaan"
                      v-model="new_pasien.riwayat_penyakit"
                      placeholder="Contoh: Hipertensi, Diabetes Melitus, Asthma"
                      prepend-inner-icon="mdi-clipboard-text-outline"
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>
                </v-row>
              </div>

              <!-- Sub-Blok Penanggung Jawab / Wali -->
              <div
                class="d-flex flex-column ga-2 mt-3 pt-2"
                style="border-top: 1px dashed #e2e8f0"
              >
                <div class="d-flex align-center ga-2 mb-2">
                  <v-icon color="emerald-darken-3" size="18"
                    >mdi-account-supervisor-outline</v-icon
                  >
                  <span
                    class="text-caption text-uppercase font-weight-black text-slate-800 tracking-wider"
                  >
                    04. Kontak Penanggung Jawab (Wali)
                  </span>
                </div>

                <v-row dense>
                  <v-col cols="12" sm="6">
                    <a-text-field
                      label="Nama Penanggung Jawab"
                      v-model="new_pasien.nama_penanggung_jawab"
                      placeholder="Nama lengkap wali"
                      prepend-inner-icon="mdi-account-box-outline"
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <a-text-field
                      label="Hubungan Kekerabatan"
                      v-model="new_pasien.hubungan_penanggung"
                      placeholder="Contoh: Orang Tua, Suami, Istri, Anak"
                      prepend-inner-icon="mdi-account-vector"
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>
                  <v-col cols="12">
                    <a-text-field
                      label="No. HP Darurat Penanggung Jawab"
                      v-model="new_pasien.no_hp_penanggung"
                      placeholder="Nomor telepon yang dapat dihubungi segera"
                      prepend-inner-icon="mdi-phone-alert-outline"
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>
                </v-row>
              </div>

              <!-- Sub-Blok Status Operasional Sistem -->
              <div
                class="d-flex flex-column ga-2 mt-3 pt-2"
                style="border-top: 1px dashed #e2e8f0"
              >
                <v-row dense>
                  <v-col cols="12">
                    <a-select
                      label="Status Berkas Akses Rekam Medis"
                      v-model="new_pasien.status"
                      :items="['aktif', 'nonaktif']"
                      prepend-inner-icon="mdi-list-status"
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <!-- ================= ACTIONS: COMPACT FINTECH BUTTONS ================= -->
      <v-card-actions
        class="px-6 pb-4 pt-2 d-flex justify-end ga-2"
        style="background-color: #f1f5f9; border-top: 1px solid #e2e8f0"
      >
        <v-btn
          variant="text"
          color="grey-darken-3"
          style="
            font-weight: 700;
            border-radius: 6px;
            height: 36px;
            text-transform: none;
            letter-spacing: 0;
          "
          class="text-caption px-5"
          @click="data.dialogPasien = false"
        >
          Cancel
        </v-btn>

        <v-btn
          color="blue"
          variant="flat"
          class="text-caption px-5 text-white"
          @click="addPasien"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="data.dialogAdd"
    :width="$vuetify.display.mdAndUp ? '1040px' : '95%'"
    transition="dialog-bottom-transition"
  >
    <v-card
      class="rounded-2xl border-none overflow-hidden pa-0"
      style="
        background-color: #f8fafc;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
      "
    >
      <v-card-title
        class="d-flex justify-space-between align-start pt-5 px-6 pb-4 text-white"
        style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)"
      >
        <div class="d-flex align-center ga-3">
          <div class="d-flex flex-column">
            <span
              class="text-body-1 font-weight-black text-white tracking-wide"
              style="line-height: 1; font-size: 1.5rem !important"
            >
              {{ titleaddedit }}
            </span>
            <span
              class="text-caption text-blue-100 font-weight-medium mt-0.5"
              style="font-size: 11px !important; letter-spacing: 0.2px"
            >
              Registrasi Kunjungan Pasien, Penjaminan Administrasi, dan Alokasi
              Slot Antrian Poliklinik
            </span>
          </div>
        </div>

        <v-btn
          variant="text"
          size="32"
          color="white"
          class="rounded-lg"
          style="
            background: rgba(255, 255, 255, 0.12);
            min-width: 32px;
            height: 32px;
            padding: 0;
          "
          @click="data.dialogAdd = false"
        >
          <v-icon size="18">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-6">
        <v-row>
          <v-col cols="12" md="6" class="d-flex">
            <v-card
              variant="flat"
              class="pa-4 rounded-xl border flex-grow-1 bg-white d-flex flex-column justify-space-between ga-2"
              style="border-color: #e2e8f0 !important"
            >
              <div class="d-flex flex-column ga-2">
                <div class="d-flex align-center ga-2 mb-2">
                  <v-icon color="blue-darken-3" size="18"
                    >mdi-account-box-outline</v-icon
                  >
                  <span
                    class="text-caption text-uppercase font-weight-black text-slate-800 tracking-wider"
                  >
                    01. Berkas Data Pasien
                  </span>
                </div>

                <v-row dense class="align-start">
                  <v-col cols="9">
                    <a-autocomplete
                      label="Pilih Nama Pasien"
                      v-model="new_pendaftaran.id_pasien"
                      :items="pasienStore.getDataPasien"
                      item-title="nama_pasien"
                      item-value="id"
                      prepend-inner-icon="mdi-account-search"
                      variant="outlined"
                      density="comfortable"
                      clearable
                    />
                  </v-col>
                  <v-col cols="3">
                    <v-btn
                      color="blue-lighten-5"
                      variant="flat"
                      style="
                        height: 44px;
                        text-transform: none;
                        border: 1px solid #bfdbfe;
                      "
                      class="w-100 text-blue-darken-4 font-weight-bold text-caption rounded-lg"
                      @click="data.dialogPasien = true"
                    >
                      <v-icon size="16" class="mr-1">mdi-plus-circle</v-icon>
                      Baru
                    </v-btn>
                  </v-col>
                </v-row>

                <v-expand-transition>
                  <v-alert
                    v-if="selectedPasien"
                    color="blue-darken-3"
                    variant="tonal"
                    density="comfortable"
                    class="rounded-lg mt-1 border-none"
                    icon="mdi-account-check-outline"
                  >
                    <div
                      class="text-caption font-weight-bold text-slate-700"
                      style="font-size: 11.5px !important"
                    >
                      {{ selectedPasien.nama_pasien }} •
                      {{ selectedPasien.jenis_kelamin }} •
                      {{ selectedPasien.no_hp || "-" }}
                    </div>
                  </v-alert>
                </v-expand-transition>
              </div>

              <div
                class="d-flex flex-column ga-2 mt-3 pt-2"
                style="border-top: 1px dashed #e2e8f0"
              >
                <div class="d-flex align-center ga-2 mb-2">
                  <v-icon color="blue-darken-3" size="18"
                    >mdi-shield-check-outline</v-icon
                  >
                  <span
                    class="text-caption text-uppercase font-weight-black text-slate-800 tracking-wider"
                  >
                    02. Metode Bayar & Keluhan
                  </span>
                </div>

                <v-row dense>
                  <v-col
                    :cols="new_pendaftaran.jenis_pasien === 'bpjs' ? '6' : '12'"
                  >
                    <a-select
                      label="Metode Pembayaran"
                      v-model="new_pendaftaran.jenis_pasien"
                      :items="['umum', 'bpjs', 'asuransi']"
                      prepend-inner-icon="mdi-wallet-membership"
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>

                  <v-col
                    cols="6"
                    v-if="new_pendaftaran.jenis_pasien === 'bpjs'"
                  >
                    <a-text-field
                      label="Nomor Kartu BPJS"
                      v-model="new_pendaftaran.no_bpjs"
                      placeholder="Masukkan 13 digit no kartu"
                      prepend-inner-icon="mdi-card-account-details"
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>

                  <v-col cols="12">
                    <a-text-field
                      label="Keluhan Awal Pasien"
                      v-model="new_pendaftaran.keluhan"
                      placeholder="Contoh: Sakit kepala hebat, mual semenjak kemarin malam"
                      prepend-inner-icon="mdi-emoticon-sick-outline"
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" class="d-flex">
            <v-card
              variant="flat"
              class="pa-4 rounded-xl border flex-grow-1 bg-white d-flex flex-column justify-space-between ga-2"
              style="border-color: #e2e8f0 !important"
            >
              <div class="d-flex flex-column ga-2">
                <div class="d-flex align-center ga-2 mb-2">
                  <v-icon color="blue-darken-3" size="18"
                    >mdi-calendar-clock</v-icon
                  >
                  <span
                    class="text-caption text-uppercase font-weight-black text-slate-800 tracking-wider"
                  >
                    03. Destinasi Unit & Jadwal
                  </span>
                </div>

                <a-date-picker
                  label="Tanggal Rencana Kunjungan"
                  v-model="new_pendaftaran.tanggal_kunjungan"
                  density="comfortable"
                  variant="outlined"
                  class="mb-1"
                />

                <v-row dense>
                  <v-col cols="6">
                    <a-select
                      label="Poliklinik Tujuan"
                      v-model="new_pendaftaran.id_poli"
                      :items="poliStore.getDataPoli"
                      item-title="nama_poli"
                      item-value="id"
                      prepend-inner-icon="mdi-hospital-building"
                      variant="outlined"
                      density="comfortable"
                      clearable
                    />
                  </v-col>

                  <v-col cols="6">
                    <a-select
                      label="Dokter Pemeriksa"
                      v-model="new_pendaftaran.id_dokter"
                      :items="dokterAvailable"
                      item-title="nama_dokter"
                      item-value="id"
                      prepend-inner-icon="mdi-doctor"
                      :disabled="!new_pendaftaran.id_poli"
                      variant="outlined"
                      density="comfortable"
                      clearable
                    />
                  </v-col>
                </v-row>
              </div>

              <div
                class="d-flex flex-column ga-2 mt-3 pt-2"
                style="border-top: 1px dashed #e2e8f0"
              >
                <div class="d-flex align-center ga-2 mb-1">
                  <v-icon color="blue-darken-3" size="17">mdi-gauge</v-icon>
                  <span
                    class="text-caption text-uppercase font-weight-black text-slate-800 tracking-wider"
                    style="font-size: 11px"
                  >
                    04. Live Tracker Kuota Layanan
                  </span>
                </div>

                <v-expand-transition>
                  <div
                    v-if="
                      new_pendaftaran.id_poli &&
                      new_pendaftaran.tanggal_kunjungan
                    "
                    class="pa-3 rounded-xl border d-flex flex-column ga-1"
                    style="
                      background-color: #f8fafc;
                      border-color: #f1f5f9 !important;
                    "
                  >
                    <div
                      class="d-flex justify-space-between align-center text-caption font-weight-bold"
                    >
                      <span class="text-slate-600">
                        Terisi:
                        <b class="text-slate-900 text-body-2 font-weight-black">
                          {{
                            getJumlahPoliHariIni(
                              new_pendaftaran.id_poli,
                              new_pendaftaran.tanggal_kunjungan,
                            )
                          }}
                        </b>
                        / {{ getMaxPoli(new_pendaftaran.id_poli) }} Pasien
                      </span>

                      <v-chip
                        size="x-small"
                        :color="
                          getSisaKuotaPoli(
                            new_pendaftaran.id_poli,
                            new_pendaftaran.tanggal_kunjungan,
                          ) <= 3
                            ? 'red'
                            : 'green'
                        "
                        variant="flat"
                        class="px-2 font-weight-black text-white text-uppercase"
                      >
                        Sisa Slot:
                        {{
                          getSisaKuotaPoli(
                            new_pendaftaran.id_poli,
                            new_pendaftaran.tanggal_kunjungan,
                          )
                        }}
                      </v-chip>
                    </div>

                    <v-progress-linear
                      :model-value="
                        (getJumlahPoliHariIni(
                          new_pendaftaran.id_poli,
                          new_pendaftaran.tanggal_kunjungan,
                        ) /
                          getMaxPoli(new_pendaftaran.id_poli)) *
                        100
                      "
                      height="8"
                      rounded
                      :color="
                        getSisaKuotaPoli(
                          new_pendaftaran.id_poli,
                          new_pendaftaran.tanggal_kunjungan,
                        ) <= 3
                          ? 'red'
                          : 'blue-darken-3'
                      "
                      class="mt-1"
                    />
                  </div>

                  <div
                    v-else
                    class="pa-4 rounded-xl border text-center text-caption text-slate-400 font-weight-medium bg-slate-50 border-dashed style='border-color: #cbd5e1 !important;'"
                  >
                    <v-icon size="16" class="mr-1"
                      >mdi-information-outline</v-icon
                    >
                    Pilih unit poliklinik & tanggal kunjungan untuk meninjau
                    ketersediaan kuota antrian.
                  </div>
                </v-expand-transition>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions
        class="px-6 pb-4 pt-2 d-flex justify-end ga-2"
        style="background-color: #f1f5f9; border-top: 1px solid #e2e8f0"
      >
        <v-btn
          variant="text"
          color="grey-darken-3"
          style="
            font-weight: 700;
            border-radius: 6px;
            height: 36px;
            text-transform: none;
            letter-spacing: 0;
          "
          class="text-caption px-5"
          @click="data.dialogAdd = false"
        >
          Batal
        </v-btn>

        <v-btn
          color="blue-darken-3"
          variant="flat"
          style="
            font-weight: 700;
            border-radius: 6px;
            height: 36px;
            text-transform: none;
            letter-spacing: 0.2px;
          "
          class="text-caption px-5 text-white"
          :disabled="
            getSisaKuotaPoli(
              new_pendaftaran.id_poli,
              new_pendaftaran.tanggal_kunjungan,
            ) <= 0
          "
          @click="validate"
        >
          <v-icon size="14" class="mr-1.5">mdi-calendar-check</v-icon>
          {{ bottomAddEdit }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Main Content -->
  <v-row align="center">
    <v-col cols="9">
      <v-breadcrumbs>
        <v-breadcrumbs-item>
          <span class="font-weight-medium text-h5">Pendaftaran </span>
        </v-breadcrumbs-item>
      </v-breadcrumbs>
    </v-col>

    <v-col cols="3">
      <v-btn
        size="28"
        variant="outlined"
        color="grey-darken-1"
        class="border mr-3"
        @click="refreshData"
      >
        <v-icon size="18" icon="mdi-refresh" />
        <v-tooltip activator="parent" location="top"> Refresh Data </v-tooltip>
      </v-btn>

      <v-btn
        color="primary"
        @click="openDialogAdd"
        variant="flat"
        size="small"
        class="text-capitalize px-3"
        prepend-icon="mdi-plus"
      >
        Tambah Pendaftaran
      </v-btn>
    </v-col>
  </v-row>

  <v-card class="mb-3">
    <v-card-text>
      <!-- HEADER -->
      <v-row align="center" justify="space-between" class="mb-2">
        <v-col cols="auto">
          <div class="text-body-1 font-weight-medium text-grey-darken-1">
            Filter Pencarian
          </div>
        </v-col>

        <v-col cols="auto">
          <v-btn
            size="small"
            color="primary"
            variant="flat"
            rounded="xl"
            @click="showFilter = !showFilter"
          >
            <v-icon>
              {{ showFilter ? "mdi-chevron-up" : "mdi-chevron-down" }}
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-divider />

      <!-- CONTENT -->
      <v-expand-transition>
        <div v-show="showFilter">
          <v-row class="mt-3" align="end">
            <!-- STATUS -->
            <v-col cols="12" sm="3">
              <a-select
                v-model="filter.status"
                :items="[
                  'Semua',
                  'Menunggu',
                  'Disetujui',
                  'Diperiksa',
                  'Diproses',
                  'Selesai',
                  'Batal',
                ]"
                label="Status"
                variant="outlined"
                density="comfortable"
              />
            </v-col>

            <!-- POLI -->
            <v-col cols="12" sm="3">
              <a-select
                v-model="filter.poli"
                :items="listPoli"
                label="Poli"
                variant="outlined"
                density="comfortable"
                clearable
              />
            </v-col>

            <!-- DOKTER -->
            <v-col cols="12" sm="3">
              <a-select
                v-model="filter.dokter"
                :items="listDokter"
                label="Dokter"
                variant="outlined"
                density="comfortable"
                clearable
              />
            </v-col>

            <!-- RESET -->
            <v-col cols="12" sm="3">
              <v-btn color="grey" variant="tonal" block @click="resetFilter">
                Reset Filter
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-expand-transition>
    </v-card-text>
  </v-card>

  <v-card class="border rounded-lg" flat>
    <v-card-title class="pa-3">
      <v-row align="center">
        <v-col cols="12" sm="10">
          <a-text-field
            v-model="data.search"
            placeholder="Search"
            style="max-width: 280px"
          />
        </v-col>

        <v-col cols="12" sm="2" class="text-caption text-grey-darken-1">
          Total: {{ pendaftaranStore.getDataPendaftaran.length }} Pendaftaran
        </v-col>
      </v-row>
    </v-card-title>

    <v-divider />

    <v-data-table
      :headers="data.headPendaftaran"
      :items="filteredData"
      :search="data.search"
      density="compact"
      :items-per-page="data.itemsPerPage"
      v-model:page="data.page"
    >
      <!-- NO -->
      <template v-slot:item.no="{ index }">
        <span class="text-caption font-weight-bold text-grey-darken-1">
          {{ (data.page - 1) * data.itemsPerPage + index + 1 }}
        </span>
      </template>

      <!-- ANTRIAN -->
      <template v-slot:item.nomor_antrian="{ item }">
        <v-chip color="primary" size="small" class="font-weight-bold">
          {{ item.nomor_antrian }}
        </v-chip>
      </template>

      <!-- PASIEN -->
      <template v-slot:item.nama_pasien="{ item }">
        <span class="font-weight-medium">
          {{ item.nama_pasien || "-" }}
        </span>
      </template>

      <!-- POLI -->
      <template v-slot:item.nama_poli="{ item }">
        <v-chip size="x-small" color="indigo" class="text-white">
          {{ item.nama_poli }}
        </v-chip>
      </template>

      <!-- DOKTER -->
      <template v-slot:item.nama_dokter="{ item }">
        <span class="text-caption">
          {{ item.nama_dokter }}
        </span>
      </template>

      <!-- STATUS -->
      <template v-slot:item.status="{ item }">
        <v-chip
          size="small"
          :color="
            {
              Menunggu: 'orange',
              Disetujui: 'indigo',
              Diperiksa: 'teal',
              Diproses: 'blue',
              Selesai: 'green',
              Dibatalkan: 'red',
              Resep: 'purple',
              Draft: 'grey',
            }[item.status] || 'grey'
          "
          class="text-white font-weight-medium"
          label
        >
          <v-icon start size="14">
            {{
              {
                Menunggu: "mdi-clock-outline",
                Disetujui: "mdi-check-decagram",
                Diperiksa: "mdi-stethoscope",
                Diproses: "mdi-progress-clock",
                Selesai: "mdi-check-circle",
                Dibatalkan: "mdi-close-circle",
                Resep: "mdi-pill",
                Draft: "mdi-file-document-edit-outline",
              }[item.status] || "mdi-help-circle"
            }}
          </v-icon>

          {{ item.status || "-" }}
        </v-chip>
      </template>

      <!-- AKSI -->
      <template v-slot:item.aksi="{ item }">
        <div class="d-flex justify-center">
          <v-btn
            size="25"
            color="info"
            variant="tonal"
            class="mr-1"
            :to="'/admin/pendaftaran/' + item.id"
          >
            <v-icon icon="mdi-eye" />
          </v-btn>

          <!-- <v-btn
            size="25"
            color="error"
            variant="tonal"
            @click="opendialoghapus(item.id!)"
            class="mr-1"
          >
            <v-icon icon="mdi-delete" />
          </v-btn> -->
        </div>
      </template>

      <!-- NO DATA -->
      <template v-slot:no-data>
        <div class="text-center py-6 text-grey">
          <v-icon icon="mdi-account-clock-outline" size="40" />
          <div>Tidak ada antrian pasien</div>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import _ from "lodash";
import moment from "moment";
import { reactive } from "vue";
import { usePendaftaranStores } from "~/stores/pendaftaranStore";
import type { pasienM } from "~/types/master/pasienModel";
import type { pendaftaranM } from "~/types/pendaftaranModel";
const pasienStore = usePasienStores();
const poliStore = usePoliStores();
const dokterStore = useDokterStores();
const pendaftaranStore = usePendaftaranStores();
const notificationStore = useNotificationStore();
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(
  null,
);

definePageMeta({
  layout: "admin",
});

onMounted(async () => {
  sessionStorage.removeItem("m_pendaftaran");
  await pendaftaranStore.tarikDataPendaftaran();
});

const defaultPendaftaran = (): pendaftaranM => ({
  id_pasien: "",
  id_dokter: "",
  id_poli: "",
  nama_pasien: "",
  nama_dokter: "",
  nama_poli: "",
  tanggal_kunjungan: "",
  status: "Menunggu",
  created_at: 0,
  created_by: "",
});

const new_pendaftaran = ref<pendaftaranM>(defaultPendaftaran());

const defaultPasien = (): pasienM => ({
  nik: "",
  nama_pasien: "",
  jenis_kelamin: "L",
  tanggal_lahir: "",
  no_hp: "",
  email: "",
  alamat: "",
  jenis_pasien: "umum",
  no_bpjs: "",
  no_asuransi: "",
  golongan_darah: "O",
  alergi: "",
  riwayat_penyakit: "",
  nama_penanggung_jawab: "",
  hubungan_penanggung: "",
  no_hp_penanggung: "",
  status: "aktif",
  created_at: 0,
  created_by: "",
});

const new_pasien = ref<pasienM>(defaultPasien());

const data = reactive({
  search: "",
  id_pendaftaran: "",
  nama_id: "",
  dialoghapus: false,
  dialogAdd: false,
  dialogEdit: false,
  dialogPasien: false,
  addedit: "",
  page: 1,
  itemsPerPage: 10,

  headPendaftaran: [
    {
      title: "No",
      value: "no",
      align: "center",
      width: "50px",
    },
    {
      title: "Antrian",
      value: "no_antrian",
      sortable: true,
    },
    {
      title: "Pasien",
      value: "nama_pasien",
      sortable: true,
    },
    {
      title: "Poli",
      value: "nama_poli",
      sortable: true,
    },
    {
      title: "Dokter",
      value: "nama_dokter",
      sortable: true,
    },
    {
      title: "Status",
      value: "status",
      sortable: true,
    },
    {
      title: "Tanggal",
      value: "tanggal_kunjungan",
      sortable: true,
    },
    {
      title: "Aksi",
      value: "aksi",
      align: "center",
      width: "90px",
    },
  ],
});

const showFilter = ref(false);

const filter = reactive({
  status: "Semua",
  poli: "",
  dokter: "",
});

const listPoli = computed(() => {
  const set = new Set(
    pendaftaranStore.getDataPendaftaran.map((i: any) => i.nama_poli),
  );
  return ["Semua", ...Array.from(set)];
});

const listDokter = computed(() => {
  const set = new Set(
    pendaftaranStore.getDataPendaftaran.map((i: any) => i.nama_dokter),
  );
  return ["Semua", ...Array.from(set)];
});

const filteredData = computed(() => {
  return pendaftaranStore.getDataPendaftaran.filter((item: pendaftaranM) => {
    const matchStatus =
      filter.status === "Semua" || item.status === filter.status;

    const matchPoli =
      !filter.poli || filter.poli === "Semua" || item.nama_poli === filter.poli;

    const matchDokter =
      !filter.dokter ||
      filter.dokter === "Semua" ||
      item.nama_dokter === filter.dokter;

    return matchStatus && matchPoli && matchDokter;
  });
});

function resetFilter() {
  filter.status = "Semua";
  filter.poli = "";
  filter.dokter = "";
  data.search = "";
}

watch(
  () => new_pendaftaran.value.id_pasien,
  async (idpasien) => {
    const datapasien = pasienStore.getDataPasien;
    const b = _.find(datapasien, (o: any) => o.id == idpasien);
    if (!_.isUndefined(b)) {
      new_pendaftaran.value.nama_pasien = b!.nama_pasien;
    }
  },
);

watch(
  () => new_pendaftaran.value.id_poli,
  async (idpoli) => {
    const datapoli = poliStore.getDataPoli;
    const b = _.find(datapoli, (o: any) => o.id == idpoli);
    if (!_.isUndefined(b)) {
      new_pendaftaran.value.nama_poli = b!.nama_poli;
      await dokterStore.tarikDataDokterByPoli(b.id!);
    }
  },
);

watch(
  () => new_pendaftaran.value.id_dokter,
  async (iddokter) => {
    const datadokter = dokterStore.getDataDokter;
    const b = _.find(datadokter, (o: any) => o.id == iddokter);
    if (!_.isUndefined(b)) {
      new_pendaftaran.value.nama_dokter = b!.nama_dokter;
    }
  },
);

watch(
  () => new_pendaftaran.value.jenis_pasien,
  (val) => {
    if (val !== "bpjs") {
      new_pendaftaran.value.no_bpjs = "";
    }
  },
);

function getSisaKuotaPoli(idPoli: string, tanggal: string) {
  const poli = poliStore.getDataPoli.find((p: any) => p.id === idPoli);

  if (!poli) return 0;

  const jumlah = pendaftaranStore.getDataPendaftaran.filter(
    (p: any) =>
      p.id_poli === idPoli &&
      moment(p.tanggal_kunjungan).format("YYYY-MM-DD") ===
        moment(tanggal).format("YYYY-MM-DD"),
  ).length;

  return (poli.max_antrian_per_hari || 0) - jumlah;
}

function getJumlahPoliHariIni(idPoli: string, tanggal: string) {
  return pendaftaranStore.getDataPendaftaran.filter(
    (p: any) =>
      p.id_poli === idPoli &&
      moment(p.tanggal_kunjungan).format("YYYY-MM-DD") ===
        moment(tanggal).format("YYYY-MM-DD"),
  ).length;
}

function getMaxPoli(idPoli: string) {
  const poli = poliStore.getDataPoli.find((p: any) => p.id === idPoli);
  return poli?.max_antrian_per_hari || 0;
}

const selectedPasien = computed(() =>
  pasienStore.getDataPasien.find(
    (p) => p.id === new_pendaftaran.value.id_pasien,
  ),
);

const dokterAvailable = computed(() => {
  if (!new_pendaftaran.value.id_poli) return [];

  return dokterStore.getDataDokter.filter((d: any) => {
    return (
      String(d.id_poli) === String(new_pendaftaran.value.id_poli) &&
      d.status === "aktif"
    );
  });
});

const titleaddedit = computed(() => {
  if (data.addedit == "add") {
    return "TAMBAH PENDAFTARAN";
  } else {
    return "EDIT PENDAFTARAN";
  }
});

const bottomAddEdit = computed(() => {
  if (data.addedit == "add") {
    return "Simpan";
  } else {
    return "Edit";
  }
});

async function openDialogAdd() {
  await pasienStore.tarikDataPasien();
  await poliStore.tarikDataPoli();
  await dokterStore.tarikDataDokter();
  new_pendaftaran.value = defaultPendaftaran();
  data.addedit = "add";
  data.dialogAdd = true;
}

async function validate() {
  if (data.addedit == "add") {
    addPendaftaran();
  } else {
    saveedit();
  }
}

async function saveedit() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Edit",
    "Anda yakin ingin mengedit data ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("edit data dibatalkan");
  }
  new_pendaftaran.value.updated_at = moment().unix();
  new_pendaftaran.value.updated_by = useUserStore().getEmail;
  const c = await updatePendaftaran(new_pendaftaran.value);
  if (c == "ok") {
    notificationStore.showSuccess("Data pendaftaran berhasil diedit");
  } else {
    notificationStore.showError("Gagal mengedit data pendaftaran");
    return;
  }
  data.dialogAdd = false;
  refreshData();
}

function openDialogEdit(item: pendaftaranM) {
  data.addedit = "edit";
  new_pendaftaran.value = _.assign({}, item);
  data.dialogAdd = true;
}

async function addPendaftaran() {
  if (!new_pendaftaran.value.id_pasien) {
    return notificationStore.showError("Pasien wajib dipilih");
  }

  if (!new_pendaftaran.value.id_poli) {
    return notificationStore.showError("Poli wajib dipilih");
  }

  const sisaPoli = getSisaKuotaPoli(
    new_pendaftaran.value.id_poli,
    new_pendaftaran.value.tanggal_kunjungan,
  );

  if (sisaPoli <= 0) {
    return notificationStore.showError("Kuota poli sudah penuh");
  }

  if (!new_pendaftaran.value.id_dokter) {
    return notificationStore.showError("Dokter wajib dipilih");
  }

  if (!new_pendaftaran.value.tanggal_kunjungan) {
    return notificationStore.showError("Tanggal kunjungan wajib diisi");
  }

  if (!new_pendaftaran.value.jenis_pasien) {
    return notificationStore.showError("Jenis pasien wajib dipilih");
  }

  if (new_pendaftaran.value.jenis_pasien !== "bpjs") {
    new_pendaftaran.value.no_bpjs = "";
  }

  if (
    new_pendaftaran.value.jenis_pasien === "bpjs" &&
    !new_pendaftaran.value.no_bpjs
  ) {
    return notificationStore.showError("No BPJS wajib diisi");
  }

  if (!new_pendaftaran.value.keluhan) {
    return notificationStore.showError("Keluhan pasien wajib diisi");
  }

  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Tambah",
    "Anda yakin ingin menambahkan data ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("tambah data dibatalkan");
  }

  new_pendaftaran.value.created_at = moment().unix();
  new_pendaftaran.value.created_by = useUserStore().getEmail;

  const c = await setPendaftaran(new_pendaftaran.value);

  if (c == "ok") {
    notificationStore.showSuccess("Data pendaftaran berhasil ditambahkan");
  } else {
    notificationStore.showError("Gagal menambahkan data pendaftaran");
    return;
  }

  await pendaftaranStore.tarikDataPendaftaran();
  data.dialogAdd = false;
  refreshData();
}

async function addPasien() {
  if (!new_pasien.value.nik?.trim()) {
    return notificationStore.showError("NIK wajib diisi");
  }

  if (!/^\d{16}$/.test(new_pasien.value.nik)) {
    return notificationStore.showError("NIK harus 16 digit angka");
  }

  if (!new_pasien.value.nama_pasien?.trim()) {
    return notificationStore.showError("Nama pasien wajib diisi");
  }

  if (!new_pasien.value.jenis_kelamin) {
    return notificationStore.showError("Jenis kelamin wajib dipilih");
  }

  if (!new_pasien.value.tanggal_lahir) {
    return notificationStore.showError("Tanggal lahir wajib diisi");
  }

  const today = new Date();
  const tglLahir = new Date(new_pasien.value.tanggal_lahir);

  if (tglLahir > today) {
    return notificationStore.showError("Tanggal lahir tidak valid");
  }

  if (!new_pasien.value.no_hp?.trim()) {
    return notificationStore.showError("Nomor HP wajib diisi");
  }

  if (!/^08\d{8,12}$/.test(new_pasien.value.no_hp)) {
    return notificationStore.showError("Format nomor HP tidak valid");
  }

  if (new_pasien.value.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(new_pasien.value.email)) {
      return notificationStore.showError("Format email tidak valid");
    }
  }

  if (!new_pasien.value.alamat?.trim()) {
    return notificationStore.showError("Alamat wajib diisi");
  }

  if (!new_pasien.value.jenis_pasien) {
    return notificationStore.showError("Jenis pasien wajib dipilih");
  }

  if (new_pasien.value.jenis_pasien === "bpjs") {
    if (!new_pasien.value.no_bpjs?.trim()) {
      return notificationStore.showError("Nomor BPJS wajib diisi");
    }

    if (!/^\d{13}$/.test(new_pasien.value.no_bpjs)) {
      return notificationStore.showError("Nomor BPJS harus 13 digit");
    }
  }

  if (new_pasien.value.jenis_pasien === "asuransi") {
    if (!new_pasien.value.no_asuransi?.trim()) {
      return notificationStore.showError("Nomor asuransi wajib diisi");
    }
  }

  if (new_pasien.value.no_hp_penanggung) {
    if (!/^08\d{8,12}$/.test(new_pasien.value.no_hp_penanggung)) {
      return notificationStore.showError(
        "Format nomor HP penanggung tidak valid",
      );
    }
  }

  if (!new_pasien.value.status) {
    return notificationStore.showError("Status pasien wajib dipilih");
  }

  // 🔥 VALIDASI DUPLIKAT
  const existingPasien = pasienStore.getDataPasien;

  // cek NIK sama
  const nikExist = existingPasien.find(
    (p: any) => p.nik === new_pasien.value.nik,
  );

  if (nikExist) {
    return notificationStore.showError(
      `NIK sudah terdaftar atas nama ${nikExist.nama_pasien}`,
    );
  }

  // cek nama + NIK sama
  const sameData = existingPasien.find(
    (p: any) =>
      p.nik === new_pasien.value.nik &&
      p.nama_pasien.toLowerCase() ===
        new_pasien.value.nama_pasien.toLowerCase(),
  );

  if (sameData) {
    return notificationStore.showError(
      `Pasien ${new_pasien.value.nama_pasien} dengan NIK tersebut sudah ada`,
    );
  }

  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Tambah",
    "Anda yakin ingin menambahkan data ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("tambah data dibatalkan");
  }

  try {
    new_pasien.value.nama_pasien = new_pasien.value.nama_pasien.trim();

    new_pasien.value.alamat = new_pasien.value.alamat.trim();

    new_pasien.value.created_at = moment().unix();
    new_pasien.value.created_by = useUserStore().getEmail;

    console.log("DATA PASIEN BARU", new_pasien.value);
    useloadingStore().setLoading(true);
    const c = await setPasien(new_pasien.value);

    if (c == "ok") {
      notificationStore.showSuccess("Data pasien berhasil ditambahkan");
    } else {
      return notificationStore.showError("Gagal menambahkan data pasien");
    }

    useloadingStore().setLoading(false);
    await pasienStore.tarikDataPasien();
    new_pasien.value = defaultPasien();
    data.dialogPasien = false;
    refreshData();
  } catch (error) {
    console.error(error);
    notificationStore.showError("Terjadi kesalahan saat menyimpan data");
  }
}

function opendialoghapus(id_pendaftaran: string) {
  data.dialoghapus = true;
  data.id_pendaftaran = id_pendaftaran;
  data.nama_id = "";
}

async function hapuspendaftaran() {
  const confirmed = await confirmationDialog.value?.show(
    "Konfirmasi Hapus",
    "Anda yakin ingin menghapus data ini?",
  );

  if (!confirmed) {
    return notificationStore.showError("hapus data dibatalkan");
  }
  if (data.id_pendaftaran == data.nama_id) {
    await deletePendaftaran(data.id_pendaftaran);
    data.dialoghapus = false;
  } else {
    notificationStore.showError("Gagal menghapus pendaftaran");
  }
}

async function refreshData() {
  useloadingStore().setLoading(true);
  sessionStorage.removeItem("m_Pendaftaran_erp");
  useloadingStore().setLoading(false);
}
</script>

<style scoped>
:deep() thead th {
  font-weight: bold !important;
  border: 1px solid #cbcbcb !important;
  background-color: #dddddd !important;
}

:deep() tbody td {
  border-right: 1px solid #e0e0e0 !important;
}
</style>
