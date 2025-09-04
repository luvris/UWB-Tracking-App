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
              autocomplete="email"
            />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input
              v-model="password"
              type="password"
              placeholder="Enter your password"
              required
              @input="validatePassword"
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
              @input="validateFullName"
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
              @input="validateAge"
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
              @input="validateHeight"
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
              @input="validateWeight"
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
              maxlength="13"
              @input="validateIdCard"
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
                @input="validatePinkCard"
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
                @input="validatePassport"
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

    validatePassword() {
      const password = this.password;

      this.passwordError = "";

      if (password.length < 6) {
        this.passwordError = "Password must be at least 6 characters long.";
        return;
      }

      if (!/[A-Z]/.test(password)) {
        this.passwordError =
          "Password must contain at least one uppercase letter (A-Z).";
        return;
      }

      this.passwordError = "";
    },

    validateFullName() {
      this.fullName = this.fullName.replace(/[0-9]/g, "");
    },

    validateAge(event) {
      const value = event.target.value;
      if (value && (value < 1 || value > 120)) {
        this.age = value < 1 ? 1 : 120;
        event.target.value = this.age;
      }
    },

    validateHeight(event) {
      const value = event.target.value;
      if (value && (value < 1 || value > 300)) {
        this.height = value < 50 ? 50 : 300;
        event.target.value = this.height;
      }
    },

    validateWeight(event) {
      const value = event.target.value;
      if (value && (value < 1 || value > 300)) {
        this.weight = value < 5 ? 5 : 300;
        event.target.value = this.weight;
      }
    },

    validateIdCard() {
      this.idCard = this.idCard.replace(/[^0-9]/g, "").slice(0, 13);
    },

    validatePinkCard() {
      this.pinkCardNumber = this.pinkCardNumber.replace(/[^0-9]/g, "");
    },

    validatePassport() {
      this.passportNumber = this.passportNumber.replace(/[^A-Za-z0-9]/g, "");
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
  font-size: 14px;
  text-align: left;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  box-sizing: border-box;
  background: #ffffff;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4285f4;
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #9ca3af;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
  font-size: 14px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  box-sizing: border-box;
  background: #ffffff;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4285f4;
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #9ca3af;
}

.form-group select {
  cursor: pointer;
  color: #374151;
}

.form-group select option {
  padding: 8px;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.checkbox-group {
  margin: 24px 0;
  display: flex;
  justify-content: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  user-select: none;
}

.checkbox-label input[type="checkbox"] {
  margin-right: 8px;
  width: 16px;
  height: 16px;
  accent-color: #4285f4;
}

.register-btn {
  width: 100%;
  background: #4285f4;
  color: white;
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;
}

.register-btn:hover {
  background: #3367d6;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
}

.register-btn:active {
  transform: translateY(0);
}

.login-link {
  text-align: center;
  margin-top: 24px;
  color: #6b7280;
  font-size: 14px;
}

.login-link a {
  color: #4285f4;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 768px) {
  .register-container {
    padding: 16px;
  }

  .register-card {
    padding: 24px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .header h2 {
    font-size: 20px;
  }
}

/* Input validation states */
.form-group input:invalid:not(:focus):not(:placeholder-shown) {
  border-color: #ef4444;
}

.form-group input:valid:not(:focus):not(:placeholder-shown) {
  border-color: #10b981;
}

/* Foreign Worker Section */
.foreign-worker-section {
  margin-top: 16px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px dashed #cbd5e1;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.foreign-worker-section .form-group input {
  background: #ffffff;
  border: 1.5px solid #d1d5db;
}

.foreign-worker-section .form-group input:focus {
  border-color: #4285f4;
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1);
}
</style>
