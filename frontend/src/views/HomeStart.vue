<template>
  <div class="home-wrapper">
    <NotificationPopup
      v-if="showPopup && popupObavijest"
      :message="popupObavijest.naslov + ': ' + popupObavijest.sadrzaj"
      @closed="zatvoriPopup"
    />

    <div class="overlay">
      <h1 class="app-title">3,2,1 BOX</h1>
      <h2 class="slogan">EKIPA, DISCIPLINA, USPJEH – DOBRODOŠLI U NAŠ SVIJET!</h2>

      <div class="user-greeting">
        <p v-if="userRole === 'coach'">👊 Dobrodošao, trener!</p>
        <p v-else-if="userRole === 'member'">🥊 Pozdrav, član kluba!</p>
        <p v-else>🎉 Dobrodošao, gostu!</p>
      </div>

      <div class="menu-box">
        <div class="menu-item" v-for="item in prikazaniLinkovi" :key="item.label">
          <router-link :to="item.path">
            <div class="icon">{{ item.emoji }}</div>
            <div class="label">{{ item.label }}</div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import NotificationPopup from "@/components/NotificationPopup.vue";

export default {
  name: "HomeStart",
  components: {
    NotificationPopup
  },
  data() {
    return {
      showPopup: false,
      popupObavijest: null
    };
  },
  computed: {
    ...mapGetters("auth", ["userRole"]),
    prikazaniLinkovi() {
      if (this.userRole === "coach") {
        return [
          { path: "/coach/about", label: "Povijest kluba", emoji: "📖" },
          { path: "/coach/members", label: "Članovi", emoji: "👥" },
          { path: "/coach/coaches", label: "Treneri", emoji: "🧑‍🏫" },
          { path: "/coach/tournaments", label: "Turniri", emoji: "🏆" },
          { path: "/coach/notices", label: "Obavijesti", emoji: "📢" },
          { path: "/coach/gallery", label: "Galerija", emoji: "🖼️" },
        ];
      } else if (this.userRole === "member") {
        return [
          { path: "/member/about", label: "Povijest kluba", emoji: "📖" },
          { path: "/member/dashboard", label: "Moj profil", emoji: "🙋‍♂️" },
          { path: "/member/coaches", label: "Treneri", emoji: "🧑‍🏫" },
          { path: "/member/tournaments", label: "Turniri", emoji: "🏆" },
          { path: "/member/notices", label: "Obavijesti", emoji: "📢" },
          { path: "/member/gallery", label: "Galerija", emoji: "🖼️" },
        ];
      } else {
        return [
          { path: "/guest/about", label: "Povijest kluba", emoji: "📖" },
          { path: "/guest/coaches", label: "Treneri", emoji: "🧑‍🏫" },
          { path: "/guest/tournaments", label: "Turniri", emoji: "🏆" },
          { path: "/guest/gallery", label: "Galerija", emoji: "🖼️" },
          { path: "/guest/notices", label: "Obavijesti", emoji: "📢" },
        ];
      }
    }
  },
  async mounted() {
    if (this.userRole !== "member") return;

    try {
      const res = await fetch('http://localhost:3000/api/notices');
      if (!res.ok) throw new Error('Greška pri dohvaćanju obavijesti');
      const obavijesti = await res.json();

      const vecVidio = JSON.parse(localStorage.getItem("popupSeenIds") || "[]");
      const nova = obavijesti.find(o => o.javno && !vecVidio.includes(o.id));

      if (nova) {
        this.popupObavijest = nova;
        this.showPopup = true;
      }
    } catch (err) {
      console.error("🔥 Greška kod dohvaćanja obavijesti iz backenda:", err);
    }
  },
  methods: {
    zatvoriPopup() {
      const vidjeno = JSON.parse(localStorage.getItem("popupSeenIds") || "[]");
      if (this.popupObavijest) {
        vidjeno.push(this.popupObavijest.id);
        localStorage.setItem("popupSeenIds", JSON.stringify(vidjeno));
      }
      this.showPopup = false;
    }
  }
};
</script>

<style scoped>
.home-wrapper {
  background: url('@/assets/pozadina.jpg') no-repeat center center fixed;
  background-size: cover;
  min-height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay {
  background-color: rgba(0, 0, 0, 0.75);
  padding: 2rem;
  border-radius: 20px;
  color: white;
  text-align: center;
  max-width: 900px;
  width: 95%;
  box-shadow: 0 0 15px rgba(0,0,0,0.5);
}

.app-title {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
  letter-spacing: 1px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
}

.slogan {
  font-size: 1.4rem;
  margin-bottom: 3rem; /* puno više prostora */
  font-style: italic;
  color: #ddd;
}

.user-greeting {
  margin-bottom: 2rem;
  font-size: 1.2rem;
}

.menu-box {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1.5rem;
}

.menu-item {
  background-color: #1e2a3a;
  padding: 1.2rem;
  border-radius: 15px;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
}

.menu-item:hover {
  background-color: #344966;
  transform: translateY(-8px) scale(1.08);
  box-shadow: 0 12px 20px rgba(0,0,0,0.5);
}

.menu-item .icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  display: block;
  transition: transform 0.3s ease;
}

.menu-item:hover .icon {
  transform: scale(1.2) rotate(-3deg);
}

.menu-item .label {
  font-weight: bold;
  font-size: 1rem;
  margin-top: 0.3rem;
}

.menu-item a {
  color: white;
  text-decoration: none;
}


</style>

