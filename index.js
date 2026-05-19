document.addEventListener("DOMContentLoaded", () => {
    // Regrouper l'enregistrement de ScrollTrigger
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    // ==========================================================================
    // 1. MENU DRAWER (OUVERTURE/FERMETURE)
    // ==========================================================================
    const menuOpenBtn = document.getElementById("menu-open");
    const menuCloseBtn = document.getElementById("menu-close");
    const menuDrawer = document.getElementById("menu-drawer");
    const drawerOverlay = document.getElementById("drawer-overlay");

    const openMenu = () => {
        menuDrawer.classList.add("open");
        // Animation GSAP pour l'ouverture
        gsap.fromTo(".drawer-content", 
            { x: "100%" }, 
            { x: "0%", duration: 0.5, ease: "power4.out" }
        );
        gsap.fromTo(".nav-section", 
            { x: 30, opacity: 0 }, 
            { x: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: "power2.out", delay: 0.15 }
        );
    };

    const closeMenu = () => {
        gsap.to(".drawer-content", {
            x: "100%",
            duration: 0.4,
            ease: "power4.in",
            onComplete: () => {
                menuDrawer.classList.remove("open");
            }
        });
    };

    if (menuOpenBtn) menuOpenBtn.addEventListener("click", openMenu);
    if (menuCloseBtn) menuCloseBtn.addEventListener("click", closeMenu);
    if (drawerOverlay) drawerOverlay.addEventListener("click", closeMenu);

    // ==========================================================================
    // 2. ANIMATIONS D'ENTRÉE GSAP (PAGE D'ACCUEIL)
    // ==========================================================================
    const mainTl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // En-tête (Header)
    mainTl.fromTo(".main-header", 
        { y: -80, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1 }
    );

    // Titres héro
    mainTl.fromTo(".hero-title .text-slide",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.15 },
        "-=0.6"
    );

    // Sous-titre héro
    mainTl.fromTo(".hero-subtitle",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        "-=0.7"
    );

    // Boutons héro
    mainTl.fromTo(".hero-ctas .hero-btn",
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.12 },
        "-=0.7"
    );

    // ==========================================================================
    // 3. ENTRÉE DES DRAPEAUX FLOTTANTS ET MOUVEMENT CONTINU
    // ==========================================================================
    const flags = document.querySelectorAll(".flag-item");
    
    gsap.fromTo(".flag-item", 
        { scale: 0, opacity: 0, y: 30 },
        { 
            scale: 1, 
            opacity: 0.35, 
            y: 0, 
            duration: 1.5, 
            stagger: 0.1, 
            ease: "back.out(1.5)",
            onComplete: startFloatingFlags
        }
    );

    function startFloatingFlags() {
        flags.forEach((flag, idx) => {
            gsap.to(flag, {
                y: "random(-30, 30)",
                x: "random(-20, 20)",
                rotation: "random(-15, 15)",
                duration: "random(4.5, 7)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: idx * 0.2
            });
        });
    }

    // ==========================================================================
    // 4. ANIMATION DES CHIFFRES CLÉS (STATS) AU DEFILEMENT
    // ==========================================================================
    const statBoxes = document.querySelectorAll(".stat-box");
    
    if (statBoxes.length > 0 && typeof ScrollTrigger !== "undefined") {
        statBoxes.forEach((box) => {
            const numEl = box.querySelector(".stat-number");
            const target = parseInt(numEl.getAttribute("data-target"), 10);
            
            gsap.fromTo(numEl, 
                { textContent: 0 },
                {
                    textContent: target,
                    duration: 2.2,
                    ease: "power2.out",
                    snap: { textContent: 1 },
                    scrollTrigger: {
                        trigger: box,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });
    }

    // ==========================================================================
    // 5. ANIMATIONS SCROLLTRIGGER POUR LES ARTICLES
    // ==========================================================================
    if (typeof ScrollTrigger !== "undefined") {
        // Entrée de la carte "La Une"
        gsap.fromTo(".featured-card", 
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1.2,
                scrollTrigger: {
                    trigger: ".featured-card",
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );

        // Entrée en cascade de la grille d'articles
        gsap.fromTo(".news-card", 
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.15,
                scrollTrigger: {
                    trigger: ".news-grid",
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );
    }

    // ==========================================================================
    // 6. LIENS DE TRANSITIONS DE PAGES SEAMLESS (FONDUS)
    // ==========================================================================
    const transitionLinks = document.querySelectorAll("a:not([target='_blank']):not([href^='#'])");
    
    // ==========================================================================
    // 7. CHARGEMENT DYNAMIQUE DES ACTUALITÉS EN DIRECT (RSS VIA CORS-API)
    // ==========================================================================
    const categories = [
        { id: "analyses", label: "Analyses", badge: "warning" },
        { id: "insolite", label: "Insolite", badge: "info" },
        { id: "demographie", label: "Démographie", badge: "success" },
        { id: "geographie", label: "Géographie", badge: "primary" },
        { id: "evenements", label: "Événements", badge: "warning" }
    ];

    const fallbackArticles = [
        {
            title: "Le mystère des pays sans capitale officielle",
            link: "https://www.slate.fr/story/183184/pays-sans-capitale-officielle-nauru-suisse",
            thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
            pubDate: "19 Mai 2026",
            description: "Si la majorité des nations du globe possèdent une capitale bien établie, certains territoires font exception. Entre décentralisation extrême, capitales de facto et absence totale de chef-lieu désigné par la Constitution, découvrez ces nations insolites qui bousculent la géographie politique traditionnelle.",
            category: "analyses",
            badgeClass: "warning",
            categoryLabel: "Analyses"
        },
        {
            title: "Top 5 des capitales les plus élevées au monde",
            link: "https://fr.wikipedia.org/wiki/Liste_des_capitales_par_altitude",
            thumbnail: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=500&auto=format&fit=crop",
            pubDate: "18 Mai 2026",
            description: "De La Paz en Bolivie à Quito en Équateur, prenez de la hauteur et découvrez ces centres administratifs perchés à des altitudes record.",
            category: "insolite",
            badgeClass: "info",
            categoryLabel: "Insolite"
        },
        {
            title: "Le cap des 8 milliards d'habitants : quels impacts ?",
            link: "https://www.un.org/fr/observances/8-billion-day",
            thumbnail: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=500&auto=format&fit=crop",
            pubDate: "17 Mai 2026",
            description: "Analyse démographique des grandes puissances mondiales et des mutations de population en Afrique et en Asie pour les décennies à venir.",
            category: "demographie",
            badgeClass: "success",
            categoryLabel: "Démographie"
        },
        {
            title: "Archipels et micro-nations : souveraineté sur l'océan",
            link: "https://www.nationalgeographic.fr/environnement/tuvalu-le-premier-pays-a-disparaitre-a-cause-du-changement-climatique",
            thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=500&auto=format&fit=crop",
            pubDate: "15 Mai 2026",
            description: "Comment de minuscules territoires insulaires luttent pour préserver leur culture et leur statut de nation face aux défis environnementaux modernes.",
            category: "geographie",
            badgeClass: "primary",
            categoryLabel: "Géographie"
        },
        {
            title: "Le Sommet Global de la Biodiversité COP16",
            link: "https://fr.wikipedia.org/wiki/Conf%C3%A9rence_de_Cali_sur_la_biodiversit%C3%A9",
            thumbnail: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=500&auto=format&fit=crop",
            pubDate: "12 Mai 2026",
            description: "Retour sur les grandes résolutions prises par les États membres lors du dernier congrès pour la sauvegarde des réserves naturelles mondiales.",
            category: "evenements",
            badgeClass: "warning",
            categoryLabel: "Événements"
        }
    ];

    function renderArticles(articles) {
        const featuredCardContainer = document.querySelector('.featured-card');
        const newsGridContainer = document.querySelector('.news-grid');
        const newsListGridContainer = document.querySelector('.news-list-grid');

        // Rendu sur la page d'accueil (index.html)
        if (featuredCardContainer && newsGridContainer) {
            featuredCardContainer.classList.remove('skeleton-featured');
            const first = articles[0];
            featuredCardContainer.innerHTML = `
                <div class="featured-img-wrapper">
                    <div class="featured-gradient"></div>
                    <img src="${first.thumbnail}" alt="${first.title}" class="featured-image" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop';">
                </div>
                <div class="featured-info">
                    <div class="meta-row">
                        <span class="meta-item"><i class="fa-regular fa-calendar"></i> ${first.pubDate}</span>
                        <span class="meta-item"><i class="fa-regular fa-clock"></i> 5 min de lecture</span>
                        <span class="meta-item author"><i class="fa-regular fa-user"></i> France 24</span>
                    </div>
                    <h3>${first.title}</h3>
                    <p class="summary">${first.description}</p>
                    <a href="${first.link}" target="_blank" rel="noopener noreferrer" class="read-more-btn">
                        <span>Lire l'article complet</span>
                        <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            `;

            newsGridContainer.innerHTML = "";
            articles.slice(1, 4).forEach(art => {
                const card = document.createElement('article');
                card.className = 'news-card';
                card.innerHTML = `
                    <div class="card-img-wrapper">
                        <span class="card-badge ${art.badgeClass}">${art.categoryLabel}</span>
                        <img src="${art.thumbnail}" alt="${art.title}" class="card-image" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop';">
                    </div>
                    <div class="card-body">
                        <div class="card-meta">
                            <span><i class="fa-regular fa-calendar"></i> ${art.pubDate}</span>
                            <span><i class="fa-regular fa-user"></i> France 24</span>
                        </div>
                        <h4>${art.title}</h4>
                        <p class="card-excerpt">${art.description}</p>
                        <a href="${art.link}" target="_blank" rel="noopener noreferrer" class="card-link">Lire la suite <i class="fa-solid fa-arrow-right"></i></a>
                    </div>
                `;
                newsGridContainer.appendChild(card);
            });
            
            // Relancer les animations GSAP d'entrée
            if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
                gsap.fromTo(".featured-card", 
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8 }
                );
                gsap.fromTo(".news-grid .news-card", 
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, stagger: 0.15 }
                );
            }
        }

        // Rendu sur la page d'actualités (news.html)
        if (newsListGridContainer) {
            newsListGridContainer.innerHTML = "";
            articles.forEach(art => {
                const card = document.createElement('article');
                card.className = 'news-card';
                card.setAttribute('data-cat', art.category);
                card.innerHTML = `
                    <div class="card-img-wrapper">
                        <span class="card-badge ${art.badgeClass}">${art.categoryLabel}</span>
                        <img src="${art.thumbnail}" alt="${art.title}" class="card-image" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop';">
                    </div>
                    <div class="card-body">
                        <div class="card-meta">
                            <span><i class="fa-regular fa-calendar"></i> ${art.pubDate}</span>
                            <span><i class="fa-regular fa-user"></i> France 24</span>
                        </div>
                        <h4>${art.title}</h4>
                        <p class="card-excerpt">${art.description}</p>
                        <a href="${art.link}" target="_blank" rel="noopener noreferrer" class="card-link">Lire la suite <i class="fa-solid fa-arrow-right"></i></a>
                    </div>
                `;
                newsListGridContainer.appendChild(card);
            });

            // Appliquer à nouveau le filtre s'il y a un paramètre URL
            const urlParams = new URLSearchParams(window.location.search);
            const initialCat = urlParams.get("cat") || "all";
            if (typeof window.filterCategory === "function") {
                window.filterCategory(initialCat);
            } else {
                document.querySelectorAll(".news-card").forEach(card => {
                    card.style.display = "flex";
                });
            }
        }
    }

    async function loadLiveNews() {
        const featuredCardContainer = document.querySelector('.featured-card');
        const newsGridContainer = document.querySelector('.news-grid');
        const newsListGridContainer = document.querySelector('.news-list-grid');

        if (!featuredCardContainer && !newsGridContainer && !newsListGridContainer) {
            return;
        }

        let articles = [];
        try {
            const rssUrl = encodeURIComponent('https://www.france24.com/fr/monde/rss');
            const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`);
            if (!response.ok) throw new Error("Erreur réseau API");
            const data = await response.json();
            if (data.status === 'ok' && data.items && data.items.length > 0) {
                articles = data.items.map((item, idx) => {
                    const catObj = categories[idx % categories.length];
                    let formattedDate = item.pubDate;
                    try {
                        const d = new Date(item.pubDate.replace(/-/g, "/"));
                        formattedDate = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
                    } catch(e) {}
                    
                    return {
                        title: item.title,
                        link: item.link,
                        thumbnail: item.thumbnail || item.enclosure?.link || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
                        pubDate: formattedDate,
                        description: item.description ? item.description.replace(/<[^>]*>/g, '').trim() : "Lire l'article complet.",
                        category: catObj.id,
                        badgeClass: catObj.badge,
                        categoryLabel: catObj.label
                    };
                });
            } else {
                throw new Error("Format de réponse invalide");
            }
        } catch (err) {
            console.warn("Impossible de charger le flux en direct, chargement des articles réels statiques.", err);
            articles = fallbackArticles;
        }

        renderArticles(articles);
    }

    // Lancer le chargement
    loadLiveNews();
});
