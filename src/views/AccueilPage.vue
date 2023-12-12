<template>
    <div class="mt-4 border">
      <AccueilMap
        :montant="montant"
      />

    </div> 
  </template>
  
  <script>
  import { accueilStore } from '../stores/AccueilStore.js'
  import {toast} from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import AccueilMap from '../components/AccueilMap.vue'


  export default {
    components:{
      AccueilMap
    },
    data() {
      return {
        montant:0,
        premiereFois:localStorage.getItem("connexion")||false
      };
    },
   async created () {
    this.store = accueilStore()
    await this.historiqueById()
  },
    async mounted() {

      if(this.premiereFois){
        toast.success("Vous êtes bien connecté.",{
        autoClose:3000,
        theme:'colored'
      })
        localStorage.removeItem("connexion")
        }
    },

    methods: {

      async historiqueById(){
        try{
          this.montant=await this.store.historiqueById()
        }catch{
          console.log("Une erreur s'est produite");
        }
        },
    }
  }
  </script>
  