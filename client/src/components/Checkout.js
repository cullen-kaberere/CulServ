"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import "./Checkout.css"

const Checkout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [serviceRequest, setServiceRequest] = useState(null)
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState("credit_card")
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    billingAddress: "",
    city: "",
    zipCode: "",
    country: "USA",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams(location.search)
      const requestId = params.get("requestId")
      const servicesParam = params.get("services")
      const totalPrice = params.get("totalPrice")

      if (!requestId) {
        setError("No service request specified")
        setLoading(false)
        return
      }

      try {
        // For demo purposes, create a mock service request
        const mockServiceRequest = {
          id: requestId,
          services: servicesParam ? JSON.parse(servicesParam) : [],
          total_price: totalPrice ? Number.parseFloat(totalPrice) : 0,
          vehicle_id: 1,
          status: "pending",
          created_at: new Date().toISOString(),
        }

        setServiceRequest(mockServiceRequest)

        // Set mock vehicle
        setVehicle({
          id: 1,
          make: "Toyota",
          model: "Camry",
          year: "2020",
          number_plate: "KDN1234G",
          current_mileage: 25000,
          last_service_date: "2023-05-15",
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [location])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!serviceRequest) {
      setError("No service request to process")
      return
    }

    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real app, you would update the service request status here
      setIsComplete(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBackToServices = () => {
    navigate("/car-details")
  }

  if (loading)
    return (
      <div className="checkout-container loading-container">
        <div className="loading-spinner"></div>
        <p>Processing your request...</p>
      </div>
    )

  if (error) {
    return (
      <div className="checkout-container">
        <div className="error-message">{error}</div>
        <button onClick={handleBackToServices} className="back-button">
          Back to Services
        </button>
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="checkout-container">
        <div className="payment-success">
          <div className="success-icon">✓</div>
          <h2>Payment Successful!</h2>
          <div className="success-details">
            <p>Your service request has been confirmed and paid.</p>
            <p>A confirmation email has been sent to your registered email address.</p>
            <p>
              Service Request ID: <strong>{serviceRequest.id}</strong>
            </p>

            <div className="appointment-info">
              <h3>Next Steps</h3>
              <p>Our team will contact you shortly to confirm your appointment time.</p>
              <p>You can track the status of your service request in your account dashboard.</p>
            </div>
          </div>
          <button onClick={handleBackToServices} className="back-to-dashboard">
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Complete Your Service Booking</h1>
        <div className="checkout-steps">
          <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
            <div className="step-number">1</div>
            <span className="step-name">Review</span>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
            <div className="step-number">2</div>
            <span className="step-name">Payment</span>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
            <div className="step-number">3</div>
            <span className="step-name">Confirmation</span>
          </div>
        </div>
      </div>

      <div className="checkout-content">
        {currentStep === 1 && (
          <div className="review-step">
            <div className="review-section">
              <h2>Review Your Service Request</h2>

              {vehicle && (
                <div className="vehicle-summary">
                  <h3>Vehicle Information</h3>
                  <div className="vehicle-card">
                    <div className="vehicle-info-row">
                      <span className="info-label">Make & Model:</span>
                      <span className="info-value">
                        {vehicle.make} {vehicle.model}
                      </span>
                    </div>
                    <div className="vehicle-info-row">
                      <span className="info-label">Year:</span>
                      <span className="info-value">{vehicle.year}</span>
                    </div>
                    <div className="vehicle-info-row">
                      <span className="info-label">Number Plate:</span>
                      <span className="info-value number-plate">{vehicle.number_plate}</span>
                    </div>
                    <div className="vehicle-info-row">
                      <span className="info-label">Mileage:</span>
                      <span className="info-value">{vehicle.current_mileage?.toLocaleString() || "N/A"} miles</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="services-summary">
                <h3>Selected Services</h3>
                <div className="services-list">
                  {serviceRequest?.services?.map((service, index) => (
                    <div key={index} className="service-item">
                      <div className="service-details">
                        <span className="service-name">{service.name}</span>
                      </div>
                      <span className="service-price">Ksh{service.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="total-section">
                  <div className="subtotal">
                    <span>Subtotal</span>
                    <span>Ksh{serviceRequest?.total_price?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="tax">
                    <span>Tax</span>
                    <span>Included</span>
                  </div>
                  <div className="total">
                    <span>Total</span>
                    <span>Ksh{serviceRequest?.total_price?.toFixed(2) || "0.00"}</span>
                  </div>
                </div>
              </div>

              <div className="appointment-preferences">
                <h3>Appointment Preferences</h3>
                <p className="note">Our team will contact you to confirm your appointment time after booking.</p>

                <div className="preference-options">
                  <div className="preference-option">
                    <input type="checkbox" id="morning" name="morning" />
                    <label htmlFor="morning">Morning (8am - 12pm)</label>
                  </div>
                  <div className="preference-option">
                    <input type="checkbox" id="afternoon" name="afternoon" />
                    <label htmlFor="afternoon">Afternoon (12pm - 5pm)</label>
                  </div>
                  <div className="preference-option">
                    <input type="checkbox" id="urgent" name="urgent" />
                    <label htmlFor="urgent">Urgent (Priority Scheduling)</label>
                  </div>
                </div>
              </div>

              <div className="review-actions">
                <button className="back-button" onClick={() => navigate("/service-management")}>
                  Back to Services
                </button>
                <button className="next-button" onClick={handleNextStep}>
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="payment-step">
            <div className="payment-section">
              <h2>Payment Details</h2>

              <div className="payment-methods">
                <div className="payment-method-selector">
                  <label className={paymentMethod === "credit_card" ? "selected" : ""}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={paymentMethod === "credit_card"}
                      onChange={() => setPaymentMethod("credit_card")}
                    />
                    <span className="method-icon">💳</span>
                    <span>Credit Card</span>
                  </label>

                  <label className={paymentMethod === "paypal" ? "selected" : ""}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={() => setPaymentMethod("paypal")}
                    />
                    <span className="method-icon">🅿️</span>
                    <span>PayPal</span>
                  </label>

                  <label className={paymentMethod === "bank_transfer" ? "selected" : ""}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={paymentMethod === "bank_transfer"}
                      onChange={() => setPaymentMethod("bank_transfer")}
                    />
                    <span className="method-icon">🏦</span>
                    <span>Bank Transfer</span>
                  </label>
                </div>
              </div>

              {paymentMethod === "credit_card" && (
                <form onSubmit={handleSubmit} className="payment-form">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group half">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        required
                      />
                    </div>

                    <div className="form-group half">
                      <label>CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Billing Address</label>
                    <input
                      type="text"
                      name="billingAddress"
                      value={formData.billingAddress}
                      onChange={handleInputChange}
                      placeholder="123 Main St"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group half">
                      <label>City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="New York"
                        required
                      />
                    </div>

                    <div className="form-group half">
                      <label>Zip Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="10001"
                        required
                      />
                    </div>
                  </div>

                  <div className="payment-actions">
                    <button type="button" className="back-button" onClick={handlePrevStep}>
                      Back to Review
                    </button>
                    <button type="submit" className="pay-button" disabled={isProcessing}>
                      {isProcessing ? "Processing..." : `Pay $${serviceRequest?.total_price?.toFixed(2) || "0.00"}`}
                    </button>
                  </div>
                </form>
              )}

              {paymentMethod === "paypal" && (
                <div className="paypal-section">
                  <div className="paypal-logo">
                    <span className="paypal-icon">🅿️</span>
                    <span>PayPal</span>
                  </div>
                  <p>You will be redirected to PayPal to complete your payment.</p>
                  <div className="payment-actions">
                    <button type="button" className="back-button" onClick={handlePrevStep}>
                      Back to Review
                    </button>
                    <button onClick={handleSubmit} className="paypal-button" disabled={isProcessing}>
                      {isProcessing ? "Processing..." : "Continue to PayPal"}
                    </button>
                  </div>
                </div>
              )}

              {paymentMethod === "bank_transfer" && (
                <div className="bank-transfer-section">
                  <p>Please use the following details to make your bank transfer:</p>
                  <div className="bank-details">
                    <div className="bank-detail-row">
                      <span className="detail-label">Bank Name:</span>
                      <span className="detail-value">CulServ Bank</span>
                    </div>
                    <div className="bank-detail-row">
                      <span className="detail-label">Account Name:</span>
                      <span className="detail-value">CulServ Vehicle Services</span>
                    </div>
                    <div className="bank-detail-row">
                      <span className="detail-label">Account Number:</span>
                      <span className="detail-value">1234567890</span>
                    </div>
                    <div className="bank-detail-row">
                      <span className="detail-label">Routing Number:</span>
                      <span className="detail-value">987654321</span>
                    </div>
                    <div className="bank-detail-row">
                      <span className="detail-label">Reference:</span>
                      <span className="detail-value">SR-{serviceRequest?.id || "000000"}</span>
                    </div>
                  </div>
                  <p className="note">Note: Please include your Service Request ID as reference.</p>
                  <div className="payment-actions">
                    <button type="button" className="back-button" onClick={handlePrevStep}>
                      Back to Review
                    </button>
                    <button onClick={handleSubmit} className="confirm-button" disabled={isProcessing}>
                      {isProcessing ? "Processing..." : "Confirm Payment"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="order-summary-sidebar">
        <div className="order-summary">
          <h2>Order Summary</h2>

          <div className="summary-content">
            {vehicle && (
              <div className="vehicle-summary-mini">
                <span className="vehicle-icon">🚗</span>
                <span>
                  {vehicle.make} {vehicle.model} ({vehicle.year})
                </span>
              </div>
            )}

            <div className="services-mini">
              {serviceRequest?.services?.map((service, index) => (
                <div key={index} className="service-mini-item">
                  <span>{service.name}</span>
                  <span>Ksh{service.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="total-mini">
              <span>Total</span>
              <span>Ksh{serviceRequest?.total_price?.toFixed(2) || "0.00"}</span>
            </div>
          </div>

          <div className="support-info">
            <h3>Need Help?</h3>
            <p>Contact our support team:</p>
            <p>📞 254 703-201-556</p>
            <p>✉️ support@culserv.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

