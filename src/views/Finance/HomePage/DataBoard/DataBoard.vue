<template>
    <div class="w-100">
        <span class="form-title">数据看板</span>
        <el-form class="customized-form inline-block">
            <el-form-item class="short-item">
                <el-select v-model="date" placeholder="昨日" @change="selectDate">
                    <el-option v-for="(item,key) in AllDate" :key="key" :label="item.label.substring(0,item.label.length-2)"
                               :value="key"></el-option>
                </el-select>
            </el-form-item>
        </el-form>

        <div class="data-list">
            <div class="flex-space-between">
                <span class="list-item inline-block" v-for="(item,key) in data" :key="key" v-loading="item.loading">
                    <p class="item-top">
                        {{headListReduce[key]}}
                        <el-tooltip class="item" effect="dark" placement="top-start">
                            <span slot="content" class="inline-block" style="width: 170px;line-height: 18px">当前实时{{headListReduce[key]}}，与时间筛选不联动</span>
                            <span v-if="showIcon(key)" class="pointer"><svg-icon icon-name="question"></svg-icon></span>
                        </el-tooltip>
                    </p>
                    <p class="item-middle">{{item.data.now}}</p>
                    <p class="item-bottom flex-space-between" v-if="item.data.last">
                        <span class="date-item">{{AllDate[date].legend.substring(0,AllDate[date].legend.length-2)}}<i>{{ item.data.last }}</i></span>
                        <span >环比
                            <i :class="item.data.uad?'red-color':'green-color'">{{(item.data.uad ? '+' : "") + Number(item.data.circleRatio).toFixed(0) + '%' }}</i>
                        </span>
                    </p>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import HomePageMixin from "@views/Finance/HomePage/HomePageMixin";
import {AllDate} from "@tools/DateUtils";
import {headList, data} from "@views/Finance/HomePage/DataBoard/DataBoard.js";

export default {
    name: "DataBoard",

    mixins: [HomePageMixin],

    props: {
        company_id:''
    },

    computed: {
        headList: function () {
            return headList
        },

        headListReduce: function () {
            return Object.keys(headList).reduce((prev, next) => {
                const obj = headList[next];
                return Object.keys(obj).reduce((pre, nxt) => {
                    pre[nxt] = obj[nxt];
                    return pre;
                }, prev)
            }, {})
        }
    },

    mounted(){
        this.selectDate()
    },

    data(){
        return{
            date:'yesterday',
            AllDate,
            data,
        }
    },

    methods: {
        searchFn(){
            this.selectDate()
        },

        showIcon(val){
            return (val === 'customer' || val === 'advertiser')
        },

        selectDate(){
            this.loading = true;
            Object.keys(headList).forEach(key => {

                const obj = headList[key];
                Object.keys(obj).forEach(k => this.data[k].loading = true)

                this.axiosList(key).then((res) => {
                    if (res && res.data.code === 200){

                        const obj = headList[key];
                        Object.keys(obj).forEach(k => this.data[k].data = res.data.data.list[k])

                    }
                }).catch((err) => {
                    console.warn(err)
                }).finally(() => {
                    const obj = headList[key];
                    Object.keys(obj).forEach(k => this.data[k].loading = false)
                })
            });
        },

        axiosList(module) {
            return this.$http.get("/report/finance/data", {
                params: {
                    date_type: this.date,
                    company_id: this.company_id,
                    module: module
                }
            });
        },
    }
}
</script>

<style scoped lang="scss">

    .list-item {

        width: 15%;
        position: relative;
        padding-left: 2vw;

        &:first-of-type {
            padding-left: 13px;
        }

        &:after {
            content: '';
            position: absolute;
            right: 0;
            top: 10px;
            height: 80%;
            border-right: 1px solid $bg-color-divider;
        }

        &:last-of-type:after {
            border-right: initial;
        }

        .item-top {
            color: $font-color-secondary;
            margin-bottom: 15px;
        }

        .item-middle {
            color: $font-color-base;
            margin-bottom: 16px;
            font-weight: 600;
            font-size: 1.5vw;
            margin-left: -2px;
            font-family: $font-family-alternate;
        }

        .date-item {
            margin-right: 1.3vw;
        }

        .item-bottom {
            justify-content: flex-start;
            flex-wrap:wrap;
            color: $font-color-auxiliary;
            margin-bottom: 10px;
            font-size: $font-size-addition;
            .red-color {
                color: #F45858;
            }
            .green-color {
                color: #66C23A;
            }
        }
    }

</style>
