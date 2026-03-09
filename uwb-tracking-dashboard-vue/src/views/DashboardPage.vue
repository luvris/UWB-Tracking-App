<template>
  <div class="min-h-screen bg-slate-100 flex flex-col">
    <!-- Header -->
    <header
      class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md sticky top-0 z-50"
    >
      <div
        class="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center"
      >
        <div class="flex items-center space-x-3">
          <div
            class="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shadow-sm"
          >
            <span class="text-lg font-bold">UWB</span>
          </div>
          <div>
            <h1 class="text-lg font-extrabold tracking-wide">
              UWB Tracking Dashboard
            </h1>
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <div class="text-right">
            <div class="text-sm font-semibold leading-tight">
              {{ currentUserName }}
            </div>
            <div class="text-[11px] text-blue-100">
              {{ currentUserRole || "Guest" }}
            </div>
          </div>

          <!-- Profile button -->
          <button
            @click="openProfileModal"
            class="px-3 py-1.5 bg-slate-100/10 hover:bg-white/10 text-white text-xs rounded-md shadow-sm border border-white/20 transition"
            title="Edit Profile"
          >
            Edit Profile
          </button>

          <!-- Logout button -->
          <button
            @click="handleLogout"
            class="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs rounded-md shadow-sm flex items-center transition"
            title="Logout"
          >
            <span class="inline-block bg-red-200" />
            Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Main -->
    <main
      class="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 w-full"
    >
      <!-- Left: Map & distance -->
      <div class="lg:col-span-3 space-y-6">
        <!-- Position Overview -->
        <section class="bg-white rounded-2xl shadow-sm border border-slate-200">
          <div
            class="px-6 py-4 border-b border-slate-100 flex items-center justify-between"
          >
            <h2
              class="text-base font-bold text-slate-800 flex items-center gap-2"
            >
              Position Overview
            </h2>
          </div>

          <div class="relative p-4">
            <div
              class="relative w-full h-[480px] border border-slate-200 rounded-xl bg-slate-50 overflow-hidden"
            >
              <svg
                ref="map"
                width="100%"
                height="100%"
                class="absolute inset-0"
              ></svg>

              <!-- Map controls -->
              <div class="absolute top-4 right-4 flex flex-col space-y-2 z-10">
                <button @click="zoomIn" class="map-btn">
                  <span class="text-lg font-bold leading-none">+</span>
                </button>
                <button @click="zoomOut" class="map-btn">
                  <span class="text-lg font-bold leading-none">−</span>
                </button>
                <button
                  @click="resetZoom"
                  class="map-btn map-btn-muted text-[10px]"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Distance Between Tags -->
        <section
          v-if="selectedTag1 && selectedTag2"
          class="bg-blue-50 border border-blue-200 rounded-2xl px-6 py-5 shadow-sm"
        >
          <h3 class="text-sm font-bold text-blue-800 text-center mb-3">
            Distance Between Tags
          </h3>
          <div class="text-center space-y-1.5 text-xs text-slate-700">
            <div>
              Tag 1:
              <span class="font-semibold">
                {{ selectedTag1.name || selectedTag1.type }} ({{
                  selectedTag1.id
                }})
              </span>
              <span
                v-if="selectedTag1.userId && usersById[selectedTag1.userId]"
                class="text-[11px] text-slate-600"
              >
                : {{ usersById[selectedTag1.userId].fullName || "(No Name)" }}
              </span>
            </div>

            <div>
              Tag 2:
              <span class="font-semibold">
                {{ selectedTag2.name || selectedTag2.type }} ({{
                  selectedTag2.id
                }})
              </span>
              <span
                v-if="selectedTag2.userId && usersById[selectedTag2.userId]"
                class="text-[11px] text-slate-600"
              >
                : {{ usersById[selectedTag2.userId].fullName || "(No Name)" }}
              </span>
            </div>

            <div
              class="text-2xl font-extrabold text-blue-600 my-3 tracking-tight"
            >
              {{ calculatedDistance.toFixed(2) }} m
            </div>
            <div class="text-[11px] text-slate-600">
              Current position (Tag 2): X:
              {{ selectedTag2.x.toFixed(2) }} m, Y:
              {{ selectedTag2.y.toFixed(2) }} m
            </div>
            <button
              @click="clearTag2Selection"
              class="mt-4 px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md font-semibold text-xs transition"
            >
              Clear Selection
            </button>
          </div>
        </section>
      </div>

      <!-- Right: side panel -->
      <div class="space-y-5">
        <!-- My Device -->
        <section
          v-if="myDevice"
          class="p-4 bg-blue-50 border border-blue-200 rounded-2xl shadow-sm"
        >
          <h3 class="font-bold text-blue-800 text-center mb-2 text-sm">
            My Device
          </h3>
          <p class="text-center mb-3 text-xs text-slate-700">
            Current equipment:
            <span class="font-semibold">
              {{ myDevice.name || myDevice.type }} ({{ myDevice.id }})
            </span>
          </p>
          <div class="flex justify-center">
            <button
              @click="focusOnMyDevice"
              class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold text-xs transition"
            >
              Focus on My Device
            </button>
          </div>
        </section>

        <!-- Tags -->
        <section
          v-if="tagDevices.length"
          class="p-4 bg-purple-50 border border-purple-200 rounded-2xl shadow-sm"
        >
          <h3 class="font-bold text-purple-800 mb-3 text-center text-sm">
            Tag Devices
          </h3>
          <div class="space-y-2 max-h-72 overflow-y-auto pr-1">
            <article
              v-for="tag in tagDevices"
              :key="tag.id"
              class="bg-white border border-slate-200 rounded-lg p-3 text-xs"
              :class="{
                'shadow-sm':
                  selectedTag1?.id === tag.id || selectedTag2?.id === tag.id,
              }"
            >
              <div class="flex justify-between items-start gap-2">
                <div class="flex-1">
                  <div class="font-semibold text-slate-800 text-xs">
                    {{ tag.name || tag.type }}
                  </div>
                  <div class="text-[11px] text-slate-500 mt-0.5">
                    {{ tag.id }}
                    <span v-if="tag.userId && usersById[tag.userId]">
                      : {{ usersById[tag.userId].fullName }}
                    </span>
                  </div>
                  <div class="text-[11px] text-slate-600 mt-1">
                    Position: ({{ tag.x }}, {{ tag.y }})
                  </div>
                </div>
                <div class="flex flex-col gap-1">
                  <button
                    @click="selectTagForDistance(tag)"
                    class="text-[11px] bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded font-semibold"
                  >
                    Select
                  </button>
                  <button
                    v-if="!tag.userId"
                    @click="confirmPairDevice(tag)"
                    class="text-[11px] bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded font-semibold"
                  >
                    Pair
                  </button>
                  <button
                    v-else-if="canUnpair(tag)"
                    @click="confirmUnpairDevice(tag)"
                    class="text-[11px] bg-slate-600 hover:bg-slate-700 text-white px-3 py-1 rounded font-semibold"
                  >
                    Unpair
                  </button>
                  <span
                    v-else
                    class="text-[11px] bg-slate-200 text-slate-600 px-3 py-1 rounded font-semibold cursor-not-allowed"
                  >
                    Paired
                  </span>
                </div>
              </div>
            </article>
          </div>
        </section>

        <!-- Personnel / Victims -->
        <section class="bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div class="p-4 border-b border-slate-100">
            <div class="flex justify-between items-center">
              <h3 class="font-bold text-slate-800 text-sm">
                Personnel / Victims
              </h3>
              <select
                v-model="userFilter"
                class="text-xs border border-slate-300 rounded px-2 py-1 bg-white"
              >
                <option value="all">All Types</option>
                <option value="rescuer">Rescuer</option>
                <option value="user">Victims</option>
              </select>
            </div>
          </div>

          <div class="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            <div
              v-for="u in filteredUsers"
              :key="u.id"
              class="p-4 hover:bg-slate-50 transition text-xs"
            >
              <div class="flex justify-between items-start gap-2">
                <div class="flex-1">
                  <div class="font-semibold text-slate-800 mb-0.5">
                    {{ u.fullName || "(No Name)" }}
                  </div>
                  <div class="text-[11px] text-slate-500 mb-1">
                    {{ getPairedDeviceName(u.id) }}
                  </div>

                  <div class="flex flex-wrap gap-1 mb-1.5">
                    <span
                      v-if="u.needHelp"
                      class="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-[11px] font-semibold"
                    >
                      Need Help
                    </span>
                    <span
                      v-if="u.rescued"
                      class="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[11px] font-semibold"
                    >
                      Rescued
                    </span>
                  </div>
                </div>

                <div class="flex flex-col gap-1 items-end">
                  <!-- ปุ่ม Details / Note เฉพาะ Rescuer -->
                  <div v-if="isRescuer" class="flex flex-col gap-1">
                    <button
                      @click="showUserDetail(u)"
                      class="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-semibold text-[11px] transition"
                    >
                      Details
                    </button>
                    <button
                      @click="openTriageModal(u)"
                      class="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded font-semibold text-[11px] transition"
                    >
                      Note
                    </button>
                  </div>

                  <!-- ปุ่ม toggle Need Help / Rescued เฉพาะ Rescuer ที่จัดการ Victim (role user) -->
                  <div
                    v-if="isRescuer && u.role === 'user' && isUserPaired(u.id)"
                    class="flex flex-col gap-1 mt-2"
                  >
                    <button
                      @click="toggleNeedHelp(u)"
                      class="px-3 py-1 text-[11px] rounded font-semibold border"
                      :disabled="u.rescued"
                      :class="
                        u.needHelp
                          ? 'bg-red-500 border-red-600 text-white hover:bg-red-600'
                          : u.rescued
                          ? 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed'
                          : 'bg-white border-red-400 text-red-700 hover:bg-red-50'
                      "
                    >
                      {{ u.needHelp ? "Clear Need Help" : "Mark Need Help" }}
                    </button>

                    <button
                      @click="toggleRescued(u)"
                      class="px-3 py-1 text-[11px] rounded font-semibold border"
                      :disabled="u.needHelp"
                      :class="
                        u.rescued
                          ? 'bg-emerald-500 border-emerald-600 text-white hover:bg-emerald-600'
                          : u.needHelp
                          ? 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed'
                          : 'bg-white border-emerald-400 text-emerald-700 hover:bg-emerald-50'
                      "
                    >
                      {{ u.rescued ? "Clear Rescued" : "Mark Rescued" }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="filteredUsers.length === 0"
              class="p-6 text-center text-slate-400 text-xs"
            >
              No users found
            </div>
          </div>
        </section>
      </div>

      <!-- User Details Modal -->
      <div
        v-if="isUserDetail"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-2xl p-6 shadow-xl max-w-md w-full">
          <h2 class="text-lg font-bold mb-4 text-emerald-700">User Details</h2>
          <div class="space-y-1.5 text-xs text-slate-800">
            <div>
              <strong>Name:</strong> {{ userDetail.fullName || "(No Name)" }}
            </div>
            <div><strong>Role:</strong> {{ userDetail.role }}</div>
            <div><strong>Gender:</strong> {{ userDetail.gender }}</div>
            <div><strong>Age:</strong> {{ userDetail.age }}</div>
            <div><strong>Blood Group:</strong> {{ userDetail.bloodGroup }}</div>
            <div>
              <strong>Contact:</strong>
              {{ userDetail.relativeContactNumber }}
            </div>
            <div class="text-red-600">
              <strong>Medical Conditions:</strong>
              {{ userDetail.allergiesMedicalConditions }}
            </div>
            <div v-if="userDetail.triageNote" class="text-red-600">
              <strong>Triage Note:</strong> {{ userDetail.triageNote }}
            </div>
            <template v-if="userDetail.foreignWorker">
              <div><strong>Company:</strong> {{ userDetail.company }}</div>
              <div><strong>Nationality:</strong> {{ userDetail.national }}</div>
              <div>
                <strong>Passport Number:</strong>
                {{ userDetail.passportNumber }}
              </div>
              <div>
                <strong>Pink Card Number:</strong>
                {{ userDetail.pinkCardNumber }}
              </div>
            </template>
          </div>
          <div class="mt-5 flex justify-end">
            <button
              @click="isUserDetail = false"
              class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <!-- Triage Note Modal -->
      <div
        v-if="showTriage"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-2xl p-6 shadow-xl max-w-md w-full">
          <h2 class="text-base font-bold text-amber-700 mb-3">Triage Note</h2>
          <div class="mb-2 text-xs">
            <b>User:</b> {{ selectedUser?.fullName }}
          </div>
          <textarea
            v-model="triageNote"
            rows="4"
            class="w-full border border-slate-300 rounded-md p-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Describe symptoms, injury, etc."
          ></textarea>
          <div class="flex justify-end gap-2 mt-4">
            <button
              @click="showTriage = false"
              class="px-4 py-1.5 border rounded text-slate-700 text-xs hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              @click="saveTriageNote"
              class="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold"
            >
              Save Note
            </button>
          </div>
        </div>
      </div>

      <!-- Profile Edit Modal -->
      <div
        v-if="showProfile"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-2xl p-6 shadow-xl max-w-md w-full">
          <h2 class="text-base font-bold text-slate-800 mb-3">Edit Profile</h2>
          <div class="space-y-3 text-xs">
            <div>
              <label class="block mb-1 font-semibold text-slate-700">
                Full name
              </label>
              <input
                v-model="profileForm.fullName"
                type="text"
                class="w-full border border-slate-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label class="block mb-1 font-semibold text-slate-700">
                Relative contact phone number
              </label>
              <input
                v-model="profileForm.relativeContactNumber"
                type="tel"
                class="w-full border border-slate-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your new phone number"
              />
            </div>

            <div>
              <label class="block mb-1 font-semibold text-slate-700">
                Weight (kg)
              </label>
              <input
                v-model.number="profileForm.weight"
                type="number"
                min="0"
                class="w-full border border-slate-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your weight in kg"
              />
            </div>

            <div>
              <label class="block mb-1 font-semibold text-slate-700">
                Height (cm)
              </label>
              <input
                v-model.number="profileForm.height"
                type="number"
                min="0"
                class="w-full border border-slate-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your height in cm"
              />
            </div>

            <div>
              <label class="block mb-1 font-semibold text-slate-700">
                Role
              </label>
              <div
                class="px-2 py-1.5 text-xs border border-slate-200 rounded bg-slate-50 text-slate-500"
              >
                {{ currentUserRole || "Guest" }}
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-5">
            <button
              @click="closeProfileModal"
              class="px-4 py-1.5 border rounded text-slate-700 text-xs hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              @click="saveProfile"
              class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <!-- Pair Confirmation Modal -->
      <div
        v-if="pairConfirmModal.show"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-2xl p-6 shadow-xl max-w-md w-full">
          <h3 class="font-bold text-blue-700 mb-3 text-base">
            Confirm Pairing
          </h3>
          <p class="text-slate-700 text-sm mb-5">
            Do you want to pair device
            <span class="font-semibold">
              {{ pairConfirmModal.device?.name || pairConfirmModal.device?.id }}
            </span>
            with your account?
          </p>
          <div class="flex justify-end gap-2">
            <button
              @click="pairConfirmModal.show = false"
              class="px-4 py-1.5 border border-slate-300 rounded text-xs text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              @click="pairDevice"
              class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>

      <!-- Unpair Confirmation Modal -->
      <div
        v-if="unpairConfirmModal.show"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-2xl p-6 shadow-xl max-w-md w-full">
          <h3 class="font-bold text-red-700 mb-3 text-base">
            Confirm Unpairing
          </h3>
          <p class="text-slate-700 text-sm mb-5">
            Do you want to unpair device
            <span class="font-semibold">
              {{
                unpairConfirmModal.device?.name || unpairConfirmModal.device?.id
              }}
            </span>
            from your account?
          </p>
          <div class="flex justify-end gap-2">
            <button
              @click="unpairConfirmModal.show = false"
              class="px-4 py-1.5 border border-slate-300 rounded text-xs text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              @click="unpairDevice"
              class="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { ref as dbRef, onValue, update, get } from "firebase/database";
import { database } from "@/firebase/firebase";
import { useRouter } from "vue-router";
import { auth } from "@/firebase/firebase";
import { signOut } from "firebase/auth";
import * as d3 from "d3";

const devices = ref([]);
const users = ref([]);

const map = ref(null);
const zoomLevel = ref(1);
const panX = ref(0);
const panY = ref(0);
let zoomBehavior = null;

const isUserDetail = ref(false);
const userDetail = ref({});
const currentUserName = ref("");
const currentUserRole = ref("");
const currentUserId = ref("");
const router = useRouter();
const userFilter = ref("all");
const isRescuer = ref(false);

const pairConfirmModal = ref({ show: false, device: null });
const unpairConfirmModal = ref({ show: false, device: null });

const showTriage = ref(false);
const triageNote = ref("");
const selectedUser = ref(null);

// Profile state
const showProfile = ref(false);
const profileForm = ref({
  fullName: "",
  relativeContactNumber: "",
  weight: null,
  height: null,
});

// --- Computed ---
const filteredUsers = computed(() => {
  if (userFilter.value === "rescuer") {
    return users.value.filter((u) => u.role === "rescuer");
  }
  if (userFilter.value === "user") {
    return users.value.filter((u) => u.role === "user");
  }
  return users.value;
});

const myDevice = computed(() => {
  const user = auth.currentUser;
  if (!user) return null;
  return devices.value.find((d) => d.userId === user.uid) || null;
});

const anchorDevices = computed(() =>
  devices.value.filter((d) => d.type === "anchor")
);

const tagDevices = computed(() =>
  devices.value.filter((d) => d.type === "tag")
);

const calculatedDistance = computed(() => {
  if (!selectedTag1.value || !selectedTag2.value) return 0;
  const dx = selectedTag2.value.x - selectedTag1.value.x;
  const dy = selectedTag2.value.y - selectedTag1.value.y;
  return Math.sqrt(dx * dx + dy * dy);
});

const usersById = computed(() => {
  const mapObj = {};
  users.value.forEach((u) => {
    mapObj[u.id] = u;
  });
  return mapObj;
});

const currentUserObj = computed(
  () => users.value.find((u) => u.id === currentUserId.value) || null
);

// --- Distance selection ---
const selectedTag1Id = ref(null);
const selectedTag2Id = ref(null);

const selectedTag1 = computed(
  () => devices.value.find((d) => d.id === selectedTag1Id.value) || null
);
const selectedTag2 = computed(
  () => devices.value.find((d) => d.id === selectedTag2Id.value) || null
);

function selectTagForDistance(tag) {
  if (!selectedTag1Id.value) {
    selectedTag1Id.value = tag.id;
  } else if (selectedTag1Id.value === tag.id) {
    selectedTag1Id.value = null;
  } else if (!selectedTag2Id.value) {
    selectedTag2Id.value = tag.id;
  } else {
    selectedTag1Id.value = selectedTag2Id.value;
    selectedTag2Id.value = tag.id;
  }
  renderMap();
}

function clearTag2Selection() {
  selectedTag1.value = null;
  selectedTag2.value = null;
  renderMap();
}

// --- Pair / Unpair ---
function confirmPairDevice(device) {
  pairConfirmModal.value = { show: true, device };
}

function confirmUnpairDevice(device) {
  unpairConfirmModal.value = { show: true, device };
}

async function pairDevice() {
  const user = auth.currentUser;
  if (!user || !pairConfirmModal.value.device) return;

  const devId = pairConfirmModal.value.device.id;
  await update(dbRef(database), {
    [`devices/${devId}/userId`]: user.uid,
  });

  pairConfirmModal.value.show = false;
}

async function unpairDevice() {
  if (!unpairConfirmModal.value.device) return;

  const devId = unpairConfirmModal.value.device.id;
  await update(dbRef(database), {
    [`devices/${devId}/userId`]: null,
  });

  unpairConfirmModal.value.show = false;
}

function canUnpair(device) {
  const user = auth.currentUser;
  if (!user) return false;
  return device.userId === user.uid;
}

function getPairedDeviceName(userId) {
  const pairedDevice = devices.value.find((d) => d.userId === userId);
  if (pairedDevice) {
    return pairedDevice.name || pairedDevice.id || "Paired device";
  }
  return "Unpaired device yet";
}

// --- Focus on my device ---
function focusOnMyDevice() {
  if (!myDevice.value) return;
  zoomLevel.value = 2;
  panX.value = 0;
  panY.value = 0;
  renderMap();
  alert(`Focused on ${myDevice.value.name || myDevice.value.type}`);
}

// --- Triage ---
function openTriageModal(user) {
  selectedUser.value = user;
  triageNote.value = user.triageNote || "";
  showTriage.value = true;
}

async function saveTriageNote() {
  if (!selectedUser.value) return;
  const userId = selectedUser.value.id;
  await update(dbRef(database), {
    [`users/${userId}/triageNote`]: triageNote.value,
  });
  showTriage.value = false;
}

// --- Profile ---
async function openProfileModal() {
  try {
    const uid = currentUserId.value || auth.currentUser?.uid;
    if (!uid) {
      alert("No user logged in");
      return;
    }

    const snap = await get(dbRef(database, `users/${uid}`));
    const u = snap.val() || {};

    profileForm.value = {
      fullName: u.fullName || "",
      relativeContactNumber: u.relativeContactNumber || "",
      weight: u.weight ?? null,
      height: u.height ?? null,
    };

    showProfile.value = true;
  } catch (e) {
    alert(`Open profile failed: ${e.message || e}`);
  }
}

function closeProfileModal() {
  showProfile.value = false;
}

async function saveProfile() {
  try {
    const uid = currentUserId.value || auth.currentUser?.uid;
    if (!uid) {
      alert("No user logged in");
      return;
    }

    const base = `users/${uid}`;
    const payload = {};

    if (profileForm.value.fullName !== "") {
      payload[`${base}/fullName`] = profileForm.value.fullName;
    }
    if (profileForm.value.relativeContactNumber !== "") {
      payload[`${base}/relativeContactNumber`] =
        profileForm.value.relativeContactNumber;
    }
    if (profileForm.value.weight !== null && profileForm.value.weight !== "") {
      payload[`${base}/weight`] = profileForm.value.weight;
    }
    if (profileForm.value.height !== null && profileForm.value.height !== "") {
      payload[`${base}/height`] = profileForm.value.height;
    }

    if (Object.keys(payload).length > 0) {
      await update(dbRef(database), payload);
    }

    showProfile.value = false;
  } catch (e) {
    alert(`Save profile failed: ${e.message || e}`);
  }
}

// --- Firebase realtime ---
function fetchDevicesAndUsers() {
  const devicesDbRef = dbRef(database, "devices");
  onValue(devicesDbRef, (snapshot) => {
    const data = snapshot.val();
    devices.value = data
      ? Object.entries(data).map(([key, value]) => ({
          ...value,
          id: key,
        }))
      : [];
    renderMap();
  });

  const usersDbRef = dbRef(database, "users");
  onValue(usersDbRef, (snapshot) => {
    const data = snapshot.val();
    users.value = data
      ? Object.entries(data).map(([key, value]) => ({
          ...value,
          id: key,
        }))
      : [];
    renderMap();
  });
}

function fetchCurrentUserNameAndRole() {
  const user = auth.currentUser;
  if (user && user.uid) {
    currentUserId.value = user.uid;
    const userProfileRef = dbRef(database, `users/${user.uid}`);
    onValue(userProfileRef, (snapshot) => {
      const data = snapshot.val();
      currentUserName.value = data?.fullName || "(No Name)";
      currentUserRole.value = data?.role || "";
      isRescuer.value = currentUserRole.value === "rescuer";
    });
  }
}

// --- D3 Map ---
function setupZoomBehavior() {
  if (!map.value) return;

  const svg = d3.select(map.value);

  zoomBehavior = d3
    .zoom()
    .scaleExtent([0.3, 3])
    .on("zoom", (event) => {
      const transform = event.transform;
      zoomLevel.value = transform.k;
      panX.value = transform.x;
      panY.value = transform.y;
      renderMap();
    });

  svg.call(zoomBehavior);
}

function renderMap() {
  if (!map.value) return;

  const svg = d3.select(map.value);
  svg.selectAll("*").remove();

  const width = map.value.clientWidth || 700;
  const height = map.value.clientHeight || 500;

  const meterToPixel = 120;
  const scale = zoomLevel.value;

  const offsetX = width * 0.2 + panX.value;
  const offsetY = height * 0.8 + panY.value;

  const g = svg
    .append("g")
    .attr("transform", `translate(${panX.value},${panY.value})`);

  // grid
  for (let i = 0; i <= 10; i++) {
    const pos = i * meterToPixel * scale;
    g.append("line")
      .attr("x1", offsetX + pos)
      .attr("y1", 0)
      .attr("x2", offsetX + pos)
      .attr("y2", height)
      .attr("stroke", "#e5e7eb");
    g.append("line")
      .attr("x1", 0)
      .attr("y1", offsetY - pos)
      .attr("x2", width)
      .attr("y2", offsetY - pos)
      .attr("stroke", "#e5e7eb");
  }

  // ANCHORS (A001(0,0) A002(0,3) A003(3,0))
  anchorDevices.value.forEach((anchor) => {
    let axMeter = 0;
    let ayMeter = 0;

    if (anchor.id === "A001") {
      axMeter = 0;
      ayMeter = 0;
    } else if (anchor.id === "A002") {
      axMeter = 3;
      ayMeter = 0;
    } else if (anchor.id === "A003") {
      axMeter = 0;
      ayMeter = 3;
    }

    const ax = offsetX + axMeter * meterToPixel * scale;
    const ay = offsetY - ayMeter * meterToPixel * scale;

    const isOnline = anchor.online === true;

    g.append("rect")
      .attr("x", ax - 10)
      .attr("y", ay - 10)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", isOnline ? "#0095FF" : "#828282")
      .attr("rx", 4);

    g.append("text")
      .attr("x", ax)
      .attr("y", ay + 24)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "#4b5563")
      .text(anchor.name || anchor.id || "Anchor");
  });

  // TAGS
  tagDevices.value.forEach((tag) => {
    const isOnline =
      tag.status?.A1 === "OK" &&
      tag.status?.A2 === "OK" &&
      tag.status?.A3 === "OK";

    const tx = offsetX + tag.x * meterToPixel * scale;
    const ty = offsetY - tag.y * meterToPixel * scale;

    const isSelected =
      selectedTag1.value?.id === tag.id || selectedTag2.value?.id === tag.id;

    let role = null;
    let userObj = null;
    if (tag.userId && usersById.value[tag.userId]) {
      userObj = usersById.value[tag.userId];
      role = userObj.role;
    }

    let roleColor = "#cbd5f5";
    if (role === "rescuer") {
      roleColor = "rgb(139, 92, 246)";
    } else if (role === "user") {
      roleColor = "#04BA1F";
    }

    const fillColor = isOnline ? roleColor : "#828282";

    const needHelp = userObj?.needHelp === true;
    const rescued = userObj?.rescued === true;

    const tagGroup = g
      .append("g")
      .style("cursor", "pointer")
      .on("click", () => selectTagForDistance(tag));

    tagGroup
      .append("circle")
      .attr("cx", tx)
      .attr("cy", ty)
      .attr("r", isSelected ? 20 : 15)
      .attr("fill", fillColor)
      .attr("stroke", isSelected ? "#3b82f6" : "#ffffff")
      .attr("stroke-width", 3);

    if (needHelp) {
      tagGroup
        .append("circle")
        .attr("cx", tx)
        .attr("cy", ty)
        .attr("r", isSelected ? 24 : 19)
        .attr("fill", "none")
        .attr("stroke", "#f97316")
        .attr("stroke-width", 3)
        .attr("stroke-dasharray", "4,2");
    }

    if (rescued) {
      const offset = isSelected ? 16 : 13;
      tagGroup
        .append("circle")
        .attr("cx", tx + offset)
        .attr("cy", ty + offset)
        .attr("r", 8)
        .attr("fill", "#22c55e");

      tagGroup
        .append("text")
        .attr("x", tx + offset)
        .attr("y", ty + offset + 1)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "9px")
        .attr("font-weight", "bold")
        .text("✓");
    }

    tagGroup
      .append("text")
      .attr("x", tx)
      .attr("y", ty + 5)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-weight", "bold")
      .attr("font-size", "12px")
      .text(
        role === "rescuer"
          ? "R"
          : role === "user"
          ? "U"
          : tag.name
          ? tag.name[0]
          : "T"
      );
  });
}

