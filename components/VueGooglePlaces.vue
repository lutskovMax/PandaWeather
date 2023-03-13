<template>
  <div class="weather" :class="{ isModalVisible: 'overlay' }">
    <div class="container">
      <div class="weather__body">
        <input
          class="weather__input"
          v-model="location"
          type="text"
          placeholder="Select You`r City"
          ref="origin"
        />
        <button class="weather__btn" @click="fetchWeather()">
          Add Weather Block!
        </button>
      </div>

      <div class="tabs">
        <div class="tabs__header">
          <div
            class="tabs__tab"
            :class="{ active: activeTab === 'weatherList' }"
            @click="changeTab('weatherList')"
          >
            Weather List
          </div>
          <div
            class="tabs__tab"
            :class="{ active: activeTab === 'favoriteBlocks' }"
            @click="changeTab('favoriteBlocks')"
          >
            Favorite Blocks
          </div>
        </div>
        <div class="tabs__content">
          <div v-show="activeTab === 'weatherList'" class="weather__list">
            <li
              class="weather__card"
              v-for="(data, index) in weatherData"
              :key="index"
              :class="{
                favorite: addedBlocks.includes(data),
              }"
            >
              <h3>City: {{ data.city }}</h3>
              <h3>Main: {{ data.weather[0].main }}</h3>
              <h3>Temperature: {{ Math.round(data.data.temp) }} C</h3>
              <h3>Feels Like: {{ Math.round(data.data.feels_like) }} C</h3>

              <button
                v-if="!addedBlocks.includes(data)"
                @click="addToFavorite(data)"
                class="weather__card_favorite favorite_btn"
              >
                Add to Favorite
              </button>

              <div>
                <ChartComponent :data="data.dataFor24h" :index="index" />
              </div>
              <div class="close" @click="deleteCard(index)">
                <span class="vertical"></span>
                <span class="horizontal"></span>
              </div>
            </li>
          </div>

          <div v-show="activeTab === 'favoriteBlocks'" class="favorite-blocks">
            <FavoriteBlocks :added-blocks="addedBlocks" />
          </div>
        </div>
      </div>

      <ModalForManyBlock
        class="weather__modal"
        v-if="isModalVisible"
        @close="isModalVisible = false"
      />

      <ModalForDeleteCard
        class="weather__modal"
        v-if="isDeleteModalVisible"
        @close="isDeleteModalVisible = false"
        @confirmDelete="deleteCardConfirmed"
      />

      <ModalForManyFavorits
        class="weather__modal"
        v-if="isFavoriteModalVisible"
        @close="isFavoriteModalVisible = false"
      />

      <ModalForSameBlock
        class="weather__modal"
        v-if="isSameBlockModalVisible"
        @close="isSameBlockModalVisible = false"
      />
    </div>
  </div>
</template>

<script>
import getWeather from "~/store/apiWeather.js";
import ChartComponent from "~/components/ChartComponent.vue";
import ModalForManyBlock from "./modalForManyBlock.vue";
import FavoriteBlocks from "../components/FavoriteBlocks.vue";
import ModalForDeleteCard from "./modalForDeleteCard.vue";
import ModalForManyFavorits from "./modalForManyFavorits.vue";
import ModalForSameBlock from "./modalForSameBlock.vue";

