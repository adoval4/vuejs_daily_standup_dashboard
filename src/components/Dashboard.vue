<template >
  <div>
    <nav class="nav has-shadow">
      <div class="container">
        <router-link to="/" class="title">
          <span class="logo">&larr; Standup &mdash; </span>{{ meeting.name }} 
        </router-link>
        <span>
          <a
            id="meeting-link-btn"
            v-bind:href="settings.meeting_link"
            target="_blank"
            rel="noopener noreferrer"
            v-show="false"
          >
            Conference link
          </a>
        </span>
        <span class="options is-pulled-right">
          <!-- <a
            class="button is-danger is-light"
            v-on:click="onDeleteDataClick"
          >
            Delete all
          </a> -->
          <a
            class="button is-light"
            v-on:click="onCallBtnClick"
          >
            Call team
          </a>
          <timer-button
            v-bind:total_time_ms="settings.duration_minutes * 60 * 1000"
          />
          <a
            class="button is-success"
            v-on:click="onSendClick"
          >
            <span v-if="!sent">
              Save
            </span>
            <span v-if="sent">
              Saved
            </span>
          </a>
          <a
            class="button is-light"
            v-on:click="onSettingsBtnClick"
          >
            <font-awesome-icon icon="cog" />
          </a>
        </span>
      </div>
    </nav>
    <section class="section">
      <div class="container main-container">
        <div v-if="!data" class="columns">
          <div class="column">
            <div class="">
              <h1>Data as text</h1>
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
          <div class="column is-full">
            <person-to-do-list
              v-for="(person, person_index) in data"
              v-bind:person="person"
              v-bind:key="person_index"
              v-on:change="onPersonChange(person_index, $event)"
              v-on:delete="onPersonDelete(person_index)"
            />
          </div>
        </div>
        <div v-if="data" class="columns">
          <div class="column is-full">
            <div class="field">
              <label class="label">+ Add new person</label>
              <div class="control">
                <input
                  class="input"
                  placeholder="New person's name"
                  v-on:keyup.enter="addPerson"
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
// Services
import CookieStorage from '../services/cookie-storage.js'
import SlackClient from '../services/slack.js';

// Utilities
import { copyObj } from '../utils.js'

// Components
import TimerButton from '../components/TimerButton.vue';
import PersonToDoList from '../components/PersonToDoList.vue';


export default {
  components: {
    TimerButton,
    PersonToDoList
  },
  data () {
    return {
      meeting: null,
      slack_client: null,
      cookie_storage: new CookieStorage(),
      data: [],
      sent: false,
      show_settings: false,
      settings: {
        slack_webhook: null,
        meeting_link: null,
        duration_minutes: null,
      },
      mounted: false,
    }
  },
  created: function() {
    this.meeting = this.cookie_storage.getMeeting(
      this.$route.params.meeting_slugname
    );

    if(this.meeting === null) {
      this.$router.push('/')
    }
  },
  mounted: function() {
    let settings = this.cookie_storage.getSettings(this.meeting.slugname);
    if(settings) {
      this.settings = settings;
    }
    this.show_settings = !this.areSettingsComplete();

    let init_data = this.cookie_storage.getData(this.meeting.slugname);
    if(init_data) {
      this.data = init_data;
    }
    this.mounted = true;
  },
  methods: {
    areSettingsComplete: function() {
      if(!this.settings.slack_webhook) { return false; }
      if(!this.settings.meeting_link) { return false; }
      if(
        !this.settings.duration_minutes ||
        isNaN(this.settings.duration_minutes)
      ) { return false; }

      this.slack_client = new SlackClient(this.settings.slack_webhook);

      return true;
    },
    onSaveSettingsBtnClick: function() {
      const settingsComplete = this.areSettingsComplete();
      if(settingsComplete) {
        this.cookie_storage.saveSettings(this.meeting.slugname, this.settings);
      }
      this.show_settings = !settingsComplete;
    },
    onSettingsBtnClick: function(){
      this.show_settings = true;
    },
    onCloseSettingsModal: function(){
      this.show_settings = !this.areSettingsComplete();
    },
    onCallBtnClick: function() {
      // send alert to channel
      const meeting_a_tag = document.getElementById('meeting-link-btn');
      meeting_a_tag.click();

      this.slack_client.sendMessage(
        `<!channel> ${this.meeting.name} -> ${this.settings.meeting_link}`
      );
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
    onPersonChange: function(person_index, new_person_val) {
      this.$set(this.data, person_index, new_person_val);

      this.cookie_storage.saveData(this.meeting.slugname, this.data);
    },
    onPersonDelete: function(person_index) {
      let data = copyObj(this.data);
      data.splice(person_index, 1);
      this.data = data;

    },
    addPerson:  function(event){
      let data = copyObj(this.data);
      data.push({
        name: event.target.value,
        goals: []
      });
      event.target.value = '';
      this.data = data;

      this.cookie_storage.saveData(this.meeting.slugname, this.data);
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

      this.cookie_storage.saveData(this.meeting.slugname, filtered_data);
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

<style scoped>
  .logo {
    font-family: 'Montserrat Alternates', sans-serif;
  }
</style>