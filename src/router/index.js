import Vue from 'vue'
import VueRouter from 'vue-router'

//登录页面
import Login from '../components/view/Login'
//批次列表
import Batch from '../components/view/Batch'
//签到列表
const CheckInList = () => import('../components/view/admin/CheckInList');
//考生信息
const ApplicationForm = () => import('../components/view/judge/ApplicationForm');
//打分
const Grade = () => import('../components/view/judge/Grade');
//面试评审
const Interview = () => import('../components/view/judge/Interview');


Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        component: Login,
        meta: {
            index: 1
        }
    },
    {
        name: 'login',
        path: '/login',
        component: Login,
        meta: {
            index: 1
        }
    },
    {
        name: 'batch',
        path: '/batch',
        component: Batch,
        meta: {
            index: 2,
            title: '批次列表'
        }
    },
    {
        name: 'checkInList',
        path: '/admin/check-in-list',
        component: CheckInList,
        meta: {
            index: 3,
            title: '签到管理'
        }
    },
    {
        name: 'applicationForm',
        path: '/judge/application-form',
        component: ApplicationForm,
        meta: {
            index: 4,
            title: '考生信息'
        }
    },
    {
        name: 'grade',
        path: '/judge/grade',
        component: Grade,
        meta: {
            index: 4,
            title: '打分'
        }
    },
    {
        name: 'interview',
        path: '/judge/interview',
        component: Interview,
        meta: {
            index: 4,
            title: '面试评审'
        }
    }
];

export const router = new VueRouter({
    routes
});
