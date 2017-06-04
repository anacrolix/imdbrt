// ==UserScript==
// @name			IMDB - add Rottentomatoes info
// @namespace		https://greasyfork.org/en/users/7864-curtis-gibby
// @description		Adds info from Rottentomatoes to IMDB title pages
// @grant			GM_xmlhttpRequest
// @version			4.0.2
// @include			http://*.imdb.com/title/*/
// @include			http://*.imdb.com/title/*/?*
// @include			http://*.imdb.com/title/*/maindetails
// @include			http://*.imdb.com/title/*/combined
// @include			http://imdb.com/title/*/
// @include			http://imdb.com/title/*/maindetails
// @include			http://imdb.com/title/*/combined
// @require			http://code.jquery.com/jquery-1.11.0.min.js
// ==/UserScript==

// ==Test Cases ==
// http://www.imdb.com/title/tt1375666/ -- Inception (2010) -- RT IMDb Alias API normal (best case scenario)
// http://www.imdb.com/title/tt1375666/combined -- Inception (2010) -- Old IMDb layout -- RT IMDb Alias API normal (best case scenario)
// http://www.imdb.com/title/tt1187064/ -- Triangle (2009) -- Has a Tomatometer rating, but no consensus yet
// http://www.imdb.com/title/tt1762308/ -- Midway to Heaven (2011) -- No Tomatometer rating and no consensus
// http://www.imdb.com/title/tt1126618/ -- Morning Glory (2010) -- RT IMDb Alias API error, works through regular RT API
// http://www.imdb.com/title/tt0386676/ -- The Office (TV Series 2005– ) -- TV show (shouldn't add any RT information)
// http://www.imdb.com/title/tt1848620/ -- "The Office" Search Committee -- TV show episode (shouldn't add any RT information)
// http://www.imdb.com/title/tt1848620/combined -- "The Office" Search Committee -- Old IMDb layout -- TV show episode (shouldn't add any RT information)

// http://www.imdb.com/title/tt1375666/ -- Inception (2010) -- certified fresh
// http://www.imdb.com/title/tt1375666/ -- Inception (2010) -- upright bucket
// http://www.imdb.com/title/tt0121765/ -- Star Wars: Episode II - Attack of the Clones (2002) -- fresh
// http://www.imdb.com/title/tt0105643/ -- Troll 2 (1990) -- rotten
// http://www.imdb.com/title/tt0105643/ -- Troll 2 (1990) -- spilled bucket


// ==User-Defined Variables==

//useRottenTomatoesColors = false;
useRottenTomatoesColors = true;

//showConsensus = false;
showConsensus = true;

//showAverageRating = false;
showAverageRating = true;

// showReviewCount = false;
showReviewCount = true;

// showFreshReviewCount = false;
showFreshReviewCount = true;

// showRottenReviewCount = false;
showRottenReviewCount = true;

//showAudience = false;
showAudience = true;

//showAudienceAverageRating = false;
showAudienceAverageRating = true;

// ==/User-Defined Variables==


var insertSelector = "div.star-box";
var labelHtml = 'Rotten Tomatoes:';

if ($('table.probody').length > 0) {
	insertSelector = "table.probody";
}

if ($('#tn15').length > 0) {
	insertSelector = "div.info:first";
}

if ($('.plot_summary_wrapper').length > 0) {
	insertSelector = ".plot_summary_wrapper";
}

