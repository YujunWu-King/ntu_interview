<template>
    <div class="x-header-wrap">
        <x-header
                :left-options="leftOptions"
                @on-click-back="onClickBack">
            {{this.$route.meta.title}}
            <a slot="right" v-on:click="home" v-if="showHome">
                <fa-icon icon="home"/>&nbsp;首页
            </a>
            <a slot="right" v-on:click="logout">
                <fa-icon icon="power-off"/>&nbsp;退出
            </a>
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
                let isGradePage = this.$route.name === "grade";
                let isApplicationPage = this.$route.name === "applicationForm";
                let isBatchListPage = this.$route.name === "batch";

                return {
                    preventGoBack: isGradePage || isApplicationPage || isBatchListPage,
                    backText: isGradePage ? "返回考生列表" : (isApplicationPage ? "返回考生列表" : "返回"),
                    showBack: !isBatchListPage
                }
            }
        },
        props: {
            showHome: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            onClickBack() {
                switch (this.$route.name) {
                    case "grade":
                        //取消实时保存功能 this.$parent.doSave(false)
                        this.$router.replace({
                            name: "interview",
                            query: {
                                classId: this.$route.query.classId,
                                batchId: this.$route.query.batchId,
                                tab: "applicants"
                            }
                        });
                        break;
                    case "applicationForm":
                        this.$router.replace({
                            name: "interview",
                            query: {
                                classId: this.$route.query.classId,
                                batchId: this.$route.query.batchId,
                                tab: "applicants"
                            }
                        });
                        break;
                    default:
                        return;
                }
            },
            home() {
                //todo
            },
            logout() {
                let me = this;

                this.$vux.confirm.show({
                    title: "确认",
                    content: "确定退出吗？",
                    onConfirm() {
                        me.doLogout(me);
                    }
                })
            },
            doLogout(me) {
                this.utils.request("logout", {}, function (data) {
                    me.utils.clearSessionProps();
                    me.$router.push({path: "/login"});
                });
            }
        }
    }
</script>

<style scoped>
    .x-header-wrap{
        height: 46px;
    }
    .vux-header {
        position: fixed;
        width: 100%;
        z-index: 999;
    }
</style>