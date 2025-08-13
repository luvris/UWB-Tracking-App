<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Login to UWB System</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label>Username</label>
          <input v-model="username" type="text" required />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
      <router-link to="/register"
        >Don't have an account? Register here</router-link
      >
    </div>
  </div>
</template>

<script>
import { auth } from "@/firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        await signInWithEmailAndPassword(auth, this.username, this.password);
        console.log("Login successful");
        this.$router.push("/dashboard");
      } catch (error) {
        console.error("Login failed:", error.message);
        alert("Login failed: " + error.message);
      }
    },
  },
};
</script>
