import { LargeList } from 'react-native-largelist-v3'
import { ChineseNormalHeader } from 'react-native-spring-scrollview/Customize'
import RefreshHeader from '../RefreshHeader'

LargeList.defaultProps = {
  ...LargeList.defaultProps,
  refreshHeader: RefreshHeader,
  // refreshHeader: ChineseNormalHeader,
}

export default LargeList