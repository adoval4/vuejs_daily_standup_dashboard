<template >
  <div class="person-container">
    <div class="person-name">
      {{ person.name }}
      <a
        class="button is-small is-white is-pulled-right"
        v-on:click="$emit('delete')"
      >
        &times;
      </a>
    </div>
    <ul>
      <li
        class="goal-item"
        v-for="(goal, goal_index) in person.goals"
        v-bind:key="goal_index"
      >
        <span v-tooltip="formatGoalDate(goal.date)">
          > {{ goal.description }}
        </span>
        <ul class="navbar goal-navbar">
          <li>
            <div class="buttons has-addons">
              <a
                class="button is-small"
                v-bind:class="{ 'is-danger': goal.status == 'NOT_DONE' }"
                v-on:click="onNotDoneBtnClick(goal_index)"
              >
                NOT DONE
              </a>
              <a
                class="button is-small"
                v-bind:class="{ 'is-warning': goal.status == 'IN_PROGRESS' }"
                v-on:click="onInProgressBtnClick(goal_index)"
              >
                IN PROGRESS
              </a>
              <a
                class="button is-small"
                v-bind:class="{ 'is-success': goal.status == 'DONE' }"
                v-on:click="onDoneBtnClick(goal_index)"
              >
                DONE
              </a>
              <a
                class="button is-small is-danger is-light"
                v-on:click="onDeleteGoalClick(goal_index)"
              >
                &times;
              </a>
            </div>
          </li>
        </ul>
      </li>
    </ul>
    <div class="">
      <input
        type="text"
        class="input"
        placeholder="New goal"
        v-on:keyup.enter="addGoalToPerson($event, person_index)"
      >
    </div>
  </div>
</template>

<script>
import * as moment from 'moment';

import Vue from 'vue'
import VTooltip from 'v-tooltip'

import { copyObj } from '../utils.js'

Vue.use(VTooltip)

export default {
  components: [
    VTooltip
  ],
  props: [
    'key',
    'person'
  ],
  data () {
    return {

    }
  },
  mounted: function() {
  },
  computed: {
  },
  methods: {
    onGoalStatusChange: function(goal_index, btn_status) {
      let person = copyObj(this.person);
      let current_status = person.goals[goal_index].status;
      person.goals[goal_index].status = current_status != btn_status ? btn_status : null;
      this.$emit('change', person);
    },
    onNotDoneBtnClick: function(goal_index) {
      this.onGoalStatusChange(goal_index, "NOT_DONE");
    },
    onInProgressBtnClick: function(goal_index) {
      this.onGoalStatusChange(goal_index, "IN_PROGRESS");
    },
    onDoneBtnClick: function(goal_index) {
      this.onGoalStatusChange(goal_index, "DONE");
    },
    onDeleteGoalClick: function(goal_index) {
      let person = copyObj(this.person);
      person.goals.splice(goal_index, 1);
      this.$emit('change', person);
    },
    addGoalToPerson: function(event) {
      let person = copyObj(this.person);
      person.goals.push({
        description: event.target.value,
        status: null,
        date: moment().format('L')
      });
      event.target.value = '';
      this.$emit('change', person);
    },
    formatGoalDate: function(goal_date) {
      if(!goal_date) {
        return 'No date'
      }
      return moment(goal_date, "L").fromNow();
    }
  }
}
</script>
