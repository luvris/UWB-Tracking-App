<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div class="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 md:p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4"
        >
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
        <h2 class="text-2xl font-bold text-blue-600">
          Register for UWB System
        </h2>
      </div>

      <!-- Registration Form -->
      <form @submit.prevent="showPreviewModal" class="space-y-6">
        <!-- Row 1: Email & Password -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Username (Email)</label
            >
            <input
              v-model="username"
              type="email"
              placeholder="Enter your email"
              required
              autocomplete="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Password</label
            >
            <input
              v-model="password"
              type="password"
              placeholder="Enter your password"
              required
              @input="validatePassword"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
        </div>

        <!-- Row 2: Full Name & Role -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Full Name</label
            >
            <input
              v-model="fullName"
              type="text"
              placeholder="Enter your full name"
              required
              @input="validateFullName"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Role</label
            >
            <select
              v-model="role"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
            >
              <option value="">Select your role</option>
              <option value="rescuer">Rescuer (กู้ภัย)</option>
              <option value="user">User (ผู้ใช้ทั่วไป)</option>
            </select>
          </div>
        </div>

        <!-- Row 3: Blood Group & Age -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Blood Group</label
            >
            <select
              v-model="bloodGroup"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
            >
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
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Age</label
            >
            <input
              v-model="age"
              type="number"
              placeholder="Enter your age"
              min="1"
              max="120"
              @input="validateAge"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
        </div>

        <!-- Row 4: Gender & Height -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Gender</label
            >
            <select
              v-model="gender"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Height (cm)</label
            >
            <input
              v-model="height"
              type="number"
              placeholder="Enter height in cm"
              min="50"
              max="300"
              @input="validateHeight"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
        </div>

        <!-- Row 5: Weight & Relative Contact -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Weight (kg)</label
            >
            <input
              v-model="weight"
              type="number"
              placeholder="Enter weight in kg"
              min="20"
              max="300"
              @input="validateWeight"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Relative contact number</label
            >
            <input
              v-model="relativeContactNumber"
              type="tel"
              placeholder="Enter contact number"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
        </div>

        <!-- ID Card (if not foreign worker) -->
        <div v-if="!foreignWorker">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >ID Card</label
          >
          <input
            v-model="idCard"
            type="text"
            placeholder="Enter ID card number"
            maxlength="13"
            @input="validateIdCard"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        <!-- Allergies -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Allergies/Medical Conditions</label
          >
          <textarea
            v-model="allergiesMedicalConditions"
            rows="3"
            placeholder="Please describe any allergies or medical conditions"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          ></textarea>
        </div>

        <!-- Foreign Worker Checkbox -->
        <div class="flex items-center">
          <input
            v-model="foreignWorker"
            type="checkbox"
            class="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label class="ml-2 block text-sm text-gray-700">Foreign Worker</label>
        </div>

        <!-- Foreign Worker Additional Fields -->
        <div
          v-if="foreignWorker"
          class="p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50 space-y-4"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Nationality</label
              >
              <input
                v-model="national"
                type="text"
                placeholder="Enter nationality"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Pink Card Number</label
              >
              <input
                v-model="pinkCardNumber"
                type="text"
                placeholder="Enter pink card number"
                @input="validatePinkCard"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Passport Number</label
              >
              <input
                v-model="passportNumber"
                type="text"
                placeholder="Enter passport number"
                @input="validatePassport"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Company</label
              >
              <input
                v-model="company"
                type="text"
                placeholder="Enter company name"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition shadow-md"
        >
          Register
        </button>

        <!-- Login Link -->
        <div class="text-center text-sm text-gray-600 mt-4">
          Already have an account?
          <router-link
            to="/login"
            class="text-blue-600 font-medium hover:underline"
            >Login here</router-link
          >
        </div>
      </form>
    </div>

    <!-- Preview Modal -->
    <div
      v-if="showPreview"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
      >
        <h3 class="text-xl font-bold text-blue-600 mb-4 text-center">
          Confirm register data
        </h3>

        <div class="space-y-2 text-sm text-gray-700">
          <p><span class="font-medium">E-mail:</span> {{ username }}</p>
          <p><span class="font-medium">Full Name:</span> {{ fullName }}</p>
          <p>
            <span class="font-medium">Role:</span>
            {{ role === "rescuer" ? "Rescuer" : "User" }}
          </p>
          <p v-if="bloodGroup">
            <span class="font-medium">Blood Group:</span> {{ bloodGroup }}
          </p>
          <p v-if="age">
            <span class="font-medium">Age:</span> {{ age }} years old
          </p>
          <p v-if="gender">
            <span class="font-medium">Gender:</span> {{ gender }}
          </p>
          <p v-if="height">
            <span class="font-medium">Height:</span> {{ height }} cm.
          </p>
          <p v-if="weight">
            <span class="font-medium">Weight:</span> {{ weight }} Kg.
          </p>
          <p v-if="relativeContactNumber">
            <span class="font-medium">relativeContactNumber:</span>
            {{ relativeContactNumber }}
          </p>
          <p v-if="!foreignWorker && idCard">
            <span class="font-medium">ID Card:</span> {{ idCard }}
          </p>
          <p v-if="allergiesMedicalConditions">
            <span class="font-medium">Allergies/Medical Conditions:</span>
            {{ allergiesMedicalConditions }}
          </p>
          <p>
            <span class="font-medium">Foreign Worker:</span>
            {{ foreignWorker ? "Yes" : "No" }}
          </p>

          <template v-if="foreignWorker">
            <p v-if="national">
              <span class="font-medium">National:</span> {{ national }}
            </p>
            <p v-if="pinkCardNumber">
              <span class="font-medium">Pink Card Number:</span>
              {{ pinkCardNumber }}
            </p>
            <p v-if="passportNumber">
              <span class="font-medium">Passport Number:</span>
              {{ passportNumber }}
            </p>
            <p v-if="company">
              <span class="font-medium">Company:</span> {{ company }}
            </p>
          </template>
        </div>

        <div class="flex justify-between mt-6 gap-3">
          <button
            @click="showPreview = false"
            class="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            @click="confirmRegister"
            class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Confirm
          </button>
        </div>
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
      username: "",
      password: "",
      fullName: "",
      role: "",
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
      showPreview: false,
    };
  },
  methods: {
    showPreviewModal() {
      if (!this.role) {
        alert("Please select your role");
        return;
      }
      if (!this.username || !this.password) {
        alert("Please input your email and password");
        return;
      }
      this.showPreview = true;
    },

    async confirmRegister() {
      this.showPreview = false;
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
          role: this.role,
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

        alert("Register Sucessful! Now you can login");
        this.$router.push("/login");
      } catch (error) {
        console.error("Register failed:", error.message);
        alert("Register failed: " + error.message);
      }
    },

    validatePassword() {},
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
      if (value && (value < 50 || value > 300)) {
        this.height = value < 50 ? 50 : 300;
        event.target.value = this.height;
      }
    },
    validateWeight(event) {
      const value = event.target.value;
      if (value && (value < 20 || value > 300)) {
        this.weight = value < 20 ? 20 : 300;
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
