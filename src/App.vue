<template >
  <div id="app">
    <nav class="nav has-shadow">
      <div class="container">
        <span class="title">
          Daily Bot
        </span>
        <span>
          <a
            v-bind:href="settings.meeting_link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Conference link
          </a>
        </span>
        <span class="options">
          <a
            class="button is-light"
            v-on:click="onSettingsBtnClick"
          >
            <font-awesome-icon icon="cog" />
          </a>
          <a
            class="button is-danger is-light"
            v-on:click="onDeleteDataClick"
          >
            Borrar todo
          </a>
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
          <a
            class="button is-success"
            v-on:click="onSendClick"
          >
            <span v-if="!sent">
              Enviar
            </span>
            <span v-if="sent">
              Enviado
            </span>
          </a>
        </span>
      </div>
    </nav>
    <section class="section">
      <div class="container main-container">
        <div v-if="!data" class="columns">
          <div class="column">
            <div class="">
              <h1>Data como texto</h1>
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
                        &times;
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

    <div
      class="modal"
      v-bind:class="{'is-active': show_settings}"
    >
      <div class="modal-background" v-on:click="onCloseSettingsModal"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Settings</p>
          <button class="delete" aria-label="close" v-on:click="onCloseSettingsModal">
          </button>
        </header>
        <section class="modal-card-body">
          <form class="form">
            <div class="field">
              <label class="label">Slack channel incoming webhook</label>
              <div class="control">
                <input
                  class="input"
                  v-bind:class="{ 'is-danger': !settings.slack_webhook }"
                  type="text"
                  placeholder="Copy Slack channel webhook"
                  v-model="settings.slack_webhook"
                >
              </div>
              <p class="help">
                A slack incoming webhook allow you to send messages to a specific converstion.
                <a href="https://api.slack.com/messaging/webhooks">See more</a>
              </p>
            </div>
            <div class="field">
              <label class="label">Conference link</label>
              <div class="control">
                <input
                  class="input"
                  v-bind:class="{ 'is-danger': !settings.meeting_link }"
                  type="text"
                  placeholder="Copy conference link"
                  v-model="settings.meeting_link"
                >
              </div>
              <p class="help">The link where the video conference will be held.</p>
            </div>
            <div class="field">
              <label class="label">Duration in minutes</label>
              <div class="control">
                <input
                  class="input"
                  v-bind:class="{ 'is-danger': !settings.duration_minutes }"
                  type="number"
                  placeholder="Total minutes the meeting should last"
                  v-model="settings.duration_minutes"
                >
              </div>
              <p class="help">The link where the video conference will be held.</p>
            </div>
          </form>
        </section>
        <footer class="modal-card-foot">
          <button
            class="button is-success"
            v-on:click="onSaveSettingsBtnClick"
          >
            Save
          </button>
          <button class="button" v-on:click="onCloseSettingsModal">
            Cancel
          </button>
        </footer>
      </div>
    </div>

  </div>
</template>

<script>
import CookieStorage from './services/cookie-storage.js'
import SlackClient from './services/slack.js';

function copyObj(obj) {
  return JSON.parse(
    JSON.stringify(obj)
  )
}

const INTERVAL_MS = 100;

export default {
  name: 'app',
  data () {
    return {
      slack_client: null,
      cookie_storage: new CookieStorage(),
      current_time_ms: null,
      running: false,
      time_passed_ms: 0,
      init_data: '',
      data: null,
      sent: false,
      show_settings: false,
      settings: {
        slack_webhook: null,
        meeting_link: null,
        duration_minutes: null,
      }
    }
  },
  mounted: function() {
    setInterval(()=>{
      if(this.running) {
        this.current_time_ms -= INTERVAL_MS;
      }
    }, INTERVAL_MS);

    let settings = this.cookie_storage.getSettings();
    if(settings) {
      this.settings = settings;
    }
    this.show_settings = !this.areSettingsComplete();

    let init_data = this.cookie_storage.getData();
    if(init_data) {
      this.data = init_data;
    }
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
    areSettingsComplete: function() {
      if(!this.settings.slack_webhook) { return false; }
      if(!this.settings.meeting_link) { return false; }
      if(
        !this.settings.duration_minutes ||
        isNaN(this.settings.duration_minutes)
      ) { return false; }

      this.current_time_ms = this.settings.duration_minutes * 60 * 1000;
      this.slack_client = new SlackClient(this.settings.slack_webhook);

      return true;
    },
    onSaveSettingsBtnClick: function() {
      const settingsComplete = this.areSettingsComplete();
      if(settingsComplete) {
        this.cookie_storage.saveSettings(this.settings);
      }
      this.show_settings = !settingsComplete;
    },
    onSettingsBtnClick: function(){
      this.show_settings = true;
    },
    onCloseSettingsModal: function(){
      this.show_settings = !this.areSettingsComplete();
    },
    onTimerBtnClick: function() {
      this.running = !this.running;
    },
    onCallBtnClick: function() {
      // send alert to channel
      this.slack_client.sendMessage(
        `<!channel> Daily -> ${this.settings.meeting_link}`
      );
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
      const past_data = copyObj(this.init_data);
      console.log(past_data);
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
      console.log(parsed_obj);
      this.data = parsed_obj;
    },
    onNotDoneBtnClick: function(person_index, goal_index) {
      let data = copyObj(this.data);
      if(data[person_index].goals[goal_index].status != "NOT_DONE") {
        data[person_index].goals[goal_index].status = "NOT_DONE";
      } else {
        data[person_index].goals[goal_index].status = null;
      }
      this.data = data;
    },
    onInProgressBtnClick: function(person_index, goal_index) {
      let data = copyObj(this.data);
      if(data[person_index].goals[goal_index].status != "IN_PROGRESS") {
        data[person_index].goals[goal_index].status = "IN_PROGRESS";
      } else {
        data[person_index].goals[goal_index].status = null;
      }
      this.data = data;
    },
    onDoneBtnClick: function(person_index, goal_index) {
      let data = copyObj(this.data);
      if(data[person_index].goals[goal_index].status != "DONE") {
        data[person_index].goals[goal_index].status = "DONE";
      } else {
        data[person_index].goals[goal_index].status = null;
      }
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
      let filtered_data = data.map((person, index) => {
        if(index > 0){ to_do_message += '\n' }
        to_do_message += `@${person.name}\n`
        let new_goals = person.goals.filter((goal) => {
          const to_do = goal.status != 'DONE';
          if(to_do) {
            to_do_message += `- ${goal.description}\n`
          }
          return to_do;
        })
        person.goals = new_goals;
        return person;
      });

      this.cookie_storage.saveData(filtered_data);
      this.data = filtered_data;

      this.slack_client.sendMessage(to_do_message);
      this.sent = true;
    },
    onDeleteDataClick: function() {
      this.data = null;
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
    padding: 15px 20px;
    position: fixed;
    z-index: 2;
    background: white;
    width: 100%;
    box-shadow: 0px 0px 8px #0000005c;

    .options {
      float: right;
    }
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
      z-index: 0;
    }
  }

</style>
