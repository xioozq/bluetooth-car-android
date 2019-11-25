import React from 'react'
import { getClientSize } from '~/utils'

import Style from '../Style'
import View from '../View'
import Text from '../Text'

const clientWidth = getClientSize().width

export default class ToastView extends React.Component {

  static defaultProps = {
    title: '',
  }

  render() {
    const { title } = this.props

    return (
      <View style={styles.container}>
        <Text style={styles.text} numberOfLines={3}>{title}</Text>
      </View>
    )
  }
}

const styles = Style.create({
  container: {
    maxWidth: clientWidth - 80,
    minWidth: 300,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 35,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, .65)',
  },
  text: {
    lineHeight: 28,
    fontSize: 20,
    color: '#fff',
  },
})