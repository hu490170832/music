<template>
    <scroll class="listview" :data = 'data' ref="listview" :listenScroll="listenScroll" :probe-type='probeType' @scroll="scroll">
        <div class="singer-list-container">
            <div v-for="group in data" class='list-group' ref="listGroup">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
                        <img v-lazy="item.avatar" class="avatar">
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <ul class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent='onShortcutTouchMove'>
            <li v-for="(item,index) in shortcutList" :data-index = 'index' :class="{active: currentIndex==index}">
                {{item}}
            </li>
        </ul>
        <div class="fixed-title" v-show="fixedText" ref="fixed">
            <h2>{{fixedText}}</h2>
        </div>
        <div class="loading-container" v-show="!data.length">
            <loading></loading>
        </div>
    </scroll>
</template>
<script>
import Scroll from 'base/scroll/scroll'
import {getData} from 'common/js/dom'
import Loading from 'base/loading/loading'

const ANCHOR_HEIGHT = 18
const FIXED_HEIGHT = 30

export default {
    created() {
        this.touch = {}
        this.probeType = 3
        this.listenScroll = true
        this.listHeight = []
    },
    data() {
        return {
            scrollY: -1,
            currentIndex: 0,
            diff: -1
         }
     },
    props: {
        data: {
            type: Array,
            default:[]
        }
    },
    components: {
        Scroll,
        Loading
    },
    computed: {
        shortcutList() {
            return this.data.map((group) => {
                return group.title.substring(0,1)
            })
        },
        fixedText() {
            if(this.scrollY>0){
                return ''
            }
            return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
        }
    },
    methods: {
        selectItem(item) {
            this.$emit("select",item)
        },
        onShortcutTouchStart(e) {
            let anchorIndex = getData(e.target, 'index');
            let firstTouch = e.touches[0]
            this.touch.y1 = firstTouch.pageY 
            this.touch.anchorIndex = anchorIndex
            this._scrollTo(anchorIndex)
            // console.log(anchorIndex)
        },
        onShortcutTouchMove(e) {
            let firstTouch = e.touches[0]
            this.touch.y2 = firstTouch.pageY 
            let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
            let anchorIndex = parseInt(this.touch.anchorIndex) + delta
            // console.log(anchorIndex)
            this._scrollTo(anchorIndex)
        },
        scroll(pos){
            this.scrollY = pos.y
        },
        refresh() {
            this.$refs.listview.refresh()
        },
        _scrollTo(index) {
            if(!index && index !==0) {
                return 
            }
            this.scrollY = -this.listHeight[index]
            this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0);
        },
        _calculateHeight() {
            this.listHeight = []
            const list = this.$refs.listGroup
            let height = 0
            this.listHeight.push(height)
            for( let i=0; i<list.length; i++) {
                let item = list[i]
                height += item.clientHeight
                this.listHeight.push(height)
            }
        }
    },
    watch: {
        data() {
            setTimeout(() => {
                this._calculateHeight()
            },20)
        },
        scrollY(newY){
            let listHeight = this.listHeight
            //当滚动到顶部，newY>0
            if(newY>0) {
                this.currentIndex = 0;
                return;
            }
            //在中间部分滚动
            for(let i= 0; i<listHeight.length-1; i++) {
                let height1 = listHeight[i];
                let height2 = listHeight[i+1];
                if(-newY>=height1 && -newY<height2 ) {
                    this.currentIndex = i
                    this.diff = height2 + newY 
                    return
                }
            }
            //当滚动到底部，而且-new大于最后一个元素的上线
            this.currentIndex = listHeight.length - 2
        },
        diff(newVal) {
            let fixedTop = (newVal>0 && newVal<FIXED_HEIGHT) ? newVal -FIXED_HEIGHT : 0
            if(this.fixedTop === fixedTop) {
                return
            }
            this.fixedTop = fixedTop
            this.$refs.fixed.style.transform = `translate3d(0,${this.fixedTop}px,0)`
        }
    }
}
</script>
<style scoped>
    .listview {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #fbfbfb;
    }
    .list-group {
        background: #fbfbfb;
    }
    .list-group-title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: 12px;
        color: #000;
        background: #f3f3f3;
    }
    .list-group-item {
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;
    }

    .list-group-item .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
    .list-group-item .name {
        margin-left: 20px;
        font-size: 14px;
    }
    .list-shortcut {
        position: absolute;
        z-index: 30;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        padding: 10px 0;
        border-radius: 10px;
        text-align: center;
        background: #f3f3f3;
        font-family: Helvetica;
    }
    .list-shortcut li {
        height: 14px;
    }
    .list-shortcut li.active {
        color: #31c27c;
    }
    .fixed-title {
        position: absolute;
        width: 100%;
        top: 0;
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: 12px;
        color: #000;
        background: #f3f3f3;
        z-index: 100;
    }
    .loading-container {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 100%;
    }

</style>

