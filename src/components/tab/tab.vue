<template>
  <div class="tab">
      <router-link tag="div" to="/recommend">
          <span>推荐</span>
      </router-link>
       <router-link tag="div" to="/singer">
          <span>歌手</span>
      </router-link>
       <router-link tag="div" to="/rank">
          <span>排行</span>
      </router-link>
       <router-link tag="div" to="/search">
          <span>搜索</span>
      </router-link>
  </div>
</template>
<script>
export default {
  
}
</script>
<style scoped>
    .tab {
        display: flex;
        height: 40px;
        background: #fff;
        line-height: 40px;
    }
    .tab div {
        flex: 1;
        position: relative;
        text-align: center;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.8)
    }
    .tab div.router-link-active {
        color: #31c27c;
    }
    .tab div.router-link-active::after {
        content: "";
        display: block;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: #31c27c;
    }
</style>


