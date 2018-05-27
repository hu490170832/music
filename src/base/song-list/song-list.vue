<template>
  <div class="song-list">
      <ul>
          <li @click="selectItem(song,index)" v-for="(song,index) in songs" class="item">
              <div class="rank" v-show="rank">
                  <span :class="getRankCls(index)">{{getRankText(index)}}</span>
              </div>
              <div class="content">
                  <h2 class="name">{{song.name}}</h2>
                  <p class="desc">{{getDesc(song)}}</p>
              </div>
          </li>
      </ul>
  </div>
</template>
<script>
export default {
  props: {
      songs: {
          type: Array,
          default: []
      },
      rank: {
          type: Boolean,
          default: false
      }
  },
  methods: {
      selectItem(item,index){
          this.$emit('select',item,index)
      },
      getDesc(song) {
          return `${song.singer}·${song.album}`
      },
      getRankCls(index) {
          if(index<=2) {
              return `icon icon${index}`
          }else {
              return 'text'
          }
      },
      getRankText(index) {
          if(index>2) {
              return index+1
          }else {
              
          }
      }
  }
}
</script>
<style scoped>
   .song-list .item {
       display: flex;
        align-items: center;
        box-sizing: border-box;
        height: 64px;
        font-size: 14px;
    }
    .rank {
        flex: 0 0 25px;
        width: 25px;
        margin-right: 30px;
        text-align: center;
    }
        
    .rank .icon {
        display: inline-block;
        width: 25px;
        height: 24px;
        background-size: 25px 24px;
    }
    .rank .icon.icon0 {
        background-image: url('first@2x.png')
    }
        
    .rank .icon.icon1 {
        background-image: url('second@2x.png')
    }
        
    .rank .icon.icon2 {
        background-image: url('third@2x.png')
    }
        
    .rank .text {
        color: #ffcd32;
        font-size: 18px;
    }
        
    .content .name {
        font-size: 16px;
        color: #000;
        font-weight: 300;
    }
    .content .desc {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin-top: 4px;
        color: #777;
        font-size: 12px;
    }
</style>


