// "use client";

export default function Home() {
  return (
    <div>page</div>
  )
}

// import React, { useState, useEffect, useRef } from "react";
// import { toast } from "sonner";
// import {
//   Calendar,
//   MapPin,
//   Clock,
//   CreditCard,
//   CheckCircle2,
//   Printer,
//   Ticket,
//   RefreshCw,
//   Search,
//   ChevronRight,
//   Info,
//   Lock,
//   Smartphone,
//   Building,
//   CalendarCheck
// } from "lucide-react";

// interface Movie {
//   id: string;
//   title: string;
//   rating: string;
//   genres: string[];
//   formats: string[];
//   duration: string;
//   tagline: string;
//   languages: string;
//   releaseDate: string;
//   description: string;
//   cast: { name: string; role: string }[];
//   posterClass: string;
//   posterImage: string;
//   heroMeta: string;
// }

// const MOVIES: Movie[] = [
//   {
//     id: "quiet-hour",
//     title: "The Quiet Hour",
//     rating: "8.7",
//     genres: ["Thriller", "Mystery"],
//     formats: ["2D", "IMAX"],
//     duration: "2h 18m",
//     tagline: '"Some silences are louder than the truth."',
//     languages: "Hindi, English",
//     releaseDate: "20 Jun 2026",
//     description: "A forensic auditor uncovers a decades-old discrepancy in her late father's casework — one that points back to the very department she was raised to trust. As old colleagues close ranks, she has one quiet hour each night to find what they buried.",
//     cast: [
//       { name: "Vidya Rao", role: "Aanya" },
//       { name: "Kabir Sen", role: "Inspector Mehta" },
//       { name: "Farah Ali", role: "Director" }
//     ],
//     posterClass: "p1",
//     posterImage: "/images/quiet-hour.png",
//     heroMeta: "9:40 PM · IMAX · Hall fills in 12 min"
//   },
//   {
//     id: "saltwater-cities",
//     title: "Saltwater Cities",
//     rating: "7.9",
//     genres: ["Drama"],
//     formats: ["2D"],
//     duration: "2h 04m",
//     tagline: '"The tide washed away their names, but not their history."',
//     languages: "English",
//     releaseDate: "18 Jun 2026",
//     description: "In the sprawling, semi-submerged metropolis of a near-future coast, three estranged siblings reunite to claim their ancestral home before the final sea-wall reclamation project wipes it off the map.",
//     cast: [
//       { name: "Aditya Roy", role: "Dhruv" },
//       { name: "Kiara Advani", role: "Meera" },
//       { name: "Arjun Dev", role: "Director" }
//     ],
//     posterClass: "p2",
//     posterImage: "/images/saltwater-cities.png",
//     heroMeta: "8:15 PM · 2D · High demand"
//   },
//   {
//     id: "marigold-smoke",
//     title: "Marigold & Smoke",
//     rating: "8.2",
//     genres: ["Romance", "Drama"],
//     formats: ["4DX", "2D"],
//     duration: "2h 31m",
//     tagline: '"Love in the time of quiet revolutions."',
//     languages: "Hindi",
//     releaseDate: "15 Jun 2026",
//     description: "Set against the backdrop of a changing 1970s Delhi, an aspiring painter and a foreign service diplomat find their secret correspondence turning into a lifeline as political waves threaten to pull them in opposite directions.",
//     cast: [
//       { name: "Ranbir Kapoor", role: "Dev" },
//       { name: "Alia Bhatt", role: "Ira" },
//       { name: "Karan Johar", role: "Director" }
//     ],
//     posterClass: "p3",
//     posterImage: "/images/marigold-smoke.png",
//     heroMeta: "6:00 PM · 4DX · Selling out fast"
//   },
//   {
//     id: "last-train",
//     title: "Last Train to Kanpur",
//     rating: "9.1",
//     genres: ["Action", "Thriller"],
//     formats: ["2D", "IMAX"],
//     duration: "2h 09m",
//     tagline: '"The ticket is bought. The journey is final."',
//     languages: "Hindi, Punjabi",
//     releaseDate: "22 Jun 2026",
//     description: "A decommissioned security officer boards an overnight mail train, only to discover a federal asset is being transported in the luggage car — and a rogue mercenary team has just boarded at the previous siding.",
//     cast: [
//       { name: "Vicky Kaushal", role: "Major Samar" },
//       { name: "Sanya Malhotra", role: "Dr. Preeti" },
//       { name: "Siddharth Anand", role: "Director" }
//     ],
//     posterClass: "p4",
//     posterImage: "/images/last-train.png",
//     heroMeta: "10:05 PM · IMAX · Heavy action"
//   }
// ];

