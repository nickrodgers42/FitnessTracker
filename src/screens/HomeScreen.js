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

import WeatherCompoent from '../models/weatherComponent';

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
                .catch((error) => { console.log (error); });
        },
        (error) => {console.log(error);},
        { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 },
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
            (error) => { console.log(error); },
            { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 }            
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
                            console.log(error);
                        })
                }
            }
        )
    }

    componentWillUnmount() {
        this.willFocusListener.remove();
    }


    onRegionChange(region) {
        //update state, but doesn't modify map because we use initalRegion
        //if we use region prop it creates a weird update cycle
        // console.log('region changed');
        this.setState({ region });
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
                                        showsMyLocationButton
                                        showsCompass
                                    >
                                    </MapView>
                                </Col>
                            }
                        </Row> 
                        <Row size={1} style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Col>
                                {this.state.weather == null ?
                                    <Spinner style={{ ...StyleSheet.absoluteFillObject }} color='green' />
                                :
                                    <WeatherCompoent weather={this.state.weather} />
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

