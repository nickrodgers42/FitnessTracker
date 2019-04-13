import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
    FlatList,
    Image
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


export default class HomeScreen extends Component {
    static navigationOptions = {
        title: 'Home Screen'
    }

    constructor(props) {
        super(props);

        this.state = {}
    }

    /*** Mounting ***/
    componentDidMount() {
    }

    render() {
        return (
            <Container>
                <Content>
                    <Text>Home</Text>
                </Content>
            </Container>
        );
    }
}