// const CINEMAS = [
//   {
//     name: "PVR Select City Walk",
//     location: "Saket, New Delhi · 4.2 km away",
//     showtimes: [
//       { time: "11:15 AM", fewLeft: false },
//       { time: "2:30 PM", fewLeft: false },
//       { time: "6:00 PM", fewLeft: true },
//       { time: "9:40 PM", fewLeft: false }
//     ]
//   },
//   {
//     name: "INOX Nehru Place",
//     location: "Nehru Place, New Delhi · 6.8 km away",
//     showtimes: [
//       { time: "12:00 PM", fewLeft: false },
//       { time: "4:45 PM", fewLeft: true },
//       { time: "8:15 PM", fewLeft: false }
//     ]
//   },
//   {
//     name: "Cinepolis DLF Promenade",
//     location: "Vasant Kunj, New Delhi · 9.1 km away",
//     showtimes: [
//       { time: "1:10 PM", fewLeft: false },
//       { time: "5:30 PM", fewLeft: false },
//       { time: "10:05 PM", fewLeft: false }
//     ]
//   }
// ];

// const DATES = [
//   { dow: "Thu", dnum: "25", label: "Today, 25 Jun" },
//   { dow: "Fri", dnum: "26", label: "Fri, 26 Jun" },
//   { dow: "Sat", dnum: "27", label: "Sat, 27 Jun" },
//   { dow: "Sun", dnum: "28", label: "Sun, 28 Jun" },
//   { dow: "Mon", dnum: "29", label: "Mon, 29 Jun" },
//   { dow: "Tue", dnum: "30", label: "Tue, 30 Jun" },
//   { dow: "Wed", dnum: "01", label: "Wed, 01 Jul" }
// ];

// const TAKEN_SEATS = ["A5", "C5", "C6", "D8", "D9", "F8", "F9"];

// export default function Home() {
//   const [activeMovieId, setActiveMovieId] = useState<string>("quiet-hour");
//   const [selectedDate, setSelectedDate] = useState<string>("25");
//   const [selectedTime, setSelectedTime] = useState<string>("6:00 PM");
//   const [selectedCinema, setSelectedCinema] = useState<string>("PVR Select City Walk");
//   const [selectedSeats, setSelectedSeats] = useState<string[]>(["A6", "A7"]);
//   const [paymentMethod, setPaymentMethod] = useState<string>("card");

//   // Form inputs
//   const [cardNumber, setCardNumber] = useState<string>("");
//   const [expiry, setExpiry] = useState<string>("");
//   const [cvv, setCvv] = useState<string>("");
//   const [cardName, setCardName] = useState<string>("");

//   // Search input
//   const [searchQuery, setSearchQuery] = useState<string>("");

//   // Booking Success Modal
//   const [isSuccess, setIsSuccess] = useState<boolean>(false);
//   const [bookingId, setBookingId] = useState<string>("");

//   const activeMovie = MOVIES.find((m) => m.id === activeMovieId) || MOVIES[0];

//   // Helper to scroll to section
//   const scrollToSection = (id: string) => {
//     const el = document.getElementById(id);
//     if (el) {
//       el.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   // Select movie and scroll
//   const handleSelectMovie = (id: string) => {
//     setActiveMovieId(id);
//     toast.success(`Selected "${MOVIES.find((m) => m.id === id)?.title}"`);
//     setTimeout(() => scrollToSection("movie"), 100);
//   };

//   // Select showtime and scroll
//   const handleSelectShowtime = (cinemaName: string, time: string) => {
//     setSelectedCinema(cinemaName);
//     setSelectedTime(time);
//     toast.success(`Showtime set to ${time} at ${cinemaName}`);
//     setTimeout(() => scrollToSection("seats"), 100);
//   };

//   // Toggle seat selection
//   const handleToggleSeat = (seatId: string) => {
//     if (TAKEN_SEATS.includes(seatId)) return;

//     if (selectedSeats.includes(seatId)) {
//       setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
//     } else {
//       setSelectedSeats([...selectedSeats, seatId]);
//     }
//   };

//   // Price calculations
//   const premiumCount = selectedSeats.filter((s) => s.startsWith("A") || s.startsWith("B")).length;
//   const regularCount = selectedSeats.length - premiumCount;

//   const ticketTotal = premiumCount * 360 + regularCount * 250;
//   const convenienceFee = selectedSeats.length > 0 ? 49 : 0;
//   const gst = selectedSeats.length > 0 ? Math.round((ticketTotal + convenienceFee) * 0.18 * 100) / 100 : 0;
//   const totalPayable = selectedSeats.length > 0 ? Math.round(ticketTotal + convenienceFee + gst) : 0;

