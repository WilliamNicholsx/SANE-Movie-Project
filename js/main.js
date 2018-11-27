$(document).ready(() => {
    $("#searchForm").on("submit", (e) => {
        let search = $("#searchText").val();
        getMovies(search);
        e.preventDefault();
    });
});
function getTrending() {
    axios.get("https://api.themoviedb.org/3/trending/movie/day?api_key=bb3435e6fa75215145fc17204790ac6c")
        .then((response) => {
            console.log(response.data.results[0]);
            let movies = response.data.results;
            let result = "";
            $.each(movies, (i, movie) => {
                result += `
				<div class="DisplayFilm">
					<div class="well text-center">
                        <div class="DisplayTitle">
						<a onclick="movieSelected(${movies[i].id})">
                            <img src="https://image.tmdb.org/t/p/w500${movies[i].poster_path}" class="DisplayPoster" onerror="this.src='/SANE-Movie-Project/Images/PlaceholderPoster.png'"></a>
						<a onclick="movieSelected(${movies[i].id})" class="btn btn-primary" href="#"><h2>${movies[i].title}</h2></a>
                            <h3>${movie.release_date.substring(0, 4)}</h3>
                                <p>${movie.overview}</p>
					</div>
				</div>
            </div>

			`;
            });
            $("#movies").html(result);
        })
        .catch((err) => {
            console.log(err);
        });
}
function getMovies(search) {
    if ($('#movies').length) {
        $('#movie').hide();
    }
    if ($('#movie').length) {
        $('.BannerWrapper').hide();
    }
    if ($('#movies').length) {
        $('.FilmContent').hide();
    }
    if ($('#movies').length) {
        $('.Sidebar').hide();
    }

    
    axios.get("https://api.themoviedb.org/3/search/movie?api_key=bb3435e6fa75215145fc17204790ac6c&language=en-US&query=" + search + "&page=1&include_adult=false")
        .then((response) => {
            console.log(response.data.results[0]);
            let movies = response.data.results;
            let result = "";
            $.each(movies, (i, movie) => {
                result += `
				<div class="DisplayFilm">
					<div class="well text-center">
                        <div class="DisplayTitle">
						<a onclick="movieSelected(${movies[i].id})">
                            <img src="https://image.tmdb.org/t/p/w500${movies[i].poster_path}" class="DisplayPoster" onerror="this.src='/SANE-Movie-Project/Images'"></a>
						<a onclick="movieSelected(${movies[i].id})" class="btn btn-primary" href="#"><h2>${movies[i].title}</h2></a>
                            <h3>${movie.release_date.substring(0, 4)}</h3>
                                <p>${movie.overview}</p>
					</div>
				</div>
            </div>

			`;
            });
            $("#movies").html(result);
        })
        .catch((err) => {
            console.log(err);
        });
}

