<template>
  <div id="footer-body">
    <div class="item-slot en-font">{{ FOOTER_TEXT }}</div>
    <div class="item-slot">
      <a target="blank" href="https://ko-fi.com/sseries">
        <img class="footer-icon" alt="kofi" src="/kofi.png" />
      </a>
      <a target="blank" href="https://github.com/S-Series">
        <img class="footer-icon" alt="github" src="/github.png" />
      </a>
      <a target="blank" href="https://github.com/S-Series">
        <img class="footer-icon" alt="sseries" src="/sseries.png" />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import "@/components/_Layout/Footer.css";
const FOOTER_TEXT = `Contact: SSeries000923@gmail.com\nWuthering Waves and all related assets are © Kuro Games.\nThis website is an unofficial fan project and is not affiliated with Kuro Games.`;
</script>
