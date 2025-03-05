document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".section");
    const navLinks = document.querySelectorAll("nav ul li a");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const voiceSearchBtn = document.getElementById("voiceSearchBtn");
    const resultsContainer = document.getElementById("results");
    const darkModeToggle = document.getElementById("darkModeToggle");
    const body = document.body;
    const modal = document.getElementById("recipe-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalImage = document.getElementById("modal-image");
    const modalIngredients = document.getElementById("modal-ingredients");
    const modalInstructions = document.getElementById("modal-instructions");
    const closeModalBtn = document.querySelector(".close-btn");

    // Function to switch between sections
    const switchSection = (sectionId) => {
        sections.forEach(section => {
            section.classList.remove("active");
        });
        document.getElementById(sectionId).classList.add("active");
    };

    // Event listeners for navigation
    navLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const sectionId = event.target.getAttribute("href").substring(1);
            switchSection(sectionId);
        });
    });

    // Function to fetch recipes from API
    const fetchRecipes = async (query) => {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const data = await response.json();
        displayRecipes(data.meals);
    };

    // Function to display fetched recipes
    const displayRecipes = (meals) => {
        resultsContainer.innerHTML = "";
        if (!meals) {
            resultsContainer.innerHTML = "<p>No results found.</p>";
            return;
        }
        meals.forEach(meal => {
            const recipeElement = document.createElement("div");
            recipeElement.classList.add("recipe");
            recipeElement.innerHTML = `
                <h3>${meal.strMeal}</h3>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <button class="view-recipe" data-id="${meal.idMeal}">View Recipe</button>
            `;
            resultsContainer.appendChild(recipeElement);
        });
    };

    // Event listener for search button
    searchBtn.addEventListener("click", () => {
        const query = searchInput.value.trim();
        if (query) fetchRecipes(query);
    });

    // Event listener for voice search button
    voiceSearchBtn.addEventListener("click", () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.onresult = (event) => {
            searchInput.value = event.results[0][0].transcript;
            fetchRecipes(searchInput.value);
        };
        recognition.start();
    });

    // Function to toggle dark mode
    const toggleDarkMode = () => {
        body.classList.toggle("dark-mode");
    };

    darkModeToggle.addEventListener("click", toggleDarkMode);

    // Function to show modal with recipe details
    const showRecipeModal = async (id) => {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await response.json();
        const meal = data.meals[0];
        modalTitle.textContent = meal.strMeal;
        modalImage.src = meal.strMealThumb;
        modalIngredients.innerHTML = "";
        for (let i = 1; i <= 20; i++) {
            if (meal[`strIngredient${i}`]) {
                const ingredient = document.createElement("li");
                ingredient.textContent = `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`;
                modalIngredients.appendChild(ingredient);
            }
        }
        modalInstructions.textContent = meal.strInstructions;
        modal.style.display = "flex";
    };

    // Event listener for viewing recipes in modal
    resultsContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("view-recipe")) {
            showRecipeModal(event.target.getAttribute("data-id"));
        }
    });

    // Event listener to close modal
    closeModalBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});
