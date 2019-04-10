import React, { Component } from 'react';

export default class Header extends Component {
    render() {
      return (
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">
              <select onChange={this.props.HandleGender}>
                <option value="default">default</option>
                {
                  (this.props.genders).map((kili) =>
                    <option key={kili}>{kili}</option>
                  )
                }
              </select>
            </th>
            <th scope="col"></th>
          </tr>
          <tr>
            <th scope="col" onClick={e => this.props.sort(e, 'name')} className="clk-rl">Name</th>
            <th scope="col" onClick={e => this.props.sort(e, 'gender')} className="clk-rl">Gender</th>
            <th scope="col" onClick={e => this.props.sort(e, 'height')} className="clk-rl">Height(CM)</th>
          </tr>
        </thead>
  
      )
    }
  }