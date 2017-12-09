import React from 'react';
var Loader = require('react-loaders').Loader;

class Preloader extends React.Component {

    render(){
        return (
            <Loader type="ball-pulse" />
        )
    }

}

module.exports = Preloader;