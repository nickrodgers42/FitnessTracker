import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
    FlatList,
    Image,
    Dimensions,
    Alert
} from 'react-native';
import {
    Body,
    Button,
    Container,
    Content,
    Footer,
    FooterTab,
    Header,
    Icon,
    Left,
    Right,
    Text,
    Thumbnail,
    ListItem,
    Title,
    Item,
    Radio,
    Input,
    Spinner,
    Card,
    CardItem,
    Toast
} from 'native-base';

import MapView, { PROVIDER_GOOGLE, Callout, Marker } from 'react-native-maps';
import { Col, Row, Grid } from 'react-native-easy-grid';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class WeatherComponent extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Body contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Thumbnail square source={{ uri: 'http://openweathermap.org/img/w/' + this.props.weather.icon + '.png' }} />
                <Text>{this.props.weather.temp + ' \u2103'}</Text>
                <Text note style={{ textAlign: 'center' }}>{this.props.weather.description}</Text>
                <Text note>{this.props.weather.clouds}% Cloudy</Text>
            </Body>
        );
    }
}
