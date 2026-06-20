
import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-grid">

                {/* Company Info */}
                <div className="footer-section">
                    <h2 className="footer-logo">Vidhi Trading</h2>
                    <p>
                        Gujarat's trusted FMCG wholesale distributor providing
                        quality products from top brands at competitive prices.
                    </p>

                    <div className="social-icons">
                        <a href="#">
                            <i className="fab fa-facebook-f"></i>
                        </a>

                        <a href="#">
                            <i className="fab fa-instagram"></i>
                        </a>

                        <a href="#">
                            <i className="fab fa-linkedin-in"></i>
                        </a>

                        <a href="#">
                            <i className="fab fa-whatsapp"></i>
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="footer-section">
                    <h3>Quick Links</h3>

                    <Link to="/">Home</Link>
                    <Link to="/products">Products</Link>
                    <Link to="/about">About Us</Link>
                    <Link to="/contact">Contact</Link>
                </div>

                {/* Categories */}
                <div className="footer-section">
                    <h3>Categories</h3>

                    <Link to="/products?category=Spices">Spices</Link>
                    <Link to="/products?category=Flour">Flour</Link>
                    <Link to="/products?category=Oil">Cooking Oil</Link>
                    <Link to="/products?category=Groceries">Groceries</Link>
                </div>

                {/* Contact */}
                <div className="footer-section">
                    <h3>Contact Us</h3>

                    <p>📍 Idar, Gujarat, India</p>
                    <p>📞 +91 9999999999</p>
                    <p>✉️ vidhitrading@gmail.com</p>
                    <p>🕒 Mon - Sat : 9:00 AM - 7:00 PM</p>
                </div>
            </div>

            <div className="footer-bottom">
                <p>
                    © {new Date().getFullYear()} Vidhi Trading. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;

