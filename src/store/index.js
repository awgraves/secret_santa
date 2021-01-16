import Vue from 'vue'
import Vuex from 'vuex'

import $ from '../assets/js/libraries/jquery-AJAX.min.js'
import { fullUserListParser } from '../assets/js/utils/parsers.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    urls: {
      'randomUserAPI': 'https://randomuser.me/api/'
    },
    users: [],  // AJAX will populate this
    minUsers: 3,  // low user num limit
    maxUsers: 10,  // upper user num limit
    numUsers: 5,  // how many users to generate
    selectedCountries: ['ie','nz','us'],  // which countries the users should be from
    openedCardID: null, // id of user with opened card. Only 1 card open at a time
    menuOpened: false,  // display the participants modal
  },
  mutations: {
    setNewUsers(state, newUserList){
      // simply overwrite full list with new one
      Vue.set(state, 'users', newUserList);
      // make sure no card remains open
      Vue.set(state, 'openedCardID', null);
    },
    setOpenedCardID(state, newVal){
      // can be another ID or null
      Vue.set(state, 'openedCardID', newVal);
    },
    setMenuOpened(state, newVal){
      Vue.set(state, 'menuOpened', newVal);
    },
    setNumUsers(state, newNum){
      Vue.set(state, 'numUsers', newNum);
    },
    toggleCountry(state, abv){
      // copy the current list
      let countriesList = state.selectedCountries;
      // either filter or push the abv to our copy
      if(countriesList.includes(abv)){
        countriesList = state.selectedCountries.filter(c => c !== abv);
      }else{
        countriesList.push(abv);
      }
      // assign the copy as the new state
      Vue.set(state, 'selectedCountries', countriesList);
    },
    setUserGiftAssignment(state, {userIndex, chosenObj}){
      Vue.set(state.users[userIndex], 'givingTo', chosenObj);
    },
    removeAllGiftAssignments(state){
      state.users.forEach((user, userIndex)=>{
        Vue.set(state.users[userIndex], 'givingTo', null);
      })
    }
  },
  actions: {
    createGiftAssignments(context){
      // reset previous assignments
      context.commit('removeAllGiftAssignments');
      // grab user Objs list
      let users = context.state.users;
      // every user will need a gift
      let needsGift = users.map(user => user.id);
      // loop through each user and assign them someone to give a gift to
      users.forEach((thisUser, userIndex) => {
        // declare var to track the chosen recipient's ID
        let chosenID = null;
        // make sure user can't give a gift to themselves!
        let eligible = needsGift.filter(id => id !== thisUser.id);
        // if the 2nd to last assignment to make...
        if(eligible.length === 2){
          // grab these two remaining users
          let two = users.filter(user => eligible.includes(user.id));
          // check for scenario with 1 null & 1 NOT null givingTo assignments
          // otherwise, proceed to random selection
          let givingToList = two.map(user => user.givingTo);
          if(givingToList.includes(null) && givingToList.some(val => val !== null)){
            // chose the ID for person NOT yet giving to anyone else
            chosenID = two.find(u => u.givingTo === null).id;
          }
        }
        if(chosenID === null){
          // chose an eligible person at random if not yet explicity chosen
          chosenID = eligible[Math.floor(Math.random() * eligible.length)];
        }
        // find the user object for the user with the chosenID
        let chosenObj = users.find(user => user.id === chosenID);
        // commit this assignment
        context.commit('setUserGiftAssignment', {userIndex, chosenObj});
        // remove that assigned person from the needsGift list
        needsGift = needsGift.filter(id => id !== chosenID);
      });
    },
    fetchRandomUsers(context){
      // convert the countries array to string
      let natStr = context.state.selectedCountries.join(',');
      // request limited records with only some result fields
      $.ajax({
        url: context.state.urls['randomUserAPI'],
        dataType: 'json',
        data: {
          results: context.state.numUsers,
          nat: natStr,
          inc: 'name,gender,location,picture',
        },
        success: (response) => {
          // convert the raw response into finalized user data
          let newUsers = fullUserListParser(response.results);
          // update Vuex users list
          context.commit("setNewUsers", newUsers);
          // immediately create gift assignments
          context.dispatch("createGiftAssignments");
          // close the menu
          context.commit("setMenuOpened", false);
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  },
})
