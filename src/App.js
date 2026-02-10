import React, { Component } from 'react';
import { Root } from "native-base";
import Route from '../src/config/Route';
import { MenuProvider } from 'react-native-popup-menu';
import { Alert, AppState, Linking, Platform } from 'react-native';
import VersionCheck from 'react-native-version-check';
import { isUpdateRequired } from './Utility/utilities';

const APPLE_APP_ID = '6747247453'
const ANDROID_PACKAGE = 'com.kdkn'
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
    }
    // this._getPermission()
    this.getApplicationVersion();
  }

  

  handleAppStateChange = nextAppState => {
    if (nextAppState === 'active') {
      this.getApplicationVersion();
    }
    this.setState({appState: nextAppState});
  };

  getApplicationVersion = async () => {
    try {
      const latestVersion =
        Platform.OS === 'ios'
          ? await fetch(
              `https://itunes.apple.com/lookup?id=${APPLE_APP_ID}&country=IN`,
            )
              .then(r => r.json())
              .then(res => {
                return res?.results[0]?.version;
              })
          : await VersionCheck.getLatestVersion({
              provider: 'playStore',
              packageName: ANDROID_PACKAGE,
              ignoreErrors: true,
            });

      const currentVersion = VersionCheck.getCurrentVersion();
      // console.log(currentVersion, "currentVersion");
      // console.log(latestVersion,"latestVersion");

      // let result = isUpdateRequired('1.0.0', '1.1.0');
      // console.log(result,"isUpdateRequired");
      //    const applink = await VersionCheck.getAppStoreUrl({appID: APPLE_APP_ID})
      // console.log(applink, "applink")

      if (isUpdateRequired(currentVersion, latestVersion)) {
        Alert.alert(
          'Update Required',
          'A new version of the app is available. Please update to continue using the app.',
          [
            {
              text: 'Update Now',
              onPress: async () => {
                Linking.openURL(
                  Platform.OS === 'ios'
                    ? await VersionCheck.getAppStoreUrl({appID: APPLE_APP_ID})
                    : await VersionCheck.getPlayStoreUrl({
                        packageName: ANDROID_PACKAGE,
                      }),
                );
              },
            },
          ],
          {cancelable: false},
        );
      } else {
        // App is up-to-date; proceed with the app
      }
    } catch (error) {
      // Handle error while checking app version
      console.error('Error checking app version:', error);
    }
  };

  componentDidMount = async () => {
    this.appStateListener = AppState.addEventListener(
      'change',
      this.handleAppStateChange,
    );
  }
  render() {
    return (
      <Root>
        <MenuProvider>
          <Route />
        </MenuProvider>
      </Root>
    );
  }
};

export const URL = "https://kdkn.seqrdoc.com/api/";

export const title = "KDKN SeQR Scan";

export const HEADER = {
  Accept: 'application\/json',
  'Content-Type': 'multipart\/form-data',
  apikey: "GSka~2nu@D,knVOfz{+/RL1WMF{bka"
};
export var scanQRData = [];
export var scanSeQRData = [];
export var ISNETCONNECTED = true;
export function setValue(newValue: Boolean) {
  ISNETCONNECTED = newValue;
}