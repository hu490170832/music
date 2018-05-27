<template>
  <div class="music-list">
      <div class="back">
          <i class="icon-back iconfont" @click="back"></i>
          <h1 class="title" v-html="title"></h1>
      </div>
      <div class="bg-image" :style="bgStyle" ref="bgImage">
          <div class="play-wrapper">
              <div class="play"  v-show="songs.length>0" ref="playBtn" @click="random">
                  <i class="play-icon iconfont">&#xe605;</i>
                  <span class="text">随机播放全部</span>
              </div>
          </div>
          <div class="filter" ref="filter"></div>
      </div>
      <div class="bg-layer" ref="bgLayer"></div>
      <scroll @scroll="scroll" :probeType="probeType" :listenScroll="listenScroll " :data="songs" class="list" ref="list">
          <div class="song-list-wrapper">
              <song-list :rank='rank' @select="selectItem" :songs='songs'></song-list>
          </div>
          <div class="loading-container" v-show="!songs.length">
              <loading></loading>
          </div>
      </scroll>
  </div>
</template>
<script>
import Loading from 'base/loading/loading'
import SongList from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'
import {prefixStyle} from 'common/js/dom'
import {mapActions} from 'vuex'
import {playListMinxin} from 'common/js/mixin'

const RESERVED_HEIGHT = 40
const transform = prefixStyle('transform')
export default {
  mixins: [playListMinxin],
  props: {
      bgImage: {
          type: String,
          default: ''
      },
      songs: {
          type: Array,
          default: []
      },
      title: {
          type: String,
          default: ''
      },
      rank: {
          type: Boolean,
          default: false
      }
  },
  data() {
      return {
          scrollY: 0
      }
  },
  created() {
      this.probeType = 3
      this.listenScroll = true
  },
  mounted() {
        this.imageHeight = this.$refs.bgImage.clientHeight
        this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT
        this.$refs.list.$el.style.top = `${this.imageHeight}px`
  },
  computed: {
      bgStyle() {
          return `background: url(${this.bgImage}) no-repeat left top / cover`
      }
  },
  methods: {
      handlePlayList(playList) {
          const bottom = playList.length>0 ? '60px' : ''
          this.$refs.list.$el.style.bottom = bottom
          this.$refs.list.refresh()
      },
      scroll(pos) {
          this.scrollY = pos.y
      },
      back() {
          this.$router.back()
      },
      selectItem(item,index) {
          this.selectPlay({
              list: this.songs,
              index
          })
      },
      random() {
          this.randomPlay({
              list: this.songs 
          })
      },
      ...mapActions([
          'selectPlay',
          'randomPlay'
      ])
  },
  watch: {
      scrollY(newY) {
            var translateY = Math.max(this.minTransalteY,newY);
            var zIndex = 0;
            var scale = 1;
            const percent = Math.abs(newY / this.imageHeight)
            let blur = 0
            if (newY > 0) {
              scale = 1 + percent
              zIndex = 10
            } 
            // else {
            //     blur = Math.min(20, percent * 20)
            // }
            // this.$refs.filter.style['backdrop-filter'] = `blur(${blur}px)`
            // this.$refs.filter.style['webkitBackdrop-filter'] = `blur(${blur}px)`
            if(newY < this.minTransalteY) {
                zIndex = 10;
                this.$refs.bgImage.style.paddingTop = 0;
                this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;
                this.$refs.playBtn.style.display = 'none'
            }else {
                this.$refs.bgImage.style.paddingTop = '70%';
                this.$refs.bgImage.style.height = 0;
                this.$refs.playBtn.style.display = ''
            }
            this.$refs.bgImage.style.zIndex = zIndex;

            this.$refs.bgLayer.style[transform] = `translate3d(0,${translateY}px,0)`;

            this.$refs.bgImage.style[transform] = `scale(${scale})`;
          
      }
  },
  components: {
      SongList,
      Scroll,
      Loading
  }
}
</script>
<style scoped>
    .music-list {
        position: fixed;
        z-index: 100;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: #fff;
    }
    .back {
        width: 100%;
        top: 0;
        height: 44px;
        position: absolute;
        text-align: center;
        line-height: 44px;
        z-index: 999;
    }
    .icon-back {
        position: absolute;
        left: 0;
        color: #ffcd32;
        padding-left: 15px;
        padding-right: 15px;
        cursor: pointer;
    }
    .back h1 {
        color: #fff;
        font-size: 18px;
        padding-left: 38px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .bg-image {
        padding-top: 70%;
        position: relative;
        width: 100%;
        height: 0;
        transform-origin: top;
    }
    .play-wrapper {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 20px;
        z-index: 100;
    }
    .play-wrapper .play {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid #ffcd32;
        color: #ffcd32;
        border-radius: 100px;
    }
    .song-list-wrapper {
        padding: 20px 30px;
    }
    .list {
        position: fixed;
        top: 244px;
        bottom: 0;
        width: 100%;
        background: #fff;
    }
    .filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(7,17,27,0.2);
    }
    .bg-layer {
        position: relative;
        height: 100%;
        background: #fff;
    }
    .loading-container {
        height: 100%;
        display: flex;
        align-items: center;
    }
</style>