if (useRottenTomatoesColors == true) {
	var stylesheet = '								\
<style>												\
	#rottenTomatoesResults {						\
		padding: 5px;								\
		margin-top: 5px;							\
		clear: both;								\
		color: #6F6A57;								\
		border: 1px solid #dddddd;					\
		border-radius: 10px;						\
		-moz-box-shadow: 0px 0px 5px #ddd; 			\
		-webkit-box-shadow: 0px 0px 5px #ddd; 		\
		box-shadow: 0px 0px 5px #ddd; 				\
		background-image: -webkit-gradient(			\
			linear,									\
			left top,								\
			left 25,								\
			color-stop(0.1, rgb(255,227,125)),		\
			color-stop(0.3, rgb(255,254,215))		\
		);											\
		background-image: -moz-linear-gradient(		\
			center top,								\
			rgb(255,227,125) 10%,					\
			rgb(255,254,215) 30%					\
		);											\
	}												\
	#rottenTomatoesResults a, #rottenTomatoesResults a:link, #rottenTomatoesResults a:hover {	\
		color: #506A16 !important;					\
		text-decoration: none !important;			\
	}												\
	#rottenTomatoesResults a:hover {				\
		text-decoration: underline !important;		\
	}												\
	#rottenTomatoesResults img {					\
		margin-right: 10px;							\
	}												\
	#rottenTomatoesResults div.rtIcon {				\
		background: transparent url("https://www.rottentomatoes.com/static/images/redesign/icons-v2.png") no-repeat scroll -312px -160px;						\
		float: left;								\
		width: 48px;								\
		height: 48px;								\
	}												\
	#rottenTomatoesResults div.rtIcon.fresh {		\
		background-position: -192px -48px;			\
	}												\
	#rottenTomatoesResults div.rtIcon.certified {		\
		background-position: -192px -96px;			\
	}												\
	#rottenTomatoesResults div.rtIcon.rotten {		\
		background-position: -240px -96px;				\
	}												\
	#rottenTomatoesResults div.rtIcon.upright {		\
		background-position: -240px -48px;			\
	}												\
	#rottenTomatoesResults div.rtIcon.spilled {		\
		background-position: -192px 0;			\
	}												\
	#rottenTomatoesResults div.rtIcon.wts {			\
		background-position: -240px 0px;			\
	}												\
	#rottenTomatoesResults .floater {				\
		float:left;									\
		padding: 0 3px;								\
	}												\
	#rottenTomatoesResults .rt-credits {			\
		font-size: 11px;							\
	}												\
	#rottenTomatoesTomatoMeterScore, #rottenTomatoesAudience {				\
		color: #506A16; 							\
		font-family: Arial, Helvetica, sans-serif;	\
		font-size: 40px; 							\
		font-weight: 700; 							\
		font-style: normal; 						\
		width: 48%;			 						\
	}												\
	#rottenTomatoesTomatoMeterScore.noScore {		\
		font-size: 26px; 							\
	}												\
	#rottenTomatoesAudience {						\
		font-size: 30px; 							\
	}												\
	#rottenTomatoesConsensus {						\
		clear:both;	    							\
		font-size:11px;								\
		margin-top:10px;							\
		line-height:1.5em;							\
		width:98%;									\
	}												\
	.rottenClear {									\
		clear: both;								\
	}												\
</style>';


}
else {
	var stylesheet = '								\
<style>												\
	#rottenTomatoesResults {						\
		clear: both;								\
		margin-top: 5px;							\
	}												\
	#rottenTomatoesResults .floater {				\
		float:left;									\
		padding: 0 3px;								\
	}												\
	#rottenTomatoesResults div.rtIcon {				\
		background:url("https://www.rottentomatoes.com/static/images/redesign/icons-v2.png") 0 0;						\
		float: left;								\
		width: 32px;								\
		height: 32px;								\
	}												\
	#rottenTomatoesResults div.rtIcon.fresh {		\
		background-position: 249px 48px;			\
	}												\
	#rottenTomatoesResults div.rtIcon.certified {		\
		background-position: 152px 48px;			\
	}												\
	#rottenTomatoesResults div.rtIcon.rotten {		\
		background-position: 217px 48px;			\
	}												\
	#rottenTomatoesResults div.rtIcon.upright {		\
		background-position: 24px 152px;			\
		width: 24px;								\
		height: 24px;								\
	}												\
	#rottenTomatoesResults div.rtIcon.spilled {		\
		background-position: 24px 56px;				\
		width: 24px;								\
		height: 24px;								\
	}												\
	#rottenTomatoesResults div.rtIcon.wts {			\
		background-position: 24px 176px;			\
		width: 24px;								\
		height: 24px;								\
	}												\
	#rottenTomatoesConsensus {						\
		width:80%;									\
	}												\
	.rottenClear {									\
		clear: both;								\
	}												\
</style>';
}
$('head').append(stylesheet);

