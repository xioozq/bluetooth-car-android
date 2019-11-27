import React from 'react'
import BluetoothSerial from 'react-native-bluetooth-serial'
import { connect, getClientSize } from '~/utils'
import { Page, View, Style, Text, Image, Button, StatusBar, Slider } from '~/components'
import configStyle from '../style/config'
const { Buffer } = require('buffer')

const clientSize = getClientSize()

@connect(({ app }) => ({ app }))
export default class Home extends Page {

  constructor() {
    super(...arguments)
    this.state = {
      speed: 5,
    }
  }

  render() {
    const { speed } = this.state
    const { bluetoothEnabled, connectedID } = this.props.app
    const deviceDisabled = !bluetoothEnabled
    const actionDisabled = !bluetoothEnabled || !connectedID
    const sliderColor = actionDisabled ? '#969CFF' : configStyle.color.primary

    return (
      <View style={styles.container}>
        <StatusBar height={0} />
        <Image style={styles.background} source={require('../assets/image/background.png')} />
        <Text style={styles.title}>BlueTooth Car Client</Text>
        <Button
          style={[styles.bluetoothBtn, connectedID ? null : styles.bluetoothBtnDisConnect]}
          onPress={this.handleSelectDevice}
          icon={require('../assets/image/icon_bluetooth.png')}
          iconStyle={styles.blurtoothBtnIcon}
          disabled={deviceDisabled}
        />
        <View style={styles.actionArea}>
          <Button
            type="circle"
            disabled={actionDisabled}
            theme="transparent"
            style={[styles.actionBtn, styles.actionBtnTop]}
            innerStyle={styles.actionBtnInner}
            onPressIn={this.handleActionBtn.bind(this, 'forward')}
            onPressOut={this.handleActionBtn.bind(this, 'stop')}
            icon={require('../assets/image/btn_arrow_up_circle.png')}
            iconStyle={styles.actionBtnIcon}
          />
          <Button
            type="circle"
            disabled={actionDisabled}
            theme="transparent"
            style={[styles.actionBtn, styles.actionBtnBottom]}
            innerStyle={styles.actionBtnInner}
            onPressIn={this.handleActionBtn.bind(this, 'back')}
            onPressOut={this.handleActionBtn.bind(this, 'stop')}
            icon={require('../assets/image/btn_arrow_down_circle.png')}
            iconStyle={styles.actionBtnIcon}
          />
          <Button
            type="circle"
            disabled={actionDisabled}
            theme="transparent"
            style={[styles.actionBtn, styles.actionBtnLeft]}
            innerStyle={styles.actionBtnInner}
            onPressIn={this.handleActionBtn.bind(this, 'left')}
            onPressOut={this.handleActionBtn.bind(this, 'stop')}
            icon={require('../assets/image/btn_arrow_left_circle.png')}
            iconStyle={styles.actionBtnIcon}
          />
          <Button
            type="circle"
            disabled={actionDisabled}
            theme="transparent"
            style={[styles.actionBtn, styles.actionBtnRight]}
            innerStyle={styles.actionBtnInner}
            onPressIn={this.handleActionBtn.bind(this, 'right')}
            onPressOut={this.handleActionBtn.bind(this, 'stop')}
            icon={require('../assets/image/btn_arrow_right_circle.png')}
            iconStyle={styles.actionBtnIcon}
          />
          <Button
            type="circle"
            disabled={actionDisabled}
            theme="transparent"
            style={[styles.actionBtn, styles.actionBtnStop]}
            innerStyle={styles.actionBtnInner}
            onPressIn={this.handleActionBtn.bind(this, 'stop')}
            icon={require('../assets/image/btn_stop_circle.png')}
            iconStyle={styles.actionBtnIcon}
          />
        </View>
        <View style={styles.bottomArea}>
          <Slider
            disabled={actionDisabled}
            style={styles.speedSlider}
            minimumValue={1}
            maximumValue={5}
            value={5}
            minimumTrackTintColor={sliderColor}
            maximumTrackTintColor="#EBEBEB"
            trackStyle={styles.speedSliderTrackStyle}
            thumbTintColor={sliderColor}
            onSlidingComplete={this.handleSpeedChange}
          />
          <View style={styles.speedLabelWrapper}>
            <Text style={styles.speedLabel}>电机转速: {speed}</Text>
          </View>
          <Button style={styles.connectBtn} onPress={this.handleConnect}>
            {
              connectedID
                ? '断开连接'
                : '未连接设备'
            }
          </Button>
        </View>
      </View>
    )
  }

