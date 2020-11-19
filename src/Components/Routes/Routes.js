import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Home from '../../pages/Home/Home';
import TurnByTurn from '../../pages/TurnByTurn/TurnByTurn';

export default class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Redirect exact from="/" to="/home" />
        <Route path="/home" exact component={Home} />
        <Route path="/tbt" exact component={TurnByTurn} />
        {/*<Route component={NotFound} />*/}
      </Switch>
    );
  }
}
