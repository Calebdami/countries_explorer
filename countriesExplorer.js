const searchInput = document.getElementById("search");
const countriesContainer = document.getElementById("countries");
const selectRegion = document.getElementById("region");
const selectLanguage = document.getElementById("language");
const selectPopulation = document.getElementById("population");
const monFirst = document.getElementsByClassName("app-container")[0];

const URL = `https://restcountries.com/v3.1/all?fields=name,capital,region,subregion,population,flags,languages,currencies,maps`;
let [countries, filteredRegion, filteredLanguage, filteredPopulation] = [[], [], [], []];

function display(table) {
    countriesContainer.innerHTML = '';
    selectRegion.innerHTML = `<option class='option_region' value='all'>Trier par les regions</option>`;
    selectLanguage.innerHTML = `<option class='option_language' value='all'>Trier par les langues</option>`;
    selectPopulation.innerHTML = `<option class='option_population' value='all'>Trier par la population</option>`;

    filteredRegion = [];
    filteredLanguage = [];
    filteredPopulation = [];
    table.sort((a,b) => a.name.common.localeCompare(b.name.common));
    table.forEach((i, index) => {
        if (!filteredRegion.includes(i.region)) { filteredRegion.push(i.region); filteredRegion.sort(); }
        if (!filteredLanguage.includes(Object.values(i.languages || {}).join(", "))) { filteredLanguage.push(Object.values(i.languages || {}).join(", ")); filteredLanguage.sort(); }
        if (!filteredPopulation.includes(i.population)) { filteredPopulation.push(i.population); filteredPopulation.sort((a, b) => a - b); }

        const div = document.createElement("div");
        div.className = `info pays_${index}`;
        div.innerHTML = `
            <img src="${i.flags.png}" alt="image_pays_${index}" class="image">
            <div class="details">
                <h1 class="in">Nom : ${i.name.common}</h1>
                <h2 class="in">Capitale : ${i.capital ? i.capital[0] : "N/A"}</h2>
                <p class="in">Continent : ${i.region}</p>
                <p class="in">${i.subregion || ""}</p>
                <p class="in">Population : ${i.population.toLocaleString()}</p>
                <p class="in">Langues : ${Object.values(i.languages || {}).join(", ")}</p>
                <p class="in">Monnaie : ${Object.values(i.currencies || {})[0]?.name || "No currencies"}</p>
            </div>`;

        // CLIC SUR LA CARTE => Overlay
        div.addEventListener('click', () => {
            // Ajouter blur
            monFirst.classList.add('blur');

            // Création overlay
            const overlay_div = document.createElement("div");
            overlay_div.className = "overlay";

            // Fermer overlay au clic sur fond
            overlay_div.addEventListener("click", e => {
                if (e.target === overlay_div) {
                    monFirst.classList.remove("blur");
                    overlay_div.remove();
                }
            });

            // Cloner la carte
            const clone = div.cloneNode(true);
            clone.classList.add("overlay-card");

            // Bouton de fermeture
            const closeBtn = document.createElement("div");
            closeBtn.className = "close";
            closeBtn.textContent = "✖";
            closeBtn.addEventListener("click", () => {
                monFirst.classList.remove("blur");
                overlay_div.remove();
            });

            // Ajouter clone et close dans overlay
            overlay_div.appendChild(clone);
            overlay_div.appendChild(closeBtn);

            document.body.appendChild(overlay_div);
        });

        countriesContainer.appendChild(div);
    });

    // Ajouter options aux selects
    filteredRegion.forEach(i => {
        const option = document.createElement("option");
        option.className = 'option_region';
        option.textContent = i.charAt(0).toUpperCase() + i.slice(1);
        option.value = i.charAt(0).toUpperCase() + i.slice(1);
        selectRegion.appendChild(option);
    });

    filteredLanguage.forEach(i => {
        const option = document.createElement("option");
        option.className = 'option_language';
        option.textContent = i.charAt(0).toUpperCase() + i.slice(1);
        option.value = i.charAt(0).toUpperCase() + i.slice(1);
        selectLanguage.appendChild(option);
    });

    filteredPopulation.forEach(i => {
        const option = document.createElement("option");
        option.className = 'option_population';
        option.textContent = i.toLocaleString();
        option.value = i;
        selectPopulation.appendChild(option);
    });
}

// CHARGEMENT DES PAYS
async function loadCountries() {
    try {
        const res = await fetch(URL);
        if (!res.ok) throw new Error("Erreur réseau lors du fetch");
        const recup = await res.json();
        countries = recup;
        display(countries);
    } catch (err) {
        console.error(err);
    }
}

// FILTRE
function applyFilter() {
    const searchValue = searchInput.value.toLowerCase();
    const filteredCountries = countries.filter(i =>
        i.region.toLowerCase().includes(searchValue) ||
        i.name.common.toLowerCase().includes(searchValue)
    );
    display(filteredCountries);
}

// EVENT LISTENERS
searchInput.addEventListener("input", applyFilter);

selectRegion.addEventListener("change", () => {
    const selectedRegion = selectRegion.value;
    if (selectedRegion === 'all') display(countries);
    else display(countries.filter(i => i.region === selectedRegion));
});

selectLanguage.addEventListener("change", () => {
    const selectedLanguage = selectLanguage.value;
    if (selectedLanguage === 'all') display(countries);
    else display(countries.filter(i => Object.values(i.languages || {}).join(", ") === selectedLanguage));
});

selectPopulation.addEventListener("change", () => {
    const selectedPopulation = selectPopulation.value;
    if (selectedPopulation === 'all') display(countries);
    else display(countries.filter(i => i.population == selectedPopulation));
});

// Initial load
loadCountries();