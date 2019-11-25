import React from 'react'
import PropTypes from 'prop-types'
import { getDeepValue } from '~/utils'

export default class Page extends React.Component {

  static contextTypes = {
    navTo: PropTypes.func,
    navBack: PropTypes.func,
    getNavStack: PropTypes.func,
    createModal: PropTypes.func,
    updateModal: PropTypes.func,
    removeModal: PropTypes.func,
    openModal: PropTypes.func,
    closeModal: PropTypes.func,
    showToast: PropTypes.func,
    showLoading: PropTypes.func,
    closeLoading: PropTypes.func,
    showConfirm: PropTypes.func,
    showActionSheet: PropTypes.func,
  }

  get params() {
    return getDeepValue(this.props, 'navigation.state.params') || {}
  }

  dispatch = (...params) => {
    return this.props.dispatch(...params)
  }

  navTo = (...params) => {
    return this.context.navTo(...params)
  }

  navBack = (...params) => {
    return this.context.navBack(...params)
  }

  getNavStack = (...params) => {
    return this.context.getNavStack(...params)
  }

  createModal = (...params) => {
    return this.context.createModal(...params)
  }

  updateModal = (...params) => {
    return this.context.updateModal(...params)
  }

  removeModal = (...params) => {
    return this.context.removeModal(...params)
  }

  openModal = (...params) => {
    return this.context.openModal(...params)
  }

  closeModal = (...params) => {
    return this.context.closeModal(...params)
  }

  showToast = (...params) => {
    return this.context.showToast(...params)
  }

  showLoading = (...params) => {
    return this.context.showLoading(...params)
  }

  closeLoading = (...params) => {
    return this.context.closeLoading(...params)
  }

  showConfirm = (...params) => {
    return this.context.showConfirm(...params)
  }

  showActionSheet = (...params) => {
    return this.context.showActionSheet(...params)
  }

}
