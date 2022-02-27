import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Details.css';
import Header from '../../common/header/Header';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import YouTube from 'react-youtube';
import StarBorderIcon from '@material-ui/icons/StarBorder';

class Details extends Component {
    constructor() {
        super();
        this.state = {
            stars: [{
                id: 1,
                stateId: "1star",
                color: "black"
            },
            {
                id: 2,
                stateId: "2star",
                color: "black"
            },
            {
                id: 3,
                stateId: "3star",
                color: "black"
            },
            {
                id: 4,
                stateId: "4star",
                color: "black"
            },
            {
                id: 5,
                stateId: "5star",
                color: "black"
            }],
            movie: {
                genres: [],
                trailer_url: "",
                artists: []
            }
        }
    }

    componentDidMount() {
        let that = this;
        let dataMovie = null;
        let movieRequest = new XMLHttpRequest();
        movieRequest.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    movie: JSON.parse(this.responseText)
                });
            }
        });

        movieRequest.open("GET", this.props.baseUrl + "movies/" + this.props.match.params.id);
        movieRequest.setRequestHeader("Cache-Control", "no-cache");
        movieRequest.send(dataMovie);
    }

    starHandler = (id) => {
        let starList = [];
        for (let star of this.state.stars) {
            let starNode = star;
            if (star.id <= id) {
                starNode.color = "yellow"
            }
            else {
                starNode.color = "black";
            }
            starList.push(starNode);
        }
        this.setState({ stars: starList });
    }
    
    artistHandler = (url) => {
        window.location = url;
    }

    render() {
        let movie = this.state.movie;
        const playerSettings = {
            height: '300',
            width: '700',
            playerVars: {
                autoplay: 1
            }
        }
        return (
            <div className="format">
                <Header id={this.props.match.params.id} baseUrl={this.props.baseUrl} showBookShowButton="true" />
                <div className="back">
                    <Typography>
                        <Link to="/">  &#60; Back to Home</Link>
                    </Typography>
                </div>
                <div className="flex-containerDetails">
                    <div className="leftContent">
                        <img className="details-poster" src={movie.poster_url} alt={movie.title} />
                    </div>

                    <div className="middleContent">
                        <div>
                            <Typography variant="headline" component="h2">{movie.title} </Typography>
                        </div>
                        <br />
                        <div>
                            <Typography>
                                <span className="bold">Genres: </span> {movie.genres.join(', ')}
                            </Typography>
                        </div>
                        <div>
                            <Typography><span className="bold">Duration:</span> {movie.duration} </Typography>
                        </div>
                        <div>
                            <Typography><span className="bold">Release Date:</span> {new Date(movie.release_date).toDateString()} </Typography>
                        </div>
                        <div>
                            <Typography><span className="bold"> Rating:</span> {movie.rating}  </Typography>
                        </div>
                        <div className="marginTop16">
                            <Typography><span className="bold">Plot:</span> <a href={movie.wiki_url}>(Wiki Link)</a> {movie.storyline} </Typography>
                        </div>
                        <div className="trailerContainer">
                            <Typography>
                                <span className="bold">Trailer:</span>
                            </Typography>
                            <YouTube
                                videoId={movie.trailer_url.split("?v=")[1]}
                                playerSettings={playerSettings}
                                onReady={this._onReady}
                            />
                        </div>
                    </div>

                    <div className="rightContent">
                        <Typography>
                            <span className="bold">Rate this movie: </span>
                        </Typography>
                        {this.state.stars.map(star => (
                            <StarBorderIcon
                                className={star.color}
                                key={"star" + star.id}
                                onClick={() => this.starHandler(star.id)}
                            />
                        ))}

                        <div className="bold marginBottom16 marginTop16">
                            <Typography>
                                <span className="bold">Artists:</span>
                            </Typography>
                        </div>
                        <div className="paddingRight">
                            <GridList cellHeight={160} cols={2}>
                                {movie.artists != null && movie.artists.map(artist => (
                                    <GridListTile
                                        className="gridTile"
                                        onClick={() => this.artistHandler(artist.wiki_url)}
                                        key={artist.id}>
                                        <img src={artist.profile_url} alt={artist.first_name + " " + artist.last_name} />
                                        <GridListTileBar
                                            title={artist.first_name + " " + artist.last_name}
                                        />
                                    </GridListTile>
                                ))}
                            </GridList>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Details;