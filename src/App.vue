<template >
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'app',
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
