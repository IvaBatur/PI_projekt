<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
    <div class="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
      
      <h2 class="text-3xl font-extrabold mb-8 text-center text-gray-800">📢 Obavijesti</h2>

  
      <form v-if="userRole === 'coach'" @submit.prevent="dodajIliUrediObavijest" class="mb-10 space-y-4">
        <input v-model="novaObavijest.naslov" placeholder="Naslov obavijesti" required 
          class="w-full p-3 border rounded focus:ring-2 focus:ring-red-500 focus:outline-none" />
        
        <textarea v-model="novaObavijest.sadrzaj" placeholder="Sadržaj obavijesti" required 
          class="w-full p-3 border rounded focus:ring-2 focus:ring-red-500 focus:outline-none"></textarea>

        <div class="flex items-center gap-3">
          <label class="flex items-center gap-2 text-gray-700">
            <input type="checkbox" v-model="novaObavijest.javno" class="w-4 h-4" />
            Javno
          </label>
        </div>

        <button type="submit" 
          class="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded font-medium shadow transition">
          {{ uredujeId ? 'Spremi promjene' : 'Objavi' }}
        </button>
      </form>

     
      <div v-if="obavijesti.length">
        <div v-for="obavijest in filtriraneObavijesti" :key="obavijest.id" 
             class="bg-gray-50 border border-gray-200 p-5 mb-5 rounded-lg shadow hover:shadow-md transition">
          <h3 class="text-xl font-semibold text-gray-800">{{ obavijest.naslov }}</h3>
          <p class="text-sm text-gray-500 mb-2">📅 {{ obavijest.datum || 'N/A' }}</p>
          <p class="mb-4 text-gray-700">{{ obavijest.sadrzaj }}</p>

          <div v-if="userRole === 'coach'" class="flex gap-2">
            <button @click="urediObavijest(obavijest)" 
              class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded transition">
              Uredi
            </button>
            <button @click="obrisiObavijest(obavijest.id)" 
              class="bg-gray-700 hover:bg-gray-800 text-white px-4 py-1 rounded transition">
              Izbriši
            </button>
          </div>
        </div>
      </div>

      <p v-else class="text-center text-gray-500 mt-10 text-lg">
        Trenutno nema obavijesti za prikaz.
      </p>
    </div>
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
        javno: true
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
        console.error('Greška pri dohvaćanju obavijesti:', err);
      }
    },

    async dodajIliUrediObavijest() {
      try {
        if (this.uredujeId) {
       
          const res = await fetch(
            `https://backend-lrvc.onrender.com/api/notices/${this.uredujeId}`,
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(this.novaObavijest)
            }
          );
          if (!res.ok) throw new Error('Uređivanje nije uspjelo');
          const updated = await res.json();

         
          const index = this.obavijesti.findIndex(o => o.id === this.uredujeId);
          if (index !== -1) {
            this.obavijesti.splice(index, 1, updated);
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
        console.error('Greška pri spremanju obavijesti:', err);
      }
    },

    async obrisiObavijest(id) {
      try {
        const res = await fetch(
          `https://backend-lrvc.onrender.com/api/notices/${id}`,
          { method: 'DELETE' }
        );
        if (res.ok) {
          this.obavijesti = this.obavijesti.filter(o => o.id !== id);
        } else {
          console.error('Brisanje nije uspjelo');
        }
      } catch (err) {
        console.error('Greška pri brisanju obavijesti:', err);
      }
    },

    urediObavijest(obavijest) {
      this.novaObavijest = {
        naslov: obavijest.naslov,
        sadrzaj: obavijest.sadrzaj,
        javno: obavijest.javno
      };
      this.uredujeId = obavijest.id;
    },

    resetForma() {
      this.novaObavijest = {
        naslov: '',
        sadrzaj: '',
        javno: true
      };
      this.uredujeId = null;
    }
  }
};
</script>
