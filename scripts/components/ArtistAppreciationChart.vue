<template>
  <div>
    <canvas ref="canvas" width="8" height="5" />
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config.js";
import { format } from "date-fns";
import "chartjs-adapter-date-fns";
const completeConfig = resolveConfig(tailwindConfig).theme;

Chart.defaults.font.family = completeConfig.fontFamily.default;
Chart.defaults.font.size = 14;
Chart.defaults.color = completeConfig.colors.gray.darkest;

export default {
  props: {
    data: { required: true, type: Array },
  },
  mounted() {
    this.renderChart();
  },
  computed: {
    labels() {
      return this.data.map(({ x }) => x);
    },
    values() {
      return this.data.map(({ y }) => y);
    },
    relativeValues() {
      return this.values.map((val, _, self) => val / self[0]);
    },
  },
  methods: {
    formatPercentage(number) {
      return (((number - 1) * 100) << 0) + "%";
    },
    formatMoney(val) {
      const formatter = new Intl.NumberFormat("de-AT", {
        style: "currency",
        currency: "EUR",
      });

      return formatter.format(typeof val === "number" ? val : val.raw);
    },
    renderChart() {
      const ctx = this.$refs.canvas;
      if (!ctx) return;
      const config = {
        type: "line",
        data: {
          labels: this.labels,
          datasets: [
            {
              data: this.relativeValues,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
          },
          elements: {
            line: {
              borderWidth: 1,
            },
            point: {
              borderWidth: 0,
              borderColor: completeConfig.colors.gray.lightest,
              radius: 5,
              hoverBorderWidth: 20,
              hitRadius: 0,
              backgroundColor: (ctx) => {
                const isLast = ctx.dataIndex === this.values.length - 1;
                return isLast
                  ? completeConfig.colors.gray.darkest
                  : completeConfig.colors.gray.solid;
              },
            },
          },
          plugins: {
            tooltip: {
              backgroundColor: "rgba(255,255,255,0.9)",
              displayColors: false,
              bodyColor: completeConfig.colors.gray.darkest,
              titleColor: completeConfig.colors.gray.darkest,
              titleFont: { weight: 500 },
              borderWidth: 1,
              borderColor: completeConfig.colors.gray.light,
              padding: 16,
              callbacks: {
                label: (context) => {
                  const moneyValue = this.values[context.dataIndex];
                  return `${this.formatMoney(
                    moneyValue
                  )} (+${this.formatPercentage(context.raw)})`;
                },
                title: (value) => {
                  const isLastItem =
                    value[0].dataIndex === value[0].dataset.data.length - 1;
                  return isLastItem
                    ? "Current"
                    : format(new Date(value[0].parsed.x), "qqq Y");
                },
              },
            },
            title: {
              padding: { bottom: 32 },
              display: false,
              text: "",
              font: {
                weight: 400,
                size: 16,
              },
              align: "start",
            },
            legend: {
              display: false,
            },
          },
          scale: {},
          scales: {
            x: {
              grid: {
                display: false,
              },
              type: "time",
              time: {
                unit: "year",
              },
            },
            y: {
              title: {
                display: false,
                text: "Return on Art",
                size: 14,
              },
              grid: {
                display: false,
              },

              ticks: {
                callback: this.formatPercentage,
              },
            },
          },
        },
      };
      const chart = new Chart(ctx, config);
    },
  },
};
</script>