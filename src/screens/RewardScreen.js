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

import { formatSeconds, coordDistance, toKmph } from '../models/utilFunctions';

import sentimentList from '../models/sentiments';

class ActivityHistory extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Rewards Screen'
        }
    }

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <Container>
                <Card>
                    <CardItem header>
                        <Body>
                            <Text>Filter Results</Text>
                        </Body>
                    </CardItem>
                    <CardItem>
                        <Form>
                            <Item picker>
                                <Label>Time</Label>
                                <Picker
                                    mode="dropdown"
                                    style={{ width: undefined }}
                                    placeholder="Select"
                                >
                                </Picker>
                            </Item>
                        </Form>
                    </CardItem>
                </Card>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        activities: state.activityList
    }
}

export default connect(mapStateToProps)(ActivityHistory);