//   // Handle Checkout / Payment
//   const handlePay = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (selectedSeats.length === 0) {
//       toast.error("Please select at least one seat first.");
//       return;
//     }

//     if (paymentMethod === "card") {
//       if (!cardNumber || !expiry || !cvv || !cardName) {
//         toast.error("Please fill in all card details.");
//         return;
//       }
//     }

//     // Generate random booking ID
//     const randomId = "REEL-" + Math.floor(100000 + Math.random() * 900000);
//     setBookingId(randomId);
//     setIsSuccess(true);
//     toast.success("Booking confirmed! Enjoy your movie.");
//   };

//   // Reset Booking flow
//   const handleReset = () => {
//     setIsSuccess(false);
//     setSelectedSeats([]);
//     setCardNumber("");
//     setExpiry("");
//     setCvv("");
//     setCardName("");
//     scrollToSection("home");
//   };

//   const activeDateLabel = DATES.find((d) => d.dnum === selectedDate)?.label || "Today, 25 Jun";

//   return (
//     <>
//       <header>
//         <nav>
//           <div className="logo" style={{ cursor: "pointer" }} onClick={() => scrollToSection("home")}>
//             Reel<span className="dot">.</span>
//           </div>
//           <div className="navlinks">
//             <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection("home"); }} className="active">
//               Now Showing
//             </a>
//             <a href="#coming-soon" onClick={(e) => { e.preventDefault(); toast.info("Coming soon titles are being updated for July 2026."); }}>
//               Coming Soon
//             </a>
//             <a href="#movie" onClick={(e) => { e.preventDefault(); scrollToSection("movie"); }}>
//               Cinemas
//             </a>
//             <a href="#events" onClick={(e) => { e.preventDefault(); toast.info("Check back next week for premium film festivals and events."); }}>
//               Events
//             </a>
//           </div>
//           <div className="navcta">
//             <div className="icon-btn" title="Menu" onClick={() => toast.info("Menu options: Profile, Settings, History.")}>
//               ☰
//             </div>
//             <button className="btn btn-primary" onClick={() => toast.success("Sign-in popup simulated!")}>
//               Sign in
//             </button>
//           </div>
//         </nav>
//       </header>

//       {/* ============ PAGE 1 — HOME ============ */}
//       <section className="hero" id="home">
//         <div className="wrap">
//           <div className="hero-grid">
//             <div>
//               <div className="eyebrow hero-kicker">Delhi NCR · Tonight</div>
//               <h1 className="hero-title serif">
//                 Find your<br />
//                 <em>next</em> sitting.
//               </h1>
//               <p className="hero-sub">
//                 Browse what's playing across the city's finest screens, hold your seats in seconds, and walk in with the ticket already in hand.
//               </p>
//               <div className="hero-actions">
//                 <button className="btn btn-primary" onClick={() => scrollToSection("movie")}>
//                   Browse showtimes
//                 </button>
//                 <button className="btn btn-ghost" onClick={() => toast.info("Feature film of the week: The Quiet Hour")}>
//                   What's new this week
//                 </button>
//               </div>
//               <div className="hero-stats">
//                 <div className="hstat">
//                   <div className="n serif">42</div>
//                   <div className="l">Screens nearby</div>
//                 </div>
//                 <div className="hstat">
//                   <div className="n serif">128</div>
//                   <div className="l">Films this week</div>
//                 </div>
//                 <div className="hstat">
//                   <div className="n serif">4.8</div>
//                   <div className="l">Avg. seat rating</div>
//                 </div>
//               </div>
//             </div>
//             <div className="hero-art" style={{ cursor: "pointer" }} onClick={() => scrollToSection("movie")}>
//               <div
//                 className="hero-poster-tex"
//                 style={{
//                   backgroundImage: `url(${activeMovie.posterImage})`,
//                   opacity: 0.95
//                 }}
//               />
//               <div className="frame-label">
//                 <span className="rec"></span> Playing now — Screen 4
//               </div>
//               <div className="now-card">
//                 <div className="title serif">{activeMovie.title}</div>
//                 <div className="meta">{activeMovie.heroMeta}</div>
//               </div>
//             </div>
//           </div>

