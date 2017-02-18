
var Twitter = require('twitter');
var fs = require('fs');
var json2csv = require('json2csv');

var client = new Twitter({
    consumer_key: 'AAAAAAAAAAAAAAAAAAAAAIxSwwAAAAAAOYiSIE7jMVLq6bQbRBD8XRLNhHM%3DDtXUyY0AqVz7WgCDHHds0pi0XcvhCDptGqO4tm4GVjYDoXWyla',
    consumer_secret: 'AAAAAAAAAAAAAAAAAAAAAIxSwwAAAAAAOYiSIE7jMVLq6bQbRBD8XRLNhHM%3DDtXUyY0AqVz7WgCDHHds0pi0XcvhCDptGqO4tm4GVjYDoXWyla',
    bearer_token: 'AAAAAAAAAAAAAAAAAAAAAIxSwwAAAAAAOYiSIE7jMVLq6bQbRBD8XRLNhHM%3DDtXUyY0AqVz7WgCDHHds0pi0XcvhCDptGqO4tm4GVjYDoXWyla'
});

var params = {q: '@airbnb', count: 100};
client.get('search/tweets', params, function(error, tweets, response) {
    if (!error) {

        // filter last 24 tweets
        var statuses = tweets.statuses;
        // console.log(statuses.length);

        var filterd_tweets = [];
        var last_day_dt = new Date(Date.now() - 86400000);
        statuses.forEach(function(tweet) {
            var current_dt = new Date(tweet.created_at);
            if(current_dt > last_day_dt) {
                filterd_tweets.push(tweet);
            }
        });

        // console.log(filterd_tweets);
        console.log(filterd_tweets.length);

        // export to csv
        var csv = json2csv({ data: filterd_tweets });

        fs.writeFile('exported_tweets.csv', csv, function(err) {
            if (err) throw err;
            console.log('file saved');
        });

        params = {q: '@airbnb', count: 100, max_id: statuses[statuses.length-1].id};
        (function get_more_tweets() {
            client.get('search/tweets', params, function(error, tweets, response) {
                if (!error) {

                    var statuses = tweets.statuses;
                    if(statuses.length == 0) return;
                    filterd_tweets = [];
                    // console.log(statuses);
                    // console.log(statuses.length);

                    var filterd_tweets = [];
                    var last_day_dt = new Date(Date.now() - 86400000);
                    statuses.forEach(function(tweet) {
                        var current_dt = new Date(tweet.created_at);
                        if(current_dt > last_day_dt) {
                            filterd_tweets.push(tweet);
                        } else {
                            // no more relevant tweets
                            return;
                        }
                    });

                    // console.log(filterd_tweets);
                    console.log(filterd_tweets.length);

                    params = {q: '@airbnb', count: 100, max_id: statuses[statuses.length-1].id};

                    if(filterd_tweets.length == 0) return;
                    // export to csv
                    var csv = json2csv({ data: filterd_tweets });

                    fs.appendFile('exported_tweets.csv', csv, function(err) {
                      if (err) throw err;
                      console.log('file saved');
                      get_more_tweets();
                    });
                }
                else {
                    console.log(error);
                }
            });
        }());
    }
    else {
        console.log(error);
    }
});