/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import {
	createAppContainer,
	createStackNavigator
} from 'react-navigation';
import navigationService from './services/NavigationService';

import {
	StyleProvider,
	Root
} from 'native-base';
import getTheme from '../native-base-theme/components';
import theme from '../native-base-theme/variables/material';

import {
	Provider
} from 'react-redux';

export default class App extends Component {
	render() {
		return (
			<StyleProvider style={getTheme(theme)}>
				<Root>
					{navigationService.getTopNavigator()}
				</Root>
			</StyleProvider>
		);
	}
}
