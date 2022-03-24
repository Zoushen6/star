<template>
    <div>
        <div class="unit-container">
            <template v-for="(item,idx) in unitList">
                <span v-if="idx>0 && idx%3===0" class="empty"></span>
                <span class="unit">{{item}}</span>
            </template>
        </div>

        <div>
            <template v-for="(item,idx) in displayValue">
                <span v-if="idx>0 && idx%3===0" class="separator">,</span>
                <span class="num">{{item}}</span>
            </template>
        </div>

    </div>
</template>

<script>
    export default {
        name: "CustomizedCountTo",
        props: {
            value: {
                type: String,
                require: true
            }
        },
        computed: {
            displayValue: function () {
                let str = this.value.trim();
                let val = '0000000000' + str;
                return val.substr(val.length - 9).split('');
            }
        },
        data() {
            return {
                unitList: ['亿', '千万', '百万', '十万', '万', '千', ' ', ' ', ' ']
            }
        }
    }
</script>

<style scoped lang="scss">
    .num {
        width: 48px;
        height: 60px;
        background: linear-gradient(180deg, #05EFE6 0%, #028BDA 100%);
        border-radius: 4px;
        display: inline-block;
        line-height: $line-height-huge;
        font-size: 44px;
        font-weight: $font-weight-bold;
        color: $font-color-white;
        text-align: center;
        margin-left: 2px;
        margin-right: 2px;
        font-family: $font-family-alternate;
    }

    .separator {
        display: inline-block;
        line-height: $line-height-huge;
        font-size: 20px;
        font-weight: $font-weight-bold;
        color: $font-color-white;
        margin-left: 6px;
        margin-right: 6px;
    }

    .unit-container {
        line-height: 44px;
        font-size: $font-size-addition;
    }

    .unit {
        display: inline-block;
        width: 48px;
        height: 44px;
        text-align: center;
        margin-left: 2px;
        margin-right: 2px;
        vertical-align: middle;
    }

    .empty {
        width: 16px;
        display: inline-block;
    }
</style>
