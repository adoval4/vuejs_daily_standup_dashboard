<template >
  <div id="app">
    <section class="section">
      <nav class="nav has-shadow">
        <div class="container">
          <span class="title">
            Daily Bot
          </span>
          <a
            class="button"
            v-on:click="onCallBtnClick"
          >
            Llamar
          </a>
          <a

            class="button"
            v-bind:class="{
              'is-info': !running,
              'is-link': (running && !time_is_over),
              'is-danger': (running && time_is_over)
            }"
            v-on:click="onTimerBtnClick"
          >
            {{ time_left_str }}
          </a>
          <a class="button is-success">
            Enviar
          </a>
        </div>
      </nav>
      <div class="container main-container">
        <div class="columns">
          <div class="column">
            <div class="">
              <h1>Ayer</h1>
            </div>
            <div class="field">
              <div class="control">
                <textarea
                  class="textarea is-primary"
                  rows="20"
                  v-model="past_data"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <div class="">
              <h1>Hoy</h1>
            </div>
            <div class="field">
              <div class="control">
                <textarea
                  class="textarea is-primary"
                  rows="20"
                  v-model="today_data"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios';

// const SLACK_CHANNEL_WEBHOOK_URL = "https://hooks.slack.com/services/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";
const SLACK_CHANNEL_WEBHOOK_URL = "https://hooks.slack.com/services/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";
const MEET_LINK = "https://meet.google.com/vmo-yxuk-eok";
const MINUTES = 20;
const INTERVAL_MS = 100;

export default {
  name: 'app',
  data () {
    return {
      current_time_ms: MINUTES*60*1000,
      running: false,
      time_passed_ms: 0,
      past_data: '',
      today_data: ''
    }
  },
  mounted: function() {
    setInterval(()=>{
      if(this.running) {
        this.current_time_ms -= INTERVAL_MS;
      }
    }, INTERVAL_MS);
  },
  computed: {
    time_left_str: function() {
      const sign = this.current_time_ms >= 0 ? '' : '-';
      const time_left = Math.abs(this.current_time_ms)
      const minutes = Math.floor(time_left / 60/1000);
      const seconds = Math.floor(time_left/1000) - minutes * 60;

      const minutes_str = minutes >= 10 ? minutes : `0${minutes}`;
      const seconds_str = seconds >= 10 ? seconds : `0${seconds}`;

      return `${sign}${minutes_str}:${seconds_str}`;
    },
    time_is_over: function() {
      return this.current_time_ms <= 0;
    }
  },
  methods: {
    onTimerBtnClick: function() {
      this.running = !this.running;
    },
    onCallBtnClick: function() {
      axios.post(
        SLACK_CHANNEL_WEBHOOK_URL,
        JSON.stringify({
          text: `<!channel> daily: ${MEET_LINK}`
        })
      )
    }
  }
}
</script>

<style lang="scss">
  @import './scss/main.scss';

  body, #app {
    height: 100%;
    min-height: 100vh;
    color: $app-black;
  }

  .main-container {
    margin-top: 20px;
  }


</style>
