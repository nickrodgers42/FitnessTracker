import React, { Component } from 'react';
import {
    createAppContainer,
    createBottomTabNavigator,
    createStackNavigator
} from 'react-navigation';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import HomeScreen from '../screens/HomeScreen';
import ActivitySelectScreen from '../screens/ActivitySelectScreen';
import ActivityScreen from '../screens/ActivityScreen';
import AfterActivityScreen from '../screens/AfterActivityScreen';
import ActivityHistory from '../screens/ActivityHistory';
import RewardScreen from '../screens/RewardScreen';
import ActivityDetail from '../screens/ActivityDetail';

let NavigationService = class NavigationService {
    constructor() {
    }

    getTopNavigator() {
        return (
            <TopLevelNavigator
                ref={navigatorRef => {
                    this._navigator = navigatorRef;
                }}
            />
        );
    }

    // Navigate to any screen
    navigate(routeName, params) {
        this._navigator.dispatch(
            NavigationActions.navigate({
                routeName,
                params,
            })
        );
    }
}

const TabOne = createStackNavigator(
    {
        History: ActivityHistory,
        ActivityDetail: ActivityDetail,
    }
)

const TabTwo = createStackNavigator(
    {
        Home: HomeScreen,
        ActivitySelectScreen: ActivitySelectScreen,
        ActivityScreen: ActivityScreen,
        AfterActivityScreen: AfterActivityScreen,
    }
)

const TabThree = createStackNavigator(
    {
        Rewards: RewardScreen
    }
)

const Root = createBottomTabNavigator(
    {
        History: TabOne,
        Home: TabTwo,
        Rewards: TabThree,
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                const { routeName } = navigation.state;
                let IconComponent = MaterialIcons;
                let iconName;
                if (routeName === 'History') {
                    iconName = 'history';
                } else if (routeName === 'Home') {
                    iconName = 'directions-run';
                } else if (routeName === 'Rewards') {
                    iconName = 'stars'
                }

                return <IconComponent name={iconName} size={30} color={tintColor} />;
            },
        }),
        tabBarOptions: {
            activeTintColor: '#5cb85c',
            inactiveTintColor: '#5e5e5e',
        },
    }
);

const TopLevelNavigator = createAppContainer(Root);
const navigationService = new NavigationService();
export default navigationService;
