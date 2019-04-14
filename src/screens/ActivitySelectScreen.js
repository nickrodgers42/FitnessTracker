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

export default class ActivitySelectScreen extends Component {
    static navigationOptions = {
        title: 'Select Activity'
    }

    constructor(props) {
        super(props);

        this.state = {
            selected: null
        }
    }

    /*** Mounting ***/
    componentDidMount() {
    }

    componentWillUnmount() {
    }

    select(activity) {
        this.setState({
            selected: activity
        });
    }

    render() {
        return (
            <Container>
                <Content>
                    {activityList.map((activity) => {
                        return (
                            <ListItem button key={activity[0]} onPress={() => {this.select(activity[0])}}>
                                <Left>
                                    <MaterialIcons name={activity[1]} size={30} />
                                    <Text style={{marginLeft: 15}}>{activity[0]}</Text>
                                </Left>
                                <Right>
                                    <Radio selected={this.state.selected == activity[0]} />
                                </Right>
                            </ListItem>
                        )
                    })}
                </Content>
                    <Footer>
                        <Right>
                            {this.state.selected == null ? 
                                <Button disabled>
                                    <Text>Start</Text>
                                </Button>    
                            :
                                <Button success>
                                    <Text>Start</Text>
                                </Button>
                            }
                        </Right>
                    </Footer>
            </Container>
        );
    }
}

