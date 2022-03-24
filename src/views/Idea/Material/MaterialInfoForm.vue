<template>
    <el-form :model="searchForm"  ref="searchForm" :inline="true" label-width="90px" class="customized-form padding-top">
        <el-form-item prop="product">
            <el-select v-model="searchForm.product" placeholder="产品"  multiple collapse-tags clearable class="middle-item">
                <el-option v-for="(item,idx) in productNameType" :key="idx" :label="item.item" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="product_industry">
            <el-select v-model="searchForm.product_industry" placeholder="行业" filterable multiple collapse-tags clearable class="middle-item">
                <el-option v-for="(item,idx) in productIndustry" :key="idx" :label="item.item" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="optimizer_id">
            <el-select v-model="searchForm.optimizer_id" placeholder="上传人" multiple collapse-tags clearable class="middle-item">
                <el-option v-for="(item,idx) in material_optimizer" :key="idx" :label="item.name?item.name:item.username" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="creatives">
            <el-select v-model="searchForm.creatives" placeholder="创意人员" filterable multiple collapse-tags popper-class="creatives" clearable class="middle-item">
                <el-option-group v-for="(item,idx) in optimizerGroup" :key="idx" :label="item.duty" >
                    <el-option
                        v-for="item in item.options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-option-group>
            </el-select>
        </el-form-item>
        <el-form-item v-show="(userTypeRoute&ADMIN_ROUTE_MASK)" prop="all_videoTeam">
            <el-select  v-model="searchForm.all_videoTeam" placeholder="团队" @change="" multiple collapse-tags clearable class="middle-item">
                <el-option v-for="(item,idx) in groupType" :key="idx" :label="item.group_name" :value="item.group_id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item v-show="(userTypeRoute&ADMIN_ROUTE_MASK)" prop="all_videoDepartment">
            <el-select v-model="searchForm.all_videoDepartment" placeholder="部门" @change="" multiple collapse-tags clearable class="middle-item">
                <el-option v-for="(item,idx) in departmentType" :key="idx" :label="item.department_name" :value="item.department_id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="label_ids" >
            <el-select v-model="searchForm.label_ids" placeholder="标签" @visible-change="handleLabelList" filterable multiple collapse-tags clearable class="middle-item">
                <el-option v-for="(item,idx) in labelList" :key="idx" :label="item.label_name" :value="item.label_id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="origin_id">
            <el-select v-model="searchForm.origin_id" placeholder="来源" clearable class="middle-item">
                <el-option v-for="(item,idx) in origins" :key="idx" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="selectValue" :required="false" class="search-content">
            <el-input :placeholder="isVideo?'请输入视频名称':'请输入图片名称'" v-model="searchForm.inputValue" class="long-item input-with-select">
                <el-select v-model="searchForm.selectValue" slot="prepend" placeholder="选择类型">
                    <el-option v-for="item in selectType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-input>
        </el-form-item>
        <el-form-item>
        <el-button  type="primary" @click="searchFn">查询</el-button>
        </el-form-item>
        <el-form-item>
            <el-button  @click="resetForm('searchForm')">重置</el-button>
        </el-form-item>
        <div v-if="showShare">
            <el-form-item>
            <el-button type="primary" @click="uploadMaterial"><span class="iconfont">&#xe67e;</span>上传素材</el-button>
            </el-form-item>
            <el-form-item>
                <el-dropdown trigger="click" @command="operations">
                    <el-button :disabled="isDisable" type="primary" plain><span class="iconfont icon-push">&#xe67d;</span>批量操作</el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-if="showPush" command="messagePush">推送</el-dropdown-item>
                        <el-dropdown-item command="share" v-if="isVideo">分享</el-dropdown-item>
                        <el-dropdown-item command="addLabel">添加标签</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-form-item>
        </div>
    </el-form>
</template>

<script>
import InfoFormMixin from "@mixins/InfoFormMixin";
import {mapState} from "vuex";
import {ADMIN_ROUTE_MASK} from "@config/RouteAuth";
import {showShare,showPush} from  "./MaterialAuth"


export default {
    name: "MaterialInfoForm",

    mixins:[InfoFormMixin],

    props: {
        isVideo: {
            type: Boolean,
            default: true
        },
        isDisable: {
            type: Boolean,
            default: true
        },

    },

    computed: {
        showShare,
        showPush,
        ...mapState({
            userTypeRoute: state => state.global.userTypeRoute,
        })
    },

    deactivated() {
        this.resetForm('searchForm');
    },

    data(){
        return {
            ADMIN_ROUTE_MASK,

            searchForm:{
                product:[],
                optimizer_id:[],
                creatives:[],
                origin_id:'',
                label_ids:[],
                all_videoTeam:[],
                all_videoDepartment:[],
                selectValue: 1,
                inputValue:''
            },
            all_videoTeams:[
                {
                    item:"头条数据",
                    id:1
                },
                {
                    item:"快手数据",
                    id:2
                },
            ],
            selectType: [
                {
                    label: this.isVideo?'视频名称':'图片名称',
                    value: 1
                }
            ],
            videoTeam:'',
        }
    },

    methods: {
        searchFn(){
            this.$emit('search',{
                product_id:this.searchForm.product.join(","),
                industry_id:this.searchForm.product_industry.join(","),
                user_id:this.searchForm.optimizer_id.join(","),
                creatives:this.searchForm.creatives.join(","),
                origin_id:this.searchForm.origin_id,
                label_ids:this.searchForm.label_ids.join(","),
                all_videoTeam:this.searchForm.all_videoTeam.join(","),
                all_videoDepartment:this.searchForm.all_videoDepartment.join(","),
                file_name: this.searchForm.inputValue.trim()
            });
        },

        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.searchForm.inputValue = ''
        },

        uploadMaterial(){
            this.$router.push({name: 'uploadMaterial'})
        },

        operations(item){
            this.$emit('command',item)
        }
    }

}
</script>

<style scoped lang="scss">

/deep/.el-button--primary.is-plain.is-disabled {
    color: #cccccc;
    background-color: $font-color-white;
    border-color: $font-color-disabled;
}
/deep/.el-button--primary.is-plain.is-disabled:hover {
    background-color: $font-color-white;
}

/deep/.el-button--primary.is-plain {
    background-color: $font-color-white;
    border-color: $theme-color;
    color: $theme-color;
}

/deep/.el-button--primary.is-plain:hover {
    background-color: #f2f5ff;
}

.iconfont {
    margin-right: 3px;
}
</style>
