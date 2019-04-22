import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
    FlatList,
    Image,
    Dimensions,
    CameraRoll,
    Alert,
    PermissionsAndroid
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
    Form,
    Picker,
    Label,
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

import { RNCamera } from 'react-native-camera';

import navigationService from '../services/NavigationService';
import { connect } from "react-redux";

import MapView, { PROVIDER_GOOGLE, Callout, Marker, Polyline } from 'react-native-maps';
import { Col, Row, Grid } from 'react-native-easy-grid';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import weatherService from '../services/weather.service';

import activityList from '../models/activityList';
import Activity from '../models/activity';

import WeatherComponent from '../models/weatherComponent';

import {
    newTempActivity
} from '../redux/actions/actions';

import Styles from '../Stylesheet.js'

import { formatSeconds, coordDistance, toKmph, formatDate } from '../models/utilFunctions';

import sentimentList from '../models/sentiments';

export default class ActivitySummary extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Card>
                <CardItem header>
                    <Left>
                        <Text style={Styles.titleText}>{this.props.activity.type}</Text>
                    </Left>
                    <Right>
                        <Text note>{formatDate(this.props.activity.date)}</Text>
                    </Right>
                </CardItem>
            </Card>
        )
    }
}
