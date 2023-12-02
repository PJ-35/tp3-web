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
  <input type="text" class="form-control rounded-0" v-model.trim="pseudo" id="pseudo" placeholder="">
  <label for="pseudo">Pseudo</label>
</div>
<div class="form-floating mb-3">
  <input type="email"  class="form-control rounded-0 " v-model.trim="email" id="email" placeholder="">
  <label for="email">Email</label>
</div>
<div v-if="isvalet">
    <div class="form-floating mb-3">
  <input type="number" class="form-control rounded-0" id="tarif" v-model.trim="tarif" placeholder="">
  <label for="tarif">Tarif</label>
</div>
</div>
<div v-else>
    <h4><strong>Voiture</strong></h4>
<div class="form-floating mb-3">
  <input type="text" class="form-control rounded-0" id="immatriculation" v-model.trim="immatriculation" placeholder="">
  <label for="immatriculation">Immatriculation</label>
</div>
<div class="form-floating mb-3">
  <input type="text" class="form-control rounded-0" id="marque" placeholder="" v-model.trim="marque">
  <label for="marque">Marque</label>
</div>
<div class="form-floating mb-3">
  <input type="text" class="form-control rounded-0" id="modele" placeholder="" v-model.trim="modele">
  <label for="modele">Modele</label>
</div>
<div class="form-floating mb-3">
  <input type="text" class="form-control rounded-0" id="couleur" placeholder="" v-model.trim="couleur">
  <label for="couleur">Couleur</label>
</div>
</div>


<button class="btn btn-primary" :disabled="isParked" type="submit">SOUMETTRE</button>
        </form>

        </div>
</template>

<script>
  export default {
    props: {
        pseudo:{
            type:String,
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
        modele:{
            type:String,
            required:true
        },
        tarif:{
            type:String,
            required:true
        },
            tarif:null,
            isvalet:false,
            isParked:false,
            couleur:null,
            id:null
    },
  }
</script>