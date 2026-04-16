import { defineStore } from "pinia";
import { type notifM } from "~/types/notifModel";
import _ from "lodash";
import { useloadingStore } from "./loadingStore";
import { addDoc } from "firebase/firestore";
import { useNotificationStore } from "./notification";

export const usenotifstore = defineStore("notifstore", {
  state: () => {
    return {
      notifs: [] as notifM[],
      lengnotif: 0,
    };
  },
  getters: {
    getdaftarnotif(state) {
      return state.notifs;
    },
    getlengnotif(state) {
      return state.lengnotif;
    },
  },
  actions: {
    async tambahnotifact(lemparnotif: notifM) {
      const notificationStore = useNotificationStore();
      try {
        useloadingStore().setLoading(true);
        const currentnotifikasi = localStorage.getItem("notifikasi");
        let datasementara;
        if (currentnotifikasi) {
          datasementara = JSON.parse(currentnotifikasi);
          datasementara.push(lemparnotif);
          localStorage.setItem("notifikasi", JSON.stringify(datasementara));
        } else {
          datasementara = [lemparnotif];
          localStorage.setItem("notifikasi", JSON.stringify([lemparnotif]));
        }
        this.setnotif(datasementara);
        useloadingStore().setLoading(false);
      } catch (error) {
        notificationStore.showError("Gagal menambahkan notifikasi");
        useloadingStore().setLoading(false);
      }
    },

    async setnotif(items: notifM[]) {
      this.notifs = items;
      this.lengnotif = items.length;
    },

    async tarikdatanotifikasi() {
      const getnotif = localStorage.getItem("notifikasi");
      if (getnotif) {
        this.setnotif(JSON.parse(getnotif));
      }
    },
  },
});