function movieSelected(id) {
    sessionStorage.setItem("movieId", id);
    window.location = "movie.html";
    return false;
}
function getBanner() {
    let movieId = sessionStorage.getItem("movieId");

    axios.all([
        axios.get("https://api.themoviedb.org/3/movie/" + movieId + "?api_key=bb3435e6fa75215145fc17204790ac6c"),
        axios.get("https://api.themoviedb.org/3/movie/" + movieId + "/credits?api_key=bb3435e6fa75215145fc17204790ac6c")
    ])
        .then(axios.spread((movieRes, crewRes) => {
            console.log(movieRes);
            console.log(crewRes);
            let movie = movieRes.data;

            let result = `
    <div class="BannerWrapper">
        <div class="BannerImage" style="background-position: center -18px; background-image: url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})">
        </div>
        <div class="Banner">
        </div>
    </div>
</div>
`;
            $(".BannerContainer").html(result);
        })
        )
}
function getMovie() {
    let movieId = sessionStorage.getItem("movieId");
    axios.all([
        axios.get("https://api.themoviedb.org/3/movie/" + movieId + "?api_key=bb3435e6fa75215145fc17204790ac6c"),
        axios.get("https://api.themoviedb.org/3/movie/" + movieId + "/credits?api_key=bb3435e6fa75215145fc17204790ac6c"),
        axios.get("https://api.themoviedb.org/3/movie/" + movieId + "/reviews?api_key=bb3435e6fa75215145fc17204790ac6c&language=en-US&page=1")
    ])
        .then(axios.spread((movieRes, crewRes, reviewRes) => {
            console.log(movieRes);
            console.log(crewRes);
            console.log(reviewRes);

            let movie = movieRes.data;
            let crew = crewRes.data;
            let reviews = reviewRes.data;
            console.log('MovieID: ' + movie.id);

            var directors = [];
            crew.crew.forEach(function (entry) {
                if (entry.job == 'Director') {
                    directors.push(entry.name);
                }
            })
            console.log('Director: ' + directors.join(', '));

            var writers = [];
            crew.crew.forEach(function (entry) {
                if (entry.department == 'Writing') {
                    writers.push(entry.name);
                }
            })
            console.log('Writers: ' + writers.join(', '));

            var prod_companies = [];
            movie.production_companies.forEach(function(entry){
                if (entry.name != '') {
                    prod_companies.push(entry.name);
                }
            })
            console.log('Production Companies: ' + prod_companies.slice(-2).join(', '));

            var genres = [];
            movie.genres.forEach(function (entry) {
                if (entry.name != '') {
                    genres.push(entry.name);
                }
            })
            console.log('Genres: ' + genres.join(', '));

            var revAuthor = [];
            reviews.results.forEach(function (entry) {
                if (entry.author !== undefined) {
                    revAuthor.push(entry.author);
                }
            })
            if (revAuthor[0] === undefined) {
                revAuthor.push('Person1')
            }
            if (revAuthor[1] === undefined) {
                revAuthor.push('Person2')
            }
            if (revAuthor[2] === undefined) {
                revAuthor.push('Person3')
            }
            if (revAuthor[3] === undefined) {
                revAuthor.push('Person4')
            }
            console.log('Review Author: ' + revAuthor[3]);
            

            var revContents = [];
            reviews.results.forEach(function (entry) {
                if (entry.content != '') {
                    revContents.push(entry.content);
                }
            })
            if (revContents[0] === undefined) {
                revContents.push('This is a placeholder for the contents, due to lack of reviews. Just showing the textboxes as is for now.')
            }
            if (revContents[1] === undefined) {
                revContents.push('This is a placeholder for the contents, due to lack of reviews. Just showing the textboxes as is for now.')
            }
            if (revContents[2] === undefined) {
                revContents.push('This is a placeholder for the contents, due to lack of reviews. Just showing the textboxes as is for now.')
            }
            if (revContents[3] === undefined) {
                revContents.push('This is a placeholder for the contents, due to lack of reviews. Just showing the textboxes as is for now.')
            }
            console.log('Review Content: ' + revContents[0].slice('/.'));
            
            var revFullUrl = [];
            reviews.results.forEach(function (entry) {
                if (entry.url != '') {
                    revFullUrl.push(entry.url);
                }
            })
            if (revFullUrl[0] === undefined) {
                revFullUrl.push('#')
            }
            if (revFullUrl[1] === undefined) {
                revFullUrl.push('#')
            }
            if (revFullUrl[2] === undefined) {
                revFullUrl.push('#')
            }
            if (revFullUrl[3] === undefined) {
                revFullUrl.push('#')
            }
            console.log('Review Url: ' + revFullUrl.join(', '));
            

            /*EDIT BACKDROP PATH
            <dd>${splitWriters}</dd>

*/
            let result = `
                    <aside class="SidebarMovie">
                        <div class="innerSidebar">
                            <div id="SidebarTitle">In Theaters Now...</div>
                        </div>
                    </aside>
    <div class="FilmContent">
    <div class="FilmBasics">
        <div class="FilmTitle">
            <h2>${movie.original_title}</h2>
            <h3>(${movie.release_date.substring(0,4)})</h3>
    </div>
<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="MoviePoster" onerror="this.src='../images/PlaceholderPoster.png'">
<div class="MovieInfoTable">
    <dl>
        <dt><strong>Average Rating:</strong></dt>
            <dd>${movie.vote_average} / 10</dd>
        <dt><strong>Genre:</strong> </dt>
            <dd>${genres.join(', ')}</dd>
        <dt><strong>Director:</strong> </dt>
            <dd>${directors.join(', ')}</dd>
        <dt><strong>Writers:</strong> </dt>
            <dd>${writers.slice(-2).join(', ')}</dd>
        <dt><strong>Released:</strong> </dt>
            <dd>${movie.release_date}</dd>
        <dt><strong>Runtime:</strong> </dt>
            <dd>${movie.runtime}min</dd>
        <dt><strong>Studio:</strong></dt>
            <dd>${prod_companies.slice(-2).join(', ')}</dd>
    </dl>
</div>
</div>
<div class="MovieOverview">
    <h3>Movie Info</h3>
        <p>${movie.overview}</p>
</div>
<div class="CriticReviews">
    <h3>Critic Reviews</h3>
    
    <div class="reviewBubble">
        <p>${revContents[0].slice(0, 120)}</p>
        <a href="${revFullUrl[0]}">Read Full User Review!</a>
    <div class="reviewBubbleArrow"></div>
    </div>
<div class="authorAvatar"><p>-${revAuthor[0]}</p></div>
    

    <div class="reviewBubble">
        <p>${revContents[1].slice(0, 120)}</p>
        <a href="${revFullUrl[1]}">Read Full User Review!</a>
    <div class="reviewBubbleArrow"></div>
    </div>
<div class="authorAvatar"><p>-${revAuthor[1]}</p></div>
    

    <div class="reviewBubble">
        <p>${revContents[2].slice(0, 120)}</p>
        <a href="${revFullUrl[2]}">Read Full User Review!</a>
    <div class="reviewBubbleArrow"></div>
    </div>
<div class="authorAvatar"><p>-${revAuthor[2]}</p></div>
    

    <div class="reviewBubble">
        <p>${revContents[3].slice(0, 120)}</p>
        <a href="${revFullUrl[3]}">Read Full User Review!</a>
    <div class="reviewBubbleArrow"></div>
    </div>
    
    <div class="authorAvatar"><p>-${revAuthor[3]}</p></div>


</div>
            <hr>
            <a href="http://imdb.com/title/${movie.imdb_id}" target="_blank" class="btn btn-primary">View IMDB</a>
</div>

    
`;
            $("#movie").html(result);
        })
        )
}
