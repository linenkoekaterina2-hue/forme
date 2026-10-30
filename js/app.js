const PRODUCTS = [
  {
    id: 1,
    name: 'Пальто прямого кроя',
    category: 'Верхняя одежда',
    price: 12900,
    oldPrice: 15900,
    sizes: ['S', 'M', 'L'],
    tag: 'BESTSELLER',
    image: 'images/coat.jpg',
    description: 'Пальто с чистым силуэтом и мягкой линией плеча. Легко вписывается в повседневные образы и остаётся актуальным не один сезон.'
  },
  {
    id: 2,
    name: 'Свитер Soft Touch',
    category: 'Трикотаж',
    price: 5900,
    oldPrice: null,
    sizes: ['XS', 'S', 'M', 'L'],
    tag: 'NEW',
    image: 'images/sweather.jpg',
    description: 'Мягкий трикотаж, свободная посадка и спокойный оттенок. Тот самый свитер для прохладных утр и длинных прогулок.'
  },
  {
    id: 3,
    name: 'Брюки City Wide',
    category: 'Брюки',
    price: 6900,
    oldPrice: null,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    tag: '',
    image: 'images/bruki.jpg',
    description: 'Широкие брюки с комфортной посадкой. Сочетаются с базовой футболкой, рубашкой или объёмным жакетом.'
  },
  {
    id: 4,
    name: 'Рубашка Everyday',
    category: 'Рубашки',
    price: 4500,
    oldPrice: 5200,
    sizes: ['S', 'M', 'L', 'XL'],
    tag: '-13%',
    image: 'images/rubashka.jpg',
    description: 'Универсальная рубашка с расслабленной посадкой. Носи навыпуск, заправляй в брюки или надевай вторым слоем.'
  },
  {
    id: 5,
    name: 'Платье Soft Line',
    category: 'Платья',
    price: 7400,
    oldPrice: null,
    sizes: ['XS', 'S', 'M', 'L'],
    tag: 'NEW',
    image: 'images/platye.jpg',
    description: 'Лаконичное платье, которое не требует сложных аксессуаров. Достаточно любимой обуви и настроения.'
  },
  {
    id: 6,
    name: 'Жакет Form',
    category: 'Верхняя одежда',
    price: 9900,
    oldPrice: null,
    sizes: ['S', 'M', 'L'],
    tag: '',
    image: 'images/jaket.jpg',
    description: 'Структурный жакет с расслабленной посадкой. Собирает образ и одинаково хорошо работает с денимом и классическими брюками.'
  },
  {
    id: 7,
    name: 'Футболка Essential',
    category: 'Трикотаж',
    price: 2400,
    oldPrice: null,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    tag: '',
    image: 'images/futbolka.jpg',
    description: 'Базовая футболка на каждый день. Плотная ткань, аккуратная горловина и правильная длина.'
  },
  {
    id: 8,
    name: 'Сумка Daily',
    category: 'Аксессуары',
    price: 5200,
    oldPrice: 6200,
    sizes: ['ONE SIZE'],
    tag: '-16%',
    image: 'images/sumka.jpg',
    description: 'Вместительная сумка на каждый день с минималистичным дизайном. Ничего лишнего — только нужное.'
  },
  {
    id: 9,
    name: 'Джинсы Straight',
    category: 'Брюки',
    price: 6100,
    oldPrice: null,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    tag: '',
    image: 'images/jeans.jpg',
    description: 'Прямые джинсы в универсальном оттенке денима. Легко сочетаются с трикотажем, рубашками и жакетами.'
  },
  {
    id: 10,
    name: 'Кардиган Cozy',
    category: 'Трикотаж',
    price: 6300,
    oldPrice: null,
    sizes: ['S', 'M', 'L'],
    tag: '',
    image: 'images/kardig.jpg',
    description: 'Кардиган с мягкой фактурой для многослойных образов. Уютный, но собранный — как мы любим.'
  },
  {
    id: 11,
    name: 'Тренч Weekend',
    category: 'Верхняя одежда',
    price: 14500,
    oldPrice: 16900,
    sizes: ['S', 'M', 'L'],
    tag: '-14%',
    image: 'images/trench.jpg',
    description: 'Лёгкий тренч с поясом и лаконичной фурнитурой. Идеальная верхняя вещь для переменчивой погоды.'
  },
  {
    id: 12,
    name: 'Топ Second Skin',
    category: 'Трикотаж',
    price: 2900,
    oldPrice: null,
    sizes: ['XS', 'S', 'M', 'L'],
    tag: 'NEW',
    image: 'images/top.jpg',
    description: 'Мягкий базовый топ, который удобно носить отдельно или под рубашкой и жакетом.'
  }
];

