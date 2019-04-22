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
    Toast,
    H1, 
    H2,
    H3
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
    newTempActivity,
    selectActivity
} from '../redux/actions/actions';

import Styles from '../Stylesheet.js'

import { formatSeconds, coordDistance, toKmph, formatDate } from '../models/utilFunctions';

import sentimentList from '../models/sentiments';

class ActivitySummary extends Component {
    constructor(props) {
        super(props);
    }

    goToActivityDetail(activity) {
        this.props.selectActivity(activity);
        this.props.navigation.push('ActivityDetail', {activity: activity.type});
    }

    render() {
        return (
            <Card>
                <CardItem
                    bordered 
                    header
                    button
                    onPress={() => this.goToActivityDetail(this.props.activity)}
                >
                    <Left>
                        <Text style={Styles.titleText}>{this.props.activity.type}</Text>
                    </Left>
                    <Right>
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Text note style={{paddingRight: 20}}>{formatDate(this.props.activity.date)}</Text>
                            <Icon name='arrow-forward' style={{fontSize: 30, color: 'black'}} />
                        </View>
                    </Right>
                </CardItem>
                <CardItem>
                    <Left>
                        <H3>Distance</H3>
                    </Left>
                    <Right>
                        <Text>{this.props.activity.distance.toFixed(2) + ' km'}</Text>
                    </Right>
                </CardItem>
                <CardItem>
                    <Left>
                        <H3>Duration</H3>
                    </Left>
                    <Right>
                        <Text>{formatSeconds(this.props.activity.seconds)}</Text>
                    </Right>
                </CardItem>
                <CardItem>
                    <Left>
                        <H3>Pace</H3>
                    </Left>
                    <Right>
                        <Text>{toKmph(this.props.activity.seconds, this.props.activity.distance).toFixed(2) + ' kmph'}</Text>
                    </Right>
                </CardItem>
            </Card>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        selectActivity: (val) => dispatch(selectActivity(val))
    }
}

export default connect(null, mapDispatchToProps)(ActivitySummary);
