<template>
  <div class="login-container pull-height" @keyup.enter="handleLogin">
    <login-info />
    <div class="login-border pull-height">
      <div class="login-main animated fadeIn">
        <div class="login-title-container">
          <h3 class="title"><i class="ibps-icon-logo-1" />{{ $t('login.title') }}</h3>
        </div>
        <h3><span class="title">{{ $t('login.userLogin') }}</span>

          <ibps-plugin-language class="ibps-fr" />
          <ibps-api-base-url-controller v-if="$nodeEnv === 'development'">
            <el-tooltip
              effect="dark"
              :content="$t('navbar.switchEnvironment')"
              placement="bottom"
            >
              <el-button type="text" class="ibps-fr ibps-mr-5 btn-text can-hover">
                <ibps-icon name="wifi" style="font-size: 18px;" />
              </el-button>
            </el-tooltip>
          </ibps-api-base-url-controller>
        </h3>
        <user-login />
        <login-bottom />
      </div>
    </div>

  </div>
</template>
<script>
import '@/assets/styles/pages/login.scss'
import LoginInfo from './login-info'
import LoginBottom from './login-bottom'
import UserLogin from './user-login'
import IbpsPluginLanguage from '@/plugins/language'
import IbpsApiBaseUrlController from '@/plugins/api-base-url'

export default {
  name: 'login',
  components: {
    LoginInfo,
    LoginBottom,
    UserLogin,
    IbpsPluginLanguage,
    IbpsApiBaseUrlController
  },
  data() {
    return {
      activeName: 'user'
    }
  },
  methods: {
    handleLogin() { }
  }
}
</script>
