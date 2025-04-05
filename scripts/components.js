

class Dropdown {
    constructor(selector, onChange) {
        this.dropdown = document.querySelector(selector)
        this.toggleButton = this.dropdown.querySelector('.dropdown-toggle')
        this.onChange = onChange

        this.defaultText = this.toggleButton.querySelector("span").innerText

        this.menu = this.dropdown.querySelector('.dropdown-menu')
        
        this.selectItem = this.selectItem.bind(this)
        this.toggleButton.addEventListener('click', this.toggleDropdown.bind(this))
        document.addEventListener('click', this.closeDropdown.bind(this))

        this.lists = this.dropdown.querySelectorAll('li')
        this.lists.forEach(e => {
            e.addEventListener("click", () => this.selectItem(e))}
        )

        this.value = ""

        this.dropDownInput = this.dropdown.querySelector(".dropdown-input")

    }
  
    toggleDropdown() {
        this.menu.style.display = (this.menu.style.display === 'block') ? 'none' : 'block'
    }

    selectItem(ele){

        const selectedInput = this.toggleButton.querySelector(".dropdown-select-text")
        const selectIcon =  this.toggleButton.querySelector(".dropdown-select-icon")

        this.value = ele.querySelector(".dropdown-text").innerText.trim()

        if (selectIcon && ele.querySelector(".dropdown-menu-icon")){
            selectIcon.style.visibility = ""
            selectIcon.setAttribute("src", ele.querySelector(".dropdown-menu-icon").src)
            selectIcon.setAttribute("alt", ele.innerText)
        }else{
            selectIcon.style.visibility = "hidden"
        }

        selectedInput.innerText = ele.querySelector(".dropdown-text").innerText.trim()
        
        if(this.dropDownInput)
            this.dropDownInput.value = this.value

        if (this.onChange){
            this.onChange(this.value)
        }

        this.closeDropdown()

    }

    closeDropdown(event) {
        if (event === undefined || !this.dropdown.contains(event.target)) {
            this.menu.style.display = 'none'
        }
        document.removeEventListener('click', this.closeDropdown.bind(this))
    }
}

class CheatingDetection {
    constructor(target) {
        this.sessionArea = document.querySelector(target);
        this.sessionContainer = this.sessionArea.querySelector("#session-container");
        this.sessionStatus = document.getElementById("session-status");
        this.suspiciousPopup = document.getElementById("suspicious-popup");
        this.detectionLog = [];
        
        // Bind methods
        this.addFeedback = this.addFeedback.bind(this);
        this.detectCheating = this.detectCheating.bind(this);
        this.updateSessionStatus = this.updateSessionStatus.bind(this);
    }
    
    updateSessionStatus(message) {
        this.sessionStatus.innerText = message;
    }
    
    addFeedback(msg) {
        if (this.detectionLog.length === 0) {
            this.sessionContainer.innerHTML = "";
        }
        this.detectionLog.push(msg);
        
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("tw-w-fit", "tw-ml-auto", "tw-p-2", "tw-rounded-xl", "tw-bg-gray-100", "dark:tw-bg-[#171717]");
        messageDiv.innerText = msg;
        
        const feedbackElement = document.createElement("div");
        feedbackElement.classList.add("tw-w-full", "tw-flex", "tw-p-2");
        feedbackElement.appendChild(messageDiv);
        
        this.sessionContainer.appendChild(feedbackElement);
        this.sessionContainer.scrollTop = this.sessionContainer.scrollHeight;

        // After adding feedback, check for suspicious behavior
        setTimeout(this.detectCheating, 100);
    }
    
    resetFeedback() {
        // Clear the detection log array
        this.detectionLog = [];
        // Clear all feedback messages from the session container
        this.sessionContainer.innerHTML = "";
        // Optionally, reset the session status message
        this.updateSessionStatus("Interview in progress...");
        this.suspiciousPopup.style.transform = "scale(0)";

      }

    detectCheating() {
        // For demo purposes, if more than 3 entries are added, we flag suspicious activity.
        if (this.detectionLog.length > 3) {
            this.updateSessionStatus("Suspicious activity detected!");
            this.showPopup();
        } else {
            this.updateSessionStatus("Interview in progress...");
        }
    }
    
    showPopup() {
        this.suspiciousPopup.style.transform = "scale(1)";
     }
}

// Example functions to handle sidebar button and popup dismissal
function joinInterview() {
    alert("Joining interview...");
    // Insert logic to join the interview session
}

function hidePopup() {
    document.getElementById("suspicious-popup").style.transform = "scale(0)";
}

