import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import ProductCard from "../../components/ProductCard";
import { useAuth } from "../../context/AuthContext";
import "../Home/Home.css"

const BRANDS = [
  { name: "Suhana", color: "#E8650A" },
  { name: "Ramdev", color: "#1D9E75" },
  { name: "MDH", color: "#D4537E" },
  { name: "Everest", color: "#378ADD" },
  { name: "Patanjali", color: "#BA7517" },
  { name: "Tata Salt", color: "#639922" },
  { name: "Fortune", color: "#533AB7" },
  { name: "Aashirvaad", color: "#993C1D" },
];

const Home = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/products?limit=8")
      .then((res) => {
        setProducts(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-content">
          <div className="hero-left">
            <span className="hero-badge">
              India's Trusted B2B Wholesale Platform
            </span>

            <h1>
              Gujarat's Trusted <br />
              FMCG Distributor
            </h1>

            <p>
              Buy spices, groceries, flour, oils and household products
              from top brands at wholesale prices with GST invoices.
            </p>

            <div className="hero-buttons">
              <Link to="/products" className="btn-primary">
                Browse Products
              </Link>

              <Link to="/register" className="btn-secondary">
                Become a Dealer
              </Link>
            </div>
          </div>

          <div className="hero-right">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=900"
              alt="Wholesale Products"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container features-section">
        <div className="feature-card">
          <div className="feature-icon">🚚</div>
          <h3>Fast Delivery</h3>
          <p>Same day dispatch across Gujarat.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">💰</div>
          <h3>Best Prices</h3>
          <p>Competitive wholesale pricing.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📄</div>
          <h3>GST Billing</h3>
          <p>100% genuine GST invoices.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🛡️</div>
          <h3>Trusted Brands</h3>
          <p>Top FMCG brands under one roof.</p>
        </div>
      </section>

      {/* Login Banner */}
      {!user && (
        <section className="login-banner">
          <div className="container login-content">
            <div>
              🔒 <strong>Wholesale prices are hidden.</strong> Register to
              view prices and place bulk orders.
            </div>

            <div className="login-buttons">
              <Link to="/login" className="banner-btn">
                Login
              </Link>

              <Link to="/register" className="banner-btn secondary">
                Register
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Brands */}
      <section className="container brands-section">
        <div className="section-header">
          <h2>Featured Brands</h2>
        </div>

        <div className="brands-grid">
          {BRANDS.map((brand) => (
            <Link
              key={brand.name}
              to={`/ products ? brand = ${brand.name} `}
              className="brand-card"
            >
              <span
                className="brand-dot"
                style={{ background: brand.color }}
              ></span>

              {brand.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Products */}
      <section className="container products-section">
        <div className="section-header">
          <h2>Popular Products</h2>

          <Link to="/products" className="view-all">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="loading">
            Loading products...
          </div>
        ) : (
          <div className="products-grid">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))
            ) : (
              <p>No products found.</p>
            )}
          </div>
        )}
      </section>

      {/* Statistics */}
      <section className="stats-section">
        <div className="container stats-grid">
          <div className="stat-card">
            <h2>500+</h2>
            <p>Products</p>
          </div>

          <div className="stat-card">
            <h2>50+</h2>
            <p>Brands</p>
          </div>

          <div className="stat-card">
            <h2>1000+</h2>
            <p>Retailers</p>
          </div>

          <div className="stat-card">
            <h2>24/7</h2>
            <p>Support</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container testimonials-section">
        <h2 className="text-center">
          What Our Customers Say
        </h2>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            ⭐⭐⭐⭐⭐
            <p>
              Excellent service and genuine wholesale
              pricing. Highly recommended.
            </p>
            <h4>Raj Traders</h4>
          </div>

          <div className="testimonial-card">
            ⭐⭐⭐⭐⭐
            <p>
              Fast delivery and great customer support.
            </p>
            <h4>Shree Kirana Store</h4>
          </div>

          <div className="testimonial-card">
            ⭐⭐⭐⭐⭐
            <p>
              One of the best FMCG distributors in Gujarat.
            </p>
            <h4>Patel Super Market</h4>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <h2>
            Ready to Grow Your Business?
          </h2>

          <p>
            Register today and start ordering wholesale
            products at the best prices.
          </p>

          <Link
            to="/register"
            className="btn-primary"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;


