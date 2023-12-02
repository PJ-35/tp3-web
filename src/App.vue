<template>
    <EnTete/>
    <main class="container">
      <router-view/>
    </main>
    <PiedPage/>
</template>

<script>
// Import du composant BoutonCompteur
import PiedPage from './components/basDePage.vue';
import EnTete from './components/enTete.vue'


export default {
  // Ajout du composant BoutonCompteur dans la liste des composants
  components: {
    EnTete,
    PiedPage
  }
};
</script>