var spinnerGif = $('<img></img>').
	attr('alt', "...").
	attr('src', 'data:image/gif;base64,'+
		'R0lGODlhEAAQAPYAAP///wAAANTU1JSUlGBgYEBAQERERG5ubqKiotzc3KSkpCQkJCgoKDAwMDY2'+
		'Nj4+Pmpqarq6uhwcHHJycuzs7O7u7sLCwoqKilBQUF5eXr6+vtDQ0Do6OhYWFoyMjKqqqlxcXHx8'+
		'fOLi4oaGhg4ODmhoaJycnGZmZra2tkZGRgoKCrCwsJaWlhgYGAYGBujo6PT09Hh4eISEhPb29oKC'+
		'gqioqPr6+vz8/MDAwMrKyvj4+NbW1q6urvDw8NLS0uTk5N7e3s7OzsbGxry8vODg4NjY2PLy8tra'+
		'2np6erS0tLKyskxMTFJSUlpaWmJiYkJCQjw8PMTExHZ2djIyMurq6ioqKo6OjlhYWCwsLB4eHqCg'+
		'oE5OThISEoiIiGRkZDQ0NMjIyMzMzObm5ri4uH5+fpKSkp6enlZWVpCQkEpKSkhISCIiIqamphAQ'+
		'EAwMDKysrAQEBJqamiYmJhQUFDg4OHR0dC4uLggICHBwcCAgIFRUVGxsbICAgAAAAAAAAAAAACH/'+
		'C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwA'+
		'AAAAEAAQAAAHjYAAgoOEhYUbIykthoUIHCQqLoI2OjeFCgsdJSsvgjcwPTaDAgYSHoY2FBSWAAML'+
		'E4wAPT89ggQMEbEzQD+CBQ0UsQA7RYIGDhWxN0E+ggcPFrEUQjuCCAYXsT5DRIIJEBgfhjsrFkaD'+
		'ERkgJhswMwk4CDzdhBohJwcxNB4sPAmMIlCwkOGhRo5gwhIGAgAh+QQJCgAAACwAAAAAEAAQAAAH'+
		'jIAAgoOEhYU7A1dYDFtdG4YAPBhVC1ktXCRfJoVKT1NIERRUSl4qXIRHBFCbhTKFCgYjkII3g0hL'+
		'UbMAOjaCBEw9ukZGgidNxLMUFYIXTkGzOmLLAEkQCLNUQMEAPxdSGoYvAkS9gjkyNEkJOjovRWAb'+
		'04NBJlYsWh9KQ2FUkFQ5SWqsEJIAhq6DAAIBACH5BAkKAAAALAAAAAAQABAAAAeJgACCg4SFhQkK'+
		'E2kGXiwChgBDB0sGDw4NDGpshTheZ2hRFRVDUmsMCIMiZE48hmgtUBuCYxBmkAAQbV2CLBM+t0pu'+
		'aoIySDC3VC4tgh40M7eFNRdH0IRgZUO3NjqDFB9mv4U6Pc+DRzUfQVQ3NzAULxU2hUBDKENCQTtA'+
		'L9yGRgkbcvggEq9atUAAIfkECQoAAAAsAAAAABAAEAAAB4+AAIKDhIWFPygeEE4hbEeGADkXBycZ'+
		'Z1tqTkqFQSNIbBtGPUJdD088g1QmMjiGZl9MO4I5ViiQAEgMA4JKLAm3EWtXgmxmOrcUElWCb2zH'+
		'kFQdcoIWPGK3Sm1LgkcoPrdOKiOCRmA4IpBwDUGDL2A5IjCCN/QAcYUURQIJIlQ9MzZu6aAgRgwF'+
		'GAFvKRwUCAAh+QQJCgAAACwAAAAAEAAQAAAHjIAAgoOEhYUUYW9lHiYRP4YACStxZRc0SBMyFoVE'+
		'PAoWQDMzAgolEBqDRjg8O4ZKIBNAgkBjG5AAZVtsgj44VLdCanWCYUI3txUPS7xBx5AVDgazAjC3'+
		'Q3ZeghUJv5B1cgOCNmI/1YUeWSkCgzNUFDODKydzCwqFNkYwOoIubnQIt244MzDC1q2DggIBACH5'+
		'BAkKAAAALAAAAAAQABAAAAeJgACCg4SFhTBAOSgrEUEUhgBUQThjSh8IcQo+hRUbYEdUNjoiGlZW'+
		'QYM2QD4vhkI0ZWKCPQmtkG9SEYJURDOQAD4HaLuyv0ZeB4IVj8ZNJ4IwRje/QkxkgjYz05BdamyD'+
		'N9uFJg9OR4YEK1RUYzFTT0qGdnduXC1Zchg8kEEjaQsMzpTZ8avgoEAAIfkECQoAAAAsAAAAABAA'+
		'EAAAB4iAAIKDhIWFNz0/Oz47IjCGADpURAkCQUI4USKFNhUvFTMANxU7KElAhDA9OoZHH0oVgjcz'+
		'rJBRZkGyNpCCRCw8vIUzHmXBhDM0HoIGLsCQAjEmgjIqXrxaBxGCGw5cF4Y8TnybglprLXhjFBUW'+
		'VnpeOIUIT3lydg4PantDz2UZDwYOIEhgzFggACH5BAkKAAAALAAAAAAQABAAAAeLgACCg4SFhjc6'+
		'RhUVRjaGgzYzRhRiREQ9hSaGOhRFOxSDQQ0uj1RBPjOCIypOjwAJFkSCSyQrrhRDOYILXFSuNkpj'+
		'ggwtvo86H7YAZ1korkRaEYJlC3WuESxBggJLWHGGFhcIxgBvUHQyUT1GQWwhFxuFKyBPakxNXgce'+
		'YY9HCDEZTlxA8cOVwUGBAAA7AAAAAAAAAAAA'
	);
	
