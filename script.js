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

// Auction Room functionality
function initAuctionRoom() {
    const bidForm = document.querySelector('.bid-form');
    const bidAmountInput = document.getElementById('bid-amount');
    const currentBidDisplay = document.querySelector('.current-bid-amount');
    const bidHistoryContainer = document.querySelector('.bid-items-container');
    const bidCountDisplay = document.querySelector('.bid-count');
    const refreshBidsBtn = document.querySelector('.refresh-bids-btn');
    const clearBidsBtn = document.querySelector('.clear-bids-btn');
    
    if (!bidForm || !bidAmountInput || !currentBidDisplay || !bidHistoryContainer || !bidCountDisplay) {
        console.log('Auction room elements not found');
        return;
    }

    // Load existing bid history from localStorage
    let bidHistory = JSON.parse(localStorage.getItem('auctionBidHistory') || '[]');
    
    // Initialize with default bids if none exist
    if (bidHistory.length === 0) {
        bidHistory = [
            {
                id: 'bid_1',
                bidder: 'User123',
                amount: 450,
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                timeAgo: '2 hours ago'
            },
            {
                id: 'bid_2',
                bidder: 'ArtLover',
                amount: 425,
                timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
                timeAgo: '3 hours ago'
            },
            {
                id: 'bid_3',
                bidder: 'CollectorPro',
                amount: 400,
                timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                timeAgo: '5 hours ago'
            },
            {
                id: 'bid_4',
                bidder: 'ArtEnthusiast',
                amount: 375,
                timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                timeAgo: '6 hours ago'
            }
        ];
        localStorage.setItem('auctionBidHistory', JSON.stringify(bidHistory));
    }

    // Update minimum bid amount based on current highest bid
    function updateMinimumBid() {
        const currentHighest = Math.max(...bidHistory.map(bid => bid.amount));
        const minBid = currentHighest + 25;
        bidAmountInput.min = minBid;
        bidAmountInput.placeholder = `Minimum $${minBid}`;
        return minBid;
    }

    // Update bid count display
    function updateBidCount() {
        const count = bidHistory.length;
        bidCountDisplay.textContent = `(${count} bid${count !== 1 ? 's' : ''})`;
    }

    // Update bid history display
    function updateBidHistoryDisplay() {
        // Sort bids by amount (highest first)
        const sortedBids = [...bidHistory].sort((a, b) => b.amount - a.amount);
        
        // Update current bid display
        if (sortedBids.length > 0) {
            const highestBid = sortedBids[0];
            currentBidDisplay.textContent = `$${highestBid.amount}`;
            
            // Update form data attribute
            bidForm.setAttribute('data-current-bid', highestBid.amount);
            
            // Add animation to current bid
            currentBidDisplay.style.animation = 'none';
            setTimeout(() => {
                currentBidDisplay.style.animation = 'pulse 0.6s ease-in-out';
            }, 10);
        } else {
            // No bids yet
            currentBidDisplay.textContent = '$0';
            bidForm.setAttribute('data-current-bid', '0');
        }

        // Clear existing bid items
        bidHistoryContainer.innerHTML = '';

        // Show message if no bids
        if (sortedBids.length === 0) {
            const noBidsMessage = document.createElement('div');
            noBidsMessage.className = 'no-bids-message';
            noBidsMessage.innerHTML = `
                <div class="no-bids-icon">🎨</div>
                <div class="no-bids-text">No bids yet</div>
                <div class="no-bids-subtext">Be the first to place a bid!</div>
            `;
            bidHistoryContainer.appendChild(noBidsMessage);
        } else {
            // Add bid items
            sortedBids.forEach((bid, index) => {
                const bidItem = document.createElement('div');
                bidItem.className = 'bid-item';
                
                // Add special styling for the highest bid
                if (index === 0) {
                    bidItem.classList.add('highest-bid');
                }
                
                bidItem.innerHTML = `
                    <div class="bidder">${bid.bidder}</div>
                    <div>
                        <span class="bid-amount">$${bid.amount}</span>
                        <span class="bid-time">${bid.timeAgo}</span>
                    </div>
                `;
                
                // Add entrance animation
                bidItem.style.opacity = '0';
                bidItem.style.transform = 'translateY(20px)';
                bidHistoryContainer.appendChild(bidItem);
                
                // Animate in with delay
                setTimeout(() => {
                    bidItem.style.transition = 'all 0.3s ease';
                    bidItem.style.opacity = '1';
                    bidItem.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }

        // Update bid count
        updateBidCount();
        
        // Update minimum bid
        updateMinimumBid();
    }

    // Calculate time ago
    function getTimeAgo(timestamp) {
        const now = new Date();
        const bidTime = new Date(timestamp);
        const diffMs = now - bidTime;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }

    // Update timestamps for existing bids
    function updateTimestamps() {
        bidHistory.forEach(bid => {
            bid.timeAgo = getTimeAgo(bid.timestamp);
        });
        updateBidHistoryDisplay();
    }

    // Simulate other users bidding (for demo purposes)
    function simulateOtherBids() {
        if (Math.random() < 0.3) { // 30% chance every 30 seconds
            const currentHighest = Math.max(...bidHistory.map(bid => bid.amount));
            const newBidAmount = currentHighest + Math.floor(Math.random() * 50) + 25;
            
            const bidderNames = ['ArtCollector', 'PaintLover', 'GalleryGoer', 'ArtEnthusiast', 'CreativeSoul', 'CanvasAdmirer'];
            const randomBidder = bidderNames[Math.floor(Math.random() * bidderNames.length)];
            
            const newBid = {
                id: 'bid_' + Date.now(),
                bidder: randomBidder,
                amount: newBidAmount,
                timestamp: new Date().toISOString(),
                timeAgo: 'Just now'
            };
            
            bidHistory.unshift(newBid);
            localStorage.setItem('auctionBidHistory', JSON.stringify(bidHistory));
            updateBidHistoryDisplay();
            
            // Show notification for other bids
            showNotification(`${randomBidder} just bid $${newBidAmount}!`, 'info');
        }
    }

    // Handle bid form submission
    bidForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const bidAmount = parseInt(bidAmountInput.value);
        const minBid = updateMinimumBid();
        
        if (bidAmount < minBid) {
            showNotification(`Bid must be at least $${minBid}`, 'error');
            bidAmountInput.style.borderColor = '#f44336';
            bidAmountInput.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                bidAmountInput.style.borderColor = '#e1e5e9';
                bidAmountInput.style.animation = 'none';
            }, 500);
            return;
        }

        // Generate random bidder name for demo purposes
        const bidderNames = ['ArtCollector', 'PaintLover', 'GalleryGoer', 'ArtEnthusiast', 'CreativeSoul', 'CanvasAdmirer'];
        const randomBidder = bidderNames[Math.floor(Math.random() * bidderNames.length)];

        // Create new bid
        const newBid = {
            id: 'bid_' + Date.now(),
            bidder: randomBidder,
            amount: bidAmount,
            timestamp: new Date().toISOString(),
            timeAgo: 'Just now'
        };

        // Add to bid history
        bidHistory.unshift(newBid);
        
        // Save to localStorage
        localStorage.setItem('auctionBidHistory', JSON.stringify(bidHistory));
        
        // Update display
        updateBidHistoryDisplay();
        
        // Clear input
        bidAmountInput.value = '';
        
        // Show success notification
        showNotification(`Bid of $${bidAmount} placed successfully!`, 'success');
        
        // Add success animation to the form
        bidForm.style.animation = 'successPulse 0.6s ease-in-out';
        setTimeout(() => {
            bidForm.style.animation = 'none';
        }, 600);
    });

    // Add input validation feedback
    bidAmountInput.addEventListener('input', function() {
        const value = parseInt(this.value);
        const minBid = updateMinimumBid();
        
        if (value >= minBid) {
            this.style.borderColor = '#4caf50';
        } else {
            this.style.borderColor = '#e1e5e9';
        }
    });

    // Add refresh button functionality
    if (refreshBidsBtn) {
        refreshBidsBtn.addEventListener('click', function() {
            this.style.animation = 'spin 1s linear';
            setTimeout(() => {
                this.style.animation = 'none';
            }, 1000);
            
            updateTimestamps();
            showNotification('Bid history refreshed!', 'info');
        });
    }

    // Add clear bids button functionality
    if (clearBidsBtn) {
        clearBidsBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all bid history for this auction?')) {
                bidHistory = [];
                localStorage.setItem('auctionBidHistory', JSON.stringify(bidHistory));
                updateBidHistoryDisplay();
                showNotification('All bid history cleared!', 'info');
            }
        });
    }

    // Initialize display
    updateBidHistoryDisplay();
    
    // Update timestamps every minute
    setInterval(updateTimestamps, 60000);
    
    // Simulate other bids every 30 seconds
    setInterval(simulateOtherBids, 30000);
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        @keyframes successPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .highest-bid {
            background: linear-gradient(135deg, #6a11cb, #2575fc) !important;
            color: white !important;
        }
        
        .highest-bid .bidder,
        .highest-bid .bid-amount,
        .highest-bid .bid-time {
            color: white !important;
        }
    `;
    document.head.appendChild(style);
}