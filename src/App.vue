<template >
  <div id="app" class="register-ctn columns is-vcentered">
    <div class="column">
      <img
        class="logo"
        src="https://static.platzi.com/media/user_upload/Page%201-d8d869f4-7130-4ae9-9907-2fa809bd136a.jpg"
      >
      <ul class="navbar">
        <li class="nav-item">
          <a
            class="btn-link nav-btn"
            href="javascript: void(0);"
            v-on:click="onSwitchFormToSignin"
          >
            Registrate
          </a>
        </li>
        <li class="nav-item">
          <a
            class="btn-link nav-btn"
            href="javascript: void(0);"
            v-on:click="onSwitchFormToLogin"
          >
            Ingresa
          </a>
        </li>
      </ul>
      <h1 class="title">
        <span v-show="signin">
          Registro de estación
        </span>
        <span v-show="!signin">
          Ingresa a tu estación
        </span>
      </h1>
      <form v-if="signin" >
        <div class="form-group">
          <label for="">
            Email
          </label>
          <input
            type="email"
            v-model="email"
          >
        </div>
        <div class="form-group">
          <label for="">
            Nombre
          </label>
          <input
            type="text"
            v-model="first_name"
          >
        </div>
        <div class="form-group">
          <label for="">
            Apellido
          </label>
          <input
            type="text"
            v-model="last_name"
          >
        </div>
        <div class="form-group">
          <label for="">
            Cargo
          </label>
          <input
            type="text"
            v-model="job_title"
          >
        </div>
        <div class="form-group btn-container">
          <button id="send-btn" type="button" name="button" class="btn-primary">
            Crear
          </button>
        </div>
      </form>
      <form v-if="!signin" >
        <div class="form-group">
          <label for="">
            Email
          </label>
          <input
            type="email"
            v-model="email"
          >
        </div>
        <div class="form-group btn-container">
          <button id="send-btn" type="button" name="button" class="btn-primary">
            Entrar
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
      signin: true,
      email: '',
      first_name: '',
      last_name: '',
      job_title: ''
    }
  },
  methods: {
    onSwitchFormToSignin: function() {
      this.signin = true;
    },
    onSwitchFormToLogin: function() {
      this.signin = false;
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
