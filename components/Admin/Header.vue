<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="width > 500 ? !drawer : false"
    :expand-on-hover="width > 500"
    :temporary="width < 500"
    flat
    :rail-width="70"
    class="sidebar-gradient"
  >
    <template v-slot:prepend>
      <div class="logo-container d-flex align-center justify-center">
        <!-- <img
          src="https://imagedelivery.net/_tN3dTar-XzU6X9_PBgTbA/1043a53d-dea0-4de7-86a2-7dfcb529f000/heromobile"
          alt="Logo"
          class="logo-img"
          :class="{ 'logo-rail': !drawer && width > 500 }"
        /> -->
      </div>
    </template>

    <v-divider class="border-opacity-25" color="rgba(255,255,255,0.3)" />

    <admin-side-menu />

    <template v-slot:append>
      <div class="pa-3">
        <v-list-item
          @click="logout()"
          rounded="lg"
          class="logout-item"
          variant="flat"
        >
          <template v-slot:prepend>
            <v-icon size="small" icon="mdi-logout" class="logout-icon" />
          </template>
          <span class="logout-text" v-if="drawer || width < 500">Keluar</span>
        </v-list-item>
      </div>
    </template>
  </v-navigation-drawer>

  <v-app-bar flat color="white" height="64" class="app-bar-border">
    <template v-slot:prepend>
      <div class="d-flex align-center ml-2">
        <v-btn
          icon
          variant="text"
          @click="toggleDrawer"
          class="menu-toggle"
          :class="{ 'is-active': !drawer }"
          size="small"
        >
          <div class="hamburger-animation">
            <div class="hamburger-line line-1"></div>
            <div class="hamburger-line line-2"></div>
            <div class="hamburger-line line-3"></div>
          </div>
        </v-btn>
        <!-- <img
          src="/public/aresa_typo.png"
          alt="Logo"
          width="40"
          v-if="!drawer"
          class="ml-4"
        /> -->

        <div class="ml-4">
          <v-chip class="text-primary"><strong>V 1.5</strong></v-chip>
        </div>
      </div>
    </template>

    <v-spacer />

    <template v-slot:append>
      <v-menu rounded="xl" transition="scale-transition" :offset="[10, 0]">
        <template v-slot:activator="{ props }">
          <v-btn
            variant="text"
            v-bind="props"
            class="user-profile-btn px-2"
            height="48"
          >
            <v-avatar size="34" class="avatar-gradient elevation-1">
              <span class="text-white text-caption font-weight-bold">
                {{ _.toUpper(displayname[0]) }}
              </span>
            </v-avatar>

            <div class="text-left ml-3 d-none d-sm-block">
              <p class="text-subtitle-2 font-weight-bold mb-0 text-slate-800">
                {{ displayname }}
              </p>
              <p class="text-caption text-slate-500 mb-0">{{ role }}</p>
            </div>
            <v-icon size="18" class="ml-2 chevron-icon"
              >mdi-chevron-down</v-icon
            >
          </v-btn>
        </template>

        <v-card
          min-width="220"
          class="profile-dropdown-card pa-3"
          elevation="12"
        >
          <v-list-item class="pa-2 mb-2">
            <template v-slot:prepend>
              <v-avatar size="42" class="avatar-gradient">
                <span class="text-white font-weight-bold">{{
                  _.toUpper(displayname[0])
                }}</span>
              </v-avatar>
            </template>
            <v-list-item-title class="font-weight-bold text-slate-800">{{
              displayname
            }}</v-list-item-title>
            <v-list-item-subtitle class="text-slate-500">{{
              role
            }}</v-list-item-subtitle>
          </v-list-item>
          <v-divider class="mb-3" />
          <v-btn
            block
            color="error"
            variant="flat"
            prepend-icon="mdi-logout"
            class="logout-action mt-2"
            @click="logout"
            rounded="lg"
          >
            Keluar
          </v-btn>
        </v-card>
      </v-menu>
    </template>
  </v-app-bar>
</template>

<script setup>
import _ from "lodash";
import { ref, computed, watchEffect } from "vue";
import { useDisplay } from "vuetify";
import { useUserStore } from "@/stores/userStore";
import { getAuth, signOut } from "firebase/auth";
import { navigateTo } from "#app";

const { width } = useDisplay();
const useuser = useUserStore();

// Inisialisasi drawer berdasarkan lebar layar
const drawer = ref(width.value > 500);

// Watcher untuk menutup drawer otomatis jika resize ke layar kecil
watchEffect(() => {
  if (width.value < 500) {
    drawer.value = false;
  }
});

const displayname = computed(() => useuser.getDisplayName || "Admin");
const role = computed(() => useuser.getRole || "Administrator");
const toggleDrawer = () => (drawer.value = !drawer.value);

const logout = async () => {
  const auth = getAuth();
  try {
    await signOut(auth);
    useuser.setUser(null);
    navigateTo("/");
  } catch (error) {
    console.error("Logout gagal:", error);
  }
};
</script>

<style scoped>
/* Sidebar Style */
.sidebar-gradient {
  background: linear-gradient(to bottom, #2962ff, #0039cb) !important;
  border: none !important;
  box-shadow:
    inset -1px 0 8px rgba(0, 0, 0, 0.08),
    2px 0 16px rgba(30, 58, 138, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 0 20px 20px 0 !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* MENYEMBUNYIKAN SCROLLBAR */
:deep(.v-navigation-drawer__content) {
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

:deep(.v-navigation-drawer__content::-webkit-scrollbar) {
  display: none; /* Chrome, Safari, Opera */
}

/* UI Components */
.app-bar-border {
  border-bottom: 1px solid #e2e8f0 !important;
  box-shadow: 0 2px 12px rgba(30, 58, 138, 0.08) !important;
}

.logo-container {
  height: 80px;
  padding: 0 16px;
  transition: all 0.3s ease;
}

.logo-img {
  max-width: 100%;
  max-height: 60px;
  object-fit: contain;
  filter: brightness(0) invert(1);
  transition: all 0.3s ease;
}

.logo-rail {
  max-height: 32px;
}

.menu-toggle {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: rgba(59, 130, 246, 0.1);
}

.hamburger-animation {
  width: 20px;
  height: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger-line {
  width: 20px;
  height: 2px;
  background: #1e3a8a;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.is-active .line-1 {
  transform: rotate(45deg) translate(5px, 5px);
}
.is-active .line-2 {
  opacity: 0;
}
.is-active .line-3 {
  transform: rotate(-45deg) translate(5px, -5px);
}

.avatar-gradient {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
}

.logout-item {
  background: rgba(255, 255, 255, 0.15) !important;
  color: white !important;
}

.text-slate-500 {
  color: #64748b;
}
.text-slate-800 {
  color: #1e293b;
}

:deep(.v-list-item--active) {
  background: rgba(255, 255, 255, 0.2) !important;
  border-left: 4px solid white;
}
</style>
