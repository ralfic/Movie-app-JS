const API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMWNhNzY2M2UzZTQwYmI2ZDYxZDk4YmI2MmEyZTkzOCIsIm5iZiI6MTcyNjY2ODQ3Mi41OTA0NTIsInN1YiI6IjY2ZWFkYzY0MWJlY2E4Y2UwN2QzN2NlMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0FOchObawB9keUdvECrx1M98iipUFfzR2eDoC01zBnM";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const genres = [
  {
    id: 28,
    name: "Action",
  },
  {
    id: 12,
    name: "Adventure",
  },
  {
    id: 16,
    name: "Animation",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 99,
    name: "Documentary",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 14,
    name: "Fantasy",
  },
  {
    id: 36,
    name: "History",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10402,
    name: "Music",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Science Fiction",
  },
  {
    id: 10770,
    name: "TV Movie",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 10752,
    name: "War",
  },
  {
    id: 37,
    name: "Western",
  },
];

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const moviesList = document.querySelector(".movies__wrapper");
const form = document.querySelector("form");
const shearche = document.querySelector(".menu__search");

// GetRequests

function getSomeRequests(filterUrl) {
  const request = [];
  const counPages = 5;

  if (filterUrl.includes(`/search/movie?query=`)) {
    for (let i = 0; i < counPages; i++) {
      request.push(BASE_URL + filterUrl + `&page=${i + 1}`);
    }
    return request;
  }

  if (filterUrl.match(/(&with_genres=)\d+/gi) !== null) {
    for (let i = 0; i < counPages; i++) {
      request.push(BASE_URL + "/discover/movie" + `?page=${i + 1}` + filterUrl);
    }
    return request;
  }

  for (let i = 0; i < counPages; i++) {
    request.push(BASE_URL + filterUrl + `?page=${i + 1}`);
  }

  return request;
}
// GetRequests

// ClearClassActive
function clearClassActive() {
  selectGener = [];
  filtersValue.forEach((e) => e.classList.remove("filter-bar__link--active"));
  document
    .querySelectorAll(".side-filter-bar__tag ")
    .forEach((e) => e.classList.remove("side-filter-bar__tag--active"));
}
// ClearClassActive

// Paginator

const paginatorMenu = document.querySelector("ul");

async function paginationMovies(data) {
  paginatorMenu.innerHTML = "";

  getMuvies(data[0]);

  for (let i = 0; i < data.length; i++) {
    const paginatorBtn = document.createElement("li");
    paginatorBtn.classList.remove("paginator-menu__link--active");
    if (i === 0) {
      paginatorBtn.classList.add("paginator-menu__link--active");
    }
    paginatorBtn.textContent = i + 1;
    paginatorBtn.addEventListener("click", () => {
      document
        .querySelectorAll(".paginator-menu__link")
        .forEach((el) => el.classList.remove("paginator-menu__link--active"));
      paginatorBtn.classList.add("paginator-menu__link--active");
      const urlPage = data[i];
      getMuvies(urlPage);
    });
    paginatorBtn.classList.add("paginator-menu__link");
    paginatorMenu.append(paginatorBtn);
  }
}

paginationMovies(getSomeRequests(`/discover/movie`));

async function getMuvies(url) {
  await fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      moviesList.innerHTML = "";
      showCardMovie(data.results);
    })
    .catch((err) => console.error(err));
}

// Paginator

// Search
form.addEventListener("input", (e) => {
  e.preventDefault();
  searchMovie();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  searchMovie();
});

document
  .querySelector(".menu__search-btn")
  .addEventListener("click", searchMovie);

function searchMovie() {
  clearClassActive();
  const searchTerm = shearche.value;

  paginationMovies(getSomeRequests(`/search/movie?query=` + searchTerm));

  if (!searchTerm) {
    filtersValue[1].classList.add("filter-bar__link--active");
    paginationMovies(getSomeRequests(`/discover/movie`));
  }
}
// Search

// ShowCardMovie
function moviRatingChacked(rating) {
  if (rating == 0) return;
  if (rating >= 7) {
    return "green";
  } else if (rating > 5) {
    return "orange";
  } else {
    return "red";
  }
}

function getMovieGaners(ganerArr) {
  let res = [];
  for (let i = 0; i < ganerArr.length; i++) {
    genres.forEach((elem) => {
      if (elem.id == ganerArr[i]) {
        res.push(elem.name);
      }
    });
  }
  return res.join(", ");
}

function showCardMovie(data) {
  data.forEach((movie) => {
    const movieCard = document.createElement("div");
    const { title, poster_path, vote_average, overview, genre_ids } = movie;

    movieCard.classList.add("card-movie");
    movieCard.innerHTML = `
          <div class="card-movie__img-inner">
            <img
              src=${poster_path ? IMG_URL + poster_path : "img/placeholder.jpg"}
              class="card-movie__img"
              alt="${title}"
            />
            <div class="hide-card-movi"><h2>Overview</h2>${
              overview.split(".")[0] + "."
            }</div>
          </div>
          <div class="card-movie__info">
            <div class="card-movie__title">${title}</div>
                    <div class="card-movie__ganers">${getMovieGaners(
                      genre_ids
                    )}</div>
            <div class="card-movie__average card-movie__average--${moviRatingChacked(
              vote_average.toFixed(1)
            )}">
              ${vote_average.toFixed(1) == 0 ? "" : vote_average.toFixed(1)}
            </div>
          </div>`;

    movieCard.setAttribute("id", movie.id);

    movieCard.addEventListener("click", () => openModal(movie.id));

    moviesList.append(movieCard);
  });
}
// ShowCardMovie

