import { defineStore } from 'pinia'

export const accueilStore = defineStore({
  id: 'AuthStore',
  state: () => ({ 
  }),
  getters: {

  },
  actions: { 
    // login avec courriel et mot de passe
    async userbyid(id) {
      const response = await fetch(`http://localhost:3000/user/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      if(!response.ok){
         throw new Error()
    }
    const data= await response.json()
    return data.user

    },
    async historiqueById(){
      const response= await fetch("http://localhost:3000/historique", {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem('token'),
          },
      });

     const data =await response.json()
     let historique = data.histo
     let con=0

     historique.forEach(function (histo) {
     if(!histo.isPaid){
         con+=histo.price
     }
     });
     return con

  },

  async recupVoiture(id){
    const response = await fetch(`http://localhost:3000/car/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
      isParked:false,
      isMoving:false,

      }),
  headers: {
  'Content-type': 'application/json; charset=UTF-8',
  }
  });

  if(!response.ok)
    throw new Error() 
},
  async confirmeFetch(id,date,longitude,latitude){
    const response =await         fetch(`http://localhost:3000/car/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
      isParked:true,
      isMoving:false,
      longitude:longitude,
      latitude:latitude,
      timeToLeave:date
      }),
  headers: {
  'Content-type': 'application/json; charset=UTF-8',
  },
  });
  if(!response.ok)
    throw new Error()
  }
  }
})