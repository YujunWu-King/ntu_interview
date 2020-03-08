<template>
    <div class="school_no">
        <div class="account">
            <template v-for="(stu,index) in studentS">
                <div class="x-group-stu_con">
                    <template v-for="(s,i) in stu">

                        <div class="x-group-stu_con_item" :style="{'visibility':s.view==false?'hidden':''}"
                             @click="studentDetailed(index,i)">
                            <div class="x-group-stu_img">
                                <img :src="s.photo" width="131" height="176">
                            </div>
                            <span style="font-weight: bolder">{{s.NAME}}</span>
                            <p>{{s.COMPANY}}</p>
                            <p>{{s.postion}}</p>
                        </div>
                    </template>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
    /**
     * zf
     * 20190730
     * */
    export default {
        name: "studentsList",
        props: {
            classId: String,
            batchId: String
        },
        data() {
            return {
                pageType: 'StudentList',
                studentS: [],
                tlks: false,
                tljs: false,
                dataTime: "",
                time: "",
                userName: "",
                JGid: "",
                clounm: 3,  //每行几列
                flag: true  //每行不足clounm，是否补充
            }
        },
        mounted() {
            this.userName = this.utils.decrypt(this.utils.getCookie("UserName"));
            this.JGid = this.utils.decrypt(this.utils.getCookie("JGID"));
            this.refresh();
        },
        methods: {
            studentDetailed(index, i) {
                let classid = this.studentS[index][i].classid;
                let pc = this.studentS[index][i].pcid;
                let ins = this.studentS[index][i].insid;
                //跳转到详细页面
                this.$router.replace({
                    name: 'applicationForm',
                    query: {
                        classId: classid,
                        batchId: pc,
                        appInsId: ins
                    }
                });
            },
            refresh(msz) {
                let me = this;
                this.utils.request("description", {
                    "CLASSID": this.classId,
                    "BATCHID": this.batchId,
                    "USERNAME": this.userName,
                    "JGID": this.JGid,
                    "PAGETYPE": this.pageType,
                    "MSZID": !msz ? '' : msz.toString()
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
                        me.studentS = [];
                    } else {
                        me.studentsWrapper(result.comContent.STUDENTS);
                        me.$emit("listenMsz", {MSZS: result.comContent.MSZS, MSZID: result.comContent.MSZID});
                    }
                });
            },
            //学生信息包装器：每行不足clounm人，使用占位补足clounm人
            studentsWrapper(students) {
                students = students || [];
                let rowsStudent = [];
                if (students.length > 0) {
                    for (let i = 0, len = students.length; i < len; i += this.clounm) {
                        let rowStudent = students.slice(i, i + this.clounm);
                        if (this.flag && rowStudent.length != this.clounm) {
                            for (let j = (this.clounm - rowStudent.length); j > 0; j--){
                                rowStudent.push({view: false});
                            }
                        }
                        rowsStudent.push(rowStudent);
                    }
                }
                this.studentS = rowsStudent
                this.studentS = this.studentS.map(itemList=>{
                    itemList = itemList.map(item =>{
                        if(item.photo === null || item.photo === ""){
                            item.photo = "/statics/images/appeditor/bjphoto.jpg";
                        }
                        return item;
                    })
                    return itemList;
                })
            }
        }
    }
</script>

<style scoped="scoped">
    .account {
        width: 98%;
        height: 100%;
        margin: 0 auto;
        padding-bottom: 15px;
        padding-top: 10px;
    }

    .x-group-stu_box {
        margin: 25px;
    }

    .x-group-stu_con {
        display: flex;
    }

    .x-group-stu_con_item {
        flex: 1;
        border-radius: 5px;
        background: #f7f7f7;
        margin: 15px;
        padding: 15px;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.075);
        text-align: center;
        color: #787878;
        cursor: pointer;
    }

    .x-group-stu_con img {
        display: block;
        margin: 0 auto;
        margin-top: 10px;
    }

    .x-group-stu_con span {
        display: block;
        margin: 0 auto;
        padding: 10px 10px 0px 10px;
        text-align: center;
    }

    .x-group-stu_con em {
        color: #aeaeae;
        margin-left: 5px;
    }

    .x-group-stu_con_r_b_icon {
        display: flex;
        margin-top: 10px;
        position: fixed;
        bottom: 15px;
        left: 35%;
    }

    .x-group-stu_con_r_b_icon span {
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

    .x-group-stu_ks_icon {
        background: #9e1e2b;
        color: #fff;
    }

    .x-group-stu_js_icon {
        background: #b0afb2;
        color: #fff;
    }

    .tled {
        background: #9e1e2b;
        color: #fff;
    }

    .tling {
        background: #b0afb2;
        color: #fff;
    }

    .vacant_item {
        box-shadow: none;
        background: #FFF;
    }
</style>