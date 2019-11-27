import React, { Component } from 'react'
import { AppState } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import PropTypes from 'prop-types'
import { View, ModalManager, ToastView, LoadingView, ConfirmView, ActionSheetView, Linking } from '~/components'
import RouterView from '~/pages'
import models from '~/models'
import dva from '~/utils/dva'
import navigator from '~/utils/navigator'
import baseStyle from '~/style/base'
import storage from '~/storage'

class Root extends Component {

  static childContextTypes = {
    // 路由系列context
    navTo: PropTypes.func,
    navBack: PropTypes.func,
    getNavStack: PropTypes.func,

    // modal系列context
    createModal: PropTypes.func,
    updateModal: PropTypes.func,
    removeModal: PropTypes.func,
    openModal: PropTypes.func,
    closeModal: PropTypes.func,

    // Toast
    showToast: PropTypes.func,

    // Global Loading
    showLoading: PropTypes.func,
    closeLoading: PropTypes.func,

    // Confirm
    showConfirm: PropTypes.func,

    // ActionSheet
    showActionSheet: PropTypes.func,
  }

  getChildContext() {
    return {
      navTo: this.navTo,
      navBack: this.navBack,
      getNavStack: this.getNavStack,
      createModal: this.createModal,
      updateModal: this.updateModal,
      removeModal: this.removeModal,
      openModal: this.openModal,
      closeModal: this.closeModal,
      showToast: this.showToast,
      showLoading: this.showLoading,
      closeLoading: this.closeLoading,
      showConfirm: this.showConfirm,
      showActionSheet: this.showActionSheet,
    }
  }

  constructor() {
    super(...arguments)
    this.navigator = navigator
    this.modalManager = null
    this.loadingId = null
  }

  render() {

    return (
      <View style={baseStyle.page}>
        <RouterView ref={navigator => this.navigator.setNavigator(navigator)} />
        <ModalManager ref={modalManager => { this.modalManager = modalManager }} />
      </View>
    )
  }

  async componentDidMount() {
    SplashScreen.hide()
    storage.showToast = this.showToast
    storage.showLoading = this.showLoading
    storage.closeLoading = this.closeLoading
    this.createLoading()
    AppState.addEventListener('change', this.handleAppStateChange)
    Linking.addEventListener('url', this.handleSchemeURL)
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange)
    Linking.removeEventListener('url', this.handleSchemeURL)
  }

  handleAppStateChange = (nextAppState) => {
    // app进入后台， 验证密码的状态重置
    if (nextAppState !== 'active') {
      storage.lastValidatePassword = null
    }
  }

  handleSchemeURL = (e) => {
    // 通过scheme打开app的监听
    // console.log('handleOpenURL', e.url)
  }

  navTo = (...params) => {
    return this.navigator.navTo(...params)
  }

  navBack = (...params) => {
    return this.navigator.navBack(...params)
  }

  getNavStack = (...params) => {
    return this.navigator.getNavStack(...params)
  }

  createModal = (...params) => {
    return this.modalManager && this.modalManager.create(...params)
  }

  updateModal = (...params) => {
    return this.modalManager && this.modalManager.update(...params)
  }

  removeModal = (...params) => {
    return this.modalManager && this.modalManager.remove(...params)
  }

  openModal = (...params) => {
    return this.modalManager && this.modalManager.open(...params)
  }

  closeModal = (...params) => {
    return this.modalManager && this.modalManager.close(...params)
  }

  showToast = (title, params = {}) => {
    const { duration = 1500, mask = false } = params

    const id = this.createModal({
      animate: 'fade',
      duration: 200,
      horizontalCenter: true,
      verticalCenter: true,
      maskColor: 'rgba(0, 0, 0, 0)',
      modalStyle: {
        alignItems: 'center',
        justifyContent: 'center',
      },
      containerPointerEvents: mask ? undefined : 'none',
      renderContent: () => (
        <ToastView title={title} />
      ),
    })

    id && setTimeout(() => {
      this.closeModal(id)
    }, duration)

  }

  showActionSheet = (options = [], onChange) => {
    if (!(options instanceof Array) || options.length < 1) {
      return
    }

    const height = options.length * 50 + 56
    const id = this.createModal({
      animate: 'bottom',
      height,
      duration: 150,
      enableClose: true,
      renderContent: () => (
        <ActionSheetView
          options={options}
          onChange={(...params) => {
            this.closeModal(id)
            onChange(...params)
          }}
        />
      ),
    })
  }

  showConfirm = (title, onChange, params = {}) => {

    const id = this.createModal({
      animate: 'fade',
      duration: 200,
      horizontalCenter: true,
      verticalCenter: true,
      modalStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      renderContent: () => (
        <ConfirmView
          title={title}
          onChange={(...p) => {
            typeof onChange === 'function' && onChange(...p)
            if (!params.disableClose) {
              this.closeModal(id)
            }
          }} {...params} />
      ),
    })

  }

  createLoading = () => {

    this.loadingId = this.createModal({
      reuse: true,
      width: 100,
      height: 100,
      animate: 'fade',
      duration: 200,
      horizontalCenter: true,
      verticalCenter: false,
      top: '30%',
      modalStyle: {
        justifyContent: 'center',
      },
      renderContent: () => (
        <LoadingView />
      ),
    })
  }

  showLoading = (title = 'loading') => {
    this.openModal(this.loadingId, {
      renderContent: () => (
        <LoadingView title={title} />
      ),
    })
  }

  closeLoading = () => {
    this.closeModal(this.loadingId)
  }

}

const app = dva({
  initialState: {},
  models,
})

export default app.start(<Root />)
