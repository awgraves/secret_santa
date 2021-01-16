<template>
  <div class="wrapper">
    <div ref="wholecard" @click="toggleCardSelection" class="card"
          :class="[isSelected ? 'card--selected':'']"
          :style="cardExtraCSS">
      <div class="card__cover" :class="[isSelected ? 'card__cover--selected':'']">
        <div class="card__cover__top">
          <img :alt="userFullName" :src="user.picture.large">
          {{ userFullName }}
        </div>
        <div class="card__content__top">
          <div v-if="user" class="card__greeting">
            Hi {{ user.name.first }},<br><br>
            You're giving a gift to:
          </div>
          <div v-if="giftRecip" class="card__gift_recipient_container">
            <img class="card__gift_recipient_pic" :alt="giftRecip.name.first" :src="giftRecip.picture.medium">
            <div class="card__gift_recipient_name text--sharpie">
              {{ giftRecip.name.first }} {{ giftRecip.name.last }}
            </div>
          </div>
        </div>
      </div>
      <div class="card__content__bottom" :class="[isSelected ? 'card__content__bottom--selected':'']">
        <div class="card__gift_recipient_address_intro">{{ giftRecipPronoun }} address is:</div>
        <div v-if="giftRecip" class="card__gift_recipient_address text--sharpie">
          {{ giftRecip.address.line_one }}<br>
          {{ giftRecip.address.line_two }}<br>
          <span v-if="giftRecip.address.line_three">{{ giftRecip.address.line_three }}<br></span>
          {{ giftRecip.address.country }}
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
import { mapState } from 'vuex';

export default {
    props: ['user'],
    data(){
        return {
            lockClick: false,  // prevent multiclick spamming
            isSelected: false,  // toggled manually to allow delay for CSS transition
            cardExtraCSS:{}  // will be calc'd on click to open card
        }
    },
    computed:{
      ...mapState(['openedCardID']),
      userFullName(){return this.user ? this.user.name.first + ' ' + this.user.name.last:'';},
      giftRecip(){return this.user.givingTo},
      giftRecipPronoun(){
        // more explicit default to avoid 'undefined' error if render is slow
        let ret = '';
        if(this.user && this.user.givingTo){
          ret = this.user.givingTo.gender === 'male' ? 'His':'Her';
        }
        return ret;
      }
    },
    watch:{
      openedCardID: function(newVal, oldVal){
        // define changes as a func to call later
        let setSelectedCSS = () => {
          // grab the card DOM element
          let card = this.$refs.wholecard;

          // calc the center pixels for current window
          let centerX = (window.innerWidth / 2);
          let centerY = (window.innerHeight / 2);

          // get card middle pos
          let currPos = card.getBoundingClientRect()
          let currX = currPos.left + 150;
          let currY = currPos.top + 200;  // when card opens, height becomes almost 400 px, so half is 200px

          // set the new transform CSS
          this.cardExtraCSS = {
            "transform": `translateX(${centerX - currX}px) translateY(${centerY - currY}px)`
          }
          
          // update the isSelected
          this.isSelected = true;
        };
        
        if(newVal === this.user.id){
          // if no other card was open, animate immediately
          if(oldVal === null){
            setSelectedCSS();
          }else{
            // delay so previous card can move first 
            setTimeout(setSelectedCSS, 370);
          }
        }else{
          this.cardExtraCSS = {}
          this.isSelected = false;
        }
      }
    },
    methods: {
      toggleCardSelection(){
        // commit either this userID or null to VUEX
        if(!this.lockClick){
          let newVal = this.openedCardID === this.user.id ? null:this.user.id;
          this.$store.commit('setOpenedCardID', newVal);
          // prevent double click issue
          this.lockClick = true;
          setTimeout(()=>{this.lockClick = false;}, 500);
        }
      }
    }
}
</script>

<style scoped>
.text--sharpie {
  font-family: 'Permanent Marker', cursive;
}

.wrapper {
  position: relative;
  width: 300px;
  height: 200px;
  margin: 2em;
}

.card {
  position: relative;
  perspective: 1000px;
  width: 300px;
  height: 200px;
  cursor: pointer;
  transition: all .75s;
  transform-style: preserve-3d;
  z-index: 5;
}
.card--selected {
  z-index: 100;
}
.card__cover {
  position: relative;
  height: 100%;
  width: 100%;
  background-color: #ffffe6;
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
  transition: .75s;
  transform-style: preserve-3d;
  transform-origin: top;
  z-index: 5;
}
.card__cover--selected {
  transform: translateY(100%) translateZ(15px) rotateX(150deg);
}
.card__cover__top,
.card__content__top,
.card__content__bottom {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 1em;
  box-sizing: border-box;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.card__cover__top {
  background-color: red;
  justify-content: space-around;
}
.card__content__top {
  transform: translateZ(-1px) rotateX(180deg);
  background-color: #ffffe6;
}
.card__greeting {
  text-align: left;
  width: 100%;
}
.card__gift_recipient_container {
  width: 100%;
  margin-top: 1em;
  display: flex;
  justify-content: left;
  align-items: center;
}
.card__gift_recipient_pic {
  padding: 1px;
  border: gray 1px solid;
}
.card__gift_recipient_name {
  padding: 1ch;
  text-align: center;
}
.card__content__bottom {
  position: relative;
  transform: translateZ(-2px) translateY(-100%);
  z-index: 4;
  height: 100%;
  width: 100%;
  transition: .75s;
  transform-style: preserve-3d;
  background-color: #ffffe6;
}
.card__content__bottom--selected {
  transform: translateY(0%) translateZ(15px);
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}
.card__gift_recipient_address_intro {
  width: 100%;
  text-align: start;
}
.card__gift_recipient_address {
  margin-top: 1em;
  text-align: left;
}

/* For Mid-sized Screens and Larger: */
@media only screen and (min-width: 420px) {
  .card--selected {
    transform: translateZ(10px) scale(1.3);
  }
  .card__cover--selected {
    transform: translateY(100%) translateZ(150px) rotateX(150deg);
  }
  .card__content__bottom--selected {
    transform: translateY(0%) translateZ(150px);
  }
}
</style>