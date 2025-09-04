<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header
      class="bg-blue-600 text-white p-8 shadow fixed top-0 left-0 right-0 z-50 flex justify-center items-center h-14"
    >
      <h1 class="text-xl font-bold">UWB Tracking Dashboard</h1>
    </header>

    <main
      class="container mx-auto p-4 mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      <!-- Left Panel: Position Overview -->
      <div class="md:col-span-2 bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Position overview</h2>
        <div
          class="relative w-full h-96 border border-gray-300 rounded-md overflow-hidden"
        >
          <svg
            ref="map"
            width="100%"
            height="100%"
            class="absolute inset-0"
          ></svg>
          <div class="absolute top-2 right-2 space-y-2">
            <button
              @click="zoomIn"
              class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm"
            >
              +
            </button>
            <button
              @click="zoomOut"
              class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm"
            >
              -
            </button>
            <button
              @click="resetZoom"
              class="w-8 h-8 bg-gray-500 text-white rounded-full text-xs"
            >
              Reset
            </button>
          </div>
        </div>

        <div class="mt-6 p-4 bg-gray-50 rounded-lg border">
          <h3 class="font-medium">Distance between Tag</h3>
          <p class="text-sm text-gray-700">
            Tag 1 (My Equipment: Rescue A (T001))<br />
            Tag 2 Mr. Somchai Rakhai (V001)<br />
            <strong>Range : {{ distance }}m</strong><br />
            Current position: X: {{ pos1.x }}m, Y: {{ pos1.y }}m, Z:
            {{ pos1.z }}m
          </p>
          <button
            @click="clearSelection"
            class="ml-2 text-red-600 hover:text-red-800 text-sm"
          >
            Clear Selection Tag 2
          </button>
        </div>
      </div>

      <!-- Right Panel: Equipment List -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Equipment list</h2>

        <div class="mb-6 p-4 border border-blue-200 bg-blue-50 rounded-md">
          <h3 class="font-medium text-blue-800">My device</h3>
          <p class="text-sm text-blue-700">
            Current equipment: Rescue A (T001)
          </p>
          <div class="flex gap-2 mt-2">
            <button class="px-3 py-1 bg-blue-500 text-white text-xs rounded">
              Focus on my device
            </button>
            <button class="px-3 py-1 bg-red-500 text-white text-xs rounded">
              Clear setting
            </button>
          </div>
        </div>

        <div class="mb-6">
          <h3 class="font-medium">Anchors (reference point)</h3>
          <table class="w-full text-sm mt-2">
            <thead>
              <tr class="border-b">
                <th>ID</th>
                <th>NAME</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(anchor, idx) in anchors" :key="idx" class="border-b">
                <td>{{ anchor.id }}</td>
                <td>{{ anchor.name }}</td>
                <td>
                  <span
                    class="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                    >online</span
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h3 class="font-medium">Personnel/registered victims</h3>
          <div class="mt-2">
            <select class="w-full p-1 text-sm border rounded">
              <option>All types</option>
              <option>Help needed</option>
              <option>Time battery level</option>
            </select>
          </div>
          <table class="w-full text-sm mt-2">
            <thead>
              <tr class="border-b">
                <th>ID</th>
                <th>TYPE</th>
                <th>HELP STATUS</th>
                <th>BATT TIME</th>
                <th>LATEST UPDATE</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(victim, idx) in victims" :key="idx" class="border-b">
                <td>{{ victim.id }}</td>
                <td>{{ victim.type }}</td>
                <td>
                  <span
                    class="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded"
                    >Need help</span
                  >
                </td>
                <td>
                  <span
                    class="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded"
                    >Low</span
                  >
                </td>
                <td class="text-xs">Just a moment ago</td>
                <td>
                  <button
                    class="px-2 py-1 bg-green-500 text-white text-xs rounded"
                  >
                    Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref as vueRef, onMounted } from "vue";
import * as d3 from "d3";
import { ref as dbRef, onValue } from "firebase/database";
import { database } from "@/firebase/firebase";

// ข้อมูลจำลอง
const anchors = [
  { id: "A001", name: "Anchor 1" },
  { id: "A002", name: "Anchor 2" },
  { id: "A003", name: "Anchor 3" },
  { id: "A004", name: "Anchor 4" },
];

const victims = [
  { id: "T001", type: "Rescue A" },
  { id: "V001", type: "Mr. Somchai Rakhai" },
  { id: "V002", type: "Victim 2" },
];

// ตัวแปร
const map = vueRef(null);
const zoomLevel = vueRef(1);

const pos1 = vueRef({ x: 0, y: 0, z: 0 });
const distance = vueRef("0.0");

// ฟังก์ชัน Zoom
function zoomIn() {
  zoomLevel.value *= 1.2;
  renderMap();
}

function zoomOut() {
  zoomLevel.value /= 1.2;
  renderMap();
}

function resetZoom() {
  zoomLevel.value = 1;
  renderMap();
}

// ฟังก์ชันวาดแผนผังด้วย D3.js
function renderMap() {
  const svg = d3.select(map.value);
  svg.selectAll("*").remove();

  const centerX = 400;
  const centerY = 300;

  // ใช้ zoomLevel เพื่อขยาย/ย่อ
  const scale = zoomLevel.value;

  // Anchor positions
  const anchorPositions = [
    { x: 100, y: 100 },
    { x: 600, y: 100 },
    { x: 600, y: 400 },
    { x: 100, y: 400 },
  ];

  anchorPositions.forEach((pos) => {
    const scaledX = centerX + (pos.x - centerX) * scale;
    const scaledY = centerY + (pos.y - centerY) * scale;

    svg
      .append("circle")
      .attr("cx", scaledX)
      .attr("cy", scaledY)
      .attr("r", 20 * scale)
      .attr("fill", "#3b82f6")
      .attr("class", "cursor-pointer");

    svg
      .append("text")
      .attr("x", scaledX)
      .attr("y", scaledY - 10)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "12px")
      .text("A");
  });

  // Tag and Victim positions
  const tagPositions = [
    { x: 200, y: 150, type: "T", name: "T001" },
    { x: 220, y: 180, type: "V", name: "V001" },
    { x: 360, y: 110, type: "V", name: "V002" },
    { x: 550, y: 320, type: "V", name: "V003" },
  ];

  tagPositions.forEach((pos) => {
    const scaledX = centerX + (pos.x - centerX) * scale;
    const scaledY = centerY + (pos.y - centerY) * scale;

    const circle = svg
      .append("circle")
      .attr("cx", scaledX)
      .attr("cy", scaledY)
      .attr("r", 15 * scale)
      .attr("fill", pos.type === "T" ? "#10b981" : "#8b5cf6")
      .attr("class", "cursor-pointer");

    if (pos.type === "T") {
      circle.attr("id", "tag-t");
    }

    svg
      .append("text")
      .attr("x", scaledX)
      .attr("y", scaledY - 10)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "12px")
      .text(pos.type);
  });
}

// โหลดข้อมูลจาก Firebase
onMounted(() => {
  const positionsRef = dbRef(database, "positions");
  onValue(positionsRef, (snapshot) => {
    const data = snapshot.val();
    console.log("Positions:", data);
  });

  renderMap();
});
</script>

<style scoped>
.svg-container {
  width: 100%;
  height: 100%;
}
</style>
