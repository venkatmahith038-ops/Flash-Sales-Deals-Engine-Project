import React, { useState } from "react";

const STEPS = ["Delivery", "Payment", "Verify OTP", "Confirmed"];

const CheckoutModal = ({ open, onClose, cart, cartTotal, onPlaceOrder }) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", pincode: "", state: "" });
  const [payment, setPayment] = useState({ method: "upi", upiId: "", cardNo: "", expiry: "", cvv: "", cardName: "" });
  const [otp, setOtp] = useState("");
  const [generatedOtp] = useState(() => String(Math.floor(100000 + Math.random() * 900000)));
  const [otpError, setOtpError] = useState("");
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  if (!open) return null;

  const deliveryFee = cartTotal >= 499 ? 0 : 49;
  const finalTotal = cartTotal + deliveryFee;

  const validateDelivery = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) e.phone = "Enter valid 10-digit phone";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode)) e.pincode = "Enter valid 6-digit PIN";
    if (!form.state.trim()) e.state = "State is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e = {};
    if (payment.method === "upi") {
      if (!payment.upiId.trim() || !payment.upiId.includes("@")) e.upiId = "Enter valid UPI ID (e.g. name@upi)";
    } else if (payment.method === "card") {
      if (!payment.cardNo.replace(/\s/g, "").match(/^\d{16}$/)) e.cardNo = "Enter valid 16-digit card number";
      if (!payment.expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = "Enter expiry as MM/YY";
      if (!payment.cvv.match(/^\d{3,4}$/)) e.cvv = "Enter valid CVV";
      if (!payment.cardName.trim()) e.cardName = "Cardholder name required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && !validateDelivery()) return;
    if (step === 1) {
      if (!validatePayment()) return;
      // Simulate sending OTP
      alert(`📱 OTP sent to +91-${form.phone}: ${generatedOtp}\n(In a real app this would be sent via SMS)`);
    }
    setErrors({});
    setStep((s) => s + 1);
  };

  const handleVerifyOtp = () => {
    if (otp !== generatedOtp) {
      setOtpError("Invalid OTP. Please try again.");
      return;
    }
    setOtpError("");
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep(3);
      onPlaceOrder({
        delivery: form,
        paymentMethod: payment.method,
        deliveryFee,
        finalTotal,
      });
    }, 1800);
  };

  const handleClose = () => {
    setStep(0);
    setErrors({});
    setOtp("");
    setOtpError("");
    onClose();
  };

  const f = (field, val) => setForm((p) => ({ ...p, [field]: val }));
  const fp = (field, val) => setPayment((p) => ({ ...p, [field]: val }));

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>✕</button>

        {/* Step indicator */}
        <div className="checkout-steps">
          {STEPS.map((s, i) => (
            <div key={s} className={`checkout-step ${i <= step ? "active" : ""} ${i < step ? "done" : ""}`}>
              <div className="step-num">{i < step ? "✓" : i + 1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>

        {/* STEP 0: Delivery */}
        {step === 0 && (
          <div className="modal-body">
            <h3 className="modal-section-title">📦 Delivery Information</h3>
            <div className="checkout-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input value={form.name} onChange={(e) => f("name", e.target.value)} placeholder="Rahul Sharma" />
                  {errors.name && <span className="field-err">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input value={form.phone} onChange={(e) => f("phone", e.target.value)} placeholder="9876543210" maxLength={10} />
                  {errors.phone && <span className="field-err">{errors.phone}</span>}
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <input value={form.address} onChange={(e) => f("address", e.target.value)} placeholder="House No, Street, Area" />
                {errors.address && <span className="field-err">{errors.address}</span>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input value={form.city} onChange={(e) => f("city", e.target.value)} placeholder="Hyderabad" />
                  {errors.city && <span className="field-err">{errors.city}</span>}
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input value={form.state} onChange={(e) => f("state", e.target.value)} placeholder="Telangana" />
                  {errors.state && <span className="field-err">{errors.state}</span>}
                </div>
                <div className="form-group">
                  <label>PIN Code</label>
                  <input value={form.pincode} onChange={(e) => f("pincode", e.target.value)} placeholder="500001" maxLength={6} />
                  {errors.pincode && <span className="field-err">{errors.pincode}</span>}
                </div>
              </div>
            </div>
            <div className="modal-order-summary">
              <div className="order-summary-title">Order Summary</div>
              {cart.map((i) => (
                <div key={i.id} className="summary-item">
                  <span>{i.name} × {i.qty}</span>
                  <span>₹{(i.salePrice * i.qty).toLocaleString()}</span>
                </div>
              ))}
              <div className="summary-item summary-total">
                <span>Total</span>
                <span>₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>
            <button className="checkout-next-btn" onClick={handleNext}>Continue to Payment →</button>
          </div>
        )}

        {/* STEP 1: Payment */}
        {step === 1 && (
          <div className="modal-body">
            <h3 className="modal-section-title">💳 Payment Method</h3>
            <div className="payment-methods">
              {["upi", "card", "cod"].map((m) => (
                <button
                  key={m}
                  className={`payment-method-btn ${payment.method === m ? "selected" : ""}`}
                  onClick={() => fp("method", m)}
                >
                  {m === "upi" && "📱 UPI / Wallet"}
                  {m === "card" && "💳 Credit / Debit Card"}
                  {m === "cod" && "💵 Cash on Delivery"}
                </button>
              ))}
            </div>

            {payment.method === "upi" && (
              <div className="checkout-form">
                <div className="form-group">
                  <label>UPI ID</label>
                  <input value={payment.upiId} onChange={(e) => fp("upiId", e.target.value)} placeholder="yourname@upi" />
                  {errors.upiId && <span className="field-err">{errors.upiId}</span>}
                </div>
                <div className="upi-apps">
                  {["PhonePe", "GPay", "Paytm", "BHIM"].map((app) => (
                    <div key={app} className="upi-app">{app}</div>
                  ))}
                </div>
              </div>
            )}

            {payment.method === "card" && (
              <div className="checkout-form">
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    value={payment.cardNo}
                    onChange={(e) => fp("cardNo", e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim())}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                  {errors.cardNo && <span className="field-err">{errors.cardNo}</span>}
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry (MM/YY)</label>
                    <input value={payment.expiry} onChange={(e) => fp("expiry", e.target.value)} placeholder="12/27" maxLength={5} />
                    {errors.expiry && <span className="field-err">{errors.expiry}</span>}
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input value={payment.cvv} onChange={(e) => fp("cvv", e.target.value)} placeholder="123" maxLength={4} type="password" />
                    {errors.cvv && <span className="field-err">{errors.cvv}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input value={payment.cardName} onChange={(e) => fp("cardName", e.target.value)} placeholder="Rahul Sharma" />
                  {errors.cardName && <span className="field-err">{errors.cardName}</span>}
                </div>
              </div>
            )}

            {payment.method === "cod" && (
              <div className="cod-info">
                💵 Pay ₹{finalTotal.toLocaleString()} in cash when your order arrives. No extra charges.
              </div>
            )}

            <div className="amount-to-pay">
              <span>Amount to Pay:</span>
              <strong>₹{finalTotal.toLocaleString()}</strong>
            </div>
            <button className="checkout-next-btn" onClick={handleNext}>
              {payment.method === "cod" ? "Place Order →" : "Get OTP & Verify →"}
            </button>
          </div>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 2 && (
          <div className="modal-body otp-body">
            <div className="otp-icon">📱</div>
            <h3 className="modal-section-title">OTP Verification</h3>
            <p className="otp-sub">Enter the 6-digit OTP sent to <strong>+91-{form.phone}</strong></p>
            <div className="otp-input-wrap">
              <input
                className="otp-input"
                value={otp}
                onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setOtpError(""); }}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
              />
            </div>
            {otpError && <div className="otp-error">{otpError}</div>}
            <div className="otp-hint">💡 Demo OTP: <strong>{generatedOtp}</strong></div>
            <button className="checkout-next-btn" onClick={handleVerifyOtp} disabled={otp.length !== 6 || processing}>
              {processing ? "Processing Payment..." : "Verify & Pay →"}
            </button>
            {processing && <div className="processing-bar"><div className="processing-fill" /></div>}
          </div>
        )}

        {/* STEP 3: Confirmed */}
        {step === 3 && (
          <div className="modal-body confirmed-body">
            <div className="confirmed-icon">✅</div>
            <h3 className="confirmed-title">Order Confirmed!</h3>
            <p className="confirmed-sub">Your order has been placed successfully. You'll receive updates on +91-{form.phone}</p>
            <div className="confirmed-details">
              <div className="confirmed-row"><span>Order ID</span><span>FD-{Date.now().toString().slice(-8)}</span></div>
              <div className="confirmed-row"><span>Delivery to</span><span>{form.city}, {form.state}</span></div>
              <div className="confirmed-row"><span>Expected</span><span>3-5 Business Days</span></div>
              <div className="confirmed-row"><span>Payment</span><span>{payment.method === "upi" ? "UPI" : payment.method === "card" ? "Card" : "COD"}</span></div>
            </div>
            <button className="checkout-next-btn" onClick={handleClose}>View My Orders →</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
