const container = document.getElementById('audience');
const selectMovie = document.getElementById('movie');
const seats = document.querySelectorAll('.row .seat');
const numberOfBookedSeats = document.getElementById('count');
const totalPrice = document.getElementById('total');
const purchaseBtn = document.getElementById('buyBtn');

const movieList = {
    "Top Gun: Maverick": 14,
    "Batman": 12,
    "Avatar": 8,
    "Thor: Love and Thunder": 15,
    "Jurassic World: Dominion": 9,
    "Joker": 10,
    "The Wolf of Wall Street": 20,
    "Buzz Astral": 10,
    "Eternals": 12
};

renderMovieOptions(movieList);
let priceOfTicket = getPriceOfSelectedMovie();
updateUI();


function renderMovieOptions(movies) {
    for (const [movie, price] of Object.entries(movieList)) {
        let movieOption = `<option data-price="${price}" value="${movie}">${movie} ($${price})</option>`;
        selectMovie.innerHTML += movieOption;
    }
};

function getPriceOfSelectedMovie() {
    let titleOfMovie = selectMovie.value;
    let movieElement = document.querySelector(`[value="${titleOfMovie}"]`);     // select option element by uniqe value for every option which is title of movie
    let priceOfMovie = +movieElement.dataset.price;     // get data-price value
    return priceOfMovie;
};

function setSelectedMovieDataInLocalStorage(movieIndex, moviePrice) {
    localStorage.setItem('selectedMovieIndex', movieIndex);
    localStorage.setItem('selectedMoviePrice', moviePrice);
};


function updateSelectedCount() {
    const selectedSeats = document.querySelectorAll('.row .seat.selected');
    const selectedSeatsIndexes = [...selectedSeats].map(seat => [...seats].indexOf(seat));
    localStorage.setItem('selectedSeats', JSON.stringify(selectedSeatsIndexes));
    const selectedSeatsCount = selectedSeats.length;

    updateInfoAboutCountAndPrice(selectedSeatsCount);
};

function updateInfoAboutCountAndPrice(selectedSeatsCount) {
    numberOfBookedSeats.innerText = selectedSeatsCount;
    totalPrice.innerText = selectedSeatsCount * priceOfTicket;
};

function setClassToSeat(indexesOfSeats, className) {
    if (indexesOfSeats !== null && indexesOfSeats.length > 0) {
        seats.forEach((seat, index) => {
            if (indexesOfSeats.indexOf(index) > -1) {
                seat.classList = `seat  ${className}`;
            }
        });
    }
};

function updateUI() {
    const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));
    setClassToSeat(selectedSeats, 'selected');

    const occupiedSeats = JSON.parse(localStorage.getItem('occupiedSeats'));
    setClassToSeat(occupiedSeats, 'occupied');

    const selectedMovieIndex = localStorage.getItem('selectedMovieIndex');
    if (selectedMovieIndex !== null) {
        selectMovie.selectedIndex = selectedMovieIndex;
    }
    priceOfTicket = getPriceOfSelectedMovie();

    if (selectedSeats !== null) {
        updateInfoAboutCountAndPrice(selectedSeats.length);
    }
};

function sellSeats() {
    // Get checked seats
    const selectedSeats = [...document.querySelectorAll('.row .selected')];
    selectedSeatsIndexes = [...selectedSeats].map(seat => [...seats].indexOf(seat));
    console.log(selectedSeatsIndexes);
    if (selectedSeatsIndexes !== null && selectedSeatsIndexes.length > -1) {
        seats.forEach((seat, index) => {
            if (selectedSeatsIndexes.indexOf(index) > -1) {
                seat.classList.remove('selected');
                seat.classList.add('occupied');
            }
        })
    }

    updateSelectedCount();

    const occupiedSeats = [...document.querySelectorAll('.row .occupied')];
    const occupiedSeatsIndexes = [...occupiedSeats].map(seat => [...seats].indexOf(seat));

    localStorage.setItem('occupiedSeats', JSON.stringify(occupiedSeatsIndexes));
};


// Event Listeners
container.addEventListener('click', e => {
    if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
        e.target.classList.toggle('selected');
    }
    updateSelectedCount();
});

selectMovie.addEventListener('change', e => {
    priceOfTicket = getPriceOfSelectedMovie();
    updateSelectedCount();
    setSelectedMovieDataInLocalStorage(e.target.selectedIndex, getPriceOfSelectedMovie());
});

purchaseBtn.addEventListener('click', e => {
    sellSeats();
})
