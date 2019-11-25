import { Text } from 'react-native'

Text.defaultProps = {
  ...Text.defaultProps,
  allowFontScaling: false,
  ellipsizeMode: 'tail',
  includeFontPadding: false,
  textAlignVertical: 'center',
  numberOfLines: 1,
}

export default Text
