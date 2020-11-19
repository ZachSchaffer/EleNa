import React from 'react';
import { List, Grid } from '@material-ui/core';
import DirectionCard from '../../Components/DirectionCard/DirectionCard';

export default class TurnByTurn extends React.Component {
  constructor() {
    super();
    this.state = {
      directionItems: [[10, 30]],
    };
  }
  render() {
    return (
      <div style={{ marginTop: '2em' }}>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          spacing={2}
        >
          {this.state.directionItems.map((item) => {
            return (
              <Grid item>
                <DirectionCard />
              </Grid>
            );
          })}
        </Grid>
      </div>
    );
  }
}
