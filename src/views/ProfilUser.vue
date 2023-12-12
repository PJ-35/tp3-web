<template>
        <div class="shadow p-3 mt-3">
            <form-profil
            :pseudo="pseudo"  @update:pseudo="updatePseudo"
            :email="email"  @update:email="updateEmail"
            :immatriculation="immatriculation"  @update:immatriculation="updateImmatriculation"
            :marque="marque"  @update:marque="updateMarque"
            :modele="modele"  @update:modele="updateModele"
            :tarif="tarif"  @update:tarif="updateTarif"
            :isvalet="isvalet"
            :is-parked="isParked"
            :couleur="couleur"  @update:couleur="updateCouleur"
            />
</div>
</template>

<script>
//import {toast} from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import {jwtDecode} from 'jwt-decode';
import FormProfil from '../components/formProfil.vue'

export default{
    components:{
        FormProfil
    },
    data(){
        return{
            pseudo:null,
            email:null,
            immatriculation:null,
            marque:null,
            modele:null,
            tarif:null,
            isvalet:false,
            isParked:false,
            couleur:null,
            id:null
        }
    },
    created(){
        this.decrypter()
    },
    watch: {
    $route() {
      this.decrypter()
    }
  },
    methods:{
        updateCouleur(newCouleur){
            this.couleur=newCouleur
        },
        updateEmail(newEmail){
            this.email=newEmail
        },
        updateImmatriculation(newI){
            this.immatriculation=newI
        },
        updateMarque(newMarque){
            this.marque=newMarque
        },
        updateModele(newModele){
            this.modele=newModele
        },
        updateTarif(newTarif){
            this.tarif=newTarif
        },
        updatePseudo(newPseudo){
            this.pseudo=newPseudo
        },
        
        decrypter(){
            if(this.verifierToken()){
                this.getuserbyid()
            }else{
                this.deconnecter()
            }
        },

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

        getuserbyid(){
            fetch(`https://api-tp3-pierre-juniors-projects.vercel.app/user/${this.id}`, {
            method: 'GET',
        headers: {
        'Content-type': 'application/json; charset=UTF-8',
        },
        })
        .then((response) => {
            if(!response.ok)
                throw new Error()
            return response.json()
        })
         .then((data) => {
            let user=data.user
            this.pseudo=user.username
            this.email=user.email
            this.isvalet=user.isValet
            if(this.isvalet)
                this.tarif=user.price

            if(user.voiture){
                this.isParked=user.voiture.isParked
                this.immatriculation=user.voiture.plaque
                this.marque=user.voiture.marque
                this.modele=user.voiture.marque
                this.couleur=user.voiture.couleur
            }

         })
         .catch(() => {
          console.log("Une erreur s'est produite");
        });
        },




    }
}
</script>

<style scoped>
input{
    border: none;
    border-bottom: 2px rgb(0, 0, 0,0.2) solid;
    outline:none;
    background-color:whitesmoke;
}
input:hover{outline: none;}

input:focus{
    border-bottom: 5px gray solid;
    outline:none;
    background-color:silver;
}
</style>