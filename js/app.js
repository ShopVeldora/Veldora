const $ = (s) => document.querySelector(s);
const setText = (id, t) => { const el = $(id); if (el) el.textContent = t; };

(async function init(){
  $('#year').textContent = new Date().getFullYear();

  const res = await fetch('/data/product.json'); const cfg = await res.json();

  setText('#brand', cfg.brand); setText('#brand2', cfg.brand); setText('#brand3', cfg.brand); setText('#brand4', cfg.brand);
  setText('#productName', `${cfg.productName}`);
  setText('#price', cfg.priceDisplay);
  if (cfg.heroImage) $('#heroImage').src = cfg.heroImage;

  const ul = $('#highlights'); ul.innerHTML = '';
  cfg.highlights.forEach(h => { const li = document.createElement('li'); li.textContent = `✔️ ${h}`; ul.appendChild(li); });

  const faqList = $('#faqList');
  faqList.innerHTML = ''; cfg.faq.forEach(item => {
    const d = document.createElement('details'); const s = document.createElement('summary'); s.textContent = item.q;
    const p = document.createElement('p'); p.textContent = item.a; d.appendChild(s); d.appendChild(p); faqList.appendChild(d);
  });

  const buyBtn = $('#buyButton');
  buyBtn?.addEventListener('click', async () => {
    buyBtn.disabled = true; buyBtn.textContent = 'Even geduld...';
    try {
      // send minimal order context so checkout metadata contains SKU, etc.
      const checkoutRes = await fetch('/buy', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ sku: cfg.sku, productName: cfg.productName })
      });
      if (!checkoutRes.ok) throw new Error('Checkout error');
      const { url } = await checkoutRes.json();
      window.location.href = url;
    } catch (e) {
      alert('Er ging iets mis met afrekenen. Probeer opnieuw.');
      console.error(e);
      buyBtn.disabled = false; buyBtn.textContent = 'Nu kopen';
    }
  });

  // Page title
  const brand = cfg.brand || 'Veldora';
  document.title = `${brand} – ${cfg.productName}`;
})();