export default {
  components: {
    ChartComponent,
    ModalForManyBlock,
    FavoriteBlocks,
    ModalForDeleteCard,
    ModalForManyFavorits,
    ModalForSameBlock,
  },
  data() {
    return {
      isModalVisible: false,
      isDeleteModalVisible: false,
      isFavoriteModalVisible: false,
      isConfirmDelete: false,
      isSameBlockModalVisible: false,
      addedBlocks: [],
      location: "",
      latitude: "",
      longitude: "",
      weatherData: [],
      activeTab: "weatherList", // Додана змінна для активної вкладки
      options: {
        types: ["(cities)"],
        fields: ["address_components", "geometry"],
      },
    };
  },

  mounted() {
    const autocomplete = new google.maps.places.Autocomplete(
      this.$refs["origin"],
      this.options
    );
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      this.latitude = place.geometry.location.lat();
      this.longitude = place.geometry.location.lng();
      for (let component of place.address_components) {
        if (component.types.includes("locality")) {
          this.location = component.long_name;
          break;
        }
      }
    });
  },

  methods: {
    async fetchWeather() {
      this.isModalVisible = false;

      if (this.weatherData?.length >= 5) {
        this.isModalVisible = true;
        return;
      }

      if (this.addedBlocks.some((block) => block.city === this.location)) {
        this.isSameBlockModalVisible = true;
        return;
      }

      try {
        const weatherData = await getWeather(this.latitude, this.longitude);
        const timestamp = new Date().getTime();
        const dataFor24h = weatherData.list.slice(0, 8).map((item) => {
          return {
            temp: item.main.temp,
            dt: item.dt_txt,
          };
        });

        this.weatherData.push({
          timestamp: timestamp,
          data: weatherData.list[0].main,
          weather: weatherData.list[0].weather,
          city: weatherData.city.name,
          dataFor24h: dataFor24h,
        });
        this.location = "";
        this.latitude = "";
        this.longitude = "";
      } catch (error) {
        console.error(error);
      }
    },

    changeTab(tabName) {
      this.activeTab = tabName;
    },

    addToFavorite(data) {
      const favoriteBlocks =
        JSON.parse(localStorage.getItem("favoriteBlocks")) || [];
      if (favoriteBlocks.length >= 5) {
        this.isFavoriteModalVisible = true;
        return;
      }

      favoriteBlocks.push(data);
      localStorage.setItem("favoriteBlocks", JSON.stringify(favoriteBlocks));
      this.addedBlocks.push(data);
    },
    deleteCard(index) {
      this.isDeleteModalVisible = true;
      this.currentIndex = index;
    },

    deleteCardConfirmed() {
      this.weatherData.splice(this.currentIndex, 1);
      this.isDeleteModalVisible = false;
    },
  },
};
</script>

<style lang="scss">
.weather {
  &__body {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 40px;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  &__modal {
    width: 50%;
    margin: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }

  h3 {
    font-weight: 500;
  }

  &__card {
    position: relative;
    width: 240px;
    height: 355px;
    background: linear-gradient(
      180deg,
      #d6eef3 0%,
      rgba(172, 190, 193, 0) 176.61%
    );
    border-radius: 8px;
    font-weight: 400;
    padding: 16px;
    color: #181e52;
  }

  &__list {
    display: flex;
    gap: 15px;
    padding: 0;
    flex-wrap: wrap;

    @media (max-width: 800px) {
      justify-content: center;
    }

    li {
      list-style: none;
    }

    .favorite {
      border: 2px solid gold;
    }
  }

  &__input {
    display: block;
    width: 360px;
    font-size: 16px;
    padding: 10px;
    border: 2px solid #000;
    border-radius: 7px;

    @media (max-width: 560px) {
      width: auto;
    }
  }

  &__btn {
    cursor: pointer;
    display: inline-block;
    max-width: 360px;
    font-size: 16px;
    background: linear-gradient(
      180deg,
      #d6eef3 0%,
      rgba(172, 190, 193, 0) 176.61%
    );
    border: none;
    border-radius: 5px;
    color: #000;
    padding: 20px 60px;

    @media (max-width: 560px) {
      width: auto;
      max-width: 100%;
    }
  }

  .close {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: 0.2s;
    transform: rotate(45deg);

    &:hover {
      transform: rotate(180deg);
    }

    .horizontal {
      display: block;
      width: 20px;
      height: 2px;
      background: #000;
    }

    .vertical {
      display: block;
      height: 20px;
      width: 2px;
      background: #000;
      transform: translateX(11px);
    }
  }

  .favorite_btn {
    background: none;
    border: 1px solid #000;
    border-radius: 5px;
    padding: 10px;
    cursor: pointer;
  }

  .tabs {
    &__header {
      display: flex;
      gap: 20px;
      font-size: 22px;
    }

    &__content {
      margin-top: 15px;
    }

    &__tab {
      cursor: pointer;
    }

    &__tab.active {
      border-bottom: 2px solid #e96e50;
    }
  }

  .container {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 10px;
  }
}
</style>
