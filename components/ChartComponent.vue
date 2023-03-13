<template>
  <div>
    <canvas :id="'myChart-' + index"></canvas>
  </div>
</template>

<script>
import moment from "moment";

export default {
  props: {
    data: Array,
    index: Number,
  },
  mounted() {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/chart.js";
    document.head.appendChild(script);

    script.onload = () => {
      const ctx = document.getElementById("myChart-" + this.index);

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: [
            moment(this.data[0].dt).format("hh:mm"),
            moment(this.data[1].dt).format("hh:mm"),
            moment(this.data[2].dt).format("hh:mm"),
            moment(this.data[3].dt).format("hh:mm"),
            moment(this.data[4].dt).format("hh:mm"),
            moment(this.data[5].dt).format("hh:mm"),
            moment(this.data[6].dt).format("hh:mm"),
            moment(this.data[7].dt).format("hh:mm"),
          ],
          datasets: [
            {
              label: "Temperature",
              data: [
                this.data[0].temp,
                this.data[1].temp,
                this.data[2].temp,
                this.data[3].temp,
                this.data[4].temp,
                this.data[5].temp,
                this.data[6].temp,
                this.data[7].temp,
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    };
  },
};
</script>