const money = (n) => new Intl.NumberFormat('ru-RU').format(n) + ' ₽';

const read = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (e) {
    return [];
  }
};

const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

let favorites = read('forme-favorites');
let cart = read('forme-cart');

function updateCounts() {
  document.querySelectorAll('#fav-count').forEach((x) => {
    x.textContent = favorites.length;
  });
  document.querySelectorAll('#cart-count').forEach((x) => {
    x.textContent = cart.reduce((s, i) => s + i.qty, 0);
  });
}

function toast(msg) {
  let old = document.querySelector('.toast');
  if (old) old.remove();
  let el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.append(el);
  setTimeout(() => el.remove(), 2200);
}

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter((x) => x !== id);
    toast('Удалено из избранного');
  } else {
    favorites.push(id);
    toast('Добавлено в избранное ♡');
  }
  write('forme-favorites', favorites);
  updateCounts();
  renderAllProducts();
  renderFavorites();
  renderProductPage();
}

function addToCart(id, size) {
  let item = cart.find((x) => x.id === id && x.size === size);
  if (item) {
    item.qty++;
  } else {
    cart.push({ id, size, qty: 1 });
  }
  write('forme-cart', cart);
  updateCounts();
  toast('Добавлено в корзину');
  renderCart();
}

function card(p) {
  return `<article class="product-card">
    <a class="product-image" href="product.html?id=${p.id}">
      <img loading="lazy" src="${p.image}" alt="${p.name}">
      ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ''}
    </a>
    <button class="heart-btn ${favorites.includes(p.id) ? 'is-fav' : ''}" aria-label="В избранное" data-fav="${p.id}">${favorites.includes(p.id) ? '♥' : '♡'}</button>
    <div class="product-info">
      <p class="product-category">${p.category}</p>
      <a class="product-name" href="product.html?id=${p.id}">${p.name}</a>
      <div class="product-bottom">
        <div class="price">${money(p.price)} ${p.oldPrice ? `<span class="old-price">${money(p.oldPrice)}</span>` : ''}</div>
        <button class="quick-add" data-add="${p.id}" aria-label="Добавить в корзину" title="Добавить в корзину">＋</button>
      </div>
    </div>
  </article>`;
}

function bindProductButtons(scope = document) {
  scope.querySelectorAll('[data-fav]').forEach((b) => {
    b.onclick = () => toggleFavorite(Number(b.dataset.fav));
  });
  scope.querySelectorAll('[data-add]').forEach((b) => {
    b.onclick = () => {
      let p = PRODUCTS.find((x) => x.id === Number(b.dataset.add));
      addToCart(p.id, p.sizes[0]);
    };
  });
}

function renderAllProducts() {
  let home = document.getElementById('home-products');
  if (home) {
    home.innerHTML = PRODUCTS.slice(0, 4).map(card).join('');
    bindProductButtons(home);
  }
  let catalog = document.getElementById('catalog-products');
  if (catalog) filterProducts();
}

function filterProducts() {
  let target = document.getElementById('catalog-products');
  if (!target) return;

  let q = (document.getElementById('search-input')?.value || '').toLowerCase().trim();
  let cat = document.getElementById('category-filter')?.value || 'all';
  let size = document.getElementById('size-filter')?.value || 'all';
  let max = Number(document.getElementById('price-filter')?.value || 20000);
  let sale = document.getElementById('sale-filter')?.checked || false;
  let sort = document.getElementById('sort-select')?.value || 'featured';

  let items = PRODUCTS.filter((p) =>
    (!q || (p.name + ' ' + p.category).toLowerCase().includes(q)) &&
    (cat === 'all' || p.category === cat) &&
    (size === 'all' || p.sizes.includes(size)) &&
    p.price <= max &&
    (!sale || p.oldPrice)
  );

  if (sort === 'price-asc') items.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') items.sort((a, b) => b.price - a.price);
  if (sort === 'name') items.sort((a, b) => a.name.localeCompare(b.name, 'ru'));

  target.innerHTML = items.map(card).join('');
  bindProductButtons(target);

  document.getElementById('results-count').textContent =
    `${items.length} ${plural(items.length, ['товар', 'товара', 'товаров'])}`;
  document.getElementById('empty-state').classList.toggle('hidden', items.length !== 0);
}

