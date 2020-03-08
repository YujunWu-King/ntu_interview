<template>
    <div>
        <i-header :showHome=false></i-header>
        <div class="x-batch-con">
            <div class="x-batch-con_box" v-for="batch in batches" v-on:click="next(batch)">
                <a href="javascript:void(0)"><span class="x-batch-con_main">{{batch.className}} &nbsp;&nbsp; {{batch.pcName}}</span></a>
                <a href="javascript:void(0)"><span class="x-batch-next_icon"><img
                        src="../../assets/images/next.png"></span></a>
            </div>
        </div>
        <i-footer></i-footer>
    </div>
</template>

<script>
    /**
     * zf
     * 20190730
     * */
    export default {
        components: {},
        data() {
            return {
                batches: [],
                judgeType: ''
            }
        },
        mounted: function () {
            let me = this;
            let encryptUserName;
            encryptUserName = me.utils.getCookie("UserName");
            encryptUserName = me.utils.decrypt(encryptUserName);

            this.utils.request("batch", {
                "USERNAME": encryptUserName
            }, (data) => {
                //批次列表
                me.batches = data.comContent.root;
                //评委类型
                me.judgeType = data.comContent.judgeType;
            });
        },
        methods: {
            next(batch) {
                let routeName,                  //路由链接
                    classId = batch.classId,    //班级ID
                    batchId = batch.pcId;       //批次ID

                switch (this.judgeType) {
                    case "QD":
                        //签到管理员
                        routeName = "checkInList";
                        break;
                    default:
                        //评委
                        routeName = "interview";
                        break;
                }

                this.$router.push({
                    name: routeName,
                    query: {
                        classId: classId,
                        batchId: batchId
                    }
                });
            }
        }
    }
</script>

<style scoped>
    body {
        height: 100%;
    }

    .x-batch-con {
        height: calc(100% - 140px);
    }
</style>