// try to avoid running on TV series pages
if (document.title.indexOf('TV Series') < 0
	&& document.title.indexOf('TV mini-series') < 0
	&& $("#pagecontent").html().indexOf('<h2 class="tv_header">') < 0
	&& $("#pagecontent").html().indexOf("<h5>TV Series:</h5>") < 0
) {
	getRTFromImdbId();
}

function getRTFromImdbId() {

	var rottenTomatoesResults = $('<div/>').
		attr('id', "rottenTomatoesResults").
		html("Checking Rotten Tomatoes... ").
		append(spinnerGif);
	$(insertSelector).append(rottenTomatoesResults);

	var apiUrl = 'http://www.omdbapi.com/?tomatoes=true&i=tt'+getIMDBid()+'&apikey=aa5ed605';

	GM_xmlhttpRequest({
		method: "GET",
		url: apiUrl,
		onload: function(response) {
			if (response) {
				response = JSON.parse(response.responseText);
				if (response.hasOwnProperty('Error')) {
					rottenTomatoesResults.html('Got error from OMDB: "' + response.Error + '"');
				} else {
					parseValidResponse(response);
				}
			}
		}
	});
} // end function getRTFromImdbId

function parseValidResponse(response) {
	var rottenResults = $('#rottenTomatoesResults');
	
	// add tomato-meter score and icon
	var tomatoMeterScoreImage = '';
	
	// set our defaults
	tomatoMeterScoreText = 'No Score Yet...';
	tomatoMeterScoreClass = ' noScore'
	
	// loop through available ratings sources to find RT
	for (i = 0; i < response.Ratings.length; i++) {
		if (response.Ratings[i].Source == 'Rotten Tomatoes') {
			if (response.Ratings[i].Value != 'N/A') {
				tomatoMeterScoreClass = '';
				tomatoMeterScoreText = response.Ratings[i].Value;

				tomatoMeterScoreImage = $('<div/>').
					attr('class', 'rtIcon ' + determineRatingIcon(tomatoMeterScoreText.slice(0, -1))).
					//attr('class', 'rtIcon ' + response.tomatoImage).
					attr('title', response.tomatoImage + ' - ' + tomatoMeterScoreText);
			}
			
			break;
		}
	}
	
	var tomatoMeterScore = $('<span/>').
		attr('id', 'rottenTomatoesTomatoMeterScore').
		text(tomatoMeterScoreText);

	var tomatoMeter = $('<a/>').
		attr('href', response.tomatoURL).
		attr('id', 'rottenTomatoesTomatoMeterScore').
		addClass('floater' + tomatoMeterScoreClass).
		html('<p class="rt-credits">Rotten Tomatoes® Score</p>') .
		append(tomatoMeterScoreImage) .
		append(tomatoMeterScoreText);

	rottenResults.html(tomatoMeter);

	if (showAudience) {
		var audienceRatingImageClass = 'spilled';
		var audienceRatingText = 'Spilled';
		var audienceRatingLabel = 'Liked It';
		var audienceRatingText = '';

		if (response.tomatoUserMeter == 'N/A') {
			audienceRatingImageClass = 'wts';
			audienceRatingText = 'No Audience Rating Yet';
			audienceRatingLabel = 'Want To See It';
		} else {
			audienceRatingText = response.tomatoUserMeter + '%';

			var userRating = parseInt(response.tomatoUserMeter);
			if (userRating >= 60) {
				audienceRatingImageClass = 'upright';
			};
		}
		
		audienceScoreImage = $('<div/>').
			attr('class', 'rtIcon ' + audienceRatingImageClass).
			attr('title', audienceRatingLabel);

			rottenResults.append(
			$('<a/>').
				attr('href', response.tomatoURL).
				attr('id', 'rottenTomatoesAudience').
				addClass('floater').
				html('<p class="rt-credits">Audience</p>') .
				append(audienceScoreImage).
				append(audienceRatingText)
		);
	}

	if (showAverageRating) {
		averageRating = response.tomatoRating + '/10';
		if (response.tomatoRating == 'N/A') {
			averageRating = response.tomatoRating;
		};
		rottenResults.append(
			$('<p/>').
				attr('id', 'rottenTomatoesAverage').
				addClass('rottenClear').
				html('<b>Critics Average</b> : ' + averageRating)
		);
	}
	
	if (showAudienceAverageRating) {
		averageAudienceRating = response.tomatoUserRating + '/5';
		if (response.tomatoUserRating == 'N/A') {
			averageAudienceRating = response.tomatoUserRating;
		};
		rottenResults.append(
			$('<div/>').
				attr('id', 'rottenTomatoesAudienceAverage').
				addClass('rottenClear').
				html('<b>Audience Average</b> : ' + averageAudienceRating)
		);
	}
	
	if (showReviewCount) {
		reviewText = '<b>Reviews</b> : ' + response.tomatoReviews;
		if (showFreshReviewCount || showRottenReviewCount) {
			reviewText = reviewText + ' (';
			if (showFreshReviewCount) {
				reviewText = reviewText + response.tomatoFresh + '&nbsp;Fresh';
			}
			
			if (showRottenReviewCount) {
				if (showFreshReviewCount) {
					reviewText = reviewText + ', ';
				}
				reviewText = reviewText + response.tomatoRotten + '&nbsp;Rotten';
			}
			reviewText = reviewText + ')';
		}

		rottenResults.append(
			$('<p/>').
				attr('id', 'rottenTomatoesReviewCount').
				html(reviewText)
		);
	}
	
	if (showConsensus) {
		rottenResults.append(
			$('<div/>').
				attr('id', 'rottenTomatoesConsensus').
				addClass('rottenClear').
				html('<b>Consensus</b> : ' + response.tomatoConsensus)
		);
	}
	
	rottenResults.append(
		$('<div/>').
			addClass("rottenClear").
			html("&nbsp;")
	);
}

function getIMDBid () {
	var regexImdbNum = /\/title\/tt(\d{7})\//;
	id = regexImdbNum.exec(document.location);
	return id[1];
}

function determineRatingIcon(rating) {
	// we can only go by rating not other qualifiers; not accurate for "certified"
	if (rating < 60) {
		return "rotten";
	}
	else if (rating < 70) {
		return "fresh";
	}
	else {
		return "certified";
	}
}
