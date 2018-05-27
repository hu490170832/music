<template>
  <div class="recommend">
    <scroll class="scroll" ref="scroll" :data='discList'>
      <div class="recommend-content">
          <div v-if="recomments.length" class="slider-wrapper">
              <slider interval='1000'>
                <div v-for="item in recomments">
                    <a :href="item.linkUrl">
                        <img :src="item.picUrl" alt="">
                    </a>
                </div>
              </slider>
          </div> 
          <div class="recommend-list" >
            <h2 class="list-title">热门歌单推荐</h2>
            <div class="newSongList">
              <ul>
                <li @click="selectItem(item)" v-for="item in discList">
                  <div class="songImg">
                    <img v-lazy='item.imgurl' alt="">
                  </div>
                  <div class="text">
                    <h3>{{item.creator.name}}</h3>
                    <p>{{item.dissname}}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div> 
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script>
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll';
import Slider from "base/slider/slider";
import { getRecommend, getDiscList } from "api/recommend";
import { ERR_OK } from "api/config";
import BScroll from 'better-scroll'
import {playListMinxin} from 'common/js/mixin'
import {mapMutations} from 'vuex'
export default {
  mixins: [playListMinxin],
  data() {
    return {
      recomments: [],
      discList: []
    };
  },
  components: {
    Slider,
    Scroll,
    Loading
  },
  created() {
    this._getRrecommend();
    this._getDisList();
   
  },
  methods: {
    handlePlayList(playList) {
        const bottom = playList.length>0 ? '60px' : ''
        this.$refs.scroll.$el.style.bottom = bottom
        this.$refs.scroll.refresh()
    },
    selectItem(item) {
      this.$router.push({
        path:`/recommend/${item.dissid}`
      })
      this.setDisc(item)
    },
    _getRrecommend() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.recomments = res.data.slider;
        }
      });
    },
    _getDisList() {
      getDiscList().then(res => {
        console.log(res)
        if (res.code === ERR_OK) {
          this.discList = res.data.list;
          console.log(res)
        }
      });
    },
    ...mapMutations({
      setDisc: "SET_DISC"
    })
  }
};
</script>
<style scoped>
.recommend-list {
  background: url(bg_detail.jpg) repeat-x 50% top;
}
.scroll {
  overflow: hidden;
  position: fixed;
  top: 84px;
  bottom: 0;
  width: 100%;
}
.list-title {
  height: 65px;
  line-height: 65px;
  text-align: center;
  font-size: 16px;
  color: #000;
  font-weight: normal;
}
.newSongList li {
  display: flex;
  box-sizing: border-box;
  padding: 0 20px 20px 20px;
}
.newSongList li .songImg {
  width: 60px;
  height: 60px;
  padding-right: 20px;
}
.newSongList li .songImg img {
  width: 60px;
  height: 60px;
}
.newSongList li .text {
  display: flex;
  justify-content: center;
  flex: 1;
  flex-direction: column;
}
.newSongList li .text h3 {
  margin-bottom: 10px;
  color: #000;
}
.loading-container {
  width: 100%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

</style>

