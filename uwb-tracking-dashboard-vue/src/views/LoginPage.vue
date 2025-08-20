<template>
  <div class="login-container">
    <div class="login-card">
      <div class="header">
        <div class="icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 8v-2c0-3.313-2.687-6-6-6s-6 2.687-6 6v2"
              stroke="#4285F4"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <rect
              x="3"
              y="8"
              width="18"
              height="13"
              rx="2"
              ry="2"
              fill="#4285F4"
            />
            <circle cx="12" cy="15" r="3" fill="white" />
          </svg>
        </div>
        <h2>Login to UWB System</h2>
      </div>

      <form @submit.prevent="login">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
            stroke="#9CA3AF"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <circle
            cx="12"
            cy="7"
            r="4"
            stroke="#9CA3AF"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <label>Username</label>
        <div class="form-group">
          <div class="input-with-icon">
            <div class="input-icon"></div>
            <div class="input-content">
              <input
                v-model="username"
                type="email"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>
        </div>

        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="3"
            y="11"
            width="18"
            height="11"
            rx="2"
            ry="2"
            stroke="#9CA3AF"
            stroke-width="2"
          />
          <circle cx="12" cy="16" r="1" fill="#9CA3AF" />
          <path
            d="M7 11V7a5 5 0 0 1 10 0v4"
            stroke="#9CA3AF"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <label>Password</label>
        <div class="form-group">
          <div class="input-with-icon">
            <div class="input-icon"></div>
            <div class="input-content">
              <input
                v-model="password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>
        </div>

        <button type="submit" class="login-btn">Login</button>
      </form>

      <div class="register-link">
        Don't have an account?
        <router-link to="/register">Register here</router-link>
      </div>
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

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.login-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 40px;
  width: 100%;
  max-width: 400px;
  position: relative;
}
</style>
