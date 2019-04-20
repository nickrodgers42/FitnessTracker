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

class AfterActivityScreen extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam('activity') + ' Activity Summary',
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
            endWeather: null,
            activityPath: this.props.tempActivity.path
        }
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition((position) => {
            weatherService.getWeatherByCoords(position.coords.latitude, position.coords.longitude)
                .then((results) => {
                    this.setState({ endWeather: results.weather });
                })
                .catch((error) => { console.error(error); });
        },
            (error) => { console.error(error); },
            { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 },
        );
    }

    getInitialRegion() {
        let path = this.props.tempActivity.path;
        return {
            latitude: path[path.length - 1].latitude,
            longitude: path[path.length - 1].longitude,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00421,
        }
    }

    onRegionChange(region) {
        this.setState({region});
    }

    render() {
        let dim = Dimensions.get('window');
        return (
            <Container>
                <Content
                    contentContainerStyle={{ flexGrow: 1, height: dim.height * 2, justifyContent: 'space-between' }}
                >
                    <Grid>
                        <Row size={2}>
                           <Col style={{...StyleSheet.absoluteFillObject}} >
                                {this.props.tempActivity.path == null ? 
                                    <Spinner style={{ ...StyleSheet.absoluteFillObject }} color='green' />
                                :
                                    <MapView
                                        initialRegion={this.getInitialRegion()}
                                        style={{...StyleSheet.absoluteFillObject}}
                                        onRegionChange={(region) => {this.onRegionChange(region)}}
                                        provider={PROVIDER_GOOGLE}
                                        showsUserLocation={true}
                                        showsMyLocationButton
                                        showsCompass={true}
                                    >
                                        <Polyline 
                                            coordinates={this.props.tempActivity.path}
                                            strokeColor="#000"
                                            strokeWidth={4}
                                        />
                                    </MapView>
                                }
                            </Col> 
                        </Row>
                        <Row>
                            <Card style={Styles.grow}>
                                <CardItem header bordered>
                                    <Body>
                                        <Text style={Styles.titleText}>Duration</Text>
                                    </Body>
                                </CardItem>
                                <CardItem style={Styles.centerItems}>
                                    <Text style={Styles.bigText}>{formatSeconds(this.props.tempActivity.seconds)}</Text>
                                </CardItem>
                            </Card>
                        </Row>
                        <Row>
                            <Card style={Styles.grow}>
                                <CardItem header bordered>
                                    <Body>
                                        <Text style={Styles.titleText}>Distance</Text>
                                    </Body>
                                </CardItem>
                                <CardItem style={Styles.centerItems}>
                                    <Text style={Styles.bigText}>{this.props.tempActivity.distance.toString() + ' km'}</Text>
                                </CardItem>
                            </Card>
                        </Row>
                        <Row>
                            <Card style={Styles.grow}>
                                <CardItem header bordered>
                                    <Body>
                                        <Text style={Styles.titleText}>Pace</Text>
                                    </Body>
                                </CardItem>
                                <CardItem style={Styles.centerItems}>
                                    <Text style={Styles.bigText}>{ toKmph(this.props.tempActivity.seconds, this.props.tempActivity.distance).toFixed(2).toString() + ' kmph'}</Text>
                                </CardItem>
                            </Card>
                        </Row>
                        <Row size={1.5}>
                            <Card style={Styles.grow}>
                                <CardItem header bordered>
                                    <Body>
                                        <Text style={Styles.titleText}>Weather Begin/End</Text>
                                    </Body>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        <Grid style={{flexGrow: 1}} contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}>
                                            <Col>
                                                <WeatherComponent weather={this.props.tempActivity.startWeather} />
                                            </Col>
                                            <Col>
                                                {this.state.endWeather == null ?
                                                    <Spinner style={{ ...StyleSheet.absoluteFillObject }} color='green' />
                                                    :
                                                    <WeatherComponent weather={this.state.endWeather} />
                                                }
                                            </Col>
                                        </Grid>
                                    </Body>
                                </CardItem>
                            </Card>
                        </Row>
                        <Row><Text>4</Text></Row>
                    </Grid>
                </Content>
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
        saveNewActivity: (val) => dispatch(saveNewActivity(val))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AfterActivityScreen);
