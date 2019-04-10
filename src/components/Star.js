import React, { Component } from 'react';

export default class Star extends Component {
    render() {
        return (
            <div className="my-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Star_Wars_Logo.svg/320px-Star_Wars_Logo.svg.png"
                    style={{ "maxWidth": "100%" }} alt="StarWars" />
            </div>
        )
    }
}