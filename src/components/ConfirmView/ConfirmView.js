import React from 'react'
import configStyle from '~/style/config'

import Style from '../Style'
import View from '../View'
import Text from '../Text'
import Button from '../Button'

export default class ConfirmView extends React.Component {

  static defaultProps = {
    title: '',
    submitLabel: '确定',
    cancelLabel: '取消',
    renderSubmit: true,
    renderCancel: true,
  }

  render() {
    const { title, submitLabel, cancelLabel, renderSubmit, renderCancel } = this.props

    const btnParams = {
      style: styles.footerBtn,
      size: 48,
      fontSize: 18,
      type: 'simple',
      activeType: 'highlight',
    }

    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={3}>{title}</Text>
        </View>
        <View style={styles.footer}>
          {
            renderSubmit
              ? <Button {...btnParams} onPress={this.handleChange.bind(this, 'submit')} theme="#333">{submitLabel}</Button>
              : null
          }
          {
            renderCancel
              ? <Button {...btnParams} onPress={this.handleChange.bind(this, 'cancel')} style={[styles.footerBtn, styles.btnDivider]}>{cancelLabel}</Button>
              : null
          }
        </View>
      </View>
    )
  }

  handleChange = (type) => {
    const { onChange } = this.props
    typeof onChange === 'function' && onChange(type)
  }
}

const styles = Style.create({
  container: {
    width: 350,
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 50,
    paddingTop: 21,
    paddingBottom: 14,
  },
  title: {
    lineHeight: 28,
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: configStyle.color.border,
  },
  footerBtn: {
    flex: 1,
  },
  btnDivider: {
    borderLeftWidth: 1,
    borderColor: configStyle.color.border,
  },
})