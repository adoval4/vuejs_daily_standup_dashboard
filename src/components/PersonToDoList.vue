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
      <goal-item
        v-for="(goal, goal_index) in person.goals"
        v-bind:key="goal_index"
        v-bind:goal="goal"
        v-on:statusChange="onGoalStatusChange(goal_index, $event)"
        v-on:descriptionChange="onGoalDescriptionChange(goal_index, $event)"
        v-on:delete="onDeleteGoalClick(goal_index)"
      />
    </ul>
    <div class="">
      <input
        type="text"
        class="input"
        v-bind:placeholder="`New goal for ${person.name}`"
        v-on:keyup.enter="addGoalToPerson($event)"
      >
    </div>
  </div>
</template>

<script>
import * as moment from 'moment';

import GoalItem from './GoalItem.vue';

import Vue from 'vue'
import VTooltip from 'v-tooltip'

import { copyObj } from '../utils.js'

Vue.use(VTooltip)

export default {
  components: {
    GoalItem
  },
  props: [
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
    onGoalDescriptionChange: function(goal_index, new_description) {
      let person = copyObj(this.person);
      person.goals[goal_index].description = new_description;
      this.$emit('change', person);      
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
        date: moment().format('YYYY-MM-DD')
      });
      event.target.value = '';
      this.$emit('change', person);
    },
  }
}
</script>
