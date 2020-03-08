<template>
    <div>
        <i-header :showHome=false></i-header>
        <div class="x-not-checkedin">
            <div class="search_box">
                <group class='timesModel'>
                    <selector
                            v-model="times"
                            :options="groupList"
                            @on-change="search" 
                    />
                </group>
                <search
                        v-model="value"
                        :auto-fixed=false
                        @on-submit="onSubmit"
                        @on-blur="onBlur"
                        ref="search">
                </search>
                <div class="x-icon-common" v-on:click="onSubmit" v-show="false"><a
                        href="javascript:void(0)" class="x-grade-bottom_icon_ck" style="line-height: 28px;">搜索</a>
                </div>
            </div>

            <load-more :show-loading="false" :tip="loadTip" background-color="#fbf9fe"
                       v-show="loadShow&&!list.length" style="position: absolute;top:40%;left:0;right:0"></load-more>

            <div class="x-not-checkedin-con_box" v-for="item in list">
                <div class="x-not-checkedin-con_l">
                    <img :src="item.photo" width="63" height="85">
                </div>
                <div class="x-not-checkedin-con_r">
                    <div class="x-not-checkedin-con_r_t">
                        <div class="x-not-checkedin-con_r_t_l">
                            <p class="name-bord" style="flex:1">姓名：{{item.name}}</p>
                            <p>身份证号：{{wrapNationId(item.nationalId)}}</p>
                        </div>
                        <div class="x-not-checkedin-con_r_t_l">
                            <p style="flex:1">单位：{{item.company}}</p>
                            <p>所属组：{{item.groupDesc}}</p>
                        </div>

                        <div v-bind:class="item.checkInStatus!=='Y'?'x-not-checkedin-con_r_t_r':'x-not-checkedin-con_r_t_r_cx'">
                            <a href="javascript:void(0);" v-on:click="checkIn(item)">
                                <span v-if="item.checkInStatus!=='Y'" class="x-checkin_icon">签到</span>
                                <span v-if="item.checkInStatus==='Y'" class="x-checkin-revoke_icon">撤销签到</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <i-footer></i-footer>
        <div v-transfer-dom>
            <x-dialog v-model="canvasView"
                      :dialog-style="{'max-width': '100%', width: '100%', height: '50%', 'background-color': 'transparent'}"
            >
                <Canvas ref="can" v-on:save="sureCheckIn($event)" v-on:close="cancelCheckIn" :name="item.name"></Canvas>
            </x-dialog>
        </div>

    </div>
</template>

<script>
import {Group, Search, Selector, LoadMore, Confirm, XDialog, TransferDom} from 'vux'
import Canvas from './Canvas'

export default {
    directives: {
        TransferDom
    },
    components: {
        Group,
        Search,
        Selector,
        LoadMore,
        Canvas,
        Confirm,
        XDialog
    },
    data() {
        return {
            times: 'all',
            value: '',
            canvasView: false,
            item: '',
            list: [],
            groupList:[],
            loadShow: true,
            loadTip: '请通过身份证号后四位或姓名进行搜索',
            classId: this.$route.query.classId || "",
            batchId: this.$route.query.batchId || "",
        }
    },
    mounted: function () {
        this.times ="all";
        this.search();
    },
    methods: {
        //搜索
        search() {
            let me = this;
            this.utils.request("checkIn", {
                type: "list",
                classId: me.classId,
                batchId: me.batchId,
                key: me.$refs.search.value,
                times: me.times
            }).then(data => {
                me.groupList = [];
                me.list = data.comContent.item;
                me.list = me.list.map(item=>{
                    if(item.photo === null || item.photo === ""){
                        item.photo = "/statics/images/appeditor/bjphoto.jpg";
                    }
                    return item
                })
                for(let group of data.comContent.groupList){
                    me.groupList.push({key:group.TZ_GROUP_ID,value:group.TZ_GROUP_DESC})
                }
                me.groupList.push({key:'all',value:'全部'})
                me.list = me.list.slice(0, 200);
                if (me.list.length === 0) {
                    me.loadShow = true;
                    me.loadTip = '未搜索到符合条件的考生，请通过身份证号后四位或姓名进行搜索';
                } else {
                    me.loadShow = false;
                }
            });
        },
        //签到
        checkIn(item) {
            let me = this;
            me.item = item;
            this.$refs.can.close();
            if (item.checkInStatus === "Y") {
                me.sureCheckIn(item);
            } else {
                me.canvasView = true;
            }
        },
        cancelCheckIn() {
            this.canvasView = false;
        },
        sureCheckIn: function (data) {
            let me = this;
            let item = me.item;
            if (item.checkInStatus === "Y") {
                me.$vux.confirm.show({
                    title: "确认",
                    content: "确认撤销签到？",
                    onConfirm() {
                        me.utils.request("checkIn", {
                            type: "checkIn",
                            classId: me.classId,
                            batchId: me.batchId,
                            appInsId: item.appInsId,
                            operation: "revoke",
                            lastmant: me.utils.decrypt(me.utils.getCookie("UserName"))
                        }).then(data => {
                            if (data.comContent.errorCode == 0) {
                                me.$vux.toast.show({
                                    type: 'success',
                                    text: data.comContent.error_decription,
                                    width: "300px",
                                    position: 'top'
                                })
                                item.checkInTime = '';
                                item.checkInStatus = 'N';
                                me.item = '';
                            } else {
                                me.$vux.toast.show({
                                    type: 'warn',
                                    text: data.comContent.error_decription,
                                    width: "300px",
                                    position: 'top'
                                })
                            }
                        });
                    }
                });
            } else {
                me.utils.request("checkIn", {
                    type: "checkIn",
                    classId: me.classId,
                    batchId: me.batchId,
                    appInsId: item.appInsId,
                    operation: "checkIn",
                    signature: data
                }).then(data => {
                    if (data.comContent.errorCode != 0) {
                        me.$vux.toast.show({
                            type: 'warn',
                            text: data.comContent.error_decription,
                            width: "300px",
                            position: 'top'
                        })
                    } else {
                        me.$vux.toast.show({
                            type: 'success',
                            text: data.comContent.error_decription,
                            width: "300px",
                            position: 'top'
                        });
                        item.checkInTime = data.comContent.checkInTime;
                        item.checkInStatus = 'Y';
                        me.canvasView = false;
                        me.item = '';
                    }
                });
            }
        },
        setFocus() {
            this.$refs.search.setFocus()
        },
        onSubmit() {
            this.$refs.search.setBlur();
            this.search();
        },
        onBlur(){
            this.$refs.search.handleResultClick()
        },
        wrapNationId(nationalId) {
            nationalId = nationalId || "";
            return nationalId.replace(/^(\d{6})(\d*)(\d{4}|\d{3}x)$/i, "$1********$3");
        }
    }
}

</script>

<style scoped>
    .name-bord {
        font-weight: bolder;
        color: #9e1e2b;
    }

    .timesModel {
        width: 120px;
    }

    .timesModel >>> .weui-cells {
        margin-top: 0 !important;
        padding: 4px 0;
        background: #EFEFF4;
    }
</style>
