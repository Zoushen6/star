<template>
    <div class="h-100 p-b-32 overflow-auto-y border-box flex-vertical">
        <router-link class="uniform-link iconfont m-l-25" to="/">返回</router-link>
        <div class="background-white border-radius-4 m-l-r-16 guide flex-1">
            <div class="border-bottom-1 font-bold font-16 p-m-16">新手指引</div>
            <p class="text-center m-t-b-20 font-16 font-bold">订单状态业务流程图</p>
            <p class="pic">
                <el-image style="width: 100%" :src="getGuide()" lazy></el-image>
            </p>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex';
import {OPERATE_INTERGRATED_MASK} from "@config/RouteAuth";

export default {
    name: "Guide",

    computed: {
        ...mapState({
            userTypeRoute: state => state.global.userTypeRoute,
        })
    },

    methods: {
        /**
         * 必须写成 dir + name + suffix的格式
         * https://webpack.docschina.org/guides/dependency-management/#require-with-expression
         * @returns {*}
         */
        getGuide(){
            const src = this.userTypeRoute & (OPERATE_INTERGRATED_MASK)?"operation":"creative";
            return require('@/assets/'+ src + '.png');
        },
    }

}
</script>

<style scoped lang="scss">

    .pic {
        width: 1200px;
        margin: 0 auto 40px;
    }

</style>
