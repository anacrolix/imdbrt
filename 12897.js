// ==UserScript==
// @name			IMDB - add Rottentomatoes info
// @namespace		http://userscripts.org/scripts/show/12897
// @description		Adds info from Rottentomatoes to IMDB title pages
// @version			2.5.1
// @include			http://*.imdb.com/title/*/
// @include			http://*.imdb.com/title/*/maindetails
// @include			http://*.imdb.com/title/*/combined
// @include			http://imdb.com/title/*/
// @include			http://imdb.com/title/*/maindetails
// @include			http://imdb.com/title/*/combined
// @require			http://sizzlemctwizzle.com/updater.php?id=12897
// ==/UserScript==

// ==User-Defined Variables==

//showAverageRating = false;
showAverageRating = true;

//showReviewCount = false;
showReviewCount = true;

//showFreshReviewCount = false;
showFreshReviewCount = true;

//showRottenReviewCount = false;
showRottenReviewCount = true;

//showConsensus = false;
showConsensus = true;

useRottenTomatoesColors = false;
//useRottenTomatoesColors = true;

// ==/User-Defined Variables==

if (document.getElementById('tn15') != null) {
	oldImdbLayout = true;
}
else {
	oldImdbLayout = false;
}

if (oldImdbLayout == true) {
	labelHtml = '<h5>Rotten Tomatoes:</h5>';
	insertedDivClass = 'info';
	resultsPrefix = '<div class="info-content">';
	resultsSuffix = '</div>';
}
else {
	labelHtml = 'Rotten Tomatoes:';
	insertedDivClass = '';
	resultsPrefix = '';
	resultsSuffix = '';
}
	


insertRTBase();
rottenTomatoesURL = "http://www.rottentomatoes.com/alias?type=imdbid&s=" + getIMDBid();
getRTinfo(rottenTomatoesURL,0);

