<template>
  <ul class="weather__list">
    <li
      class="weather__card"
      v-for="(data, index) in itemsToDisplay"
      :key="index"
    >
      <h3>City: {{ data.city }}</h3>
      <h3>Main: {{ data.weather[0].main }}</h3>
      <h3>Temperature: {{ Math.round(data.data.temp) }} C</h3>
      <h3>Feels Like: {{ Math.round(data.data.feels_like) }} C</h3>

      <button class="favorite_btn" @click="deleteFavorite(index)">
        Remove from Favorite
      </button>

      <div>
        <ChartComponent :data="data.dataFor24h" :index="index" />
      </div>
    </li>
  </ul>
</template>
<script>
import ChartComponent from "~/components/ChartComponent.vue";
export default {
  props: {
    addedBlocks: {
      type: Array,
    },
  },

  components: {
    ChartComponent,
  },

  data() {
    return {
      favoriteBlocks: [],
    };
  },
  mounted() {
    this.favoriteBlocks =
      JSON.parse(localStorage.getItem("favoriteBlocks")) || [];
  },

  computed: {
    itemsToDisplay() {
      return [...this.favoriteBlocks, ...this.addedBlocks];
    },
  },

  methods: {
    deleteFavorite(index) {
      this.addedBlocks.splice(index, 1);
      this.favoriteBlocks.splice(index, 1);
      localStorage.setItem(
        "favoriteBlocks",
        JSON.stringify(this.favoriteBlocks)
      );
    },
  },
};
</script>
