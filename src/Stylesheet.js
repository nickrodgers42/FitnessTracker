import {
    Dimensions,
    StyleSheet,
} from 'react-native';

export default StyleSheet.create({
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        paddingLeft: 20,
    },
    bigText: {
        fontSize: 40, 
        textAlign: 'center'
    },
    centerItems: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    grow: {
        flexGrow: 1,
        flex: 1,
    }
});
