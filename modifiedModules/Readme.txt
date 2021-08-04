open node_modules/react-native-app-intro-slider/dist/index.js
Add  in style 
paginationContainer1: {  
        position: 'absolute',
        bottom: -50,
        left: 16,
        right: 16,
        justifyContent: 'center',
    },
Replace in line no 94
<react_native_1.View style={styles.paginationContainer}>
with this
<react_native_1.View style={isLastSlide ? styles.paginationContainer1:styles.paginationContainer}>