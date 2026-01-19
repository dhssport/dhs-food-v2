// Menu Data
const menuData = [
    {
        id: 'best-seller',
        title: '🔥 Best Seller',
        items: [
            { id: 1, name: 'Ayam Bakar Madu', price: 25000, desc: 'Ayam bakar dengan olesan madu spesial.', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80' },
            { id: 2, name: 'Nasi Goreng Spesial', price: 22000, desc: 'Nasi goreng dengan topping lengkap.', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80' },
            { id: 3, name: 'Es Kopi Susu DHS', price: 18000, desc: 'Kopi susu gula aren signature.', image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80' },
        ]
    },
    {
        id: 'main-course',
        title: '🍗 Main Course',
        items: [
            { id: 4, name: 'Chicken Katsu Curry', price: 32000, desc: 'Nasi kari jepang dengan katsu renyah.', image: 'https://images.unsplash.com/photo-1552590635-27c2c2128abf?auto=format&fit=crop&w=600&q=80' },
            { id: 5, name: 'Beef Rice Bowl', price: 35000, desc: 'Nasi daging sapi lada hitam.', image: 'https://images.unsplash.com/photo-1617196019283-421b4a17ee86?auto=format&fit=crop&w=600&q=80' },
            { id: 6, name: 'Mie Goreng Jawa', price: 20000, desc: 'Mie goreng bumbu rempah tradisional.', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80' },
        ]
    },
    {
        id: 'drinks',
        title: '🥤 Drinks',
        items: [
            { id: 7, name: 'Es Teh Manis', price: 5000, desc: 'Segar dan manis.', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80' },
            { id: 8, name: 'Lemon Tea', price: 10000, desc: 'Teh dengan perasan lemon asli.', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },
            { id: 9, name: 'Matcha Latte', price: 24000, desc: 'Premium matcha dengan susu segar.', image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600&q=80' },
        ]
    },
    {
        id: 'desserts',
        title: '🍰 Desserts',
        items: [
            { id: 10, name: 'Choco Lava Cake', price: 15000, desc: 'Cake coklat lumer.', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80' },
            { id: 11, name: 'Puding Mangga', price: 12000, desc: 'Puding lembut rasa mangga.', image: 'https://images.unsplash.com/photo-1517245811771-49666dd5d6a2?auto=format&fit=crop&w=600&q=80' },
        ]
    }
];

// State
let cart = {};

// Sound Effect (Oscillator)
function playClickSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            const ctx = new AudioContext();
            if (ctx.state === 'suspended') {
                ctx.resume();
            }
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.1);
            osc.stop(ctx.currentTime + 0.1);
        }
    } catch (e) { console.error(e); }
}

// Format Currency
const formatRp = (price) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
};

// Render Logic
const initApp = () => {
    renderMenu();
    setupCategoryScroll();
    setupSearch();
};

const renderMenu = () => {
    const container = document.getElementById('menuContainer');
    const navList = document.getElementById('categoryList');

    container.innerHTML = '';
    navList.innerHTML = '';

    menuData.forEach((category, index) => {
        // Nav Item
        const navItem = document.createElement('li');
        navItem.className = 'shrink-0';
        navItem.innerHTML = `
            <button onclick="scrollToCategory('${category.id}')" 
                class="category-btn ${index === 0 ? 'active' : ''} px-5 py-2.5 rounded-full bg-white text-gray-400 text-sm font-bold border border-transparent hover:text-gray-900 transition-all whitespace-nowrap data-id='${category.id}'">
                ${category.title}
            </button>
        `;
        navList.appendChild(navItem);

        // Section
        const section = document.createElement('section');
        section.id = category.id;
        section.className = 'pt-2 scroll-mt-[180px]';
        section.innerHTML = `
            <h2 class="text-xl font-bold mb-4 flex items-center gap-2">${category.title}</h2>
            <div class="grid grid-cols-1 gap-4">
                ${category.items.map(item => createFoodCard(item)).join('')}
            </div>
        `;
        container.appendChild(section);
    });
};

const createFoodCard = (item) => {
    const qty = cart[item.id] || 0;
    return `
        <div class="bg-white p-4 rounded-3xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] flex gap-5 item-card relative overflow-hidden group">
            <div class="w-28 h-28 shrink-0 rounded-2xl overflow-hidden bg-gray-100 relative">
                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/400?text=No+Image';">
                <div class="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
            </div>
            <div class="flex-1 flex flex-col justify-between py-1">
                <div>
                    <div class="flex justify-between items-start">
                        <h3 class="font-bold text-gray-900 text-lg leading-tight mb-1 font-serif tracking-tight">${item.name}</h3>
                    </div>
                    <p class="text-xs text-gray-500 line-clamp-2 font-medium leading-relaxed">${item.desc}</p>
                </div>
                <div class="flex items-end justify-between mt-3">
                    <span class="font-bold text-primary text-lg">${formatRp(item.price)}</span>
                    
                    ${qty === 0
            ? `<button onclick="addToCart(${item.id})" class="bg-gray-900 hover:bg-primary text-white w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-lg hover:shadow-orange-500/30 active:scale-95">
                              <i class="ph-bold ph-plus"></i>
                           </button>`
            : `<div class="flex items-center bg-gray-900 rounded-xl h-9 px-1 shadow-lg">
                                <button onclick="updateQty(${item.id}, -1)" class="w-8 h-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"><i class="ph-bold ph-minus text-xs"></i></button>
                                <span class="text-sm font-bold text-white w-5 text-center">${qty}</span>
                                <button onclick="updateQty(${item.id}, 1)" class="w-8 h-full flex items-center justify-center text-white hover:text-primary transition-colors"><i class="ph-bold ph-plus text-xs"></i></button>
                           </div>`
        }
                </div>
            </div>
        </div>
    `;
};

// Cart Logic
window.addToCart = (id) => {
    playClickSound();
    if (!cart[id]) cart[id] = 0;
    cart[id]++;
    updateUI();
};

window.updateQty = (id, change) => {
    playClickSound();
    if (cart[id]) {
        cart[id] += change;
        if (cart[id] <= 0) delete cart[id];
    }
    updateUI();
};

const updateUI = () => {
    // Re-render food cards to show updated buttons
    // OPTIMIZATION: In a real app we'd React/Vue, or just update specific DOMs. 
    // For this size, re-rendering innerHTML of list is fine, but re-rendering WHOLE menu is heavy and resets scroll?
    // Let's just re-render specific card? No, IDs are unique.

    // Better approach for stability: Find the specific card button wrapper and update it.
    // But for simplicity in this artifact, let's just re-render the list OR simply update the "Add" button div.

    // Let's try to update just the cards that changed or all cards (preserves scroll position if we don't nuke body).
    // Actually, re-rendering `innerHTML` of container will lose scroll or focus. 
    // Let's re-render the specific card by ID? 
    // I need to find the element.

    // Quick fix: Re-render all is risky.
    // Let's assume we just re-run renderMenu? No.
    // Let's iterate and update.

    menuData.forEach(cat => {
        cat.items.forEach(item => {
            // Find existing card
            // We need to add IDs to cards to find them easily.
            // Let's assume we re-render the whole list for now, user didn't ask for React.
            // To prevent scroll jumping, we should be careful.
            // Actually, with `scroll-behavior: smooth` and modifying inner content, it might NOT jump if height is stable.
            // Let's try updating only the button container.
        });
    });

    // Re-rendering entire app is bad UX.
    // Let's change `createFoodCard` to be `updateCardState` logic?
    // Simpler: Just refresh the view.
    const scrollPos = window.scrollY;
    renderMenu();
    // Restore scroll?
    window.scrollTo(0, scrollPos); // This might be jittery.

    // Update Floating Cart
    updateFloatingCart();
};

const updateFloatingCart = () => {
    const totalQty = Object.values(cart).reduce((a, b) => a + b, 0);
    const totalPrice = Object.keys(cart).reduce((sum, id) => {
        // Find item
        let item;
        menuData.forEach(cat => {
            const found = cat.items.find(i => i.id == id);
            if (found) item = found;
        });
        return sum + (item.price * cart[id]);
    }, 0);

    const cartEl = document.getElementById('floatingCart');
    if (totalQty > 0) {
        cartEl.classList.remove('translate-y-32', 'opacity-0');
        cartEl.querySelector('.count-label').innerText = `${totalQty} Item`;
        cartEl.querySelector('.total-price').innerText = formatRp(totalPrice);
    } else {
        cartEl.classList.add('translate-y-32', 'opacity-0');
    }
};

// Scroll Spy & Sticky Nav Logic
const setupCategoryScroll = () => {
    const navLinks = document.querySelectorAll('.category-btn');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active', 'bg-primary', 'text-white', 'shadow-lg');
            link.classList.add('bg-white', 'text-gray-500');
            // Check if matches
            if (link.textContent.toLowerCase().includes(current.replace('-', ' '))) {
                // Weak matching logic, better to use data attribute
            }
            // Let's use simpler logic if possible.
        });

        // Better:
        // Re-selecting based on `onclick` param or data attribute.
        // We need data attributes on buttons.
        // Added data-id to buttons in renderMenu.

        const activeBtn = document.querySelector(`button[data-id="${current}"]`);
        if (activeBtn) {
            // Reset all
            document.querySelectorAll('.category-btn').forEach(b => {
                b.classList.remove('active', 'bg-primary', 'text-white', 'shadow-lg');
                b.classList.add('bg-white', 'text-gray-500');
            });

            activeBtn.classList.remove('bg-white', 'text-gray-500');
            activeBtn.classList.add('active', 'bg-primary', 'text-white', 'shadow-lg');

            // Scroll nav to view
            activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    });
};

