<template>
    <div class="login_con_bg">
    <input type="hidden" id="orgid" name="orgid" value="NTU">
        <div class="login_con_dl">
            <div class="login_con_logo">
                <img src="../../assets/images/logo.png">
                <span>华东理工大学MBA面试系统</span>
            </div>

            <div class="login_text">
                <div class="login_text_input">
                    <span class="user_icon">用户：</span>
                    <input class="login_input" type="text" placeholder="请输入用户名" v-model="username"
                           @keyup.enter="login"/>
                    <div class="clearfix"></div>
                </div>

                <div class="login_text_input">
                    <span class="password_icon">密码：</span>
                    <input class="login_input" type="password" placeholder="请输入密码" v-model="password"
                           @keyup.enter="login"/>
                    <div class="clearfix"></div>
                </div>

                <div class="login_btn_box" v-on:click="login">
                    <a href="javascript:void(0);" class="login_btn">登录</a>
                </div>
            </div>

            <div style="position: absolute;right: 5px;bottom: 0;color: #f5f5f5;font-size: 13px;">v1.1</div>
        </div>
    </div>
</template>

<script>

export default {
    components: {},
    data() {
        return {
            username: '',
            password: '',
        }
    },
    mounted: function () {
        const userName = this.utils.getCookie("UserName");
        this.username = this.utils.isBlank(userName) ? "" : this.utils.decrypt(userName);
    },
    beforeCreate() {
        document.querySelector('body').setAttribute('class', 'login-bg')

    },
    beforeDestroy() {
        document.querySelector('body').removeAttribute('class')
    },
    methods: {
        login(){
            let me = this;

            if (this.username.replace(/(^s*)|(s*$)/g, "").length === 0) {
                me.$vux.toast.show({
                    type: 'text',
                    text: '请输入用户名',
                    position: 'middle'
                });
                return;
            }

            if (this.password.replace(/(^s*)|(s*$)/g, "").length === 0) {
                me.$vux.toast.show({
                    type: 'text',
                    text: '请输入密码',
                    position: 'middle'
                });
                return;
            }
            // 先请求验证码防止出现没有生成验证码登录校验失败（评审登录无需验证码但是后端校验需要获取验证码）
            this.utils.request("captcha", {
                ts: new Date().getTime()
            },{
                verification: false
            }).then(()=>{
                me.doLogin();
            });

        },
        doLogin() {
            let me = this;

            this.utils.login(this.username, this.password).then(function (data) {
                if (typeof data === 'object') {
                    if (data.success === "success") {
                        //将账号加密存储在Cookie中
                        let encryptUserName = me.utils.encrypt(me.username.toUpperCase());
                        me.utils.setCookie("UserName", encryptUserName, 365);
                        let orgid = me.utils.encrypt(document.getElementById("orgid").value.toUpperCase());
                        me.utils.setCookie("JGID",orgid,365);
                        //设置会话参数：评委类型
                        me.utils.setSessionProp("JudgeType", data.judgeType);

                        if (data.judgeType === 'M01') {
                            //签到管理员
                            me.$router.push({
                                name: "checkInList"
                            });
                        } else {
                            //面试评委
                            me.$router.push({
                                name: "batch", params: {
                                    userName: me.username
                                }
                            });
                        }
                    } else {
                        me.$vux.toast.show({
                            type: 'warn',
                            text: data.error,
                            width: "300px",
                            position: 'top'
                        })
                    }
                } else {
                    me.$vux.toast.show({
                        type: 'warn',
                        text: '登录失败，请联系管理员',
                        position: 'top'
                    })
                }
            });
        }
    },
}
</script>

<style scoped>
    .login_con_logo {
        color: #686868;
    }
</style>
