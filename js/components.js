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
                
                // If this is the contact-form component, customize it based on data attributes
                if (componentName === 'contact-form') {
                    customizeContactForm(element);
                    if (typeof window.initEmailForms === 'function') {
                        window.initEmailForms();
                    }
                }
            } else {
                console.error(`Failed to load component: ${componentName}`);
            }
        } catch (error) {
            console.error(`Error loading component ${componentName}:`, error);
        }
    }
}

function customizeContactForm(element) {
    // Get customization attributes
    const label = element.getAttribute('data-label');
    const buttonText = element.getAttribute('data-button-text');
    
    // Update the label if provided
    if (label) {
        const labelElement = element.querySelector('[data-form-label]');
        if (labelElement) {
            labelElement.textContent = label;
        }
    }
    
    // Update the button text if provided
    if (buttonText) {
        const buttonElement = element.querySelector('[data-form-button-text]');
        if (buttonElement) {
            buttonElement.textContent = buttonText;
        }
    }
} 