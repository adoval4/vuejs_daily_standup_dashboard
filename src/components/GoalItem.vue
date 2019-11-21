<template lang="html">
  <li
    class="goal-item"
  >
    <span
      class="goal-description"
      v-show="!isEditing"
      v-tooltip="days_since"
      v-on:click="onGoalClick"
    >
      &bull; {{ goal.description | first-char-capital }}
    </span>
    <span v-show="isEditing">
      <input
        type="text"
        class="input column-4"
        ref="editionInput"
        placeholder="Edit goal"
        v-model="goal.description"
        v-on:keyup.enter="onGoalDescriptionChange"
        v-on:blur="onGoalDescriptionChange"
      >
    </span>
    <ul v-show="!isEditing" class="navbar goal-navbar ">
      <li>
        <div class="buttons has-addons">
          <a
            class="button is-small"
            v-bind:class="{ 'is-danger': goal.status == 'NOT_DONE' }"
            v-on:click="onNotDoneBtnClick"
          >
            NOT DONE
          </a>
          <a
            class="button is-small"
            v-bind:class="{ 'is-warning': goal.status == 'IN_PROGRESS' }"
            v-on:click="onInProgressBtnClick"
          >
            IN PROGRESS
          </a>
          <a
            class="button is-small"
            v-bind:class="{ 'is-success': goal.status == 'DONE' }"
            v-on:click="onDoneBtnClick"
          >
            DONE
          </a>
          <a
            class="button is-small is-danger is-light"
            v-on:click="onDeleteGoalClick"
          >
            &times;
          </a>
        </div>
      </li>
    </ul>
  </li>
</template>

<script>
import * as moment from 'moment';


export default {
  props: [
    'goal'
  ],
  data() {
    return {
      isEditing: false
    }
  },
  computed: {
    days_since: function() {
      if(!this.goal.date) {
        return 'No date'
      }
      let now = moment();
      let days_passed = now.diff(moment(this.goal.date), 'days');
      if(days_passed == 0) {
        return 'Since today'
      }
      return `Since ${days_passed} ${days_passed > 1 ? 'days' : 'day'} ago`
    }
  },
  methods: {
    onNotDoneBtnClick: function() {
      this.$emit('statusChange', 'NOT_DONE');
    },
    onInProgressBtnClick: function() {
      this.$emit('statusChange', 'IN_PROGRESS');
    },
    onDoneBtnClick: function() {
      this.$emit('statusChange', 'DONE');
    },
    onDeleteGoalClick: function() {
      this.$emit('delete');
    },
    onGoalClick: function() {
      this.isEditing = true;
      console.log(this.$refs['editionInput'])
      setTimeout(() => {
        this.$refs['editionInput'].focus();
      }, 100);
    },
    onGoalDescriptionChange: function(event) {
      this.$emit('descriptionChange', event.target.value);
      this.isEditing = false;
    }
  }
}
</script>

<style lang="scss" scoped>
  span.goal-description {
    cursor: pointer;
  }
</style>

