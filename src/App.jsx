import { useState } from "react";
import "./App.css";

const products = [
  { id: 1, name: "Ball Bearing 6204", category: "Bearings", price: 180, stock: 20 },
  { id: 2, name: "Copper Wire 1.5mm", category: "Electrical", price: 420, stock: 15 },
  { id: 3, name: "Hex Bolt Set", category: "Fasteners", price: 250, stock: 30 },
  { id: 4, name: "PVC Pipe 1/2 inch", category: "Plumbing", price: 160, stock: 25 },
  { id: 5, name: "Steel Gear 40T", category: "Machine Parts", price: 850, stock: 10 },
  { id: 6, name: "Oil Seal 35mm", category: "Seals", price: 120, stock: 40 }
];

function App() {
  const [cart, setCart] = useState({});
  const [showBill, setShowBill] = useState(false);

  const getQuantity = (id) => cart[id] || 0;

  const increaseQuantity = (id) => {
    setCart((current) => {
      const product = products.find((p) => p.id === id);
      const quantity = current[id] || 0;
      if (quantity >= product.stock) return current;
      return { ...current, [id]: quantity + 1 };
    });
  };

  const decreaseQuantity = (id) => {
    setCart((current) => {
      const quantity = current[id] || 0;
      if (quantity <= 1) {
        const next = { ...current };
        delete next[id];
        return next;
      }
      return { ...current, [id]: quantity - 1 };
    });
  };

  const resetQuantity = (id) => {
    setCart((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  };

  const items = products.filter((p) => getQuantity(p.id) > 0);
  const subtotal = items.reduce((sum, p) => sum + p.price * getQuantity(p.id), 0);
  const delivery = subtotal ? 50 : 0;
  const tax = subtotal * 0.05;
  const total = subtotal + delivery + tax;
  const totalItems = items.reduce((sum, p) => sum + getQuantity(p.id), 0);

  const money = (value) => new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0
  }).format(value);

  return (
    <div className="app">
      <header className="header">
        <div>
          <p className="brand">SPAREHUB</p>
          <p className="tagline">Industrial Hardware & Spare Parts</p>
        </div>
        <div className="cart-summary">
          <span>{totalItems} items</span>
          <strong>{money(total)}</strong>
        </div>
      </header>

      <main>
        <section className="hero">
          <div>
            <p className="eyebrow">HARDWARE SPARES STORE</p>
            <h1>Buy the right spare.<br />Get the right quantity.</h1>
            <p className="hero-text">
              Select hardware parts and use the highlighted counter to choose
              exactly how many you need.
            </p>
          </div>
          <div className="counter-demo">
            <span>COUNTER</span>
            <strong>useState</strong>
            <small>Quantity is controlled by React state</small>
          </div>
        </section>

        <section className="section-heading">
          <div>
            <p className="eyebrow">AVAILABLE PRODUCTS</p>
            <h2>Hardware Spare Parts</h2>
          </div>
          <p>{products.length} products available</p>
        </section>

        <section className="product-grid">
          {products.map((product) => {
            const quantity = getQuantity(product.id);
            return (
              <article className={"product-card " + (quantity ? "selected" : "")} key={product.id}>
                <div className="product-top">
                  <span className="category">{product.category}</span>
                  {quantity > 0 && <span className="added">ADDED</span>}
                </div>
                <div className="product-icon">{product.category === "Electrical" ? "⚡" :
                  product.category === "Plumbing" ? "◉" :
                  product.category === "Bearings" ? "◎" :
                  product.category === "Fasteners" ? "✦" :
                  product.category === "Machine Parts" ? "⚙" : "◌"}</div>
                <h3>{product.name}</h3>
                <p className="stock">Stock available: {product.stock}</p>
                <div className="product-footer"><strong>{money(product.price)}</strong><span>/ piece</span></div>

                <div className="quantity-area">
                  <label>QUANTITY</label>
                  <div className={"counter " + (quantity ? "counter-active" : "")}>
                    <button onClick={() => decreaseQuantity(product.id)} disabled={!quantity}>−</button>
                    <span>{quantity}</span>
                    <button onClick={() => increaseQuantity(product.id)} disabled={quantity >= product.stock}>+</button>
                  </div>
                  {!quantity && <p className="counter-message">Minimum quantity: 0</p>}
                  {quantity > 0 && (
                    <button className="reset-button" onClick={() => resetQuantity(product.id)}>
                      Reset quantity
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </section>

        <section className="order-section">
          <div className="order-heading">
            <div><p className="eyebrow">YOUR ORDER</p><h2>Bill Summary</h2></div>
            <span>{totalItems} total pieces</span>
          </div>

          {!items.length ? (
            <div className="empty-cart">
              <h3>Your bill is empty</h3>
              <p>Select a product and increase its highlighted quantity counter.</p>
            </div>
          ) : (
            <>
              <div className="bill-table">
                <div className="bill-row bill-header"><span>Product</span><span>Qty</span><span>Price</span><span>Total</span></div>
                {items.map((p) => {
                  const q = getQuantity(p.id);
                  return <div className="bill-row" key={p.id}>
                    <span>{p.name}</span><span>{q}</span><span>{money(p.price)}</span><strong>{money(p.price * q)}</strong>
                  </div>;
                })}
              </div>

              <div className="bill-total">
                <div><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
                <div><span>Delivery</span><strong>{money(delivery)}</strong></div>
                <div><span>GST (5%)</span><strong>{money(tax)}</strong></div>
                <div className="grand-total"><span>Grand Total</span><strong>{money(total)}</strong></div>
                <button className="checkout-button" onClick={() => setShowBill(true)}>Generate Final Bill</button>
              </div>
            </>
          )}
        </section>
      </main>

      {showBill && (
        <div className="modal-backdrop">
          <div className="final-bill">
            <button className="close-button" onClick={() => setShowBill(false)}>×</button>
            <p className="eyebrow">SPAREHUB</p>
            <h2>Final Bill</h2>
            <p className="bill-date">{new Date().toLocaleDateString("en-IN")}</p>
            <div className="final-items">
              {items.map((p) => {
                const q = getQuantity(p.id);
                return <div className="final-item" key={p.id}>
                  <span>{p.name}<br /><small>{q} × {money(p.price)}</small></span>
                  <strong>{money(p.price * q)}</strong>
                </div>;
              })}
            </div>
            <div className="final-summary">
              <div><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
              <div><span>Delivery</span><strong>{money(delivery)}</strong></div>
              <div><span>GST</span><strong>{money(tax)}</strong></div>
              <div className="final-grand"><span>Amount Payable</span><strong>{money(total)}</strong></div>
            </div>
            <button className="done-button" onClick={() => setShowBill(false)}>Close Bill</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;