import { TextInput } from 'react-native'

TextInput.defaultProps = {
  ...TextInput.defaultProps,
  autoCapitalize: 'none',
  autoCorrect: false,
  underlineColorAndroid: 'transparent',
  allowFontScaling: false,
  dataDetectorTypes: 'none',
  disableFullscreenUI: true,
  spellCheck: false,
  paddingVertical: 0,
}

export default TextInput