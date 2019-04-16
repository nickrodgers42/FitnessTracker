import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
    FlatList,
    Image,
    Dimensions
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
    Title,
    Item,
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

import weatherService from '../services/weather.service';

export default class HomeScreen extends Component {
    static navigationOptions = {
        title: 'Home Screen'
    }

    constructor(props) {
        super(props);

        this.state = {
            region: null,
            currentLocation: null,
            weather: null,
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
                    this.setState({weather: results.weather});
                })
                .catch((error) => { console.error (error); });
        },
        (error) => {console.error(error);},
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
                            this.setState({weather: results.weather});
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

    // _getLocationAsync = async () => {
    //     let { status } = await Permissions.askAsync(Permissions.LOCATION);
    //     if (status !== 'granted') {
    //         this.setState({
    //             locationResult: 'Permission to access location was denied',
    //         });
    //     }

    //     let location = await Location.getCurrentPositionAsync({});
    //     this.setState({ region: JSON.stringify(location) });
    // };
    onRegionChange(region) {
        //update state, but doesn't modify map because we use initalRegion
        //if we use region prop it creates a weird update cycle
        // console.log('region changed');
        this.setState({ region });
    }

    setRegionToCurrentLocation() {
        this.setState((prevState, props) => {
            return {
                region: {
                    latitude: prevState.currentLocation.latitude,
                    longitude: prevState.currentLocation.longitude,
                    latitudeDelta: 0.00922,
                    longitudeDelta: 0.00421,
                }
            }
        })
    }

    render() {
        let dim = Dimensions.get('window');
        return (
            <Container>
                    <Grid>
                        <Row size={3} style={{justifyContent: 'center', alignItems: 'center'}}>
                            {this.state.region == null || this.state.currentLocation == null ? 
                                <Col>
                                    <Spinner style={{...StyleSheet.absoluteFillObject}} color='green' />
                                </Col>
                            : 
                                <Col style={{...StyleSheet.absoluteFillObject}}>
                                <MapView
                                    initialRegion={this.state.region}
                                    style={{...StyleSheet.absoluteFillObject}}
                                    onRegionChange={(region) => this.onRegionChange(region)}
                                    provider={PROVIDER_GOOGLE}
                                    showsUserLocation={true}
                                    region={this.state.region}
                                >
                                </MapView>
                                <Button onPress={() => {this.setRegionToCurrentLocation()}} style={{position: 'absolute'}}><Text>Center</Text></Button>
                                </Col>
                            }
                        </Row> 
                        <Row size={1} style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Col>
                                {this.state.weather == null ? null
                                :
                                    <Body>
                                        <Thumbnail square source={{ uri: 'http://openweathermap.org/img/w/' + this.state.weather.icon + '.png' }} />
                                        <Text>{this.state.weather.temp + ' \u2103'}</Text>
                                        <Text note style={{textAlign: 'center'}}>{this.state.weather.description}</Text>
                                        <Text note>{this.state.weather.clouds}% Cloudy</Text>
                                    </Body>
                                }
                            </Col>
                            <Col>
                                <Button rounded onPress={() => {this.props.navigation.push('ActivitySelectScreen')}}>
                                    <Text>Start New Activity</Text>
                                </Button>
                            </Col>
                        </Row>
                    </Grid>
            </Container>
        );
    }
}

