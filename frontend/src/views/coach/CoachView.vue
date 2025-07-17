<template>
  <div class="coach-container">
    <h1>Naši Treneri</h1>
    <p class="subtitle">
      Profesionalni tim koji vas vodi do vrha!
    </p>

    <div class="coach-grid">
      <div class="coach-card" v-for="trener in treneri" :key="trener.id">
        <img :src="trener.slika" :alt="trener.ime" />
        <h3>{{ trener.ime }}</h3>
        <p>{{ trener.opis }}</p>
        <button class="contact-btn" @click="showContact(trener)">Kontaktiraj</button>
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
export default {
  name: "CoachView",
  data() {
    return {
      selected: null,
      treneri: [
        {
          id: 1,
          ime: "Marko Horvat",
          opis: "Glavni trener s 20 godina iskustva u boksu. Specijalist za tehnike i taktike.",
          slika: require("@/assets/trener1.png"),
          phone: "+385 91 123 4567",
          email: "marko.horvat@box.com"
        },
        {
          id: 2,
          ime: "Ivana Novak",
          opis: " Trenerica koja brine o vašoj kondiciji i snazi. Certificirani stručnjak za ženski rekreacijski boks.",
          slika: require("@/assets/trener2.png"),
          phone: "+385 91 234 5678",
          email: "ivana.novak@box.com"
        },
        {
          id: 3,
          ime: "Tomislav Kovač",
          opis: "Mentor mladih talenata. Fokus na disciplinu i mentalnu snagu.",
          slika: require("@/assets/trener3.png"),
          phone: "+385 91 345 6789",
          email: "tomislav.kovac@box.com"
        }
      ]
    };
  },
  methods: {
    showContact(trener) {
      this.selected = trener;
    }
  }
};
</script>

<style scoped>
.coach-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  background: linear-gradient(to bottom, #f0f0f0, #fff);
  min-height: 100vh;
}

.coach-container h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  color: #b80000;
}

.subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #444;
}

.coach-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.coach-card {
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.coach-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.coach-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.coach-card h3 {
  margin: 0.5rem 0;
  color: #333;
}

.coach-card p {
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 1rem;
}

.contact-btn {
  background: #b80000;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.contact-btn:hover {
  background: #900000;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right:0;
  bottom:0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  width: 300px;
}

.modal h2 {
  margin-bottom: 1rem;
  color: #b80000;
}

.modal p {
  margin: 0.5rem 0;
  color: #333;
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
</style>
