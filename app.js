document.addEventListener("DOMContentLoaded", function () {

    // Helper function to set up input icon listener
    function setupInputIconListener(inputElement, icon) {
        inputElement.addEventListener("input", function () {
            const inputText = inputElement.value.trim();
            icon.style.color = inputText ? "#359553" : "#707681";
        });
    }

    // Array of input elements and corresponding icons
    const inputs = [
        { element: "webhookUrl", icon: ".webhook-link-icon" },
        { element: "avatarInput", icon: ".avatar-icon" },
        { element: "avatarUrlInput", icon: ".avatar-url-icon" },
        { element: "authorUrl", icon: ".author-link-icon" },
        { element: "authorImageUrl", icon: ".author-image-icon" },
        { element: "titleInput", icon: ".title-icon" },
        { element: "descriptionInput", icon: ".description-icon" },
        { element: "contentUrlInput", icon:".contentUrl-icon" },
        { element: "contentColorInput", icon: ".contentColor-icon" },
        { element: "imageUrlInput", icon: ".image-url-icon" }
    ];

    // Set up input icon listeners
    inputs.forEach(input => {
        const inputElement = document.getElementById(input.element);
        const icon = document.querySelector(input.icon);
        if (inputElement) {
            setupInputIconListener(inputElement, icon);
        }
    });

    // Helper function to set up accordion
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
        { button: "image-accordion-button", content: "accordionContent-image", chevron: "content-chevronIcon" }
    ];

    accordions.forEach(acc => {
        setupAccordion(acc.button, acc.content, acc.chevron);
    });

    // Helper function to set up character limit
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

    // Set up character limits
    const characterLimits = [
        { input: "avatarInput", counter: "avatarCharCounter", maxChars: 80 },
        { input: "message-content", counter: "messageCharCounter", maxChars: 2000 },
        { input: "authorInput", counter: "authorCharCounter", maxChars: 256 },
        { input: "titleInput", counter: "titleCharCounter", maxChars: 256 },
        { input: "descriptionInput", counter: "descriptionCharCounter", maxChars: 4096 },
    ];

    characterLimits.forEach(limit => {
        setupCharacterLimit(limit.input, limit.counter, limit.maxChars);
    });

    // Helper function to set up text area auto-resize
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
    ["message-content", "avatarUrlInput", "authorInput", "titleInput", "descriptionInput"].forEach(area => {
        setupTextAreaAutoResize(area);
    });

    // Update Component Count
    function updateComponentsText() {
        const imageContainer = document.querySelector(".image-container");
        const componentsText = document.getElementById("imageUrlCharCounter");
    
        if (imageContainer && componentsText) {
            componentsText.textContent = `${imageContainer.childElementCount}/4 Components`;
        }
    }
    
    const addComponentButton = document.getElementById("addComponentButton");
    
    addComponentButton && addComponentButton.addEventListener("click", function () {
        const imageContainer = document.querySelector(".image-container");
    
        if (imageContainer && imageContainer.childElementCount < 4) {
            const newComponentContainer = document.createElement("div");
            newComponentContainer.className = "relative flex items-center w-full mb-5";
    
            const newInput = document.createElement("input");
            newInput.type = "text";
            newInput.className = "image-url-input shadow flex-1 p-5 pl-16 pr-4 rounded-lg bg-[#363A43] text-[#ADB5C2] outline-none";
            newInput.placeholder = "Image URL";
            newInput.autocomplete = "off";
    
            const newIcon = document.createElement("i");
            newIcon.className = "image-url-icon absolute top-1/2 transform -translate-y-1/2 left-5 text-[#707681] text-2xl fa-solid fa-image";
    
            newComponentContainer.appendChild(newInput);
            newComponentContainer.appendChild(newIcon);
    
            imageContainer.appendChild(newComponentContainer);
    
            updateComponentsText();
        }
    });
    
    const removeComponentButton = document.getElementById("deleteComponentButton");
    
    removeComponentButton && removeComponentButton.addEventListener("click", function () {
        const imageContainer = document.querySelector(".image-container");
        const lastComponent = imageContainer?.lastElementChild;
    
        lastComponent && imageContainer.childElementCount > 1 && (lastComponent.remove(), updateComponentsText());
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
            "avatarUrlInput",
            "titleInput",
            "descriptionInput",
            "contentUrlInput",
            "contentColorInput",
            "imageUrlInput"
        ];
    
        // Check if all required fields exist
        const missingField = requiredFields.find(field => !document.getElementById(field));
        if (missingField) {
            alert(`Element with ID '${missingField}' not found.`);
            return;
        }
    
        // Check if at least one of the required fields has a non-empty value
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
            "imageUrlInput"
        ];
    
        // Check if all embed fields exist
        const missingEmbedField = embedFields.find(field => !document.getElementById(field));
        if (missingEmbedField) {
            alert(`Element with ID '${missingEmbedField}' not found.`);
            return;
        }
    
        const hasEmbedField = embedFields.some(field => document.getElementById(field).value.trim() !== "");
    
        if (hasEmbedField) {
            const contentColorInput = document.getElementById("contentColorInput").value;
            const imageUrl = document.getElementById("imageUrlInput").value;
    
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
                    url: imageUrl,
                },
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
        })        
        .catch(error => {
            console.error('Error sending message:', error);
        });
    });    
});
