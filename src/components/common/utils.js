import Vue from 'vue'
import {AjaxPlugin, AlertPlugin, ToastPlugin, LoadingPlugin, ConfirmPlugin} from 'vux'

//插件注册
Vue.use(AjaxPlugin);
Vue.use(AlertPlugin);
Vue.use(ToastPlugin);
Vue.use(LoadingPlugin);
Vue.use(ConfirmPlugin);

const _utils = {
    //登录
    login(username, password) {
        let orgid = document.getElementById("orgid").value;
        let params = {
            orgId: orgid,
            userName: username,
            password: password,
            type: 'interview'
        };
        return this.request("login", params);
    },
    //发起异步请求
    request(operateType, params, properties, callback, failureFunc) {
        return new Promise((resolve, reject) => {
            let url;
            if (operateType === "login" || operateType === "logout") {
                url = "/evaluation/" + operateType;
            } else if(operateType === "captcha"){
                url = "/captcha";
            } else if(operateType === "verification"){
                url = "/verification";
            } else{
                url = "/dispatcher";
                params = {
                    tzParams: {
                        ComID: "TZ_EVA_INTERVIEW_COM",
                        PageID: "TZ_INTERVIEW_STD",
                        OperateType: operateType,
                        comParams: params
                    }
                }
            }

            //属性可以为空
            if (typeof properties === "function") {
                failureFunc = callback;
                callback = properties;
                properties = null;
            }

            let config = Object.assign({properties: properties || {}}, {
                withCredentials: true,
                //参数格式化
                transformRequest: [function (data) {
                    let ret = [];
                    for (let it in data) {
                        if (data.hasOwnProperty(it)) {
                            ret.push(encodeURIComponent(it)
                                + '='
                                + encodeURIComponent(typeof data[it] === 'object' ? JSON.stringify(data[it]) : data[it]));
                        }
                    }
                    return ret.join("&");
                }],
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
            });
           // url = "http://47.103.106.238:8150" + url;
            url = "https://chineseemba.ntusingapore.cn" + url;
            if (operateType === "login" || operateType === "logout" || operateType === "captcha" || operateType === "verification"){
                if(operateType === "verification"){
                    config.properties.loading = false
                }else {
                    config.properties.loading = true
                }
                
                Vue.http.post(url, params, config).then((response) => {
                    if (typeof callback === "function") {
                        callback(response.data);
                    }
                    resolve(response.data)
                }).catch(error => {
                    if (typeof failureFunc === "function") {
                        failureFunc(error);
                    }
                    reject(error)
                });

            }else{
                this.request("verification",{}).then((res)=>{
                    params.verification = res;
                     Vue.http.post(url, params, config).then((response) => {
                        if (typeof callback === "function") {
                            callback(response.data);
                        }
                        resolve(response.data)
                    }).catch(error => {
                        if (typeof failureFunc === "function") {
                            failureFunc(error);
                        }
                        reject(error)
                    });

                }).catch(error => {
                    if (typeof failureFunc === "function") {
                        failureFunc(error);
                    }
                    reject(error)
                });
            }
           

            
        })
    },
    //编译字符串
    encrypt: (source) => {
        let c = String.fromCharCode(source.charCodeAt(0) + source.length);
        for (let i = 1; i < source.length; i++) {
            c += String.fromCharCode(source.charCodeAt(i) + source.charCodeAt(i - 1));
        }
        return encodeURIComponent(c);
    },
    //解析字符串
    decrypt: (target) => {
        let source = decodeURIComponent(target);
        let c = String.fromCharCode(source.charCodeAt(0) - source.length);
        for (let i = 1; i < source.length; i++) {
            c += String.fromCharCode(source.charCodeAt(i) - c.charCodeAt(i - 1));
        }
        return c;
    },
    //设置Cookie
    setCookie: (name, value, expireDays) => {
        let expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + expireDays);
        document.cookie = name + "=" + encodeURIComponent(value) +
            ((expireDays == null) ? "" : ";expires=" + expireDate.toGMTString())
    },
    //获取Cookie
    getCookie: (name) => {
        if (document.cookie.length > 0) {
            let c_start = document.cookie.indexOf(name + "=");
            if (c_start !== -1) {
                c_start = c_start + name.length + 1;
                let c_end = document.cookie.indexOf(";", c_start);
                if (c_end === -1) c_end = document.cookie.length;
                return decodeURIComponent(document.cookie.substring(c_start, c_end))
            }
        }
        return "";
    },
    //判断字符串是否为空
    isBlank: (source) => {
        return source === undefined || (source.toString() || "").replace(/(^s*)|(s*$)/g, "").length === 0;
    },
    //设置会话期间的参数
    setSessionProp: (prop, value) => {
        sessionStorage.setItem(prop, value);
    },
    //清除会话参数
    clearSessionProps: () => {
        sessionStorage.clear();
    },
    //字符串和日期格式化
    format: (s, ...c) => {
        if (typeof s === "string") {
            return _utils.formatString.call(_utils, s, c);
        }

        if (s instanceof Date) {
            return _utils.formatDate(s, c[0]);
        }

        return s;
    },
    //字符串格式化
    formatString: (source, params) => {
        if (params.length === 0) {
            return source || "";
        }
        if (params.length > 0 && params.constructor !== Array) {
            params = Array.prototype.slice.apply(params)
        }
        if (params.constructor !== Array) {
            params = [params];
        }
        params.forEach(function (item, index) {
            source = source.replace(new RegExp("\\{" + index + "\\}", "g"), item);
        });
        return source;
    },
    //日期格式化
    formatDate: (date, fmt) => {
        let o = {
            x: this,
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S": date.getMilliseconds()
        };

        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    // 轮询，防止超时
    stayLoggedIn: () => {
        // setInterval(() => {
        //     _utils.request("login", {
        //         type: "interval"
        //     }, {loading: false})
        // }, 30000)
    }
};

export const utils = _utils;
