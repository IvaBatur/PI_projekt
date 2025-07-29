<template>
  <div class="coach-container">
    <h1>Naši Treneri</h1>
    <p class="subtitle">Profesionalni tim koji vas vodi do vrha!</p>

    <div v-if="userRole === 'coach'" class="add-coach-form">
      <h2>Dodaj novog trenera</h2>
      <div class="form-group">
        <input v-model="noviTrener.ime" placeholder="Ime i prezime" />
        <input v-model="noviTrener.opis" placeholder="Opis" />
        <input v-model="noviTrener.phone" type="tel" placeholder="Telefon" />
        <input v-model="noviTrener.email" type="email" placeholder="Email" />
        <input type="file" @change="onFileChange" />
      </div>
      <p class="error-msg" v-if="error">{{ error }}</p>
      <button class="submit-btn" @click="addCoach">Dodaj</button>
    </div>

    <div class="coach-grid">
      <div class="coach-card" v-for="trener in treneri" :key="trener._id">
        <img :src="getImageUrl(trener.slika)" :alt="trener.ime" />
        <h3>{{ trener.ime }}</h3>
        <p>{{ trener.opis }}</p>
        <button class="contact-btn" @click="showContact(trener)">Kontaktiraj</button>
        <button v-if="userRole === 'coach'" class="delete-btn" @click="deleteCoach(trener._id)">
          Obriši
        </button>
      </div>
    </div>

    <div v-if="selected" class="modal-overlay" @click="selected=null">
      <div class="modal" @click.stop>
        <h2>{{ selected.ime }}</h2>
        <p>📞 {{ selected.phone }}</p>
        <p>📧 {{ selected.email }}</p>
        <button @click="selected=null" class="close-btn">Zatvori</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  name: "CoachView",
  data() {
    return {
      treneri: [],
      selected: null,
      file: null,
      error: "",
      noviTrener: { ime: "", opis: "", phone: "", email: "" }
    };
  },
  computed: {
    ...mapGetters({
      userRole: "auth/userRole"
    })
  },
  created() {
    this.fetchCoaches();
  },
  methods: {
    async fetchCoaches() {
      try {
        const res = await axios.get("https://backend-lrvc.onrender.com/api/coaches");
        this.treneri = res.data;
      } catch (err) {
        console.error("Greška pri dohvaćanju trenera:", err);
        this.error = "Ne mogu dohvatiti listu trenera.";
      }
    },
    onFileChange(e) {
      this.file = e.target.files[0];
    },
    showContact(trener) {
      this.selected = trener;
    },
    async addCoach() {
      this.error = "";

      const phoneRegex = /^[0-9+ ]{6,20}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !this.noviTrener.ime ||
        !this.noviTrener.opis ||
        !this.noviTrener.phone ||
        !this.noviTrener.email ||
        !this.file
      ) {
        this.error = "Popunite sva polja i odaberite sliku.";
        return;
      }

      if (!phoneRegex.test(this.noviTrener.phone)) {
        this.error = "Unesite ispravan broj telefona.";
        return;
      }

      if (!emailRegex.test(this.noviTrener.email)) {
        this.error = "Unesite ispravan email.";
        return;
      }

      const formData = new FormData();
      formData.append("ime", this.noviTrener.ime);
      formData.append("opis", this.noviTrener.opis);
      formData.append("phone", this.noviTrener.phone);
      formData.append("email", this.noviTrener.email);
      formData.append("image", this.file);

      try {
        await axios.post("https://backend-lrvc.onrender.com/api/coaches", formData);
      
        this.noviTrener = { ime: "", opis: "", phone: "", email: "" };
        this.file = null;
        await this.fetchCoaches();
      } catch (err) {
        console.error("Greška prilikom dodavanja trenera:", err);
        this.error = "Greška prilikom dodavanja trenera.";
      }
    },
    async deleteCoach(_id) {
      try {
        await axios.delete(`https://backend-lrvc.onrender.com/api/coaches/${_id}`);
        await this.fetchCoaches();
      } catch (err) {
        console.error("Greška prilikom brisanja trenera:", err);
        this.error = "Greška prilikom brisanja trenera.";
      }
    },
    getImageUrl(path) {
      return path || "";
    }
  }
};
</script>

<style scoped>
.coach-container {
  min-height: 100vh;
  background: url('@/assets/pozadina.jpg') center/cover fixed no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem;
}

.coach-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: -1;
}

h1 {
  font-size: 3rem;
  color: #fff;
  text-shadow: 2px 2px 5px rgba(0,0,0,0.7);
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.3rem;
  color: #eee;
  margin-bottom: 2rem;
}

.add-coach-form {
  background: rgba(255,255,255,0.9);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
}

.form-group input {
  margin: 0.4rem 0;
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

.submit-btn {
  margin-top: 1rem;
  background: #d32f2f;
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.submit-btn:hover {
  background: #b71c1c;
}

.error-msg {
  color: red;
  font-weight: bold;
}

.coach-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
}

.coach-card {
  background: rgba(255,255,255,0.9);
  border-radius: 15px;
  padding: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
}

.coach-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.coach-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  filter: grayscale(30%);
  transition: filter 0.3s ease;
}

.coach-card:hover img {
  filter: grayscale(0%);
}

.coach-card h3 {
  font-size: 1.3rem;
  margin-top: 0.8rem;
  color: #222;
}

.coach-card p {
  font-size: 0.95rem;
  color: #333;
  margin: 0.5rem 0 1rem;
}

.contact-btn,
.delete-btn {
  background: #d32f2f;
  color: #fff;
  border: none;
  margin: 0.3rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease;
}

.contact-btn:hover,
.delete-btn:hover {
  background: #b71c1c;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
}

.close-btn {
  margin-top: 1rem;
  background: #d32f2f;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}

.close-btn:hover {
  background: #b71c1c;
}

</style>