//           <div className="search-bar">
//             <div className="search-field">
//               <label htmlFor="search-input">Film or cinema</label>
//               <input
//                 id="search-input"
//                 type="text"
//                 className="val"
//                 placeholder="Search &quot;The Quiet Hour&quot;"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//             <div className="search-field">
//               <label>City</label>
//               <div className="val" style={{ cursor: "pointer" }} onClick={() => toast.info("Currently only serving Delhi NCR region.")}>
//                 Delhi NCR
//               </div>
//             </div>
//             <div className="search-field">
//               <label>Date</label>
//               <div className="val">{activeDateLabel}</div>
//             </div>
//             <button
//               className="search-go"
//               style={{ border: "none" }}
//               onClick={() => {
//                 if (searchQuery.trim()) {
//                   const found = MOVIES.find((m) =>
//                     m.title.toLowerCase().includes(searchQuery.toLowerCase())
//                   );
//                   if (found) {
//                     setActiveMovieId(found.id);
//                     toast.success(`Found "${found.title}"! Updating details below.`);
//                     setTimeout(() => scrollToSection("movie"), 150);
//                   } else {
//                     toast.error(`No screenings found for "${searchQuery}"`);
//                   }
//                 } else {
//                   toast.info("Please type a film name to search.");
//                 }
//               }}
//             >
//               Search <Search size={14} />
//             </button>
//           </div>

//           <div className="section-head">
//             <div>
//               <div className="eyebrow" style={{ marginBottom: "14px" }}>In theaters</div>
//               <div className="section-title serif">Now showing</div>
//             </div>
//             <div className="view-all" onClick={() => toast.info("All 128 listings loaded.")}>
//               View all 128 <ChevronRight size={14} />
//             </div>
//           </div>

//           <div className="film-row">
//             {MOVIES.map((movie) => (
//               <div
//                 key={movie.id}
//                 className={`film-card ${activeMovieId === movie.id ? "active-card" : ""}`}
//                 onClick={() => handleSelectMovie(movie.id)}
//               >
//                 <div
//                   className={`poster ${movie.posterClass}`}
//                   style={{ backgroundImage: `url(${movie.posterImage})` }}
//                 >
//                   <div className="rating">★ {movie.rating}</div>
//                   <div className="fmt-tags">
//                     {movie.formats.map((fmt) => (
//                       <span key={fmt}>{fmt}</span>
//                     ))}
//                   </div>
//                 </div>
//                 <h3 className="serif">{movie.title}</h3>
//                 <div className="film-meta">
//                   {movie.genres.join(" · ")} · {movie.duration}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <div className="page-divider">
//         <div className="wrap">
//           <div className="tag">
//             Mockup guide — <b>page 02</b> · film detail &amp; showtime selection
//           </div>
//           <div className="tag" style={{ cursor: "pointer" }} onClick={() => scrollToSection("movie")}>
//             scroll ↓
//           </div>
//         </div>
//       </div>

//       {/* ============ PAGE 2 — MOVIE DETAIL ============ */}
//       <section className="movie-detail" id="movie">
//         <div className="wrap">
//           <div className="md-top">
//             <div
//               className="md-poster"
//               style={{ backgroundImage: `url(${activeMovie.posterImage})` }}
//             >
//               <div className="badge">{activeMovie.formats.join(" · ")}</div>
//             </div>
//             <div className="md-info">
//               <div className="genre-row">
//                 {activeMovie.genres.map((g) => (
//                   <span key={g} className="genre-pill">{g}</span>
//                 ))}
//                 <span className="genre-pill">U/A 16+</span>
//               </div>
//               <h1 className="serif">{activeMovie.title}</h1>
//               <div className="tagline">{activeMovie.tagline}</div>
//               <div className="md-facts">
//                 <div className="mfact">
//                   <div className="l">Duration</div>
//                   <div className="v">{activeMovie.duration}</div>
//                 </div>
//                 <div className="mfact">
//                   <div className="l">Language</div>
//                   <div className="v">{activeMovie.languages}</div>
//                 </div>
//                 <div className="mfact">
//                   <div className="l">Release</div>
//                   <div className="v">{activeMovie.releaseDate}</div>
//                 </div>
//                 <div className="mfact">
//                   <div className="l">Rating</div>
//                   <div className="v gold">{activeMovie.rating}</div>
//                 </div>
//               </div>
//               <p className="md-desc">{activeMovie.description}</p>
//               <div className="cast-row">
//                 {activeMovie.cast.map((c) => (
//                   <div key={c.name} className="cast-item">
//                     <div className="name">{c.name}</div>
//                     <div className="role">{c.role}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="show-select">
//             <div className="show-select-head">
//               <div className="section-title serif" style={{ fontSize: "24px" }}>
//                 Select date &amp; showtime
//               </div>
//               <div className="eyebrow">Delhi NCR</div>
//             </div>
//             <div className="date-strip">
//               {DATES.map((d) => (
//                 <div
//                   key={d.dnum}
//                   className={`date-chip ${selectedDate === d.dnum ? "sel" : ""}`}
//                   onClick={() => {
//                     setSelectedDate(d.dnum);
//                     toast.success(`Date changed to ${d.label}`);
//                   }}
//                 >
//                   <div className="dow">{d.dow}</div>
//                   <div className="dnum serif">{d.dnum}</div>
//                 </div>
//               ))}
//             </div>

