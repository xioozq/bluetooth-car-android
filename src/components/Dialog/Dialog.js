import React from 'react'

import Style from '../Style'
import View from '../View'
import Text from '../Text'
import Button from '../Button'
import Image from '../Image'
import Touch from '../Touch'
import Modal from '../Modal'

const iconClose = require('~/assets/image/icon_close.png')

export default class Dialog extends React.PureComponent {

  static defaultProps = {
    width: 440,
    height: 260,
    visible: false,
    onCancel: null,
    onSubmit: null,
    title: '',
    submitLabel: '确定',
    submitBtnProps: null,
  }

  render() {
    const { width, height, visible, title, onCancel, onSubmit, submitLabel, children, submitBtnProps } = this.props

    return (
      <Modal
        width={width}
        height={height}
        animate="scale"
        visible={visible}
      >
        <View style={styles.dialog}>
          <View style={styles.header}>
            <Touch style={styles.closeBtn} onPress={onCancel}>
              <Image style={styles.closeIcon} source={iconClose} />
            </Touch>
          </View>
          <View style={styles.content}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {children}
          </View>
          <View style={styles.footer}>
            <Button onPress={onSubmit} fontSize={17} size={50} {...submitBtnProps}>{submitLabel}</Button>
          </View>
        </View>
      </Modal>
    )
  }

}

const styles = Style.create({
  dialog: {
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  header: {
    width: '100%',
    height: 50,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  closeBtn: {
    width: 40,
    height: 40,
    padding: 10,
  },
  closeIcon: {
    width: 20,
    height: 20,
  },
  content: {
    paddingTop: 5,
    paddingHorizontal: 50,
  },
  title: {
    width: '100%',
    fontSize: 18,
    lineHeight: 25,
    textAlign: 'center',
    color: '#333',
  },
  footer: {
    paddingHorizontal: 50,
    paddingVertical: 30,
  },
})
