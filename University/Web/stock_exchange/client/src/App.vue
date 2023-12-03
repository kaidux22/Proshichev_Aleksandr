<template>
  <div>
    <TheHeader/>
    <RouterView></RouterView>
  </div>
</template>

<script>
import TheHeader from '@/components/TheHeader.vue'
export default {
  name: 'App',
  components: {
    TheHeader
  }
}
</script>

<style>
  @font-face {
    font-family: "JejuHallasan";
    src: url("https://db.onlinewebfonts.com/t/2da952d097bffd198ec0f0aa3fdd6804.eot");
    src: url("https://db.onlinewebfonts.com/t/2da952d097bffd198ec0f0aa3fdd6804.eot?#iefix")format("embedded-opentype"),
    url("https://db.onlinewebfonts.com/t/2da952d097bffd198ec0f0aa3fdd6804.woff2")format("woff2"),
    url("https://db.onlinewebfonts.com/t/2da952d097bffd198ec0f0aa3fdd6804.woff")format("woff"),
    url("https://db.onlinewebfonts.com/t/2da952d097bffd198ec0f0aa3fdd6804.ttf")format("truetype"),
    url("https://db.onlinewebfonts.com/t/2da952d097bffd198ec0f0aa3fdd6804.svg#JejuHallasan")format("svg");
}

body{
    width: 1850px;
    height: 1080px;
    background: #fff;
    margin: 0;
    overflow-x: hidden;
}
</style>
