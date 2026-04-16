<script setup lang="ts">
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useloadingStore } from "~/stores/loadingStore";
import { useNotificationStore } from "~/stores/notification";
import { useUserStore } from "~/stores/userStore";

// definePageMeta({
//   layout: "admin",
// });

const auth = getAuth();
const userstore = useUserStore();
const notificationStore = useNotificationStore();
const loadingStore = useloadingStore();

const data = reactive({
  username: "",
  password: "",
  showPassword: false,
});

// ==========================
// 🔐 LOGIN FUNCTION
// ==========================
const login = async () => {
  if (!data.username || !data.password) {
    notificationStore.showError("Email dan password wajib diisi");
    return;
  }

  loadingStore.setLoading(true);

  try {
    // 🔵 Firebase Login
    const { user } = await signInWithEmailAndPassword(
      auth,
      data.username,
      data.password
    );

    if (!user) {
      notificationStore.showError("Email atau password salah");
      return;
    }

    // 🔵 Ambil Custom Claims
    const tokenResult = await user.getIdTokenResult(true);
    const claims = tokenResult.claims || {};

    const role = (claims.role as string) || "";

    console.log("CLAIMS:", claims);

    // 🔵 Simpan ke Pinia
    userstore.setUser(user);
    userstore.setEmail(user.email || "");
    userstore.setDisplayname(user.displayName || "");
    userstore.setRole(role);

    notificationStore.showSuccess("Login berhasil");

    // ==========================
    // 🔀 REDIRECT SESUAI ROLE
    // ==========================
    if (role === "Administrator") {
      return navigateTo("/admin/");
    }

    // Role tidak dikenal
    notificationStore.showError("Role tidak dikenal");
  } catch (error: any) {
    console.error("Login error:", error);

    if (error.code === "auth/invalid-credential") {
      notificationStore.showError("Email atau password salah");
    } else {
      notificationStore.showError("Terjadi kesalahan, coba lagi");
    }
  } finally {
    loadingStore.setLoading(false);
  }
};
</script>

<template>
  <div class="welcome-page">
    <div class="header-wrapper">
      <div class="header-triangle border-layer"></div>

      <div class="header-triangle main-layer">
        <img
          src="https://imagedelivery.net/_tN3dTar-XzU6X9_PBgTbA/1043a53d-dea0-4de7-86a2-7dfcb529f000/heromobile"
          alt="Aresa Logo"
          :width="$vuetify.display.smAndDown ? 180 : 180"
          class="logo"
        />
      </div>
    </div>

    <div class="content-area">
      <form
        class="form-container"
        @submit.prevent="login"
        @keydown.enter="login"
      >
        <div class="title-container">
          <p class="title">Akses Admin</p>
          <span class="subtitle">
            Silakan masuk untuk mengelola data dan operasional sistem Anda.
          </span>
        </div>

        <div class="input-container">
          <label class="input-label" for="email_field">Email Admin</label>
          <svg
            fill="none"
            viewBox="0 0 24 24"
            height="24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            class="icon"
          >
            <path
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-width="1.5"
              stroke="#007bff"
              d="M7 8.5L9.94202 10.2394C11.6572 11.2535 12.3428 11.2535 14.058 10.2394L17 8.5"
            ></path>
            <path
              stroke-linejoin="round"
              stroke-width="1.5"
              stroke="#007bff"
              d="M2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.7551 19.2094C21.8862 18.0739 21.9189 16.5412 21.9842 13.4756C22.0053 12.4899 22.0053 11.5101 21.9842 10.5244C21.9189 7.45886 21.8862 5.92609 20.7551 4.79066C19.6239 3.65523 18.0497 3.61568 14.9012 3.53657C12.9607 3.48781 11.0393 3.48781 9.09882 3.53656C5.95033 3.61566 4.37608 3.65521 3.24495 4.79065C2.11382 5.92608 2.08114 7.45885 2.01576 10.5244C1.99474 11.5101 1.99475 12.4899 2.01577 13.4756Z"
            ></path>
          </svg>
          <input
            v-model="data.username"
            placeholder="Masukkan email"
            type="text"
            id="email_field"
            class="input-field"
          />
        </div>

        <div class="input-container">
          <label class="input-label" for="password_field">Kata Sandi</label>

          <svg
            fill="none"
            viewBox="0 0 24 24"
            height="24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            class="icon"
          >
            <path
              stroke-linecap="round"
              stroke-width="1.5"
              stroke="#007bff"
              d="M18 11.0041C17.4166 9.91704 16.273 9.15775 14.9519 9.0993C13.477 9.03404 11.9788 9 10.329 9C8.67911 9 7.18091 9.03404 5.70604 9.0993C3.95328 9.17685 2.51295 10.4881 2.27882 12.1618C2.12602 13.2541 2 14.3734 2 15.5134C2 16.6534 2.12602 17.7727 2.27882 18.865C2.51295 20.5387 3.95328 21.8499 5.70604 21.9275C6.42013 21.9591 7.26041 21.9834 8 22"
            ></path>
            <path
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-width="1.5"
              stroke="#007bff"
              d="M6 9V6.5C6 4.01472 8.01472 2 10.5 2C12.9853 2 15 4.01472 15 6.5V9"
            ></path>
          </svg>

          <svg
            fill="none"
            viewBox="0 0 24 24"
            height="24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            class="icon icon-right"
            @click="data.showPassword = !data.showPassword"
            style="cursor: pointer"
          >
            <template v-if="data.showPassword">
              <path
                d="M12 5C17.5 5 21.644 10.484 22 12C21.644 13.516 17.5 19 12 19C6.5 19 2.356 13.516 2 12C2.356 10.484 6.5 5 12 5Z"
                stroke="#007bff"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                stroke="#007bff"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </template>
            <template v-else>
              <path
                d="M21.5701 12.0001C19.9501 14.9901 16.2701 19.0001 12.0001 19.0001C7.72013 19.0001 4.04013 14.9901 2.42013 12.0001C4.03013 9.0101 7.71013 5.00012 12.0001 5.00012C16.2801 5.00012 19.9601 9.0101 21.5701 12.0001Z"
                stroke="#007bff"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.5 12C14.5 13.3807 13.3807 14.5 12 14.5C10.6193 14.5 9.5 13.3807 9.5 12C9.5 10.6193 10.6193 9.5 12 9.5C13.3807 9.5 14.5 10.6193 14.5 12Z"
                stroke="#007bff"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M15.5 15.5L18.5 18.5"
                stroke="#007bff"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.5 5.5L8.5 8.5"
                stroke="#007bff"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </template>
          </svg>

          <input
            v-model="data.password"
            :type="data.showPassword ? 'text' : 'password'"
            placeholder="Masukkan password"
            id="password_field"
            class="input-field password-field-with-eye"
          />
        </div>

        <div class="forgot-password-link">
          <a href="/lupa-password" class="text-caption text-grey-darken-1">
            Lupa kata sandi?
          </a>
        </div>

        <button type="submit" class="login-btn">
          <span>Masuk Sekarang</span>
          <v-icon icon="mdi-chevron-right" end />
        </button>

        <p class="note">© 2026 Aresa Admin System | Terms of Use</p>
      </form>
    </div>

    <footer class="footer-bar">Aresa © 2026</footer>
  </div>
