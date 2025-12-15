// Elements that exist on all pages
const toggle = document.querySelector(".mobile-menu-icon");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav__link");
const currentPage = window.location.pathname.split("/").pop();
const bookingFlow = ["index.html", "booking.html", "seats.html"];

// Mobile menu toggle (works on all pages)
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    nav.classList.toggle("active");
  });
}

// Search button (only on index.html)
const search_button = document.getElementById("search-button");
if (search_button) {
  search_button.addEventListener("click", () => {
    window.open("booking.html", "_self");
  });
}

const selectBus = document.querySelectorAll("#selectBus");
selectBus.forEach((selected) => {
  selected.addEventListener("click", () => {
    window.open("seats.html", "_self");
  });
});

// Color only the active link
navLinks.forEach((link) => {
  const linkPage = link.getAttribute("href");

  if (bookingFlow.includes(currentPage) && linkPage === "index.html") {
    link.classList.add("active");
    return;
  }

  if (linkPage === currentPage) {
    link.classList.add("active");
  } else {
    link.classList.remove("active");
  }
});

// Bus filtering functionality
document.addEventListener("DOMContentLoaded", function () {
  const priceRange = document.getElementById("priceRange");
  const priceValue = document.getElementById("priceValue");
  const sortButtons = document.querySelectorAll(".sort-btn");
  const busesContainer = document.querySelector(".buses");

  // Check if we're on the booking page
  if (!priceRange || !busesContainer || sortButtons.length === 0) {
    return;
  }

  let currentSort = "time";
  let maxPrice = 5000;

  const busElements = Array.from(document.querySelectorAll(".bus-info"));

  const busData = busElements.map((bus) => {
    const priceText = bus.querySelector(".right .price").textContent;
    const price = parseInt(priceText.replace(/\D/g, ""));
    const timeText = bus.querySelector(".time").textContent.trim();
    const departureTime = timeText.split("→")[0].trim().split(" ")[1];

    return {
      element: bus,
      price: price,
      departureTime: departureTime,
      company: bus.querySelector(".left h4").textContent,
    };
  });

  priceRange.addEventListener("input", function () {
    maxPrice = parseInt(this.value);
    priceValue.textContent = `0 DZD - ${maxPrice} DZD`;

    const progress = (this.value / this.max) * 100;
    this.style.setProperty("--range-progress", `${progress}%`);

    filterAndSortBuses();
  });

  sortButtons.forEach((button) => {
    button.addEventListener("click", function () {
      sortButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      if (
        this.textContent.includes("Departure") ||
        this.textContent.includes("time")
      ) {
        currentSort = "time";
      } else if (
        this.textContent.includes("Price") ||
        this.textContent.includes("prix")
      ) {
        currentSort = "price";
      }

      filterAndSortBuses();
    });
  });

  function filterAndSortBuses() {
    let filteredBuses = busData.filter((bus) => bus.price <= maxPrice);

    if (currentSort === "time") {
      filteredBuses.sort((a, b) => {
        return timeToMinutes(a.departureTime) - timeToMinutes(b.departureTime);
      });
    } else if (currentSort === "price") {
      filteredBuses.sort((a, b) => a.price - b.price);
    }

    busesContainer.innerHTML = "";

    if (filteredBuses.length === 0) {
      busesContainer.innerHTML =
        '<p style="text-align: center; padding: 2rem; color: #64748b;">No buses available for the selected price range.</p>';
    } else {
      filteredBuses.forEach((bus) => {
        busesContainer.appendChild(bus.element);
      });
    }
  }

  function timeToMinutes(time) {
    const [hours, minutes] = time.split(":").map((num) => parseInt(num));
    return hours * 60 + minutes;
  }

  filterAndSortBuses();
});

// Seat Selection Functionality
document.addEventListener("DOMContentLoaded", function () {
  const seats = document.querySelectorAll(".seat-row .seat");
  const summarySeats = document.querySelector(".seat-num");
  const totalAmount = document.querySelector(".total-amount");
  const proceedButton = document.querySelector(".goToPayement");

  if (!seats.length || !summarySeats || !totalAmount) {
    return;
  }

  const UNIT_PRICE = 1500;
  const MAX_SEATS = 5;

  let selectedSeatsArray = [];

  seats.forEach((seat) => {
    if (seat.classList.contains("available")) {
      seat.addEventListener("click", () => {
        handleSeatClick(seat);
      });
    }
  });

  function handleSeatClick(seat) {
    const seatNumber = seat.textContent.trim();

    if (seat.classList.contains("selected")) {
      deselectSeat(seat, seatNumber);
    } else if (selectedSeatsArray.length < MAX_SEATS) {
      selectSeat(seat, seatNumber);
    } else {
      showMaxSeatsWarning();
    }

    updateSummary();
  }

  function selectSeat(seat, seatNumber) {
    seat.classList.remove("available");
    seat.classList.add("selected");
    selectedSeatsArray.push(seatNumber);
  }

  function deselectSeat(seat, seatNumber) {
    seat.classList.remove("selected");
    seat.classList.add("available");
    selectedSeatsArray = selectedSeatsArray.filter((num) => num !== seatNumber);
  }

  function updateSummary() {
    if (selectedSeatsArray.length === 0) {
      summarySeats.textContent = "No seat selected";
      summarySeats.style.color = "#64748b";
    } else {
      const sortedSeats = selectedSeatsArray.sort(
        (a, b) => parseInt(a) - parseInt(b)
      );
      summarySeats.textContent = sortedSeats.join(", ");
      summarySeats.style.color = "#1e293b";
    }

    const totalPrice = selectedSeatsArray.length * UNIT_PRICE;
    totalAmount.textContent = formatPrice(totalPrice);

    if (selectedSeatsArray.length === 0) {
      proceedButton.style.opacity = "0.5";
      proceedButton.style.cursor = "not-allowed";
      proceedButton.style.pointerEvents = "none";
    } else {
      proceedButton.style.opacity = "1";
      proceedButton.style.cursor = "pointer";
      proceedButton.style.pointerEvents = "auto";
    }
  }

  function formatPrice(price) {
    return price.toLocaleString("fr-DZ") + " DA";
  }

  function showMaxSeatsWarning() {
    let warning = document.querySelector(".max-seats-warning");

    if (!warning) {
      warning = document.createElement("div");
      warning.className = "max-seats-warning";
      warning.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: #ef4444;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        font-weight: 500;
        animation: slideDown 0.3s ease;
      `;
      warning.textContent = `Maximum ${MAX_SEATS} seats allowed`;
      document.body.appendChild(warning);

      const style = document.createElement("style");
      style.textContent = `
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `;
      document.head.appendChild(style);
    }

    warning.style.display = "block";

    setTimeout(() => {
      warning.style.display = "none";
    }, 2000);
  }

  updateSummary();

  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    .seat.selected {
      animation: seatPulse 0.3s ease;
    }
    
    @keyframes seatPulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(styleSheet);
});
