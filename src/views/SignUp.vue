<template>
    <section class="position-relative mt-3 py-4 py-xl-5">
    <div class="d-none d-md-block position-absolute top-0 start-0 w-100 h-100"><img src="/favicon.ico" alt="parking3G"/></div>
    <div class="position-relative px-2 px-xl-5 py-5">
        <div class="container position-relative">
            <div class="row">
                <div class="col-md-6 col-xl-5 col-xxl-4 offset-md-6 offset-xl-7 offset-xxl-8">
                    <div>
                        <form class="border rounded shadow p-3 p-md-4 p-lg-5" @submit.prevent="submitForm" novalidate method="post" style="background: var(--bs-body-bg);">
                            <h3 class="text-center mb-3">Inscription</h3>
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control rounded-0" :class="[invalid1]" v-model.trim="pseudo" id="pseudo" placeholder="">
                                <label for="pseudo">Pseudo</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="email"  class="form-control rounded-0" :class="[invalid2]" v-model.trim="email" id="email" placeholder="">
                                <label for="email">Email</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="password"  class="form-control rounded-0 " :class="[invalid3]" v-model.trim="mdp1" id="mdp" placeholder="">
                                <label for="mdp1">Mot de passe</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="password"  class="form-control rounded-0 " :class="[invalid4]" v-model.trim="mdp2" id="mdp2" placeholder="">
                                <label for="mdp2">Confirmez le mot de passe</label>
                            </div>
                            <div class="mb-3"><button class="btn btn-primary" type="submit">SOUMETTRE </button></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
</template>

<script>
import {toast} from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export default{
    data(){
        return{
            pseudo:"",
            email:"",
            mdp1:"",
            mdp2:"",
            invalid1:"",
            invalid2:"",
            invalid3:"",
            invalid4:""
        }
    },
    methods:{
        submitForm(){
            if(this.validationForm()){
                this.signup()
            }
        },
        validationForm(){
            let invalid=false
            let message=[]
            if(this.pseudo.length<3 || this.pseudo.length>50){
                invalid=true
                this.invalid1="is-invalid"
                message[0]="Pseudo doit être entre 3 et 50 caractères"
            }else{
                this.invalid1="is-valid"
            }
            if(this.mdp1.length<6){
                invalid=true
                message[2]="Le mot de passe doit avoir minimum 6 caractères"
                this.invalid3="is-invalid"
            }else{
                this.invalid3="is-valid"
            }
            if(!(/^(.+)@(.+)\.(.+)$/.test(this.email))){
                invalid=true
                this.invalid2="is-invalid"
                message[1]="Adresse email incorrecte"

            }else{
                this.invalid2="is-valid"
            }
            if(this.invalid3==="is-valid" && !invalid&& this.mdp1!==this.mdp2){
                this.invalid3="is-invalid"
                this.invalid4="is-invalid"
                    toast.error("Les mots de passes ne sont pas identique",{
                        autoClose:3000,theme:'colored'
                    })
                this.mdp1=this.mdp2=""
                return false
                
            }else if(this.invalid3==="is-valid" && this.mdp1===this.mdp2){
                this.invalid4="is-valid"
            }
            if(invalid){
                message.forEach(function(value){
                    if(value)
                    toast.error(value,{
                        autoClose:3000,theme:'colored'
                    })
                })
                
            }
            return !invalid
        },

        signup(){
            fetch('http://localhost:3000/auth/signup', {
            method: 'POST',
            body: JSON.stringify({
            email: this.email,
            password: this.mdp1,
            username:this.pseudo,
            confirmPassword:this.mdp2
            }),
        headers: {
        'Content-type': 'application/json; charset=UTF-8',
        },
        })
        .then((response) => {
            if(response.status>=500)
                console.log("Une erreur s'est produite")
            else if(!response.ok){
                return response.json().then(error => {
                throw new Error(error.message);
            });
            }else{
                this.$router.push({ name: "login" });
                return response.json()
            }
        })
         .catch(error => {
          toast.error(error.message,{
            autoClose:2000
          })
        });
        }
    }
}
</script>