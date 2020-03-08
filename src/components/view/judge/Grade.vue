<template>
    <div>
        <i-header :showHome=false></i-header>
        <div id="pgcontainer" style="height:100%;">
            <div class="content" style="height:100%; position:relative; ">
                <div class="x-grade-box">
                    <div :class="['x-grade-xx',examineeFixed?'x-grade-exam_fixed':'']">
                        <!--span class="x-interview-photo"><img :src="examinee.photo" height="77" width="60"
                                                    alt=""></span-->
                        <span class="x-interview-name">姓名：{{examinee.name}}</span>
                        <span class="x-interview-company">公司：{{examinee.company}}</span>
                        <span class="x-interview-position">职位：{{examinee.position}}</span>
                    </div>

                    <div class="x-grade-standard" :style="examineeFixed?'margin-top:106px;':''">
                        <div class="x-component-title">
                            <span>评分标准</span>
                        </div>
                        <div class="x-component-con">
                            <div v-for="item in model">
                                <!-- 一般打分 -->
                                <div v-if="item['TZ_SCORE_ITEM_TYPE']==='B'">
                                    <div :class="item['TZ_SHOW_WIDGET']?'x-component-box x-component-box-selected':'x-component-box'"
                                         @click="item['TZ_SHOW_WIDGET']=!item['TZ_SHOW_WIDGET']">
                                        <div class="x-component-box_l">
                                            <span>{{item['TZ_XS_MC']}}（{{item['TZ_SCORE_LIMITED']}}分）</span>
                                        </div>
                                        <div class="x-component-box_r">
                                            评分：
                                            <span>{{item['TZ_SCORE_NUM']}}</span>
                                        </div>
                                        <a href="javascript:void(0);"
                                           v-bind:class="item['TZ_SHOW_WIDGET']?'arrow_slide2 arrow_up':'arrow_slide2'"></a>
                                    </div>

                                    <div class="x-component-menu" v-show="item['TZ_SHOW_WIDGET']">
                                        <span style="margin: auto 0;width:50px;">分数</span>
                                        <checker v-model="item['TZ_SCORE_NUM']" radio-required
                                                 default-item-class="checker-item"
                                                 selected-item-class="checker-item-selected"
                                                 @on-change="calcTotalScore(item)">
                                            <template
                                                    v-for="n in splitNumber(item['TZ_SCORE_LIMITED'],item['TZ_SCORE_LIMITED2'])">
                                                <checker-item :value="n">{{n}}</checker-item>
                                            </template>
                                        </checker>
                                    </div>
                                </div>
                                <!-- 一般打分结束 -->

                                <!-- 下拉框 -->
                                <div v-if="item['TZ_SCORE_ITEM_TYPE']==='D'">
                                    <div :class="item['TZ_SHOW_WIDGET']?'x-component-box x-component-box-selected':'x-component-box'"
                                         @click="item['TZ_SHOW_WIDGET']=!item['TZ_SHOW_WIDGET']">
                                        <div class="x-component-box_l">
                                            <span>{{item['TZ_XS_MC']}}（单选）</span>
                                        </div>
                                        <div class="x-component-box_r" v-if="item['TZ_SCR_TO_SCORE'] === 'Y'" :style="scoresLeftMove?'margin-right:90px':''">
                                            评分：
                                            <span>{{item['TZ_SCORE_NUM']}}</span>
                                        </div>
                                        <a href="javascript:void(0);"
                                           v-bind:class="item['TZ_SHOW_WIDGET']?'arrow_slide2 arrow_up':'arrow_slide2'"></a>
                                    </div>
                                    <div v-transfer-dom>
                                        <popup v-model="item['TZ_SHOW_WIDGET']" position="right"
                                               @on-show="scoresLeftMove=!scoresLeftMove"
                                               @on-hide="scoresLeftMove=!scoresLeftMove">
                                            <div style="width:130px;margin-top:96px;margin-left: 15px;">
                                                <checklist :options="getOptions(item['TZ_SCORE_SELECT_ITEM_LIST'])"
                                                           v-model="item['TZ_SCORE_SELECT_ITEM_IDS']" :max="1"
                                                           @on-change="calcTotalScore(item)"></checklist>
                                                <span style="color: #9e1e2b;font-weight: bold;font-size: 1.1rem;position: absolute;top:60px;left:28px;">
                                                    总分：{{total['TZ_SCORE_NUM']}}分
                                                </span>
                                            </div>
                                        </popup>
                                    </div>
                                    <!--<div class="x-component-menu" v-show="false">-->
                                        <!--<span style="margin: auto 0;width:50px;">选项</span>-->
                                        <!--<checklist :options="getOptions(item['TZ_SCORE_SELECT_ITEM_LIST'])"-->
                                                   <!--v-model="item['TZ_SCORE_SELECT_ITEM_IDS']" :max="1"-->
                                                   <!--@on-change="calcTotalScore(item)"></checklist>-->
                                    <!--</div>-->
                                </div>
                                <!-- 下拉框结束 -->

                                <!-- 评语 -->
                                <div class="x-component-comment" v-if="item['TZ_SCORE_ITEM_TYPE']==='C'">
                                    <div class="x-component-comment_t">
                                        <span>{{item['TZ_XS_MC']}}
                                             <span v-if="item['TZ_SCORE_PY_ZSLIM0']>0"
                                                   style="color: #9e1e2b;display: contents;padding:0;">
                                                (*必填)
                                            </span>
                                        </span>
                                    </div>
                                    <div class="x-component-comment_c">
                                        <div class="weui-cell">
                                            <div class="weui-cell__bd">
                                                <textarea class="weui-textarea" :placeholder="'请输入'+item['TZ_XS_MC']"
                                                          @input="item.words=item['TZ_SCORE_COMMENT'].length" rows="3"
                                                          v-model="item['TZ_SCORE_COMMENT']"
                                                          :maxlength="item['TZ_SCORE_PY_ZSLIM']"></textarea>
                                                <div class="weui-textarea-counter">
                                                    <span style="vertical-align: baseline">{{item.words||0}}</span>/{{item['TZ_SCORE_PY_ZSLIM']}}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- 评语结束 -->

                                <!-- 汇总项 -->
                                <div class="x-grade-total" v-if="item['TZ_SCORE_ITEM_TYPE']==='A'">
                                    <span style="float: left">{{item['TZ_XS_MC']}}</span>
                                    <span v-show="item['TREE_NODE']==='Total'" style="float: right">{{item['TZ_SCORE_NUM']}}分</span>
                                    <span v-show="item['TREE_NODE']!='Total'" style="float: right">{{item['TZ_SCORE_HZ']}}%</span>

                                </div>
                                <!-- 汇总项结束 -->

                            </div>


                            <div class="x-grade-sm">
                                <p>评分说明：</p>
                                <div class="x-grade-desc-box">
                                    <template v-for="(item,index) in interview.description">
                                        <span v-html="wrapDescription(item.description,index)"
                                              class="x-grade-desc-item"></span>
                                    </template>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

                <div class="x-grade-bottom">
                    <div class="x-grade-bottom_icon">
                        <a href="javascript:;" v-on:click="viewExaminee "><span
                                class="x-grade-bottom_icon_view">查看考生信息</span></a>
                        <a href="javascript:;" v-on:click="save" class="x-grade-bottom-save"
                           :style="{background:(this.interview.submitState==='Y'&&'#666'||'')}">
                            <span class="x-grade-bottom_icon_save">保存</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {TransferDom, Popup, Range, XNumber, Checker, CheckerItem, Selector, Checklist} from 'vux'

