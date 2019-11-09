<template >
  <div id="app">
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
        <a class="button is-success" v-on:click="onSendClick">
          Enviar
        </a>
      </div>
    </nav>
    <section class="section">
      <div class="container main-container">
        <div class="columns">
          <div class="column">
            <div class="">
              <h1>Ayer</h1>
            </div>
            <div class="field">
              <div class="control">
                <textarea
                  id="past-data-textarea"
                  class="textarea is-primary"
                  rows="2"
                  v-model="init_data"
                  v-on:change="loadData"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        <div v-if="data" class="columns">
          <div class="column">
            <div
              class="person-container"
              v-for="(person, person_index) in data"
              v-bind:key="person_index"
            >
              <div class="person-name">
                {{ person.name }}
              </div>
              <ul>
                <li
                  class="goal-item"
                  v-for="(goal, goal_index) in person.goals"
                  v-bind:key="goal_index"
                >
                  <span>
                    - {{ goal.description }}
                  </span>
                  <ul class="navbar goal-navbar">
                    <li>
                      <a
                        class="button is-small"
                        v-bind:class="{ 'is-danger': goal.status == 'NOT_DONE' }"
                        v-on:click="onNotDoneBtnClick(person_index, goal_index)"
                      >
                        NOT DONE
                      </a>
                      <a
                        class="button is-small"
                        v-bind:class="{ 'is-warning': goal.status == 'IN_PROGRESS' }"
                        v-on:click="onInProgressBtnClick(person_index, goal_index)"
                      >
                        IN PROGRESS
                      </a>
                      <a
                        class="button is-small"
                        v-bind:class="{ 'is-success': goal.status == 'DONE' }"
                        v-on:click="onDoneBtnClick(person_index, goal_index)"
                      >
                        DONE
                      </a>
                      <a
                        class="button is-small is-danger is-light"
                        v-on:click="onDeleteGoalClick(person_index, goal_index)"
                      >
                        Borrar
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
              <div class="">
                <input
                  type="text"
                  class="input"
                  placeholder="Nueva meta"
                  v-on:keyup.enter="addGoalToPerson($event, person_index)"
                >
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

function copyObj(obj) {
  return JSON.parse(
    JSON.stringify(obj)
  )
}

const SLACK_CHANNEL_WEBHOOK_URL = "https://hooks.slack.com/services/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"; //adolfovaldi
// const SLACK_CHANNEL_WEBHOOK_URL = "https://hooks.slack.com/services/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"; //daily channel
const MEET_LINK = "https://meet.google.com/vmo-yxuk-eok";
const MINUTES = 20;
const INTERVAL_MS = 100;

const INIT_DATA = `@Pedro
- comparación de floracion para chapi
- evaluar floración vs data manual
- get up to speed with berend

@Waldo
- evaluar metrics en producción
- especificaciones para consolidación de datos de formularios a records

@Daniel
- alerts admin panel markup
- alerts admin panel list
- alerts admin panel create
- alerts admin panel add/remove recipient

@Berend
- get Pedro up to speed
- specifications for harvester leaderboard

@Adolfo
- revisar propuesta de integración de formularios a records
- small fixes in variables admin panel
- week review/ next goals
- setup meeting to review admin panel variable with hortifrut
- test alert email
- 1 on 1 waldo
- 1 on 1 pedro
- new metrics to production
`;

export default {
  name: 'app',
  data () {
    return {
      current_time_ms: MINUTES*60*1000,
      running: false,
      time_passed_ms: 0,
      init_data: '',
      data: null
    }
  },
  mounted: function() {
    setInterval(()=>{
      if(this.running) {
        this.current_time_ms -= INTERVAL_MS;
      }
    }, INTERVAL_MS);

    setTimeout(()=>{
      this.past_data = INIT_DATA;
    }, 1000)
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
      // send alert to channel
      axios.post(
        SLACK_CHANNEL_WEBHOOK_URL,
        JSON.stringify({
          text: `<!channel> Daily -> ${MEET_LINK}`
        })
      )
    },
    autosize: function(event) {
      var el = event.target;
      this.autoresize_textarea(el);
    },
    autoresize_textarea: function(el) {
      setTimeout(function(){
        el.style.cssText = 'height:auto; padding:0';
        el.style.cssText = 'height:' + 1.1*el.scrollHeight + 'px';
      },0);
    },
    loadData: function() {
      const past_data = this.past_data;
      const lines = past_data.split('\n');
      let parsed_obj = [];
      lines.map((line) => {
        let first_char = line[0];
        let line_text = line.substring(1);
        if(first_char != "@" && first_char != "-") {
          return;
        }
        else if(first_char == "@") {
          parsed_obj.push({
            name: line_text,
            goals: []
          })
        }
        else if(first_char == "-") {
          let status = null;
          let goal_description = line_text;
          if(line_text.indexOf('[') >= 0 && line_text.indexOf(']') >= 0) {
            status = line_text.substring(
              line_text.indexOf('[')+1,
              line_text.indexOf(']')
            )
          }
          if(status) {
            goal_description = line_text.substring(0, line_text.indexOf('['))
          }
          parsed_obj[parsed_obj.length-1].goals.push({
            description: goal_description,
            status: status
          })
        }
      });
      this.data = parsed_obj;
    },
    onNotDoneBtnClick: function(person_index, goal_index) {
      let data = copyObj(this.data);
      data[person_index].goals[goal_index].status = "NOT_DONE";
      this.data = data;
    },
    onInProgressBtnClick: function(person_index, goal_index) {
      let data = copyObj(this.data);
      data[person_index].goals[goal_index].status = "IN_PROGRESS";
      this.data = data;
    },
    onDoneBtnClick: function(person_index, goal_index) {
      let data = copyObj(this.data);
      data[person_index].goals[goal_index].status = "DONE";
      this.data = data;
    },
    addGoalToPerson: function(event, person_index) {
      let data = copyObj(this.data);
      data[person_index].goals.push({
        description: event.target.value,
        status: null
      });
      event.target.value = '';
      this.data = data;
    },
    onDeleteGoalClick: function(person_index, goal_index) {
      let data = copyObj(this.data);
      data[person_index].goals.splice(goal_index, 1);
      this.data = data;
    },
    onSendClick: function() {
      let data = copyObj(this.data);
      let to_do_message = ``;
      data.map((person, index) => {
        if(index > 0){ to_do_message += '\n' }
        to_do_message += `@${person.name}\n`
        person.goals.map((goal) => {
          const to_do = goal.status != 'DONE';
          if(to_do) {
            to_do_message += `- ${goal.description}\n`
          }
        })
      });

      axios.post(
        SLACK_CHANNEL_WEBHOOK_URL,
        JSON.stringify({
          text: to_do_message
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

  textarea {
    overflow: hidden;
    resize: none;
  }

  .main-container {
    margin-top: 50px;
  }

  nav.nav.has-shadow {
      padding: 20px;
      position: fixed;
      z-index: 100;
      background: white;
      width: 100%;
  }

  .person-container {
    margin-bottom: 35px;

    .person-name {
      font-size: 1.5em;
      font-weight: bold;
    }

    li.goal-item {
        margin-bottom: 10px;
    }

    ul.navbar.goal-navbar {
      margin-top: 0px;
      margin-left: 10px;
      display: inline-block;
      min-height: auto;
    }
  }

</style>
