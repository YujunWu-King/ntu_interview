<template>
    <div id="app-4">
        <i-header :showHome=false></i-header>
    
        <div class="timer" v-show="isShow">
            <div class="time-box">
                <span id="name">{{startTime.name}}</span>
                <span>面试时间 </span>
                <span id="time">{{time}}</span>
            </div>
        </div>


        <div id="my-tab" class="Tab_school" style="margin:20px; height:90%;position: relative;z-index: 0;">
            <div class="msz_select" v-show="num==2">
                <span>面试组：</span>
                <select @change="selecMsz" v-model="mszSelect">
                    <template v-for="(msz,index) in mszdata">
                        <option :value="msz.ID" :aria-selected="index===0">{{msz.DESCR}}</option>
                    </template>
                </select>
            </div>
            <div class="msz_select" v-show="num==3">
                <span>面试组：</span>
                <select @change="selecMszSd" v-model="MSZSPACE">
                    <template v-for="(msz,index) in MSZSPACEdata">
                        <option :value="msz.MSZSPACE" :aria-selected="index===0">{{msz.DESCR}}</option>
                    </template>
                </select>
            </div>
            <ul class="tab-tit">
                <li @click="changeTab(1)" :class="{'school_on':num==1}">
                    面试说明
                </li>
                <li @click="changeTab(2)" :class="{'school_on':num==2}">
                    面试考生
                </li>
                <li @click="changeTab(3)" :class="{'school_on':num==3}">
                    汇总统计
                </li>
            </ul>
            <div class="tabN_school">
                <div v-show="num==1">
                    <instructions ref="instructions1" v-show="num==1" :batchId="batchId"
                                  :classId="classId"></instructions>
                </div>
                <div v-show="num==2">
                    <studentsList ref="studentsList2" v-show="num==2" :batchId="batchId" :classId="classId"
                                  v-on:listenMsz="listenMszMsg"></studentsList>
                </div>
                <div v-show="num==3">
                    <collect ref="collect3" v-show="num==3" :batchId="batchId" :classId="classId"
                             v-on:listenMszSd="listenMszSd"></collect>
                </div>
            </div>
        </div>
        <i-footer></i-footer>
    </div>
