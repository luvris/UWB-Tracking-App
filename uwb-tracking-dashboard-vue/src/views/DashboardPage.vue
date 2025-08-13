<template>
  <div class="dashboard-container">
    <div class="position-overview">
      <h3>Position overview</h3>
      <div
        id="map-area"
        style="
          position: relative;
          width: 100%;
          height: 500px;
          border: 1px solid #ccc;
        "
      >
        <div v-for="tag in tags" :key="tag.id" :style="getTagStyle(tag)">
          {{ tag.id }}
        </div>
      </div>
    </div>
    <div class="equipment-list">
      <h3>Equipment list</h3>
    </div>
    <div v-if="selectedTagDetails" class="modal">
      <div class="modal-content">
        <h4>Victim details: {{ selectedTagDetails.name }}</h4>
        <button @click="selectedTagDetails = null">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import { database } from "@/firebase/firebase";
import { ref, onValue } from "firebase/database";

export default {
  data() {
    return {
      tags: {},
      selectedTagDetails: null,
    };
  },
  created() {
    const tagsRef = ref(database, "tags");
    onValue(tagsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        this.tags = data;
      } else {
        this.tags = {};
      }
    });
  },
  methods: {
    getTagStyle(tag) {
      // สมมติว่าพิกัดถูกทำให้เป็นค่าปกติ (0-1) หรือคุณมีขนาดสูงสุด
      // ปรับลอจิกนี้ให้เข้ากับระบบพิกัดและขนาดแผนที่
      const x = tag.position.x; // เช่น 30.16
      const y = tag.position.y; // เช่น 28.94

      // ขนาดสำหรับแผนที่ 500x500
      const mapWidth = 500;
      const mapHeight = 500;
      const scaledX = (x / 100) * mapWidth;
      const scaledY = (y / 100) * mapHeight;

      return {
        position: "absolute",
        left: `${scaledX}px`,
        top: `${scaledY}px`,
      };
    },
    showVictimDetails(tagId) {
      const victimRef = ref(database, "users/" + tagId);
      onValue(victimRef, (snapshot) => {
        const victimData = snapshot.val();
        this.selectedTagDetails = {
          ...victimData,
          ...this.tags[tagId],
        };
      });
    },
  },
};
</script>
