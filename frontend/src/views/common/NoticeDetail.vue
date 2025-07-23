<template>
  <div v-if="obavijest" class="max-w-3xl mx-auto bg-white rounded shadow p-6 mt-8">
    <h2 class="text-2xl font-bold text-red-700 mb-4">{{ obavijest.naslov }}</h2>
    <p class="text-sm text-gray-600 mb-2">📅 {{ obavijest.datum }}</p>
    <p class="mb-4 text-gray-800">{{ obavijest.sadrzaj }}</p>

    <p class="italic text-sm mb-2">
      <strong>Status:</strong>
      {{ obavijest.javno ? 'Javna obavijest' : 'Privatna obavijest' }}
    </p>
    

    <router-link
      :to="`/${userRole}/notices`"
      class="inline-block mt-6 text-red-600 hover:underline"
    >
      ← Natrag na sve obavijesti
    </router-link>
  </div>

  <div v-else class="text-center text-gray-500 mt-10">
    Obavijest nije dostupna ili nemate pristup.
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'NoticeDetail',
  data() {
    return {
      obavijest: null,
      loading: true
    };
  },
  computed: {
    ...mapGetters('auth', ['userRole'])
  },
  async mounted() {
    const id = this.$route.params.id;

    try {
      
      const res = await fetch(`https://backend-lrvc.onrender.com/api/notices`);
      if (!res.ok) throw new Error('Greška pri dohvaćanju obavijesti');
      const notices = await res.json();

      const found = notices.find(n => String(n.id) === String(id));
      if (!found) throw new Error('Obavijest ne postoji.');

      if (!found.javno && this.userRole === 'guest') {
        this.obavijest = null;
      } else {
        this.obavijest = found;
      }
    } catch (err) {
      console.error(' Greška pri dohvaćanju obavijesti:', err.message);
      this.obavijest = null;
    } finally {
      this.loading = false;
    }
  }
};
</script>
