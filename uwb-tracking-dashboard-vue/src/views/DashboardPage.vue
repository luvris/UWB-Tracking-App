<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header
      class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg sticky top-0 z-50"
    >
      <div
        class="container mx-auto px-4 py-4 flex justify-between items-center"
      >
        <div class="flex items-center space-x-3">
          <h1 class="text-xl font-extrabold tracking-wide">
            UWB Tracking Dashboard
          </h1>
        </div>
        <div class="flex items-center space-x-3">
          <span class="text-sm opacity-90">Time : {{ lastUpdate }}</span>
          <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        <button
          @click="handleLogout"
          class="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs rounded-md transition shadow-sm"
          title="Logout"
        >
          Logout
        </button>
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

            <!-- Zoom Controls -->
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

          <!-- Distance Info -->
          <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 class="font-semibold text-blue-800 mb-2">
              Distance Between Tags
            </h3>
            <p class="text-sm text-gray-700">
              <span class="font-medium">Tag 1:</span> Rescue A (T001)<br />
              <span class="font-medium">Tag 2:</span> Mr. Somchai Rakhai
              (V001)<br />
              <span class="font-bold text-lg text-blue-700"
                >Range: {{ distance }} m</span
              ><br />
              <span class="text-xs text-gray-500"
                >Current position: X: {{ pos1.x }}m, Y: {{ pos1.y }}m, Z:
                {{ pos1.z }}m</span
              >
            </p>
            <button
              @click="clearSelection"
              class="mt-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition"
            >
              Clear Selection Tag 2
            </button>
          </div>
        </div>
      </div>

      <!-- Equipment Panel -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-800">Equipment List</h2>
        </div>

        <div class="p-6 space-y-6">
          <!-- My Device -->
          <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 class="font-semibold text-blue-800 mb-2">My Device</h3>
            <p class="text-sm text-blue-700 mb-3">
              Current equipment: Rescue A (T001)
            </p>
            <div class="flex flex-wrap gap-2">
              <button
                class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition"
              >
                Focus on My Device
              </button>
              <button
                class="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded-md transition"
              >
                Clear Settings
              </button>
            </div>
          </div>

          <!-- Anchors -->
          <div>
            <h3 class="font-semibold text-gray-800 mb-3">
              Anchors (Reference Points)
            </h3>
            <div class="space-y-2">
              <div
                v-for="(anchor, idx) in anchors"
                :key="idx"
                class="flex items-center justify-between p-3 border border-gray-200 rounded-md"
              >
                <div>
                  <div class="font-medium">{{ anchor.name }}</div>
                  <div class="text-xs text-gray-500">{{ anchor.id }}</div>
                </div>
                <span
                  class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                  >Online</span
                >
              </div>
            </div>
          </div>

          <!-- Personnel -->
          <div>
            <div class="flex justify-between items-center mb-3">
              <h3 class="font-semibold text-gray-800">Personnel / Victims</h3>
              <select class="text-xs border border-gray-300 rounded px-2 py-1">
                <option>All Types</option>
                <option>Help Needed</option>
                <option>Battery Low</option>
              </select>
            </div>

            <div class="space-y-2">
              <div
                v-for="(victim, idx) in victims"
                :key="idx"
                class="border border-gray-200 rounded-md p-3 hover:shadow-sm transition"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <div class="font-medium">{{ victim.name }}</div>
                    <div class="text-xs text-gray-500">{{ victim.id }}</div>
                  </div>
                  <button
                    class="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                  >
                    Details
                  </button>
                </div>
                <div class="mt-2 flex flex-wrap gap-1">
                  <span
                    class="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded"
                    >Need Help</span
                  >
                  <span
                    class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded"
                    >Battery Low</span
                  >
                </div>
                <div class="mt-2 text-xs text-gray-500">Updated: Just now</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
/* eslint-disable */
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import * as d3 from "d3";
import { database } from "@/firebase/firebase";
import { auth } from "@/firebase/firebase";
import { signOut } from "firebase/auth";

// ข้อมูลจำลอง
const anchors = [
  { id: "A001", name: "Anchor 1" },
  { id: "A002", name: "Anchor 2" },
  { id: "A003", name: "Anchor 3" },
];

const victims = [
  { id: "T001", name: "Rescue A" },
  { id: "V001", name: "Mr. Somchai Rakhai" },
  { id: "V002", name: "Victim 2" },
];

// Reactive refs
const map = ref(null);
const zoomLevel = ref(1);
const pos1 = ref({ x: 2.1, y: 1.8, z: 0.0 });
const distance = ref("3.25");
const lastUpdate = ref("Loading...");

const router = useRouter();

// D3 Map Rendering
function renderMap() {
  const svg = d3.select(map.value);
  svg.selectAll("*").remove();
// ใช้ zoomLevel เพื่อขยาย/ย่อ
  const width = map.value.clientWidth;
  const height = map.value.clientHeight;
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

  const anchorPositions = [
    { x: 100, y: 100, id: "A001" },
    { x: width - 100, y: 100, id: "A002" },
    { x: width - 100, y: height - 100, id: "A003" },
  ];

  anchorPositions.forEach((a) => {
    const x = centerX + (a.x - centerX) * scale;
    const y = centerY + (a.y - centerY) * scale;
    svg
      .append("circle")
      .attr("cx", x)
      .attr("cy", y)
      .attr("r", 18 * scale)
      .attr("fill", "#3b82f6")
      .attr("stroke", "#1d4ed8")
      .attr("stroke-width", 2);

    svg
      .append("text")
      .attr("x", x)
      .attr("y", y + 5)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", `${12 * scale}px`)
      .attr("font-weight", "bold")
      .text("A");
  });

  const tags = [
    { x: 250, y: 200, type: "T", id: "T001", name: "Rescue A" },
    { x: 320, y: 280, type: "V", id: "V001", name: "Somchai" },
  ];

  tags.forEach((t) => {
    const x = centerX + (t.x - centerX) * scale;
    const y = centerY + (t.y - centerY) * scale;
    const color = t.type === "T" ? "#10b981" : "#8b5cf6";

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
      .text(t.type);
  });
}

// Zoom functions
function zoomIn() {
  zoomLevel.value = Math.min(zoomLevel.value * 1.3, 3);
  renderMap();
}
function zoomOut() {
  zoomLevel.value = Math.max(zoomLevel.value / 1.3, 0.5);
  renderMap();
}
function resetZoom() {
  zoomLevel.value = 1;
  renderMap();
}

// Logout
async function handleLogout() {
  try {
    // Check user loged in?
    if (!auth.currentUser) {
      console.warn("No user is currently signed in.");
      await router.push("/login");
      return;
    }

    await signOut(auth);
    console.log("✅ User signed out successfully");
    await router.push("/login");
  } catch (error) {
    console.error("❌ Logout error:", error);
    alert(`Logout failed: ${error.message || "Unknown error"}`);
  }
}

function clearSelection() {
  console.log("Clearing selection...");
}

let unSelected = null;
onMounted(() => {
  renderMap();
  lastUpdate.value = new Date().toLocaleTimeString();
});

onUnmounted(() => {
  if (unSelected) unSelected();
});
</script>

<style scoped>
button {
  transition: all 0.2s ease;
}
</style>
