const api_key = "9f0df02ae12b7ac9a4864741b82c762d";
const w300Size = "w300";
const originalSize = "original";
const baseImageUrl = "http://image.tmdb.org/t/p/";
let movies = [];
let selectedMovie = {};
let btnWatchNow;
let btnInfo;

window.addEventListener("load", async () => {
  movies = await getMovies();
  renderMovies(movies);

  btnWatchNow = document.getElementById('btnWatchNow');
  btnInfo = document.getElementById('btnInfo');

  btnWatchNow.addEventListener('click', () => onWatchNowClick());
  btnInfo.addEventListener('click', () => onInfoClick());
});

const getMovies = async () => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=1`
  );
  const moviesRes = await response.json();
  return moviesRes.results;
};

const getImgUrl = (baseImageUrl, size, imgPath) => {
  return `${baseImageUrl}${size}/${imgPath}`;
};

const getMovieDiv = (movie) => {
  const movieImg = getImgUrl(baseImageUrl, w300Size, movie.poster_path);
  return {
    element: `<div id="${movie.id}" class="item link">
    <img src="${movieImg}">
  </div>`,
    id: movie.id,
  };
};

const renderMovies = (movies) => {
  movies
    .map(({ id, poster_path }) => {
      return getMovieDiv({ id, poster_path });
    })
    .forEach((movie) => {
      $("#owl-demo")
        .trigger("add.owl.carousel", movie.element)
        .trigger("refresh.owl.carousel");
      //   moviesGroup.innerHTML = movieDivs;
    });

  $(".link").on("click", function (event) {
    var $this = $(this);
    getMovieInfo($this[0].id);
  });
  
  getMovieInfo(movies[0].id);
};

const getMovieInfo = async (movieId) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&language=en-US`
  );
  const movie = await response.json();
  selectedMovie = movie;
  const movieImgUrl = getImgUrl(
    baseImageUrl,
    originalSize,
    movie.backdrop_path
  );
  var all = document.getElementsByClassName("main-movie");
  for (var i = 0; i < all.length; i++) {
    all[i].style.background = `linear-gradient(rgba(0, 0, 0, .50), rgba(0, 0, 0, .50)100%), url(${movieImgUrl})`;
    all[i].style.backgroundRepeat = "no-repeat";
    all[i].style.backgroundSize = "100% 200%";
  }

  const movieContainer = document.getElementById("movieDescription");
  console.log(movieContainer);
  movieContainer.innerHTML = getMovieDescription(movie);
};

const getMovieDescription = ({ original_title,  overview}) => {
  return ` <h3 class="title">${original_title}</h3>
    <p class="description">
        ${overview}
    </p>`;
};


const onWatchNowClick = () => {
    console.log(selectedMovie);
}

const onInfoClick = () => {
    window.open(selectedMovie.homepage);
}