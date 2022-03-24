<template>
    <div>
        <!-- 订单状态为制作中的运营和管理员视角 -->
        <div class="making-box" v-if="!(userOrderAuth & SUBMIT_AUTH) && (orderMask & STATUS_MAKE_ING)  && !(overdueResource.length)">
            <img :src="imageUrl" />
            <p>订单【{{ orderName }}】已被【{{ groupName }}】接单，正在制作中…</p>
        </div>
        <!-- 订单状态为制作中的运营和管理员视角 -->

        <!-- 订单状态为已过期 -->
        <div class="overdue-pic" v-if="orderMask & STATUS_OVERDUE">
            <img :src="overduePic" />
            <p>订单无人接单，现已过期</p>
        </div>
        <!-- 订单状态为已过期 -->
    </div>
</template>

<script>
import OrderAuthorityMixin from "@mixins/OrderAuthorityMixin";
import {SUBMIT_AUTH} from "@config/OrderAuthority";
import {STATUS_OVERDUE,STATUS_MAKE_ING} from "../../Order/StatusPool";
import {mapState} from "vuex";

export default {
    name: "DeliveryMakingAndOverdue",
    props: {
        orderName: {
            type:String
        },
        groupName: {
            type:String
        },
        orderStatus: {
            type:String
        },
        overdueResource: {
            type:Array
        }
    },
    mixins: [OrderAuthorityMixin],
    computed: {
        orderMask() {
            return this.GetStatusMask(this.orderStatus);
        },
        ...mapState({
            userOrderAuth: state => state.global.userOrderAuth,
        })
    },
    data(){
        return {
            imageUrl: require('@/assets/making.png'),
            overduePic: require('@/assets/overdue.png'),
            SUBMIT_AUTH,
            STATUS_OVERDUE,
            STATUS_MAKE_ING
        }
    }
}
</script>
<style scoped lang="scss">
    .overdue-pic, .making-box {
        display: grid;
        justify-content: center;

        img {
            width: 228px;
            height: 201px;
        }

        p {
            text-align: center;
            line-height: 22px;
            font-size: $font-size-headings;
            font-weight: $font-weight-base;
        }
    }

    .overdue-pic {
        margin-top: 126px;
        p {
            color: $font-color-auxiliary;;
        }
    }

    .making-box {
        margin-top: 66px;
        img {
            margin: 0 auto;
        }
        p {
            color: $font-color-base;
        }
    }
</style>