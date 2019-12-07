import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles(theme => ({
  movieInfo: {
    height: 500,
    position: 'relative',
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    marginBottom: theme.spacing(4),
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,.7)',
  },
  movieInfoContent: {
    position: 'relative',
    padding: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(6),
      paddingRight: 0,
    },
  },
  root: {
    width: '100%',
    maxWidth: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  block: {
    display: 'block',
  },
}));


class MovieDetail extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      movies_comments: {}
    }
  }
  componentDidMount(){
    // mount the date fetch from the specific URL
    fetch('https://web-final-demo.azurewebsites.net/api/movie/' + this.props.routerProps.match.params.id, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
    .then(res => res.json())
    .then(movies_comments => this.setState({movies_comments: movies_comments}));
  }

  render() {
    return (
      <div>
        {/* movie information section */}
        <Paper className={this.props.classes.movieInfo} style={{ backgroundImage: `url(${this.state.movies_comments.movie.image})` }}>
          {/* Increase the priority of the hero background image */}
          <div className={this.props.classes.overlay} />
          <Grid container>
            <Grid item md={6}>
              <div className={this.props.classes.movieInfoContent}>
                <Typography align='left' component="h1" variant="h3" color="inherit" gutterBottom>
                  {this.props.movieInfo.name}
                </Typography>
                <Typography align='left' variant="subtitle1" color="inherit" paragraph>
                  {'Genre:  ' + this.props.movieInfo.genre.join(', ')}
                </Typography>
                <Typography align='left' variant="subtitle1" color="inherit" paragraph>
                  {'Actors:  ' + this.props.movieInfo.actor.join(', ')}
                </Typography>
                <Typography align='left' variant="subtitle1" color="inherit" paragraph>
                  {'Directors:  ' + this.props.movieInfo.director.join(', ')}
                </Typography>
                <Typography align='left' variant="subtitle1" color="inherit" paragraph>
                  {'PublishedDate:  ' + this.props.movieInfo.datePublished}
                </Typography>
                <Typography align='left' variant="subtitle1" color="inherit" paragraph>
                  {this.props.movieInfo.description}
                </Typography>
                <Typography align='left' variant="subtitle1" color="inherit" paragraph>
                  {'Rate:  ' + this.props.movieInfo.rating}
                </Typography>
              </div>
            </Grid>
          </Grid>
        </Paper>
        {/* user comments section */}
        <Paper>
          <Grid container>
            <Grid item md={12}>
              <List className={this.props.classes.root}>
                {this.props.movieInfo.review.map((r) => {
                  return (
                    <div key={r.userName}>
                      <ListItem alignItems='flex-start'>
                        <ListItemText
                          primary={
                            <Typography variant='h6'>
                              {r.title}
                            </Typography>
                          }
                          secondary={
                            <React.Fragment>
                              <Typography
                                component='span'
                                variant='button'
                                className={this.props.classes.block}
                                color='textPrimary'
                              >
                              {r.userName}
                              </Typography>
                              {r.content}
                            </React.Fragment>
                          }
                        />
                        <ListItemSecondaryAction key='button'>
                          <IconButton onClick={() => {window.alert("delete")}} edge="end" aria-label="delete">
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider variant="fullWidth" component="li" />
                    </div>
                  )
                })}
              </List>
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
  
}

export default function Hook(props) {
  const classes = useStyles();
  return <MovieDetail classes={classes} routerProps={props}>Hook</MovieDetail>;
}