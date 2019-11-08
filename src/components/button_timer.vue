<template >
  <a
    href="#"
    class="button"
    v-bind:class="{ is-primary: !running  }"
  >
    Llamar
  </a>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {

    }
  },
}
</script>