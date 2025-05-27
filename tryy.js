let cartItems = []; // Initialize an empty array to store cart items

document.querySelectorAll('.viewBtn').forEach(button => {
  button.addEventListener('click', () => {
    const category = button.getAttribute('data-category');
    const name = button.getAttribute('data-name');
    const price = button.getAttribute('data-price');
    const calories = button.getAttribute('data-calories');
    const imgSrc = button.getAttribute('data-img');
    const description = button.getAttribute('data-description');

    const productNameElement = document.getElementById('modalProductName');
    if (productNameElement) {
      // Remove any existing category-specific classes
      productNameElement.classList.remove('crinkles-product-name');

      // Add class if the category is Crinkles
      if (category === 'Crinkles') {
        productNameElement.classList.add('crinkles-product-name');
      }
    }

    document.getElementById('productModalLabel').textContent = category;
    if (productNameElement) {
      productNameElement.textContent = name;
    }
    document.getElementById('modalPrice').textContent = price;
    document.getElementById('modalCalories').textContent = `Calories: ${calories}`;
    document.getElementById('modalImage').src = imgSrc;
    document.getElementById('modalDescription').textContent = description;

    // Basic handler for Add to Cart button
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
      // Remove previous event listener to avoid duplicates
      const newAddToCartBtn = addToCartBtn.cloneNode(true);
      addToCartBtn.parentNode.replaceChild(newAddToCartBtn, addToCartBtn);

      newAddToCartBtn.onclick = () => {
        // Create a product object
        const product = {
          name: name,
          price: price,
          calories: calories,
          imgSrc: imgSrc,
          description: description,
          category: category,
          quantity: 1 // Initialize quantity to 1
        };

        // Add product to cartItems array
        // Check if the product is already in the cart
        const existingItem = cartItems.find(item => item.name === product.name); // Assuming name is unique identifier

        if (existingItem) {
          existingItem.quantity++; // Increment quantity if item exists
        } else {
          cartItems.push(product); // Add new item if it doesn't exist
        }
        console.log('Cart items:', cartItems); // Log cart items for verification

        // Optional: Provide user feedback (e.g., a toast notification)
        alert(`${name} added to cart!`);

        // Hide product modal
        const modalElement = document.getElementById('productModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      };
    }

    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
  });
});

// Add event listener to the cart icon
const cartIcon = document.getElementById('cartIcon');
if (cartIcon) {
  cartIcon.addEventListener('click', () => {
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    const cartModalBody = document.getElementById('cartModalBody');
    const cartTotalElement = document.getElementById('cartTotal');
    const checkoutButton = document.getElementById('checkoutButton');

    // Clear previous content
    if (cartModalBody) {
      cartModalBody.innerHTML = '';

      // Populate modal with cart items
      if (cartItems.length === 0) {
        cartModalBody.innerHTML = '<p style="text-align: center; font-family: \'Poppins Light\', sans-serif;">Your cart is empty.</p>';
        if (cartTotalElement) cartTotalElement.textContent = 'Total: ₱0.00';
        if (checkoutButton) {
          checkoutButton.disabled = true;
          checkoutButton.style.opacity = '0.5';
          checkoutButton.style.cursor = 'not-allowed';
        }
      } else {
        if (checkoutButton) {
          checkoutButton.disabled = false;
          checkoutButton.style.opacity = '1';
          checkoutButton.style.cursor = 'pointer';
        }
        let total = 0;
        cartItems.forEach(item => {
          const itemElement = document.createElement('div');
          itemElement.classList.add('cart-item'); // Add a class for styling
          itemElement.innerHTML = `
            <img src="${item.imgSrc}" alt="${item.name}" style="width: 50px; margin-right: 10px;">
            <div>
              <h5>${item.name}</h5>
              <p>${item.price}</p>
            </div>
            <div class="quantity-control ms-auto">
              <button class="btn btn-sm btn-secondary decrease-quantity">-</button>
              <span class="quantity">${item.quantity}</span>
              <button class="btn btn-sm btn-secondary increase-quantity">+</button>
            </div>
          `;
          cartModalBody.appendChild(itemElement);

          // Add event listeners to quantity buttons
          const decreaseButton = itemElement.querySelector('.decrease-quantity');
          const increaseButton = itemElement.querySelector('.increase-quantity');
          const quantitySpan = itemElement.querySelector('.quantity');

          decreaseButton.addEventListener('click', () => {
            if (item.quantity > 1) {
              item.quantity--;
              quantitySpan.textContent = item.quantity;
              updateCartTotal(); // Update total after decrease
            } else {
              // Remove item if quantity is 1 and decrease is clicked
              cartItems = cartItems.filter(cartItem => cartItem.name !== item.name);
              itemElement.remove(); // Remove the item element from the modal
              updateCartTotal(); // Update total after removing item
              if (cartItems.length === 0 && cartModalBody) {
                cartModalBody.innerHTML = '<p style="text-align: center; font-family: \'Poppins Light\', sans-serif;">Your cart is empty.</p>';
              }
            }
            console.log('Cart items after decrease:', cartItems);
          });

          increaseButton.addEventListener('click', () => {
            item.quantity++;
            quantitySpan.textContent = item.quantity;
            updateCartTotal(); // Update total after increase
            console.log('Cart items after increase:', cartItems);
          });

          // Add price to total (need to parse price string)
          const priceValue = parseFloat(item.price.replace('₱', '').replace(',', '')); // Remove currency symbol and comma if any
          total += priceValue * item.quantity;
        });

        // Display initial total
        if (cartTotalElement) cartTotalElement.textContent = `Total: ₱${total.toFixed(2)}`;
      }
    }

    cartModal.show();
  });
}

// Function to update the cart total display
function updateCartTotal() {
  const cartTotalElement = document.getElementById('cartTotal');
  let total = 0;

  cartItems.forEach(item => {
    const priceValue = parseFloat(item.price.replace('₱', '').replace(',', ''));
    total += priceValue * item.quantity;
  });

  if (cartTotalElement) cartTotalElement.textContent = `Total: ₱${total.toFixed(2)}`;
}

// Add event listener for the checkout button in the cart modal
const checkoutButton = document.getElementById('checkoutButton');
if (checkoutButton) {
  checkoutButton.addEventListener('click', () => {
    // Close the cart modal
    const cartModalElement = document.getElementById('cartModal');
    const cartModal = bootstrap.Modal.getInstance(cartModalElement);
    if (cartModal) {
      cartModal.hide();
    }

    // Open the checkout modal
    const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    const orderSummaryElement = document.getElementById('orderSummary');
    const totalPaymentElement = document.getElementById('totalPayment');
    const productTotalElement = document.getElementById('productTotal');
    const deliveryFee = 50;
    let orderTotal = 0;

    // Populate order summary and calculate order total
    if (orderSummaryElement) {
      orderSummaryElement.innerHTML = ''; // Clear previous summary
      cartItems.forEach(item => {
        const itemSummaryElement = document.createElement('div');
        const priceValue = parseFloat(item.price.replace('₱', '').replace(',', ''));
        const itemTotal = priceValue * item.quantity;
        orderTotal += itemTotal;
        itemSummaryElement.innerHTML = `
          <p>${item.name} (x${item.quantity})</p>
          <p>₱${itemTotal.toFixed(2)}</p>
        `;
        orderSummaryElement.appendChild(itemSummaryElement);
      });
    }

    // Calculate and display totals
    if (productTotalElement) {
      productTotalElement.textContent = `₱${orderTotal.toFixed(2)}`;
    }
    const totalPayment = orderTotal + deliveryFee;
    if (totalPaymentElement) {
      totalPaymentElement.textContent = `₱${totalPayment.toFixed(2)}`;
    }
    document.querySelector('#totalPayment').textContent = `₱${totalPayment.toFixed(2)}`;

    checkoutModal.show();
  });
}

// Add event listener for the place order button in the checkout modal
const placeOrderButton = document.getElementById('placeOrderButton');
if (placeOrderButton) {
  placeOrderButton.addEventListener('click', function() {
    const deliveryAddress = document.getElementById('deliveryAddress').value.trim();
    if (!deliveryAddress) {
        alert('Please enter your delivery address.');
        return;
    }

    // Get the checkout modal instance
    const checkoutModalElement = document.getElementById('checkoutModal');
    const checkoutModal = bootstrap.Modal.getInstance(checkoutModalElement);

    // Show first confirmation message
    const msg = document.createElement('div');
    msg.textContent = 'Your order has been placed successfully!';
    msg.style.fontFamily = 'Poppins Light, sans-serif';
    msg.style.fontSize = '1.1rem';
    msg.style.color = 'hsl(0, 79%, 34%)';
    msg.style.textAlign = 'center';
    msg.style.marginTop = '1.2rem';
    document.querySelector('#checkoutModal .modal-body').appendChild(msg);

    // Add loading spinner
    const spinner = document.createElement('div');
    spinner.className = 'login-loading-spinner';
    document.querySelector('#checkoutModal .modal-body').appendChild(spinner);

    // After 1 second, show processing message
    setTimeout(function() {
        msg.textContent = 'Please wait a moment while we process it. Thank you!';
    }, 1000);

    // Close modal and clear cart after 2 seconds
    setTimeout(function() {
        if (checkoutModal) {
            checkoutModal.hide();
        }
        cartItems = [];
        updateCartTotal();
        document.getElementById('deliveryAddress').value = '';
        document.querySelector('#checkoutModal .modal-body').removeChild(msg);
        document.querySelector('#checkoutModal .modal-body').removeChild(spinner);

        // Show final confirmation message
        const finalMsg = document.createElement('div');
        finalMsg.style.fontFamily = 'Poppins Light, sans-serif';
        finalMsg.style.position = 'fixed';
        finalMsg.style.top = '50%';
        finalMsg.style.left = '50%';
        finalMsg.style.transform = 'translate(-50%, -50%)';
        finalMsg.style.backgroundColor = 'white';
        finalMsg.style.padding = '1.5rem 2rem';
        finalMsg.style.borderRadius = '8px';
        finalMsg.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        finalMsg.style.zIndex = '9999';
        finalMsg.style.minWidth = '300px';
        finalMsg.style.textAlign = 'center';

        // Add close icon
        const closeIcon = document.createElement('span');
        closeIcon.innerHTML = '&times;';
        closeIcon.style.position = 'absolute';
        closeIcon.style.right = '10px';
        closeIcon.style.top = '5px';
        closeIcon.style.fontSize = '1.5rem';
        closeIcon.style.color = '#888';
        closeIcon.style.cursor = 'pointer';
        closeIcon.style.lineHeight = '1';
        closeIcon.onclick = function() {
            document.body.removeChild(finalMsg);
        };
        finalMsg.appendChild(closeIcon);

        // Add message text
        const messageText = document.createElement('div');
        messageText.textContent = 'Thank you for your order!';
        messageText.style.fontSize = '1.1rem';
        messageText.style.color = 'hsl(0, 79%, 34%)';
        messageText.style.marginTop = '0.5rem';
        finalMsg.appendChild(messageText);

        document.body.appendChild(finalMsg);
    }, 2000);
  });
}

// Add event listeners to the red cart icons
document.querySelectorAll('.redcartt').forEach(cartIconImg => {
  cartIconImg.addEventListener('click', (event) => {
    // Find the sibling view button to get product details
    const viewButton = event.target.previousElementSibling;
    if (viewButton && viewButton.classList.contains('viewBtn')) {
      const category = viewButton.getAttribute('data-category');
      const name = viewButton.getAttribute('data-name');
      const price = viewButton.getAttribute('data-price');
      const calories = viewButton.getAttribute('data-calories'); // Keep calories for cart item data if needed
      const imgSrc = viewButton.getAttribute('data-img');
      const description = viewButton.getAttribute('data-description');

      // Create a product object
      const product = {
        name: name,
        price: price,
        calories: calories, // Store calories
        imgSrc: imgSrc,
        description: description,
        category: category,
        quantity: 1 // Initialize quantity to 1
      };

      // Add product to cartItems array
      const existingItem = cartItems.find(item => item.name === product.name); // Assuming name is unique identifier

      if (existingItem) {
        existingItem.quantity++; // Increment quantity if item exists
      } else {
        cartItems.push(product); // Add new item if it doesn't exist
      }

      console.log('Cart items after red cart click:', cartItems); // Log cart items for verification

      // Provide user feedback
      alert(`${name} added to cart!`);
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.querySelector('input[type="search"]');
  const noProductsDiv = document.querySelector('.no-products-found');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const query = this.value.trim().toLowerCase();
      const productSections = document.querySelectorAll('section .container');
      let anyMatch = false;
      productSections.forEach(section => {
        let sectionHasMatch = false;
        section.querySelectorAll('.home_card').forEach(card => {
          const title = card.querySelector('.card-title');
          if (title && title.textContent.toLowerCase().includes(query)) {
            card.parentElement.style.display = '';
            sectionHasMatch = true;
            anyMatch = true;
          } else {
            card.parentElement.style.display = 'none';
          }
        });
        section.parentElement.style.display = sectionHasMatch || query === '' ? '' : 'none';
      });
      const searchBar = searchInput.closest('.searchh');
      let spacer = document.querySelector('.menu-no-products-space');
      if (query === '') {
        productSections.forEach(section => {
          section.parentElement.style.display = '';
          section.querySelectorAll('.home_card').forEach(card => {
            card.parentElement.style.display = '';
          });
        });
        if (noProductsDiv) noProductsDiv.style.display = 'none';
        if (searchBar) searchBar.classList.remove('search-error');
        if (spacer) spacer.remove();
      } else {
        if (noProductsDiv) noProductsDiv.style.display = anyMatch ? 'none' : '';
        if (searchBar) {
          if (!anyMatch) {
            searchBar.classList.add('search-error');
            if (!spacer) {
              spacer = document.createElement('div');
              spacer.className = 'menu-no-products-space';
              noProductsDiv && noProductsDiv.parentElement.appendChild(spacer);
            }
          } else {
            searchBar.classList.remove('search-error');
            if (spacer) spacer.remove();
          }
        }
      }
    });
  }
});

window.toggleMenuCategory = function(category) {
  // Define which sections are pastries and which are drinks
  const pastriesSections = [
    'pastriesSection', // Crinkles
    ...Array.from(document.querySelectorAll('h2')).filter(h2 =>
      ['Crinkles', 'Muffins', 'Cookies'].includes(h2.textContent.trim())
    ).map(h2 => h2.closest('section'))
  ];
  const drinksSections = [
    'drinksSection',
    ...Array.from(document.querySelectorAll('h2')).filter(h2 =>
      ['Caffeinated Drinks', 'Matcha Series', 'Refreshers (Non-Caffeinated)'].includes(h2.textContent.trim())
    ).map(h2 => h2.closest('section'))
  ];
  // Hide/show sections
  if (category === 'pastries') {
    pastriesSections.forEach(sec => {
      if (typeof sec === 'string') sec = document.getElementById(sec);
      if (sec) sec.style.display = '';
    });
    drinksSections.forEach(sec => {
      if (typeof sec === 'string') sec = document.getElementById(sec);
      if (sec) sec.style.display = 'none';
    });
  } else {
    drinksSections.forEach(sec => {
      if (typeof sec === 'string') sec = document.getElementById(sec);
      if (sec) sec.style.display = '';
    });
    pastriesSections.forEach(sec => {
      if (typeof sec === 'string') sec = document.getElementById(sec);
      if (sec) sec.style.display = 'none';
    });
  }
};

// Add event listener for the back to cart button
const backToCartButton = document.getElementById('backToCart');
if (backToCartButton) {
  backToCartButton.addEventListener('click', () => {
    // Close the checkout modal
    const checkoutModalElement = document.getElementById('checkoutModal');
    const checkoutModal = bootstrap.Modal.getInstance(checkoutModalElement);
    if (checkoutModal) {
      checkoutModal.hide();
    }

    // Open the cart modal
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    cartModal.show();
  });
}

// Handle back to cart button click
document.getElementById('backToCart').addEventListener('click', function() {
    checkoutModal.hide();
    cartModal.show();
});
