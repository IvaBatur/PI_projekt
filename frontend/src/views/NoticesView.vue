<template>
  <div class="max-w-3xl mx-auto p-4">
    <h2 class="text-2xl font-bold mb-6">📢 Obavijesti</h2>

    
    <form v-if="userRole === 'coach'" @submit.prevent="dodajIliUrediObavijest" class="mb-8 space-y-4">
      <input v-model="novaObavijest.naslov" placeholder="Naslov obavijesti" required class="w-full p-2 border rounded" />
      <textarea v-model="novaObavijest.sadrzaj" placeholder="Sadržaj obavijesti" required class="w-full p-2 border rounded"></textarea>

      <div class="flex gap-4">
        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="novaObavijest.javno" />
          Javno
        </label>
      </div>

      <button type="submit" class="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded">
        {{ uredujeId ? 'Spremi promjene' : 'Objavi' }}
      </button>
    </form>

    
    <div v-if="obavijesti.length">
      <div v-for="obavijest in filtriraneObavijesti" :key="obavijest.id" class="bg-gray-100 p-4 mb-4 rounded shadow">
        <h3 class="text-lg font-semibold">{{ obavijest.naslov }}</h3>
        <p class="text-sm text-gray-600 mb-2">{{ obavijest.datum || '📅 N/A' }}</p>
        <p class="mb-2">{{ obavijest.sadrzaj }}</p>

        

       
        <div v-if="userRole === 'coach'" class="flex gap-2 mt-4">
          <button @click="urediObavijest(obavijest)" class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
            Uredi
          </button>
          <button @click="obrisiObavijest(obavijest.id)" class="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded">
            Izbriši
          </button>
        </div>
      </div>
    </div>

    <p v-else class="text-center text-gray-500 mt-6">Nema obavijesti za prikaz.</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'NoticesView',
  data() {
    return {
      obavijesti: [],
      novaObavijest: {
        naslov: '',
        sadrzaj: '',
        javno: true,

      },
      uredujeId: null
    };
  },
  computed: {
    ...mapGetters('auth', ['userRole']),
    filtriraneObavijesti() {
      if (this.userRole === 'coach' || this.userRole === 'member') {
        return this.obavijesti;
      }
      return this.obavijesti.filter(o => o.javno);
    }
  },
  mounted() {
    this.dohvatiObavijesti();
  },
  methods: {
    async dohvatiObavijesti() {
      try {
        const res = await fetch('https://backend-lrvc.onrender.com/api/notices');
        this.obavijesti = await res.json();
      } catch (err) {
        console.error(' Greška pri dohvaćanju obavijesti:', err);
      }
    },
    async dodajIliUrediObavijest() {
      try {
        if (this.uredujeId) {
         
          const index = this.obavijesti.findIndex(o => o.id === this.uredujeId);
          if (index !== -1) {
            this.obavijesti[index] = { ...this.obavijesti[index], ...this.novaObavijest };
          }
        } else {
          const novi = {
            ...this.novaObavijest,
            datum: new Date().toISOString().split('T')[0]
          };
          const res = await fetch('https://backend-lrvc.onrender.com/api/notices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novi)
          });
          if (!res.ok) throw new Error('Spremanje nije uspjelo');
          const saved = await res.json();
          this.obavijesti.unshift(saved);
        }
        this.resetForma();
      } catch (err) {
        console.error(' Greška pri spremanju obavijesti:', err);
      }
    },
    async obrisiObavijest(id) {
     
      this.obavijesti = this.obavijesti.filter(o => o.id !== id);
    },
    urediObavijest(obavijest) {
      this.novaObavijest = { naslov: obavijest.naslov, sadrzaj: obavijest.sadrzaj, javno: obavijest.javno,  };
      this.uredujeId = obavijest.id;
    },
  
    resetForma() {
      this.novaObavijest = {
        naslov: '',
        sadrzaj: '',
        javno: true,
        prijava: false
      };
      this.uredujeId = null;
    }
  }
};
</script>
