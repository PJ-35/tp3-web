<template>
   <div class="mt-4 border">
    <div id="mapContainer" >

    </div>
    <div class="mt-3 pt-3 shadow-sm border">
    <h4 class="text-center">Tableau des voitures</h4>
    <div  v-if="users.length">
    <table class="p-5 w-100 "  id="customers">
  <tr  class="border">
    <th class="">Nom</th>
    <th class="">Marque</th>
    <th class="">Modele</th>
    <th class="">Plaque</th>
    <th class="">Couleur</th>
    <th class="">Temps restant</th>

  </tr>
  <tr class="border border-bottom-0" v-for="user in users" v-bind:key="user.id">
    <td>{{ user.username }}</td>
    <td>{{ user.voiture.marque }} </td>
    <td>{{ user.voiture.modele }} </td>
    <td>{{ user.voiture.plaque }} </td>
    <td>{{ user.voiture.couleur }} </td>
    <td>{{ user.message }} </td>
    <td>
        <a role="button" @click="recentrer(users.findIndex(user2 => user2._id === user._id))"  class="p-2 text-black" title="Trouver ma voiture"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
</svg></a>

        <a role="button" class="p-2 text-black" @click="deplacerVoiture(user._id)" title="dddd"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-car-front-fill" viewBox="0 0 16 16">
  <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679c.033.161.049.325.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.807.807 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2M6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17 1.247 0 3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z"/>
</svg></a>
    </td>

  </tr>
</table>
</div>
<div v-else>
    <p class="text-center">Pas de voitures stationnées pour le moment</p>
</div>
    </div>
    </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default {
  data() {
    return {
      map: null,
      i:0,
      latitude: 0,
      longitude: 0,
      users:[],
      interval:[],
      markers:[]
    };
  },
  async mounted() {
    this.initMap();
    this.findUserLocation();
    this.loadUser()
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
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('position', position)

            const { latitude, longitude } = position.coords;
            this.latitude = latitude;
            this.longitude = longitude;

            const svgIcon = '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#ff5757}</style><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>';

            // Créer un marqueur avec l'icône SVG
            const svgIconUrl = `data:image/svg+xml,${encodeURIComponent(svgIcon)}`;



            this.map.setView([latitude, longitude], 13);
            L.marker([latitude, longitude],{
  icon: L.divIcon({
    className: 'custom-svg-icon', // Ajoutez des classes CSS personnalisées si nécessaire
    html: `<img src="${svgIconUrl}" width="32" height="32"/>`,
    iconSize: [32, 32], // Taille de votre icône
    iconAnchor: [16, 16], // Point d'ancrage de votre icône
  })}).addTo(this.map).bindPopup("Vous êtes ici");
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
    recentrer(i){
        this.map.setView(this.markers[i].getLatLng(), 16);
        console.log(i)
    },

    afficherCountdown(date1,index) {
        let date=new Date(date1)
        const maintenant = new Date()
        if(date<=maintenant){
          clearInterval(this.interval[index]);
    return "Expiré";
        }else
        if(date.getDate()>maintenant.getDate()){
            clearInterval(this.interval[index]);
            return "Demain"
        }
        else{
            const difference = date.getTime()-maintenant.getTime();
  
  const secondes = Math.floor(difference / 1000);
    return `${secondes}s`

        }

},
deplacerVoiture(id){
    this.$router.push({ name: 'movecar', params: { id: id } })
},
    loadUser(){
        fetch("https://api-tp3-pierre-juniors-projects.vercel.app/users", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(response => response.json())
            .then(data => {
                this.users=data.users

                for (let index = 0; index < this.users.length; index++) {
                    this.markers[index]=L.marker([this.users[index].voiture.latitude, this.users[index].voiture.longitude]).addTo(this.map).bindPopup(`<strong>${this.users[index].username}</strong>
                    <br>${this.users[index].voiture.marque} ${this.users[index].voiture.modele} <br>${this.users[index].voiture.plaque} <br> ${this.users[index].voiture.couleur}`)
                    
                    this.interval[index]=setInterval(() => {
                        this.users[index].message=  this.afficherCountdown(this.users[index].voiture.timeToLeave,index)  
                    }, 1000);    
                }
            })
            .catch((error) => {
                console.log("Une erreur s'est produite",error);
            });
    }
  }
}
</script>


<style>
  #mapContainer {
    width: 100%;
    height: 400px;
  }

  td,th{
    padding: 10px;
  }
</style>