<template>
    <div class="mt-3 pt-3 shadow-sm border">
        <div class="d-flex justify-content-around align-items-center">
            <p>Total à payer: <span class="rounded-4 text-bg-secondary p-2">{{montant}} $</span></p>
            <p><button :disabled="montant===0" @click="payermaintenant()" class=" btn btn-secondary border border-1">PAYER MAINTENANT</button></p>

        </div>
    <h4>Historique des factures</h4>
    <div class="tableau" v-if="facture.length">
    <table class="p-5 w-100 "  id="customers">
  <tr  class="border">
    <th class="">Date</th>
    <th class="">Montant</th>
  </tr>
  <tr class="border border-bottom-0" v-for="fact in facture" v-bind:key="fact.id">
    <td>{{ gethour(fact.createdAt) }}</td>
    <td>{{ fact.price }} $</td>

  </tr>
</table>
</div>
<div class="text-center" v-else>
    Aucune facture émise 
</div>
</div>
    <div class="mt-3">
    <h4>Historique des déplacements</h4>
    <div v-if="historique.length">
        <table class="p-5 border border-5 w-100" id="customers">
  <tr  class="border">
    <th class="">Date</th>
    <th class="">Prix</th>
    <th class="">Payé</th>
  </tr>
  <tr class="border border-bottom-0" v-for="histo in historique" v-bind:key="histo.id">
    <td>{{ gethour(histo.createdAt)}}</td>
    <td>{{ histo.price }} $</td>
    <td v-if="histo.isPaid">Oui</td>
    <td v-else>Non</td>

  </tr>
</table>
<p class=" text-end ">
 <small class="">
    <small class="">
        historique par page:  
    <select id="select"   class=" bg-white">
        <option v-for="option in lstOption" v-bind:key="option" :value="[option]" @click="affichequelque()">{{ option }}</option>
        <option @click="afficheTout()">Tout</option>
    </select>
    1-{{partie}} de {{ tout }}
    </small>
    <small class="">

        <a type="button" @click="ajoutDeLigne1()" :class="[disable1]" class=" border-0 btn-outline-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-bar-left" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M11.854 3.646a.5.5 0 0 1 0 .708L8.207 8l3.647 3.646a.5.5 0 0 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 0 1 .708 0zM4.5 1a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 1 0v-13a.5.5 0 0 0-.5-.5"></path>
</svg>
                  <span class="visually-hidden">Button</span>
</a>

<a type="button" @click="ajoutDeLigne2()" :class="[disable1]" class=" border-0 btn-outline-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"></path>
</svg>
                  <span class="visually-hidden">Button</span>
</a>

<a type="button" @click="ajoutDeLigne3()" :class="[disable2]" class="  border-0 btn-outline-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"></path>
</svg>
                  <span class="visually-hidden">Button</span>
</a>

<a type="button" @click="ajoutDeLigne4()" :class="[disable2]" class="  border-0 btn-outline-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-bar-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M4.146 3.646a.5.5 0 0 0 0 .708L7.793 8l-3.647 3.646a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708 0zM11.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5"></path>
</svg>
                  <span class="visually-hidden">Button</span>
</a>
    </small>

</small> 
   
</p>
    </div>
    <div class="text-center" v-else>
        Aucune historique effectué
    </div>
</div>
</template>

