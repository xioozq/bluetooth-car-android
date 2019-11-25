import React from 'react'
import Loading from '~/lottie/Loading'

import View from '../View'
import Text from '../Text'
import Style from '../Style'
import Lottie from '../Lottie'

const loading = Loading('#dedfe0')

export default class LoadingView extends React.Component {
  static defaultProps = {
    title: 'loading...',
  }
  render() {
    const { title } = this.props
    return (
      <View style={styles.container}>
        <Lottie style={styles.animate} source={loading} />
        <Text style={styles.text}>{title}</Text>
      </View>
    )
  }
}

const styles = Style.create({
  container: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, .85)',
  },
  animate: {
    width: '100%',
    height: 60,
  },
  text: {
    lineHeight: 28,
    fontSize: 17,
    color: '#fff',
  },
})
