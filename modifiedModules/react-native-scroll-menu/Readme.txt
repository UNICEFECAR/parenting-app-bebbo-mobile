

Modify the code index.js at /node_modules/react-native-scroll-menu/lib/index.js path 
to the index file in this folder
Modify the code index.js at /node_modules/react-native-app-intro-slider/dist/index.js path 
to the index file in this folder
 replace 
 <react_native_1.View style={styles.paginationContainer}>
 with this 
 <react_native_1.View style={isLastSlide ? styles.paginationContainer1:styles.paginationContainer}>
append css below paginationContainer
 paginationContainer1: {
        position: 'absolute',
        bottom: -50,
        left: 16,
        right: 16,
        justifyContent: 'center',
    },