// Modal

const modalElem = document.createElement("div");
modalElem.classList.add("modal");

async function openModal(id) {
  scrolBtn.removeEventListener("click", scrollToTop);

  document.body.prepend(modalElem);

  document.body.classList.add("stop-scrolling");

  const movie = await fetch(BASE_URL + `/movie/${id}`, options)
    .then((response) => response.json())
    .catch((err) => console.error(err));

  const {
    title,
    poster_path,
    vote_average,
    overview,
    release_date,
    genres,
    homepage,
  } = movie;

  modalElem.innerHTML = `<div class="modal__card">
          <img src="${
            IMG_URL + poster_path
          }" alt="" class="modal__card-backdrop" />
          <ul class="modal__movie-info">
            <li class="modal__movie-title">
             <span>${title}</span>
             <span class="modal__movie-year" >${release_date}</span>
            </li>
            <li class="modal__movie-gener"><span>Ganer: </span>${genres.map(
              (ganer) => ganer?.name
            )}</li>
            <li class="modal__movie-site" ><span>Site: </span><a href=${homepage} target="_blank">${homepage}</a></li>
            <li class="modal__movie-overview"><span>Overview</span>${overview}</li>
             <div class="modal__movie-average modal__movie-average--${moviRatingChacked(
               vote_average.toFixed(2)
             )}">${vote_average.toFixed(2)}</div>
          </ul>
          <button type="button" class="modal__button-close" >✖</button>
        </div>`;

  document
    .querySelector(".modal__button-close")
    .addEventListener("click", closeModal);

  modalElem.classList.add("modal--show");
}

function closeModal() {
  modalElem.classList.remove("modal--show");
  document.body.classList.remove("stop-scrolling");
  scrolBtn.addEventListener("click", scrollToTop);
  modalElem.remove();
}

document.addEventListener("click", (e) => {
  if (e.target === modalElem) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// Modal

// Filter
const filer = document.querySelector(".filter-bar");
const filtersValue = document.querySelectorAll(".filter-bar__link");

filer.addEventListener("click", (e) => {
  shearche.value = "";
  clearClassActive();
  if (e.target.dataset["value"]) {
    filtersValue.forEach((elem) =>
      elem.classList.remove("filter-bar__link--active")
    );
    e.target.classList.add("filter-bar__link--active");
    switch (e.target.dataset["value"]) {
      case "NowPlaying":
        paginationMovies(getSomeRequests(`/movie/now_playing`));
        break;
      case "Popular":
        paginationMovies(getSomeRequests(`/movie/popular`));
        break;
      case "TopRated":
        paginationMovies(getSomeRequests(`/movie/top_rated`));
        break;
      case "Upcoming":
        paginationMovies(getSomeRequests(`/movie/upcoming`));
        break;
    }
  }
});
// Filter

// Scrol
const scrolBtn = document.createElement("div");
scrolBtn.classList.add("scroll-btn");

function scrollToTop() {
  window.scrollTo(0, 0);
}
scrolBtn.addEventListener("click", scrollToTop);

window.addEventListener("scroll", () => {
  if (window.pageYOffset >= window.innerHeight) {
    document.querySelector(".movies").prepend(scrolBtn);
  } else {
    scrolBtn.remove();
  }
});
// Scrol

// FilterGaners

const sideBarFilter = document.querySelector(".side-filter-bar__wrapper");

let selectGener = [];

sideBarFilter.addEventListener("click", (e) => {
  shearche.value = "";
  if (e.target.hasAttribute("id")) {
    e.target.classList.add("side-filter-bar__tag--active");
    if (selectGener.includes(e.target.id)) {
      selectGener.forEach((elem, i) => {
        if (elem == e.target.id) {
          selectGener.splice(i, 1);
          e.target.classList.remove("side-filter-bar__tag--active");
        }
      });
    } else {
      selectGener.push(e.target.id);
    }
  }
  if (selectGener.length === 0) {
    paginationMovies(getSomeRequests(`/discover/movie`));
    return;
  }
  paginationMovies(getSomeRequests(`&with_genres=${selectGener.join(",")}`));
});

function setGaner() {
  genres.forEach((elem) => {
    const ganerBtn = document.createElement("div");
    ganerBtn.id = elem.id;
    ganerBtn.textContent = elem.name;
    ganerBtn.classList.add("side-filter-bar__tag");

    sideBarFilter.append(ganerBtn);
  });
}

setGaner();

// FilterGaners
// ClearClassActive
function clearClassActive() {
  selectGener = [];
  filtersValue.forEach((e) => e.classList.remove("filter-bar__link--active"));
  document
    .querySelectorAll(".side-filter-bar__tag ")
    .forEach((e) => e.classList.remove("side-filter-bar__tag--active"));
}
// ClearClassActive
