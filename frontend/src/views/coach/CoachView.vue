<template>
  <div class="coach-container">
    <h1>Naši Treneri</h1>
    <p class="subtitle">Profesionalni tim koji vas vodi do vrha!</p>

    <div v-if="role === 'coach'" class="add-coach-form">
      <h2>Dodaj novog trenera</h2>
      <div class="form-group">
        <input v-model="noviTrener.ime" placeholder="Ime i prezime " />
        <input v-model="noviTrener.opis" placeholder="Opis" />
       <input v-model="noviTrener.phone" type="tel" placeholder="Telefon" />
        <input v-model="noviTrener.email" type="email" placeholder="Email" />
        <input type="file" @change="onFileChange" />
      </div>
      <p class="error-msg" v-if="error">{{ error }}</p>
      <button class="submit-btn" @click="addCoach">Dodaj</button>
    </div>

    <div class="coach-grid">
      <div class="coach-card" v-for="trener in treneri" :key="trener.id">
        <img :src="getImageUrl(trener.slika)" :alt="trener.ime" />
        <h3>{{ trener.ime }}</h3>
        <p>{{ trener.opis }}</p>
        <button class="contact-btn" @click="showContact(trener)">Kontaktiraj</button>
        <button v-if="role === 'coach'" class="delete-btn" @click="deleteCoach(trener.id)">Obriši</button>
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
import axios from 'axios';

export default {
  name: "CoachView",
  props: {
    role: { type: String, default: "guest" }
  },
  data() {
    return {
      treneri: [],
      selected: null,
      file: null,
      error: "",
      noviTrener: { ime: "", opis: "", phone: "", email: "" }
    };
  },
  created() {
    this.fetchCoaches();
  },
  methods: {
    fetchCoaches() {
      axios.get("http://localhost:3000/api/coaches").then(res => {
        this.treneri = res.data;
      });
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

  if (!this.noviTrener.ime || !this.noviTrener.opis || !this.noviTrener.phone || !this.noviTrener.email || !this.file) {
    this.error = "Popunite sva polja i odaberite sliku.";
    return;
  }

  if (!phoneRegex.test(this.noviTrener.phone)) {
    this.error = "Unesite ispravan broj telefona (samo brojevi, razmak i '+').";
    return;
  }

  if (!emailRegex.test(this.noviTrener.email)) {
    this.error = "Unesite ispravan email (mora sadržavati @ i točku).";
    return;
  }

  const formData = new FormData();
  formData.append("ime", this.noviTrener.ime);
  formData.append("opis", this.noviTrener.opis);
  formData.append("phone", this.noviTrener.phone);
  formData.append("email", this.noviTrener.email);
  formData.append("image", this.file);

  try {
    await axios.post("http://localhost:3000/api/coaches", formData);
    this.noviTrener = { ime: "", opis: "", phone: "", email: "" };
    this.file = null;
    this.fetchCoaches();
  } catch {
    this.error = "Greška prilikom dodavanja trenera.";
  }
},
    deleteCoach(id) {
      axios.delete(`http://localhost:3000/api/coaches/${id}`).then(() => {
        this.fetchCoaches();
      });
    },
      getImageUrl(path) {
    if (!path) return '';
    return `http://localhost:3000${path}`;
  }
  }
};
</script>

<style scoped>
.coach-container {
  max-width: 1200px;
  margin: auto;
  padding: 2rem;
  text-align: center;
  background: linear-gradient(to bottom, #b7acac, #fff);
  min-height: 100vh;
}
h1 {
  font-size: 3rem;
  color: #b80000;
}
.subtitle {
  font-size: 1.2rem;
  color: #444;
}
.add-coach-form {
  background: #fff;
  padding: 1rem;
  margin: 2rem auto;
  max-width: 500px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.form-group input {
  margin: 0.2rem 0;
  width: 100%;
  padding: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.submit-btn {
  margin-top: 0.5rem;
  background: #b80000;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
.submit-btn:hover {
  background: #900000;
}
.error-msg {
  color: red;
  margin: 0.5rem 0;
}
.coach-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}
.coach-card {
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.coach-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 4px;
}
.coach-card h3 {
  margin: 0.5rem 0;
  color: #333;
}
.coach-card p {
  font-size: 0.9rem;
  color: #555;
}
.contact-btn, .delete-btn {
  background: #b80000;
  color: white;
  border: none;
  margin: 0.2rem;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
}
.contact-btn:hover, .delete-btn:hover {
  background: #900000;
}
.close-btn {
  margin-top: 1rem;
  background: #900000;
  color: white;
  border: none;
  padding: 0.3rem 0.8rem;
  border-radius: 10px;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: white;
  padding: 1rem;
  border-radius: 8px;
}
</style>
