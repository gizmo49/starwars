import React, { Component } from 'react';

export default class TableRow extends Component {
    render() {
        const { data } = this.props;
        return (
            <tr>
                <td>{data.name}</td>
                <td>{data.gender}</td>
                <td>{data.height}</td>
            </tr>
        );
    }
}
