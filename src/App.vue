<template>
  <div id="app" @touchmove.prevent>
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
     <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MHeader from './components/m-header/m-header'
import Tab from './components/tab/tab'
import Player from './components/player/player'
export default {
  name: 'app',
  mounted() {
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        if (cordova.platformId == 'android') {
            StatusBar.backgroundColorByHexString("#31c27c");
        }
    }
  },
  components: {
    MHeader,
    Tab,
    Player
  }
}
</script>

<style>
  img[lazy=loading] {
    background: url("common/image/default.png") no-repeat center center / cover;
  }
</style>