function zoomIn() {
  zoomLevel.value = Math.min(zoomLevel.value * 1.2, 3);
  renderMap();
}

function zoomOut() {
  zoomLevel.value = Math.max(zoomLevel.value / 1.2, 0.3);
  renderMap();
}

function resetZoom() {
  zoomLevel.value = 1;
  panX.value = 0;
  panY.value = 0;

  if (map.value && zoomBehavior) {
    const svg = d3.select(map.value);
    svg.call(zoomBehavior.transform, d3.zoomIdentity);
  }

  renderMap();
}

// --- User detail & auth ---
function showUserDetail(u) {
  userDetail.value = u;
  isUserDetail.value = true;
}

async function handleLogout() {
  try {
    if (!auth.currentUser) {
      await router.push("/login");
      return;
    }
    await signOut(auth);
    await router.push("/login");
  } catch (error) {
    alert(`Logout failed: ${error.message || "Unknown error"}`);
  }
}

onMounted(() => {
  fetchCurrentUserNameAndRole();
  fetchDevicesAndUsers();
  setupZoomBehavior();
});

async function toggleNeedHelp(user) {
  try {
    const userId = user.id;
    const hasNeedHelp = !!user.needHelp;
    const hasRescued = !!user.rescued;

    let nextNeedHelp = !hasNeedHelp;
    let nextRescued = false;

    await update(dbRef(database), {
      [`users/${userId}/needHelp`]: nextNeedHelp,
      [`users/${userId}/rescued`]: nextRescued,
    });
  } catch (e) {
    alert(`Toggle Need Help failed: ${e.message || e}`);
  }
}

async function toggleRescued(user) {
  try {
    const userId = user.id;
    const hasRescued = !!user.rescued;

    let nextRescued = !hasRescued;
    let nextNeedHelp = false;

    await update(dbRef(database), {
      [`users/${userId}/rescued`]: nextRescued,
      [`users/${userId}/needHelp`]: nextNeedHelp,
    });
  } catch (e) {
    alert(`Toggle Rescued failed: ${e.message || e}`);
  }
}

const isUserPaired = (userId) => {
  return devices.value.some((d) => d.userId === userId);
};
</script>

<style scoped>
.map-btn {
  @apply w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-md transition-all text-xs;
}

.map-btn-muted {
  @apply bg-slate-600 hover:bg-slate-700;
}
</style>
