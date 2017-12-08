import React from 'react';
import ReactDOM from 'react-dom';
import NasaSlider from './NasaSlider.jsx';

document.addEventListener('DOMContentLoaded', function(){
    ReactDOM.render(
        <NasaSlider/>,
        document.getElementById('slider')
    );
});