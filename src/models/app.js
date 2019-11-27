import BluetoothSerial from 'react-native-bluetooth-serial'
import storage from '../storage'

const initialState = () => ({
  bluetoothEnabled: false,
  connectedID: null,
  deviceList: [],
})

export default {
  namespace: 'app',
  state: {
    ...initialState(),
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
    reset(state, { payload }) {
      return {
        ...state,
        ...initialState()
      }
    },
  },
  effects: {
    * bluetoothStateInitial(action, { call, put }) {
      const isEnabled = yield call(BluetoothSerial.isEnabled)
      console.log('isEnabled:', isEnabled)

      yield put({
        type: 'updateState',
        payload: {
          bluetoothEnabled: isEnabled,
        }
      })

      if (!isEnabled) {
        return storage.showToast('蓝牙无法启用， 请先打开蓝牙设置~')
      }

      yield put({
        type: 'getDeviceList'
      })

      const isConnected = yield call(BluetoothSerial.isConnected)
      console.log('isConnected:', isConnected)
    },
    * getDeviceList(action, { call, put }) {
      const list = yield call(BluetoothSerial.list)
      console.log('list:', list)

      if (list instanceof Array && list.length < 1) {
        storage.showToast('未发现可用设备， 请先确保已配对~')
      }

      yield put({
        type: 'updateState',
        payload: {
          deviceList: list,
        }
      })
    },
    * connectDevice({ payload }, { call, put }) {
      let success = true
      storage.showLoading('正在连接')
      try {
        yield call(BluetoothSerial.connect, payload.id)
        yield put({
          type: 'updateState',
          payload: {
            connectedID: payload.id,
          },
        })
        storage.showToast('连接成功, 现在可以控制了')
      } catch (err) {
        console.log('连接失败: ', err)
        storage.showToast('连接失败, 请确保小车蓝牙已开启')
        success = false
      }
      storage.closeLoading()
      return success
    },
    * disconnectDevice(action, { call, put }) {
      storage.showLoading('正在断开')
      try {
        yield call(BluetoothSerial.disconnect)
        yield put({
          type: 'updateState',
          payload: {
            connectedID: null,
          },
        })
        storage.showToast('连接已断开')
      } catch (err) {
        console.log('断开连接失败: ', err)
        storage.showToast('断开连接失败')
      }
      storage.closeLoading()
    },
  },
}