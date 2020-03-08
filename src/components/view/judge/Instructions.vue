<template>
    <div class="schooled">
        <div class="account">
            <div class="x-interview-desc-t">
                <em></em>
                <span>面试说明</span>
            </div>
            <div class="x-interview-desc-con" v-html="content">
            </div>
        </div>
    </div>
</template>

<script>
    /**
     * zf
     * 20190730
     * */
    export default {
        name: "instructions",
        props: {
            classId: String,
            batchId: String
        },
        data() {
            return {
                content: "",
                pageType: "Instructions",
                userName: "",
                JGid: "",
                flag: true
            }
        },
        mounted() {
            this.userName = this.utils.decrypt(this.utils.getCookie("UserName"));
            this.JGid = this.utils.decrypt(this.utils.getCookie("JGID"));
            this.refresh();
        },
        methods: {
            refresh() {
                let me = this;
                this.utils.request("description", {
                    "CLASSID": this.classId,
                    "BATCHID": this.batchId,
                    "USERNAME": this.userName,
                    "JGID": this.JGid,
                    "PAGETYPE": this.pageType
                }, {
                    loadingText: "加载中...",
                }, (result) => {
                    if (result.comContent.flag === '0') {
                        me.$vux.toast.show({
                            type: 'text',
                            width: '250px',
                            time: 2000,
                            text: result.comContent.msg
                        });
                        me.content = '';
                    } else {
                        me.content = result.comContent.MSSM;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .account {
        width: 98%;
        height: 100%;
        margin: 0 auto;
        /*padding-bottom: 120px;*/
        padding-top: 10px;
    }

    .x-interview-desc-con {
        margin: 15px 18px;
        line-height: 26px;
    }

    .x-interview-desc-con span {
        color: #9e1e2b;
        font-size: 1rem;
    }

    .x-interview-desc-con p {
        color: #787878;
    }
</style>