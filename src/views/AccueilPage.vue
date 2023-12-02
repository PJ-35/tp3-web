<template>
    <div class="mt-4 border">
    <div id="mapContainer" >

    </div>
  <div class="p-3" id="border">
    <div class="d-flex p-3  justify-content-center">
    <button class="me-3 btn btn-light shadow" @click="laisseVoiture()" :disabled="isParked || isMoving" >JE LAISSE MA VOITURE</button>
    <button class="btn btn-light shadow " @click="recupVoiture()" :disabled="!isParked || isMoving" >J'AI RÉCUPÉRÉ MA VOITURE</button>
    <a role="button" @click="recentrer()" v-show="isMoving || isParked" class="p-2 text-black" title="Trouver ma voiture"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
</svg></a>
  </div>
<div v-show="laissevoiture">
  <p>
    Veuillez vérifier que votre voiture est bien stationné à l'endroit indiqué sur la carte ou déplacer la marqueur sur la position de votre voiture
  </p>
  <button class="btn btn-light shadow " @click="confirme()" >JE CONFIRME</button>
</div>
<div v-show="isMoving">
  <p class="text-center">Votre voiture est en cours de déplacement</p>
</div>
  </div>

    </div> 
  </template>
  
  <script>
  import "leaflet/dist/leaflet.css";
  import L from "leaflet";
  import {toast} from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import {jwtDecode} from 'jwt-decode';

  export default {
    data() {
      return {
        map: null,
        disabled1:"",
        disabled2:"disabled",
        montant:0,
        isParked:false,
        isMoving:false,
        laissevoiture:false,
        aVoiture:false,
        id:null,
        latitude: 0,
        userMarker:null,
        longitude: 0,
        premiereFois:localStorage.getItem("connexion")||false
      };
    },
    async mounted() {
      this.decrypter()
      await this.historiqueById()
      await this.getuserbyid()
      this.initMap();
      this.findUserLocation();
      if(this.premiereFois){
        toast.success("Vous êtes bien connecté.",{
        autoClose:3000,
        theme:'colored'
      })
        localStorage.removeItem("connexion")
        }
    },
    methods: {
      initMap() {
        this.map = L.map("mapContainer").setView([this.latitude, this.longitude], 16);
        L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.map);
      },
      findUserLocation() {
        if(this.isParked){
          this.map.setView([this.latitude, this.longitude], 13);
              this.userMarker= L.marker([this.latitude, this.longitude]).addTo(this.map);
        }else if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log('position', position)
  
              const { latitude, longitude } = position.coords;
              this.latitude = latitude;
              this.longitude = longitude;
  
              this.map.setView([latitude, longitude], 13);
              this.userMarker= L.marker([latitude, longitude]).addTo(this.map);
            },
            (error) => {
              console.error("erreur:", error);
              if (error.code == error.PERMISSION_DENIED) {
                alert("Vous devez autoriser la géolocalisation pour utiliser cette fonctionnalité.");
              }
            }
          );
        } else {
          console.error("La géolocalisation n'est pas supportée par votre navigateur.");
        }
      },
      confirme(){
        
        if(this.laissevoiture){
          this.laissevoiture=false
          if(!this.aVoiture){
            toast.error("Vous n'avez pas de voiture enrégistrée",{
              autoClose:3000,
              theme:"colored"
            })
          }else if(this.montant>20){
            toast.error("Vous avez un montant supérieur à 20$ à payer. Vous ne pouvez pas stationner votre voiture",{
              autoClose:3000,
              theme:"colored"
            })
          }else{
           // this.isParked=true
            const date= new Date()
            if(date.getHours()<=9){
              date.setHours(10)
              date.setMinutes(0)
              date.setMilliseconds(0)
            }
            else if(date.getHours()<11 || (date.getHours()>13 && date.getHours()<16) || ( date.getHours()===13 && date.getMinutes()>=30) ){
              date.setHours(date.getHours()+1)

            }
            else if(date.getHours()>=16){
              date.setDate(date.getDate()+1)
              date.setHours(10)
              date.setMinutes(0)
              date.setMilliseconds(0)

            }
            else if(date.getHours()>=11){
              date.setHours(14)
              date.setMinutes(30)
              date.setMilliseconds(0)

            }
            const {lat,lng} = this.userMarker.getLatLng();
           // console.log(lat,lng)
              this.latitude = lat;
              this.longitude = lng;
            this.confirmeFetch(date)
          }
        }
      },
      confirmeFetch(date){
        fetch(`http://localhost:3000/car/${this.id}`, {
            method: 'PUT',
            body: JSON.stringify({
            isParked:true,
            isMoving:false,
            longitude:this.longitude,
            latitude:this.latitude,
            timeToLeave:date
            }),
        headers: {
        'Content-type': 'application/json; charset=UTF-8',
        },
        })
        .then((response) => {
            if(!response.ok){
                throw new Error()
            }else{
              this.getuserbyid()
              this.userMarker.dragging.disable()
              toast.success("Votre voiture est bien enregistrée",{
              autoClose:2000,
              theme:"colored"
            })
                return response.json()
            }
        })
         .catch((error) => {
          console.log("Une erreur s'est produise" ,error);
        });
      },

      recentrer(){
        if(this.isMoving || this.isParked)
          this.map.setView(this.userMarker.getLatLng(), 16);
      },
      recupVoiture(){
        if(this.isParked && !this.isMoving){
          fetch(`http://localhost:3000/car/${this.id}`, {
            method: 'PUT',
            body: JSON.stringify({
            isParked:false,
            isMoving:false,
            /*latitude:this.userMarker.getLatLng().lat,
            longitude:this.userMarker.getLatLng().lng,
*/
            }),
        headers: {
        'Content-type': 'application/json; charset=UTF-8',
        },
        })
        .then((response) => {
            if(!response.ok){
                throw new Error()
            }else{
              this.getuserbyid()
                return response.json()
            }
        })
         .catch(() => {
          console.log("Une erreur s'est produise");
        });
        }
      },
      laisseVoiture(){
        if(!this.isParked && this.userMarker){
           this.userMarker.dragging.enable()
           this.laissevoiture=true

        }
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

      async getuserbyid(){
           await fetch(`http://localhost:3000/user/${this.id}`, {
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
            if(user.voiture){
              this.aVoiture=true
              this.isParked=user.voiture.isParked
              if(this.isParked){
                this.latitude=user.voiture.latitude
                this.longitude=user.voiture.longitude
              }
              this.isMoving=user.voiture.isMoving
            }
            //this.showToast()

         })
         .catch(() => {
          console.log("Une erreur s'est produite");
        });
        },

      async historiqueById(){
            await fetch("http://localhost:3000/historique", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                },
            })
            .then(response => response.json())
            .then(data => {
                let historique = data.histo
                let con=0

                historique.forEach(function (histo) {
                if(!histo.isPaid){
                    con+=histo.price
                }
                });
                this.montant=con

            })
            .catch(() => {
                console.log("Une erreur s'est produite");
            });
        },
    }
  }
  </script>
  
  
  <style scoped>
  #mapContainer {
    width: 100%;
    height: 400px;
  }
  /*button[disabled]{
  opacity: 50%;
  cursor: not-allowed;
  }*/
  </style>
  