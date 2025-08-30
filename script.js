// Cart functionality
let cart = [];

// Add to cart function
function addToCart(artworkId, artworkName, price, image) {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.id === artworkId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: artworkId,
            name: artworkName,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    updateCartUI();
    saveCartToLocalStorage();
    
    // Show notification
    showNotification(`${artworkName} added to cart!`, 'success');
}

// Remove from cart function
function removeFromCart(artworkId) {
    cart = cart.filter(item => item.id !== artworkId);
    updateCartUI();
    saveCartToLocalStorage();
    showNotification('Item removed from cart!', 'info');
}

// Update quantity in cart
function updateQuantity(artworkId, newQuantity) {
    const item = cart.find(item => item.id === artworkId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(artworkId);
        } else {
            item.quantity = newQuantity;
            updateCartUI();
            saveCartToLocalStorage();
        }
    }
}

// Update cart UI
function updateCartUI() {
    // Update cart count in header
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'inline' : 'none';
    }
    
    // Update cart total
    const cartTotal = document.getElementById('cart-total');
    if (cartTotal) {
        const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
}

// Save cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}

// Thumbnail switching for artwork detail page
function switchThumbnail(thumbnailElement) {
    // Remove active class from all thumbnails
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    
    // Add active class to clicked thumbnail
    thumbnailElement.classList.add('active');
    
    // Update main image
    const mainImage = document.querySelector('.main-image');
    mainImage.src = thumbnailElement.src;
    mainImage.alt = thumbnailElement.alt;
}

// Form validation for signup form
function validateSignupForm() {
    const form = document.querySelector('.signup-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form elements
        const firstName = document.getElementById('first-name');
        const lastName = document.getElementById('last-name');
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirm-password');
        const userType = document.getElementById('user-type');
        const termsCheckbox = document.querySelector('input[type="checkbox"]');
        
        // Reset error messages
        clearErrors();
        
        let isValid = true;
        
        // Validate first name
        if (!firstName.value.trim()) {
            showError(firstName, 'First name is required');
            isValid = false;
        }
        
        // Validate last name
        if (!lastName.value.trim()) {
            showError(lastName, 'Last name is required');
            isValid = false;
        }
        
        // Validate email
        if (!email.value.trim()) {
            showError(email, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate password
        if (!password.value) {
            showError(password, 'Password is required');
            isValid = false;
        } else if (password.value.length < 6) {
            showError(password, 'Password must be at least 6 characters');
            isValid = false;
        }
        
        // Validate confirm password
        if (!confirmPassword.value) {
            showError(confirmPassword, 'Please confirm your password');
            isValid = false;
        } else if (password.value !== confirmPassword.value) {
            showError(confirmPassword, 'Passwords do not match');
            isValid = false;
        }
        
        // Validate user type
        if (!userType.value) {
            showError(userType, 'Please select a user type');
            isValid = false;
        }
        
        // Validate terms checkbox
        if (!termsCheckbox.checked) {
            showError(termsCheckbox, 'You must agree to the Terms of Service and Privacy Policy');
            isValid = false;
        }
        
        // If form is valid, submit it (in a real application, you would send the data to a server)
        if (isValid) {
            alert('Account created successfully! Redirecting to login...');
            // Here you would typically redirect to login page or send data to server
            // window.location.href = 'login.html';
        }
    });
    
    // Helper function to show error messages
    function showError(element, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        element.parentNode.appendChild(errorDiv);
        element.classList.add('error');
    }
    
    // Helper function to clear error messages
    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
        
        const errorInputs = document.querySelectorAll('.error');
        errorInputs.forEach(input => input.classList.remove('error'));
    }
    
    // Helper function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Mobile menu functionality
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav ul');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !nav.contains(e.target)) {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
        
        // Close menu on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load cart from localStorage
    loadCartFromLocalStorage();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Add event listeners for add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            const price = parseInt(button.getAttribute('data-price'));
            const image = button.getAttribute('data-image');
            
            addToCart(id, name, price, image);
            
            // Visual feedback
            button.textContent = 'Added!';
            button.classList.add('added');
            setTimeout(() => {
                button.textContent = 'Add to Cart';
                button.classList.remove('added');
            }, 2000);
        });
    });
    
    // Add smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add hover effects for artwork cards
    const artworkCards = document.querySelectorAll('.artwork-card');
    artworkCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Show welcome message on first visit
    if (!localStorage.getItem('visited')) {
        setTimeout(() => {
            showNotification('Welcome to Painting Auctions! 🎨', 'info');
        }, 1000);
        localStorage.setItem('visited', 'true');
    }

    // Initialize hero slider if present
    initHeroSlider();

    // Initialize countdowns if present
    initCountdowns();

    // Make artist cards clickable to open profile
    initArtistCardClicks();

    // Initialize contact form storage
    initContactFormStorage();

    // Initialize auction room functionality
    initAuctionRoom();
});

