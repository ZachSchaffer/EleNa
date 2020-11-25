import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Drawer } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Link, List, ListItem, ListItemText } from '@material-ui/core';

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { drawerVisible: false };
    this.toggleDrawer = this.toggleDrawer.bind(this);
  }

  toggleDrawer() {
    this.setState({ drawerVisible: !this.state.drawerVisible });
  }

  render() {
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography>
              EleNa: Team Gone Fishering
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          anchor="left"
          open={this.state.drawerVisible}
          onClose={this.toggleDrawer}
        >
          <List style={{ width: 250 }}>
            <ListItem button key={'Map View'} component={'a'} href={'/home'}>
              <ListItemText primary={'Map View'} />
            </ListItem>
            <ListItem
              button
              key={'Turn by Turn View'}
              component={'a'}
              href={'/tbt'}
            >
              <ListItemText primary={'Turn by Turn View'} />
            </ListItem>
          </List>
        </Drawer>
      </div>
    );
  }
}
