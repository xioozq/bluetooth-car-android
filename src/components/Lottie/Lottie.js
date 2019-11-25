import React from 'react'
import { AppState } from 'react-native'
import RNLottie from 'lottie-react-native'

export default class Lottie extends React.Component {

  static defaultProps = {
    autoPlay: true,
    loop: true,
    source: null,
  }

  constructor() {
    super(...arguments)
    this.lottie = null
    this.appState = AppState.currentState
  }

  render() {
    return (
      <RNLottie {...this.props} ref={ref => { this.lottie = ref }} />
    )
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange)
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange)
  }

  handleAppStateChange = (nextAppState) => {
    const { autoPlay } = this.props

    if (nextAppState === 'active') {
      autoPlay && this.lottie.play()
    }
  }

}