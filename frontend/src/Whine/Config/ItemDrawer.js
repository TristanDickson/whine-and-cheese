import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import PersonIcon from "@material-ui/icons/Person";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";
import Fab from '@material-ui/core/Fab';

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  appFrame: {
    height: 500,
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    width: "100%"
  },
  drawerPaper: {
    position: "relative",
    width: 320
  },
  contentPaper: {
    marginLeft: 20
  },
  list_item: {
    width: 240,
    display: "inline-flex"
  },
  button: {
    margin: theme.spacing.unit
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: 5,
    width: 200
  }
});

class ItemDrawer extends React.Component {
  constructor() {
    super();
    this.state = { selectedId: null, items: [] };
  }

  componentDidMount() {
    this.getItems();
  }

  handleListItemClick = _id => {
    this.setState({ ...this.state, selectedId: _id });
  };

  getItems = () => {
    console.log(`Fetching resource ${process.env.REACT_APP_BACKEND_URL}/${this.props.config.resourceName}`)
    fetch(`${process.env.REACT_APP_BACKEND_URL}/${this.props.config.resourceName}`)
      .then(response => {
        return response.json();
      })
      .then(items => {
        this.setState({ ...this.state, items: [...items] });
      });
  };

  addItem = () => {
    let fields = {};
    this.props.config.fields.forEach(field => {
      fields[field.fieldName] = "";
    });
    fetch(`${process.env.REACT_APP_BACKEND_URL}/${this.props.config.resourceName}`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields)
    })
      .then(res => {
        if (res.ok) return res.json();
      })
      .then(this.getItems);
  };

  updateItem = (_id, key, value) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/${this.props.config.resourceName}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        _id: _id,
        key: key,
        value: value
      })
    })
      .then(res => {
        if (res.ok) return res.json();
      })
      .then(this.getItems);
  };

  deleteItem = _id => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/${this.props.config.resourceName}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        _id: _id
      })
    })
      .then(res => {
        if (res.ok) return res.json();
      })
      .then(this.getItems);
  };

  createItemMenu = (list_item_style, button_style) => {
    const itemMenuList = [];
    this.state.items.forEach(item => {
      itemMenuList.push(
        <div key={this.state.items.indexOf(item)}>
          <ListItem
            className={list_item_style}
            button
            selected={this.state.selectedId === item._id}
            onClick={event => this.handleListItemClick(item._id)}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                item[Object.keys(item)[1]] === ""
                  ? `${this.props.config.displayName} ${this.state.items.indexOf(item) + 1}`
                  : item[Object.keys(item)[1]]
              }
            />
          </ListItem>
          <Fab
            size="small"
            color="secondary"
            aria-label="Add"
            className={button_style}
            onClick={() => this.deleteItem(item._id)}
          >
            <DeleteIcon />
          </Fab>
        </div>
      );
    });

    return itemMenuList;
  };

  createItemInputs = (field_style, selectedItem) => {
    const itemInputs = [];
    this.props.config.fields.forEach(field => {
      itemInputs.push(
          <TextField
            id={field.elementId}
            key={this.props.config.fields.indexOf(field)}
            label={field.displayName}
            className={field_style}
            margin="normal"
            value={selectedItem[field.fieldName]}
            onChange={event =>
              this.updateItem(
                selectedItem._id,
                field.fieldName,
                event.target.value
              )
            }
          />
      );
    });

    return itemInputs;
  };

  render() {
    const { classes } = this.props;
    let selectedItem = this.state.items.find(item => {
      return item._id === this.state.selectedId;
    });

    return (
      <div className={classes.appFrame}>
        <Drawer
          variant="permanent"
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <List component="nav">
            {this.createItemMenu(classes.list_item, classes.button)}
          </List>
          <Divider />
          <List component="nav">
            <ListItem button onClick={event => this.addItem()}>
              <ListItemIcon>
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText primary={`Add ${this.props.config.displayName}`} />
            </ListItem>
          </List>
        </Drawer>
        <div className={classes.contentPaper}>
          {selectedItem && (
            this.createItemInputs(classes.textField, selectedItem)
          )}
        </div>
      </div>
    );
  }
}

ItemDrawer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ItemDrawer);
