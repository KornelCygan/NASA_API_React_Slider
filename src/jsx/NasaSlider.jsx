
import React from 'react';

import Navigation from './Navigation.jsx';
import Preloader from './Preloader.jsx';

class NasaSlider extends React.Component {

    constructor(props) {
        super(props);

        this.img = new Image();
        this.imageUrl ='';

        this.state = {
            apod : null,
            imgLoaded: false,
            date : new Date(),
            fetching: false,
        }

        this.today = new Date();
        this.prevDateTime = this.today.getTime();
        this.imgDatesArr = [];

    }

    componentWillMount() {
        this.loadImage('https://api.nasa.gov/planetary/apod?api_key=l1mzjg89PDylwrIsHFXtcCHM0EoBcnjdKWNQ151A');
        this.img.onload = () => {
            this.setState({imgLoaded: true}, () => console.log('image loaded'));
        };

    }

    render() {

        if (!this.state.apod || this.state.fetching === true || !this.state.imgLoaded) {
            //return <h1>Nie otrzymano obiektu z API</h1>
            return (
                <Preloader/>
            )
        }else if(this.state.apod.media_type !== "image") {
            return <h1>not an image</h1>
        } else {
            let styles = {backgroundImage : "url(" + this.img.src + ")",
            };
            return (
                <ul id="SliderList">
                    <li className="image-container" style={styles}></li>
                    <li className="navigation-container">
                        <Navigation getApodFn={this.getNextApod} apod={this.state.apod} />
                    </li>
                    <li className="dots-container">
                        <ul></ul>
                    </li>
                </ul>

            )
        }
    }

    loadImage = (url) =>{

        this.setState({fetching: true});

        fetch(url, {method : 'GET'})
            .then(result => {
                if (result.ok){
                    return result.json();
                }else{
                    throw new Exception('nie otrzymano obiektu');
                }
            })
            .then(result => {
                if (result.media_type !== "image"){
                    if(this.prevDateTime < this.state.date.getTime() ){
                        console.log('not an image, proceeding to prev apod');
                        this.getNextApod(1,result);
                    } else {
                        console.log('not an image, proceeding to next apod');
                        this.getNextApod(-1, result);
                    }
                } else {
                    if(!this.imgDatesArr.includes(result.date)){
                        this.imgDatesArr.push(result.date);
                    }
                    console.log(this.imgDatesArr);
                    this.setState({apod : result, imgLoaded: false, fetching: false}, ()=> {
                        console.log(this.state.apod);
                        this.imageUrl = this.state.apod.url;
                        this.img.src = this.imageUrl;
                    } )
                }
            })

            .catch(e=> console.log("exception: " + e))

    }

    getNextApod = (iterator, result) =>{
        let currentIndex = this.imgDatesArr.indexOf(result.date);
        let dateString;

        if(iterator === 1){
            if(currentIndex > 0){
                dateString = this.imgDatesArr[currentIndex-1];
                let newDate = new Date(dateString);
                this.prevDateTime = this.state.date.getTime();
                this.setState({
                    date: newDate,
                }, this.loadImage('https://api.nasa.gov/planetary/apod?api_key=l1mzjg89PDylwrIsHFXtcCHM0EoBcnjdKWNQ151A&date=' + dateString));
                //console.log('DATA TO ' + test);
            }
        } else if(iterator === -1){

            if(currentIndex < this.imgDatesArr.length - 1 && currentIndex > -1){
                dateString = this.imgDatesArr[currentIndex + 1];
                let newDate = new Date(dateString);
                this.prevDateTime = this.state.date.getTime();
                this.setState({
                    date: newDate,
                }, this.loadImage('https://api.nasa.gov/planetary/apod?api_key=l1mzjg89PDylwrIsHFXtcCHM0EoBcnjdKWNQ151A&date=' + dateString));
            } else {
                let newDate = new Date(this.state.date.getTime());
                newDate.setDate(newDate.getDate() + iterator);
                dateString = newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate();
                this.prevDateTime = this.state.date.getTime();
                this.setState({
                    date: newDate,
                }, this.loadImage('https://api.nasa.gov/planetary/apod?api_key=l1mzjg89PDylwrIsHFXtcCHM0EoBcnjdKWNQ151A&date=' + dateString));

            }

        }

    }

}



module.exports =NasaSlider;