//             {CINEMAS.map((cinema) => (
//               <div key={cinema.name} className="cinema-block">
//                 <div className="cinema-name">{cinema.name}</div>
//                 <div className="cinema-loc">{cinema.location}</div>
//                 <div className="time-row">
//                   {cinema.showtimes.map((st) => (
//                     <div
//                       key={st.time}
//                       className={`time-chip ${
//                         selectedCinema === cinema.name && selectedTime === st.time
//                           ? "sel"
//                           : ""
//                       } ${st.fewLeft ? "few-left" : ""}`}
//                       onClick={() => handleSelectShowtime(cinema.name, st.time)}
//                     >
//                       {st.time}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}

//             <div className="legend-note">
//               <span className="rec"></span> Filling fast — fewer than 20 seats left
//             </div>
//           </div>
//         </div>
//       </section>

//       <div className="page-divider">
//         <div className="wrap">
//           <div className="tag">Mockup guide — <b>page 03</b> · seat selection</div>
//           <div className="tag" style={{ cursor: "pointer" }} onClick={() => scrollToSection("seats")}>
//             scroll ↓
//           </div>
//         </div>
//       </div>

//       {/* ============ PAGE 3 — SEAT SELECTION ============ */}
//       <section className="seat-page" id="seats">
//         <div className="wrap">
//           <div className="seat-layout">
//             <div>
//               <div className="seat-header">
//                 <h2 className="serif">Choose your seats</h2>
//                 <div className="sub">
//                   {selectedCinema} · Hall 4 · {activeDateLabel}, {selectedTime}
//                 </div>
//               </div>

//               <div className="theater-floor">
//                 <div className="screen-bar">
//                   <div className="curve"></div>
//                   <div className="lbl">Screen</div>
//                 </div>

//                 <div className="seat-rows">
//                   {/* Rows A, B (Premium) and C, D, E, F (Regular) */}
//                   {["A", "B", "C", "D", "E", "F"].map((rowLabel) => {
//                     const isPremium = rowLabel === "A" || rowLabel === "B";
//                     // Generate seat layout (e.g. 11 seats, with gap at index 3 and 7)
//                     return (
//                       <div key={rowLabel} className="seat-row">
//                         <div className="row-label">{rowLabel}</div>
//                         <div className="seats">
//                           {Array.from({ length: 11 }).map((_, idx) => {
//                             const seatNumber = idx + 1;
//                             const seatId = `${rowLabel}${seatNumber}`;
//                             const isGap = idx === 3 || idx === 7;
//                             const isTaken = TAKEN_SEATS.includes(seatId);
//                             const isSel = selectedSeats.includes(seatId);

//                             if (isGap) {
//                               return <div key={`gap-${idx}`} className="seat gap" />;
//                             }

//                             return (
//                               <button
//                                 key={seatId}
//                                 className={`seat ${isPremium ? "premium" : ""} ${
//                                   isTaken ? "taken" : ""
//                                 } ${isSel ? "sel" : ""}`}
//                                 disabled={isTaken}
//                                 title={`${isPremium ? "Premium" : "Standard"} Seat ${seatId}`}
//                                 onClick={() => handleToggleSeat(seatId)}
//                               >
//                                 {seatId}
//                               </button>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 <div className="seat-legend">
//                   <div className="leg-item">
//                     <div className="leg-swatch"></div> Available
//                   </div>
//                   <div className="leg-item">
//                     <div className="leg-swatch premium"></div> Premium (₹360)
//                   </div>
//                   <div className="leg-item">
//                     <div className="leg-swatch sel"></div> Selected
//                   </div>
//                   <div className="leg-item">
//                     <div className="leg-swatch taken"></div> Taken
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="summary-card">
//               <div className="summary-film">
//                 <div
//                   className="summary-thumb"
//                   style={{ backgroundImage: `url(${activeMovie.posterImage})` }}
//                 />
//                 <div>
//                   <h4 className="serif">{activeMovie.title}</h4>
//                   <div className="meta">
//                     {selectedCinema} · Hall 4
//                     <br />
//                     {activeDateLabel}, {selectedTime}
//                   </div>
//                 </div>
//               </div>