function plural(n, words) {
  let a = n % 10;
  let b = n % 100;
  return words[
    (a === 1 && b !== 11) ? 0 :
    (a >= 2 && a <= 4 && (b < 12 || b > 14)) ? 1 : 2
  ];
}

function renderFavorites() {
  let target = document.getElementById('favorites-products');
  if (!target) return;
  let items = PRODUCTS.filter((p) => favorites.includes(p.id));
  target.innerHTML = items.map(card).join('');
  bindProductButtons(target);
  document.getElementById('favorites-empty').classList.toggle('hidden', items.length > 0);
}

function renderProductPage() {
  let target = document.getElementById('product-detail');
  if (!target) return;

  let id = Number(new URLSearchParams(location.search).get('id')) || 1;
  let p = PRODUCTS.find((x) => x.id === id) || PRODUCTS[0];
  document.title = p.name + ' — FORME';

  target.innerHTML = `
    <div class="detail-image">
      <img src="${p.image}" alt="${p.name}">
    </div>
    <div class="detail-copy">
      <p class="eyebrow">${p.category.toUpperCase()} / FORME EDIT</p>
      <h1>${p.name}</h1>
      <div class="detail-price">${money(p.price)} ${p.oldPrice ? `<span class="old-price">${money(p.oldPrice)}</span>` : ''}</div>
      <p class="detail-desc">${p.description}</p>
      <div class="detail-line"></div>
      <b>Выбери размер</b>
      <div class="size-row">${p.sizes.map((s, i) => `<button class="size-btn ${i === 0 ? 'selected' : ''}" data-size="${s}">${s}</button>`).join('')}</div>
      <div class="detail-actions">
        <button class="btn btn-dark" id="detail-add">Добавить в корзину <span>↗</span></button>
        <button class="detail-heart ${favorites.includes(p.id) ? 'is-fav' : ''}" id="detail-fav">${favorites.includes(p.id) ? '♥' : '♡'}</button>
      </div>
      <div class="detail-points">
        ✓ Бесплатная доставка от 7 000 ₽<br>
        ✓ Возврат в течение 14 дней<br>
        ✓ Подборки вещей, которые сочетаются между собой
      </div>
    </div>`;

  let selected = p.sizes[0];

  target.querySelectorAll('[data-size]').forEach((b) => {
    b.onclick = () => {
      target.querySelectorAll('[data-size]').forEach((x) => x.classList.remove('selected'));
      b.classList.add('selected');
      selected = b.dataset.size;
    };
  });

  document.getElementById('detail-add').onclick = () => addToCart(p.id, selected);
  document.getElementById('detail-fav').onclick = () => toggleFavorite(p.id);

  let related = document.getElementById('related-products');
  if (related) {
    related.innerHTML = PRODUCTS
      .filter((x) => x.id !== p.id && (x.category === p.category || x.price < p.price))
      .slice(0, 4)
      .map(card)
      .join('');
    bindProductButtons(related);
  }
}

function renderCart() {
  let target = document.getElementById('cart-items');
  if (!target) return;

  let items = cart
    .map((item) => ({ ...item, product: PRODUCTS.find((p) => p.id === item.id) }))
    .filter((x) => x.product);

  let empty = items.length === 0;
  document.getElementById('cart-empty').classList.toggle('hidden', !empty);
  document.querySelector('.cart-layout').classList.toggle('hidden', empty);

  target.innerHTML = items.map(({ id, size, qty, product: p }) => `
    <article class="cart-row">
      <a href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}"></a>
      <div>
        <p>${p.category}</p>
        <h3>${p.name}</h3>
        <p>Размер: ${size}</p>
        <div class="quantity">
          <button data-qty="${id}|${size}|-1">−</button>
          <span>${qty}</span>
          <button data-qty="${id}|${size}|1">＋</button>
        </div>
        <button class="remove-item" data-remove="${id}|${size}">Удалить</button>
      </div>
      <div class="cart-row-price">${money(p.price * qty)}</div>
    </article>`).join('');

  target.querySelectorAll('[data-qty]').forEach((b) => {
    b.onclick = () => {
      let [id, size, delta] = b.dataset.qty.split('|');
      let item = cart.find((x) => x.id === Number(id) && x.size === size);
      if (item) {
        item.qty += Number(delta);
        if (item.qty <= 0) cart = cart.filter((x) => x !== item);
        write('forme-cart', cart);
        updateCounts();
        renderCart();
      }
    };
  });

  target.querySelectorAll('[data-remove]').forEach((b) => {
    b.onclick = () => {
      let [id, size] = b.dataset.remove.split('|');
      cart = cart.filter((x) => !(x.id === Number(id) && x.size === size));
      write('forme-cart', cart);
      updateCounts();
      renderCart();
    };
  });

  let subtotal = items.reduce((s, x) => s + x.product.price * x.qty, 0);
  let ship = subtotal === 0 ? 0 : (subtotal >= 7000 ? 0 : 350);

  document.getElementById('subtotal').textContent = money(subtotal);
  document.getElementById('shipping').textContent = ship === 0 ? (subtotal >= 7000 ? 'Бесплатно' : '—') : money(ship);
  document.getElementById('total').textContent = money(subtotal + ship);
}

