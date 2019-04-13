import React, { Component } from 'react';
import {
    createAppContainer,
    createBottomTabNavigator,
    createStackNavigator
} from 'react-navigation';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import HomeScreen from '../screens/HomeScreen';

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

// const TabOne = createStackNavigator(
//     {
//     }
// )

const TabTwo = createStackNavigator(
    {
        Home: HomeScreen,
    }
)

// const TabThree = createStackNavigator(
//     {
//     }
// )

const Root = createBottomTabNavigator(
    {
        Home: TabTwo,
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                const { routeName } = navigation.state;
                let IconComponent = MaterialIcons;
                let iconName;
                if (routeName === 'Games') {
                    iconName = 'videogame-asset';
                } else if (routeName === 'Home') {
                    iconName = 'home';
                } else if (routeName === 'Favorites') {
                    iconName = 'star'
                }

                return <IconComponent name={iconName} size={25} color={tintColor} />;
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