  async componentDidMount() {
    await this.dispatch({ type: 'app/bluetoothStateInitial' })
    const { bluetoothEnabled, connectedID } = this.props.app

    if (bluetoothEnabled && !connectedID) {
      this.handleSelectDevice()
    }

    BluetoothSerial.on('connectionLost', this.handleConnectionLost)
  }

  handleConnectionLost = () => {
    this.showToast('连接异常断开')
    this.dispatch({
      type: 'app/updateState',
      payload: {
        connectedID: null,
      },
    })
  }

  handleConnect = () => {
    const { connectedID } = this.props.app

    if (connectedID) {
      this.dispatch({ type: 'app/disconnectDevice' })
    } else {
      this.handleSelectDevice()
    }
  }

  handleSelectDevice = () => {
    this.navTo({
      route: 'SelectDevice',
    })
  }

  handleActionBtn = (action) => {
    switch (action) {
      case 'forward': {
        return this.exec(0x02)
      }
      case 'back': {
        return this.exec(0x03)
      }
      case 'left': {
        return this.exec(0x04)
      }
      case 'right': {
        return this.exec(0x05)
      }
      case 'stop':
      default: {
        return this.exec(0x01)
      }
    }
  }

  handleSpeedChange = (value) => {
    const v = Math.ceil(value)
    this.exec(10 + v)
    this.setState({
      speed: v,
    })
  }

  exec = async (cmd) => {
    const buffer = new Buffer([cmd])
    const write = await BluetoothSerial.write(buffer)
    console.log('exec:', buffer, write)
  }

}

const styles = Style.create({
  container: {
    flex: 1,
  },
  background: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    position: 'absolute',
    top: 25,
    left: 20,
    fontSize: 24,
    lineHeight: 33,
    color: configStyle.color.primary,
  },
  bluetoothBtn: {
    position: 'absolute',
    top: 29,
    right: 26,
    width: 28,
    height: 28,
    borderRadius: 5,
  },
  bluetoothBtnDisConnect: {
    backgroundColor: '#F26E6E',
  },
  blurtoothBtnIcon: {
    width: 10,
    height: 18,
  },
  actionArea: {
    position: 'absolute',
    top: 153,
    left: (clientSize.width - 203) / 2,
    width: 203,
    height: 203,
  },
  actionBtn: {
    position: 'absolute',
    width: 40,
    height: 40,
    padding: 0,
  },
  actionBtnInner: {
    padding: 0,
  },
  actionBtnIcon: {
    width: 40,
    height: 40,
    tintColor: null,
  },
  actionBtnTop: {
    left: (203 - 40) / 2,
    top: 0,
  },
  actionBtnBottom: {
    left: (203 - 40) / 2,
    bottom: 0,
  },
  actionBtnLeft: {
    left: 0,
    top: (203 - 40) / 2,
  },
  actionBtnRight: {
    right: 0,
    top: (203 - 40) / 2,
  },
  actionBtnStop: {
    right: (203 - 40) / 2,
    top: (203 - 40) / 2,
  },
  bottomArea: {
    position: 'absolute',
    top: 446,
    left: 25,
    width: clientSize.width - 50,
  },
  connectBtn: {
    marginTop: 40,
  },
  speedSlider: {
    width: '100%',
  },
  speedSliderTrackStyle: {
    height: 7,
    borderRadius: 4,
    backgroundColor: '#EBEBEB',
  },
  speedLabelWrapper: {
    marginTop: 10,
    alignItems: 'center',
  },
  speedLabel: {
    fontSize: 14,
    color: configStyle.color.primary,
    lineHeight: 15,
  }
})