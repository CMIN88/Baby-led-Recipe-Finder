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


document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const voiceSearchBtn = document.getElementById('voiceSearchBtn');
    const resultsContainer = document.getElementById('results');

    // Sample recipe data
    const recipes = [
        { name: 'Mashed Banana & Avocado', ingredients: ['banana', 'avocado'] },
        { name: 'Sweet Potato Puree', ingredients: ['sweet potato'] },
        { name: 'Oatmeal with Apples', ingredients: ['oats', 'apple'] },
        { name: 'Carrot & Lentil Mash', ingredients: ['carrot', 'lentils'] },
        { name: 'Chicken & Pea Puree', ingredients: ['chicken', 'peas'] },
        { name: 'Salmon & Sweet Potato Mash', ingredients: ['salmon', 'sweet potato'] },
        { name: 'Spinach & Potato Puree', ingredients: ['spinach', 'potato'] }
    ];

    // Function to display search results
    const displayResults = (results) => {
        resultsContainer.innerHTML = '';
        if (results.length === 0) {
            resultsContainer.innerHTML = '<p>No recipes found.</p>';
        } else {
            results.forEach(recipe => {
                const recipeElement = document.createElement('div');
                recipeElement.classList.add('recipe-result');
                recipeElement.innerHTML = `<h3>${recipe.name}</h3><p>Ingredients: ${recipe.ingredients.join(', ')}</p>`;
                resultsContainer.appendChild(recipeElement);
            });
        }
    };

    // Function to handle search
    const handleSearch = () => {
        const query = searchInput.value.trim().toLowerCase();
        if (query === '') {
            displayResults([]);
            return;
        }
        const queryArray = query.split(' ');
        const filteredRecipes = recipes.filter(recipe =>
            queryArray.every(q =>
                recipe.name.toLowerCase().includes(q) ||
                recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(q))
            )
        );
        displayResults(filteredRecipes);
    };

    // Event listener for search button
    searchBtn.addEventListener('click', handleSearch);

    // Event listener for Enter key on search input
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Voice search functionality
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            voiceSearchBtn.textContent = '🎤 Listening...';
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            searchInput.value = transcript;
            handleSearch();
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };

        recognition.onend = () => {
            voiceSearchBtn.textContent = '🎤 Voice Search';
        };

        voiceSearchBtn.addEventListener('click', () => {
            recognition.start();
        });
    } else {
        voiceSearchBtn.style.display = 'none';
        console.warn('Speech recognition not supported in this browser.');
    }
});
