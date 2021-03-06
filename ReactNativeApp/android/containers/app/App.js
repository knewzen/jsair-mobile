'use strict';

import React, {
  Component
}                               from 'react';
import {
  StyleSheet,
  Dimensions,
  Navigator,
  DrawerLayoutAndroid,
  NetInfo,
  Alert
}                               from 'react-native';
import Icon                     from 'react-native-vector-icons/Ionicons';
import * as Animatable          from 'react-native-animatable';
import FaIcon                   from 'react-native-vector-icons/FontAwesome';
import { connect }              from 'react-redux';
import { bindActionCreators }   from 'redux';
import * as actions             from '../../../common/redux/actions';
import {
  AppRoutes,
  AppColors,
  AppConfig
}                               from '../../../common/config';
import { DrawerContent }        from '../../components';
import { Button }               from '../../../common/components';
import Episodes                 from '../episodes/Episodes';
import HostAndPanelists         from '../hostAndPanelists/HostAndPanelists';
import Sponsors                 from '../sponsors/Sponsors';


const SCREEN_WIDTH  = Dimensions.get('window').width;
const DRAWER_WIDTH  = SCREEN_WIDTH ? SCREEN_WIDTH * 0.8 : 300;
const DEFAULT_ROUTE = { id: 1, refView: 'episodesView' };

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      DrawerOpened: false,
      drawerWidth:  DRAWER_WIDTH
    };
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('change',
      (isConnected) => {
        this.handlesConnectivityChanged(isConnected);
      }
    );

    NetInfo.isConnected.fetch().done(
      (isConnected) => {
        AppConfig.DEBUG_ENABLED ? console.log('first load connection, connectivity: ', isConnected) : null;
        this.handlesConnectivityChanged(isConnected);
      }
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'change',
      () => this.handlesConnectivityChanged()
    );
  }

  render() {
    const { drawerWidth } = this.state;

    return (
      <DrawerLayoutAndroid
        ref="drawer"
        drawerWidth={drawerWidth}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={this.renderNavigationView}
        openDrawer={this.handlesDrawerOpen}
        onDrawerOpen={this.onDrawerOpenEvent}
        closeDrawer={this.handlesDrawerClose}
        onDrawerClose={this.onDrawerCloseEvent}>
        <Navigator
          ref="navigator"
          initialRoute={ DEFAULT_ROUTE }
          sceneStyle={ styles.navigator }
          renderScene={this.renderScene}
          configureScene={this.configureScene}
          navigationBar={
            <Navigator.NavigationBar
              routeMapper={this.renderRouteMapper()}
              style={styles.navBar}
            />
          }
        />
    </DrawerLayoutAndroid>
    );
  }

  renderNavigationView = () => {
    return (
      <DrawerContent
        sideMenuTitle={AppConfig.sideMenuTitle}
        openDrawer={this.openDrawer}
        closeDrawer={this.closeDrawer}
        navigate={this.navigate}
      />
    );
  }

  renderScene = (route, navigator) => {
    switch (route.id) {
    case 1:
      const route1 = AppRoutes.getRouteFromRouteId(1);
      return (
        <Episodes
          ref={route1.refView}
          navigator={navigator}
          navigate={this.navigate}
        />
      );
    case 2:
      const route2 = AppRoutes.getRouteFromRouteId(2);
      return (
        <HostAndPanelists
          ref={route2.refView}
          navigator={navigator}
          navigate={this.navigate}
        />
      );
      case 3:
        const route3 = AppRoutes.getRouteFromRouteId(3);
        return (
          <Sponsors
            ref={route3.refView}
            navigator={navigator}
            navigate={this.navigate}
          />
        );
    default:
      return (
        <Episodes
          ref={route1.refView}
          navigator={navigator}
          navigate={this.navigate}
        />
      );
    }
  }

  configureScene = () => {
    return Navigator.SceneConfigs.FadeAndroid;
  }

  renderRouteMapper() {
    const routes = AppRoutes.getAllRoutes();
    return  {
      Title : (route, navigator, index, navState) => {
        return null;
      },
      LeftButton : (route, navigator, index, navState) => {
        const currentRouteId  = navState.routeStack[index].id;
        return (
          <Button
            style={styles.leftNavButton}
            onPress={this.toggleDrawer}>
            <Icon
              name={routes[currentRouteId - 1].navbar.navBarLeftIconName}
              size={42}
              color={AppColors.mainYellow}
            />
          </Button>
        );
      },
      RightButton : (route, navigator, index, navState) => {
        if (!this.props.isConnected) {
          return (
            <Animatable.View
              style={styles.rightNavButton}
              animation="pulse"
              easing="ease-out"
              iterationCount="infinite">
              <FaIcon
                name="plug"
                size={24}
                style={styles.noConnectionIcon}
                color={AppColors.darkGrey}
              />
            </Animatable.View>
          );
        }
        return null;
      }
    };
  }

  navigate = (route) => {
    const routeStack      = [].concat(this.refs.navigator.getCurrentRoutes());
    const previousRouteId = routeStack[routeStack.length - 1].id;
    if (route.id !== previousRouteId) {
      this.refs.navigator.replace(route);
    }

    if (this.state.DrawerOpened) {
      this.closeDrawer();
    }
  }

  handlesConnectivityChanged(isConnected) {
    const { actions: { connectivityChange } } = this.props;
    connectivityChange(isConnected);
    AppConfig.DEBUG_ENABLED ? console.log('set connectivity to ', isConnected) : null;
  }

  displayConnectivityAlert() {
    Alert.alert(
      AppConfig.noConnectivityAlert.title,
      AppConfig.noConnectivityAlert.description,
      [
        {
          text: AppConfig.noConnectivityAlert.buttonText,
          onPress: () => console.log('No connection button Pressed')
        }
      ]
    );
  }

  handlesDrawerOpen = () => {
    // dismissKeyboard(); // when needed
  }

  onDrawerOpenEvent = () => {
    this.setState({
      DrawerOpened : true
    });
  }

  handlesDrawerClose = () => {
    // something specific to add here
  }

  onDrawerCloseEvent = () => {
    this.setState({
      DrawerOpened : false
    });
  }

  openDrawer = () => {
    const { DrawerOpened } = this.state;
    if (DrawerOpened) {
      this.refs.drawer.openDrawer();
      this.setState({
        DrawerOpened: true
      });
    }
  }

  closeDrawer = () => {
    const { DrawerOpened } = this.state;
    if (DrawerOpened) {
      this.refs.drawer.closeDrawer();
      this.setState({
        DrawerOpened : false
      });
    }
  }

  toggleDrawer = () => {
    const { DrawerOpened } = this.state;
    if (DrawerOpened) {
      this.refs.drawer.closeDrawer();
    } else {
      this.refs.drawer.openDrawer();
    }
    this.setState({
      DrawerOpened: !DrawerOpened
    });
  }

  updateDrawerState(isOpened) {
    this.setState({
      DrawerOpened: isOpened
    });
  }

}

const styles = StyleSheet.create({
  navigator: {
    backgroundColor: AppColors.lightGrey
  },
  navBar: {
    backgroundColor:  AppColors.darkBlack,
    elevation :       0
  },
  leftNavButton : {
    flex            : 1,
    flexDirection   : 'column',
    alignItems      : 'center',
    marginTop       : 0,
    paddingTop      : 10,
    paddingBottom   : 10,
    paddingLeft     : 10,
    paddingRight    : 10
  },
  rightNavButton : {
    flex            : 1,
    flexDirection   : 'column',
    alignItems      : 'center',
    marginTop       : 5,
    paddingTop      : 10,
    paddingBottom   : 10,
    paddingLeft     : 10,
    paddingRight    : 10
  },
  titleNavText : {
    marginTop:  20,
    fontSize:   24,
    color       : AppColors.mainYellow
  },
  noConnectionIcon: {
    backgroundColor: 'transparent'
  }
});

const mapStateToProps = (state) => {
  return {
    isConnected:  state.connection.isConnected
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions : bindActionCreators(
      {
        ...actions
      },
      dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
