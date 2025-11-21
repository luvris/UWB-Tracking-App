<template>
  <header
    class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg sticky top-0 z-50"
  >
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <h1 class="text-xl font-extrabold tracking-wide">
          UWB Tracking Dashboard
        </h1>
      </div>
      <div class="flex items-center space-x-4">
        <span class="font-medium text-white text-base">{{
          currentUserName
        }}</span>
        <button
          @click="handleLogout"
          class="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs rounded-md transition shadow-sm"
          title="Logout"
        >
          Logout
        </button>
      </div>
    </div>
  </header>

  <main
    class="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6"
  >
    <!-- Map Panel -->
    <div class="lg:col-span-3 bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-bold text-gray-800 flex items-center">
          Position Overview
        </h2>
      </div>
      <div class="relative p-4">
        <div
          class="relative w-full h-[500px] border border-gray-200 rounded-lg bg-gray-50 overflow-hidden"
        >
          <svg
            ref="map"
            width="100%"
            height="100%"
            class="absolute inset-0"
          ></svg>
          <div class="absolute top-4 right-4 flex flex-col space-y-2 z-10">
            <button
              @click="zoomIn"
              class="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-md transition-all duration-200"
            >
              <span class="text-lg font-bold">+</span>
            </button>
            <button
              @click="zoomOut"
              class="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-md transition-all duration-200"
            >
              <span class="text-lg font-bold">−</span>
            </button>
            <button
              @click="resetZoom"
              class="w-10 h-10 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center shadow-md transition-all duration-200 text-xs"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Side Panel -->
    <div class="space-y-6">
      <!-- Device List Panel -->
      <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 class="font-semibold text-blue-800 mb-2">Devices (Realtime)</h3>
        <div v-if="devices.length">
          <div
            v-for="dev in devices"
            :key="dev.id"
            class="mb-2 text-sm flex items-center justify-between"
          >
            <div>
              {{ dev.name || dev.type }} ({{ dev.type }})
              <span v-if="dev.userId && usersById[dev.userId]">
                ➔ User: {{ usersById[dev.userId].fullName }}
              </span>
              Battery: {{ dev.battery ?? "-" }}%, Position: ({{ dev.x }},{{
                dev.y
              }})
            </div>
            <div class="ml-2 flex gap-2">
              <button
                v-if="!dev.userId"
                @click="openPairModal(dev)"
                class="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded font-semibold"
              >
                Pair
              </button>
              <button
                v-else
                @click="unpairDevice(dev)"
                class="text-xs bg-gray-500 hover:bg-gray-700 text-white px-3 py-1 rounded font-semibold"
              >
                Unpair
              </button>
            </div>
          </div>
        </div>
        <div v-else>No devices loaded.</div>
      </div>

      <!-- Users / Profiles Panel - แยกตาม Role -->
      <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 class="font-semibold text-green-800 mb-2">Users / Profiles</h3>
        <!-- Rescuer Group -->
        <div v-if="rescuerList.length">
          <div class="font-bold text-green-700 mb-1 text-base">Rescuer</div>
          <div v-for="u in rescuerList" :key="u.id" class="mb-3">
            <div
              class="border border-gray-200 rounded-md p-3 bg-white flex items-center"
              :class="isRescuer ? 'justify-between' : 'justify-center'"
              style="min-height: 60px"
            >
              <div
                :class="
                  isRescuer
                    ? 'font-medium text-gray-800 text-lg'
                    : 'font-medium text-gray-800 text-lg text-center w-full'
                "
              >
                {{ u.fullName || "(noname)" }}
                <div class="mt-1 text-xs text-gray-500">Updated: Just now</div>
              </div>
              <button
                v-if="isRescuer"
                @click="showUserDetail(u)"
                class="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition font-semibold ml-4"
              >
                Details
              </button>
            </div>
          </div>
        </div>
        <!-- User group -->
        <div v-if="userList.length">
          <div class="font-bold text-green-700 mb-1 text-base">User</div>
          <div v-for="u in userList" :key="u.id" class="mb-3">
            <div
              class="border border-gray-200 rounded-md p-3 bg-white flex items-center"
              :class="isRescuer ? 'justify-between' : 'justify-center'"
              style="min-height: 60px"
            >
              <div
                :class="
                  isRescuer
                    ? 'font-medium text-gray-800 text-lg'
                    : 'font-medium text-gray-800 text-lg text-center w-full'
                "
              >
                {{ u.fullName || "(noname)" }}
                <div class="mt-1 text-xs text-gray-500">Updated: Just now</div>
              </div>
              <div v-if="isRescuer" class="flex gap-2 ml-4">
                <button
                  @click="showUserDetail(u)"
                  class="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition font-semibold"
                >
                  Details
                </button>
                <button
                  @click="openTriageModal(u)"
                  class="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition font-semibold"
                >
                  Triage Note
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="!rescuerList.length && !userList.length"
          class="text-gray-500"
        >
          No users loaded.
        </div>
      </div>
    </div>

    <!-- User Details Modal -->
    <div
      v-if="isUserDetail"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl p-8 shadow-xl max-w-lg w-full">
        <h2 class="text-xl font-bold mb-4 text-green-700">User Details</h2>
        <div class="space-y-2 text-sm">
          <div>
            <strong>Name:</strong> {{ userDetail.fullName || "(noname)" }}
          </div>
          <div><strong>Role:</strong> {{ userDetail.role }}</div>
          <div><strong>Gender:</strong> {{ userDetail.gender }}</div>
          <div><strong>Age:</strong> {{ userDetail.age }}</div>
          <div><strong>Blood Group:</strong> {{ userDetail.bloodGroup }}</div>
          <div>
            <strong>Contact:</strong> {{ userDetail.relativeContactNumber }}
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
              <strong>Passport Number:</strong> {{ userDetail.passportNumber }}
            </div>
            <div>
              <strong>Pink Card Number:</strong> {{ userDetail.pinkCardNumber }}
            </div>
          </template>
        </div>
        <button
          @click="isUserDetail = false"
          class="mt-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>

    <!-- Triage Note Modal -->
    <div
      v-if="showTriage"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl p-8 shadow-xl max-w-md w-full">
        <h2 class="text-lg font-bold text-yellow-700 mb-4">Triage Note</h2>
        <div class="mb-3"><b>User:</b> {{ selectedUser?.fullName }}</div>
        <textarea
          v-model="triageNote"
          rows="4"
          class="w-full border border-gray-300 rounded p-2"
          placeholder="Describe symptoms, injury, etc."
        ></textarea>
        <div class="flex justify-end gap-2 mt-4">
          <button
            @click="showTriage = false"
            class="px-4 py-2 border rounded text-gray-700"
          >
            Cancel
          </button>
          <button
            @click="saveTriageNote"
            class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>

    <!-- Pair Device Modal (วางท้ายสุด) -->
    <div
      v-if="pairModal.show"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl p-8 shadow-xl max-w-xs w-full">
        <h3 class="font-bold text-blue-700 mb-3">
          Pair Device: {{ pairModal.device?.name || "" }}
        </h3>
        <select
          v-model="pairModal.selectedUserId"
          class="w-full border rounded p-2 mb-4"
        >
          <option value="">Select user</option>
          <option v-for="u in availableUsersForPair" :key="u.id" :value="u.id">
            {{ u.fullName }}
          </option>
        </select>
        <div class="flex justify-end gap-2">
          <button
            @click="pairModal.show = false"
            class="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            :disabled="!pairModal.selectedUserId"
            @click="pairDevice"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { ref as dbRef, onValue, update } from "firebase/database";
