<template>
    <div class="school_no">
        <!--        <vuecanvas v-show='canvasview&&!questionview' v-on:close="closeQ" v-on:save="saveQ"></vuecanvas>-->
        <div class="account" v-show='!canvasview&&!questionview'>
            <div class="tab-collet">
                <table class="table-tj" style="width:100%; border:1px #ccc solid;table-layout: fixed;font-size: 15px;">
                    <thead style="width:100%; border:1px #ccc solid;">
                    <tr style="background:#f2f2f2;">
                        <template v-for="(thNAME,i) in tbHeader">
                            <th :style="{'text-decoration':(i!=0?'underline':'')}"
                                @click="gradeStandard(headerSins[i],i)" class="thHF">{{thNAME}}
                            </th>
                        </template>
                    </tr>
                    </thead>
                    <tbody>

                    <template v-for="(tb,index) in tbBody">
                        <tr :style="{'background':tbBody[index][1]==-2?'#ffecee':''}">
                            <td v-html="tbBody[index][0]+(tbBody[index][1]<0?'':('<br/>('+(+tbBody[index][1]).toFixed(0))+'分)')">
                            </td>
                            <template v-for="(t,i) in tbBody[index]">
                                <td v-html="t" v-show="i>1"></td>
                            </template>
                        </tr>
                    </template>
                    <tr>
                        <template v-for="(thNAME,i) in personCom">
                            <td>{{thNAME}}</td>
                        </template>
                    </tr>
                    <tr>
                        <template v-for="(thNAME,i) in personPos">
                            <td>{{thNAME}}</td>
                        </template>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="dftj_box" v-show="VIEW" style="margin-top: 30px;">
                <table class="table-tj" style="width:100%; border:1px #ccc solid;table-layout: fixed;">
                    <thead style="width:100%; border:1px #ccc solid;">
                    <tr style="background:#f2f2f2;">
                        <template v-for="fbL in fenbuL">
                            <th>{{fbL}}</th>
                        </template>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <template v-for="(fbD,i) in fenbuD">
                            <td v-if="i==0">{{fbD.bl}}</td>
                            <td v-else="">{{fbD.per}}人({{(+fbD.bl).toFixed(0)}}%)</td>
                        </template>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="dftj_btn" v-show="!canvasview&&!questionview &&!this.submitState">
                <a href="#" @click.prevent="submitQuest">
                    <span :class="{'TJED_T':TJED,'TJED_F':!TJED}">提交</span>
                </a>
            </div>

            <div v-transfer-dom>
                <x-dialog v-model="submitCanvasView"
                          :dialog-style="{'max-width': '100%', width: '100%', height: '50%', 'background-color': 'transparent'}">
                    <Canvas ref="can" 
                            @save="sureSubmitQuest($event)" 
                            @close="cancelCheckIn" 
                            :name="userName">
                    </Canvas>
                </x-dialog>
            </div>
        </div>
    </div>
</template>
<script>
    //mport Canvas from './Canvas'
    import {Confirm,XDialog,TransferDom} from 'vux'
    import Canvas from '../admin/Canvas'

    // 引入基本模板
    let echarts = require('echarts/lib/echarts')
    // 引入柱状图组件
    //require('echarts/lib/chart/bar')
    //require('echarts/lib/chart/line')
    // 引入提示框和title组件
    // require('echarts/lib/component/tooltip')
    // require('echarts/lib/component/title')

    export default {
        name: "collect",
        directives: {
            TransferDom
        },
        components: {
            Confirm,
            Canvas,
            TransferDom,
            XDialog
        },
        props: {
            classId: String,
            batchId: String,
            strPsSm: String
        },
        data() {
            return {
                pageType: 'Collect',
                userName: "",
                JGid: "",
                selectList: "",
                tbHeader: [],
                tbBody: [],
                personPos: [],
                personCom: [],
                //tbZf: [],
                TJED: false,
                VIEW: false,
                canvasview: false,
                questionview: false,
                submitCanvasView:false,
                submitState:false,
                rate: [],
                dataTime: '',
                fenbu: '',
                fenbuL: ['等级'],
                fenbuB: ['标准'],
                fenbuD: [{
                    'per': '',
                    'bl': '比例'
                }],
                texta1: "",
                texta2: "",
                texta3: "",
                texta4: "",
                texta5: "",
                textaL1: 0,
                textaL2: 0,
                textaL3: 0,
                textaL4: 0,
                textaL5: 0,
                nullC: '',
                headerSins: []
            }
        },
        mounted() {
            this.userName = this.utils.decrypt(this.utils.getCookie("UserName"));
            this.JGid = this.utils.decrypt(this.utils.getCookie("JGID"));
            this.refresh();
        },
        methods: {
            submitQuest(item){
                this.$refs.can.close();
                if (!this.canvasview && !this.questionview && !this.submitCanvasView) {
                    this.submitCanvasView = true;
                } 
            },
            cancelCheckIn() {
                this.submitCanvasView = false;
            },
            //确认提交汇总
            sureSubmitQuest(data) {
                let me = this
                me.utils.request("description", {
                        "CLASSID": me.classId,
                        "BATCHID": me.batchId,
                        "USERNAME": me.userName,
                        "JGID": me.JGid,
                        "PAGETYPE": me.pageType,
                        "mothed": "submitCollect",
                        "signature": data
                    }, {
                        loadingText: "提交中",
                    }, (result) => {
                        if (result.comContent.flag === '0') {
                            me.$vux.toast.show({
                                type: 'text',
                                width: '250px',
                                time: 2000,
                                text: result.comContent.msg
                            });
                        } else {
                            me.$vux.toast.show({
                                type: 'text',
                                width: '250px',
                                time: 2000,
                                text: result.comContent.msg
                            });
                             me.submitState = true;
                        }
                        me.submitCanvasView = false
                    });
            },
            //刷新页面
            refresh(MSZSPACE) {
                let me = this;
                this.utils.request("description", {
                    "CLASSID": this.classId,
                    "BATCHID": this.batchId,
                    "USERNAME": this.userName,
                    "JGID": this.JGid,
                    "PAGETYPE": this.pageType,
                    "MSZSPACE": MSZSPACE || '',
                    "mothed": "initPageData"
                }, {
                    loadingText: "加载中...",
                }, (result) => {
                    this.test = this.test + 1;
                    if (result.comContent.flag === '0') {
                        me.$vux.toast.show({
                            type: 'text',
                            width: '250px',
                            time: 2000,
                            text: result.comContent.msg
                        });
                    } else {
                        me.submitState = result.comContent.pwSubState === 'Y'?true:false;
                        me.tbHeader = result.comContent.headerS;
                        me.tbBody = result.comContent.scoreS;
                        me.personPos = result.comContent.personPos;
                        me.personCom = result.comContent.personCom;
                        me.headerSins = result.comContent.headerSins;
                        let MSZSPACES = result.comContent.MSZSPACES;
                        let MSZSPACE = result.comContent.MSZSPACE;
                        me.$emit("listenMszSd", {'MSZSPACES': MSZSPACES, 'MSZSPACE': MSZSPACE});
                    }
                });
            },
            //评分标准
            gradeStandard(ins, i) {
                let me = this;
                if (!i || !+i) {
                    return false;
                } else {
                    this.$router.push({
                        name: "grade",
                        query: {
                            classId: me.classId,
                            batchId: me.batchId,
                            appInsId: ins,
                            type: "summary"
                        }
                    });
                }
            }
        }
    }
