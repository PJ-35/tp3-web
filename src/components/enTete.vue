<template>
<header class="container-fluid bg-light">
<nav class="navbar navbar-expand-lg ">
    <div class="container-fluid">
      <a class="navbar-brand" role="button" href="/"><img src="favicon.ico" alt="garenoticket" height="100"/></a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link :to="{ name: 'login'}" v-show="!isLogged" class="nav-link" >Connexion</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'signup'}" v-show="!isLogged" class="nav-link" >Inscription</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'Accueil'}" v-show="isLogged && !isValet" class="nav-link" >Ma place</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'Valet'}" v-show="isLogged && isValet" class="nav-link" >Valet</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'profil'}" v-show="isLogged" class="nav-link" >Profil</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'Transaction'}" v-show="isLogged && !isValet" class="nav-link" >Transaction</router-link>
          </li>
          <li class="nav-item">
            <a href="javascript:void(0)" v-on:click="logout" v-show="isLogged" class="nav-link ">Deconnexion</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</header>
</template>

<script>
import {toast} from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import {jwtDecode} from 'jwt-decode';

export default {
  data() {
    return {
      isLogged: false,
      isValet:false
    }
  },
  watch: {
    '$route' () {
      this.isLogged=this.verifierLogin()
    }
  },
  created() {
      this.isLogged=this.verifierLogin()
    }
  ,
  methods: {

    verifierLogin(){
            let token=localStorage.getItem('token')
            try{
                if(token){
                // Décodage du JWT
                    const decoded = jwtDecode(token);
                    if(decoded){
                        let exp=decoded.exp
                        if (exp >= Date.now() / 1000) {
                            this.isValet=decoded.isValet
                            return true
                        }
                    }
                }
            }catch{
                return false
            }
            return false
        },
    async logout() {
      localStorage.removeItem('token')
      this.isLogged = false
      toast.loading("Déconnexion en cours")
      setTimeout(() => {
    this.$router.push({ name: 'login' });
  }, 1500);
  }
  }
}

</script>

<style scoped>
li a:hover{
  background-color:darkgrey;
}

li a{
  margin:0 10px 0px 0px ;
}
.act{
  background-color:rgb(210, 208, 208);

}
</style>

