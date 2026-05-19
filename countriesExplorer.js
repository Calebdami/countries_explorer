// Éléments du DOM
const searchInput = document.getElementById("search");
const countriesContainer = document.getElementById("countries");
const monFirst = document.querySelector(".app-container");

// Triggers et conteneurs des select personnalisés
const regionTrigger = document.getElementById("select-region-trigger");
const regionOptionsContainer = document.getElementById("select-region-options");
const regionContainer = document.getElementById("select-region-container");

const languageTrigger = document.getElementById("select-language-trigger");
const languageOptionsContainer = document.getElementById("select-language-options");
const languageContainer = document.getElementById("select-language-container");

const populationTrigger = document.getElementById("select-population-trigger");
const populationOptionsContainer = document.getElementById("select-population-options");
const populationContainer = document.getElementById("select-population-container");

// URL de l'API REST Countries
const URL = `https://restcountries.com/v3.1/all?fields=name,capital,region,subregion,population,flags,languages,currencies`;

// État global de l'application
let countries = [];
let regions = [];
let languages = [];

// Filtres sélectionnés
let selectedRegion = "all";
let selectedLanguage = "all";
let selectedPopulation = "all";

// Intervalles de population prédéfinis pour un filtre exploitable
const POPULATION_RANGES = [
    { label: "< 1 Million", min: 0, max: 1000000, value: "small" },
    { label: "1M - 10 Millions", min: 1000000, max: 10000000, value: "medium" },
    { label: "10M - 100 Millions", min: 10000000, max: 100000000, value: "large" },
    { label: "> 100 Millions", min: 100000000, max: 999999999999, value: "huge" }
];

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    loadCountries();
    setupEventListeners();
});

// Récupération des données pays de l'API
async function loadCountries() {
    try {
        const res = await fetch(URL);
        if (!res.ok) throw new Error("Erreur réseau lors du chargement des pays.");
        const data = await res.json();
        
        // Tri initial par ordre alphabétique
        countries = data.sort((a, b) => a.name.common.localeCompare(b.name.common));

        // Extraction et affichage des filtres et pays
        extractFilterOptions();
        populateFilterDropdowns();
        display(countries);
    } catch (err) {
        console.error(err);
        countriesContainer.innerHTML = `
            <div class="no-results">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 2.5rem; color: #ef4444; margin-bottom: 10px;"></i>
                <p>Impossible de récupérer les pays. Veuillez vérifier votre connexion internet et recharger la page.</p>
            </div>`;
    } finally {
        // Enlève l'overlay de transition une fois le chargement terminé
        document.body.classList.add("loaded");
    }
}

// Extraction des régions et langues uniques
function extractFilterOptions() {
    const regionsSet = new Set();
    const languagesSet = new Set();

    countries.forEach(c => {
        if (c.region) regionsSet.add(c.region);
        if (c.languages) {
            Object.values(c.languages).forEach(lang => languagesSet.add(lang));
        }
    });

    regions = Array.from(regionsSet).sort();
    languages = Array.from(languagesSet).sort();
}

// Remplissage des sélecteurs de filtre personnalisés
function populateFilterDropdowns() {
    // 1. Régions
    regionOptionsContainer.innerHTML = `<div class="option selected" data-value="all">Trier par Régions</div>`;
    regions.forEach(r => {
        const option = document.createElement("div");
        option.className = "option";
        option.setAttribute("data-value", r);
        option.textContent = r;
        regionOptionsContainer.appendChild(option);
    });

    // 2. Langues
    languageOptionsContainer.innerHTML = `<div class="option selected" data-value="all">Trier par Langues</div>`;
    languages.forEach(l => {
        const option = document.createElement("div");
        option.className = "option";
        option.setAttribute("data-value", l);
        option.textContent = l;
        languageOptionsContainer.appendChild(option);
    });

    // 3. Population
    populationOptionsContainer.innerHTML = `<div class="option selected" data-value="all">Trier par Population</div>`;
    POPULATION_RANGES.forEach(range => {
        const option = document.createElement("div");
        option.className = "option";
        option.setAttribute("data-value", range.value);
        option.textContent = range.label;
        populationOptionsContainer.appendChild(option);
    });

    // Configurer le comportement de clic sur les options générées
    setupOptionsClickEvents();
}

// Configuration du comportement de clic sur les options de chaque filtre personnalisé
function setupOptionsClickEvents() {
    // Régions Options
    regionOptionsContainer.querySelectorAll(".option").forEach(opt => {
        opt.addEventListener("click", () => {
            selectedRegion = opt.getAttribute("data-value");
            regionTrigger.querySelector("span").textContent = opt.textContent;
            
            regionOptionsContainer.querySelectorAll(".option").forEach(o => o.classList.remove("selected"));
            opt.classList.add("selected");
            
            regionContainer.classList.remove("active");
            applyFilters();
        });
    });

    // Langues Options
    languageOptionsContainer.querySelectorAll(".option").forEach(opt => {
        opt.addEventListener("click", () => {
            selectedLanguage = opt.getAttribute("data-value");
            languageTrigger.querySelector("span").textContent = opt.textContent;
            
            languageOptionsContainer.querySelectorAll(".option").forEach(o => o.classList.remove("selected"));
            opt.classList.add("selected");
            
            languageContainer.classList.remove("active");
            applyFilters();
        });
    });

    // Population Options
    populationOptionsContainer.querySelectorAll(".option").forEach(opt => {
        opt.addEventListener("click", () => {
            selectedPopulation = opt.getAttribute("data-value");
            populationTrigger.querySelector("span").textContent = opt.textContent;
            
            populationOptionsContainer.querySelectorAll(".option").forEach(o => o.classList.remove("selected"));
            opt.classList.add("selected");
            
            populationContainer.classList.remove("active");
            applyFilters();
        });
    });
}