</template>
<script>
    import {Group, Cell} from 'vux'
    import Instructions from './Instructions'
    import StudentsList from './StudentsList'
    import Collect from './Collect'
    import axios from 'axios'
    /**
     * zf
     * 20190730
     * */
    export default {
        components: {
            Group,
            Cell,
            'instructions': Instructions,
            'studentsList': StudentsList,
            'collect': Collect
        },
        data() {
            return {
                num: 1,
                classId: this.$route.query.classId,
                batchId: this.$route.query.batchId,
                mszdata: [],
                mszSelect: "",
                MSZSPACE: "",
                MSZSPACEdata: [],
                one: true,
                startTime:{},
                time:'',
                seconds:'',
                isShow:false
            }
        },
        mounted() {
            if (this.$route.query.tab === "summary") {
                this.num = 3;
            }
            if (this.$route.query.tab === "applicants") {
                this.num = 2;
            }     
        },
        created(){
             this.getStartTime()    
        },
        methods: {
            changeTab(i) {
                this.num = i;
                switch (i) {
                    case 1:
                        this.$refs.instructions1.refresh();
                        break;
                    case 2:
                        this.$refs.studentsList2.refresh(this.mszSelect);
                        break;
                    case 3:
                        this.$refs.collect3.refresh(this.MSZSPACE);
                        break;
                }

            },
            getStartTime(){
                //获取开启面试时间                
                this.utils.request("EJSON", {
                    type:'timer',
                    classId:this.$route.query.classId,
                    batchId:this.$route.query.batchId
                }, {
                    loading: false,
                },(result) => {
                    if(result.comContent.startDt == ''){
                        this.isShow = false
                    }else{
                        this.isShow = true
                    }
                   
                    if(this.startTime.startDt != result.comContent.startDt){
                        this.startTime = result.comContent
                        this.seconds = result.comContent.seconds
                        this.atime()
                    }
                    setTimeout(() => {
                        this.getStartTime()
                    },5000)  
                });    
            },
            atime() {    
                let seconds = this.seconds;
                let sen = seconds;
                let hour = 0;
                let min = parseInt(sen / 60);
                sen = sen % 60;
                if(min > 60){
                    hour = parseInt(min / 60);
                    min = min % 60;
                }

                if(hour < 10) hour = "0"+hour;
                if(min < 10) min = "0"+min;
                if(sen < 10) sen = "0"+sen;

                let time = hour+":"+min+":"+sen;
                this.time = time;
                new Promise((resolve,reject) =>{
                    setTimeout(() => {
                        resolve()
                    },1000);
                }).then(() =>{
                    if(this.startTime.startDt != ""){
                        this.seconds = seconds +1 
                        this.atime();
                    }
                    
                })
               
            },
            
            listenMszMsg(data) {
                let MSZS = data.MSZS;
                let MSZID = data.MSZID;
                //debugger
                if (!!MSZS && !this.mszSelect && !MSZID) {
                    this.mszSelect = MSZS[0].ID;
                    this.$refs.studentsList2.refresh(this.mszSelect);
                } else if (!!MSZS && !this.mszSelect && !!MSZID) {
                    this.mszSelect = MSZID;
                }
                this.mszdata = MSZS;
            },
            selecMsz() {
                this.$refs.studentsList2.refresh(this.mszSelect);
            },
            listenMszSd(data) {
                let MSZS = data.MSZSPACES;
                let MSZSPACE = data.MSZSPACE;
                //debugger
                if (!!MSZS && !this.MSZSPACE && !MSZSPACE) {
                    this.MSZSPACE = MSZS[0].MSZSPACE;
                    this.$refs.collect3.refresh(this.MSZSPACE);
                } else if (!!MSZS && !this.MSZSPACE && !!MSZSPACE) {
                    this.MSZSPACE = MSZSPACE;
                }
                this.MSZSPACEdata = MSZS;
            },
            selecMszSd() {
                this.$refs.collect3.refresh(this.MSZSPACE);
            }
        }
    }
</script>

<style scoped>
    .tit_tab {
        width: 100%;
        height: auto;
        overflow: hidden;
    }

    .tab-tit li {
        display: block;
        position: relative;
        height: 45px;
        padding: 0 2%;
        background-color: #b0afb2;
        float: left;
        color: #fff;
        font-size: 1rem;
        text-align: center;
        list-style: none;
        line-height: 44px;
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        margin-right: 3px;
    }

    .school_on {
        background: #fff !important;
        color: #787878 !important;
    }

    .tabN_school {
        width: 100%;
        background-color: #fff;
        height: 86%;
        overflow: auto;
    }

    .tabN_school li {
        margin: 0 auto;
        width: 94%;
        height: auto;
        padding: 3% 0;
        border-bottom: 1px solid #ddd;
        overflow: hidden;
        list-style: none;
    }

    .tabN_school li:last-child {
        border: none;
    }

    .msz_select select {
        border: none;
        outline: none;
        height: 30px;
        padding: 0 24px;
        background: #efeff4;
        border-radius: 3px;
        color: #000;
        font-size: inherit;
    }

    .msz_select {
        display: block;
        position: absolute;
        right: 1%;
    }

    .x-refresh {
        display: inline-block;
        width: 75px;
        margin-left: 20px;
        background: #9e1e2b;
        height: 20px;
        border-radius: 5px;
        text-align: center;
        font-size: 15px;
        color: #fff;
        cursor: pointer;
    }
    .timer{
        height: 60px;
        width: 40%;
        z-index: 999;
        margin-left: 30%;
        margin-right: 30%;
        position: fixed;
        text-align: center;
        line-height: 60px;
    }
    .timer .time-box {
        width: 355px;
        height: 100%;
        background: #fa7e00;
        display: inline-block;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        color: #000;
        font-size: 25px;
    }
</style>