// Cart functionality
class Cart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('cartItems')) || [];
    this.maxQuantity = 20;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateCartDisplay();
  }

  setupEventListeners() {
    // Cart icon click
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
      cartIcon.addEventListener('click', () => this.toggleCart());
    }

    // Cart close button
    const cartClose = document.getElementById('cartClose');
    if (cartClose) {
      cartClose.addEventListener('click', () => this.closeCart());
    }

    // Close cart when clicking outside
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
      cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
          this.closeCart();
        }
      });
    }

    // Add to cart buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-to-cart')) {
        e.preventDefault();
        const name = e.target.dataset.name;
        const price = parseFloat(e.target.dataset.price);
        const image = e.target.dataset.image;
        this.addItem(name, price, image);
      }
    });

    // Quantity controls
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('quantity-increase')) {
        const itemId = e.target.dataset.itemId;
        this.increaseQuantity(itemId);
      } else if (e.target.classList.contains('quantity-decrease')) {
        const itemId = e.target.dataset.itemId;
        this.decreaseQuantity(itemId);
      } else if (e.target.classList.contains('remove-item')) {
        const itemId = e.target.dataset.itemId;
        this.removeItem(itemId);
      }
    });

    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => this.checkout());
    }
  }

  addItem(name, price, image) {
    const existingItem = this.items.find(item => item.name === name);
    
    if (existingItem) {
      if (existingItem.quantity >= this.maxQuantity) {
        this.showError(`Maximum quantity of ${this.maxQuantity} reached for ${name}`);
        return;
      }
      existingItem.quantity += 1;
    } else {
      this.items.push({
        id: Date.now().toString(),
        name,
        price,
        image,
        quantity: 1
      });
    }
    
    this.saveCart();
    this.updateCartDisplay();
    this.showSuccess(`${name} added to cart!`);
  }

  increaseQuantity(itemId) {
    const item = this.items.find(item => item.id === itemId);
    if (item) {
      if (item.quantity >= this.maxQuantity) {
        this.showError(`Maximum quantity of ${this.maxQuantity} reached`);
        return;
      }
      item.quantity += 1;
      this.saveCart();
      this.updateCartDisplay();
    }
  }

  decreaseQuantity(itemId) {
    const item = this.items.find(item => item.id === itemId);
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
        this.saveCart();
        this.updateCartDisplay();
      }
    }
  }

  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
    this.saveCart();
    this.updateCartDisplay();
  }

  updateCartDisplay() {
    this.updateCartCount();
    this.updateCartItems();
    this.updateCartTotal();
  }

  updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
      const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
      cartCount.textContent = totalItems;
      cartCount.classList.toggle('hidden', totalItems === 0);
    }
  }

  updateCartItems() {
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartFooter = document.getElementById('cartFooter');
    
    if (!cartItems) return;

    if (this.items.length === 0) {
      cartItems.innerHTML = '<div class="cart-empty" id="cartEmpty"><p>Your cart is empty</p></div>';
      cartFooter.style.display = 'none';
      return;
    }

    cartItems.innerHTML = this.items.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
          <h4 class="cart-item-name">${item.name}</h4>
          <p class="cart-item-price">$${item.price.toFixed(2)}</p>
        </div>
        <div class="cart-item-controls">
          <button class="quantity-btn quantity-decrease" data-item-id="${item.id}">-</button>
          <span class="quantity-display">${item.quantity}</span>
          <button class="quantity-btn quantity-increase" data-item-id="${item.id}">+</button>
          <button class="remove-item" data-item-id="${item.id}">Remove</button>
        </div>
      </div>
    `).join('');

    cartFooter.style.display = 'block';
  }

  updateCartTotal() {
    const cartTotal = document.getElementById('cartTotal');
    if (cartTotal) {
      const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      cartTotal.textContent = total.toFixed(2);
    }
  }

  toggleCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
      cartModal.classList.toggle('show');
    }
  }

  closeCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
      cartModal.classList.remove('show');
    }
  }

  saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(this.items));
  }

  checkout() {
    if (this.items.length === 0) {
      this.showError('Your cart is empty!');
      return;
    }
    
    // For demo purposes, just show an alert
    const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Thank you for your order! Total: $${total.toFixed(2)}\n\nThis is a demo - no actual payment will be processed.`);
    
    // Clear cart after checkout
    this.items = [];
    this.saveCart();
    this.updateCartDisplay();
    this.closeCart();
  }

  showError(message) {
    this.showMessage(message, 'error');
  }

  showSuccess(message) {
    this.showMessage(message, 'success');
  }

  showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.cart-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `cart-message ${type === 'error' ? 'error-message' : 'success-message'}`;
    messageDiv.textContent = message;
    
    const cartItems = document.getElementById('cartItems');
    if (cartItems) {
      cartItems.insertBefore(messageDiv, cartItems.firstChild);
      
      // Auto remove after 3 seconds
      setTimeout(() => {
        if (messageDiv.parentNode) {
          messageDiv.remove();
        }
      }, 3000);
    }
  }
}

// Success message styles
const successStyle = document.createElement('style');
successStyle.textContent = `
  .success-message {
    background-color: #e8f5e8;
    color: #2e7d32;
    padding: 10px;
    border-radius: 4px;
    margin: 10px 0;
    text-align: center;
    font-size: 0.9rem;
  }
`;
document.head.appendChild(successStyle);

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const backToTopBtn = document.createElement('button');

  // Initialize cart
  new Cart();

  // Lazy-load images (skip brand/logo)
  document.querySelectorAll('img').forEach((img) => {
    const isLogo = img.classList.contains('logo-img');
    if (!isLogo && !img.loading) {
      img.loading = 'lazy';
    }
  });

  // Navbar shadow on scroll
  const updateNavbarShadow = () => {
    if (!navbar) return;
    if (window.scrollY > 2) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  };

  // Back to top button
  backToTopBtn.id = 'backToTop';
  backToTopBtn.setAttribute('aria-label', 'Back to top');
  backToTopBtn.title = 'Back to top';
  backToTopBtn.textContent = '↑';
  document.body.appendChild(backToTopBtn);

  const updateBackToTop = () => {
    if (window.scrollY > 120) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  };

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Init and listeners
  updateNavbarShadow();
  updateBackToTop();
  window.addEventListener('scroll', () => {
    updateNavbarShadow();
    updateBackToTop();
  }, { passive: true });
});


