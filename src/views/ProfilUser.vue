<template>
        <div class="shadow p-3 mt-3">

</div>
</template>

<script>
import {toast} from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import {jwtDecode} from 'jwt-decode';
export default{
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
            fetch(`http://localhost:3000/user/${this.id}`, {
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