<template>
  <div class="menu-container">
    <div class="participants-menu">
      <div @click="closeMenu" class="close-btn">X</div>
      <div class="number-selection">
        <div class="number-selection__top-line">
          <div class="number-selection__less">
            <div v-if="numParticipants > minUsers"
                  @click="decreaseNumUsers"
                  class="top-bar-btn number-selection__less__btn">-</div>
          </div>
          <div class="number-selection__number">{{ numParticipants }}</div>
          <div class="number-selection__more">
            <div v-if="numParticipants < maxUsers"
                  @click="increaseNumUsers"
                  class="top-bar-btn number-selection__more__btn">+</div>
          </div>
        </div>
        <div class="number-selection__label">Participants</div>
      </div>
      <div class="country-selection">
        <div v-for="(country, index) in countries"
                @click="toggleCountryOpt(country.abv)"
                class="country-opt"
                :class="[selectedCountries.includes(country.abv) ? 'country-opt--selected':'']"
                :key="'country'+index">
          <img :src="flagPicPath(country.name)"><span>{{ country.name }}</span>
        </div>
      </div>
      <div v-if="selectedCountries.length"
              @click="fetchUsers"
              class="top-bar-btn"
              style="font-size: 14pt;">
        <b>Generate!</b>
      </div>
    </div>
  </div>
  
</template>

<script>
import { mapState } from 'vuex';

export default {
  data(){
    return {
      menuOpened: false,
      countries: [
        {'name':'Austria', 'abv':'au'},
        {'name':'Brazil', 'abv':'br'},
        {'name':'Canada', 'abv':'ca'},
        {'name':'Denmark', 'abv':'dk'},
        {'name':'Finland', 'abv':'fi'},
        {'name':'France', 'abv':'fr'},
        {'name':'Germany', 'abv':'de'},
        {'name':'Ireland', 'abv':'ie'},
        {'name':'Netherlands', 'abv':'nl'},
        {'name':'New Zealand', 'abv':'nz'},
        {'name':'Norway', 'abv':'no'},
        {'name':'Spain', 'abv':'es'},
        {'name':'Switzerland', 'abv':'ch'},
        {'name':'Turkey', 'abv':'tr'},
        {'name':'United Kingdom', 'abv':'gb'},
        {'name':'United States', 'abv':'us'}
      ]
    }
  },
  computed: mapState({
    numParticipants: 'numUsers',
    minUsers: 'minUsers',
    maxUsers: 'maxUsers',
    selectedCountries: 'selectedCountries'
  }),
  methods: {
    closeMenu(){
      this.$store.commit("setMenuOpened", false);
    },
    flagPicPath(countryName){
      // convert any spaces to '_' to match file name convention
      let cleaned = countryName.replace(' ', '_');
      // to avoid a webpack issue, these imgs need to be in 'public' folder
      return `/flags/${cleaned}.png`;
    },
    increaseNumUsers(){
      if(this.numParticipants < this.maxUsers){
        let newNum = this.numParticipants + 1;
        this.$store.commit('setNumUsers', newNum);
      }
    },
    decreaseNumUsers(){
      if(this.numParticipants > this.minUsers){
        let newNum = this.numParticipants - 1;
        this.$store.commit('setNumUsers', newNum);
      }
    },
    toggleCountryOpt(abv){
      // take the abbreviation of a country and send it to VUEX to toggle
      this.$store.commit('toggleCountry', abv);
    },
    fetchUsers(){
      this.$store.dispatch('fetchRandomUsers');
    }
  }
}
</script>

<style scoped>

/* Menu and Container */
.menu-container {
  position: fixed;
  height: 90vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.participants-menu {
  position: relative;
  max-height: 80vh;
  min-width: 300px;
  width: max-content;
  color: white;
  background-color: #231f20;
  border: white 1px solid;
  border-radius: 4px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  padding: .25em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: .96;
}

/* Close Menu Btn */
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  margin: 0;
  cursor: pointer;
}

/* Participant Number Input */
.number-selection {
  margin: 1em 0;
}
.number-selection__top-line {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30pt;
}
.number-selection__less,
.number-selection__more {
  height: 30px;
  width: 30px;
  margin: 0;
  padding: 0;
  position: relative;
}
.number-selection__less__btn,
.number-selection__more__btn {
  height: 100%;
  width: 100%;
  border: white 1px solid;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 18pt;
}
.number-selection__number {
  width: 60px;
  margin: 0;
  text-align: center;
}
.number-selection__label {
  font-size: 18pt;
}

/* Countries Inputs */
.country-selection {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 5px;
  width: 80%;
  position: relative;
  margin-bottom: 1em;
  overflow-y: auto;
}
.country-opt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  opacity: .3;
  cursor: pointer;
  text-decoration: line-through;
  white-space: nowrap;
}
.country-opt span {
  margin-left: .25em;
}
.country-opt--selected {
  opacity: 1;
  text-decoration: none;
  color: lime;
}

/* For Mid-sized Screens: */
@media only screen and (min-width: 700px) {
  .participants-menu {
    padding-bottom: 1em;
  }
  .country-selection {
    grid-template-columns: repeat(4, 1fr);
    grid-row-gap: 10px;
    margin: 1em 0 2em 0;
    width: 100%;
  }
}

/* For Desktop: */
@media only screen and (min-width: 1150px) {
  .country-selection {
    grid-template-columns: repeat(8, 1fr);
  }
}
</style>