</template>

<style scoped>
/* ===============================
 * STRUKTUR & LAYOUT DASAR (DIPAKSA NO-SCROLL)
 * =============================== */
.welcome-page {
  position: relative;
  min-height: 100vh;
  overflow-y: hidden;
  background-color: #f1f3f7;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  overflow-x: hidden;
}

/* ===============================
 * HEADER: Segitiga Utama + Border
 * =============================== */
.header-wrapper {
  position: relative;
  width: 100%;
  height: 220px;
}

.header-triangle {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  clip-path: polygon(0 0, 100% 0, 100% 78%, 50% 95%, 0 78%);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.border-layer {
  background: #2196f3;
  transform: translateY(10px);
  z-index: 1;
}

.main-layer {
  background: linear-gradient(180deg, #007bff 0%, #005ad1 100%);
  z-index: 2;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.logo {
  margin-top: -30px;
}

@media (min-width: 600px) {
  .header-wrapper {
    height: 280px;
  }
  .border-layer {
    transform: translateY(14px);
  }
}

/* ===============================
 * AREA KONTEN UTAMA (Container Form Login)
 * =============================== */
.content-area {
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 15px;
  padding-bottom: 15px;
  z-index: 3;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;

  /* Overlap (Dinaikkan 80px) */
  margin-top: -80px;
}

/* ===============================
 * FORM CONTAINER
 * =============================== */
.form-container {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 25px 30px;
  background-color: #ffffff;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-family: "Inter", sans-serif;
}

/* ===============================
 * TITLE/SUBTITLE
 * =============================== */
.title-container {
  text-align: center;
  margin-bottom: 5px;
}

.title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  color: #212121;
}

.subtitle {
  font-size: 0.8rem;
  color: #6c757d;
  line-height: 1.3rem;
}

/* ===============================
 * INPUT FIELDS - PERUBAHAN DI SINI
 * =============================== */
.input-container {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

/* Ikon Kiri (Email dan Gembok) */
.icon {
  width: 20px;
  position: absolute;
  z-index: 99;
  left: 12px;
  bottom: 12px;
  color: #007bff;
}

/* **IKON KANAN (Mata)** */
.icon-right {
  left: unset; /* Hapus posisi kiri */
  right: 12px; /* Posisikan di kanan */
}

.input-label {
  font-size: 0.75rem;
  color: #6c757d;
  font-weight: 600;
  text-align: left;
}

.input-field {
  width: 100%;
  height: 48px;
  /* Padding 40px di kiri untuk semua input agar tidak menimpa ikon */
  padding: 0 15px 0 40px;
  border-radius: 8px;
  outline: none;
  border: 1px solid #ced4da;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

.input-field:focus {
  border: 1px solid #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  background-color: #ffffff;
}

/* **Penyesuaian Padding Input Password untuk Ikon Mata (Kanan)** */
.password-field-with-eye {
  /* Tambahkan padding kanan 40px agar input tidak menimpa ikon mata */
  padding: 0 40px 0 40px !important;
}

.forgot-password-link {
  width: 100%;
  text-align: right;
}

.forgot-password-link a {
  color: #007bff !important;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

/* ===============================
 * TOMBOL LOGIN
 * =============================== */
.login-btn {
  width: 100%;
  height: 40px;
  border: 0;
  background: #007bff;
  border-radius: 8px;
  color: #ffffff;
  cursor: pointer;
  font-weight: 600;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
  margin-top: 10px;
}

.login-btn:hover {
  background: #0056b3;
}

/* ===============================
 * FOOTER
 * =============================== */
.note {
  font-size: 0.7rem;
  color: #adb5bd;
  text-decoration: none;
  text-align: center;
  margin-top: 15px;
}

.footer-bar {
  position: static;
  width: 100%;
  background-color: #007bff;
  color: #fff;
  text-align: center;
  font-size: 11px;
  padding: 6px 0;
  z-index: 10;
  margin-top: auto;
}
</style>