async function init() {
  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      const fromDb = await res.json();
      if (Array.isArray(fromDb) && fromDb.length) {
        PRODUCTS.length = 0;
        PRODUCTS.push(...fromDb);
      }
    }
  } catch (e) {
    console.warn('Не удалось загрузить товары с сервера', e);
  }

  updateCounts();
  renderAllProducts();
  renderFavorites();
  renderProductPage();
  renderCart();

  let params = new URLSearchParams(location.search);
  let initialCat = params.get('category');
  if (initialCat && document.getElementById('category-filter')) {
    document.getElementById('category-filter').value = initialCat;
    filterProducts();
  }

  ['search-input', 'category-filter', 'size-filter', 'price-filter', 'sale-filter', 'sort-select'].forEach((id) => {
    let el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        if (id === 'price-filter') {
          document.getElementById('price-value').textContent = money(Number(el.value));
        }
        filterProducts();
      });
    }
  });

  function reset() {
    let q = document.getElementById('search-input');
    if (q) q.value = '';
    let c = document.getElementById('category-filter');
    if (c) c.value = 'all';
    let s = document.getElementById('size-filter');
    if (s) s.value = 'all';
    let p = document.getElementById('price-filter');
    if (p) p.value = 20000;
    let sale = document.getElementById('sale-filter');
    if (sale) sale.checked = false;
    let sort = document.getElementById('sort-select');
    if (sort) sort.value = 'featured';
    let pv = document.getElementById('price-value');
    if (pv) pv.textContent = money(20000);
    filterProducts();
  }

  document.getElementById('reset-filters')?.addEventListener('click', reset);
  document.getElementById('empty-reset')?.addEventListener('click', reset);

  document.querySelector('.menu-toggle')?.addEventListener('click', () => {
    document.querySelector('.header').classList.toggle('menu-open');
  });

  document.getElementById('newsletter-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('newsletter-message').textContent = 'Спасибо! Ты в списке FORME LETTER ♡';
    e.target.reset();
  });

   document.getElementById('contact-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const feedback = document.getElementById('contact-feedback');
    
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const topic = document.getElementById('contact-topic').value;
    const message = document.getElementById('contact-message').value;

    feedback.textContent = 'Отправляем...';

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, topic, message })
      });

      if (res.ok) {
        feedback.textContent = 'Спасибо за сообщение! Мы ответим вам на почту.';
        form.reset();
      } else {
        feedback.textContent = 'Ошибка при отправке. Попробуйте позже.';
      }
    } catch (err) {
      console.error(err);
      feedback.textContent = 'Нет связи с сервером.';
    }
  });
  document.getElementById('checkout-btn')?.addEventListener('click', async () => {
    if (!cart.length) return;

    const name = prompt('Как к тебе обращаться? (Ваше имя)');
    const email = prompt('Ваш e-mail для связи:');
    
    if (!name || !email) {
      toast('Оформление отменено. Введите имя и email');
      return;
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: name,
          customer_email: email,
          items: cart.map(i => ({ 
            product_id: i.id, 
            size: i.size, 
            quantity: i.qty 
          }))
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast(`Заказ №${data.orderId} оформлен на сумму ${money(data.total)}`);
        cart = []; // Очищаем корзину
        write('forme-cart', cart);
        updateCounts();
        renderCart();
      } else {
        toast(data.error || 'Ошибка оформления');
      }
    } catch (e) {
      console.error(e);
      toast('Ошибка связи с сервером');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => init());