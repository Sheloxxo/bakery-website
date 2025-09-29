// Example bakery menu data (could also be a separate JSON file)
const menuData = [
    {
      name: "Baguette",
      price: 3.0,
      image: "https://images.unsplash.com/photo-1608198093002-1a5c14f2bdf2"
    },
    {
      name: "Pretzel",
      price: 2.5,
      image: "https://images.unsplash.com/photo-1608197951274-bb80d68bfb9b"
    },
    {
      name: "Chocolate Cake",
      price: 12.0,
      image: "https://images.unsplash.com/photo-1608032075811-34e54e1e6e60"
    },
    {
      name: "Whole Wheat Bread",
      price: 4.0,
      image: "https://images.unsplash.com/photo-1608198202043-0882f8b5cb3f"
    }
  ];
  
  // Render menu items only if menu container exists
  document.addEventListener("DOMContentLoaded", () => {
    const menuContainer = document.querySelector(".menu-grid");
    if (menuContainer) {
      menuData.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("item");
  
        card.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <h3>${item.name}</h3>
          <p>$${item.price.toFixed(2)}</p>
        `;
  
        menuContainer.appendChild(card);
      });
    }
  });
  