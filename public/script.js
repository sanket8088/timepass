// Store user info and preferences
let userInfo = {
    userName: '',
    nickName: '',
    preferences: []
};

const preferences = {
    style: 'sweet',
    mood: 'romantic',
    spiciness: 'mild'
};

// Check if user has already filled the form
window.addEventListener('DOMContentLoaded', function() {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
        userInfo = JSON.parse(storedUserInfo);
        showMainApp();
    } else {
        document.getElementById('introForm').style.display = 'block';
    }
});

// Handle intro form submission
document.getElementById('userInfoForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const userName = document.getElementById('userName').value.trim();
    const nickName = document.getElementById('nickName').value.trim();
    const selectedPreferences = Array.from(document.querySelectorAll('input[name="preferences"]:checked'))
        .map(cb => cb.value);
    
    userInfo = {
        userName,
        nickName,
        preferences: selectedPreferences
    };
    
    // Save to localStorage
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    
    // Send to server to log
    try {
        await fetch('/api/save-user-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userInfo)
        });
    } catch (error) {
        console.error('Error saving user info:', error);
    }
    
    showMainApp();
});

function showMainApp() {
    document.getElementById('introForm').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    
    // Update greeting with nickname
    if (userInfo.nickName) {
        document.getElementById('greeting').innerHTML = `💕 Hey ${userInfo.nickName}! 💕`;
    }
}

// Handle reset button
document.getElementById('resetBtn').addEventListener('click', function() {
    if (confirm('Are you sure you want to start over? This will clear your information.')) {
        // Clear localStorage
        localStorage.removeItem('userInfo');
        
        // Reset userInfo
        userInfo = {
            userName: '',
            nickName: '',
            preferences: []
        };
        
        // Clear form
        document.getElementById('userInfoForm').reset();
        
        // Show intro form, hide main app
        document.getElementById('mainApp').style.display = 'none';
        document.getElementById('introForm').style.display = 'block';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Handle option button clicks
document.querySelectorAll('.option-btn').forEach(button => {
    button.addEventListener('click', function() {
        const optionType = this.dataset.option;
        const value = this.dataset.value;
        
        // Remove active class from siblings
        const siblings = this.parentElement.querySelectorAll('.option-btn');
        siblings.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Update preferences
        preferences[optionType] = value;
    });
});

// Generate button click handler
document.getElementById('generateBtn').addEventListener('click', async function() {
    const generateBtn = this;
    const loadingSpinner = document.getElementById('loadingSpinner');
    const pickupLineDisplay = document.getElementById('pickupLineDisplay');
    const errorMessage = document.getElementById('errorMessage');
    
    // Hide previous results
    pickupLineDisplay.style.display = 'none';
    errorMessage.style.display = 'none';
    
    // Show loading spinner
    loadingSpinner.style.display = 'block';
    generateBtn.disabled = true;
    
    try {
        const response = await fetch('/api/generate-pickup-line', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...preferences,
                userInfo: userInfo
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Display the pickup line
            document.getElementById('pickupLineText').textContent = data.pickupLine;
            pickupLineDisplay.style.display = 'block';
            
            // Scroll to the result smoothly
            setTimeout(() => {
                pickupLineDisplay.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }, 100);
        } else {
            throw new Error(data.error || 'Failed to generate pickup line');
        }
        
    } catch (error) {
        console.error('Error:', error);
        errorMessage.textContent = error.message || 'Oops! Something went wrong. Please try again.';
        errorMessage.style.display = 'block';
        
        // Scroll to error message
        setTimeout(() => {
            errorMessage.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 100);
    } finally {
        loadingSpinner.style.display = 'none';
        generateBtn.disabled = false;
    }
});

// Add enter key support
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('generateBtn').click();
    }
});