<script>
import {toast} from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import {jwtDecode} from 'jwt-decode';
export default{
    data(){
        return{
            disable1:"disabled",
            disable2:"",
            historique:[],
            end:10,
            montant:0,
            facture:[],
            historiqueFetch:[],
            lstOption:[10,25,50,100],
            tout:null,
            partie:null
        }
    },
    async created(){
        //this.$route.push('/')
        await this.decrypter(this.end)
        await this.factureById()

    },
    watch: {
    $route() {
      this.decrypter(this.end)
    }
  },
    methods:{
        async decrypter(end){
            if(this.verifierToken()){
                await this.historiqueById()
                if(this.end)
                    this.historique=this.historiqueFetch.slice(0,end)
                else
                    this.historique=this.historiqueFetch
                this.tout=this.historiqueFetch.length
                this.partie=this.historique.length


            }else{
                this.deconnecter()
            }
        },
        async affichequelque(){
            this.end=this.lstOption[document.getElementsByTagName("select")[0].selectedIndex]
            await this.decrypter(this.end)
            if(this.end===10){
                this.disable1="disabled"
                this.disable2=""
            }else
            if(this.end>=this.historiqueFetch.length){
                this.disable1=""
                this.disable2="disabled"
            }else{
                this.disable1=""
                this.disable2=""
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
        async afficheTout(){
            await this.decrypter()
            this.end=this.tout
            this.disable1=""
            this.disable2="disabled"
        },
        deconnecter(){
            localStorage.removeItem('token')
            this.$router.push({ name: "login" });
        },
        async payermaintenant(){
            if(this.montant===0){
                toast.error("Une erreur s'est produite",{
                    autoClose:3000,
                    theme:'colored'
                })
            }else{
                await fetch("https://api-tp3-pierre-juniors-projects.vercel.app/effectuerPaiement", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                },
            })
            .then(response =>{
                if(response.ok){
                    this.decrypter(this.end)
                    this.factureById()
                    toast.success("Paiement effectué",{
                        autoClose:3000,
                        theme:'colored'
                    })
                }
            } )
            .catch(() => {
                console.log("Une erreur s'est produite");

            });
            }

        },
        ajoutDeLigne1(){
            this.end=10
            this.decrypter(this.end)
            this.disable2=""
            this.disable1="disabled"
            document.getElementById("select").selectedIndex=0
        },
        ajoutDeLigne2(){
            this.disable2=""
            let index=document.getElementById("select").selectedIndex
            if(index-1<=0){
                this.end=this.lstOption[0]
                this.disable1="disabled"
                document.getElementById("select").selectedIndex=0
            }else{
                this.end=this.lstOption[index-1]
                document.getElementById("select").selectedIndex=index-1
            }
            this.decrypter(this.end)
        },
        async ajoutDeLigne3(){
            this.disable1=""
            let index=document.getElementById("select").selectedIndex
            if(index+1>=this.lstOption.length){
                document.getElementById("select").selectedIndex=this.lstOption.length
                await this.afficheTout()
                this.disable2="disabled"
            }
            else{
                this.end=this.lstOption[index+1]
                document.getElementById("select").selectedIndex=index+1
                await this.decrypter(this.end)
            }
        },
        async ajoutDeLigne4(){
            await this.afficheTout()
            this.disable2="disabled"
            this.disable1=""
            document.getElementById("select").selectedIndex=this.lstOption.length
        },

        gethour(hour){
            let date=new Date(hour)
            return `${date.toLocaleDateString()}  ${date.toLocaleTimeString()}`
        },

        async historiqueById(){
            await fetch("https://api-tp3-pierre-juniors-projects.vercel.app/historique", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                },
            })
            .then(response => response.json())
            .then(data => {
                this.historiqueFetch = data.histo
                let con=0

                this.historiqueFetch.forEach(function (histo) {
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

        async factureById(){
            await fetch("https://api-tp3-pierre-juniors-projects.vercel.app/facture", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                },
            })
            .then(response => response.json())
            .then(data => {
                this.facture = data
            })
            .catch(() => {
                console.log("Une erreur s'est produite");
            });
        }
    }
}
</script>

<style scoped>
.tableau{
    max-height: 200px;
    overflow-y: scroll;
}

.tableau th{
    position: sticky;
    top: 0px;
    background-color: beige;

}
#customers th ,td{
    padding: 5px 5px 5px 5px;
}

a{
    padding: 5px 5px 0px 5px;
    color: gray;
}
.disabled{
    pointer-events: none
}
a:hover{
    padding: 5px;
    background-color: rgb(186, 183, 183);
}

</style>