<template>
    <div class="canvas-div" style="border-radius: 5px;">
        <div style="text-align: center;">
            <div class="canvas-tip" style="border-top-left-radius: 5px 5px;border-top-right-radius: 5px 5px;">{{name}}，你好，请在此处签名</div>
            <canvas id="canvas" width="650" height="260"
                    style="border:1px solid #ccc;border-radius: 10px;margin-top: 10px;">Canvas画板
            </canvas>
        </div>
        <div style="text-align: center;line-height: 50px;">
            <!--<button class="threeBTN" v-on:click="clear">清除</button>-->
            <flexbox style="width: 95%;margin:10px auto;">
                <flexbox-item>
                    <x-button :gradients="['#9e1e2b', '#9e1e2b']" @click.native="save">确认提交</x-button>
                </flexbox-item>
                <flexbox-item>
                    <x-button @click.native="close">取消</x-button>
                </flexbox-item>
            </flexbox>
        </div>
    </div>
</template>

<script>
import { XButton, Flexbox, FlexboxItem } from 'vux'

    /**
     * zf
     * 20190726
     * */
    let draw;
    //let flagD = false;
    let preHandler = function (e) {
        e.preventDefault();
    }

    class Draw {
        constructor(el) {
            this.el = el;
            this.canvas = document.getElementById(this.el);
            this.cxt = this.canvas.getContext('2d');
            this.stage_info = canvas.getBoundingClientRect();
            this.path = {
                beginX: 0,
                beginY: 0,
                endX: 0,
                endY: 0
            }
        }

        init(btn) {
            let that = this;

            this.canvas.addEventListener('touchstart', function (event) {
                document.addEventListener('touchstart', preHandler, {
                    passive: false
                });
                that.drawBegin(event)
            }, {
                passive: false
            })
            this.canvas.addEventListener('touchend', function (event) {
                document.addEventListener('touchend', preHandler, {
                    passive: false
                });
                that.drawEnd()

            }, {
                passive: false
            })
            this.clear(btn)
        }

        drawBegin(e) {
            //flagD = true;
            this.cxt = this.canvas.getContext('2d');
            this.stage_info = canvas.getBoundingClientRect();

            let that = this;
            window.getSelection() ? window.getSelection().removeAllRanges() : document.selection.empty()
            this.cxt.strokeStyle = "#000"
            this.cxt.beginPath()
            this.cxt.moveTo(
                e.changedTouches[0].clientX - this.stage_info.left,
                e.changedTouches[0].clientY - this.stage_info.top
            )
            this.path.beginX = e.changedTouches[0].clientX - this.stage_info.left
            this.path.beginY = e.changedTouches[0].clientY - this.stage_info.top
            canvas.addEventListener("touchmove", function () {
                that.drawing(event)
            }, {
                passive: false
            })
        }

        drawing(e) {
            this.cxt.lineTo(
                e.changedTouches[0].clientX - this.stage_info.left,
                e.changedTouches[0].clientY - this.stage_info.top
            )
            this.path.endX = e.changedTouches[0].clientX - this.stage_info.left
            this.path.endY = e.changedTouches[0].clientY - this.stage_info.top
            this.cxt.stroke()
        }

        drawEnd() {
            document.removeEventListener('touchstart', preHandler, {
                passive: false
            });
            document.removeEventListener('touchend', preHandler, {
                passive: false
            });
            document.removeEventListener('touchmove', preHandler, {
                passive: false
            });
        }

        clear(btn) {
            this.cxt.clearRect(0, 0, 800, 400);
        }

        save() {
            return canvas.toDataURL("image/png");
        }
    }

    export default {
        name: 'Canvas',
        components: {
            XButton,
            Flexbox,
            FlexboxItem
        },
        data() {
            return {
                val: true,
                url: "",
                draw: "",
                initData: ""
            }
        },
        props:{
            name: {
                type: String,
                default: '测试'
            },
        },
        mounted() {
            this.draw = new Draw('canvas');
            this.draw.init();
        },
        methods: {
            clear() {
                this.draw.clear();
            },
            save() {
                let data = this.draw.save();
                let c = document.getElementById("canvas");
                let me = this;
                if (!this.isCanvasBlank(c)) {
                    me.$vux.confirm.show({
                        title: "确认",
                        content: "是否确认提交？",
                        onConfirm() {
                            me.$emit("save",data);
                        }
                    });
                } else {
                    this.$vux.toast.show({
                        type:"warn",
                        width: '250px',
                        time: 1000,
                        position: 'top',
                        text: '请您签名！'
                    });
                }
            },
            close() {
                this.draw.clear();
                this.$emit("close");
            },
            isCanvasBlank(canvas) {
                let blank = document.createElement('canvas'); //系统获取一个空canvas对象
                blank.width = canvas.width;
                blank.height = canvas.height;
                return canvas.toDataURL() == blank.toDataURL(); //比较值相等则为空
            }
        }
    }
</script>
<style scoped>
    h1,
    h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }

    #canvas {
        background: #DDD;
        cursor: default;
        vertical-align: unset;
    }

    .canvas-tip {
        line-height: 40px;
        text-align: center;
        font-size: 18px;
        font-weight: 400;
        color: #fff;
        background-color: #9e1e2b;
    }

    .canvas-div {
        border: 1px solid #ccc;
    }

    .canvas-div {
        width: 680px;
        height: 390px;
        background-color: #fff;
        margin: 0 auto;
    }
</style>