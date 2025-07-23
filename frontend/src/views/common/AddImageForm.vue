<template>
  <form @submit.prevent="uploadImage" class="flex gap-4 items-center mb-6">
    <input type="file" @change="onFileChange" class="border rounded p-2" required />
    <button type="submit" class="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800">Dodaj sliku</button>
  </form>
</template>

<script>
export default {
  name: 'AddImageForm',
  data() {
    return {
      selectedFile: null
    };
  },
  methods: {
    onFileChange(e) {
      this.selectedFile = e.target.files[0];
    },
    async uploadImage() {
      if (!this.selectedFile) return;

      const formData = new FormData();
      formData.append('image', this.selectedFile);

      try {
        const res = await fetch('https://backend-lrvc.onrender.com/api/gallery', {
          method: 'POST',
          body: formData
        });
        if (!res.ok) throw new Error('Upload failed');

        this.$emit('uploaded'); 
        this.selectedFile = null;
      } catch (err) {
        console.error(' Greška pri uploadu slike:', err);
      }
    }
  }
};
</script>
