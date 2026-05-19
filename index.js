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
    
    transitionLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute("href");
            if (href && href !== "#") {
                e.preventDefault();
                // Activation du rideau noir
                document.body.classList.add("transition-active");
                setTimeout(() => {
                    window.location.href = href;
                }, 600);
            }
        });
    });
});
