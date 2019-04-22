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
    newTempActivity,
    updateActivities,
    discardCurrentActivity
} from '../redux/actions/actions';

import Styles from '../Stylesheet.js'

import { formatSeconds, coordDistance, toKmph, sameDay, consecutiveDays } from '../models/utilFunctions';

import sentimentList from '../models/sentiments';

import ActivitySummary from './ActivitySummary';
import dataController from '../services/datacontroller';

class ActivityDetail extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('activity', '') + ' Activity Detail' 
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            rewards: []
        }
    }
    
    componentDidMount() {
        this.updateRewards();
    }

    updateRewards() {
        let numActivities = this.props.activities.length;
        let level = Math.floor(numActivities / 5);
        let toNextLevel = 5 - Math.floor(numActivities % 5);
        let bestPace = 0;
        let longestActivity = 0;
        let greatestDistance = 0;
        let bestStreak = 1;
        let currentStreak = 1;
        let streakActivities = [this.props.activities[0]];
        let bestStreakActivities = [this.props.activities[0]];
        this.props.activities.forEach((element) => {
            let p = toKmph(element.seconds, element.distance);
            if (p > bestPace) {
                bestPace = p;
            }
            if (element.seconds > longestActivity) {
                longestActivity = element.seconds;
            }
            if (element.distance > greatestDistance) {
                greatestDistance = element.distance;
            }
        });
        for (let i = 0; i < this.props.activities.length - 1; ++i) {
            if (sameDay(this.props.activities[i].date, this.props.activities[i + 1].date)) {
                if (bestStreakActivities.includes(this.props.activities[i])) {
                    bestStreakActivities.push(this.props.activities[i + 1]);
                }
                streakActivities.push(this.props.activities[i + 1]);
            }
            else if (consecutiveDays(this.props.activities[i].date, this.props.activities[i + 1].date)) {
                currentStreak += 1;
                streakActivities.push(this.props.activities[i + 1]);
                if (currentStreak > bestStreak) {
                    bestStreak = currentStreak;
                    bestStreakActivities = [...streakActivities];
                }
            }
            else {
                currentStreak = 1;
                streakActivities = [this.props.activities[i + 1]]
            }
        }
        let rewards = []
        console.log(streakActivities);
        console.log(bestStreakActivities);
        if (streakActivities.includes(this.props.activity)) {
            rewards.push('Current Streak');
        }
        if (bestStreakActivities.includes(this.props.activity)) {
            rewards.push('Best Streak');
        }
        if (longestActivity == this.props.activity.seconds) {
            rewards.push('Longest Activity')
        }
        if (greatestDistance == this.props.activity.distance) {
            rewards.push('Greatest Distance');
        }
        if (bestPace == toKmph(this.props.activity.seconds, this.props.activity.distance)) {
            rewards.push('Best Pace');
        }
        this.setState({
            rewards: rewards
        })
    }

    getInitialRegion() {
        if (this.props.activity != null) {
            let path = this.props.activity.path;
            return {
                latitude: path[path.length - 1].latitude,
                longitude: path[path.length - 1].longitude,
                latitudeDelta: 0.00922,
                longitudeDelta: 0.00421,
            }
        }
    }

    onRegionChange(region) {
        this.setState({ region });
    }

    discardActivity() {
        this.props.discardCurrentActivity();
        this.props.navigation.goBack();
    }

    render() {
        let dim = Dimensions.get('window');
        let heightMul = 3;
        if (this.state.rewards.length > 0) {
            heightMul = 3.5;
        }
        return (
            <Container>
                <Content
                    contentContainerStyle={{ flexGrow: 1, height: dim.height * heightMul, justifyContent: 'space-between'}}
                >
                {this.props.activity == null ? null :
                    <Grid>
                        <Row size={2}>
                            <Col style={{...StyleSheet.absoluteFillObject}}>
                                <MapView
                                    initialRegion={this.getInitialRegion()}
                                    style={{...StyleSheet.absoluteFillObject}}
                                    onRegionChange={(region) => this.onRegionChange(region)}
                                    provider={PROVIDER_GOOGLE}
                                    showsUserLocation={true}
                                    showsMyLocationButton
                                    showsCompass={true}
                                >
                                    <Polyline
                                        coordinates={this.props.activity.path}
                                        strokeColor="#000"
                                        strokeWidth={4}
                                    />
                                </MapView>
                            </Col>
                        </Row>
                        <Row size={2}>
                            <Card style={Styles.grow}>
                                <CardItem header bordered>
                                    <Body>
                                        <Text style={Styles.titleText}>Post Workout Selfie</Text>
                                    </Body>
                                </CardItem>
                                    <View style={{flex: 1, flexDirection: 'column'}}>
                                        {this.props.activity.photo == null ? 
                                            <Image source={require('../../img/noImage.png')}
                                                style={{height: 200, width: null, flex: 1}}
                                            />
                                        :
                                            <Image source={{uri: this.props.activity.photo}}
                                                style={{height: 200, width:null, flex: 1}}
                                            />
                                        }
                                    </View>
                            </Card>
                        </Row>
                        <Row>
                            <Card style={Styles.grow}>
                                <CardItem header bordered>
                                    <Body>
                                        <Text style={Styles.titleText}>Duration</Text>
                                    </Body>
                                </CardItem>
                                <CardItem style={Styles.centerItems}>
                                    <Text style={Styles.bigText}>{formatSeconds(this.props.activity.seconds)}</Text>
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
                                    <Text style={Styles.bigText}>{this.props.activity.distance.toFixed(2).toString() + ' km'}</Text>
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
                                    <Text style={Styles.bigText}>{ toKmph(this.props.activity.seconds, this.props.activity.distance).toFixed(2).toString() + ' kmph'}</Text>
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
                                                <WeatherComponent weather={this.props.activity.startWeather} />
                                            </Col>
                                            <Col>
                                                <WeatherComponent weather={this.props.activity.endWeather} />
                                            </Col>
                                        </Grid>
                                    </Body>
                                </CardItem>
                            </Card>
                        </Row>
                         <Row>
                            <Card style={Styles.grow}>
                                <CardItem header bordered>
                                    <Body>
                                        <Text style={Styles.titleText}>How You Felt</Text>
                                    </Body>
                                </CardItem>
                                <CardItem style={{justifyContent: 'space-evenly', alignItems: 'center'}}>
                                    {sentimentList.map((sentiment) => {
                                        if (sentiment === this.props.activity.mood) {
                                            return (
                                                <TouchableOpacity key={sentiment} style={{borderWidth: 4, borderColor: 'black'}}>
                                                    <MaterialIcons name={sentiment} style={{padding: 10, fontSize: 60, color: 'black', textAlign: 'center'}} />
                                                </TouchableOpacity>
                                            )
                                        }
                                        return (
                                            <TouchableOpacity key={sentiment}>
                                                <MaterialIcons name={sentiment} style={{padding: 10, fontSize: 60, color: 'black', textAlign: 'center'}} />
                                            </TouchableOpacity>
                                        )
                                    })}
                                </CardItem>
                            </Card>
                        </Row>
                        {this.state.rewards.length > 0 ?
                            <Row size={2}>
                                <Card style={Styles.grow}>
                                    <CardItem header>
                                        <Left>
                                            <Icon name='star' style={{fontSize: 30, color: 'black'}} />
                                            <Text style={Styles.titleText}>Rewards</Text>
                                        </Left>
                                    </CardItem>
                                    {this.state.rewards.map((element) => {
                                        return (
                                            <CardItem key={element}>
                                                <Text>{element}</Text>
                                            </CardItem>
                                        )
                                    })}
                                </Card>
                            </Row>
                            :
                            null
                        }
                        <Row>
                            <Col>
                                <Button 
                                    full
                                    style={{flex: 1}} 
                                    danger
                                    onPress={() => {
                                        Alert.alert(
                                            'Discard Activity',
                                            'Are you sure you would like to discard this activity?',
                                            [
                                                { text: 'Discard', onPress: () => { this.discardActivity(); } },
                                                { text: 'Return to summary', onPress: () => { } }
                                            ]
                                        )
                                    }}
                                >
                                    <Icon name='trash' style={{fontSize: 60, textAlign: 'center'}} /> 
                                </Button>
                            </Col>
                        </Row>
                    </Grid>
                }
                </Content>
            </Container>
        )
    }
}

function mapStateToProps(state) {
    return {
        activity: state.selectedActivity,
        activities: state.activities
    }
}

function mapDispatchToProps(dispatch) {
    return {
        discardCurrentActivity: () => dispatch(discardCurrentActivity())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityDetail);
