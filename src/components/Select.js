import React, { Component } from "react";
class Select extends Component {
  generateCurrenciesList = () => {
    let obj = this.props.avalibleCurrencies;

    return Object.keys(obj).map((key, index) => {
      return (
        <option value={key} key={index}>
          {obj[key]}
        </option>
      );
    });
  };

  render() {
    return (
      <select
        value={this.props.value}
        onChange={this.props.onChange}
        id={this.props.id}
        name={this.props.name}
      >
        {this.generateCurrenciesList()}
      </select>
    );
  }
}

export default Select;
