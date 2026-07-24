import { createMovie } from "./movie.seed";
import { createSeats } from "./seat.seed";
import { createShow } from "./show.seed";
import { createShowSeats } from "./showSeat.seed";
import { createTheatre } from "./theatre.seed";

type BookingFixtureOptions = {
  rows?: number;
  cols?: number;
  price?: number;
};

export async function createBookingFixture(options: BookingFixtureOptions = {}) {
  const { rows = 5, cols = 10, price = 250 } = options;

  const theatre = await createTheatre();
  const movie = await createMovie();

  const show = await createShow({
    theatreId: theatre.id,
    movieId: movie.id,
  });

  const seats = await createSeats(theatre.id, rows, cols);

  const showSeats = await createShowSeats({
    showId: show.id,
    theatreId: theatre.id,
    price,
  });

  return {
    theatre,
    movie,
    show,
    seats,
    showSeats,

    // convenience
    showSeat: showSeats[0],
  };
}