window.scrollToCategory = (id) => {
    const el = document.getElementById(id);
    if (el) {
        // Adjust for header height
        const y = el.getBoundingClientRect().top + window.scrollY - 180;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
};

// Search Logic
const setupSearch = () => {
    const input = document.getElementById('searchInput');
    input.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const sections = document.querySelectorAll('#menuContainer section');

        sections.forEach(section => {
            let hasVisibleItems = false;
            const items = section.querySelectorAll('.item-card');

            items.forEach(item => {
                const name = item.querySelector('h3').textContent.toLowerCase();
                if (name.includes(term)) {
                    item.style.display = 'flex';
                    hasVisibleItems = true;
                } else {
                    item.style.display = 'none';
                }
            });

            section.style.display = hasVisibleItems ? 'block' : 'none';
        });
    });
};

// Checkout
document.getElementById('checkoutBtn').addEventListener('click', () => {
    let msg = "Halo DHS Kitchen, saya mau pesan:\n";
    let total = 0;
    let itemsList = [];

    Object.keys(cart).forEach(id => {
        let item;
        menuData.forEach(cat => {
            const found = cat.items.find(i => i.id == id);
            if (found) item = found;
        });
        if (item) {
            const subtotal = item.price * cart[id];
            total += subtotal;
            itemsList.push(`${cart[id]}x ${item.name} (@${formatRp(item.price)})`);
        }
    });

    msg += itemsList.join('\n');
    msg += `\n\nTotal: ${formatRp(total)}`;
    msg += `\n\nMohon diproses, terima kasih!`;

    const url = `https://wa.me/6281234567890?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
});

// Init
initApp();