//               <div className="summary-row">
//                 <div className="l">Seats selected</div>
//                 <div className="v">{selectedSeats.length}</div>
//               </div>
//               <div className="seat-tags" style={{ marginBottom: "20px" }}>
//                 {selectedSeats.length > 0 ? (
//                   selectedSeats.map((seat) => (
//                     <div key={seat} className="seat-tag">
//                       {seat}
//                     </div>
//                   ))
//                 ) : (
//                   <div style={{ color: "rgba(245,241,232,0.3)", fontSize: "13px" }}>
//                     No seats chosen
//                   </div>
//                 )}
//               </div>

//               {selectedSeats.length > 0 && (
//                 <>
//                   {premiumCount > 0 && (
//                     <div className="summary-row">
//                       <div className="l">Premium × {premiumCount}</div>
//                       <div className="v">₹{(premiumCount * 360).toFixed(2)}</div>
//                     </div>
//                   )}
//                   {regularCount > 0 && (
//                     <div className="summary-row">
//                       <div className="l">Standard × {regularCount}</div>
//                       <div className="v">₹{(regularCount * 250).toFixed(2)}</div>
//                     </div>
//                   )}
//                   <div className="summary-row">
//                     <div className="l">Convenience fee</div>
//                     <div className="v">₹{convenienceFee.toFixed(2)}</div>
//                   </div>
//                   <div className="summary-row">
//                     <div className="l">GST (18%)</div>
//                     <div className="v">₹{gst.toFixed(2)}</div>
//                   </div>
//                 </>
//               )}

//               <div className="summary-total">
//                 <div className="l">Total</div>
//                 <div className="v serif">₹{totalPayable}</div>
//               </div>

//               <button
//                 className="btn btn-primary"
//                 disabled={selectedSeats.length === 0}
//                 onClick={() => {
//                   toast.success("Proceeding to payment gateway");
//                   scrollToSection("pay");
//                 }}
//               >
//                 Proceed to pay →
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       <div className="page-divider">
//         <div className="wrap">
//           <div className="tag">Mockup guide — <b>page 04</b> · payment &amp; checkout</div>
//           <div className="tag" style={{ cursor: "pointer" }} onClick={() => scrollToSection("pay")}>
//             scroll ↓
//           </div>
//         </div>
//       </div>

//       {/* ============ PAGE 4 — PAYMENT ============ */}
//       <section className="pay-page" id="pay">
//         <div className="wrap">
//           <div className="pay-layout">
//             <div>
//               <div className="pay-head">
//                 <h2 className="serif">Complete payment</h2>
//                 <div className="sub">Your seats are held for the next 8:42</div>
//               </div>

//               <div className="pay-methods">
//                 <div
//                   className={`pm-chip ${paymentMethod === "card" ? "sel" : ""}`}
//                   onClick={() => setPaymentMethod("card")}
//                 >
//                   <div className="ic">💳</div>
//                   <div className="lbl">Card</div>
//                 </div>
//                 <div
//                   className={`pm-chip ${paymentMethod === "upi" ? "sel" : ""}`}
//                   onClick={() => {
//                     setPaymentMethod("upi");
//                     toast.success("UPI selected. Scan QR code simulated at check out.");
//                   }}
//                 >
//                   <div className="ic">📱</div>
//                   <div className="lbl">UPI</div>
//                 </div>
//                 <div
//                   className={`pm-chip ${paymentMethod === "netbank" ? "sel" : ""}`}
//                   onClick={() => {
//                     setPaymentMethod("netbank");
//                     toast.success("Net banking selected.");
//                   }}
//                 >
//                   <div className="ic">🏦</div>
//                   <div className="lbl">Net banking</div>
//                 </div>
//                 <div
//                   className={`pm-chip ${paymentMethod === "later" ? "sel" : ""}`}
//                   onClick={() => {
//                     setPaymentMethod("later");
//                     toast.success("Pay later selected.");
//                   }}
//                 >
//                   <div className="ic">◷</div>
//                   <div className="lbl">Pay later</div>
//                 </div>
//               </div>

