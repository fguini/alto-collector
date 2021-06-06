<script>
import { Line, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;

const DEFAULT_OPTIONS = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: false,
        },
        gridLines: {
          display: false,
        },
      },
    ],
    xAxes: [
      {
        gridLines: {
          display: false,
        },
      },
    ],
  },
  legend: {
    display: true,
  },
  responsive: true,
  maintainAspectRatio: false,
  elements: {
    line: {
      cubicInterpolationMode: 'monotone',
    },
  },
  animation: {
    duration: 0,
  },
  hover: {
    animationDuration: 0, // duration of animations when hovering an item
  },
  responsiveAnimationDuration: 0,
};

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ['options', 'height', 'width'],
  mounted() {
    this.renderChart(this.chartData, { ...DEFAULT_OPTIONS, ...this.options });
  },
};
</script>
