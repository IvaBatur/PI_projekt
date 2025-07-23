<template>
  <div class="login-wrapper">
    <div class="login-box">
      <img src="@/assets/logo.png" alt="logo" class="logo" />
      <h1 class="slogan">Train like a champion!</h1>
      
 <form @submit.prevent="handleLogin">
        <label>Email</label>
        <input type="email" v-model="email" placeholder="example@mail.com" required />

        <label>Password</label>
        <input type="password" v-model="password" placeholder="********" required />

        <button class="login-btn" type="submit">Log in</button>
        <p v-if="error" class="error-msg">{{ error }}</p>
      </form>

      <div class="links">
        <button class="guest-btn" @click="continueAsGuest">Continue as Guest</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      error: ''
    };
  },
  methods: {
    ...mapActions('auth', ['login']),
async handleLogin() {
  this.error = '';
  try {
    const res = await fetch('https://backend-lrvc.onrender.com/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email, password: this.password })
        });
    
    if (!res.ok) throw new Error('Invalid login');
    const data = await res.json();

    this.login({
      token: data.token,
      role: data.role,
      email: this.email 
    });

    this.$router.push('/home');
  } catch (err) {
    this.error = 'Login failed: ' + err.message;
  }
},
 continueAsGuest() {
  this.login({
    token: 'guest-token',
    role: 'guest'
  });
  this.$router.push('/home');
}
  }
};
</script>

<style scoped>

.login-wrapper { background-color: #b80000; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center; }
.login-box { background: transparent; color: white; padding: 2rem; border-radius: 12px; width: 90%; max-width: 400px; text-align: center; }
.logo { width: 170px; margin-bottom: 1rem; display: block; margin-left: auto; margin-right: auto;border-radius: 15px; }
.slogan { font-family: 'Brush Script MT', cursive; font-size: 30px; margin-bottom: 2rem; }
form { display: flex; flex-direction: column; }
input { padding: 10px; margin-bottom: 1rem; border: none; border-bottom: 2px solid white; background: transparent; color: white; font-size: 16px; outline: none; }
label { text-align: left; margin-bottom: 0.2rem; font-weight: bold; }
.login-btn { padding: 10px; background: white; color: black; border: none; border-radius: 30px; font-weight: bold; font-size: 16px; cursor: pointer; margin-top: 0.5rem; }
.guest-btn { padding: 10px; background: #443535; border: none; border-radius: 30px; font-weight: bold; font-size: 16px; margin-top: 1rem; cursor: pointer; }
.links { margin-top: 1rem; }
.links a { color: white; text-decoration: underline; display: block; margin: 0.5rem 0; }
.links span { display: block; margin-top: 0.5rem; }
.error-msg { color: yellow; margin-top: 1rem; }
.login-btn,.guest-btn { transition: transform 0.2s ease, box-shadow 0.2s ease;}
.login-btn:hover,.guest-btn:hover {transform: translateY(-2px);box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);}
.logo {
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

</style>

