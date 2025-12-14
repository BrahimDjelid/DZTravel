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

const selectBus = document.getElementById("selectBus");
if (selectBus) {
  selectBus.addEventListener("click", () => {
    window.open("seats.html", "_self");
  });
}

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
    return; // Exit if booking elements don't exist
  }

  let currentSort = "time";
  let maxPrice = 5000;

  // Store original bus data
  const busElements = Array.from(document.querySelectorAll(".bus-info")); // busElements is an Array of buses (contains all bus-info elements)

  // Extract buses information (price and time) and store them in an array
  const busData = busElements.map((bus) => {
    const priceText = bus.querySelector(".right .price").textContent;
    const price = parseInt(priceText.replace(/\D/g, ""));
    const timeText = bus.querySelector(".time").textContent.trim(); // Result e.g: "06:00 -> 08:00"
    const departureTime = timeText.split("→")[0].trim().split(" ")[1]; // Result "06:00"

    return {
      element: bus,
      price: price, // For comparing prices
      departureTime: departureTime, // For sorting with time
      company: bus.querySelector(".left h4").textContent,
    };
  });

  // Update price range display
  priceRange.addEventListener("input", function () {
    maxPrice = parseInt(this.value);
    priceValue.textContent = `0 DZD - ${maxPrice} DZD`;

    const progress = (this.value / this.max) * 100;
    this.style.setProperty("--range-progress", `${progress}%`);

    filterAndSortBuses();
  });

  // Handle sort button clicks
  sortButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      sortButtons.forEach((btn) => btn.classList.remove("active"));
      // Add active class to clicked button
      this.classList.add("active");

      // Set current sort type
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

  // Main filter and sort function
  function filterAndSortBuses() {
    // Filter by price
    let filteredBuses = busData.filter((bus) => bus.price <= maxPrice);

    // Sort based on current sort type
    if (currentSort === "time") {
      filteredBuses.sort((a, b) => {
        return timeToMinutes(a.departureTime) - timeToMinutes(b.departureTime);
      });
    } else if (currentSort === "price") {
      filteredBuses.sort((a, b) => a.price - b.price);
    }

    // Clear container
    busesContainer.innerHTML = "";

    // Add filtered and sorted buses back
    if (filteredBuses.length === 0) {
      busesContainer.innerHTML =
        '<p style="text-align: center; padding: 2rem; color: #64748b;">No buses available for the selected price range.</p>';
    } else {
      filteredBuses.forEach((bus) => {
        busesContainer.appendChild(bus.element);
      });
    }
  }

  // Helper function to convert time to minutes for sorting
  function timeToMinutes(time) {
    const [hours, minutes] = time.split(":").map((num) => parseInt(num));
    return hours * 60 + minutes;
  }

  // Initial render with default sorting
  filterAndSortBuses();
});
