document.addEventListener("DOMContentLoaded", async function () {
    const saveButton = document.getElementById("saveBtn");
    const tagInput = document.getElementById("tagInput");
    const status = document.getElementById("status");

    function resetStatus() {
        setTimeout(() => {
            status.innerText = "";
            status.className = "";
        }, 5000);
    }

    function showSuccessMessage(message) {
        status.innerText = message;
        status.classList.add("mt-4", "text-green-600", "dark:text-green-400");
        resetStatus();
    }

    function showErrorMessage(message) {
        status.innerText = message;
        status.classList.add("mt-4", "text-red-600", "dark:text-red-400");
        resetStatus();
    }

    saveButton.addEventListener("click", async function () {
        try {
            const tabs = await browser.tabs.query({
                active: true,
                currentWindow: true,
            });
            const currentTab = tabs[0];
            const currentUrl = currentTab.url;
            const tagValue = tagInput.value;

            const firstTab = tabs?.[0];

            if (!firstTab?.url) {
                showErrorMessage("Error: This URL is invalid!");
                return;
            }

            const response = await fetch("http://127.0.0.1:8000/api/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url: currentUrl,
                    tags: tagValue,
                }),
            });

            await response.json();

            showSuccessMessage("Url saved!");
        } catch (error) {
            showErrorMessage("API Error : Something went wrong.");
        }
    });

    document.getElementById("open-settings").addEventListener("click", function () {
        const pageUrl = browser.runtime.getURL("/views/settings.html");
        browser.tabs.create({url: pageUrl});
    });
});