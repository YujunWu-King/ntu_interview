<template>
    <div style="height:100%;">
        <i-header :showHome=false></i-header>
        <div class="content">
            <iframe :_src="interview.applicationFormSrc" src=""
                    ref="iframe"
                    style="width:100%;height:calc(100vh - 76px);overflow: hidden;"
                    @load="iframeLoad"
                    scrolling="no"
            ></iframe>
        </div>

        <div class="x-application-grade" v-on:click="grade">
            <a href="javascript:;" class="login_btn">打分</a>
        </div>

        <!--img class="image" id="images_src" :src="image"
             v-viewer="{
                scalable: false,
                navbar:false,
                toolbar: {
                    reset: 0,
                    prev: 0,
                    play: 0,
                    next: 0,
                    zoomIn: 'large',
                    zoomOut: 'large',
                    rotateLeft: 'large',
                    rotateRight: 'large'
                }
             }"
             v-show=false-->

    </div>
</template>

<script>
import {TransferDom} from 'vux'
import Vue from 'vue';
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

//图片预览配置
Vue.use(Viewer);
Viewer.setDefaults({
    Options: {
        "inline": true, "button": true,
        "navbar": false, "title": false, "toolbar": true, "tooltip": true,
        "movable": true, "zoomable": true, "rotatable": true, "scalable": false,
        "transition": true, "fullscreen": false, "keyboard": false, "url": "data-source"
    }
});

export default {
    directives: {
        TransferDom
    },
    components: {},
    data() {
        return {
            image: "",
            images: [""],
            classId: "",
            batchId: "",
            appInsId: "",
            interview: {}
        }
    },
    beforeDestroy() {
        window.$previewer = null;
    },
    mounted: function () {
        //绑定系统变量，iframe中调用预览附件
        window.$previewer = this;

        this.classId = this.$route.query.classId;
        this.batchId = this.$route.query.batchId;
        this.appInsId = this.$route.query.appInsId;

        //页面数据初始化
        this.initComponent();
    },
    methods: {
        /*预览图片*/
        preview(src) {
            let me = this;
            me.$vux.loading.show({
                text: "加载中",
                position: 'middle'
            })

            this.$el.querySelector('.image').onload = function () {
                let image = this;
                me.$vux.loading.hide()
                setTimeout(function () {
                    image.$viewer.show();
                }, 100);
            }

            this.image = src + "?_dc=" + new Date().getTime();
        },
        /*格式化时间*/
        formatTime(source) {
            return source <= 9 ? "0" + source : source;
        },
        /*页面初始化*/
        initComponent() {
            let me = this;

            if (this.utils.isBlank(this.batchId) || this.utils.isBlank(this.appInsId)) {
                this.$vux.alert.show({
                    title: "提示",
                    content: "参数错误，请检查后重试！"
                });
                return;
            }

            //加载评审信息
            this.utils.request("applicant", {
                classId: this.classId,
                batchId: this.batchId,
                appInsId: this.appInsId
            }, (response) => {
                if (typeof response === "object") {
                    console.log(response.comContent.appTplId)
                    //评审信息
                    me.interview = {
                        applicationFormTpl: response.comContent.appTplId,
                        applicationFormSrc: "https://chineseemba.ntusingapore.cn/dispatcher?tzParams=" +
                            encodeURIComponent(JSON.stringify({
                                "ComID": "TZ_ONLINE_REG_COM",
                                "PageID": "TZ_ONLINE_APP_STD",
                                "OperateType": "HTML",
                                "comParams": {
                                    "TZ_APP_INS_ID": this.appInsId,
                                    "TZ_APP_TPL_ID": response.comContent.appTplId,
                                    "isReview": "Y"
                                }
                            }))
                    };

                    me.$refs.iframe.src = me.interview.applicationFormSrc;

                    //加载iframe
                    setTimeout(function () {
                        me.$vux.loading.show({
                            text: "加载中",
                            position: 'middle'
                        });
                    }, 100);
                }
            });
        },
        /*iframe onload*/
        iframeLoad() {
            if (!this.utils.isBlank(this.interview.applicationFormSrc)) {
                this.$vux.loading.hide();
            }
        },
        /*进入打分页面*/
        grade() {
            this.$router.replace({
                name: "grade",
                query: {
                    classId: this.classId,
                    batchId: this.batchId,
                    appInsId: this.appInsId
                }
            });
        }
    }
}
</script>

<style scoped>
    .x-grade-xx span {
        line-height: inherit;
    }
    .content {
        -webkit-overflow-scrolling: touch;
        overflow: hidden;
    }
</style>