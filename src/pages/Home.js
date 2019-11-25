import React from 'react'
import { Page, View, Style, Text, Image, Button, StatusBar } from '~/components'
import configStyle from '../style/config'

export default class Home extends Page {

  constructor() {
    super(...arguments)

    this.state = {}
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar height={0} />
        <Image style={styles.background} source={require('../assets/image/background.png')} />
        <Text style={styles.title}>BlueTooth Car Client</Text>
        <Button style={styles.bluetoothBtn} onPress={this.handleSelectDevice} icon={require('../assets/image/icon_bluetooth.png')} iconStyle={styles.blurtoothBtnIcon}></Button>
      </View>
    )
  }

  handleSelectDevice = () => {
    this.navTo({
      route: 'SelectDevice',
    })
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
  blurtoothBtnIcon: {
    width: 10,
    height: 18,
  },
})