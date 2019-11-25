import React from 'react'
import { styleMerge } from '~/utils'
import configStyle from '~/style/config'
import ProgressCircle from '~/lottie/ProgressCircle'
import Style from '../Style'
import Image from '../Image'
import View from '../View'
import Lottie from '../Lottie'

const progressCircle = ProgressCircle()

export default class ProgressImage extends React.Component {

  static defaultProps = {
    loadingSize: 100,
  }

  state = {
    loading: true,
  }

  render() {
    const { loading } = this.state
    const { containerStyle, loadingSize, ...extraProps } = this.props

    return (
      <View style={styleMerge(styles.container, containerStyle)}>
        <Image
          {...extraProps}
          onLoadEnd={this.handleLoadEnd}
        />
        {
          loading && (
            <View style={styles.progressWrapper}>
              <Lottie style={{ width: loadingSize }} source={progressCircle} />
            </View>
          )
        }
      </View>
    )
  }

  componentDidMount() {
    setTimeout(() => {
      const { loading } = this.state
      if (loading && !this._unmounted) {
        this.setState({
          loading: true,
        })
      }
    }, 40)
  }

  componentWillUnmount() {
    this._unmounted = true
  }

  handleLoadEnd = () => {
    this.setState({
      loading: false,
    })
  }

}

const styles = Style.create({
  container: {
    backgroundColor: configStyle.color.background,
  },
  progressWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
})