<template>
    <div style="position: fixed;bottom:0px;z-index: 999;">
        <x-header :left-options="leftOptions">
            <p>©上海交通大学 上海高级金融学院 版权所有</p>
        </x-header>
        <div style="height:46px;">
            &nbsp;
        </div>
    </div>

</template>

<script>
    import {XHeader} from 'vux'

    export default {
        components: {
            XHeader
        },
        computed: {
            leftOptions() {
                return {showBack: false}
            }
        },
        props: {},
        methods: {}
    }
</script>

<style scoped>
    .vux-header {
        position: fixed;
        width: 100%;
        z-index: 999;
    }
</style>