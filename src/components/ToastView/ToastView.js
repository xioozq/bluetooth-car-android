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
    maxWidth: clientWidth - 100,
    minWidth: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, .75)',
  },
  text: {
    lineHeight: 15,
    fontSize: 12,
    color: '#fff',
  },
})