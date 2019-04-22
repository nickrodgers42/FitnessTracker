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

import { formatSeconds, coordDistance, toKmph, consecutiveDays, sameDay } from '../models/utilFunctions';

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
            level: 0,
            toNextLevel: 0,
            bestPace: 0,
            longestActivity: 0,
            greatestDistance: 0,
            bestStreak: 0,
            currentStreak: 0
        }
    }

    componentDidMount() {
        this.updateRewards();
        this.willFocusListener = this.props.navigation.addListener(
            'willFocus',
            data => {
                this.updateRewards();
            }
        )
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
                continue;
            }
            else if (consecutiveDays(this.props.activities[i].date, this.props.activities[i + 1].date)) {
                currentStreak += 1;
                if (currentStreak > bestStreak) {
                    bestStreak = currentStreak;
                }
            }
            else {
                currentStreak = 1;
            }
        }
        this.setState({
            level: level,
            toNextLevel: toNextLevel,
            bestPace: bestPace,
            longestActivity: longestActivity,
            greatestDistance: greatestDistance,
            bestStreak: bestStreak,
            currentStreak: currentStreak
        })
    }

    render() {
        return (
            <Container>
                <Content>
                    <Card>
                        <CardItem header>
                            <Left>
                                <Icon name='stats' style={{fontSize: 40, color: 'black'}} />
                                <Text style={Styles.titleText}>Level</Text>
                            </Left>
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Text>Current Level</Text>
                            </Left>
                            <Right>
                                <Text>{this.state.level}</Text>
                            </Right>
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Text>Activities until next level</Text>
                            </Left>
                            <Right>
                                <Text>{this.state.toNextLevel}</Text>
                            </Right>
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Text>Total Activities</Text>
                            </Left>
                            <Right>
                                <Text>{this.props.activities.length}</Text>
                            </Right>
                        </CardItem>
                    </Card>
                    <Card>
                        <CardItem header>
                            <Left>
                                <Icon name='trophy' style={{fontSize: 40, color: 'black'}} />
                                <Text style={Styles.titleText}>Personal Bests</Text>
                            </Left>
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Text>Best Pace</Text>
                            </Left>
                            <Right>
                                <Text>{this.state.bestPace.toFixed(2) + ' kmph'}</Text>
                            </Right>
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Text>Longest Activity</Text>
                            </Left>
                            <Right>
                                <Text>{formatSeconds(this.state.longestActivity)}</Text>
                            </Right>
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Text>Greatest Distance</Text>
                            </Left>
                            <Right>
                                <Text>{this.state.greatestDistance.toFixed(2) + ' km'}</Text>
                            </Right>
                        </CardItem>
                    </Card>
                    <Card>
                        <CardItem header>
                            <Left>
                                <MaterialIcons name='whatshot' style={{fontSize: 40, color: 'black'}} />
                                <Text style={Styles.titleText}>Streaks</Text>
                            </Left>
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Text>Current Streak</Text>
                            </Left>
                            <Right>
                                <Text>{this.state.currentStreak + " days in a row"}</Text>
                            </Right>
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Text>Best Streak</Text>
                            </Left>
                            <Right>
                                <Text>{this.state.bestStreak + " days in a row"}</Text>
                            </Right>
                        </CardItem>
                    </Card>
                </Content>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        activities: state.activities
    }
}

export default connect(mapStateToProps)(ActivityHistory);
