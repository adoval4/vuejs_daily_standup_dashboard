<template >
  <div>
    <nav class="nav has-shadow">
      <div class="container">
        <span class="title">
          Standups
        </span>
      </div>
    </nav>
    <section class="section">
      <div class="container main-container">
        <div class="column is-full">
          <h1 class="title">Meetings:</h1>
        </div>
        <div v-if="meetings" class="columns">
          <div class="column is-full">
            <div
              class="column is-full"
              v-for="(meeting, slugname) in meetings"
              v-bind:key="slugname"
            >
              <a
                v-on:click="goToMeeting(slugname)"
                class="is-size-4"
              >
                &bull; {{ meeting.name }}
              </a>
              <a
                class="is-pulled-right"
                v-on:click="openDeleteMeetingConfirmation(meeting)"
              >
                &times;
              </a>
            </div>
          </div>
        </div>
        <div v-if="!meetings" class="columns">
          <div class="column is-full">
            <p class="column is-full">
              There is no meeting yet
            </p>
          </div>
        </div>
        <div class="columns">
          <div class="column is-full">
            <div class="field">
              <label class="label">+ Add new meeting</label>
              <div class="control">
                <input
                  class="input"
                  placeholder="New meeting name"
                  v-model="new_meeting_name"
                  v-on:keyup.enter="addMeeting"
                >
              </div>
              <p
                class="help"
                v-show="new_meeting_slugname"
              >
                Meeting id: {{ new_meeting_slugname }}
              </p>
              <p
                class="help is-danger"
                v-show="new_meeting_slugname && !new_meeting_slugname_is_available"
              >
                This id is already being used. Choose a different name for your meeting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div
      v-if="this.delete_meeting"
      class="modal"
      v-bind:class="{ 'is-active': this.delete_meeting }"
    >
      <div
        class="modal-background"
        v-on:click="cancelDeleteMeeting"
      ></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Delete {{this.delete_meeting.name}}</p>
          <button class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
          <p>Are you sure of deleting {{this.delete_meeting.name}}? </p>
          <br />
          <p>This will delete of its content.</p>
        </section>
        <footer class="modal-card-foot">
          <button
            class="button"
            v-on:click="deleteMeeting"
          >
            Delete
          </button>
          <button
            class="button is-success"
            v-on:click="cancelDeleteMeeting"
          >
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

// Utilities
import { copyObj } from '../utils.js'


export default {
  data () {
    return {
      meetings: null,
      cookie_storage: new CookieStorage(),
      new_meeting_name: null,
      mounted: false,
      delete_meeting: null
    }
  },
  computed: {
    new_meeting_slugname: function() {
      if(!this.new_meeting_name) { return null }

      return this.new_meeting_name.replace(/\s+/g, '_').toLowerCase();
    },
    new_meeting_slugname_is_available: function() {
      if(!this.new_meeting_slugname) { return false }
      let meeting = this.cookie_storage.getMeeting(this.new_meeting_slugname);
      return meeting == null;
    }
  },
  created: function() {
    this.meetings = this.cookie_storage.getMeetings();
  },
  mounted: function() {
    this.mounted = true;
  },
  methods: {
    goToMeeting: function(meeting_slugname) {
      this.$router.push({
        name: 'meeting',
        params: {
          meeting_slugname
        }
      });
    },
    addMeeting: function() {
      if(!this.new_meeting_slugname_is_available) { return; }

      this.cookie_storage.saveNewMeeting(this.new_meeting_slugname, this.new_meeting_name)
      this.goToMeeting(this.new_meeting_slugname)
    },
    openDeleteMeetingConfirmation: function(meeting) {
      this.delete_meeting = meeting;
    },
    cancelDeleteMeeting: function() {
      this.delete_meeting = null;
    },
    deleteMeeting: function() {
      if(!this.delete_meeting) { return; }
      this.cookie_storage.deleteMeeting(this.delete_meeting.slugname);
      this.meetings = this.cookie_storage.getMeetings();
      this.delete_meeting = null;
    }
  },

}
</script>
