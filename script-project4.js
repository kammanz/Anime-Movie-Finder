const movieWidget = {}

movieWidget.key = '666042b53729341d90681f2d042ecae2';

movieWidget.genre = {
    action: 28,
    adventure: 12,
    animation: 16,
    comedy: 35,
    crime: 80,
    drama: 18,
    family: 10751,
    fantasy: 14,
    horror: 27,
    mystery: 9648,
    romance: 10749,
    scienceFiction: 878,
    thriller: 53,
    war: 10752,
}

movieWidget.language = 'en-US';

movieWidget.original_language = 'ja',

movieWidget.genreChoice = null;

movieWidget.yearChoice = null;

movieWidget.ratingChoice = null;

movieWidget.upperYearChoice = function () {
    const yearChoice = movieWidget.yearChoice;
    if(!yearChoice){
        return null;
    }
    return Number(yearChoice) + 9;
}

movieWidget.upperRatingChoice = function () {
    const ratingChoice = movieWidget.ratingChoice;
    if (!ratingChoice) {
        return null;
    }
    return Number(ratingChoice) + 0.9;    
}

movieWidget.getMovies = function () {

    $.ajax({
        async: true,
        crossDomain: true,
        url: 'https://api.themoviedb.org/3/discover/movie?',
        method: "GET",
        headers: {},
        data: {
            api_key: movieWidget.key,
            language: movieWidget.language,
            with_genres: `${movieWidget.genre.animation},${movieWidget.genre[movieWidget.genreChoice]}`,
            with_original_language: movieWidget.original_language,  
            "vote_average.gte": movieWidget.ratingChoice,
            "vote_average.lte": movieWidget.upperRatingChoice(),
            "release_date.gte": movieWidget.yearChoice,
            "release_date.lte": movieWidget.upperYearChoice(),  
        }
    }).then((response) => {
        movieWidget.displayMovies(response.results);
    })
}

movieWidget.displayMovies = function(movieArray) {
    $('#movieDisplay').empty();
    for (var i = 0; i < movieArray.length; i++) {
        const url = `https://image.tmdb.org/t/p/w500${movieArray[i].poster_path}`;
        const title = $('<h2>').text(movieArray[i].title);
        const overview = $('<p>').text(movieArray[i].overview);
        const image = $('<img>').attr('src', url);
        const imageDiv = $('<div>').addClass('imgWrapper clearfix').append(image);
        const rating = $('<p>').text(movieArray[i].vote_average);
        const movieBox = $('<div>').addClass('movieItem clearfix').append(imageDiv, title, overview, rating);
        $('#movieDisplay').append(movieBox);
    }
}

movieWidget.events = function(){
    $('#genre').on('change', function () {
        movieWidget.genreChoice = $(this).val();
        movieWidget.getMovies();
    })
    $('#year').on('change', function () {
        movieWidget.yearChoice = $(this).val();
        movieWidget.getMovies();
    })

    $('#voteAverage').on('change', function() {
        movieWidget.ratingChoice = $(this).val();
        movieWidget.getMovies();
    })
};

movieWidget.init = function () {
    movieWidget.events();
    movieWidget.getMovies();
};

window.onload = function(){
    movieWidget.init();
}; 
