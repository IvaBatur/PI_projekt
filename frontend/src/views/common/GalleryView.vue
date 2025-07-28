<template>
  <div
    class="min-h-screen bg-cover bg-center flex flex-col items-center justify-start py-8 px-4"
    :style="{ backgroundImage: `url(${background})` }"
  >
    <h2 class="text-4xl font-bold mb-6 text-white drop-shadow">
      📷 Galerija
    </h2>

    <AddImageForm
      v-if="userRole === 'coach'"
      @uploaded="fetchImages"
    />

    <div v-if="loading" class="text-center text-gray-200 mt-4">
      Učitavanje slika...
    </div>

    <div
      v-else-if="images.length"
      class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
    >
      <img
        v-for="(img, index) in images"
        :key="index"
        :src="img"
        alt="Slika"
        @click="openLightbox(index)"
         @error="images.splice(index, 1)" 
        class="rounded-lg shadow cursor-pointer transition transform hover:scale-105 hover:brightness-110 w-full h-48 object-cover"
      />
    </div>

    <p v-else class="text-center text-gray-200 mt-6">
      📭 Nema slika za prikaz.
    </p>

  
    <div
      v-if="lightboxImg"
      class="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
    >
      <button
        @click.stop="prevImage"
        class="absolute left-6 text-white text-4xl"
        :disabled="lightboxIndex === 0"
      >
        ◀️
      </button>

      <img
        :src="lightboxImg"
        alt="Pregled slike"
        class="max-h-[90%] max-w-[90%] rounded shadow-lg"
        @click.stop
      />

      <button
        @click.stop="nextImage"
        class="absolute right-6 text-white text-4xl"
        :disabled="lightboxIndex === images.length - 1"
      >
        ▶️
      </button>

      <button
        @click="closeLightbox"
        class="absolute top-4 right-4 text-white text-3xl"
      >
        ✖️
      </button>
    </div>
  </div>
</template>

<script>
<script>
import AddImageForm from './AddImageForm.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'GalleryView',
  components: { AddImageForm },
  data() {
    return {
      images: [],
      loading: false,
      lightboxImg: null,
      lightboxIndex: null,
      background: require('@/assets/box1.jpg')
    };
  },
  computed: {
    ...mapGetters({
      userRole: 'auth/userRole'
    })
  },
  mounted() {
    this.fetchImages();
  },
  methods: {
    async fetchImages() {
      this.loading = true;
      try {
        const response = await fetch('https://backend-lrvc.onrender.com/api/gallery');
        const data = await response.json();
  
        this.images = data.map(img => img.url);
      } catch (err) {
        console.error('❌ Greška pri dohvaćanju slika:', err);
      } finally {
        this.loading = false;
      }
    },
    openLightbox(index) {
      this.lightboxIndex = index;
      this.lightboxImg = this.images[index];
    },
    closeLightbox() {
      this.lightboxImg = null;
      this.lightboxIndex = null;
    },
    prevImage() {
      if (this.lightboxIndex > 0) {
        this.lightboxIndex--;
        this.lightboxImg = this.images[this.lightboxIndex];
      }
    },
    nextImage() {
      if (this.lightboxIndex < this.images.length - 1) {
        this.lightboxIndex++;
        this.lightboxImg = this.images[this.lightboxIndex];
      }
    }
  }
};
</script>
