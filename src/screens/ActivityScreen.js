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

import navigationService from '../services/NavigationService';
import { connect } from "react-redux";

import MapView, { PROVIDER_GOOGLE, Callout, Marker } from 'react-native-maps';
import { Col, Row, Grid } from 'react-native-easy-grid';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import weatherService from '../services/weather.service';

import activityList from '../models/activityList';

export default class ActivitySelectScreen extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'New ' + navigation.getParam('activity') + ' Activity',
        }
    }

    openAlert() {
        if (this.state.activityInProgress) {
            Alert.alert(
                'Exit without saving',
                'You have an activity in progress. Would you like to stop and save your activity before you leave?',
                [
                    { text: 'Cancel', onPress: () => {}},
                    { text: 'Leave', onPress: () => {}},
                    { text: 'Save Activity', onPress: () => {}}
                ]
            )
        }
        else {
            this.props.navigation.navigate('HomeScreen');
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            startWeather: null,
            paused: false,
        }
    }

    /*** Mounting ***/
    componentDidMount() {
        navigator.geolocation.getCurrentPosition((position) => {
            this.setState({
                region: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.00922,
                    longitudeDelta: 0.00421
                }
            })
            weatherService.getWeatherByCoords(position.coords.latitude, position.coords.longitude)
                .then((results) => {
                    this.setState({ startWeather: results.weather });
                })
                .catch((error) => { console.error(error); });
        },
            (error) => { console.error(error); },
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
        );
        this.locationWatcher = navigator.geolocation.watchPosition(
            (position) => {
                this.setState({
                    currentLocation: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                })
            },
            (error) => { console.error(error); },
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 }
        )
        this.willFocusListener = this.props.navigation.addListener(
            'willFocus',
            data => {
                if (this.state.currentLocation != null) {
                    weatherService.getWeatherByCoords(this.state.currentLocation.latitude, this.state.currentLocation.longitude)
                        .then((results) => {
                            this.setState({startWeather: results.weather});
                        })
                        .catch((error) => {
                            console.error(error);
                        })
                }
            }
        )
    }

    componentWillUnmount() {
        this.willFocusListener.remove();
    }

    render() {
        return (
            <Container>
                <Grid>
                    <Row size={1}>
                        <Body>
                            <Text>Time</Text>
                            <Text style={{fontSize: 40, textAlign: 'center'}}>04:20</Text>
                        </Body>
                    </Row>
                    <Row size={1}>
                        <Body>
                            <Text>Distance</Text>
                            <Text style={{fontSize: 40, textAlign: 'center'}}>30 km</Text>
                        </Body>
                    </Row>
                    <Row size={1}>
                        <Body>
                            <Text>Pace</Text>
                            <Text style={{ fontSize: 40, textAlign: 'center' }}>5 kmph</Text>
                        </Body>
                    </Row>
                    <Row size={1} style={{height: 100}}>
                        <Col>
                            <Button danger full style={{ flex: 1}}>
                                <Icon name='square' style={{ fontSize: 60, textAlign: 'center'}}/>
                            </Button>
                        </Col>
                        <Col>
                            <Button success full style={{ flex: 1}}>
                                {this.state.paused ? 
                                    <Icon name='play' style={{ fontSize: 60, textAlign: 'center' }}></Icon>                                    
                                :
                                    <Icon name='pause' style={{ fontSize: 60, textAlign: 'center' }}></Icon>
                                }
                            </Button>
                        </Col>
                    </Row>
                </Grid>
            </Container>
        );
    }
}

