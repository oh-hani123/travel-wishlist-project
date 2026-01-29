// ======================
// TRAVEL WISHLIST - SIMPLE VERSION
// ======================

// Our destinations array
let destinations = [];

// ===== PAGE LOAD =====
window.onload = function() {
    // Set copyright year on all pages
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Only run home page functions on home page
    if (document.getElementById('destinationsList')) {
        loadFromStorage();
        showAllDestinations();
        updateStats();
    }
};

// ===== ADD DESTINATION =====
function addDestination() {
    // Get values from inputs
    const place = document.getElementById('placeName').value.trim();
    const country = document.getElementById('countryName').value.trim();
    const status = document.querySelector('input[name="status"]:checked').value;
    
    // Check if empty
    if (!place || !country) {
        alert('Please enter both place and country!');
        return;
    }
    
    // Create new destination
    const newDest = {
        id: Date.now(), // Simple ID
        name: place,
        country: country,
        status: status
    };
    
    // Add to array
    destinations.push(newDest);
    
    // Save to browser storage
    saveToStorage();
    
    // Update display
    showAllDestinations();
    updateStats();
    
    // Clear form
    document.getElementById('placeName').value = '';
    document.getElementById('countryName').value = '';
    document.querySelector('input[value="want"]').checked = true;
    
    console.log('Added:', newDest);
}

// ===== SHOW DESTINATIONS =====
function showAllDestinations() {
    const container = document.getElementById('destinationsList');
    if (!container) return;
    
    // Get search and filter values
    const searchText = document.getElementById('searchBox') ? 
        document.getElementById('searchBox').value.toLowerCase() : '';
    const filterType = document.getElementById('statusFilter') ? 
        document.getElementById('statusFilter').value : 'all';
    
    // Filter destinations
    let filtered = destinations.filter(dest => {
        const matchesSearch = dest.name.toLowerCase().includes(searchText) || 
                             dest.country.toLowerCase().includes(searchText);
        const matchesFilter = filterType === 'all' || dest.status === filterType;
        return matchesSearch && matchesFilter;
    });
    
    // Clear container
    container.innerHTML = '';
    
    // Check if empty
    if (filtered.length === 0) {
        container.innerHTML = '<p class="empty-message">No destinations found.</p>';
        return;
    }
    
    // Create cards
    filtered.forEach(dest => {
        const card = document.createElement('div');
        card.className = `destination-card ${dest.status}`;
        card.innerHTML = `
            <h3>${dest.name}</h3>
            <p>📍 ${dest.country}</p>
            <p><strong>Status:</strong> ${dest.status === 'want' ? '🌟 Want to Visit' : '✅ Visited'}</p>
            <button class="delete-btn" onclick="deleteDestination(${dest.id})">Delete</button>
        `;
        container.appendChild(card);
    });
}

// ===== DELETE DESTINATION =====
function deleteDestination(id) {
    if (confirm('Delete this destination?')) {
        destinations = destinations.filter(dest => dest.id !== id);
        saveToStorage();
        showAllDestinations();
        updateStats();
    }
}

// ===== FILTER DESTINATIONS =====
function filterDestinations() {
    showAllDestinations();
}

// ===== UPDATE STATISTICS =====
function updateStats() {
    const total = destinations.length;
    const wantCount = destinations.filter(d => d.status === 'want').length;
    const visitedCount = destinations.filter(d => d.status === 'visited').length;
    
    document.getElementById('totalCount').textContent = total;
    document.getElementById('wantCount').textContent = wantCount;
    document.getElementById('visitedCount').textContent = visitedCount;
}

// ===== STORAGE FUNCTIONS =====
function saveToStorage() {
    localStorage.setItem('travelDestinations', JSON.stringify(destinations));
}

function loadFromStorage() {
    const saved = localStorage.getItem('travelDestinations');
    if (saved) {
        destinations = JSON.parse(saved);
    } else {
        // Default destinations if empty
        destinations = [
            { id: 1, name: "Paris", country: "France", status: "want" },
            { id: 2, name: "Tokyo", country: "Japan", status: "visited" }
        ];
        saveToStorage();
    }
}

// ===== CONTACT FORM =====
function submitForm() {
    // Get values
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const message = document.getElementById('userMessage').value.trim();
    const result = document.getElementById('formResult');
    
    // Clear previous errors
    document.getElementById('nameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('messageError').textContent = '';
    
    let isValid = true;
    
    // Validate name
    if (name === '') {
        document.getElementById('nameError').textContent = 'Name is required';
        isValid = false;
    }
    
    // Validate email
    if (email === '') {
        document.getElementById('emailError').textContent = 'Email is required';
        isValid = false;
    } else if (!email.includes('@')) {
        document.getElementById('emailError').textContent = 'Enter valid email';
        isValid = false;
    }
    
    // Validate message
    if (message === '') {
        document.getElementById('messageError').textContent = 'Message is required';
        isValid = false;
    }
    
    // If valid, show success
    if (isValid) {
        result.textContent = '✅ Message sent successfully!';
        result.style.color = 'green';
        
        // Clear form
        document.getElementById('contactForm').reset();
        
        // Clear message after 3 seconds
        setTimeout(() => {
            result.textContent = '';
        }, 3000);
    } else {
        result.textContent = '❌ Please fix errors above';
        result.style.color = 'red';
    }
}