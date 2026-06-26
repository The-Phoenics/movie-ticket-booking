import { env } from "@movie-ticket-booking/env/web";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function BuyTheatreMovieSeat() {
  const { movieId, theatreMovieId, theatreMovieSeatId } = useParams<{
    movieId: string;
    theatreMovieId: string;
    theatreMovieSeatId: string;
  }>();

  const buySeatFn = async () => {
    const fetchUrl = `${env.NEXT_PUBLIC_SERVER_URL}/movies/${movieId}/${theatreMovieId}/buy/${theatreMovieSeatId}`;
    const res = await fetch(fetchUrl, {
      method: "POST",
    });

    if (!res.ok) return;
    const data = await res.json();
    console.log("buy page data: ", data);
    return data;
  };

  const buySeatMutation = useMutation({
    mutationFn: buySeatFn,
    onSuccess: () => {},
  });

  const handleBuy = () => {
    buySeatMutation.mutate();
  };

  return (
    <div className="border flex flex-col justify-center w-full items-center px-4 pt-6 gap-6">
      Buy the seat
      <button
        type="button"
        onClick={handleBuy}
        className="rounded-lg flex justify-center items-center bg-red-600 w-5 min-w-20 hover:cursor-pointer px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
      >
        {"Buy"}
      </button>
    </div>
  );
}
