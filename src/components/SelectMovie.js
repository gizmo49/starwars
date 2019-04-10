import React, { Component } from 'react';
import Select from 'react-select';

export default class SelectMovie extends Component {
    render() {
      return (
        <div className="w-50 mx-auto my-3">
          <Select name="movie_list"
            isSearchable={false}
            noOptionsMessage={() => "Loading..."}
            options={this.props.options}
            onChange={this.props.HandleMovies.bind(this)} />
        </div>
  
      )
    }
  }