// Configuration des écouteurs d'événements généraux et comportement Select
function setupEventListeners() {
    // Recherche textuelle
    searchInput.addEventListener("input", applyFilters);

    // Ouverture/Fermeture des select au clic sur les triggers
    regionTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        regionContainer.classList.toggle("active");
        languageContainer.classList.remove("active");
        populationContainer.classList.remove("active");
    });

    languageTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        languageContainer.classList.toggle("active");
        regionContainer.classList.remove("active");
        populationContainer.classList.remove("active");
    });

    populationTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        populationContainer.classList.toggle("active");
        regionContainer.classList.remove("active");
        languageContainer.classList.remove("active");
    });

    // Fermeture automatique de tous les select si clic à l'extérieur
    document.addEventListener("click", () => {
        regionContainer.classList.remove("active");
        languageContainer.classList.remove("active");
        populationContainer.classList.remove("active");
    });

    // Transition fluide lors du retour à l'accueil
    const backBtn = document.getElementById("back-to-home");
    if (backBtn) {
        backBtn.addEventListener("click", (e) => {
            e.preventDefault();
            document.body.classList.remove("loaded"); // Réactive le rideau noir
            setTimeout(() => {
                window.location.href = backBtn.getAttribute("href");
            }, 600);
        });
    }
}

// Application combinée de tous les filtres
function applyFilters() {
    const searchValue = searchInput.value.toLowerCase().trim();

    const filtered = countries.filter(c => {
        // 1. Filtre textuel (Nom du pays ou sa capitale)
        const nameCommon = (c.name?.common || "").toLowerCase();
        const nameOfficial = (c.name?.official || "").toLowerCase();
        const capital = (c.capital ? c.capital[0] : "").toLowerCase();
        
        const matchesSearch = !searchValue || 
            nameCommon.includes(searchValue) || 
            nameOfficial.includes(searchValue) || 
            capital.includes(searchValue);

        // 2. Filtre par Région
        const matchesRegion = selectedRegion === "all" || c.region === selectedRegion;

        // 3. Filtre par Langue
        const countryLangs = c.languages ? Object.values(c.languages) : [];
        const matchesLanguage = selectedLanguage === "all" || countryLangs.includes(selectedLanguage);

        // 4. Filtre par Population (Par tranches)
        let matchesPopulation = true;
        if (selectedPopulation !== "all") {
            const range = POPULATION_RANGES.find(r => r.value === selectedPopulation);
            if (range) {
                matchesPopulation = c.population >= range.min && c.population <= range.max;
            }
        }

        return matchesSearch && matchesRegion && matchesLanguage && matchesPopulation;
    });

    display(filtered);
}

// Rendu HTML des cartes de pays
function display(table) {
    countriesContainer.innerHTML = "";

    if (table.length === 0) {
        countriesContainer.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 50px 0; color: var(--text-muted);">
                <i class="fa-regular fa-face-frown" style="font-size: 3rem; margin-bottom: 15px;"></i>
                <p style="font-size: 1.1rem; font-weight: 500;">Aucun pays ne correspond à vos critères.</p>
            </div>`;
        return;
    }

    table.forEach((c, index) => {
        const card = document.createElement("div");
        card.className = "info";
        card.style.animationDelay = `${Math.min(index * 0.03, 0.6)}s`; // Stagger d'entrée plafonné

        // Formater les données pour l'affichage
        const popFormatted = c.population.toLocaleString("fr-FR");
        const currencies = c.currencies ? Object.values(c.currencies).map(curr => `${curr.name} (${curr.symbol || ''})`).join(", ") : "N/A";
        const languagesList = c.languages ? Object.values(c.languages).join(", ") : "N/A";
        const capitalCity = c.capital ? c.capital[0] : "N/A";

        card.innerHTML = `
            <img src="${c.flags.png}" alt="Drapeau de ${c.name.common}" class="image" loading="lazy">
            <div class="details">
                <h1>${c.name.common}</h1>
                <h2>Capitale : ${capitalCity}</h2>
                <p>${c.region}</p>
                <p>${c.subregion || "N/A"}</p>
                <p>${popFormatted}</p>
                <p>${languagesList}</p>
                <p>${currencies}</p>
            </div>
        `;

        // Ouverture de l'overlay au clic
        card.addEventListener("click", () => {
            openOverlay(c, card);
        });

        countriesContainer.appendChild(card);
    });
}

// Création et affichage de la fenêtre modale (Overlay)
function openOverlay(country, cardNode) {
    // Application de l'effet flou en arrière-plan
    monFirst.classList.add("blur");

    // Création du conteneur overlay
    const overlay = document.createElement("div");
    overlay.className = "overlay";

    // Cloner la carte et lui affecter le style modal dédié
    const clone = cardNode.cloneNode(true);
    clone.classList.add("overlay-card");

    // Bouton de fermeture
    const closeBtn = document.createElement("button");
    closeBtn.className = "close";
    closeBtn.setAttribute("aria-label", "Fermer");
    closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';

    // Fonction de fermeture avec animation fluide
    const closeOverlay = () => {
        monFirst.classList.remove("blur");
        overlay.style.opacity = "0";
        overlay.style.transition = "opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
        setTimeout(() => {
            overlay.remove();
        }, 300);
    };

    // Événements de fermeture (clic sur le fond ou sur le bouton)
    overlay.addEventListener("click", e => {
        if (e.target === overlay) closeOverlay();
    });
    closeBtn.addEventListener("click", closeOverlay);

    // Assemblage et affichage
    overlay.appendChild(clone);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
}