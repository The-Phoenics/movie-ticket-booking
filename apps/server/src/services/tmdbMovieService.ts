import { ServerApiError } from "@/lib";
import { env } from "@movie-ticket-booking/env/server";
import type {
  TMDBMovieSearchFilter,
  TMDBMoviesType,
  TMDBMovieType,
} from "@movie-ticket-booking/shared/types";

export async function tmdbGetMovieById(id: string) {
  try {
    const url = `https://api.themoviedb.org/3/movie/${id}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${env.TMDB_READ_ACCESS_TOKEN}`,
      },
    };

    const res = await fetch(url, options);
    const movie = await res.json();
    return movie as TMDBMovieType;
  } catch (err) {
    throw new ServerApiError("Failed to fetch tmdb movie by id", 400, err);
  }
}

export async function tmdbSearchMovies(filter: TMDBMovieSearchFilter) {
  try {
    const url = `https://api.themoviedb.org/3/search/movie?query=${filter.searchString}&include_adult=${filter.adult}&language=en-US&page=${filter.page}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${env.TMDB_READ_ACCESS_TOKEN}`,
      },
    };
    const response = await fetch(url, options);
    const responseJson = (await response.json()) as { results: TMDBMoviesType[] };
    const movies = responseJson.results as TMDBMoviesType[];
    return movies;
  } catch (err) {
    throw new ServerApiError("Failed to search and fetch tmdb movie", 400, err);
  }
}
