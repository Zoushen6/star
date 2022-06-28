<template>
    <div class="m-b-16">
        <basic-info @basicListChange="basicListChange" ref="basicInfo" style="margin-bottom: 16px"></basic-info>
        <plan @planListChange="planListChange" :account="account" :campid="campId" ref="planInfo" style="margin-bottom: 16px"></plan>
        <creative style="margin-bottom: 16px" ref="creative" @creativeListChange="creativeListChange"></creative>
        <allocation-rules style="margin-bottom: 16px" ref="allocationRules"
                          @allocationListChange="allocationListChange"></allocation-rules>
        <div class="flex m-l-r-16 background-white">
            <el-button class="customized-button" @click="resetAll">全部重置</el-button>
            <el-button type="primary" class="customized-button" @click="submit">提交广告</el-button>
        </div>
    </div>
</template>

<script>
import BasicInfo from "@views/Popular/SmartCreate/BasicInfo/BasicInfo.vue";
import Plan from "@views/Popular/SmartCreate/Plan/Plan.vue";
import Creative from "@views/Popular/SmartCreate/Creative/Creative.vue";
import AllocationRules from "@views/Popular/SmartCreate/AllocationRules/AllocationRules.vue";

export default {
    name: "SmartCreate",

    components: {BasicInfo, Plan, Creative, AllocationRules},

    data() {
        return {
            summaryList: {},
            account: [],
            campId: []
        }
    },

    activated() {
        this.resetAll();
    },

    methods: {
        resetAll() {
            this.$refs.basicInfo.reset();
            this.$refs.planInfo.reset();
            this.$refs.allocationRules.reset();
            this.$refs.creative.reset();
        },

        submit() {
            let p0 = this.$refs.basicInfo.handleValid();
            let p1 = this.$refs.planInfo.handleValidFormData();
            let p2 = this.$refs.planInfo.handleValidStrategyFormData();
            let p3 = this.$refs.creative.handleValid();
            let p4 = this.$refs.allocationRules.handleValid();
            Promise.all([p0,p1,p2,p3,p4]).then((values) => {
                // console.log('验证成功调接口')
                this.axiosCreate(this.summaryList).then(res => {
                    if(res&&res.data.code === 200) {
                        this.$message({
                            message: "提交成功",
                            type: "success"
                        });
                        this.$router.push("/popular/popPlanReport");
                    }
                })
            });
        },

        axiosCreate(params) {
            let media_ids = []
            params.creative.picList.forEach(item => media_ids.push(item.id));
            params.creative.videoList.forEach(item => media_ids.push(item.id));
            let creative_titles = [];
            params.creative.tableData.forEach(item => creative_titles.push(item.title));
            let adv_info = JSON.parse(JSON.stringify(params.basic.adv_info))
            adv_info.forEach((item,idx) => {
                if(item.camp_ids.length === 0) {
                    adv_info.splice(idx,1)
                }
            })
            return this.$http.post("/tt/ad/create",
                {
                    name: params.allocation.planName,
                    adv_info: JSON.stringify(adv_info),
                    media_ids: JSON.stringify(media_ids),
                    creative_titles: JSON.stringify(creative_titles),
                    advertiser_id: params.plan.itemAdvertiserId,
                    ad_id: params.plan.adId,
                    audience_package_id: params.plan.audience_package_id,
                    operation: params.allocation.status===0 ? 'enable' : 'disable',
                })
        },

        basicListChange(list) {
            Object.assign(this.summaryList, {basic: list})
            this.account = list.adAccountList;
            this.campId = list.campaignId;
        },

        planListChange(list) {
            Object.assign(this.summaryList, {plan: list})
        },

        creativeListChange(list) {
            Object.assign(this.summaryList, {creative: list})
        },

        allocationListChange(list) {
            Object.assign(this.summaryList, {allocation: list})
            // console.log(this.summaryList)
        },
    }
}
</script>

<style scoped lang="scss">
.background-white {
    padding: 17px 0;
    justify-content: center;
}
</style>