<template>
  <div class="profile-container" v-if="profil">
    <h1>Moj Profil</h1>
    <div class="profile-card">
      <p><strong>Ime:</strong> {{ profil.ime }}</p>
      <p><strong>Prezime:</strong> {{ profil.prezime }}</p>
      <p><strong>Datum rođenja:</strong> {{ profil.datumRodenja }}</p>
      <p><strong>Visina:</strong> {{ profil.visina }} cm</p>
      <p><strong>Težina:</strong> {{ profil.tezina }} kg</p>
      <p><strong>Kategorija:</strong> {{ profil.kategorija }}</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'MojProfil',
  data() {
    return {
      profil: null
    }
  },
  computed: {
    ...mapGetters('auth', ['userEmail']) 
  },
  mounted() {
    this.dohvatiProfil();
  },
  methods: {
    async dohvatiProfil() {
      const res = await fetch(`http://localhost:3000/api/members/profile?email=${this.userEmail}`);
      if (res.ok) {
        this.profil = await res.json();
      } else {
        console.error('Ne mogu dohvatiti profil');
      }
    }
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.profile-card p {
  font-size: 1.1rem;
  margin: 0.5rem 0;
}
</style>
