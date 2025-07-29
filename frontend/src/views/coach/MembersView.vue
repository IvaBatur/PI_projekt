<template>
  <div class="members-page min-h-screen bg-cover bg-center flex items-center justify-center"
       :style="{ backgroundImage: `url(@/assets/ring.jpg)` }">
    <div class="w-full max-w-6xl bg-black/60 backdrop-blur-xl rounded-xl shadow-2xl p-10 text-white animate-fadeIn">
      
      <h2 class="text-4xl font-extrabold text-center mb-10 text-red-500 drop-shadow-lg">
        👥 Upravljanje članovima
      </h2>

      <form @submit.prevent="dodajClana" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <input v-model="noviClan.ime" placeholder="Ime" required class="input-field" />
        <input v-model="noviClan.prezime" placeholder="Prezime" required class="input-field" />
        <input v-model="noviClan.datumRodenja" type="date" required class="input-field" />
        <input v-model.number="noviClan.visina" type="number" placeholder="Visina (cm)" required class="input-field" />
        <input v-model="noviClan.email" placeholder="Email člana" class="input-field" required />
        <input v-model.number="noviClan.tezina" type="number" placeholder="Težina (kg)" required class="input-field" />
        <input v-model="noviClan.kategorija" placeholder="Kategorija" required class="input-field" />

        <button type="submit" class="col-span-full bg-red-700 hover:bg-red-800 text-white py-3 rounded-lg transition-all">
          {{ editId !== null ? 'Spremi promjene' : 'Dodaj člana' }}
        </button>
      </form>

      <table class="w-full table-auto border-collapse text-sm">
        <thead>
          <tr class="bg-gray-800 text-white">
            <th class="border px-4 py-3">Ime</th>
            <th class="border px-4 py-3">Prezime</th>
            <th class="border px-4 py-3">Datum rođenja</th>
            <th class="border px-4 py-3">Dob</th>
            <th class="border px-4 py-3">Email</th>
            <th class="border px-4 py-3">Visina</th>
            <th class="border px-4 py-3">Težina</th>
            <th class="border px-4 py-3">Kategorija</th>
            <th class="border px-4 py-3">Akcije</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="clan in clanovi" :key="clan._id" class="hover:bg-gray-700 transition-all">
            <td class="border px-4 py-3">{{ clan.ime }}</td>
            <td class="border px-4 py-3">{{ clan.prezime }}</td>
            <td class="border px-4 py-3">{{ clan.datumRodenja }}</td>
            <td class="border px-4 py-3">{{ izracunajDob(clan.datumRodenja) }}</td>
            <td class="border px-4 py-3">{{ clan.email }}</td>
            <td class="border px-4 py-3">{{ clan.visina }}</td>
            <td class="border px-4 py-3">{{ clan.tezina }}</td>
            <td class="border px-4 py-3">{{ clan.kategorija }}</td>
            <td class="border px-4 py-3 flex gap-3">
              <button @click="urediClana(clan)" class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-all">Uredi</button>
              <button @click="obrisiClana(clan._id)" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all">Obriši</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MembersView',
  data() {
    return {
      clanovi: [],
      noviClan: {
        ime: '',
        prezime: '',
        datumRodenja: '',
        email: '',
        visina: null,
        tezina: '',
        kategorija: ''
      },
      editId: null
    };
  },
  mounted() {
    this.dohvatiClanove();
  },
  methods: {
    async dohvatiClanove() {
      const res = await fetch('https://backend-lrvc.onrender.com/api/members');
      this.clanovi = await res.json();
    },
    async dodajClana() {
      if (this.editId !== null) {
        const res = await fetch(`https://backend-lrvc.onrender.com/api/members/${this.editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.noviClan)
        });
        const updated = await res.json();
        const idx = this.clanovi.findIndex(c => c._id === this.editId);
        if (idx !== -1) this.clanovi.splice(idx, 1, updated);
        this.editId = null;
      } else {
        const res = await fetch('https://backend-lrvc.onrender.com/api/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.noviClan)
        });
        const saved = await res.json();
        this.clanovi.push(saved);
      }
      this.resetForma();
    },
    async obrisiClana(_id) {
      await fetch(`https://backend-lrvc.onrender.com/api/members/${_id}`, {
        method: 'DELETE'
      });
      this.clanovi = this.clanovi.filter(c => c._id !== _id);
    },
    urediClana(clan) {
      this.editId = clan._id;
      this.noviClan = { ...clan };
    },
    resetForma() {
      this.noviClan = {
        ime: '',
        prezime: '',
        datumRodenja: '',
        email: '',
        visina: null,
        tezina: '',
        kategorija: ''
      };
    },
    izracunajDob(datum) {
      const rod = new Date(datum);
      const danas = new Date();
      let dob = danas.getFullYear() - rod.getFullYear();
      const m = danas.getMonth() - rod.getMonth();
      if (m < 0 || (m === 0 && danas.getDate() < rod.getDate())) dob--;
      return dob;
    }
  }
};
</script>

<style scoped>

.input-field {
  border: 2px solid #4a4a4a;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background-color: #1a1a1a;
  color: white;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.input-field:focus {
  border-color: #f53b3b;
  box-shadow: 
