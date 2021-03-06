import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles(theme => ({
  gridRoot: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 700,
    height: 1000,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}));

class MovieList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      movies: ['1']
    }
    this.showMovies = this.showMovies.bind(this);
  }

  showMovies(movies){
    if (movies[0] === '1'){
      return (<Typography variant="h6">Loading...</Typography>)
    } else if (movies.length === 0) {
      return (<Typography variant="h6">Sorry, no movie found.</Typography>)
    } else {
      return (
        movies.map(m => (
          <GridListTile key={m.id} >
            <img src={m.image} alt={m.name} onClick ={(e) => {e.preventDefault(); window.location.href=('/detail/'+m.id)}}/>
            <GridListTileBar
              title={m.name}
              subtitle={<span>rating: {m.rating}</span>}
              actionIcon={
                <IconButton
                  aria-label={`info about ${m.name}`}
                  onClick ={(e) => {e.preventDefault(); window.location.href=('/detail/'+m.id)}}
                  className={this.props.classes.icon}
                >
                  <InfoIcon />
                </IconButton>}
              />
        </GridListTile>
        )))
    }
    
  }

  componentDidMount(){
    var fetchURL = '';
    // fetch all movies
    if (this.props.routerProps.fetchURL){
      fetchURL = this.props.routerProps.fetchURL;
      fetch(fetchURL, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
      .then(res => res.json())
      .then(res => res['movies'])
      .then(movies => movies.map((movie) => {return {'name': movie.name, 'id': movie._id, 'image': movie.image,'rating':movie.rating}}))
      .then(movies => this.setState({movies: movies}));
    }else{
      // fetch movies based on search key word
      fetchURL = 'https://web-final-demo.azurewebsites.net/api/movie/search' + this.props.routerProps.location.search;
      fetch(fetchURL, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
      .then(res => res.json())
      .then(res => res['result'])
      .then(movies => movies.map((movie) => {return {'name': movie.name, 'id': movie._id, 'image': movie.image,'rating':movie.rating}}))
      .then(movies => this.setState({movies: movies}));
    }
  }

  render(){
    return (
      <div className={this.props.classes.gridRoot}>
        <GridList cellHeight={370} className={this.props.classes.gridList}>
          <GridListTile key="Header" cols={2} style={{ height: 0 }}>
            <h2 component="div">What we found</h2>
          </GridListTile>
          {this.showMovies(this.state.movies)}
        </GridList>
      </div>
    );
  }
}

// use Hook to wrap styles classes with MovieList component
export default function Hook(props) {
  const classes = useStyles();
  return <MovieList classes={classes} routerProps={props}>Hook</MovieList>;  
}