'use strict';

import React from 'react';
const ReactNative = {...React};

export const Dimensions = {
  get() {
    return {
      width: 320,
      height: 570
    };
  }
};

ReactNative.Dimensions = { ...Dimensions };

ReactNative.StyleSheet = {
  create: function create(styles) {
    return styles;
  }
};
/*
* "export const StyleSheet = ReactNative.StyleSheet;"
* IS FIX:  for "Cannot read property 'create' of undefined"
*       when ES6 import of "StyleSheet":
*         import {
*           StyleSheet,
*           ...
*         }  from 'react-native';
*/
export const StyleSheet = ReactNative.StyleSheet;

class View extends React.Component {
  render() {
    return false;
  }
}

class ListView extends React.Component {
  render() {
    return false;
  }
}

class AppRegistry {
  static registerComponent() {
    //
  }
}

ReactNative.View = View;
ReactNative.ListView = ListView;
ReactNative.Text = View;
ReactNative.TouchableOpacity = View;
ReactNative.TouchableHighlight = View;
ReactNative.TouchableWithoutFeedback = View;
ReactNative.ToolbarAndroid = View;
ReactNative.Image = View;
ReactNative.AppRegistry = AppRegistry;
ReactNative.NativeModules = {};
ReactNative.Platform = {};


export default ReactNative;
