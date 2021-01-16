<template>
  <div class="top-bar">
    <div class="logo-container">
      <img alt="Secret Santa Logo" height="50px" src="../assets/img/cropped_santa.png">
      <span class="simulator-text simulator-text--flicker">SIMULATOR</span>
    </div>
    <div class="top-bar__spacer"></div>
    <div class="btn-container">
      <div @click="openMenu" class="top-bar-btn">Participants</div>
      <div v-if="showRandomizeBtn" @click="reassignGifts" class="top-bar-btn randomize-btn">Randomize Giving</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: mapState({
    showRandomizeBtn: state => state.users.length,
  }),
  methods: {
    fetchUsers(){
      this.$store.dispatch("fetchRandomUsers");
    },
    reassignGifts(){
      if(!this.lockRandomizeBtn){
        this.$store.dispatch("createGiftAssignments");
      }
    },
    openMenu(){
      this.$store.commit("setMenuOpened", true);
    }
  }
}
</script>

<style>
.top-bar {
  background-color: #231f20;
  border-bottom: white 1px solid;
  display: flex;
  align-items: center;
  justify-content: start;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 600;
  padding: 10px;
}

.logo-container {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.top-bar__spacer {
  flex: 1;
  display: none;
}

/* button container and buttons */
.btn-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.top-bar-btn {
  flex: 1 1 0px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: #231f20;
  border: white 1px solid;
  border-radius: 4px;
  padding: 5px 8px;
  cursor: pointer;
  user-select: none;
}
.top-bar-btn:hover {
  background-color: white;
  color: #231f20;
}
.randomize-btn {
  margin-left: 10px;
}

/* For Mid-sized Screens and Larger: */
@media only screen and (min-width: 540px) {
  .top-bar {
    flex-direction: row;
  }
  .btn-container {
    flex:unset;
  }
  .logo-container {
    flex: unset;
  }
  .top-bar__spacer {
    display: flex;
  }
  .randomize-btn {
    margin-left: 10px;
  }
  .top-bar-btn {
    white-space: nowrap;
  }
}
</style>