export default {
    directives: {
        TransferDom
    },
    components: {
        Popup,
        Range,
        XNumber,
        Checker,
        CheckerItem,
        Selector,
        Checklist
    },
    data() {
        return {
            num: 10,
            classId: "",
            batchId: "",
            appInsId: "",
            model: [],
            examineeFixed: false,
            total: {},
            examinee: {},
            interview: {},
            scoresLeftMove: false
        }
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll)
        window.removeEventListener('resize', this.handleScroll)
    },
    activated() {
        this.handleScroll()
    },
    mounted: function () {
        this.classId = this.$route.query.classId;
        this.batchId = this.$route.query.batchId;
        this.appInsId = this.$route.query.appInsId;

        this.initComponent();

        window.addEventListener('scroll', this.handleScroll)
        window.addEventListener('resize', this.handleScroll)
    },
    methods: {
        /*以固定步长拆分打分项*/
        splitNumber(max, min) {
            let steps = [];
            for (let i = min * 10; i <= max * 10; i += ((max - min))) {
                steps.push(i / 10);
            }
            return steps;
        },
        /*处理下拉选项*/
        getOptions(list) {
            let options = []
            list.forEach((item) => {
                options.push({
                    key: item['TZ_CJX_XLK_XXBH'],
                    value: item['TZ_CJX_XLK_XXMC']
                })
                //{TZ_CJX_XLK_XXBH: "1", TZ_CJX_XLK_XXMC: "下拉框1", TZ_CJX_XLK_MRZ: "Y", TZ_CJX_XLK_XXFZ: 10}
            });
            return options;
        },
        /*处理滚动事件*/
        handleScroll() {
            function getScrollTop() {
                let scrollTop = 0;
                if (document.documentElement && document.documentElement.scrollTop) {
                    scrollTop = document.documentElement.scrollTop;
                }
                else if (document.body) {
                    scrollTop = document.body.scrollTop;
                }
                return scrollTop;
            }

            this.examineeFixed = getScrollTop() > 23;
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

            //加载打分模型
            this.utils.request("grade", {
                type: "model",
                classId: this.classId,
                batchId: this.batchId,
                appInsId: this.appInsId
            }, (response) => {
                let comContent = response.comContent;

                //打分模型数处理
                comContent.model.forEach((item) => {
                    // 顶级汇总项目
                    if (item["TREE_LEVEL_NUM"] === 1 && item["TZ_SCORE_ITEM_TYPE"] === "A") {
                        me.total = item;
                    }

                    // 下拉列表（已转换为单选框）值处理
                    if (item["TZ_SCORE_ITEM_TYPE"] === "D") {
                        item["TZ_SCORE_SELECT_ITEM_IDS"] = [item["TZ_SCORE_SELECT_ITEM_ID"]]
                    }

                    // 其他属性初始化
                    item["TZ_SHOW_WIDGET"] = false;
                })
                me.model = comContent.model;

                //考生信息
                me.examinee = {
                    name: comContent.name,
                    photo: comContent.photo,
                    company: comContent.company,
                    position: comContent.position
                };

                //评审信息
                me.interview = {
                    description: comContent.evaluationDesc,
                    submitState: comContent.submitState
                };
            });
        },
        /*计算总分*/
        calcTotalScore(item) {

            //计算总分之前先计算下拉框类型check list选项的值
            if (item && item["TZ_SCORE_ITEM_TYPE"] === 'D') {
                item["TZ_SCORE_SELECT_ITEM_ID"] = item["TZ_SCORE_SELECT_ITEM_IDS"][0];
                if (this.utils.isBlank(item['TZ_SCORE_SELECT_ITEM_ID'])) {
                    item['TZ_SCORE_NUM'] = 0;
                }
                item["TZ_SCORE_SELECT_ITEM_LIST"].forEach(option => {
                    if (option['TZ_CJX_XLK_XXBH'] === item["TZ_SCORE_SELECT_ITEM_ID"]) {
                        item['TZ_SCORE_NUM'] = option['TZ_CJX_XLK_XXFZ'];
                    }
                })
            }

            let sum = 0,
                me = this;
            let zi_sum = 0,
                zi_index = -1 ,
                hz_weight = -1;

            try {
                me.model.forEach((item,index) => {

                    //记录总分
                    let itemType = item['TZ_SCORE_ITEM_TYPE'];
                    if(itemType ==="A"){
                        if(hz_weight != -1){
                            if(zi_index != -1){
                                me.model[zi_index]['TZ_SCORE_NUM'] = zi_sum * me.model[zi_index]['TZ_SCORE_HZ']/100;
                            }
                            zi_index = index;
                            sum = me.signFigures(sum + zi_sum * hz_weight/100);
                        }
                        hz_weight = item['TZ_SCORE_HZ']
                        zi_sum = 0;
                    }
                    if (itemType === "B" || (itemType === "D" && item['TZ_SCR_TO_SCORE'] === 'Y')) {
                        let weight = itemType === "B" ? item['TZ_SCORE_QZ'] : item['TZ_SCR_SQZ'],
                            score = item['TZ_SCORE_NUM'];
                        zi_sum = me.signFigures(zi_sum + score * weight/100);
                    }
                })
                me.model[zi_index]['TZ_SCORE_NUM'] = zi_sum * me.model[zi_index]['TZ_SCORE_HZ']/100;
                sum = me.signFigures(sum + zi_sum * hz_weight/100);
            } catch (e) {
                console.log(e)
            }
            me.total['TZ_SCORE_NUM'] = sum;
        },
        // 浮点数计算
        signFigures(num, rank = 6) {
            if (!num) return (0);
            const sign = num / Math.abs(num);
            const number = num * sign;
            const temp = rank - 1 - Math.floor(Math.log10(number));
            let ans;
            if (temp > 0) {
                ans = parseFloat(number.toFixed(temp));
            }
            else if (temp < 0) {
                ans = Math.round(number / Math.pow(10, temp)) * temp;
            }
            else {
                ans = Math.round(number);
            }
            return (ans * sign);
        },
        /*查看考生信息*/
        viewExaminee() {
            //取消实时保存功能 this.doSave(false);

            this.$router.replace({
                name: "applicationForm",
                query: {
                    classId: this.classId,
                    batchId: this.batchId,
                    appInsId: this.appInsId
                }
            });
        },
        save() {
            let me = this;

            if (this.interview.submitState === "Y") {
                return;
            }

            //校验是否存在0分的打分项、未选的选项以及必填的评语
            let none_grade_items = [];
            let blankRequiredItems = [];
            this.model.forEach(item => {
                let itemType = item["TZ_SCORE_ITEM_TYPE"];

                if ((itemType === 'B' && item['TZ_SCORE_NUM'] === 0) ||
                    (itemType === 'D' && this.utils.isBlank(item['TZ_SCORE_SELECT_ITEM_ID']))) {
                    none_grade_items.push(item['TZ_XS_MC']);
                }

                if (itemType === 'C' && item["TZ_SCORE_PY_ZSLIM0"] > 0 && me.utils.isBlank(item['TZ_SCORE_COMMENT'])) {
                    blankRequiredItems.push(item['TZ_XS_MC']);
                }
            })

            if (blankRequiredItems.length > 0) {
                this.$vux.alert.show({
                    title: "提示",
                    content: me.utils.format("已保存！当前 【{0}】 为必填项", blankRequiredItems.join("】，【")),
                    onHide() {
                        me.doSave(false)
                    }
                });
            } else if (none_grade_items.length > 0) {
                this.$vux.alert.show({
                    title: "提示",
                    content: me.utils.format("已保存！当前 【{0}】项的打分为0分或者未选择选项，请确认是否为漏打或漏选", none_grade_items.join("】，【")),
                    onHide() {
                        me.doSave(false)
                    }
                });

            } else {
                me.doSave(true);
            }

        },
        /*保存*/
        doSave(showToast) {
            let me = this;

            if (this.interview.submitState === "Y") {
                return;
            }

            //提交评议数据
            this.utils.request("grade", {
                type: "submit",
                classId: this.classId,
                batchId: this.batchId,
                appInsId: this.appInsId,
                model: this.model,
                toast: !!showToast
            }, {loading: !!showToast}, (response) => {
                if (typeof response === "object") {
                    showToast && me.$vux.toast.show({
                        text: "保存成功",
                        width: "120px"
                    });
                }
            })
        },
        wrapDescription(desc, index) {
            return "(" + (index + 1) + "). " + desc;
        }
    }
}

</script>

<style scoped>
    .x-grade-exam_fixed {
        position: fixed;
        width: calc(100% - 70px);
        z-index: 1;
        top: 48px;
    }

    .x-grade-desc-box {
        margin-top: 10px;
    }

    .x-grade-desc-item {
        margin-right: 10px;
    }

    .checker-item {
        border: 1px solid #cccccc;
        border-radius: 3px;
        padding: 5px 15px;
        margin: 2px 10px;
        display: inline-table;
    }

    .checker-item-selected {
        background-color: #9e1e2b;
        color: #FFFFFF;
    }
</style>