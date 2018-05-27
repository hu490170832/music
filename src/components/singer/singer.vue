<template>
  <div class="singer" ref="singer">
    <Listview :data='singerList' @select="selectSinger" ref="list"></Listview>
    <router-view></router-view>
  </div>
</template>
<script>
import Listview from 'base/listview/listview'
import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'
import Singer from 'common/js/singer'
import { mapMutations } from 'vuex'
import {playListMinxin} from 'common/js/mixin'

const HOT_NAME = '热门';
const HOT_SINGER_LEN = 10;
export default {
  mixins: [playListMinxin],
  data() {
    return {
      singerList: []
    }
  },
  components: {
    Listview
  },
  created() {
   this._getSingerList();
  },
  methods: {
    handlePlayList(playList) {
        const bottom = playList.length>0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
    },
    selectSinger(singer) {
      this.$router.push({path:`/singer/${singer.id}`})
      this.setSinger(singer)
    },
    _getSingerList() {
      getSingerList().then((res) => {
        // console.log(res)
        this.singerList = this._normalizeSinger(res.data.list)
      })
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item,index) => {
        if(index < HOT_SINGER_LEN){
          map.hot.items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        }
        const key = item.Findex;
        if(!map[key]) {
          map[key] = {
            title: key,
            items:[]
          }
        }
        map[key].items.push(new Singer({
          name: item.Fsinger_name,
          id: item.Fsinger_mid
        }))
      })
      var ret = [];
      var hot = [];
      // console.log(map)
      for(let key in map){
        var val = map[key]
        if(val.title.match(/[a-zA-Z]/)){
          ret.push(val)
        }else if(val.title == HOT_NAME){
          hot.push(val)
        }
      }
      ret.sort((a,b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    })
  }
}
</script>
<style scoped>
  .singer {
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%;
  }
</style>


