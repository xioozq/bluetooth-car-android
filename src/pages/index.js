import { createStackNavigator, createAppContainer } from 'react-navigation'
import { StackViewStyleInterpolator } from 'react-navigation-stack'
import { getDeepValue } from '~/utils'
import Home from './Home'
import SelectDevice from './SelectDevice'

const RouterView = createStackNavigator({
  Home: { screen: Home },
  SelectDevice: { screen: SelectDevice },
}, {
  initialRouteName: 'Home',
  headerMode: 'none',
  mode: 'card',
  defaultNavigationOptions: {
    gesturesEnabled: true,
  },
  transitionConfig: () => ({
    screenInterpolator: (sceneProps) => {
      // 获取最顶层页面过渡效果， 由最顶层页面决定，启用哪种过渡
      const scenes = getDeepValue(sceneProps, 'scenes') || []
      const topTransition = getDeepValue(scenes, `${scenes.length - 1}.route.params.__transition`) || 'forHorizontal'
      // forHorizontal,
      // forVertical,
      // forFadeFromBottomAndroid,
      // forFadeToBottomAndroid,
      // forFade,
      // forNoAnimation,
      return StackViewStyleInterpolator[topTransition](sceneProps)
    },
    transitionSpec: {},
    transitionProps: {
      gesturesEnabled: true,
    },
  }),
})

export default createAppContainer(RouterView)