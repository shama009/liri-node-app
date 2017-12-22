// import keys.js to use its contents
var keys = require("./keys.js");
var request = require("request");
var fs = require("fs");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');

// Global variables for user input
var userCommand = process.argv[2];
var userInput = process.argv[3];

switch (userCommand) {
    case "my-tweets": getTweets(); break;
    case "spotify-this-song": getSpotifyData(); break;
    case "movie-this": getMovieData(); break;
    case "do-what-it-says": getRandomtxt(); break;
    default: console.log("Please enter valid input command");
}

// IMDB data
function getMovieData() {
    var queryUrl = "";
    if (userInput) {
        // Then run a request to the OMDB API with the movie specified
        queryUrl = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy";

        // This line is just to help us debug against the actual URL.
        console.log(queryUrl);
    }
    else {
        queryUrl = "http://www.omdbapi.com/?t=Mr.Nobody&y=&plot=short&apikey=trilogy";
    }
    request(queryUrl, function (error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {

            // Parse the body of the site and recover following
            // * Title of the movie.
            // * Year the movie came out.
            // * IMDB Rating of the movie.
            // * Rotten Tomatoes Rating of the movie.
            // * Country where the movie was produced.
            // * Language of the movie.
            // * Plot of the movie.
            // * Actors in the movie.

            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        }
    });
}

// random.txt data
function getRandomtxt() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");
        userCommand = dataArr[0];
        userInput = dataArr[1];
        getSpotifyData();
    });
}

// spotify data
// Artist(s)
// The song's name
// A preview link of the song from Spotify
// The album that the song is from
function getSpotifyData() {
    var spotify = new Spotify({
        id: keys.spotifyKeys.client_id,
        secret: keys.spotifyKeys.client_secret
    });
    if (!userInput) {
        userInput = "The Sign by Ace of Base";
    }
    spotify.search({ type: 'track', query: userInput, limit: 10 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        var songInfo = data.tracks.items;
        for (var i = 0; i < songInfo.length; i++) {
            console.log("Artist(s): " + songInfo[i].artists[0].name);
            console.log("The song's name: " + songInfo[i].name);
            console.log("Preview link: " + songInfo[i].preview_url);
            console.log("Album: " + songInfo[i].album.name);
            console.log("---------------------------------------");
        }

    });
}

// twitter data
// show last 20 tweets and when they were created at in your terminal/bash window
function getTweets() {
    var client = new Twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret
    });

    var params = { screen_name: 'BarackObama' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < 20; i++) {
                var index = i + 1;
                console.log("\n" + index + ") " + tweets[i].text + "\nCreated At: " + tweets[i].created_at);
            }
        }
        else {
            return console.log(error);
        }
    });
}




