<template>
  <div class="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
    <h2 class="text-2xl font-bold mb-6 text-center">➕ Novi turnir</h2>

    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label class="block font-medium">Naziv turnira:</label>
        <input v-model="form.name" required class="input" placeholder="Zlatne rukavice" />
      </div>

      <div>
        <label class="block font-medium">Lokacija:</label>
        <input v-model="form.location" required class="input" placeholder="Zagreb Arena" />
      </div>

      <div>
        <label class="block font-medium">Datum:</label>
        <input v-model="form.date" required class="input" type="date" />
      </div>

      <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full">
        Spremi turnir
      </button>
    </form>

    <p v-if="success" class="text-green-600 mt-4 text-center font-semibold">✅ Turnir uspješno dodan!</p>
  </div>
</template>

<script>
export default {
  name: 'CreateTournament',
  data() {
    return {
      form: {
        name: '',
        location: '',
        date: ''
      },
      success: false
    };
  },
  methods: {
    async submitForm() {
      try {
        const res = await fetch('https://backend-lrvc.onrender.com/api/tournaments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form)
        });

        if (!res.ok) throw new Error('Greška pri dodavanju turnira');

        this.success = true;
        this.form.name = '';
        this.form.location = '';
        this.form.date = '';
      } catch (err) {
        console.error('❌', err);
      }
    }
  }
};
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>
