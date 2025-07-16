<template>
  <div class="max-w-5xl mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-bold mb-6 text-red-700">👥 Upravljanje članovima</h2>

   
    <form @submit.prevent="dodajClana" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <input v-model="noviClan.ime" placeholder="Ime" required class="border p-2 rounded" />
      <input v-model="noviClan.prezime" placeholder="Prezime" required class="border p-2 rounded" />
      <input v-model="noviClan.datumRodenja" type="date" required class="border p-2 rounded" />
      <input v-model.number="noviClan.visina" type="number" placeholder="Visina (cm)" required class="border p-2 rounded" />
      <input v-model.number="noviClan.tezina" type="number" placeholder="Težina (kg)" required class="border p-2 rounded" />
      <input v-model="noviClan.kategorija" placeholder="Kategorija" required class="border p-2 rounded" />

      <button type="submit" class="col-span-full bg-red-700 hover:bg-red-800 text-white py-2 rounded">
        {{ editId !== null ? 'Spremi promjene' : 'Dodaj člana' }}
      </button>
    </form>

    
    <table class="w-full table-auto border-collapse">
      <thead>
        <tr class="bg-gray-100">
          <th class="border px-3 py-2">Ime</th>
          <th class="border px-3 py-2">Prezime</th>
          <th class="border px-3 py-2">Datum rođenja</th>
          <th class="border px-3 py-2">Dob</th>
          <th class="border px-3 py-2">Visina (cm)</th>
          <th class="border px-3 py-2">Težina</th>
          <th class="border px-3 py-2">Kategorija</th>
          
        </tr>
      </thead>
      <tbody>
        <tr v-for="clan in clanovi" :key="clan.id" class="hover:bg-gray-50">
          <td class="border px-3 py-2">{{ clan.ime }}</td>
          <td class="border px-3 py-2">{{ clan.prezime }}</td>
          <td class="border px-3 py-2">{{ clan.datumRodenja }}</td>
          <td class="border px-3 py-2">{{ izracunajDob(clan.datumRodenja) }}</td>
          <td class="border px-3 py-2">{{ clan.visina }}</td>
          <td class="border px-3 py-2">{{ clan.tezina }}</td>
          <td class="border px-3 py-2">{{ clan.kategorija }}</td>
          <td class="border px-3 py-2 flex flex-col gap-1">
            <button @click="urediClana(clan)" class="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded">Uredi</button>
            <button @click="obrisiClana(clan.id)" class="bg-gray-700 hover:bg-gray-800 text-white px-2 py-1 rounded">Obriši</button>
          </td>
        </tr>
      </tbody>
    </table>
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
      const res = await fetch('http://localhost:3000/api/members');
      this.clanovi = await res.json();
    },
    async dodajClana() {
      if (this.editId !== null) {
       
        const res = await fetch(`http://localhost:3000/api/members/${this.editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.noviClan)
        });
        const updated = await res.json();
        const idx = this.clanovi.findIndex(c => c.id === this.editId);
        if (idx !== -1) this.clanovi.splice(idx, 1, updated);
        this.editId = null;
      } else {
       
        const res = await fetch('http://localhost:3000/api/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.noviClan)
        });
        const saved = await res.json();
        this.clanovi.push(saved);
      }
      this.resetForma();
    },
    async obrisiClana(id) {
      await fetch(`http://localhost:3000/api/members/${id}`, {
        method: 'DELETE'
      });
      this.clanovi = this.clanovi.filter(c => c.id !== id);
    },
    urediClana(clan) {
      this.editId = clan.id;
      this.noviClan = { ...clan };
    },
    resetForma() {
      this.noviClan = {
        ime: '',
        prezime: '',
        datumRodenja: '',
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
