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
import Activity from '../models/activity'; 

import {
    newTempActivity
} from '../redux/actions/actions';

import { formatSeconds, coordDistance, toKmph } from '../models/utilFunctions';

class ActivityScreen extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'New ' + navigation.getParam('activity') + ' Activity',
            headerLeft: <Button 
                            style={{width: 50, height: 50}} 
                            transparent
                            iconLeft
                            onPress={() => {
                                Alert.alert(
                                    'Exit without saving',
                                    'You have an activity in progress. Would you like to stop and save your activity before you leave?',
                                    [
                                        { text: 'Leave', onPress: () => { navigation.goBack()} },
                                        { text: 'Return to activity', onPress: () => { } }
                                    ]
                                )
                            }} >
                <Icon name='arrow-back'/>
            </Button>
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            startWeather: null,
            paused: false,
            seconds: 0,
            path: [],
            distance: 0
        }
    }

    componentWillMount() {
        this.startTimer();
    }
    
    /*** Mounting ***/
    componentDidMount() {
        navigator.geolocation.getCurrentPosition((position) => {
            this.setState({
                path: [{
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }]
            })
            weatherService.getWeatherByCoords(position.coords.latitude, position.coords.longitude)
                .then((results) => {
                    this.setState({ startWeather: results.weather });
                })
                .catch((error) => { console.error(error); });
        },
            (error) => { console.log(error); },
            { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 },
        );
        this.locationWatcher = navigator.geolocation.watchPosition(
            (position) => {
                if (this.state.path.length > 0 && !this.state.paused) {
                    this.setState((prevState, props) => {
                        let dist = prevState.distance;
                        let lastLat = prevState.path[prevState.path.length - 1].latitude;
                        let lastLong = prevState.path[prevState.path.length - 1].longitude;
                        let newLat = position.coords.latitude;
                        let newLong = position.coords.longitude;
                        let addDist = coordDistance(lastLat, lastLong, newLat, newLong);
                        let newPath = prevState.path.concat({latitude: newLat, longitude: newLong});
                        return {
                            path: newPath,
                            distance: dist + addDist
                        }
                    })
                }
            },
            (error) => { console.log(error); },
            { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 }
        )
        this.willFocusListener = this.props.navigation.addListener(
            'willFocus',
            data => {
                this.startTimer();
            }
        )
        this.willBlurListener = this.props.navigation.addListener(
            'willBlur',
            data => {
                this.stopTimer();
            }
        )
    }

    startTimer() {
        this.timer = setInterval(() => {
            if (!this.state.paused) {
                this.setState((prevState, props) => {
                    return {
                        seconds: prevState.seconds + 1
                    }
                })
            }
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timer);
    }

    componentWillUnmount() {
        console.log('unmount');
        this.stopTimer();
        this.willBlurListener.remove();
        this.willFocusListener.remove();
        navigator.geolocation.clearWatch(this.locationWatcher);
    }

    togglePaused() {
        this.setState((prevState, props) => {
            return {
                paused: !prevState.paused
            }
        })
    }

    stopActivity() {
        let activity = new Activity(
            this.props.navigation.getParam('activity'),
            this.state.seconds,
            this.state.path,
            this.state.distance,
            this.state.startWeather
        );
        this.props.dispatchNewTempActivity(activity);
        this.props.navigation.push('AfterActivityScreen', {activity: this.props.navigation.getParam('activity')});
    }

    render() {
        return (
            <Container>
                <Grid>
                    <Row size={1}>
                        <Body>
                            <Text>Time</Text>
                            <Text style={{fontSize: 40, textAlign: 'center'}}>{formatSeconds(this.state.seconds)}</Text>
                        </Body>
                    </Row>
                    <Row size={1}>
                        <Body>
                            <Text>Distance</Text>
                            <Text style={{fontSize: 40, textAlign: 'center'}}>{this.state.distance.toFixed(2).toString() + " km"}</Text>
                        </Body>
                    </Row>
                    <Row size={1}>
                        <Body>
                            <Text>Pace</Text>
                            <Text style={{ fontSize: 40, textAlign: 'center' }}>{toKmph(this.state.seconds, this.state.distance).toFixed(2).toString() + ' kmph'}</Text>
                        </Body>
                    </Row>
                    <Row size={1} style={{height: 100}}>
                        <Col>
                            <Button 
                                onPress={() => {
                                    this.stopActivity();
                                }}
                                danger full style={{ flex: 1}}
                            >
                                <Icon name='square' style={{ fontSize: 60, textAlign: 'center'}}/>
                            </Button>
                        </Col>
                        <Col>
                            <Button onPress={() => { this.togglePaused(); }} success full style={{ flex: 1}}>
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

function mapStateToProps(state) {
    return {
        tempActivity: state.tempActivity
    }
}

function mapDispatchToProps(dispatch) {
    return {
        dispatchNewTempActivity: (val) => dispatch(newTempActivity(val))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityScreen);
