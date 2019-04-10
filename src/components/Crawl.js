import React, { Component } from 'react';

export default class Crawl extends Component {
    render(){
        return(
            <div className="marquee mx-auto my-2">
                <p>{this.props.movietitle}</p>
            </div>
        )
    }
}