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
    <div class="lg:col-span-3 space-y-6">
      <!-- Position Overview -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
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

      <!-- Distance Between Tags -->
      <div
        v-if="selectedTag1 && selectedTag2"
        class="bg-blue-50 border-2 border-blue-300 rounded-xl p-6"
      >
        <h3 class="text-lg font-bold text-blue-700 text-center mb-4">
          Distance Between Tags
        </h3>
        <div class="text-center space-y-2">
          <div class="text-sm text-gray-700">
            Tag 1: {{ selectedTag1.name || selectedTag1.type }} ({{
              selectedTag1.id
            }})
          </div>
          <div class="text-sm text-gray-700">
            Tag 2: {{ selectedTag2.name || selectedTag2.type }} ({{
              selectedTag2.id
            }})
          </div>
          <div class="text-2xl font-bold text-blue-600 my-3">
            Range: {{ calculatedDistance.toFixed(2) }} m
          </div>
          <div class="text-xs text-gray-600">
            Current position: X: {{ selectedTag2.x.toFixed(2) }}m, Y:
            {{ selectedTag2.y.toFixed(2) }}m
          </div>
          <button
            @click="clearTag2Selection"
            class="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-semibold text-sm transition"
          >
            Clear Selection Tag 2
          </button>
        </div>
      </div>
    </div>

    <!-- Side Panel -->
    <div class="space-y-6">
      <!-- My Device Section -->
      <div
        v-if="myDevice"
        class="p-5 bg-blue-50 border-2 border-blue-300 rounded-xl"
      >
        <h3 class="font-bold text-blue-700 text-center mb-3 text-lg">
          My Device
        </h3>
        <div class="text-center mb-3 text-sm text-gray-700">
          Current equipment:
          <span class="font-semibold">
            {{ myDevice.name || myDevice.type }}
            ({{ myDevice.id }})
          </span>
        </div>
        <div class="flex justify-center gap-2">
          <button
            @click="focusOnMyDevice"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold text-sm transition"
          >
            Focus on My Device
          </button>
        </div>
      </div>

      <!-- Anchors Section -->
      <div class="p-4 bg-gray-50 border border-gray-300 rounded-xl">
        <h3 class="font-bold text-gray-800 mb-3 text-center text-base">
          Anchors (Reference Points)
        </h3>
        <div v-if="anchorDevices.length" class="space-y-2">
          <div
            v-for="anchor in anchorDevices"
            :key="anchor.id"
            class="bg-white border border-gray-200 rounded-lg p-3"
          >
            <div class="flex justify-between items-center">
              <div>
                <div class="font-semibold text-gray-800">
                  {{ anchor.name || "Anchor" }}
                </div>
                <div class="text-xs text-gray-500">{{ anchor.id }}</div>
              </div>
              <span
                class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold"
              >
                Online
              </span>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500 text-sm">
          No anchors found
        </div>
      </div>

      <!-- Tag Devices Section -->
      <div
        v-if="tagDevices.length"
        class="p-4 bg-purple-50 border border-purple-200 rounded-xl"
      >
        <h3 class="font-bold text-purple-800 mb-3 text-center text-base">
          Tag Devices
        </h3>
        <div class="space-y-2">
          <div
            v-for="tag in tagDevices"
            :key="tag.id"
            class="bg-white border border-gray-200 rounded-lg p-3"
            :class="{
              'ring-2 ring-blue-500':
                selectedTag1?.id === tag.id || selectedTag2?.id === tag.id,
            }"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="font-semibold text-gray-800">
                  {{ tag.name || tag.type }}
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  {{ tag.id }}
                  <span v-if="tag.userId && usersById[tag.userId]">
                    ➔ {{ usersById[tag.userId].fullName }}
                  </span>
                </div>
                <div class="text-xs text-gray-600 mt-1">
                  Battery: {{ tag.battery ?? "-" }}% | Position: ({{ tag.x }},
                  {{ tag.y }})
                </div>
              </div>
              <div class="ml-2 flex flex-col gap-1">
                <button
                  @click="selectTagForDistance(tag)"
                  class="text-xs bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded font-semibold"
                >
                  Select
                </button>
                <button
                  v-if="!tag.userId"
                  @click="confirmPairDevice(tag)"
                  class="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded font-semibold"
                >
                  Pair
                </button>
                <button
                  v-else-if="canUnpair(tag)"
                  @click="confirmUnpairDevice(tag)"
                  class="text-xs bg-gray-500 hover:bg-gray-700 text-white px-3 py-1 rounded font-semibold"
                >
                  Unpair
                </button>
                <span
                  v-else
                  class="text-xs bg-gray-300 text-gray-600 px-3 py-1 rounded font-semibold cursor-not-allowed"
                >
                  Paired
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Personnel / Victims Section -->
      <div class="bg-white border border-gray-300 rounded-xl overflow-hidden">
        <!-- Header with Filter -->
        <div class="p-4 border-b border-gray-200">
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-bold text-gray-800 text-base">
              Personnel / Victims
            </h3>
            <select
              v-model="userFilter"
              class="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="all">All Types</option>
              <option value="rescuer">Rescuer</option>
              <option value="user">Victims</option>
            </select>
          </div>
        </div>

        <!-- User List -->
        <div class="divide-y divide-gray-200">
          <div
            v-for="u in filteredUsers"
            :key="u.id"
            class="p-4 hover:bg-gray-50 transition"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="font-semibold text-gray-800 mb-1">
                  {{ u.fullName || "(No Name)" }}
                </div>
                <div class="text-xs text-gray-500 mb-2">
                  {{ getPairedDeviceName(u.id) }}
                </div>
                <div class="flex gap-2 mb-2">
                  <span
                    v-if="u.needHelp"
                    class="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-semibold"
                  >
                    Need Help
                  </span>
                  <span
                    v-if="u.batteryLow"
                    class="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold"
                  >
                    Battery Low
                  </span>
                </div>
                <div class="text-xs text-gray-500">Updated: Just now</div>
              </div>
              <div v-if="isRescuer" class="ml-3 flex gap-2">
                <button
                  @click="showUserDetail(u)"
                  class="px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded font-semibold text-sm transition"
                >
                  Details
                </button>
                <button
                  @click="openTriageModal(u)"
                  class="px-4 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded font-semibold text-sm transition"
                >
                  Note
                </button>
              </div>
            </div>
          </div>

          <div
            v-if="filteredUsers.length === 0"
            class="p-6 text-center text-gray-500 text-sm"
          >
            No users found
          </div>
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

    <!-- Pair Confirmation Modal -->
    <div
      v-if="pairConfirmModal.show"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl p-8 shadow-xl max-w-md w-full">
        <h3 class="font-bold text-blue-700 mb-4 text-lg">Confirm Pairing</h3>
        <p class="text-gray-700 mb-6">
          Do you want to pair device
          <span class="font-semibold">{{
            pairConfirmModal.device?.name || pairConfirmModal.device?.id
          }}</span>
          with your account?
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="pairConfirmModal.show = false"
            class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
          >
            Cancel
          </button>
          <button
            @click="pairDevice"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>

    <!-- Unpair Confirmation Modal -->
    <div
      v-if="unpairConfirmModal.show"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl p-8 shadow-xl max-w-md w-full">
        <h3 class="font-bold text-red-700 mb-4 text-lg">Confirm Unpairing</h3>
        <p class="text-gray-700 mb-6">
          Do you want to unpair device
          <span class="font-semibold">{{
            unpairConfirmModal.device?.name || unpairConfirmModal.device?.id
          }}</span>
          from your account?
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="unpairConfirmModal.show = false"
            class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
          >
            Cancel
          </button>
          <button
            @click="unpairDevice"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold"
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
const currentUserId = ref("");
const router = useRouter();
const userFilter = ref("all");
const isRescuer = ref(false);

