<template>
    <div class="login-container" v-loading="loading">
        <div class="login-box flex-all-center flex-1">
            <div class="login-wrapper" v-on:keyup.enter="onSubmit('loginForm')">
                <div class="login-logo">

                </div>
                <div class="lineInCenter">
                </div>
                <el-form ref="loginForm" :model="loginForm" :rules="rules" label-width="0px">
                    <div class="m-b-30">
                        <el-form-item prop="accountInput">
                            <el-input v-model="loginForm.accountInput" maxlength="100" placeholder="账户" clearable
                                      prefix-icon="el-icon-user"></el-input>
                        </el-form-item>
                    </div>
                    <div class="m-b-50">
                        <el-form-item prop="passwordInput">
                            <el-input placeholder="密码" maxlength="100" v-model="loginForm.passwordInput" show-password
                                      prefix-icon="el-icon-lock"></el-input>
                        </el-form-item>
                    </div>
                    <div class="valid" v-show="validAccess">
                           <span>账号名或密码有误！</span>
                    </div>
                    <el-button type="primary" @click="onSubmit('loginForm')">登 录</el-button>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                loginForm: {
                    accountInput: '',
                    passwordInput: ''
                },
                rules: {
                    accountInput: [
                        {required: true, message: '请输入账户名称'}
                    ],
                    passwordInput: [
                        {required: true, message: '请输入密码'}
                    ]
                },
                loading: false,
                validAccess:false,
            }
        },

        // 方法集合
        methods: {
            //登录数据请求
            axiosLogin() {
                return this.$http.post("user/login", {
                    username: this.loginForm.accountInput,
                    password: this.loginForm.passwordInput
                });
            },

            //提交登录
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        this.axiosLogin().then((res) => {
                            if (res.data.code === 200) {
                                this.$store.commit('setToken', res.data.data.token);
                                //储存用户信息到local
                                let userDate = JSON.stringify({
                                    token: res.data.data.token,
                                });
                                this.$common.setLocalStorage('smartAdPlatformId', userDate);
                                this.$store.commit('setLoginTime',res.data.data.login_time);
                                this.$router.push("/");
                            }
                        }).finally(() => {
                            this.loading = false;
                        });
                    } else {
                        return false;
                    }
                })
            }
        }
    }
</script>

<style lang="scss" >

    .login-container {
        width: 100%;
        height: 100%;
        position: fixed;
        left: 0;
        display: flex;
        background: url('~@/assets/login_bg.png') no-repeat #FFFFFF;
        background-size: cover;
        background-position: center;
    }

    .login-img {
        background: url("~@/assets/logo_beijixing.png") no-repeat;
        z-index: 100;
    }

    .login-image {
        width: 55%;
        height: 100%;
        position: relative;
    }

    .login-box {
        background: transparent;
    }

    .login-wrapper {
        display: flex;
        color: #000000;
        overflow: hidden;
        margin-bottom: 7.6vw;
        .login-logo {
            width: 13vw;
            height: 13vw;
            min-width: 150px;
            min-height: 150px;
            background: url("~@/assets/logo_beijixing.png") no-repeat 0;
            background-size: contain;
        }
        //中间的线
        .lineInCenter {
            width: 1px;
            height: 19.3vh;
            min-height: 120px;
            margin-top: 2.7vw;
            background: #D8D8D8;
            opacity: 0.2;
        }

        .el-form-item__content {
            width: 18.5vw;
            height: 2.5vw;
            min-width: 200px;
            min-height: 30px;
        }

        .el-form-item__error {
            left: 0.7vw;
            margin-top: 4px;
        }

        .m-b-30 {
            margin-bottom: 1.5vw;
        }

        .m-b-50 {
            margin-bottom: 2vw;
        }

        form {
            padding: 2vw 2.5vw 1vw 2.5vw;
             & > button {
                width: 18.5vw;
                font-size: $font-size-headings;
                height: 2.5vw;
                line-height: 0px;
                min-width: 200px;
                min-height: 30px;
                font-weight: $font-weight-base;
                border-radius: 27px;
                background-color: rgba(47, 52, 81, 0.75);
                box-shadow: 0px 0px 8px 0px #2570D4;
                border: 1px solid #7DD5FF;
            }

            input::-webkit-input-placeholder {
                /* WebKit browsers */
                color: #ccc;
                opacity: 0.3;
            }
            input:-moz-placeholder {
                /* Mozilla Firefox 4 to 18 */
                color: #ccc;
                opacity: 0.3;
            }
            input::-moz-placeholder {
                /* Mozilla Firefox 19+ */
                color: #ccc;
                opacity: 0.3;
            }
            input:-ms-input-placeholder {
                /* Internet Explorer 10+ */
                color: #ccc;
                opacity: 0.3;
            }

            .el-button:hover, .el-button:focus {
                background-color: rgba(47, 52, 81, 1);
                box-shadow: 0px 0px 8px 0px #2570d4;
                border: 1px solid #7DD5FF;
            }

            .el-input__icon {
                line-height: 2.6vw;
                padding-left: 8px;
                color: #7DD5FF;
            }

            .el-input__inner {
                color: #FFFFFF;
                border-color: #D9D9D9;
                height: 2.5vw;
                min-height: 28px;
                padding-left: 40px;
                font-size: $font-size-base;
                border-radius: 27px;
                background-color: transparent;
                box-shadow: 0px 0px 8px 0px #2570D4;
                border: 1px solid #7DD5FF;
            }

            .el-input__prefix, .el-input__suffix {
                color: #46A8FF;
                font-size: 1vw;
            }

            .el-form-item.is-error .el-input__inner,
            .el-form-item.is-error .el-input__inner:focus,
            .el-form-item.is-error .el-textarea__inner,
            .el-form-item.is-error .el-textarea__inner:focus {
                border-color: #7DD5FF;
            }

            input:-webkit-autofill {
                //里一层shadow  外一层shadow
                box-shadow: 0 0 0px 1000px #000c1b inset, 0px 0px 8px 0px #2570d4 !important;
            }

            input:-internal-autofill-previewed,
            input:-internal-autofill-selected {
                -webkit-text-fill-color: #FFFFFF !important;
                background: #000000!important;
            }

            @media screen and (max-width:1440px){
                .el-input__inner {
                    font-size: $font-size-addition;
                    padding-left: 32px
                }
                & > button {
                    font-size: $font-size-base;
                }
                .el-input__icon {
                    padding-left: 3px;
                    line-height: 3.3vw;
                }
            }
        }
    }

    .loginTitle {
        text-transform: uppercase;
        font-family: PingFangSC-Medium, PingFang SC;
        color: #333333;
        font-size: 30px;
        line-height: 66px;
        text-align: center;
        position: relative;
        font-weight: bold;
        height: 84px;

        b {
            color: #000000;
        }

        img {
            width: 170px;
        }

        p {
            position: absolute;
            font-size: 12px;
            color: #92c427;
            left: 50%;
            top: 4px;
            margin-left: 94px;
        }

        span {
            position: absolute;
            font-size: 12px;
            color: #92c427;
        }
    }

    .valid {
        position: relative;
    }
    .valid span {
        display: block;
        position: absolute;
        top: -29px;
        left: 33%;
        color: #FF7775;
        font-size: 14px;
        line-height: 1;
    }
</style>
