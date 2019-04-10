import React, { Component } from 'react';
import TableRow from './TableRow';

function toFeet(n) {
    var realFeet = ((n * 0.393700) / 12);
    var feet = Math.floor(realFeet);
    var inches = Math.round((realFeet - feet) * 12);
    return feet + "ft / " + inches + 'in';
}
  

export default class TBody extends Component {
    render() {
        const { type, sumcm } = this.props;
        return (
            <tbody>
                {
                    (this.props.currentList !== undefined) ?
                        (this.props.currentList)
                            .filter(key => ((type === "default") ? true : key.gender === type))
                            .map((key, ix) =>
                                <TableRow key={ix} data={key} />
                            )
                        :
                        <p>No records</p>
                }

                <tr>
                    <td colSpan="2">Total: {this.props.total}</td>
                    <td>{sumcm}cm {toFeet(sumcm)}</td>
                </tr>
            </tbody>
        )
    }
}