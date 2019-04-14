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

export default class HomeScreen extends Component {
    static navigationOptions = {
        title: 'Home Screen'
    }

    constructor(props) {
        super(props);

        this.state = {
            region: null,
            currentLocation: null
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
                                <MapView
                                initialRegion={this.state.region}
                                style={{...StyleSheet.absoluteFillObject}}
                                onRegionChange={(region) => this.onRegionChange(region)}
                                provider={PROVIDER_GOOGLE}
                                >
                                    <Marker
                                        coordinate={ this.state.currentLocation }
                                        >
                                        <Callout>
                                            <View>
                                                <Text>Your Location</Text>
                                            </View>
                                        </Callout>
                                    </Marker>
                                </MapView>
                            }
                        </Row> 
                        <Row size={1} style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Col></Col>
                            <Col>
                                <Button rounded>
                                    <Text>Start New Activity</Text>
                                </Button>
                            </Col>
                        </Row>
                    </Grid>
            </Container>
        );
    }
}

