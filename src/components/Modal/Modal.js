import React from 'react'
import PropTypes from 'prop-types'

export default class Modal extends React.Component {

  static contextTypes = {
    createModal: PropTypes.func,
    updateModal: PropTypes.func,
    removeModal: PropTypes.func,
    openModal: PropTypes.func,
    closeModal: PropTypes.func,
  }

  static defaultProps = {
    visible: false,
  }

  constructor() {
    super(...arguments)
    this.id = null
  }

  render() {
    return null
  }

  componentDidMount() {
    const { visible, children, renderContent } = this.props
    this.id = this.context.createModal({
      reuse: true,
      ...this.props,
      renderContent: renderContent || (() => children || null),
    })
    if (visible) {
      this.context.openModal(this.id)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.context.updateModal(this.id, {
      ...nextProps,
      renderContent: nextProps.renderContent || (() => nextProps.children),
    })
  }

  componentWillUnmount() {
    this.context.removeModal(this.id)
  }

}