import { database } from "@/firebase/firebase";
import { useRouter } from "vue-router";
import { auth } from "@/firebase/firebase";
import { signOut } from "firebase/auth";
import * as d3 from "d3";

const devices = ref([]);
const users = ref([]);
const map = ref(null);
const zoomLevel = ref(1);
const isUserDetail = ref(false);
const userDetail = ref({});
const currentUserName = ref("");
const currentUserRole = ref("");
const router = useRouter();
const rescuerList = computed(() =>
  users.value.filter((u) => u.role === "rescuer")
);
const userList = computed(() => users.value.filter((u) => u.role === "user"));
const isRescuer = ref(false);
// --- Device Pair Modal state
const pairModal = ref({ show: false, device: null, selectedUserId: "" });
const usersById = computed(() => {
  const map = {};
  users.value.forEach((u) => (map[u.id] = u));
  return map;
});
const availableUsersForPair = computed(() =>
  users.value.filter(
    (u) => u.role === "user" && !devices.value.some((d) => d.userId === u.id)
  )
);

function openPairModal(dev) {
  pairModal.value = { show: true, device: dev, selectedUserId: "" };
}
async function pairDevice() {
  if (!pairModal.value.device || !pairModal.value.selectedUserId) return;
  const devId = pairModal.value.device.id;
  await update(dbRef(database), {
    [`devices/${devId}/userId`]: pairModal.value.selectedUserId,
  });
  pairModal.value.show = false;
}
async function unpairDevice(dev) {
  const devId = dev.id;
  await update(dbRef(database), {
    [`devices/${devId}/userId`]: null,
  });
}

