import { SpringScrollView } from 'react-native-spring-scrollview'
import { ChineseNormalHeader } from 'react-native-spring-scrollview/Customize'
import RefreshHeader from '../RefreshHeader'

SpringScrollView.defaultProps = {
  ...SpringScrollView.defaultProps,
  refreshHeader: RefreshHeader,
  // refreshHeader: ChineseNormalHeader,
}


export default SpringScrollView
