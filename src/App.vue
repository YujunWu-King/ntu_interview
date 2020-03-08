<template>
    <div id="app">
        <transition mode="out-in" :enter-active-class="enterActiveClass" :leave-active-class="leaveActiveClass"
                    :duration="{ enter: 600, leave: 300 }">
            <router-view class="animated"></router-view>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'app',
    data() {
        return {
            enterActiveClass: 'bounceInLeft',
            leaveActiveClass: 'fadeOut',
        }
    },
    watch: {
        //监听路由动作，设置动画效果
        '$route'(to, from) {
            const toIndex = to.meta.index;
            const fromIndex = from.meta.index;
            this.enterActiveClass = toIndex < fromIndex ? 'bounceInLeft' : 'bounceInRight';
        }
    }
}
</script>

<style lang="less">
    @import '~vux/src/styles/reset.less';

    .weui-mask, .weui-mask_transparent {
        z-index: 1500 !important
    }
</style>

<style>
	@import 'assets/css/style.css';
    @import 'assets/css/vux-common.css';
    @import 'assets/css/common.mobile.css';
    @import 'assets/css/animate.css';
</style>