//               <form onSubmit={handlePay} className="pay-form">
//                 {paymentMethod === "card" ? (
//                   <>
//                     <div className="form-row full">
//                       <div className="field">
//                         <label htmlFor="card-num-input">Card number</label>
//                         <input
//                           id="card-num-input"
//                           type="text"
//                           placeholder="1234  5678  9012  3456"
//                           value={cardNumber}
//                           maxLength={19}
//                           onChange={(e) => {
//                             // format space after 4 digits
//                             const val = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
//                             const matches = val.match(/\d{4,16}/g);
//                             const match = (matches && matches[0]) || "";
//                             const parts = [];
//                             for (let i = 0, len = match.length; i < len; i += 4) {
//                               parts.push(match.substring(i, i + 4));
//                             }
//                             if (parts.length > 0) {
//                               setCardNumber(parts.join("  "));
//                             } else {
//                               setCardNumber(val);
//                             }
//                           }}
//                         />
//                       </div>
//                     </div>
//                     <div className="form-row">
//                       <div className="field">
//                         <label htmlFor="expiry-input">Expiry</label>
//                         <input
//                           id="expiry-input"
//                           type="text"
//                           placeholder="MM / YY"
//                           maxLength={7}
//                           value={expiry}
//                           onChange={(e) => setExpiry(e.target.value)}
//                         />
//                       </div>
//                       <div className="field">
//                         <label htmlFor="cvv-input">CVV</label>
//                         <input
//                           id="cvv-input"
//                           type="password"
//                           placeholder="•••"
//                           maxLength={3}
//                           value={cvv}
//                           onChange={(e) => setCvv(e.target.value)}
//                         />
//                       </div>
//                     </div>
//                     <div className="form-row full">
//                       <div className="field">
//                         <label htmlFor="name-input">Name on card</label>
//                         <input
//                           id="name-input"
//                           type="text"
//                           placeholder="As printed on card"
//                           value={cardName}
//                           onChange={(e) => setCardName(e.target.value)}
//                         />
//                       </div>
//                     </div>
//                   </>
//                 ) : (
//                   <div style={{ padding: "20px 0", textAlign: "center", color: "rgba(245, 241, 232, 0.6)" }}>
//                     {paymentMethod === "upi" && (
//                       <div>
//                         <Smartphone size={32} style={{ margin: "0 auto 12px", color: "var(--gold)" }} />
//                         <p>We will present a QR code or send an authorization prompt to your UPI app.</p>
//                       </div>
//                     )}
//                     {paymentMethod === "netbank" && (
//                       <div>
//                         <Building size={32} style={{ margin: "0 auto 12px", color: "var(--gold)" }} />
//                         <p>Redirecting to secure banking portal after checkout selection.</p>
//                       </div>
//                     )}
//                     {paymentMethod === "later" && (
//                       <div>
//                         <CalendarCheck size={32} style={{ margin: "0 auto 12px", color: "var(--gold)" }} />
//                         <p>Pay-later option verified against linked profile details.</p>
//                       </div>
//                     )}
//                   </div>
//                 )}
//                 <div className="secure-note">
//                   <Lock size={12} /> Payments are encrypted end-to-end. We never store your card details.
//                 </div>
//               </form>
//             </div>

//             <div className="ticket-card">
//               <div className="ticket-top">
//                 <div className="eyebrow">Order summary</div>
//                 <h3 className="serif">{activeMovie.title}</h3>
//                 <div className="tk-row">
//                   <div className="l">Cinema</div>
//                   <div className="v">{selectedCinema}</div>
//                 </div>
//                 <div className="tk-row">
//                   <div className="l">Hall</div>
//                   <div className="v">Hall 4</div>
//                 </div>
//                 <div className="tk-row">
//                   <div className="l">Showtime</div>
//                   <div className="v">
//                     {activeDateLabel}, {selectedTime}
//                   </div>
//                 </div>
//                 <div className="tk-row">
//                   <div className="l">Seats</div>
//                   <div className="v">
//                     {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None chosen"}
//                   </div>
//                 </div>
//               </div>
//               <div className="ticket-perf"></div>
//               <div className="ticket-bottom">
//                 <div className="tk-row">
//                   <div className="l">Tickets ({selectedSeats.length})</div>
//                   <div className="v">₹{ticketTotal.toFixed(2)}</div>
//                 </div>
//                 <div className="tk-row">
//                   <div className="l">Fees &amp; tax</div>
//                   <div className="v">₹{(convenienceFee + gst).toFixed(2)}</div>
//                 </div>
//                 <div className="tk-total">
//                   <div className="l">Total payable</div>
//                   <div className="v">₹{totalPayable}</div>
//                 </div>
//                 <button
//                   type="button"
//                   className="btn btn-dark"
//                   disabled={selectedSeats.length === 0}
//                   onClick={handlePay}
//                 >
//                   Pay ₹{totalPayable} →
//                 </button>
//                 <div className="barcode"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <footer>
//         <div className="wrap">
//           <div className="foot-grid">
//             <div className="logo" style={{ cursor: "pointer" }} onClick={() => scrollToSection("home")}>
//               Reel<span className="dot">.</span>
//             </div>
//             <div className="foot-cols">
//               <div className="foot-col">
//                 <h5>Explore</h5>
//                 <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection("home"); }}>
//                   Now showing
//                 </a>
//                 <a href="#coming-soon" onClick={(e) => { e.preventDefault(); toast.info("Coming soon titles."); }}>
//                   Coming soon
//                 </a>
//                 <a href="#movie" onClick={(e) => { e.preventDefault(); scrollToSection("movie"); }}>
//                   Cinemas
//                 </a>
//               </div>
//               <div className="foot-col">
//                 <h5>Account</h5>
//                 <a href="#bookings" onClick={(e) => { e.preventDefault(); toast.info("No active bookings found."); }}>
//                   My bookings
//                 </a>
//                 <a href="#gift" onClick={(e) => { e.preventDefault(); toast.info("Gift cards coming soon."); }}>
//                   Gift cards
//                 </a>
//                 <a href="#help" onClick={(e) => { e.preventDefault(); toast.info("Support center online 24/7."); }}>
//                   Help center
//                 </a>
//               </div>
//               <div className="foot-col">
//                 <h5>Company</h5>
//                 <a href="#about" onClick={(e) => { e.preventDefault(); toast.info("Reel is a premium cinema curator."); }}>
//                   About
//                 </a>
//                 <a href="#partner" onClick={(e) => { e.preventDefault(); toast.info("Partner with us options."); }}>
//                   Partner cinemas
//                 </a>
//                 <a href="#careers" onClick={(e) => { e.preventDefault(); toast.info("Job openings in Delhi."); }}>
//                   Careers
//                 </a>
//               </div>
//             </div>
//           </div>
//           <div className="foot-bottom">
//             <div>© 2026 Reel. All rights reserved.</div>
//             <div>Privacy · Terms · Cookies</div>
//           </div>
//         </div>
//       </footer>

