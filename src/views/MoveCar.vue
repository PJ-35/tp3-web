<template>
    <div class="mt-4 border">
    <div id="mapContainer" >

    </div>
  <div class="p-3" >
    <div class="d-flex p-3  justify-content-center">
    <button class="me-3 btn btn-light shadow" @click="deplaceVoiture()"  :disabled="[!longitude || !latitude] && isMoving" >JE DEPLACE LA VOITURE</button>
    <button class="btn btn-light shadow " @click="validationVoiture()" :disabled="!isMoving" >VALIDATION DU STATIONEMENT</button>
    <a role="button" @click="recentrer()" v-show="isMoving"  class="p-2 text-black" title="Trouver ma voiture"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
</svg></a>
    </div>
    <p v-show="isMoving">Vérifier la position de la voiture ou déplacer le marker rouge pour la corriger puis valider le stationnement</p>
  </div>
  </div>
  </template>
  
  <script>
  import "leaflet/dist/leaflet.css";
  import L from "leaflet";
import {jwtDecode} from 'jwt-decode';
import {toast} from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
  
  export default {
    data() {
      return {
        map: null,
        isMoving:false,
        latitude: null,
        id:null,
        idValet:null,
        longitude: null,
        isParked:null,
        markerVoiture:null,
        markerValet:null
      };
    },
    created(){
        if(!this.verifierToken()){
            this.$router.push("/pageintrouvable")
        }
    },
    async mounted() {
        this.id = this.$route.params.id
        await this.getuserbyid()
        if(!this.isParked)
            this.$router.push("/")

      this.initMap();
      this.findUserLocation();
    },
    methods: {
      initMap() {
        this.map = L.map("mapContainer").setView([0, 0], 16);
        L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.map);
      },
      findUserLocation() {
        if(this.longitude && this.latitude){
            if(!this.isMoving)
                this.markerVoiture= L.marker([this.latitude, this.longitude]).addTo(this.map)

        }
        else
            console.log("Une erreur s'est produite")
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log('position', position)
  
              const { latitude, longitude } = position.coords;

              const svgIcon = '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#ff5757}</style><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>';

// Créer un marqueur avec l'icône SVG
const svgIconUrl = `data:image/svg+xml,${encodeURIComponent(svgIcon)}`;



this.map.setView([latitude, longitude], 13);
this.markerValet=L.marker([latitude, longitude],{
icon: L.divIcon({
className: 'custom-svg-icon', // Ajoutez des classes CSS personnalisées si nécessaire
html: `<img src="${svgIconUrl}" width="32" height="32"/>`,
iconSize: [32, 32], // Taille de votre icône
iconAnchor: [16, 16], // Point d'ancrage de votre icône
}),draggable:true}).addTo(this.map);
  
              this.map.setView([latitude, longitude], 13);
            //  =L.marker([latitude, longitude], { draggable: true }).addTo(this.map);
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
      deplaceVoiture(){
        this.isMoving=true
        this.markerVoiture.remove()
        fetch(`http://localhost:3000/car/${this.id}`, {
            method: 'PUT',
            body: JSON.stringify({
            isMoving:true,
            }),
        headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization':`${this.idValet}`
        },
        })
        .then((response) => {
            if(!response.ok){
                throw new Error()
            }else{
              //this.getuserbyid()
              toast.success("Voiture en déplacement",{
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
                this.latitude=user.voiture.latitude
                this.longitude=user.voiture.longitude
                this.isMoving=user.voiture.isMoving
                this.isParked=user.voiture.isParked
              
            }
            else
                throw new Error()
            //this.showToast()

         })
         .catch(() => {
            this.$router.push("/pageintrouvable")
        });
        },
       async  validationVoiture(){
            if(this.isMoving){
                const {lat,lng} = this.markerValet.getLatLng();
              this.latitude = lat;
              this.longitude = lng;
             
              await this.validation()
            }
        },

        async validation(){
        fetch(`http://localhost:3000/car/${this.id}`, {
            method: 'PUT',
            body: JSON.stringify({
            isParked:true,
            isMoving:false,
            longitude:this.longitude,
            latitude:this.latitude,
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
             // this.markerValet.dragging.disable()
              toast.success("Voiture stationnée",{
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
        verifierToken(){
            let token=localStorage.getItem('token')
            try{
                if(token){
                // Décodage du JWT
                    const decoded = jwtDecode(token);
                    if(decoded){
                        let exp=decoded.exp
                        if (exp >= Date.now() / 1000 && decoded.isValet) {
                            this.idValet=decoded.id
                            return true
                        }
                    }
                }
            }catch{
                return false
            }
            return false
        },
    }
  }
  </script>
  
  
  <style>
  #mapContainer {
    width: 100%;
    height: 400px;
  }
  </style>
  