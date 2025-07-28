<template>
  <div class="notices-container">
    <div class="overlay">
      <div class="content-box">
        <h2 class="title">📢 Obavijesti</h2>

      
        <form
          v-if="userRole === 'coach'"
          @submit.prevent="dodajIliUrediObavijest"
          class="notice-form"  >
          <input
            v-model="novaObavijest.naslov"
            placeholder="Naslov obavijesti"
            required  />
          <textarea
            v-model="novaObavijest.sadrzaj"
            placeholder="Sadržaj obavijesti"
            required ></textarea>

          <label class="checkbox">
            <input type="checkbox" v-model="novaObavijest.javno" />
            Javno
          </label>

          <div class="form-buttons">
            <button type="submit">
              {{ uredujeId ? 'Spremi promjene' : 'Objavi' }}
            </button>
            <button v-if="uredujeId" type="button" @click="resetForma" class="cancel">
              Odustani
            </button>
          </div>
        </form>

  
        <div v-if="obavijesti.length" class="notices-list">
          <div
            v-for="obavijest in filtriraneObavijesti"
            :key="obavijest._id"
            class="notice-card">
            <h3>{{ obavijest.naslov }}</h3>
            <p class="date">📅 {{ obavijest.datum || 'N/A' }}</p>
            <p class="text">{{ obavijest.sadrzaj }}</p>

            <div v-if="userRole === 'coach'" class="actions">
              <button class="edit" @click="urediObavijest(obavijest)">Uredi</button>
              <button class="delete" @click="obrisiObavijest(obavijest._id)">Izbriši</button>
            </div>
          </div>
        </div>

        <p v-else class="no-notices">
          Trenutno nema obavijesti za prikaz.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "NoticesView",
  data() {
    return {
      obavijesti: [],
      novaObavijest: {
        naslov: "",
        sadrzaj: "",
        javno: true,
      },
      uredujeId: null,
    };
  },
  computed: {
    ...mapGetters("auth", ["userRole"]),
    filtriraneObavijesti() {
      if (this.userRole === "coach" || this.userRole === "member") {
        return this.obavijesti;
      }
      return this.obavijesti.filter((o) => o.javno);
    },
  },
  mounted() {
    this.dohvatiObavijesti();
  },
  methods: {
    async dohvatiObavijesti() {
      try {
        const res = await fetch(
          "https://backend-lrvc.onrender.com/api/notices"
        );
        this.obavijesti = await res.json();
      } catch (err) {
        console.error("Greška pri dohvaćanju obavijesti:", err);
      }
    },

    async dodajIliUrediObavijest() {
      try {
        if (this.uredujeId) {
      
          const res = await fetch(
            `https://backend-lrvc.onrender.com/api/notices/${this.uredujeId}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(this.novaObavijest),
            }
          );
          if (!res.ok) throw new Error("Uređivanje nije uspjelo");
          const updated = await res.json();
          const index = this.obavijesti.findIndex(
            (o) => o._id === this.uredujeId
          );
          if (index !== -1) {
            this.obavijesti.splice(index, 1, updated);
          }
        } else {
        
          const novi = {
            ...this.novaObavijest,
            datum: new Date().toISOString().split("T")[0],
          };
          const res = await fetch(
            "https://backend-lrvc.onrender.com/api/notices",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(novi),
            }
          );
          if (!res.ok) throw new Error("Spremanje nije uspjelo");
          const saved = await res.json();
          this.obavijesti.unshift(saved);
        }

        this.resetForma();
      } catch (err) {
        console.error("Greška pri spremanju obavijesti:", err);
      }
    },

    async obrisiObavijest(id) {
      try {
        const res = await fetch(
          `https://backend-lrvc.onrender.com/api/notices/${id}`,
          { method: "DELETE" }
        );
        if (res.ok) {
          this.obavijesti = this.obavijesti.filter((o) => o._id !== id);
        } else {
          console.error("Brisanje nije uspjelo");
        }
      } catch (err) {
        console.error("Greška pri brisanju obavijesti:", err);
      }
    },

    urediObavijest(obavijest) {
      this.novaObavijest = {
        naslov: obavijest.naslov,
        sadrzaj: obavijest.sadrzaj,
        javno: obavijest.javno,
      };
      this.uredujeId = obavijest._id;
    },

    resetForma() {
      this.novaObavijest = {
        naslov: "",
        sadrzaj: "",
        javno: true,
      };
      this.uredujeId = null;
    },
  },
};
</script>

<style scoped>

.notices-container {
  background: url('@/assets/pozadina.jpg') no-repeat center center fixed;
  background-size: cover;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay {
  background: rgba(0, 0, 0, 0.6);
  width: 100%;
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 3rem 1rem;
}

.content-box {
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.15);
  padding: 2rem;
  border-radius: 16px;
  color: white;
  width: 95%;
  max-width: 900px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
}

.notice-form input,
.notice-form textarea {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: none;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.notice-form textarea {
  min-height: 100px;
  resize: vertical;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.form-buttons {
  display: flex;
  gap: 1rem;
}

.form-buttons button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;
}

.form-buttons button:hover {
  opacity: 0.9;
}

.form-buttons .cancel {
  background: #777;
}

.form-buttons button:not(.cancel) {
  background: #e53935;
  color: white;
}

.notices-list {
  margin-top: 2rem;
}

.notice-card {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  color: white;
  transition: transform 0.3s ease, background 0.3s ease;
}

.notice-card:hover {
  transform: scale(1.02);
  background: rgba(255, 255, 255, 0.3);
}

.notice-card h3 {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
}

.notice-card .date {
  font-size: 0.9rem;
  color: #ddd;
  margin-bottom: 0.8rem;
}

.notice-card .text {
  font-size: 1rem;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.actions button {
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
}

.actions .edit {
  background: #ff9800;
  color: white;
}

.actions .delete {
  background: #d32f2f;
  color: white;
}

.no-notices {
  font-size: 1.2rem;
  text-align: center;
  margin-top: 2rem;
  color: #ddd;
}
</style>
