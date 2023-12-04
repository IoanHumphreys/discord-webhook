// Setup Icons
function setupInputIconListener(inputElement, icon) {
    inputElement.addEventListener("input", function () {
        const inputText = inputElement.value.trim();
        icon.style.color = inputText ? "#359553" : "#707681";
    });
}

document.addEventListener("DOMContentLoaded", function () {

    // Inputs
    const inputs = [
        { element: "webhookUrl", icon: ".webhook-link-icon" },
        { element: "avatarInput", icon: ".avatar-icon" },
        { element: "avatarUrlInput", icon: ".avatar-url-icon" },
        { element: "authorInput", icon: ".author-icon" },
        { element: "authorUrl", icon: ".author-link-icon" },
        { element: "authorImageUrl", icon: ".author-image-icon" },
        { element: "titleInput", icon: ".title-icon" },
        { element: "descriptionInput", icon: ".description-icon" },
        { element: "contentUrlInput", icon:".contentUrl-icon" },
        { element: "contentColorInput", icon: ".contentColor-icon" },
        { element: "imageUrlInput", icon: ".image-url-icon" },
        { element: "clonedFieldNameInput", icon: ".clonedFieldName-icon" },
        { element: "clonedFieldValueInput", icon: ".clonedFieldValue-icon" },
        { element: "footerInput", icon: ".footer-icon" },
        { element: "footerIconUrl", icon: ".footer-icon-url" }
    ];

    // Icon Icon Listener
    inputs.forEach(input => {
        const inputElement = document.getElementById(input.element);
        const icon = document.querySelector(input.icon);
        if (inputElement) {
            setupInputIconListener(inputElement, icon);
        }
    });

    // Setup Accordion
    function setupAccordion(buttonId, contentId, chevronId) {
        const button = document.getElementById(buttonId);
        const content = document.getElementById(contentId);
        if (button) {
            button.addEventListener("click", function () {
                content.classList.toggle("hidden");
                const chevronIcon = button.querySelector(`#${chevronId}`);
                if (chevronIcon) {
                    chevronIcon.classList.toggle("fa-chevron-up");
                    chevronIcon.classList.toggle("fa-chevron-down");
                }
            });
        }
    }

    // Accordions
    const accordions = [
        { button: "accordion-button", content: "accordionContent", chevron: "chevronIcon" },
        { button: "embed-accordion-button", content: "accordionContent-embed", chevron: "embed-chevronIcon" },
        { button: "author-accordion-button", content: "accordionContent-author", chevron: "author-chevronIcon" },
        { button: "content-accordion-button", content: "accordionContent-content", chevron: "content-chevronIcon" },
        { button: "image-accordion-button", content: "accordionContent-image", chevron: "content-chevronIcon" },
        { button: "fields-accordion-button", content: "accordionContent-fields", chevron: "content-chevronIcon" },
        { button: "clonedField-accordion-button", content: "accordionContent-clonedField", chevron: "content-chevronIcon" },
        { button: "footer-accordion-button", content: "accordionContent-footer", chevron: "content-chevronIcon" },
    ];

    // Loop Through
    accordions.forEach(acc => {
        setupAccordion(acc.button, acc.content, acc.chevron);
    });

    // Char Limit
    function setupCharacterLimit(inputId, counterId, maxChars) {
        const input = document.getElementById(inputId);
        const counter = document.getElementById(counterId);
        if (input) {
            input.addEventListener("input", function () {
                let inputText = input.value;
                if (inputText.length > maxChars) {
                    inputText = inputText.substring(0, maxChars);
                }
                input.value = inputText;
                const charCount = inputText.length;
                counter.textContent = `${charCount}/${maxChars}`;
                counter.style.color = charCount >= maxChars / 2 ? "#FFA500" : "";
            });
        }
    }

    // Setup Char Limit
    const characterLimits = [
        { input: "avatarInput", counter: "avatarCharCounter", maxChars: 80 },
        { input: "message-content", counter: "messageCharCounter", maxChars: 2000 },
        { input: "authorInput", counter: "authorCharCounter", maxChars: 256 },
        { input: "titleInput", counter: "titleCharCounter", maxChars: 256 },
        { input: "descriptionInput", counter: "descriptionCharCounter", maxChars: 4096 },
        { input: "clonedFieldNameInput", counter: "clonedFieldNameCharCounter", maxChars: 256 },
        { input: "clonedFieldValueInput", counter: "clonedFieldValueCharCounter", maxChars: 1024 },
        { input: "footerInput", counter: "footerCharCounter", maxChars: 2048 },
    ];

    // Loop Through
    characterLimits.forEach(limit => {
        setupCharacterLimit(limit.input, limit.counter, limit.maxChars);
    });

    // Setup AutoResize
    function setupTextAreaAutoResize(textAreaId) {
        const textArea = document.getElementById(textAreaId);
        if (textArea) {
            textArea.addEventListener("input", function () {
                textArea.style.height = "auto";
                textArea.style.height = (textArea.scrollHeight) + "px";
            });
        }
    }

    // TextArea Resize
    ["message-content", "avatarUrlInput", "authorInput", "titleInput", "descriptionInput", "clonedFieldNameInput", "clonedFieldValueInput"].forEach(area => {
        setupTextAreaAutoResize(area);
    });

    // Send Webhook
    document.getElementById("sendMessageButton").addEventListener("click", function () {
        const requiredFields = [
            "webhookUrl",
            "avatarUrlInput",
            "message-content",
            "authorInput",
            "authorUrl",
            "authorImageUrl",
            "titleInput",
            "descriptionInput",
            "contentUrlInput",
            "contentColorInput",
            "imageUrlInput",
            "clonedFieldNameInput",
            "clonedFieldValueInput",
            "footerInput",
            "footerIconUrl"
        ];

        // Check if all required fields exist
        const missingField = requiredFields.find(field => !document.getElementById(field));
        if (missingField) {
            alert(`Element with ID '${missingField}' not found.`);
            return;
        }

        // Checks if one is empty
        const hasRequiredField = requiredFields.some(field => document.getElementById(field).value.trim() !== "");

        if (!hasRequiredField) {
            alert("Please provide at least one of the required fields.");
            return;
        }

        const payload = {
            content: document.getElementById("message-content").value,
            embeds: []
        };

        const embedFields = [
            "authorInput",
            "authorUrl",
            "authorImageUrl", 
            "avatarUrlInput",
            "titleInput",
            "descriptionInput",
            "contentUrlInput",
            "contentColorInput",
            "imageUrlInput",
            "clonedFieldNameInput",
            "clonedFieldValueInput",
            "footerInput",
            "footerIconUrl"
        ];

        const hasEmbedField = embedFields.some(field => document.getElementById(field).value.trim() !== "");

        if (hasEmbedField) {
            const contentColorInput = document.getElementById("contentColorInput").value;

            payload.embeds.push({
                title: document.getElementById("titleInput").value,
                description: document.getElementById("descriptionInput").value,
                url: document.getElementById("contentUrlInput").value,
                color: parseInt(contentColorInput.replace(/^#/, ''), 16),
                author: {
                    name: document.getElementById("authorInput").value,
                    url: document.getElementById("authorUrl").value,
                    icon_url: document.getElementById("authorImageUrl").value
                },
                image: {
                    url: document.getElementById("imageUrlInput").value,
                },
                fields: [
                    {
                        name: document.getElementById("clonedFieldNameInput").value,
                        value: document.getElementById("clonedFieldValueInput").value
                    }
                ],
                footer: {
                    text: document.getElementById("footerInput").value,
                    icon_url: document.getElementById("footerIconUrl").value,
                }
            });           
        }

        const webhookUrl = document.getElementById("webhookUrl").value;
        if (!webhookUrl) {
            alert("Please provide a webhook URL.");
            return;
        }

        fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        .then(response => {
            console.log('Response:', response);
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            // Check if the response has JSON content
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json();
            } else {
                return Promise.resolve({});
            }
        })
        .then(data => console.log('Discord Response:', data))
        .catch(error => {
            console.error('Error sending message:', error);
    
            // Print the response if available
            if (error.response) {
                error.response.json().then(data => console.error('Discord API Response:', data));
            }
        });   
    });  
});