// Distance calculation state
const selectedTag1 = ref(null);
const selectedTag2 = ref(null);

// Pan and Zoom state
const panX = ref(0);
const panY = ref(0);
let zoomBehavior = null;

// Pair/Unpair Confirmation Modal state
const pairConfirmModal = ref({ show: false, device: null });
const unpairConfirmModal = ref({ show: false, device: null });

// Filter users based on dropdown selection
const filteredUsers = computed(() => {
  if (userFilter.value === "all") {
    return users.value;
  } else if (userFilter.value === "rescuer") {
    return users.value.filter((u) => u.role === "rescuer");
  } else if (userFilter.value === "user") {
    return users.value.filter((u) => u.role === "user");
  }
  return users.value;
});

// แยก devices ตามประเภท
const myDevice = computed(() => {
  const user = auth.currentUser;
  if (!user) return null;
  return devices.value.find((d) => d.userId === user.uid);
});

const anchorDevices = computed(() =>
  devices.value.filter((d) => d.type === "anchor")
);

const tagDevices = computed(() =>
  devices.value.filter((d) => d.type === "tag")
);

// Calculate distance between two tags (2D: X, Y only)
const calculatedDistance = computed(() => {
  if (!selectedTag1.value || !selectedTag2.value) return 0;
  const dx = selectedTag2.value.x - selectedTag1.value.x;
  const dy = selectedTag2.value.y - selectedTag1.value.y;
  return Math.sqrt(dx * dx + dy * dy);
});

