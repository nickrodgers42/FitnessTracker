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

import { formatSeconds, coordDistance, toKmph } from '../models/utilFunctions';

import sentimentList from '../models/sentiments';

import ActivitySummary from './ActivitySummary';

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
        }
    }

    componentDidMount() {
        this.willFocusListener = this.props.navigation.addListener(
            'willFocus',
            data => {
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
        this.setState({
            sortSelected: value
        })
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

    render() {
        let win = Dimensions.get('window');
        return (
            <Container>
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
                {this.props.activities.map((activity) => {
                    return (
                        <ActivitySummary key={activity.date} activity={activity} />
                    )
                })}
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