// Export functions for global access
window.PaintingAuctions = {
    addToCart,
    removeFromCart,
    updateQuantity,
    showNotification
};

// Hero slider implementation
function initHeroSlider() {
    const slidesContainer = document.querySelector('.hero-slides');
    if (!slidesContainer) return;
    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    const prevBtn = document.querySelector('.hero-nav.prev');
    const nextBtn = document.querySelector('.hero-nav.next');
    const dots = Array.from(document.querySelectorAll('.hero-dot'));

    let currentIndex = 0;
    let autoTimer = null;

    function showSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        currentIndex = (index + slides.length) % slides.length;
        slides[currentIndex].classList.add('active');
        if (dots[currentIndex]) dots[currentIndex].classList.add('active');
    }

    function next() { showSlide(currentIndex + 1); }
    function prev() { showSlide(currentIndex - 1); }

    function startAuto() {
        stopAuto();
        autoTimer = setInterval(next, 5000);
    }
    function stopAuto() {
        if (autoTimer) clearInterval(autoTimer);
        autoTimer = null;
    }

    // Initialize
    showSlide(0);
    startAuto();

    // Events
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.getAttribute('data-index')) || 0;
            showSlide(idx);
            startAuto();
        });
    });
}

// Countdown timer for elements with data-end-time
function initCountdowns() {
    const countdownBlocks = document.querySelectorAll('[data-end-time]');
    if (!countdownBlocks.length) return;

    function updateAllCountdowns() {
        const now = new Date().getTime();
        countdownBlocks.forEach(block => {
            let endIso = block.getAttribute('data-end-time');
            let endTime = new Date(endIso).getTime();

            // If invalid or in the past, set to 2 hours from now
            if (!endIso || isNaN(endTime) || endTime <= now) {
                const twoHoursLater = new Date(now + 2 * 60 * 60 * 1000);
                endTime = twoHoursLater.getTime();
                block.setAttribute('data-end-time', twoHoursLater.toISOString());
            }
            const diff = Math.max(0, endTime - now);

            const seconds = Math.floor(diff / 1000) % 60;
            const minutes = Math.floor(diff / (1000 * 60)) % 60;
            const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));

            const targetValue = block.querySelector('.timer-value, .countdown');
            if (targetValue) {
                const pad = (n) => String(n).padStart(2, '0');
                let text = '';
                if (days > 0) {
                    text = `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
                } else {
                    text = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
                }
                targetValue.textContent = text;
            }

            // Optional: when finished, disable bid controls within the same section
            if (diff === 0) {
                const form = block.closest('.auction-details, .auction-interface')?.querySelector('form');
                if (form) {
                    const btn = form.querySelector('button[type="submit"]');
                    if (btn) {
                        btn.disabled = true;
                        btn.textContent = 'Auction Ended';
                    }
                }
            }
        });
    }

    updateAllCountdowns();
    setInterval(updateAllCountdowns, 1000);
}

// Make artist cards clickable
function initArtistCardClicks() {
    const artistCards = document.querySelectorAll('.artist-card');
    if (!artistCards.length) return;
    artistCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            window.location.href = 'artist-profile.html';
        });
    });
}

// Contact form: save message to localStorage
function initContactFormStorage() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name')?.value?.trim() || '';
        const email = document.getElementById('email')?.value?.trim() || '';
        const subject = document.getElementById('subject')?.value?.trim() || '';
        const message = document.getElementById('message')?.value?.trim() || '';

        const newEntry = {
            id: 'msg_' + Date.now(),
            name,
            email,
            subject,
            message,
            createdAt: new Date().toISOString()
        };

        const existing = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        existing.push(newEntry);
        localStorage.setItem('contactMessages', JSON.stringify(existing));

        showNotification('Message sent! We will get back to you soon.', 'success');
        form.reset();
    });
}

// Initialize auction room functionality
function initAuctionRoom() {
    // Initialize countdown timers
    initCountdowns();
    
    // Handle bid form submissions
    const bidForms = document.querySelectorAll('.bid-form');
    bidForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const bidInput = form.querySelector('input[type="number"]');
            const currentBidElement = form.closest('.auction-details')?.querySelector('.current-bid-amount');
            const currentBid = parseInt(currentBidElement?.textContent.replace('$', '') || '0');
            const bidAmount = parseInt(bidInput.value);
            
            if (bidAmount <= currentBid) {
                showNotification('Bid must be higher than current bid!', 'error');
                return;
            }
            
            // Update current bid display
            if (currentBidElement) {
                currentBidElement.textContent = `$${bidAmount}`;
            }
            
            // Add bid to history (temporary - will reset on page refresh)
            const bidHistory = form.closest('.auction-details')?.querySelector('.bid-history .bids, .bid-history');
            if (bidHistory) {
                const newBid = document.createElement('div');
                newBid.className = 'bid-item';
                newBid.innerHTML = `
                    <div class="bidder">You</div>
                    <div>
                        <span class="bid-amount">$${bidAmount}</span>
                        <span class="bid-time">Just now</span>
                    </div>
                `;
                
                // Insert at the top of bid history
                if (bidHistory.firstChild) {
                    bidHistory.insertBefore(newBid, bidHistory.firstChild);
                } else {
                    bidHistory.appendChild(newBid);
                }
            }
            
            // Update form minimum bid
            bidInput.min = bidAmount + 5;
            bidInput.placeholder = `Minimum $${bidAmount + 5}`;
            bidInput.value = '';
            
            // Update form data attribute
            form.setAttribute('data-current-bid', bidAmount);
            
            showNotification(`Bid placed successfully! $${bidAmount}`, 'success');
        });
    });
    
    // Handle add to cart buttons in auction room
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            const image = this.getAttribute('data-image');
            
            addToCart(id, name, price, image);
        });
    });
    
    // Reset auction room to original state on page load
    // This ensures the page returns to its original state after refresh
    const resetAuctionRoom = () => {
        // Reset current bid to original value
        const currentBidElements = document.querySelectorAll('.current-bid-amount');
        currentBidElements.forEach(element => {
            if (element.textContent.includes('$')) {
                const originalBid = element.getAttribute('data-original-bid') || '450';
                element.textContent = `$${originalBid}`;
            }
        });
        
        // Reset bid form minimum values
        const bidInputs = document.querySelectorAll('.bid-form input[type="number"]');
        bidInputs.forEach(input => {
            const originalMin = input.getAttribute('data-original-min') || '475';
            input.min = originalMin;
            input.placeholder = `Minimum $${originalMin}`;
        });
        
        // Reset form data attributes
        const bidForms = document.querySelectorAll('.bid-form');
        bidForms.forEach(form => {
            const originalBid = form.getAttribute('data-original-current-bid') || '450';
            form.setAttribute('data-current-bid', originalBid);
        });
    };
    
    // Call reset function on initialization
    resetAuctionRoom();
}