// --- Triage Note State
const showTriage = ref(false);
const triageNote = ref("");
const selectedUser = ref(null);
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

// --- Fetch data realtime
function fetchDevicesAndUsers() {
  const devicesDbRef = dbRef(database, "devices");
  onValue(devicesDbRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      devices.value = Object.entries(data).map(([key, value]) => ({
        ...value,
        id: key,
      }));
    } else {
      devices.value = [];
    }
    renderMap();
  });
  const usersDbRef = dbRef(database, "users");
  onValue(usersDbRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      users.value = Object.entries(data).map(([key, value]) => ({
        ...value,
        id: key,
      }));
    } else {
      users.value = [];
    }
  });
}
function fetchCurrentUserNameAndRole() {
  const user = auth.currentUser;
  if (user && user.uid) {
    const userProfileRef = dbRef(database, `users/${user.uid}`);
    onValue(userProfileRef, (snapshot) => {
      const data = snapshot.val();
      currentUserName.value = data?.fullName || "(No Name)";
      currentUserRole.value = data?.role || "";
      isRescuer.value = currentUserRole.value === "rescuer";
    });
  }
}
function renderMap() {
  const svg = d3.select(map.value);
  svg.selectAll("*").remove();
  const width = map.value.clientWidth || 700;
  const height = map.value.clientHeight || 450;
  const centerX = width / 2;
  const centerY = height / 2;
  const scale = zoomLevel.value;
  const gridSize = 50 * scale;
  for (let x = 0; x <= width; x += gridSize) {
    svg
      .append("line")
      .attr("x1", x)
      .attr("y1", 0)
      .attr("x2", x)
      .attr("y2", height)
      .attr("stroke", "#e5e7eb")
      .attr("stroke-width", 1);
  }
  for (let y = 0; y <= height; y += gridSize) {
    svg
      .append("line")
      .attr("x1", 0)
      .attr("y1", y)
      .attr("x2", width)
      .attr("y2", y)
      .attr("stroke", "#e5e7eb")
      .attr("stroke-width", 1);
  }
  devices.value.forEach((device) => {
    if (typeof device.x !== "number" || typeof device.y !== "number") return;
    const x = centerX + (device.x - centerX) * scale;
    const y = centerY + (device.y - centerY) * scale;
    const color =
      device.type === "rescuer"
        ? "#10b981"
        : device.type === "user"
        ? "#8b5cf6"
        : "#ef4444";
    svg
      .append("circle")
      .attr("cx", x)
      .attr("cy", y)
      .attr("r", 14 * scale)
      .attr("fill", color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);
    svg
      .append("text")
      .attr("x", x)
      .attr("y", y + 5)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", `${11 * scale}px`)
      .attr("font-weight", "bold")
      .text(device.name ? device.name[0] : device.type?.[0] ?? "?");
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
  renderMap();
}
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
});
</script>

<style scoped>
.bg-blue-50 {
  background: #eff6ff;
}
.bg-green-50 {
  background: #ecfdf5;
}
.border-blue-200 {
  border-color: #bfdbfe;
}
.border-green-200 {
  border-color: #a7f3d0;
}
.rounded-md,
.rounded-xl {
  border-radius: 8px;
}
.shadow-xl {
  box-shadow: 0 6px 16px -4px rgba(19, 38, 60, 0.15);
}
button {
  transition: all 0.2s ease;
}
</style>
