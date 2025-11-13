// Main JavaScript for ZHIMPA ZHIMPA with Authentication

// Clear any existing login data on page load
localStorage.removeItem('isLoggedIn');
localStorage.removeItem('currentUser');

// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname.split('/').pop();
    
    console.log('Current page:', currentPage);
    console.log('Is logged in:', isLoggedIn);
    
    // Pages that don't require authentication
    const publicPages = ['login.html', 'signup.html'];
    
    // If not logged in and trying to access protected page, redirect to login
    if (!isLoggedIn && !publicPages.includes(currentPage)) {
        console.log('Redirecting to login...');
        window.location.href = 'login.html';
        return false;
    }
    
    // If logged in and on login/signup page, redirect to home
    if (isLoggedIn && (currentPage === 'login.html' || currentPage === 'signup.html')) {
        console.log('Redirecting to home...');
        window.location.href = 'index.html';
        return true;
    }
    
    return isLoggedIn;
}

// Get current user
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication first
    const isLoggedIn = checkAuth();
    
    // Update UI based on login status
    if (isLoggedIn) {
        updateUIForLoggedInUser();
    }
    
    // Initialize any interactive elements
    initRecipeFilters();
    initReviewForm();
    initNewsletterForm();
    initShareForm();
    initLoginForm();
    initSignupForm();
    initContactForm();
    initDiscussionForm();
    
    // Set current year in footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
});

// Update UI for logged in user
function updateUIForLoggedInUser() {
    const currentUser = getCurrentUser();
    const userMenu = document.getElementById('user-menu');
    const authButtons = document.getElementById('auth-buttons');
    
    if (userMenu) {
        userMenu.style.display = 'block';
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = currentUser.name || 'User';
        }
    }
    
    if (authButtons) {
        authButtons.style.display = 'none';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Recipe Filter Functionality
function initRecipeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const recipeCards = document.querySelectorAll('.recipe-card');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                // Show/hide recipe cards based on filter
                recipeCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
}

// Review Form Submission
function initReviewForm() {
    const reviewForm = document.getElementById('review-form');
    
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!checkAuth()) return;
            
            // Get form values
            const name = document.getElementById('review-name').value;
            const title = document.getElementById('review-title').value;
            const ratingInput = document.querySelector('input[name="rating"]:checked');
            const review = document.getElementById('review-text').value;
            
            if (!ratingInput) {
                alert('Please select a rating');
                return;
            }
            
            const rating = ratingInput.value;
            
            // Create new review element
            const reviewContainer = document.getElementById('reviews-container');
            const newReview = document.createElement('div');
            newReview.className = 'review-card';
            
            const today = new Date();
            const dateString = today.toISOString().split('T')[0];
            
            newReview.innerHTML = `
                <div class="review-header">
                    <div class="review-author">${name}</div>
                    <div class="review-date">${dateString}</div>
                </div>
                <div class="review-rating">${'★'.repeat(rating)}${'☆'.repeat(5-rating)}</div>
                <h4>${title || 'Great recipe!'}</h4>
                <p>${review}</p>
            `;
            
            // Add new review to the top
            reviewContainer.insertBefore(newReview, reviewContainer.firstChild);
            
            // Reset form
            reviewForm.reset();
            
            // Show success message
            alert('Thank you for your review!');
        });
    }
}

// Newsletter Form Submission
function initNewsletterForm() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (email) {
                // In a real app, you would send this to a server
                alert(`Thank you for subscribing with ${email}!`);
                this.reset();
            }
        });
    });
}

// Share Recipe Form
function initShareForm() {
    const shareForm = document.getElementById('share-recipe-form');
    
    if (shareForm) {
        shareForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!checkAuth()) return;
            
            // Get form values
            const title = document.getElementById('recipe-title').value;
            const time = document.getElementById('recipe-time').value;
            const difficulty = document.getElementById('recipe-difficulty').value;
            const type = document.getElementById('recipe-type').value;
            const image = document.getElementById('recipe-image').value;
            const ingredients = document.getElementById('recipe-ingredients').value;
            const steps = document.getElementById('recipe-steps').value;
            
            // In a real app, you would send this data to a server
            alert(`Recipe "${title}" submitted successfully!`);
            
            // Reset form
            shareForm.reset();
        });
    }
}

// Login Form
function initLoginForm() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Simple validation - in real app, check against server
            if (email && password) {
                // For demo purposes, accept any email/password
                const user = {
                    name: email.split('@')[0],
                    email: email
                };
                
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                alert('Login successful!');
                // Redirect to home page
                window.location.href = 'index.html';
            } else {
                alert('Please fill in all fields');
            }
        });
    }
}

// Signup Form
function initSignupForm() {
    const signupForm = document.getElementById('signup-form');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm').value;
            
            // Basic validation
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            if (!name || !email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            // Create user account
            const user = {
                name: name,
                email: email
            };
            
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            alert(`Account created for ${name}!`);
            
            // Redirect to home page
            window.location.href = 'index.html';
        });
    }
}

// Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const subject = document.getElementById('contact-subject').value;
            const message = document.getElementById('contact-message').value;
            
            // In a real app, you would send this data to a server
            alert(`Thank you for your message, ${name}! We'll get back to you soon.`);
            
            // Reset form
            contactForm.reset();
        });
    }
}

// Discussion Form
function initDiscussionForm() {
    const discussionForm = document.getElementById('discussion-form');
    
    if (discussionForm) {
        discussionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!checkAuth()) return;
            
            const name = document.getElementById('user-name').value;
            const message = document.getElementById('message').value;
            
            // Create new discussion element
            const discussionContainer = document.getElementById('discussion-container');
            const newMessage = document.createElement('div');
            newMessage.className = 'review-card';
            
            newMessage.innerHTML = `
                <div class="review-header">
                    <div class="review-author">${name}</div>
                    <div class="review-date">Just now</div>
                </div>
                <p>${message}</p>
            `;
            
            // Add new message to the top
            discussionContainer.insertBefore(newMessage, discussionContainer.firstChild);
            
            // Reset form
            discussionForm.reset();
            
            // Remove "No messages yet" text if it exists
            const noMessages = discussionContainer.querySelector('p');
            if (noMessages && noMessages.textContent.includes('No messages yet')) {
                noMessages.remove();
            }
        });
    }
}

// Save Recipe Button
document.addEventListener('click', function(e) {
    if (e.target && e.target.textContent === 'Save') {
        e.preventDefault();
        if (!checkAuth()) return;
        alert('Recipe saved to your favorites!');
    }
});