document.addEventListener('DOMContentLoaded', function() {
    // Load all components with data-component attribute
    loadComponents();
});

async function loadComponents() {
    const componentElements = document.querySelectorAll('[data-component]');
    
    for (const element of componentElements) {
        const componentName = element.getAttribute('data-component');
        try {
            const response = await fetch(`/components/${componentName}.html`);
            if (response.ok) {
                const html = await response.text();
                element.innerHTML = html;
                
                // If this is the header component, initialize navigation
                if (componentName === 'header') {
                    // Trigger a custom event that index.js can listen for
                    const event = new CustomEvent('headerLoaded');
                    document.dispatchEvent(event);
                }
            } else {
                console.error(`Failed to load component: ${componentName}`);
            }
        } catch (error) {
            console.error(`Error loading component ${componentName}:`, error);
        }
    }
} 