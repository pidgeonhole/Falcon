'use strict';

import React, { Component } from 'react';


export default class Home extends Component {

  constructor(props){
    super(props);
    console.log('super');
  }

  render(){
    return (
      <div className="test">Bang!</div>
    );
  }
}
