<template>
  <div class="register-container">
    <div class="register-card">
      <h2>Register for UWB System</h2>
      <form @submit.prevent="register">
        <div class="form-group">
          <label>Username</label>
          <input v-model="username" type="text" required />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" required />
        </div>
        <button type="submit">Register</button>
      </form>
      <router-link to="/login">Already have an account? Login here</router-link>
    </div>
  </div>
</template>

<script>
import { auth, database } from "@/firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";

export default {
  name: "RegisterPage",
  data() {
    return {
      username: "", // ใช้ 'username' สำหรับอีเมล
      password: "",
      fullName: "",
      // ... คุณสมบัติข้อมูลอื่นๆ สำหรับฟิลด์ฟอร์ม
    };
  },
  methods: {
    async register() {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.username,
          this.password
        );
        const user = userCredential.user;

        // บันทึกข้อมูลผู้สมัคร
        await set(ref(database, "users/" + user.uid), {
          fullName: this.fullName,
          // ... ทดสอบเอาแค่ชื่อก่อน
        });

        alert("Register success!, Now you can login.");
        this.$router.push("/login");
      } catch (error) {
        console.error("Register failed:", error.message);
        alert("Register failed:" + error.message);
      }
    },
  },
};
</script>
