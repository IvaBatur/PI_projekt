<template>
  <div v-if="show" @click="handleClick"
       class="fixed top-6 right-6 bg-red-100 text-red-800 border border-red-300 shadow-lg rounded-lg p-4 z-50 cursor-pointer transition duration-300 ease-in-out hover:shadow-xl">
    <div>
      <p class="mb-2 font-medium">{{ message }}</p>
      <button @click.stop="closePopup"
              class="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-800 text-sm">
        Zatvori
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotificationPopup",
  props: {
    message: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      default: 10000
    }
  },
  data() {
    return {
      show: true
    };
  },
  mounted() {
    setTimeout(() => {
      this.show = false;
      this.$emit("closed");
    }, this.duration);
  },
  methods: {
    closePopup() {
      this.show = false;
      localStorage.setItem("popupClosed", "true");
      this.$emit("closed");
    },
    handleClick() {
      const role = localStorage.getItem("role") || "member";
      this.$router.push(`/${role}/notices`);
    }
  }
};

</script>
