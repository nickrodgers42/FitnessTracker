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
    updateActivities
} from '../redux/actions/actions';

import Styles from '../Stylesheet.js'

import { formatSeconds, coordDistance, toKmph } from '../models/utilFunctions';

import sentimentList from '../models/sentiments';

import ActivitySummary from './ActivitySummary';
import dataController from '../services/datacontroller';

let timeItems = [
    'Time: Any',
    'Time: Past Week',
    'Time: Past Month',
    'Time: Past Year'
]

let sortItems = [
    'Most Recent',
    'Fastest Pace',
    'Longest Duration'
]

let viewItems = [
    'All Activities',
]

activityList.map((element) => {
    viewItems.push(element[0] + ' Activities');
})

class ActivityHistory extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Activity History',
        }
    }

    constructor(props) {
        super(props);
        this.state ={
            timeSelected: timeItems[0],
            sortSelected: sortItems[0],
            viewSelected: viewItems[0],
            activities: this.props.activities        
        }
    }

    componentDidMount() {
        try {
            dataController.getActivities()
                .then((result) => {
                    this.props.dispatchUpdateActivities(result)
                    this.setState({
                        activities: result.reverse()
                    })
                })
                .catch(error => { console.log(error)});
        } catch (error) {
            // dataController.setLists
        }
        this.willFocusListener = this.props.navigation.addListener(
            'willFocus',
            data => {
                this.setState({
                    activities: this.props.activities.reverse()
                })
                this.forceUpdate();
            }
        )
    }

    changeTime(value) {
        this.setState({
            timeSelected: value
        })
    }

    changeSort(value) {
        let sorted = this.props.activities.reverse();
        if (value == sortItems[1]) {
            sorted = this.sortByPace(this.props.activities);
        }
        else if (value == sortItems[2]) {
            sorted = this.sortByDuration(this.props.activities);
        }
        this.setState({
            sortSelected: value,
            activities: sorted
        })
    }

    sortByPace(activities) {
        let newActivities = [...activities];
        newActivities.sort(function(act1, act2) {
            let a = act1.distance / act1.seconds;
            let b = act2.distance / act2.seconds;
            return a - b;
        })
        return newActivities;
    }
    
    sortByDuration(activities) {
        let newActivities = [...activities];
        newActivities.sort(function(act1, act2) {
            return act2.seconds - act1.seconds;
        })
        return newActivities;
    }

    changeView(value) {
        this.setState({
            viewSelected: value
        })
    }

    resetFilters() {
        this.setState({
            timeSelected: timeItems[0],
            sortSelected: sortItems[0],
            viewSelected: viewItems[0],
        })
    }

    filterActivity(activity) {
        let today = new Date();
        let activityDate = new Date(activity.date);
        let diff = today.getTime() - activityDate.getTime();
        let numDaysBetween = (diff / (1000 * 60 * 60 * 24));        
        if (this.state.timeSelected == timeItems[3]) {
            if (numDaysBetween > 365) {
                return false;
            }
        }
        else if (this.state.timeSelected == timeItems[2]) {
            if (numDaysBetween > 30) {
                return false;
            }
        }
        else if (this.state.timeSelected == timeItems[1]) {
            if (numDaysBetween > 7) {
                return false;
            }
        }
        let type = activity.type;
        let index = viewItems.indexOf(this.state.viewSelected);
        if (index != 0) {
            let selectedType = activityList[index - 1][0];
            if (type !== selectedType) {
                return false;
            }
        }
        return true;
    }

    render() {
        let win = Dimensions.get('window');
        return (
            <Container>
                <Content>
                <Card>
                    <CardItem header>
                        <Body>
                            <Text>Filter Results</Text>
                        </Body>
                    </CardItem>
                    <CardItem>
                        <Form>
                            <Item picker>
                                <Picker
                                    mode="dropdown"
                                    selectedValue={this.state.timeSelected}
                                    onValueChange={(value) => {this.changeTime(value)}}
                                    style={{width: win.width - 40}}
                                >
                                    {timeItems.map((item) => {
                                        return (
                                            <Picker.Item key={item} label={item} value={item} />
                                        )
                                    })}
                                </Picker>
                            </Item>
                            <Item picker>
                                <Picker
                                    mode="dropdown"
                                    selectedValue={this.state.sortSelected}
                                    onValueChange={(value) => {this.changeSort(value)}}
                                    style={{ width: win.width - 40 }}
                                >
                                    {sortItems.map((item) => {
                                        return (
                                            <Picker.Item key={item} label={item} value={item} />
                                        )
                                    })}
                                </Picker>                                  
                            </Item>
                            <Item picker>
                                <Picker
                                    mode="dropdown"
                                    selectedValue={this.state.viewSelected}
                                    onValueChange={(value) => { this.changeView(value) }}
                                    style={{ width: win.width - 40 }}
                                >
                                    {viewItems.map((item) => {
                                        return (
                                            <Picker.Item key={item} label={item} value={item} />
                                        )
                                    })}
                                </Picker>
                            </Item>
                        </Form>
                    </CardItem>
                    <CardItem>
                        <Button onPress={() => {this.resetFilters()}}>
                            <Text>Reset Filters</Text>
                        </Button>
                    </CardItem>
                </Card>
                {this.state.activities.length == 0 ? 
                    <Card>
                        <CardItem header>
                            <Body>
                                <Text style={Styles.titleText}>
                                    You don't have any activities! 
                                    Head over to the home tab to start your first activity.
                                </Text>
                            </Body>
                        </CardItem>
                    </Card>
                : 
                    <View>
                    {this.state.activities.map((activity) => {
                        if (this.filterActivity(activity)) {
                            return (
                                <ActivitySummary key={activity.date} activity={activity} />
                            )
                        }
                        else {
                            return null;
                        }
                    })}
                    </View>
                }
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

function mapDispatchToProps(dispatch) {
    return {
        dispatchUpdateActivities: (val) => dispatch(updateActivities(val))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ActivityHistory);
