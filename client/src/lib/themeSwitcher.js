// Once HTML content is loaded in
document.addEventListener('DOMContentLoaded', () => {
    // Identify the button by its ID
    const toggleButton = document.getElementById('theme-toggle');

    // Identifies the <html> element which Pico uses to apply the theme
    const htmlElement = document.documentElement;

    // Unique key to store the user's theme preference
    const localStorageKey = 'myPicoTheme';


    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);

        // Sets theme in local storage so it persists
        localStorage.setItem(localStorageKey, theme);
    }

    function getTheme() {
        return htmlElement.getAttribute('data-theme');
    }

    const savedTheme = localStorage.getItem(localStorageKey);
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        // Check user OS preferences
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setTheme(prefersDark ? 'dark' : 'light');
    }

    toggleButton.addEventListener('click', () => {
        const currentTheme = getTheme();
        if (currentTheme === 'light') {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    })
})