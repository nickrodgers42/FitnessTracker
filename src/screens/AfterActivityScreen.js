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

    render() {
        let dim = Dimensions.get('window');
        return (
            <Container>
                <Content
                    contentContainerStyle={{ flexGrow: 1, height: dim.height * 1.5, justifyContent: 'space-between' }}
                >
                    <Grid>
                        <Row>
                           <Col style={{...StyleSheet.absoluteFillObject}} >
                                <MapView
                                    
                                ></MapView>
                           </Col> 
                        </Row>
                        <Row>
                            <Grid>
                                <Row size={1}>
                                    <Text style={Styles.titleText}>Duration</Text>
                                </Row>
                                <Row size={3} style={Styles.centerItems}>
                                    <Text style={Styles.bigText}>{formatSeconds(this.props.tempActivity.seconds)}</Text>
                                </Row>
                            </Grid>
                        </Row>
                        <Row>
                            <Grid>
                                <Row size={1}>
                                    <Text style={Styles.titleText}>Weather Begin/End</Text>
                                </Row>
                                <Row size={3}>
                                    <Col>
                                        <WeatherComponent weather={this.props.tempActivity.startWeather} />
                                    </Col>
                                    <Col>
                                        {this.state.endWeather == null ? 
                                            <Spinner style={{...StyleSheet.absoluteFillObject}} color='green' />
                                        :
                                            <WeatherComponent weather={this.state.endWeather} />
                                        }
                                    </Col>
                                </Row>
                            </Grid>
                        </Row>
                        <Row><Text>3</Text></Row>
                        <Row><Text>4</Text></Row>
                        <Row><Text>5</Text></Row>
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
