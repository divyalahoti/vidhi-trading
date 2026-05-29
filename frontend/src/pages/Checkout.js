import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cartItems, subtotal, gst, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payMethod, setPayMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('');
  const [cardNum, setCardNum] = useState('');
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState({ street: '', city: 'Himatnagar', state: 'Gujarat', pincode: '' });

  const handlePlaceOrder = async () => {
    if (!address.street || !address.pincode) return toast.error('Fill in shipping address');
    setPlacing(true);
    try {
      const orderData = {
        items: cartItems.map(({ product, quantity }) => ({ product: product._id, quantity })),
        shippingAddress: address,
        paymentMethod: payMethod,
        paymentId: payMethod === 'UPI' ? upiId : payMethod === 'Card' ? `CARD-${Date.now()}` : 'NEFT-PENDING',
      };
      const res = await api.post('/orders', orderData);
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    }
    setPlacing(false);
  };

  return (
    <div className="container" style={{ paddingTop: 30, paddingBottom: 40 }}>
      <h1 className="page-title">Checkout</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        <div>
          {/* Shipping */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, marginBottom: 16 }}>📦 Shipping Address</div>
            <div className="grid-2">
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Street / Area</label>
                <input className="form-control" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} placeholder="Shop No., Street, Area" />
              </div>
              <div className="form-group">
                <label>City</label>
                <input className="form-control" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input className="form-control" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} maxLength={6} />
              </div>
              <div className="form-group">
                <label>State</label>
                <input className="form-control" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="card">
            <div style={{ fontWeight: 700, marginBottom: 16 }}>💳 Payment Method</div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              {['UPI', 'Card', 'NEFT', 'COD'].map(m => (
                <button key={m} onClick={() => setPayMethod(m)}
                  style={{ padding: '8px 18px', borderRadius: 8, border: `2px solid ${payMethod === m ? '#E8650A' : '#dee2e6'}`, background: payMethod === m ? '#FDF0E6' : '#fff', color: payMethod === m ? '#B04D06' : '#555', fontWeight: payMethod === m ? 700 : 400, cursor: 'pointer', fontSize: 13 }}>
                  {m}
                </button>
              ))}
            </div>
            {payMethod === 'UPI' && (
              <div>
                <div className="form-group">
                  <label>UPI ID</label>
                  <input className="form-control" placeholder="yourname@upi or 9876543210@paytm" value={upiId} onChange={e => setUpiId(e.target.value)} />
                </div>
                <div style={{ padding: 12, background: '#fff3cd', borderRadius: 8, fontSize: 12, color: '#856404' }}>⚠️ Demo mode — no real transaction will happen</div>
              </div>
            )}
            {payMethod === 'Card' && (
              <div>
                <div className="form-group">
                  <label>Card Number</label>
                  <input className="form-control" placeholder="4111 1111 1111 1111" maxLength={19} value={cardNum}
                    onChange={e => { let v = e.target.value.replace(/\D/g,'').substring(0,16); setCardNum(v.replace(/(.{4})/g,'$1 ').trim()); }} />
                </div>
                <div className="grid-2">
                  <div className="form-group"><label>Expiry</label><input className="form-control" placeholder="MM/YY" maxLength={5} /></div>
                  <div className="form-group"><label>CVV</label><input className="form-control" placeholder="123" maxLength={3} type="password" /></div>
                </div>
                <div style={{ padding: 12, background: '#fff3cd', borderRadius: 8, fontSize: 12, color: '#856404' }}>⚠️ Demo mode — no real transaction will happen</div>
              </div>
            )}
            {payMethod === 'NEFT' && (
              <div style={{ padding: 16, background: '#f8f9fa', borderRadius: 8, fontSize: 13 }}>
                <div style={{ marginBottom: 8 }}><strong>Account Name:</strong> Vidhi Trading Co.</div>
                <div style={{ marginBottom: 8 }}><strong>Account No:</strong> 1234 5678 9012</div>
                <div style={{ marginBottom: 8 }}><strong>IFSC:</strong> HDFC0001234</div>
                <div><strong>Bank:</strong> HDFC Bank, Himatnagar Branch</div>
              </div>
            )}
            {payMethod === 'COD' && (
              <div style={{ padding: 12, background: '#d4edda', borderRadius: 8, fontSize: 13, color: '#155724' }}>✅ Cash/Cheque on delivery. Our representative will collect at delivery.</div>
            )}
          </div>
        </div>

        {/* Order summary */}
        <div className="card" style={{ height: 'fit-content' }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Order Summary</div>
          {cartItems.map(({ product: p, quantity }) => (
            <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
              <span style={{ color: '#555' }}>{p.name} × {quantity}</span>
              <span>₹{(p.price * quantity).toLocaleString('en-IN')}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid #dee2e6', marginTop: 12, paddingTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
              <span style={{ color: '#666' }}>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
              <span style={{ color: '#666' }}>GST (18%)</span><span>₹{gst.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, marginTop: 10 }}>
              <span>Total</span><span style={{ color: '#B04D06' }}>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <button onClick={handlePlaceOrder} disabled={placing} className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 20, fontSize: 15, padding: '12px 0' }}>
            {placing ? 'Placing Order...' : '✅ Place Order'}
          </button>
          <div style={{ fontSize: 11, color: '#888', textAlign: 'center', marginTop: 10 }}>GST invoice will be emailed</div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
