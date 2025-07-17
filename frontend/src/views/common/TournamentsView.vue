<template>
  <div class="min-h-screen bg-blue-900 text-white py-8">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-4xl font-bold mb-8 text-center">🏆 Nadolazeći turniri</h1>

      <form
        v-if="userRole === 'coach'"
        @submit.prevent="addTournament"
        class="bg-white text-black rounded-lg p-4 mb-8 shadow"
      >
        <h2 class="text-xl font-bold mb-4">Dodaj novi turnir</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input v-model="newTournament.name" placeholder="Naziv turnira" class="border p-2 rounded" required />
          <input v-model="newTournament.location" placeholder="Lokacija" class="border p-2 rounded" required />
          <input v-model="newTournament.date" type="date" class="border p-2 rounded" required />
        </div>
        <button
          type="submit"
          class="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Dodaj
        </button>
      </form>

      <div
        v-for="t in tournaments"
        :key="t.id"
        class="bg-white text-black rounded-lg p-4 mb-4 shadow"
      >
        <div>
          <h3 class="text-xl font-bold mb-1">🥊 {{ t.name }}</h3>
          <p class="text-sm">📍 Lokacija: {{ t.location }}</p>
          <p class="text-sm">📅 Datum: {{ formatDate(t.date) }}</p>

          <div v-if="userRole === 'coach' && t.prijavljeni?.length">
  <p class="text-sm font-bold mt-2">Prijavljeni:</p>
  <ul>
    <li v-for="clan in t.prijavljeni" :key="clan">{{ clan }}</li>
  </ul>
</div>

        </div>

        <button
          v-if="userRole === 'member'"
          @click="prijaviSe(t.id)"
          class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-2" >  Prijavi se
        </button>
         </div>
                    <p v-if="!tournaments.length" class="text-center mt-8 text-gray-300">
        📭 Trenutno nema nadolazećih turnira.
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'TournamentsView',
  data() {
    return {
      tournaments: [],
      newTournament: {
        name: '',
        location: '',
        date: ''
      }
    };
  },
  computed: {
    ...mapGetters({ userRole: 'auth/userRole', userEmail: 'auth/userEmail' })
  },
  mounted() {
    this.fetchTournaments();
  },
  methods: {
   
       async fetchTournaments() {
  try {
    const res = await fetch('http://localhost:3000/api/tournaments');
    const data = await res.json();

    console.log('Dohvaceni turniri:', data);

    this.tournaments = data.map(t => ({
      id: t.id,
      name: t.name,
      location: t.location,
      date: t.date,
      prijavljeni: Array.isArray(t.prijavljeni) ? t.prijavljeni : []
    }));
  } catch (err) {
    console.error('Greška pri dohvaćanju turnira', err);
  }
},
    async addTournament() {
      try {
        const res = await fetch('http://localhost:3000/api/tournaments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.newTournament)
        });
        const created = await res.json();
        this.tournaments.push(created);
        this.newTournament = { name: '', location: '', date: '' };
      } catch (err) {
        console.error('Greška pri dodavanju turnira', err);
      }
    },
 async prijaviSe(turnirId) {
  try {
    const clanEmail = this.userEmail;
    console.log('Prijavljujem kao:', clanEmail);

    const res = await fetch(`http://localhost:3000/api/tournaments/${turnirId}/prijavi`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clan: clanEmail })
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error('Prijava nije uspjela: ' + errorText);
    }

    alert('Uspješno ste prijavljeni!');
    this.fetchTournaments();
  } catch (err) {
    console.error('Greška pri prijavi:', err);
  }
},

    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString('hr-HR');
    }
  }
};
</script>
