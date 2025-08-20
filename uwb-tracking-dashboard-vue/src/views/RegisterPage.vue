<template>
  <div class="register-container">
    <div class="register-card">
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
              d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
              fill="#4285F4"
            />
            <path
              d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z"
              fill="#4285F4"
            />
          </svg>
        </div>
        <h2>Register for UWB System</h2>
      </div>

      <form @submit.prevent="register">
        <div class="form-row">
          <div class="form-group">
            <label>Username</label>
            <input
              v-model="username"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input
              v-model="password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Full Name</label>
            <input
              v-model="fullName"
              type="text"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div class="form-group">
            <label>Blood Group</label>
            <select v-model="bloodGroup">
              <option value="">Select blood group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Age</label>
            <input
              v-model="age"
              type="number"
              placeholder="Enter your age"
              min="1"
              max="120"
            />
          </div>
          <div class="form-group">
            <label>Gender</label>
            <select v-model="gender">
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Height (cm)</label>
            <input
              v-model="height"
              type="number"
              placeholder="Enter height in cm"
              min="50"
              max="300"
            />
          </div>
          <div class="form-group">
            <label>Weight (kg)</label>
            <input
              v-model="weight"
              type="number"
              placeholder="Enter weight in kg"
              min="20"
              max="300"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Relative contact number</label>
            <input
              v-model="relativeContactNumber"
              type="tel"
              placeholder="Enter contact number"
            />
          </div>
          <div class="form-group" v-if="!foreignWorker">
            <label>ID Card</label>
            <input
              v-model="idCard"
              type="text"
              placeholder="Enter ID card number"
            />
          </div>
        </div>

        <div class="form-group full-width">
          <label>Allergies/Medical Conditions</label>
          <textarea
            v-model="allergiesMedicalConditions"
            rows="4"
            placeholder="Please describe any allergies or medical conditions"
          ></textarea>
        </div>

        <div class="checkbox-group">
          <label class="checkbox-label">
            <input v-model="foreignWorker" type="checkbox" />
            <span class="checkmark"></span>
            Foreign Worker
          </label>
        </div>

        <!-- Foreign Worker Additional Fields -->
        <div v-if="foreignWorker" class="foreign-worker-section">
          <div class="form-row">
            <div class="form-group">
              <label>National</label>
              <input
                v-model="national"
                type="text"
                placeholder="Enter nationality"
              />
            </div>
            <div class="form-group">
              <label>Pink Card Number</label>
              <input
                v-model="pinkCardNumber"
                type="text"
                placeholder="Enter pink card number"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Passport Number</label>
              <input
                v-model="passportNumber"
                type="text"
                placeholder="Enter passport number"
              />
            </div>
            <div class="form-group">
              <label>Company</label>
              <input
                v-model="company"
                type="text"
                placeholder="Enter company name"
              />
            </div>
          </div>
        </div>

        <button type="submit" class="register-btn">Register</button>
      </form>

      <div class="login-link">
        Already have an account?
        <router-link to="/login">Login here</router-link>
      </div>
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
      bloodGroup: "",
      age: "",
      gender: "",
      height: "",
      weight: "",
      relativeContactNumber: "",
      idCard: "",
      allergiesMedicalConditions: "",
      foreignWorker: false,
      // Foreign Worker additional fields
      national: "",
      pinkCardNumber: "",
      passportNumber: "",
      company: "",
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
        const userData = {
          fullName: this.fullName,
          bloodGroup: this.bloodGroup,
          age: parseInt(this.age) || null,
          gender: this.gender,
          height: parseInt(this.height) || null,
          weight: parseInt(this.weight) || null,
          relativeContactNumber: this.relativeContactNumber,
          idCard: this.idCard,
          allergiesMedicalConditions: this.allergiesMedicalConditions,
          foreignWorker: this.foreignWorker,
          createdAt: new Date().toISOString(),
        };

        // Add foreign worker fields if applicable
        if (this.foreignWorker) {
          userData.national = this.national;
          userData.pinkCardNumber = this.pinkCardNumber;
          userData.passportNumber = this.passportNumber;
          userData.company = this.company;
        }

        await set(ref(database, "users/" + user.uid), userData);

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

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.register-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 600px;
  position: relative;
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

.icon {
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
}

.header h2 {
  color: #4285f4;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}
</style>
