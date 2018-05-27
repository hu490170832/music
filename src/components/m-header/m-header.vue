<template>
    <div id="Header">
      <div class="icon"></div>
      <h1>HC Music</h1>
    </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #Header {
    position: relative;
    height: 44px;
    background: #31c27c;
    text-align: center;
    color: #fff;
    font-size: 18px;
    line-height: 44px;
  }
  .icon {
    display: inline-block;
    vertical-align: top;
    margin-top: 6px;
    width: 30px;
    height: 32px;
    margin-right: 9px;
    background: url("logo@2x.png") no-repeat left top / cover;
  }
  #Header h1 {
    display: inline-block;
    vertical-align: top;
  }
     
</style>
