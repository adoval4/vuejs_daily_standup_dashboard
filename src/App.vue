<template >
  <div id="app" class="register-ctn columns is-vcentered">
    <div class="column">
      <img
        class="logo"
        src="https://static.platzi.com/media/user_upload/Page%201-d8d869f4-7130-4ae9-9907-2fa809bd136a.jpg"
      >
      <h1 class="title">
        {{ title }}
      </h1>
      <form >
        <div class="form-group">
          <label for="">
            Nombre
          </label>
          <input
            type="text"
            v-bind:value="user.first_name"
          >
        </div>
        <div class="form-group">
          <label for="">
            Apellido
          </label>
          <input
            type="text"
            v-bind:value="user.last_name"
          >
        </div>
        <div class="form-group">
          <label for="">
            Cargo
          </label>
          <input
            type="text"
            v-bind:value="user.job_title"
          >
        </div>
        <div class="form-group btn-container">
          <button id="send-btn" type="button" name="button" class="btn-primary">
            ENVIAR
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      title: 'Registro de estación',
      user: {
        first_name: 'Adolfo',
        last_name: 'Valdivieso',
        job_title: 'CTO'
      }
    }
  }
}
</script>

<style lang="scss">
  @import './scss/main.scss';

  body, #app {
    height: 100%;
    min-height: 100vh;
  }

  .columns.is-vcentered {
    -webkit-box-align: center;
       -ms-flex-align: center;
          align-items: center;
  }

  .register-ctn {
    padding: 35px;
    width: 450px;
    margin-left: auto;
    margin-right: auto;

    img.logo {
      width: 100%;
    }

    .title {
      margin-top: 30px;
      margin-bottom: 30px;
      text-align: center;
      color: $app-blue;
    }

    .btn-container {
      text-align: right;
    }
  }

</style>
