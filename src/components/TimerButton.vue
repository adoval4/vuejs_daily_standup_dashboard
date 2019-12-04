<template >
  <a
    class="button"
    v-bind:class="{
      'is-info': !running,
      'is-warning': (running && !time_is_over),
      'is-danger': (running && time_is_over)
    }"
    v-on:click="onClick"
  >
    {{ title }} {{ time_left_str }}
  </a>
</template>

<script>
export default {
  props: [
    'total_time_ms'
  ],
  data () {
    return {
      time_passed_ms: 0,
      running: false,
      interval_ms: 100,
      title: 'Start'
    }
  },
  mounted: function() {
    setInterval(()=>{
      if(this.running) {
        this.time_passed_ms += this.interval_ms;
      }
    }, this.interval_ms);
  },
  computed: {
    time_left_str: function() {
      const time_left = this.total_time_ms - this.time_passed_ms;
      const sign = time_left >= 0 ? '' : '- ';
      const time_left_abs = Math.abs(time_left);
      const minutes = Math.floor(time_left_abs/60/1000);
      const seconds = Math.floor(time_left_abs/1000) - minutes * 60;

      const minutes_str = minutes >= 10 ? minutes : `0${minutes}`;
      const seconds_str = seconds >= 10 ? seconds : `0${seconds}`;

      return `${sign}${minutes_str}:${seconds_str}`;
    },
    time_is_over: function() {
      return this.total_time_ms - this.time_passed_ms <= 0;
    }
  },
  methods: {
    onClick: function() {
      this.running = !this.running;
      this.title = this.running ? 'Pause' : 'Resume'
    }
  }
}
</script>