// Select tag for distance calculation
function selectTagForDistance(tag) {
  if (!selectedTag1.value) {
    selectedTag1.value = tag;
  } else if (selectedTag1.value.id === tag.id) {
    selectedTag1.value = null;
  } else if (!selectedTag2.value) {
    selectedTag2.value = tag;
  } else {
    selectedTag1.value = selectedTag2.value;
    selectedTag2.value = tag;
  }
  renderMap();
}

function clearTag2Selection() {
  selectedTag1.value = null;
  selectedTag2.value = null;
  renderMap();
}

// --- Device Pair/Unpair functions
const usersById = computed(() => {
  const map = {};
  users.value.forEach((u) => (map[u.id] = u));
  return map;
});

function confirmPairDevice(device) {
  pairConfirmModal.value = { show: true, device: device };
}

function confirmUnpairDevice(device) {
  unpairConfirmModal.value = { show: true, device: device };
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

function focusOnMyDevice() {
  if (!myDevice.value) return;
  zoomLevel.value = 2;
  panX.value = 0;
  panY.value = 0;
  renderMap();
  alert(`Focused on ${myDevice.value.name || myDevice.value.type}`);
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

function setupZoomBehavior() {
  if (!map.value) {
    console.warn("Map element not ready for zoom behavior");
    return;
  }

  const svg = d3.select(map.value);

  // Create zoom behavior
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
  if (!map.value) {
    console.warn("Map element not ready yet");
    return;
  }

  const svg = d3.select(map.value);
  svg.selectAll("*").remove();

  const width = map.value.clientWidth || 700;
  const height = map.value.clientHeight || 450;
  const centerX = width / 2;
  const centerY = height / 2;
  const scale = zoomLevel.value;
  const gridSize = 50 * scale;

  // Create a group for all map content
  const g = svg
    .append("g")
    .attr("transform", `translate(${panX.value},${panY.value})`);

  // Draw grid
  for (let x = -width; x <= width * 2; x += gridSize) {
    g.append("line")
      .attr("x1", x)
      .attr("y1", -height)
      .attr("x2", x)
      .attr("y2", height * 2)
      .attr("stroke", "#e5e7eb")
      .attr("stroke-width", 1);
  }
  for (let y = -height; y <= height * 2; y += gridSize) {
    g.append("line")
      .attr("x1", -width)
      .attr("y1", y)
      .attr("x2", width * 2)
      .attr("y2", y)
      .attr("stroke", "#e5e7eb")
      .attr("stroke-width", 1);
  }

  // Draw line between selected tags
  if (selectedTag1.value && selectedTag2.value) {
    const x1 = centerX + (selectedTag1.value.x - centerX) * scale;
    const y1 = centerY + (selectedTag1.value.y - centerY) * scale;
    const x2 = centerX + (selectedTag2.value.x - centerX) * scale;
    const y2 = centerY + (selectedTag2.value.y - centerY) * scale;

    g.append("line")
      .attr("x1", x1)
      .attr("y1", y1)
      .attr("x2", x2)
      .attr("y2", y2)
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 3)
      .attr("stroke-dasharray", "5,5");
  }

  // Draw devices
  devices.value.forEach((device) => {
    if (typeof device.x !== "number" || typeof device.y !== "number") return;
    const x = centerX + (device.x - centerX) * scale;
    const y = centerY + (device.y - centerY) * scale;

    const isSelected =
      selectedTag1.value?.id === device.id ||
      selectedTag2.value?.id === device.id;

    const color =
      device.type === "rescuer"
        ? "#10b981"
        : device.type === "tag"
        ? "#8b5cf6"
        : "#ef4444";

    g.append("circle")
      .attr("cx", x)
      .attr("cy", y)
      .attr("r", isSelected ? 18 * scale : 14 * scale)
      .attr("fill", color)
      .attr("stroke", isSelected ? "#3b82f6" : "#fff")
      .attr("stroke-width", isSelected ? 4 : 2)
      .style("cursor", "pointer")
      .on("click", (event) => {
        event.stopPropagation();
        if (device.type === "tag") {
          selectTagForDistance(device);
        }
      });

    g.append("text")
      .attr("x", x)
      .attr("y", y + 5)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", `${11 * scale}px`)
      .attr("font-weight", "bold")
      .style("pointer-events", "none")
      .text(device.name ? device.name[0] : device.type?.[0] ?? "?");
  });

  // Setup zoom behavior after rendering
  if (!zoomBehavior) {
    setupZoomBehavior();
  }
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
.bg-purple-50 {
  background: #faf5ff;
}
.bg-green-50 {
  background: #ecfdf5;
}
.border-blue-200 {
  border-color: #bfdbfe;
}
.border-blue-300 {
  border-color: #93c5fd;
}
.border-purple-200 {
  border-color: #e9d5ff;
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