</script>

<style scoped>
    td, th {
        border: 1px solid #CCC;
        word-wrap: break-word;
    }

    .x-group-stu_con_r_b_icon1 {
        display: flex;
        margin-top: 10px;
        position: fixed;
        bottom: 15px;
    / / left: 35 %;
        width: 91.5%;
    }

    .x-group-stu_con_r_b_icon1 span {
        flex: 1;
        width: 150px;
        height: 40px;
        display: inline-block;
        margin: 10px;
        text-align: center;
        border-radius: 5px;
        line-height: 40px;
        color: #fff;
        box-shadow: 2px 2px 5px 2px #888888;
    }

    .x-group-stu_icon_box {
        display: block;
        margin: 0 auto;
        padding-bottom: 20px;
    }

    .name_css {
        color: #9e1e2b;
        cursor: pointer;
        text-decoration: underline;
    }

    .zf_css {
        color: #ffecee;
    }

    .TJED_F {
        background: #9e1e2b;
    }

    .TJED_T {
        background: #787878;
    }

    .dftj_btn {
        display: block;
        position: fixed;
        bottom: 60px;
        left: 45%;
    }

    .dftj_btn span {
        display: block;
        border-radius: 5px;
        width: 120px;
        height: 38px;
        text-align: center;
        line-height: 38px;
        color: #fff;
        z-index: 666;
        box-shadow: 2px 2px 5px 2px #888888;
    }

    .account {
        width: 98%;
        height: 100%;
        margin: 0 auto;
        padding-bottom: 10px;
        padding-top: 10px;
    }

    .school_on {
        background: #fff !important;
        color: #787878 !important;
    }

    .statistics_con {
        margin: 25px;
    }

    .safe_slide {
        width: 100%;
        height: 30px;
        padding: 8px 0;
        border-bottom: 1px solid #ccc;
        color: #787878;
        font-size: 1rem;
        cursor: pointer;
    }

    .safe_slide em {
        display: inline-block;
        width: 3px;
        height: 20px;
        background: #9e1e2b;
    }

    .arrow_slide {
        margin-right: 10px;
        margin-top: 8px;
        float: right;
        width: 1rem;
        height: 1rem;
        /*background: url(../images/a_s.png) no-repeat center center;*/
        background-size: 200%;
        background-position: 0 2px;
    }

    .arrow_up {
        background-position: -1rem 2px;
    }

    .list_menu {
        display: none;
    }

    .one {
        width: 90px;
    }

    .notone {
        max-width: 100px;
    }

    .dftj_bg {
        margin-bottom: 20px;
        color: #666;
    }

    .table-tj {
        text-align: center;
    }

    .table-tj td {
        padding: 15px 7px;
    }

    .zf_td {
        background: #ffecee;
    }

    .td_left {
        text-align: left;
    }

    .th_title {
        line-height: 60px;
        font-size: 1.5em;
        font-weight: bolder;
    }

    #quest textarea {
        display: block;
        border: 0;
        resize: none;
        width: 100%;
        color: inherit;
        font-size: .9em;
        line-height: inherit;
        outline: 0;
    }

    .school_no {
        padding-bottom: 80px;
    }

    .tab-collet th {
        width: 110px;
    }

    .thHF {
        height: 50px;
        font-size: 17px;
    }
</style>