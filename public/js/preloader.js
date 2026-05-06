/**
 * Hotel Palmeira - Preloader Logic
 * Ensures images and critical assets (Maps) are loaded before revealing the UI.
 */

document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const iframe = document.querySelector('.map-frame iframe');
    const images = document.querySelectorAll('img');
    
    let assetsLoaded = 0;
    const totalAssets = images.length + (iframe ? 1 : 0);
    
    function checkAssets() {
        assetsLoaded++;
        if (assetsLoaded >= totalAssets) {
            removePreloader();
        }
    }

    function removePreloader() {
        if (preloader) {
            preloader.classList.add('loaded');
            // Allow interactions once hidden
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 800);
        }
    }

    // 1. Track Images
    if (images.length === 0) {
        if (!iframe) removePreloader();
    } else {
        images.forEach(img => {
            if (img.complete) {
                checkAssets();
            } else {
                img.addEventListener('load', checkAssets);
                img.addEventListener('error', checkAssets); // Continue even if one fails
            }
        });
    }

    // 2. Track Iframe (Location)
    if (iframe) {
        iframe.addEventListener('load', checkAssets);
    }

    // 3. Global Fallback
    window.addEventListener('load', () => {
        // Ensure preloader is removed eventually even if listeners missed something
        setTimeout(removePreloader, 500); 
    });

    // 4. Force reveal after 6 seconds (Safety net)
    setTimeout(removePreloader, 6000);
});