function insertRTBase() {
	
	if (oldImdbLayout == true) {
		findPattern = "//div[@class='info']";
	}
	else {
		findPattern = "//div[@class='star-box']/span[@class='nobr']";
	}
	
	results = document.evaluate( findPattern, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
	addedDivRotten = document.createElement('div');
	addedDivRotten.setAttribute('id','greaseTextRotten');
	addedDivRotten.setAttribute('class',insertedDivClass);

	var RTStyle = "";
	if (useRottenTomatoesColors == true) {
		RTStyle = " style=\"-moz-border-radius: 4px !important; border: 2px solid #5E7D0E !important\"";
	}

	addedDivRotten.innerHTML = '<div id="greaseTextRottenResults"'+RTStyle+'>'+labelHtml+resultsPrefix+' checking <img src="'+'data:image/gif;base64,'+
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
    'YY9HCDEZTlxA8cOVwUGBAAA7AAAAAAAAAAAA'+'" alt ="checking">'+resultsSuffix+'</div>';

	addedDivRotten.style.marginTop='10px';
	results.snapshotItem(0).parentNode.insertBefore(addedDivRotten, results.snapshotItem(0).nextSibling);

	if(useRottenTomatoesColors == true) {
		var addedDivRottenResults = document.getElementById('greaseTextRottenResults');
		addedDivRottenResults.style.color='#5E7D0E';
		addedDivRottenResults.style.backgroundColor='#d6e5a5';
		addedDivRottenResults.style.padding='3px';
	} // end if useRottenTomatoesColors


} // end function insertRTBase

function getIMDBid () {
	var regexImdbNum = /\/title\/tt(\d{7})\//;
	id = regexImdbNum.exec(document.location);
	return id[1];
}


function getMovieName () {
	const $xpath = '//h1/text()';
	var $nodes = document.evaluate($xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
	return escape($nodes.singleNodeValue.data.replace(/[^\w \xC0-\xFF]/g, ''));
}

function getRTinfo(rottenTomatoesURL, alreadyTryingGoogle) {
	GM_xmlhttpRequest({
		url: rottenTomatoesURL,
		method: 'GET',
		onload: function(response) {
			fresh_icon_uri = 'data:image/gif;base64,R0lGODlhEAAQALMAAFViHKY0F9c7FJdiHPtGF/51VDuIJlahLYmJJ/6Ia////wAAAP///wAAAAAAAAAAACH5BAEAAAwALAAAAAAQABAAAARdkMlJq2WpFHJnyhvBXZpIHKIgVIkpHoOAjNKXHviAoKsUCoQBAGcAqHoulRAACBwlQNNgcDAEDNaAJCVyHprfgJYBVBFUgaZAPHGWj+40xXk+rtkVsX7f2es7gBQRADs=';
			rotten_icon_uri = 'data:image/gif;base64,R0lGODlhEAAQANUAAECdJ////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///yH5BAEAAD8ALAAAAAAQABAAAAY2wJ/wBygOj0hiEZBMLpnN43O4pBqrSqwW+uQas1PptRvtQstm59e83jLJ2Kz1K6bT6+eoPBkEADs=';
			comment_bubble_uri = 'data:image/png;base64,'+
				'iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAABGdBTUEAALGPC/xhBQAAAAFzUkdC'+
				'AK7OHOkAAAAHdElNRQfZBwsVChqBpMw9AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAAL'+
				'EwEAmpwYAAABa0lEQVQoz2NgQAKxreuYY1vXBsS1rlsJxA+B+D8Qfwbik0DcDMRSDNgAUEI6qmnN'+
				'0f6Vx/6fuPbk/5sPX/+DwPefv//fffru/4bD1//nTtz2C6iuCF2jHBC/vXT3xX984OuPX/+X7Lr4'+
				'P6R2ZSdQPSPQqWtZg2pWrD9z4+l/YkHPiqO/w+pXaTEEVC2TnbX57Of/JIB7z979z5+0bSJDeMMq'+
				'g4MX7pOi9/83oPNLpu28yAAMJLNDFx+QpPkrRPM5oLOXy0xbf+oDKZrvPH37P2/itn5w3IbUrliw'+
				'9fgtojW3Lzn0LrRupQIsqtiA+N7pG0/+//v3D6em95+//5+75SwoqsrR41oI6P8drYsO/dtz5u7/'+
				'O0/e/v/5+w9Y020ge8bG0/9TuzZ+BKpLZsAFgJL2QDwN6J0TQPrbRWDCAQbOMSA/FsjnZiAWABUb'+
				'18ze+7946o6JDOQAoAHxQPwdiJnJNGCtJVCzF7o4AIvXFqgzJp23AAAAAElFTkSuQmCC';

			doc = document.createElement('div');
			doc.innerHTML = response.responseText;
			var fresh_reviews_html;
			var rotten_reviews_html;

			// get canonical RT url
			var findPattern = "//link[@rel='canonical']";
			var results = document.evaluate(findPattern, doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );

			if (results.snapshotItem(0) != null)
			{
				URL_split = results.snapshotItem(0).href.split(".com")
				rottenTomatoesURL = "http://www.rottentomatoes.com"+URL_split[1];
			} // end if

            results = $("p.critic_stats", doc);

			average_html = "";
			reviews_html = "";
			reviews_count_html = "";
			fresh_reviews_html = "";
			rotten_reviews_html = "";

			if (results[0] != null)
            {
				line_split = results[0].innerHTML.split("<br>");

				// get average
				if (showAverageRating == true) {

					average_count = line_split[0].split("<span>");
					average_count = parseFloat(average_count[1]);
					average_html = " <span id='gm_rotten_average_html' style='font-size:smaller;'>(Average "+average_count+")</span>";

				}

				// get total reviews
				if (showReviewCount == true) {

					review_count = line_split[1].split(": ");
					review_count = parseInt(review_count[1]);
					reviews_count_html = " <span title='"+review_count+" Total Reviews'><img style='width:12px;' src='"+comment_bubble_uri+"' alt='Reviews'> <a href='"+rottenTomatoesURL+"?critic=columns&sortby=name&name_order=asc&view=#contentReviews'>"+review_count+"</a></span>";

				}

				// get fresh reviews
				if (showFreshReviewCount == true) {

					fresh_count = line_split[2].split(": ");
					fresh_count = parseInt(fresh_count[1]);
					fresh_reviews_html = " <span title='"+fresh_count+" Fresh Reviews'><img style='width:12px;' src='"+fresh_icon_uri+"' alt='Fresh'> <a href='"+rottenTomatoesURL+"?critic=columns&sortby=fresh&name_order=asc&view=#contentReviews'>"+fresh_count+"</a></span>";

				}

				// get rotten reviews
				if (showRottenReviewCount == true) {

					rotten_count = line_split[2].split(": ");
					rotten_count = parseInt(rotten_count[2]);
					rotten_reviews_html = " <span title='"+rotten_count+" Rotten Reviews'><img style='width:12px;' src='"+rotten_icon_uri+"' alt='Rotten'> <a href='"+rottenTomatoesURL+"?critic=columns&sortby=rotten&name_order=asc&view=#contentReviews'>"+rotten_count+"</a></span>";

				}

			}

			if(showReviewCount == true || showFreshReviewCount == true || showRottenReviewCount == true) {
				reviews_html = "<span class=\"ghost\"> | </span>" + reviews_count_html+fresh_reviews_html+rotten_reviews_html;
			}

			// get consensus
			if(showConsensus == true)
            {
                results = $("p.critic_consensus", doc);
				if (results[0] != null) {
					consensus_html = "<span class=\"ghost\"> | </span>Consensus: "+results[0].innerHTML;
				}
			}

			// get tomato-meter rating
            results = $("span#all-critics-meter", doc);
			if (results[0] != null)
			{
				var score_html = results[0].innerHTML;
				if (score_html == "N/A") {
					score_html = "n/a";
					rotten_rating_image_uri = '';
					rotten_rating_text = '';
				}
				else {
					if (parseInt(score_html) >= 60) { // it's fresh
						rotten_rating_image_uri = fresh_icon_uri;
						rotten_rating_text = "Fresh";
					}
					else { // it's rotten
						rotten_rating_image_uri = rotten_icon_uri;
						rotten_rating_text = "Rotten";
					}
					score_html = score_html + "%";
				}

				// found a rotten_rating
				if ( score_html == -1)
				{
					addedDivRotten.innerHTML = '<a title="Rotten Tomatoes link" href="' + rottenTomatoesURL + '">'+labelHtml+'</a> Not enough reviews for a rating';
					addedDivRotten.style.color='black';
				}
				else { // best default case
					var rotten_rating_image_url, rotten_rating_text;
					var addedDivRotten = document.getElementById('greaseTextRottenResults');
					addedDivRotten.innerHTML = '<a title="Rotten Tomatoes link" href="' + rottenTomatoesURL + '">'+labelHtml+'</a> ' + resultsPrefix + score_html + ' \n<img src="' + rotten_rating_image_uri + '" alt="' + rotten_rating_text + '" title="' + rotten_rating_text + '">\n'+average_html+reviews_html+consensus_html + resultsSuffix;

				} // end else
			} // end if tomatometer_score not null
			else {
				// did not find rotten_rating
				var addedDivRotten = document.getElementById('greaseTextRottenResults');

				if(alreadyTryingGoogle == 0) {
					GoogleAJAXURL = "http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q=site%3Arottentomatoes.com%3A%20" + getMovieName();

					GM_xmlhttpRequest({
						method: 'GET',
						url: GoogleAJAXURL,
						onload: function(responseDetails) {
							var json = eval("(" +responseDetails.responseText+")");
							getRTinfo(json.responseData.results[0].url, 1);
						}
					});


				} // end if alreadyTryingGoogle == 0
				else {
					googleRottenTomatoesFallbackURL = "http://www.google.com/search?q=" + "intitle%3A%22" + getMovieName() + "%22+" + "site%3Arottentomatoes.com";
					addedDivRotten.innerHTML = '<a title="Google search Rotten Tomatoes link" href="' + googleRottenTomatoesFallbackURL + '">'+labelHtml+'</a>\nUnable to find';
					addedDivRotten.style.color='red';
				} // end else (alreadyTryingGoogle != 0)
			}
		}
	});

} // end function getRTinfo
