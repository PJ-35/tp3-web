import { createRouter, createWebHistory } from 'vue-router'
import Connexion from '../views/LoginUser.vue'
import {jwtDecode} from 'jwt-decode';


const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    {
      path: '/ma-page',
      name: 'Accueil',
      meta: { requiresAuth: true },
      component:()=>import('../views/AccueilPage.vue')
    },
    {
      path: '/transaction',
      name: 'Transaction',
      meta: { requiresAuth: true },
      component:()=>import('../views/TransactionPage.vue')
    },
    {
      path: '/valet',
      name: 'Valet',
      meta: { requiresAuth: true },
      component:()=>import('../views/ValetA.vue')
    },
    {
      path: '/login',
      name: 'login',
      meta: { requiresAuth: false },
      component:Connexion
    },
    {
      path: '/signup',
      name: 'signup',
      meta: { requiresAuth: false },
      component:()=>import('../views/SignUp.vue')
    },

    {
      path: '/403',
      name: '403',
      meta: { requiresAuth: true },
      component: () => import('../views/403Error.vue')
    },

    {
      path: '/movecar/:id',
      name: 'movecar',
      meta: { requiresAuth: true },
      component: () => import('../views/MoveCar.vue')
    },
    {
      path: '/profil',
      name: 'profil',
      meta: { requiresAuth: true },
      component: () => import('../views/ProfilUser.vue')
    },


    { path: '/:notFound(.*)',
    name:'NotFound',
      component: () => import('../views/NotFound.vue') 
    }

  ],
  linkActiveClass: 'act',

  

  // scrollBehavior() permet de scroller au bon endroit lors d'une redirection
  // Cette fonction prend 3 paramètres :
  // to : objet contenant les informations de la route cible
  // from : objet contenant les informations de la route source
  // savedPosition : sauvegarde la position de la page quand on utilise le bouton précédent ou suivant du navigateur
  scrollBehavior(to, from, savedPosition) {
    console.log('savedPosition', savedPosition)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Si savedPosition existe, on scroll à la position sauvegardée
        if (savedPosition) {
          resolve(savedPosition)
        }
        resolve({ left: 0, top: 0 })
      }, 500)
    })
  }
})

// "Guarde de navigation", exécutée avant chaque navigation  
router.beforeEach((to, from, next) => {
  //Vérifié si l'utilisateur est authentifié
  let authentifie=false
  let token=localStorage.getItem('token')
 
  let isvalet=false
  try{
    if(token){
      // Décodage du JWT
    const decoded = jwtDecode(token);
    if(decoded){
      isvalet=decoded.isValet
      const {exp}=decoded
      if (exp >= Date.now() / 1000) {
        authentifie= true
      }
      else{
        localStorage.removeItem('token')

      }
    }

  }
  }catch{
    authentifie=false
    localStorage.removeItem('token')

  }

  if (to.meta.requiresAuth) {
    if (authentifie) {
      if(to.name==="Accueil" && isvalet)
        next({name:"Valet"})
      else if(to.name==="Transaction" && isvalet)
        next("/")
      else if(to.name==="Valet"){
      if(isvalet)
        next()
      else
        next({name:"403"});
     }else
        next();
    } else {
      next({ name: 'login' });
    }
  } else {

    if(authentifie && (to.name==="login" || to.name==="signup"))
      next({name:'Accueil'});
    else
      next()
  }
});

export default router
