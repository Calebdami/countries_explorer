document.addEventListener("DOMContentLoaded", () => {
    // 1. ANIMATION D'ENTRÉE DES DRAPEAUX FLOTTANTS
    gsap.fromTo(".floating-item", 
        { 
            scale: 0, 
            opacity: 0,
            y: 50 
        }, 
        { 
            scale: 1, 
            opacity: 0.6, 
            y: 0, 
            duration: 1.2, 
            stagger: 0.1, 
            ease: "back.out(1.5)",
            onComplete: startFloatingAnimations
        }
    );

    // 2. TIMELINE D'ENTRÉE POUR LA CARTE CENTRALE
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.fromTo(".glass-card", 
        { scale: 0.85, opacity: 0, y: 60 },
        { scale: 1, opacity: 1, y: 0, duration: 1.4, ease: "power4.out" }
    );

    tl.fromTo(".globe-icon",
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 1, ease: "back.out(1.7)" },
        "-=0.8"
    );

    // Animation séquencée du titre par mot
    tl.fromTo(".main-title .word",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "back.out(1.7)" },
        "-=0.6"
    );

    tl.fromTo(".tagline",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.6"
    );

    tl.fromTo(".description",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.5"
    );

    tl.fromTo(".feature-item",
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.12, ease: "power3.out" },
        "-=0.6"
    );

    tl.fromTo(".cta-wrapper",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.5"
    );

    tl.fromTo(".landing-footer",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        "-=0.6"
    );

    // 3. ANIMATION DE FLOTTEMENT CONTINU (YOYO INFINI)
    function startFloatingAnimations() {
        const items = document.querySelectorAll(".floating-item");
        items.forEach((item, index) => {
            // Mouvement de translation aléatoire
            gsap.to(item, {
                y: "random(-25, 25)",
                x: "random(-20, 20)",
                rotation: "random(-20, 20)",
                duration: "random(4, 7)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: index * 0.15
            });
        });
    }

    // 4. TRANSITION DE SORTIE AU CLIC SUR LE BOUTON
    const startBtn = document.getElementById("start-btn");
    startBtn.addEventListener("click", () => {
        // Timeline de sortie
        const exitTl = gsap.timeline({
            onComplete: () => {
                // Redirection vers la page de l'explorateur
                window.location.href = "./countriesExplorer.html";
            }
        });

        // Ajouter la classe de transition pour activer le fondu au noir
        document.body.classList.add("transition-active");

        exitTl.to(".glass-card", {
            scale: 0.9,
            opacity: 0,
            y: -30,
            duration: 0.6,
            ease: "power3.in"
        });

        exitTl.to(".landing-footer", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power2.in"
        }, "-=0.5");

        exitTl.to(".floating-item", {
            scale: 0.5,
            opacity: 0,
            x: (i, el) => {
                // Éjecter les éléments vers les extérieurs
                const rect = el.getBoundingClientRect();
                return rect.left < window.innerWidth / 2 ? -150 : 150;
            },
            y: (i, el) => {
                const rect = el.getBoundingClientRect();
                return rect.top < window.innerHeight / 2 ? -150 : 150;
            },
            duration: 0.6,
            stagger: 0.05,
            ease: "power2.in"
        }, "-=0.5");
    });
});
