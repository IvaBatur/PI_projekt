<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-10">
    <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      
   
      <div class="flex flex-col items-center mb-8">
        <div class="w-24 h-24 rounded-full bg-red-600 text-white flex items-center justify-center text-3xl font-bold shadow">
          {{ profil ? profil.ime.charAt(0) : '?' }}
        </div>
        <h2 class="mt-4 text-3xl font-extrabold text-gray-800">Moj profil</h2>
        <p class="text-gray-500">{{ userEmail }}</p>
      </div>

      
      <div v-if="profil" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div v-for="(value, label) in podaci" :key="label" class="p-5 rounded-lg bg-gray-50 border hover:shadow transition">
          <p class="text-sm text-gray-500">{{ label }}</p>
          <p class="text-lg font-semibold text-gray-800">{{ value }}</p>
        </div>
      </div>

     
      <div v-else class="text-center text-gray-500 text-lg py-10">
        Nema podataka o profilu.
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      profil: null
    };
  },
  computed: {
    ...mapGetters({
      userEmail: "auth/userEmail"
    }),
    podaci() {
      if (!this.profil) return {};
      return {
        "Ime": this.profil.ime,
        "Prezime": this.profil.prezime,
        "Datum rođenja": this.profil.datumRodenja,
        "Dob": this.izracunajDob(this.profil.datumRodenja) + " godina",
        "Visina": this.profil.visina + " cm",
        "Težina": this.profil.tezina + " kg",
        "Kategorija": this.profil.kategorija
      };
    }
  },
  mounted() {
    this.ucitajProfil();
  },
  methods: {
    async ucitajProfil() {
      try {
        const res = await fetch(`https://backend-lrvc.onrender.com/api/members/by-email/${this.userEmail}`);
        if (!res.ok) throw new Error("Nema podataka");
        this.profil = await res.json();
      } catch (err) {
        console.error("Greška pri učitavanju profila:", err);
      }
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
.bg-custom {
  background-image: url('@/assets/pozadina1.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

.grid > div {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.grid > div:hover {
  transform: translateY(-2px);
}
</style>