//       {/* Success Modal Confirmation Ticket */}
//       {isSuccess && (
//         <div className="success-overlay" onClick={handleReset}>
//           <div className="success-container" onClick={(e) => e.stopPropagation()}>
//             <div className="success-header">
//               <div className="success-icon">
//                 <CheckCircle2 size={32} />
//               </div>
//               <h2 className="success-title">Booking Confirmed!</h2>
//               <p className="success-sub">Show this ticket at the cinema entry gate.</p>
//             </div>

//             <div className="ticket-card" style={{ position: "static", margin: 0 }}>
//               <div className="ticket-top">
//                 <div className="eyebrow" style={{ color: "var(--burgundy)" }}>
//                   Booking ID: {bookingId}
//                 </div>
//                 <h3 className="serif" style={{ fontSize: "28px", color: "var(--ink)" }}>
//                   {activeMovie.title}
//                 </h3>
//                 <div className="tk-row">
//                   <div className="l">Cinema</div>
//                   <div className="v">{selectedCinema}</div>
//                 </div>
//                 <div className="tk-row">
//                   <div className="l">Hall</div>
//                   <div className="v">Hall 4</div>
//                 </div>
//                 <div className="tk-row">
//                   <div className="l">Showtime</div>
//                   <div className="v">
//                     {activeDateLabel}, {selectedTime}
//                   </div>
//                 </div>
//                 <div className="tk-row">
//                   <div className="l">Seats</div>
//                   <div className="v" style={{ color: "var(--burgundy-bright)" }}>
//                     {selectedSeats.join(", ")}
//                   </div>
//                 </div>
//               </div>
//               <div className="ticket-perf"></div>
//               <div className="ticket-bottom" style={{ background: "rgba(20,21,26,0.02)" }}>
//                 <div className="tk-row">
//                   <div className="l">Status</div>
//                   <div className="v" style={{ color: "green", fontWeight: 700 }}>
//                     PAID (100% SECURE)
//                   </div>
//                 </div>
//                 <div className="tk-row">
//                   <div className="l">Total Paid</div>
//                   <div className="v total-val" style={{ fontSize: "22px" }}>
//                     ₹{totalPayable}
//                   </div>
//                 </div>
//                 <div className="barcode" style={{ marginTop: "24px", height: "48px" }}></div>
//                 <p
//                   style={{
//                     fontFamily: "var(--mono)",
//                     fontSize: "10px",
//                     textAlign: "center",
//                     marginTop: "8px",
//                     opacity: 0.5,
//                     letterSpacing: "0.15em"
//                   }}
//                 >
//                   {bookingId}
//                 </p>
//               </div>
//             </div>

//             <div className="ticket-actions">
//               <button
//                 className="btn btn-ghost"
//                 onClick={() => {
//                   toast.success("Opening print options...");
//                   window.print();
//                 }}
//               >
//                 <Printer size={16} /> Print
//               </button>
//               <button className="btn btn-primary" onClick={handleReset}>
//                 <RefreshCw size={16} /> Book Another
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
