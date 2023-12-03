<template>
                <h3>Profil</h3>
            <div class="bg-info p-3" v-show="isParked">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
</svg>
Vous ne pouuvez pas modifié votre profil pendant que votre voiture est stationée
            </div>
            <div class="col-6">
                <form class="shadow p-2" @submit.prevent="submitForm" novalidate>
                <h4>Informations personnelles</h4>
    <div class="form-floating mb-3">
  <input type="text" class="form-control rounded-0" :value="pseudo" @input="$emit('update:pseudo', $event)" id="pseudo" placeholder="">
  <label for="pseudo">Pseudo</label>
</div>
<div class="form-floating mb-3">
  <input type="email"  class="form-control rounded-0 " :value="email" @input="$emit('update:email', $event)" id="email" placeholder="">
  <label for="email">Email</label>
</div>
<div v-if="isvalet">
    <div class="form-floating mb-3">
  <input type="number" class="form-control rounded-0" id="tarif" :value="tarif" @input="$emit('update:tarif', $event)" placeholder="">
  <label for="tarif">Tarif</label>
</div>
</div>
<div v-else>
    <h4><strong>Voiture</strong></h4>
<div class="form-floating mb-3">
  <input type="text" class="form-control rounded-0" id="immatriculation" :value="immatriculation" @input="$emit('update:immatriculation', $event)" placeholder="">
  <label for="immatriculation">Immatriculation</label>
</div>
<div class="form-floating mb-3">
  <input type="text" class="form-control rounded-0" id="marque" placeholder="" :value="marque" @input="$emit('update:marque', $event)">
  <label for="marque">Marque</label>
</div>
<div class="form-floating mb-3">
  <input type="text" class="form-control rounded-0" id="modele" placeholder="" :value="modele" @input="$emit('update:modele', $event)">
  <label for="modele">Modele</label>
</div>
<div class="form-floating mb-3">
  <input type="text" class="form-control rounded-0" id="couleur" placeholder="" :value="couleur" @input="$emit('update:couleur', $event)">
  <label for="couleur">Couleur</label>
</div>
</div>


<button class="btn btn-primary" :disabled="isParked" type="submit">SOUMETTRE</button>
        </form>

        </div>
</template>

<script>
import {toast} from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import {jwtDecode} from 'jwt-decode';

  export default {
    name: 'FormProfil',
    props: {
     /* id:{
            type: String,
            required:true
        },*/
        pseudo: {
            type: String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        immatriculation:{
            type:String,
            required:true
        },
        marque:{
            type:String,
            required:true
        },
        modele: {
            type: String,
            required:true
        },
        tarif:{
            type:Number,
            required:true,
            validator: value => value >= 0
        },
        isvalet:{
            type:Boolean,
            required:true,
            default:false
        },
        isParked:{
            type:Boolean,
            required:true,
            default:false
        },
        couleur:{
            type:String,
            required:true
        }
    },
    data(){
      return{
        id:null
      }
    },
    methods:{
        verifierToken(){
            let token=localStorage.getItem('token')
            try{
                if(token){
                // Décodage du JWT
                    const decoded = jwtDecode(token);
                    if(decoded){
                        let exp=decoded.exp
                        if (exp >= Date.now() / 1000) {
                            this.id=decoded.id
                            return true
                        }
                    }
                }
            }catch{
                return false
            }
            return false
        },

        deconnecter(){
            localStorage.removeItem('token')
            this.$router.push({ name: "login" });
        },

        updateProfil(){
            Promise.all([
  fetch(`http://localhost:3000/user/${this.id}`, {
        method: 'PUT',
        body:JSON.stringify({
                email:this.email,
                username:this.pseudo
            }),
        headers: {
        'Content-type': 'application/json; charset=UTF-8',
        },
        }),
  fetch(`http://localhost:3000/car/${this.id}`,{
        method: 'PUT',
        body:JSON.stringify({
                modele:this.modele,
                marque:this.marque,
                plaque:this.immatriculation,
                couleur:this.couleur
            }),
        headers: {
        'Content-type': 'application/json; charset=UTF-8',
        },
        }),
])
  .then(responses => {
    if(!responses[0].ok || !responses[1].ok)
        throw new Error()
    toast.success("Profil mis à jour",{
    autoClose:3000,
    theme:'colored'
    });
  })
  .catch(() => {
            toast.error("Veuillez bien remplir tous les champs",{
                autoClose:3000,
                theme:'colored'
            });
  });
        },

        updateProfilValet(){
            fetch(`http://localhost:3000/user/${this.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                email:this.email,
                username:this.pseudo,
                price:this.tarif
            }),
        headers: {
        'Content-type': 'application/json; charset=UTF-8',
        },
        })
        .then((response) => {
            if(!response.ok){
                throw new Error()
            }else{
                toast.success("Profil mis à jour",{
                autoClose:3000,
                theme:'colored'
                })
        }})
         .catch(() => {
            toast.error("Veuillez bien remplir tous les champs",{
                autoClose:3000,
                theme:'colored'
            });
        });
        },

        submitForm(){
            if(!this.isParked){
                if(this.verifierToken()){
                    if(this.isvalet){
                        this.updateProfilValet()
                    }else{
                this.updateProfil()
                    }
            }else{
                this.deconnecter()
            }
            }

        }
    }
    
  }
</script>