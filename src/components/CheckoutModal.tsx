import React, { useState } from 'react';
import { CartItem, Order, UserProfile } from '../types';
import { FREE_GIFT_PROMOTION } from '../data/catalog';
import { X, Calendar, Truck, CreditCard, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, Printer, Gift, Lock, AlertCircle } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useLocation } from '../context/LocationContext';
import { useImageManager } from '../context/ImageManagerContext';
import { isGujaratPinCode, GUJARAT_CITIES, FIXED_STATE } from '../data/locations';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderComplete: (order: Order) => void;
  currentUser?: UserProfile | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderComplete,
  currentUser,
}) => {
  const { simulateEvent } = useNotifications();
  const { location, cityAvailability } = useLocation();
  const { getImage } = useImageManager();

  // Multi-step progress (1: Dates, 2: Delivery, 3: Review & Summary, 4: Payment, 5: Confirmation)
  const [step, setStep] = useState<number>(1);

  // Rental Dates
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3); // Default 3 days in advance
    return d.toISOString().split('T')[0];
  });
  const [rentalDays, setRentalDays] = useState<number>(4);

  // Delivery details pre-filled from authenticated user profile or active Gujarat location
  const [delivery, setDelivery] = useState({
    fullName: currentUser?.fullName || 'Guest Renter',
    phone: currentUser?.phone || '9876543210',
    address: currentUser?.savedAddress?.address || '402, Royal Enclave, Bodakdev',
    city: currentUser?.preferredLocation?.city || location.city || 'Ahmedabad',
    state: FIXED_STATE,
    pincode: currentUser?.savedAddress?.pincode || location.pincode || '380054',
  });
  const [pinValid, setPinValid] = useState<boolean>(() => isGujaratPinCode('380054'));
  const [pinError, setPinError] = useState<string | null>(null);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  // Calculations
  const merchandiseSubtotal = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);
  const refundableDeposit = cartItems.reduce((sum, item) => sum + item.product.deposit, 0);
  const qualifiesForGift = merchandiseSubtotal >= FREE_GIFT_PROMOTION.thresholdAmount;
  const totalPayable = merchandiseSubtotal + refundableDeposit;

  // Calculate return date
  const computeEndDate = (start: string, days: number) => {
    const d = new Date(start);
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleValidatePincode = (code: string) => {
    setDelivery((prev) => ({ ...prev, pincode: code }));
    const trimmed = code.trim();
    if (trimmed.length < 6) {
      setPinValid(false);
      setPinError('Please enter a 6-digit PIN code.');
    } else if (!isGujaratPinCode(trimmed)) {
      setPinValid(false);
      setPinError('Rental delivery is exclusive to Gujarat (supported PINs: 360xxx–396xxx).');
    } else {
      setPinValid(true);
      setPinError(null);
    }
  };

  const handleExecutePayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const newOrder: Order = {
        id: `REN-${Math.floor(1000 + Math.random() * 9000)}`,
        items: [...cartItems],
        subtotal: merchandiseSubtotal,
        refundableDeposit,
        hasFreeGift: qualifiesForGift,
        freeGiftName: qualifiesForGift ? FREE_GIFT_PROMOTION.giftName : undefined,
        totalPaid: totalPayable,
        startDate,
        endDate: computeEndDate(startDate, rentalDays),
        deliveryDetails: { ...delivery },
        paymentMethod: paymentMethod.toUpperCase(),
        createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'Confirmed',
      };

      setConfirmedOrder(newOrder);
      onOrderComplete(newOrder);
      setIsProcessing(false);
      setStep(5); // Confirmation step
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#C8A49F]/40 max-h-[94vh] sm:max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#EEE4DA] to-[#fbe8ef] border-b border-[#C8A49F]/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-base sm:text-lg font-bold text-[#4D0E13]">
              RENTORA Rental Checkout
            </span>
            <span className="text-[10px] sm:text-xs bg-[#C8A49F]/30 text-[#4D0E13] px-2 py-0.5 rounded-full font-semibold">
              Step {step} of 5
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white text-[#2D1517] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Tracker */}
        {step < 5 && (
          <div className="px-4 sm:px-6 py-2.5 bg-[#EEE4DA] border-b border-[#C8A49F]/20 flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-[#5e5460] overflow-x-auto scrollbar-none">
            <span className={step >= 1 ? 'text-[#4D0E13]' : ''}>1. Dates</span>
            <span>·</span>
            <span className={step >= 2 ? 'text-[#4D0E13]' : ''}>2. Delivery</span>
            <span>·</span>
            <span className={step >= 3 ? 'text-[#4D0E13]' : ''}>3. Summary</span>
            <span>·</span>
            <span className={step >= 4 ? 'text-[#4D0E13]' : ''}>4. Payment</span>
          </div>
        )}

        {/* Modal Content Scroll Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 sm:space-y-6">
          
          {/* STEP 1: Rental Dates & Policies */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#2D1517] mb-1">
                  Select Rental Window
                </h3>
                <p className="text-xs text-[#5e5460]">
                  Your outfit arrives 1–2 days prior to your celebration so you can try it comfortably.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#4D0E13] block mb-1.5">
                    Event / Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-xs bg-[#EEE4DA] border border-[#C8A49F]/50 rounded-xl p-3 text-[#2D1517] focus:outline-none focus:ring-1 focus:ring-[#4D0E13]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#4D0E13] block mb-1.5">
                    Rental Duration
                  </label>
                  <select
                    value={rentalDays}
                    onChange={(e) => setRentalDays(Number(e.target.value))}
                    className="w-full text-xs bg-[#EEE4DA] border border-[#C8A49F]/50 rounded-xl p-3 text-[#2D1517] focus:outline-none focus:ring-1 focus:ring-[#4D0E13]"
                  >
                    <option value={3}>3 Days (Express Weekend)</option>
                    <option value={4}>4 Days (Most Popular for Weddings)</option>
                    <option value={7}>7 Days (Outstation / Vacations)</option>
                  </select>
                </div>
              </div>

              {/* Calculated Schedule Preview */}
              <div className="p-4 rounded-2xl bg-[#EEE4DA] border border-[#C8A49F]/40 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#5e5460]">Estimated Delivery:</span>
                  <strong className="text-[#2D1517]">{startDate} (Morning)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5e5460]">Return Pickup Date:</span>
                  <strong className="text-[#4D0E13]">{computeEndDate(startDate, rentalDays)}</strong>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#C8A49F]/20 text-emerald-700">
                  <span>Eco Dry Cleaning:</span>
                  <span className="font-semibold">Handled by RENTORA</span>
                </div>
              </div>

              <div className="p-3 bg-[#fceee8] rounded-xl border border-[#C8A49F]/40 text-[11px] text-[#4D0E13] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#4D0E13] shrink-0" />
                <span>Minor accidental zipper or bead wear is 100% insured. Security deposit is fully refunded upon return.</span>
              </div>
            </div>
          )}

          {/* STEP 2: Delivery Information */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl font-bold text-[#2D1517] mb-1">
                    Delivery Destination
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#54243E] text-white">
                    Gujarat Only 📍
                  </span>
                </div>
                <p className="text-xs text-[#5e5460]">
                  RENTORA couture rentals are exclusively delivered and collected across Gujarat, India.
                </p>
              </div>

              {/* Service area banner */}
              <div className="p-3 bg-[#FFF6F0] rounded-2xl border border-[#D99BAE]/60 text-xs text-[#54243E] flex items-center justify-between gap-2.5 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#54243E] block">
                      Express Hub: {delivery?.city || 'Gujarat'}, Gujarat ({cityAvailability?.deliverySpeed ? cityAvailability.deliverySpeed.split('(')[0] : 'Express 24h'})
                    </span>
                    <span className="text-[11px] text-[#54243E]/80">
                      Est. Arrival: <strong>{cityAvailability?.estimatedDeliveryDate || 'Tomorrow'}</strong> • Carrier: {cityAvailability?.courierPartner ? cityAvailability.courierPartner.split('(')[0] : 'BlueDart'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                  {cityAvailability.availabilityPercentage}% In-Stock
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-[#4D0E13] block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={delivery.fullName}
                    onChange={(e) => setDelivery({ ...delivery, fullName: e.target.value })}
                    className="w-full bg-[#EEE4DA] border border-[#C8A49F]/50 rounded-xl p-2.5 text-[#2D1517] focus:outline-none focus:border-[#4D0E13]"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#4D0E13] block mb-1">Phone Number (+91)</label>
                  <input
                    type="tel"
                    value={delivery.phone}
                    onChange={(e) => setDelivery({ ...delivery, phone: e.target.value })}
                    className="w-full bg-[#EEE4DA] border border-[#C8A49F]/50 rounded-xl p-2.5 text-[#2D1517] focus:outline-none focus:border-[#4D0E13]"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-[#4D0E13] block mb-1">Street Address, Apt / Villa</label>
                  <input
                    type="text"
                    value={delivery.address}
                    onChange={(e) => setDelivery({ ...delivery, address: e.target.value })}
                    className="w-full bg-[#EEE4DA] border border-[#C8A49F]/50 rounded-xl p-2.5 text-[#2D1517] focus:outline-none focus:border-[#4D0E13]"
                    placeholder="House/Flat No., Society, Landmark"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#4D0E13] block mb-1">
                    Gujarat City
                  </label>
                  <select
                    value={delivery.city}
                    onChange={(e) => setDelivery({ ...delivery, city: e.target.value })}
                    className="w-full bg-[#EEE4DA] border border-[#C8A49F]/50 rounded-xl p-2.5 text-[#2D1517] focus:outline-none focus:border-[#4D0E13] cursor-pointer"
                  >
                    {GUJARAT_CITIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} ({c.deliveryTime})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#4D0E13] block mb-1">
                    Gujarat PIN Code (360xxx–396xxx)
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={delivery.pincode}
                    onChange={(e) => handleValidatePincode(e.target.value)}
                    placeholder="e.g. 380054"
                    className={`w-full bg-[#EEE4DA] border rounded-xl p-2.5 text-[#2D1517] focus:outline-none ${
                      pinValid ? 'border-[#C8A49F]/50 focus:border-[#4D0E13]' : 'border-rose-500 focus:border-rose-600 bg-rose-50/40'
                    }`}
                  />
                  {pinError && (
                    <div className="flex items-center gap-1 text-[11px] text-rose-700 mt-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{pinError}</span>
                    </div>
                  )}
                  {pinValid && delivery.pincode.length === 6 && (
                    <div className="flex items-center gap-1 text-[10px] text-emerald-700 mt-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Serviceable Gujarat Delivery Zone ✓</span>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2 flex items-center justify-between p-2.5 bg-white rounded-xl border border-[#C8A49F]/30 text-xs">
                  <span className="text-[#5e5460]">State / Country:</span>
                  <span className="font-bold text-[#54243E] flex items-center gap-1.5">
                    <span>Gujarat, India 🇮🇳</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      Active Coverage Area
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Price Summary & Review */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#2D1517] mb-1">
                  Itemized Order Summary
                </h3>
                <p className="text-xs text-[#5e5460]">
                  Review your pieces, dates, and refundable security deposit before payment.
                </p>
              </div>

              {/* Items summary */}
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-3 bg-[#EEE4DA] rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={getImage(`product-${item.product.id}`, item.product.images[0])}
                        alt={item.product.name}
                        className="w-10 h-10 rounded-lg object-contain p-0.5 bg-white border border-[#C8A49F]/20"
                      />
                      <div>
                        <h5 className="font-bold text-[#2D1517]">{item.product.name}</h5>
                        <span className="text-[10px] text-[#5e5460]">
                          Size: {item.selectedSize} · {item.rentalDurationDays} Days
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-[#4D0E13]">
                      ₹{item.itemTotal.toLocaleString()}
                    </span>
                  </div>
                ))}

                {qualifiesForGift && (
                  <div className="p-3 bg-[#f9e6ee] border border-[#4D0E13]/20 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-[#4D0E13]" />
                      <div>
                        <span className="font-bold text-[#4D0E13]">FREE Surprise Keepsake Gift 🎀</span>
                        <p className="text-[10px] text-[#5e5460]">{FREE_GIFT_PROMOTION.giftName}</p>
                      </div>
                    </div>
                    <span className="text-emerald-700 font-bold font-mono">₹0 (FREE)</span>
                  </div>
                )}
              </div>

              {/* Detailed charges breakdown */}
              <div className="p-4 bg-white rounded-2xl border border-[#C8A49F]/30 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#5e5460]">Net Rental Merchandise Subtotal</span>
                  <span className="font-mono text-[#2D1517] font-semibold tabular-nums">
                    ₹{merchandiseSubtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5e5460]">Refundable Security Deposit (100% Returnable)</span>
                  <span className="font-mono text-[#2D1517] tabular-nums">
                    ₹{refundableDeposit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Express Courier & Home Pickup</span>
                  <span className="font-semibold">FREE (₹0)</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Eco Sanitization & Dry Cleaning</span>
                  <span className="font-semibold">COMPLIMENTARY</span>
                </div>
                <div className="pt-2 border-t border-[#C8A49F]/20 flex justify-between text-sm font-bold text-[#4D0E13]">
                  <span>Total Amount Due</span>
                  <span className="font-serif text-lg font-mono tabular-nums">
                    ₹{totalPayable.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Payment Simulation */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#2D1517] mb-1">
                  Secure Rental Payment
                </h3>
                <p className="text-xs text-[#5e5460]">
                  Processed securely. Prototype environment: no real bank charges applied.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'upi', label: 'UPI / QR', icon: '📱' },
                  { id: 'card', label: 'Credit / Debit', icon: '💳' },
                  { id: 'netbanking', label: 'NetBanking', icon: '🏦' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-3.5 rounded-2xl text-center border transition-all cursor-pointer ${
                      paymentMethod === m.id
                        ? 'bg-[#4D0E13] text-white border-[#4D0E13] shadow-sm'
                        : 'bg-[#EEE4DA] text-[#2D1517] border-[#C8A49F]/40 hover:border-[#4D0E13]'
                    }`}
                  >
                    <span className="text-xl block mb-1">{m.icon}</span>
                    <span className="text-xs font-semibold">{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Method preview */}
              <div className="p-4 bg-[#EEE4DA] rounded-2xl border border-[#C8A49F]/40 text-xs">
                {paymentMethod === 'upi' && (
                  <div className="flex flex-col items-center gap-2 text-center py-2">
                    <span className="font-bold text-[#4D0E13]">Instant UPI Instant Verification</span>
                    <p className="text-[11px] text-[#5e5460]">Supports Google Pay, PhonePe, Paytm & BHIM</p>
                    <div className="px-4 py-2 bg-white rounded-lg border border-[#C8A49F]/50 font-mono text-xs">
                      rentora@icici
                    </div>
                  </div>
                )}
                {paymentMethod === 'card' && (
                  <div className="space-y-2">
                    <span className="font-bold text-[#4D0E13] block">Card Details (Demo mode)</span>
                    <input
                      type="text"
                      disabled
                      value="•••• •••• •••• 4242 (Verified Token)"
                      className="w-full bg-white border border-[#C8A49F]/50 rounded-xl p-2.5 text-xs text-gray-500"
                    />
                  </div>
                )}
                {paymentMethod === 'netbanking' && (
                  <div className="space-y-2">
                    <span className="font-bold text-[#4D0E13] block">Select Verified Bank</span>
                    <select className="w-full bg-white border border-[#C8A49F]/50 rounded-xl p-2 text-xs">
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>State Bank of India</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#5e5460]">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit Encrypted Payment Simulation with immediate order guarantee.</span>
              </div>
            </div>
          )}

          {/* STEP 5: Order Confirmation */}
          {step === 5 && confirmedOrder && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs uppercase font-bold text-[#4D0E13] tracking-wider block mb-1">
                  Booking Confirmed! 🎀
                </span>
                <h3 className="font-serif text-3xl font-bold text-[#2D1517]">
                  Order #{confirmedOrder.id}
                </h3>
                <p className="text-xs text-[#5e5460] mt-1 max-w-sm mx-auto">
                  Your luxury ensemble has been reserved and queued for high-grade sanitization & dispatch.
                </p>
              </div>

              {/* Order specifics card */}
              <div className="p-5 bg-[#EEE4DA] rounded-2xl border border-[#C8A49F]/40 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#5e5460]">Delivery Expected:</span>
                  <strong className="text-[#2D1517]">{confirmedOrder.startDate} (Morning)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5e5460]">Return Pickup Scheduled:</span>
                  <strong className="text-[#4D0E13]">{confirmedOrder.endDate}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5e5460]">Shipping Address:</span>
                  <span className="text-right text-[#2D1517] max-w-[200px] truncate">
                    {confirmedOrder.deliveryDetails.address}, {confirmedOrder.deliveryDetails.city}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#C8A49F]/20 font-bold">
                  <span>Total Paid (Includes Deposit):</span>
                  <span className="text-[#4D0E13] font-mono">₹{confirmedOrder.totalPaid.toLocaleString()}</span>
                </div>
                {confirmedOrder.hasFreeGift && (
                  <div className="pt-2 border-t border-[#C8A49F]/20 text-emerald-700 font-semibold flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-[#C8A49F]" />
                    <span>Free Surprise Gift included in shipment! 🎁</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#4D0E13] text-[#4D0E13] text-xs font-semibold hover:bg-[#EEE4DA] transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-[#4D0E13] text-white text-xs font-semibold hover:bg-[#3b172b] transition-all cursor-pointer shadow-md"
                >
                  Done & Back to Closet
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Actions */}
        {step < 5 && (
          <div className="p-5 bg-[#EEE4DA] border-t border-[#C8A49F]/30 flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4D0E13] hover:underline cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 2 && !pinValid}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#4D0E13] text-white text-xs font-semibold hover:bg-[#3b172b] disabled:opacity-40 transition-all cursor-pointer shadow-md"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C8A49F]" />
              </button>
            ) : (
              <button
                onClick={handleExecutePayment}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#4D0E13] text-white text-xs font-semibold hover:bg-[#3b172b] disabled:opacity-50 transition-all cursor-pointer shadow-md"
              >
                {isProcessing ? (
                  <span>Securing Order...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-[#C8A49F]" />
                    <span>Pay ₹{totalPayable.toLocaleString()} & Confirm Rental</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
