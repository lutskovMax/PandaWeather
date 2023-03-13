<template>
  <div class="weather-app">
    <VueGooglePlaces />
  </div>
</template>

<script>
import VueGooglePlaces from "~/components/VueGooglePlaces.vue";

export default {
  components: {
    VueGooglePlaces,
  },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap");

.weather-app {
  font-family: Roboto;
}
</style>
