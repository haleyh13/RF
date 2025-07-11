// Replace 'YOUR_PLACE_ID' with your actual Google Place ID
const PLACE_ID = ' ChIJ19mrsSKFXjkRIxsWDyZusAw RATNAM APARTMENT, Vasna, Ahmedabad, Gujarat 380007';
const API_KEY = 'YOUR_GOOGLE_API_KEY';

function loadGoogleReviews() {
    const container = document.getElementById('google-reviews-container');
    
    // Fetch reviews from Google Places API
    fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${ChIJ19mrsSKFXjkRIxsWDyZusAw RATNAM APARTMENT, Vasna, Ahmedabad, Gujarat 380007}&fields=reviews&key=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            if (data.result && data.result.reviews) {
                const reviews = data.result.reviews;
                
                // Display reviews
                reviews.forEach(review => {
                    const reviewCard = createReviewCard(review);
                    container.appendChild(reviewCard);
                });
            }
        })
        .catch(error => {
            console.error('Error loading Google Reviews:', error);
            container.innerHTML = '<p class="text-center">Unable to load reviews at this time.</p>';
        });
}

function createReviewCard(review) {
    const card = document.createElement('div');
    card.className = 'col-md-4';
    
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    
    card.innerHTML = `
        <div class="google-review-card">
            <div class="reviewer-info">
                <img src="${review.profile_photo_url || 'img/default-avatar.png'}" alt="${review.author_name}">
                <div>
                    <h6 class="reviewer-name">${review.author_name}</h6>
                    <span class="review-date">${new Date(review.time * 1000).toLocaleDateString()}</span>
                </div>
            </div>
            <div class="review-rating">
                ${stars}
            </div>
            <p class="review-text">${review.text}</p>
        </div>
    `;
    
    return card;
}

// Load reviews when the page loads
document.addEventListener('DOMContentLoaded', loadGoogleReviews); 