import React, { Component } from 'react';
import './Home.css';
import Header from '../../common/header/Header';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';

const homeStyle = theme => ({
    upcomingMovies: {
        textAlign: 'center',
        fontSize: '1rem',
        background: '#ff9999',
        padding: '8px'
    },
    gridUpcomingMovies: {
        width: '100%',
        flexWrap: 'nowrap',
        transform: 'translateZ(0)'
    },
    gridReleasedMovies: {
        transform: 'translateZ(0)',
        cursor: 'pointer'
    },
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper
    },
    title: {
        color: theme.palette.primary.light,
    },
    formControl: {
        minWidth: 240,
        maxWidth: 240,
        margin: theme.spacing.unit
    }
});

class Home extends Component {

    constructor() {
        super();
        this.state = {
            movieName: "",
            upcomingMovies: [],
            releasedMovies: [],
            genres: [],
            artists: [],
            genresList: [],
            artistsList: [],
            releaseDateStart: "",
            releaseDateEnd: ""
        }
    }

    componentDidMount() {
        let upcomingData = null;
        let upcomingRequest = new XMLHttpRequest();
        let that = this;
        upcomingRequest.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    upcomingMovies: JSON.parse(this.responseText).movies
                });
            }
        });

        upcomingRequest.open("GET", this.props.endpointBase + "movies?status=PUBLISHED");
        upcomingRequest.setRequestHeader("Cache-Control", "no-cache");
        upcomingRequest.send(upcomingData);

        let releasedData = null;
        let releasedRequest = new XMLHttpRequest();
        releasedRequest.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    releasedMovies: JSON.parse(this.responseText).movies
                });
            }
        });

        releasedRequest.open("GET", this.props.endpointBase + "movies?status=RELEASED");
        releasedRequest.setRequestHeader("Cache-Control", "no-cache");
        releasedRequest.send(releasedData);

        let genresData = null;
        let genresRequest = new XMLHttpRequest();
        genresRequest.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    genresList: JSON.parse(this.responseText).genres
                });
            }
        });

        genresRequest.open("GET", this.props.endpointBase + "genres");
        genresRequest.setRequestHeader("Cache-Control", "no-cache");
        genresRequest.send(genresData);

        let artistsData = null;
        let artistsRequest = new XMLHttpRequest();
        artistsRequest.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    artistsList: JSON.parse(this.responseText).artists
                });
            }
        });

        artistsRequest.open("GET", this.props.endpointBase + "artists");
        artistsRequest.setRequestHeader("Cache-Control", "no-cache");
        artistsRequest.send(artistsData);
    }

    setMovieNameHandler = event => {
        this.setState({ movieName: event.target.value });
    }

    selectGenreHandler = event => {
        this.setState({ genres: event.target.value });
    }

    selectArtistHandler = event => {
        this.setState({ artists: event.target.value });
    }

    setReleaseDateStartHandler = event => {
        this.setState({ releaseDateStart: event.target.value });
    }

    setReleaseDateEndHandler = event => {
        this.setState({ releaseDateEnd: event.target.value });
    }

    movieHandler = (movieId) => {
        this.props.history.push('/movie/' + movieId);
    }

    filterHandler = () => {
        let query = "?status=RELEASED";
        if (this.state.movieName !== "") {
            query += "&title=" + this.state.movieName;
        }
        if (this.state.genres.length > 0) {
            query += "&genre=" + this.state.genres.toString();
        }
        if (this.state.artists.length > 0) {
            query += "&artists=" + this.state.artists.toString();
        }
        if (this.state.releaseDateStart !== "") {
            query += "&start_date=" + this.state.releaseDateStart;
        }
        if (this.state.releaseDateEnd !== "") {
            query += "&end_date=" + this.state.releaseDateEnd;
        }

        let that = this;
        let filterData = null;
        let filterRequest = new XMLHttpRequest();
        filterRequest.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    releasedMovies: JSON.parse(this.responseText).movies
                });
            }
        });

        filterRequest.open("GET", this.props.endpointBase + "movies" + encodeURI(query));
        filterRequest.setRequestHeader("Cache-Control", "no-cache");
        filterRequest.send(filterData);
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Header endpointBase={this.props.endpointBase} />

                <div className={classes.upcomingMovies}>
                    <span>Upcoming Movies</span>
                </div>

                <GridList cols={5} className={classes.gridUpcomingMovies} >
                    {this.state.upcomingMovies.map(movie => (
                        <GridListTile key={"upcoming" + movie.id}>
                            <img src={movie.poster_url} className="movie-poster" alt={movie.title} />
                            <GridListTileBar title={movie.title} />
                        </GridListTile>
                    ))}
                </GridList>

                <div className="flex-container">
                    <div className="left">
                        <GridList cellHeight={350} cols={4} className={classes.gridReleasedMovies}>
                            {this.state.releasedMovies.map(movie => (
                                <GridListTile onClick={() => this.movieHandler(movie.id)} className="released-movie-grid-item" key={"grid" + movie.id}>
                                    <img src={movie.poster_url} className="movie-poster" alt={movie.title} />
                                    <GridListTileBar
                                        title={movie.title}
                                        subtitle={<span>Release Date: {new Date(movie.release_date).toDateString()}</span>}
                                    />
                                </GridListTile>
                            ))}
                        </GridList>
                    </div>
                    <div className="right">
                        <Card>
                            <CardContent>
                                <FormControl className={classes.formControl}>
                                    <Typography className={classes.title} color="textSecondary">
                                        FIND MOVIES BY:
                                    </Typography>
                                </FormControl>

                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="movieName">Movie Name</InputLabel>
                                    <Input id="movieName" onChange={this.setMovieNameHandler} />
                                </FormControl>

                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="select-multiple-checkbox">Genres</InputLabel>
                                    <Select
                                        multiple
                                        input={<Input id="select-multiple-checkbox-genre" />}
                                        renderValue={selected => selected.join(',')}
                                        value={this.state.genres}
                                        onChange={this.selectGenreHandler}
                                    >
                                        {this.state.genresList.map(genre => (
                                            <MenuItem key={genre.id} value={genre.genre}>
                                                <Checkbox checked={this.state.genres.indexOf(genre.genre) > -1} />
                                                <ListItemText primary={genre.genre} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="select-multiple-checkbox">Artists</InputLabel>
                                    <Select
                                        multiple
                                        input={<Input id="select-multiple-checkbox" />}
                                        renderValue={selected => selected.join(',')}
                                        value={this.state.artists}
                                        onChange={this.selectArtistHandler}
                                    >
                                        {this.state.artistsList.map(artist => (
                                            <MenuItem key={artist.id} value={artist.first_name + " " + artist.last_name}>
                                                <Checkbox checked={this.state.artists.indexOf(artist.first_name + " " + artist.last_name) > -1} />
                                                <ListItemText primary={artist.first_name + " " + artist.last_name} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl className={classes.formControl}>
                                    <TextField
                                        id="releaseDateStart"
                                        label="Release Date Start"
                                        type="date"
                                        defaultValue=""
                                        InputLabelProps={{ shrink: true }}
                                        onChange={this.setReleaseDateStartHandler}
                                    />
                                </FormControl>

                                <FormControl className={classes.formControl}>
                                    <TextField
                                        id="releaseDateEnd"
                                        label="Release Date End"
                                        type="date"
                                        defaultValue=""
                                        InputLabelProps={{ shrink: true }}
                                        onChange={this.setReleaseDateEndHandler}
                                    />
                                </FormControl>
                                <br /><br />
                                <FormControl className={classes.formControl}>
                                    <Button onClick={() => this.filterHandler()} variant="contained" color="primary">
                                        APPLY
                                    </Button>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div >
        )
    }
}

export default withStyles(homeStyle)(Home);