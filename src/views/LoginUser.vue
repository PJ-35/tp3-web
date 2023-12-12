<template>
<section class="position-relative py-4 py-xl-5">
    <div class="container">
        <div class="row mb-5">
            <div class="col-md-8 col-xl-6 text-center mx-auto">
                <h2>Connexion</h2>
                <p class="w-lg-50">Content de vous revoir,</p>
            </div>
        </div>
        <div class="row d-flex justify-content-center">
            <div class="col-md-6 col-xl-4">
                <div class="card mb-5">
                    <div class="card-body d-flex flex-column align-items-center">
                        <div class="bs-icon-xl bs-icon-circle bs-icon-primary bs-icon my-4"><svg class="bi bi-person" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"></path>
                            </svg></div>
                        <form class="text-center" novalidate @submit.prevent="submitForm" method="post">
                            <div class="mb-3">
                                <input class="form-control" :class="[validationemail]" type="email" name="email" v-model.trim="email" placeholder="Email" />
                                <div class="invalid-feedback">
                                    Email requis
                                </div>
                            </div>
                            <div class="mb-3">
                                <input class="form-control" :class="[validationmdp]" type="password" name="password" v-model.trim="password" placeholder="Password" />
                                <div class="invalid-feedback">
                                    Mot de passe requis
                                </div>
                            </div>
                            <div class="mb-3"><button class="btn btn-primary d-block w-100" type="submit">Login</button></div>
                            <p class=" text-danger" :class="[hidden]">{{ erreur }}</p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
</template>


<script>
/*import {toast} from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
*/export default {
  data() {
    return {
      email: "",
      validationemail:"",
      validationmdp:"",
      hidden:"d-none",
      erreur:"Email ou mot de passe invalide",
      password:""
    };
  },
  methods: {
    validateForm() {
      let isValid = true;
      this.nameError = "";
      this.emailError = "";
      const emailvalid = /^(.+)@(.+)\.(.+)$/.test(this.email);

      if (!emailvalid) {
        this.validationemail = "is-invalid";
        isValid = false;
      }else
        this.validationemail="" 
      
      if (!this.password) {
        this.validationmdp = "is-invalid";
        isValid = false;
      }else
        this.validationmdp=""

      return isValid;
    },

    submitForm() {
        this.hidden="d-none"
        this.erreur="Email ou mot de passe invalide"
      if (this.validateForm()) {
        fetch('https://api-tp3-pierre-juniors-projects.vercel.app/auth/login', {
            method: 'POST',
            body: JSON.stringify({
            email: this.email,
            password: this.password
            }),
        headers: {
        'Content-type': 'application/json; charset=UTF-8',
        },
        })
        .then((response) => {
            if(response.status>=500){
                this.erreur="Une erreur s'est produite"
            }else if(!response.ok){
                this.password=""
                this.hidden=""
            }else{
                return response.json()
            }
        })
         .then((data) => {
            localStorage.setItem("token", data.token);
            this.$router.push({ name: "Accueil" });
            localStorage.setItem("connexion",true)

         })
         .catch(() => {
          console.log("Échec de l'authentification");
        });
      }
    },
  },
};
</script>
