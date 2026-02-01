import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

// ============================================
// YOKO SIZZLERS PURCHASE ORDER SYSTEM
// ============================================

// Supabase Client
const SUPABASE_URL = 'https://rrmscslchpjpatcdimtv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJybXNjc2xjaHBqcGF0Y2RpbXR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NzQxMzUsImV4cCI6MjA4NTU1MDEzNX0.tJAgiO6_yp2yTQbCEEYhaCbA0O6aG0cZsodbGBnGX5w';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  global: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Accept-Profile': 'public',
      'Content-Profile': 'public',
    },
  },
});
const getSupabase = () => supabaseClient;

// Global Animation Styles Component
function GlobalStyles() {
  return (
    <style>{`
      @keyframes modal-in {
        from { opacity: 0; transform: scale(0.95) translateY(10px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
      }
      @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slide-up {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes slide-in-right {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes bounce-in {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes pulse-soft {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }
      @keyframes pop {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }
      @keyframes count-up {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-modal-in { animation: modal-in 0.3s ease-out; }
      .animate-fade-in { animation: fade-in 0.3s ease-out; }
      .animate-slide-up { animation: slide-up 0.4s ease-out; }
      .animate-slide-in-right { animation: slide-in-right 0.3s ease-out; }
      .animate-bounce-in { animation: bounce-in 0.5s ease-out; }
      .animate-pulse-soft { animation: pulse-soft 2s infinite; }
      .animate-shake { animation: shake 0.3s ease-out; }
      .animate-pop { animation: pop 0.2s ease-out; }
      .animate-count-up { animation: count-up 0.3s ease-out; }
      
      /* Button press effect */
      .btn-press:active { transform: scale(0.96); }
      
      /* Tab switch animation */
      .tab-content { animation: fade-in 0.2s ease-out; }
      
      /* Card hover lift */
      .card-hover { transition: transform 0.2s, box-shadow 0.2s; }
      .card-hover:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
      
      /* Number change animation */
      .number-animate { transition: all 0.3s ease-out; }
      
      /* Ripple effect for buttons */
      .ripple { position: relative; overflow: hidden; }
      .ripple::after {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
        transform: scale(0);
        opacity: 0;
        transition: transform 0.5s, opacity 0.3s;
      }
      .ripple:active::after {
        transform: scale(2);
        opacity: 1;
        transition: transform 0s, opacity 0s;
      }
      
      /* Progress bar animation */
      .progress-animate {
        transition: width 1s ease-out;
      }
      
      /* Stagger children animation */
      .stagger-children > * {
        animation: slide-up 0.4s ease-out backwards;
      }
      .stagger-children > *:nth-child(1) { animation-delay: 0s; }
      .stagger-children > *:nth-child(2) { animation-delay: 0.05s; }
      .stagger-children > *:nth-child(3) { animation-delay: 0.1s; }
      .stagger-children > *:nth-child(4) { animation-delay: 0.15s; }
      .stagger-children > *:nth-child(5) { animation-delay: 0.2s; }
      .stagger-children > *:nth-child(6) { animation-delay: 0.25s; }
    `}</style>
  );
}

// Animation Hook for counting numbers
const useCountAnimation = (target, duration = 1000) => {
  const [count, setCount] = useState(target);
  
  useEffect(() => {
    let startTime = null;
    const startValue = count;
    const diff = target - startValue;
    
    if (diff === 0) return;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(startValue + diff * easeOut));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [target, duration]);
  
  return count;
};

// AI Analysis Functions (Simulated - In production, would call actual AI API)
const AIAnalytics = {
  // Analyze if outlet is over-ordering compared to last week
  analyzeOverOrdering: (orders, outlet, items) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    // Get this week's orders
    const thisWeekOrders = orders.filter(o => 
      o.outlet === outlet && 
      new Date(o.createdAt) >= oneWeekAgo
    );
    
    // Get last week's orders
    const lastWeekOrders = orders.filter(o => 
      o.outlet === outlet && 
      new Date(o.createdAt) >= twoWeeksAgo && 
      new Date(o.createdAt) < oneWeekAgo
    );
    
    // Aggregate quantities by item
    const thisWeekQty = {};
    const lastWeekQty = {};
    
    thisWeekOrders.forEach(order => {
      order.items.forEach(item => {
        thisWeekQty[item.id] = (thisWeekQty[item.id] || 0) + item.quantity;
      });
    });
    
    lastWeekOrders.forEach(order => {
      order.items.forEach(item => {
        lastWeekQty[item.id] = (lastWeekQty[item.id] || 0) + item.quantity;
      });
    });
    
    // Find items ordered 30% or more than last week
    const overOrderedItems = [];
    Object.keys(thisWeekQty).forEach(itemId => {
      const thisWeek = thisWeekQty[itemId];
      const lastWeek = lastWeekQty[itemId] || 0;
      
      if (lastWeek > 0 && thisWeek > lastWeek * 1.3) {
        const item = items.find(i => i.id === parseInt(itemId));
        if (item) {
          overOrderedItems.push({
            item,
            thisWeek,
            lastWeek,
            increase: Math.round(((thisWeek - lastWeek) / lastWeek) * 100)
          });
        }
      }
    });
    
    return overOrderedItems.sort((a, b) => b.increase - a.increase);
  },

  // Generate auto-order suggestions based on day and month patterns
  generateAutoOrderSuggestions: (orders, outlet, items, categories) => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0-6
    const month = now.getMonth(); // 0-11
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
    
    // Analyze historical patterns (simulated AI logic)
    const suggestions = [];
    
    // Weekend patterns - more orders typically
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
    
    // Festive months (Oct-Dec) have higher demand
    const isFestiveSeason = month >= 9 && month <= 11;
    
    // Calculate average weekly consumption per item
    const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
    const recentOrders = orders.filter(o => 
      o.outlet === outlet && 
      new Date(o.createdAt) >= fourWeeksAgo
    );
    
    const itemConsumption = {};
    recentOrders.forEach(order => {
      order.items.forEach(item => {
        if (!itemConsumption[item.id]) {
          itemConsumption[item.id] = { total: 0, orders: 0 };
        }
        itemConsumption[item.id].total += item.quantity;
        itemConsumption[item.id].orders += 1;
      });
    });
    
    // Generate suggestions for frequently ordered items
    Object.keys(itemConsumption).forEach(itemId => {
      const data = itemConsumption[itemId];
      const avgPerWeek = data.total / 4;
      
      if (avgPerWeek > 0) {
        const item = items.find(i => i.id === parseInt(itemId));
        if (item) {
          let suggestedQty = Math.ceil(avgPerWeek);
          
          // Adjust for weekend
          if (isWeekend) suggestedQty = Math.ceil(suggestedQty * 1.2);
          
          // Adjust for festive season
          if (isFestiveSeason) suggestedQty = Math.ceil(suggestedQty * 1.3);
          
          suggestions.push({
            item,
            suggestedQty,
            avgPerWeek: avgPerWeek.toFixed(1),
            reason: isWeekend && isFestiveSeason 
              ? `${dayName} + Festive season demand` 
              : isWeekend 
                ? `Higher ${dayName} demand` 
                : isFestiveSeason 
                  ? 'Festive season demand'
                  : 'Based on 4-week average'
          });
        }
      }
    });
    
    return suggestions.sort((a, b) => b.suggestedQty - a.suggestedQty).slice(0, 10);
  },

  // Simulated vendor price comparison (In production, would scrape/API call)
  compareVendorPrices: (items) => {
    // Simulated Mumbai vendors
    const vendors = [
      { name: 'Mumbai Fresh Supplies', location: 'Crawford Market', rating: 4.5 },
      { name: 'Bharat Wholesale', location: 'Vashi APMC', rating: 4.2 },
      { name: 'Quality Meats Mumbai', location: 'Byculla', rating: 4.7 },
      { name: 'Farm Direct Produce', location: 'Navi Mumbai', rating: 4.3 },
      { name: 'Metro Cash & Carry', location: 'Andheri', rating: 4.4 },
    ];
    
    const priceAlerts = [];
    
    items.forEach(item => {
      // Simulate finding a cheaper vendor (30% chance)
      if (Math.random() < 0.3) {
        const vendor = vendors[Math.floor(Math.random() * vendors.length)];
        const discount = Math.floor(Math.random() * 20) + 5; // 5-25% cheaper
        const vendorPrice = Math.round(item.price * (1 - discount / 100));
        
        priceAlerts.push({
          item,
          currentPrice: item.price,
          vendorPrice,
          vendor,
          savings: item.price - vendorPrice,
          savingsPercent: discount
        });
      }
    });
    
    return priceAlerts.sort((a, b) => b.savingsPercent - a.savingsPercent);
  }
};

// Animated Stat Card Component
function AnimatedStatCard({ title, value, icon, color = 'amber', prefix = '', suffix = '', isAnimated = true }) {
  const numericValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]+/g, '')) || 0;
  const animatedValue = useCountAnimation(isAnimated ? numericValue : 0, 800);
  const displayValue = isAnimated ? animatedValue : numericValue;
  
  const colorClasses = {
    amber: 'from-amber-500 to-orange-500',
    emerald: 'from-emerald-500 to-green-500',
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    red: 'from-red-500 to-orange-500',
    yellow: 'from-yellow-500 to-amber-500',
  };

  return (
    <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-4 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color] || colorClasses.amber} opacity-5 group-hover:opacity-10 transition-opacity`} />
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl">{icon}</span>
        </div>
        <p className="text-3xl font-bold text-white mb-1">
          {prefix}{displayValue.toLocaleString('en-IN')}{suffix}
        </p>
        <p className="text-sm text-stone-400">{title}</p>
      </div>
    </div>
  );
}

// Animated Progress Bar Component
function AnimatedProgressBar({ value, max, color = 'amber', showLabel = true, height = 'h-3' }) {
  const [width, setWidth] = useState(0);
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  
  useEffect(() => {
    const timer = setTimeout(() => setWidth(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  const getColor = () => {
    if (percentage > 100) return 'from-red-500 to-red-600';
    if (percentage > 80) return 'from-yellow-500 to-amber-500';
    return 'from-emerald-500 to-green-500';
  };

  return (
    <div>
      {showLabel && (
        <div className="flex justify-between text-xs mb-1">
          <span className="text-stone-500">Usage</span>
          <span className={percentage > 100 ? 'text-red-400' : percentage > 80 ? 'text-yellow-400' : 'text-stone-400'}>{percentage.toFixed(1)}%</span>
        </div>
      )}
      <div className={`${height} bg-stone-700 rounded-full overflow-hidden`}>
        <div 
          className={`h-full rounded-full bg-gradient-to-r ${getColor()} transition-all duration-1000 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

// Order Success Animation Component
function OrderSuccessAnimation({ show, onClose, orderId }) {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-stone-900 border border-emerald-500/30 rounded-3xl p-8 text-center max-w-sm mx-4 transform animate-bounce-in">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Order Placed!</h3>
        {orderId && <p className="text-emerald-400 font-mono text-lg mb-2">{orderId}</p>}
        <p className="text-stone-400 mb-6">Your order has been sent to Central Kitchen for processing.</p>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// AI Alert Card Component
function AIAlertCard({ type, title, description, items, onDismiss, onAction, actionLabel }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const typeStyles = {
    warning: { bg: 'from-orange-500/20 to-amber-500/20', border: 'border-orange-500/30', icon: '⚠️', titleColor: 'text-orange-400' },
    info: { bg: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30', icon: '💡', titleColor: 'text-blue-400' },
    success: { bg: 'from-emerald-500/20 to-green-500/20', border: 'border-emerald-500/30', icon: '✅', titleColor: 'text-emerald-400' },
    price: { bg: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30', icon: '💰', titleColor: 'text-purple-400' },
    ai: { bg: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/30', icon: '🤖', titleColor: 'text-cyan-400' },
  };
  
  const style = typeStyles[type] || typeStyles.info;

  return (
    <div className={`bg-gradient-to-r ${style.bg} border ${style.border} rounded-2xl p-4 transition-all duration-300 hover:scale-[1.01]`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{style.icon}</span>
          <div>
            <h4 className={`font-semibold ${style.titleColor} flex items-center gap-2`}>
              {title}
              <span className="text-xs px-2 py-0.5 bg-white/10 rounded-full text-white/70">AI Insight</span>
            </h4>
            <p className="text-sm text-stone-400 mt-1">{description}</p>
          </div>
        </div>
        {onDismiss && (
          <button onClick={onDismiss} className="text-stone-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {items && items.length > 0 && (
        <>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 text-sm text-stone-400 hover:text-white transition-colors flex items-center gap-1"
          >
            {isExpanded ? 'Hide' : 'Show'} {items.length} items
            <svg className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isExpanded && (
            <div className="mt-3 space-y-2">
              {items}
            </div>
          )}
        </>
      )}
      
      {onAction && (
        <button
          onClick={onAction}
          className="mt-3 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
        >
          {actionLabel || 'Take Action'}
        </button>
      )}
    </div>
  );
}

// Mock Data Store (simulating backend)
const DATA_VERSION = 'v10'; // Increment this to reset localStorage

// Monthly revenue data (in lakhs, stored as actual values)
const INITIAL_REVENUE_DATA = {
  Santacruz: {
    // Average 60L per month, with seasonal variations
    1: 5500000, 2: 5200000, 3: 5800000, 4: 5400000, 5: 5000000, 6: 4800000,
    7: 5200000, 8: 5600000, 9: 5400000, 10: 6200000, 11: 6800000, 12: 7500000
  },
  Bandra: {
    // Average 28L per month
    1: 2600000, 2: 2400000, 3: 2700000, 4: 2500000, 5: 2300000, 6: 2200000,
    7: 2400000, 8: 2600000, 9: 2500000, 10: 2900000, 11: 3200000, 12: 3500000
  },
  Oshiwara: {
    // Average 45L per month
    1: 4200000, 2: 3900000, 3: 4400000, 4: 4100000, 5: 3800000, 6: 3600000,
    7: 4000000, 8: 4300000, 9: 4100000, 10: 4700000, 11: 5100000, 12: 5600000
  }
};

const INITIAL_DATA = {
  version: DATA_VERSION,
  users: {
    '9167868642': { role: 'outlet', outlet: 'Santacruz', name: 'Santacruz Manager' },
    '9167868644': { role: 'outlet', outlet: 'Bandra', name: 'Bandra Manager' },
    '9167868641': { role: 'outlet', outlet: 'Oshiwara', name: 'Oshiwara Manager' },
    '9167868645': { role: 'central_kitchen', name: 'Central Kitchen Manager' },
    '9819822217': { role: 'admin', name: 'Main Admin' },
  },
  revenueData: INITIAL_REVENUE_DATA,
  orderCounters: {
    Santacruz: 0,
    Bandra: 0,
    Oshiwara: 0
  },
  categories: [
    { id: 1, name: 'Oil', description: 'Cooking oils' },
    { id: 2, name: 'Veggie Mix', description: 'Mixed vegetables for sizzlers' },
    { id: 3, name: 'Exotic', description: 'Exotic vegetables and ingredients' },
    { id: 4, name: 'Sides', description: 'Side dishes and accompaniments' },
    { id: 5, name: 'Base', description: 'Rice, pasta, noodles and bases' },
    { id: 6, name: 'Mains', description: 'Main course proteins and cutlets' },
    { id: 7, name: 'Sauces', description: 'Sauces and gravies' },
    { id: 8, name: 'Cheese', description: 'Cheese varieties' },
    { id: 9, name: 'Butter', description: 'Butter products' },
    { id: 10, name: 'Liquid', description: 'Beverages, juices and liquid ingredients' },
    { id: 11, name: 'Vegetable', description: 'Fresh vegetables' },
    { id: 12, name: 'Seasoning', description: 'Spices and seasonings' },
  ],
  items: [
    // === Oil ===
    { id: 1, name: 'Oil', categoryId: 1, unit: 'litre', price: 148, pkg: 'tin', wt: 15, totalWt: 15, rmc: 2220 },

    // === Veggie Mix ===
    { id: 2, name: 'Cabbage', categoryId: 2, unit: 'kg', price: 26, pkg: 'pcs', wt: 1, totalWt: 1, rmc: 26 },
    { id: 3, name: 'Cauliflower', categoryId: 2, unit: 'kg', price: 48, pkg: 'pcs', wt: 1, totalWt: 1, rmc: 48 },
    { id: 4, name: 'French Beans', categoryId: 2, unit: 'kg', price: 50, pkg: 'loose', wt: 1, totalWt: 1, rmc: 50 },
    { id: 5, name: 'Green Peas', categoryId: 2, unit: 'kg', price: 85, pkg: 'pkt', wt: 1, totalWt: 1, rmc: 85 },
    { id: 6, name: 'Spinach', categoryId: 2, unit: 'kg', price: 18, pkg: 'bundle', wt: 1, totalWt: 1, rmc: 18 },
    { id: 7, name: 'Carrot', categoryId: 2, unit: 'kg', price: 48, pkg: 'loose', wt: 1, totalWt: 1, rmc: 48 },
    { id: 8, name: 'Tomato', categoryId: 2, unit: 'kg', price: 44, pkg: 'loose', wt: 1, totalWt: 1, rmc: 44 },
    { id: 9, name: 'Onion (Saute)', categoryId: 2, unit: 'kg', price: 30, pkg: 'kg', wt: 1, totalWt: 1, rmc: 30 },

    // === Exotic ===
    { id: 10, name: 'Baked Beans', categoryId: 3, unit: 'kg', price: 132.24, pkg: 'tin', wt: 0.42, totalWt: 0.415, rmc: 54.88 },
    { id: 11, name: 'Babycorn', categoryId: 3, unit: 'kg', price: 140, pkg: 'pkt', wt: 1, totalWt: 1, rmc: 140 },
    { id: 12, name: 'Mushroom', categoryId: 3, unit: 'kg', price: 180, pkg: 'pkt', wt: 1, totalWt: 1, rmc: 180 },
    { id: 13, name: 'Pak Choi', categoryId: 3, unit: 'kg', price: 80, pkg: 'bundle', wt: 1, totalWt: 1, rmc: 80 },
    { id: 14, name: 'Broccoli', categoryId: 3, unit: 'kg', price: 90, pkg: 'pcs', wt: 1, totalWt: 1, rmc: 90 },
    { id: 15, name: 'Green Bell Peppers', categoryId: 3, unit: 'kg', price: 50, pkg: 'pcs', wt: 1, totalWt: 1, rmc: 50 },
    { id: 16, name: 'R/Y Bell Peppers', categoryId: 3, unit: 'kg', price: 130, pkg: 'pcs', wt: 1, totalWt: 1, rmc: 130 },
    { id: 17, name: 'Pineapple (Sliced)', categoryId: 3, unit: 'kg', price: 110.27, pkg: 'tin', wt: 0.85, totalWt: 0.85, rmc: 93.73 },
    { id: 18, name: 'Onions (Grilled)', categoryId: 3, unit: 'kg', price: 30, pkg: 'kg', wt: 1, totalWt: 1, rmc: 30 },
    { id: 19, name: 'Lemon', categoryId: 3, unit: 'kg', price: 3, pkg: 'pcs', wt: 1, totalWt: 1, rmc: 3 },

    // === Sides ===
    { id: 20, name: 'French Fries', categoryId: 4, unit: 'kg', price: 45.78, pkg: 'pkt', wt: 2.25, totalWt: 5.625, rmc: 257.50 },

    // === Base ===
    { id: 21, name: 'Rice', categoryId: 5, unit: 'kg', price: 85, pkg: 'bag', wt: 1, totalWt: 30, rmc: 2550 },
    { id: 22, name: 'Fried Rice', categoryId: 5, unit: 'kg', price: 2.64, pkg: 'kg', wt: 20, totalWt: 0, rmc: 0 },
    { id: 23, name: 'Spaghetti', categoryId: 5, unit: 'kg', price: 116.48, pkg: 'pkt', wt: 0.5, totalWt: 0.5, rmc: 58.24 },
    { id: 24, name: 'Noodles', categoryId: 5, unit: 'kg', price: 120, pkg: 'pkt', wt: 0.2, totalWt: 0.2, rmc: 24 },
    { id: 25, name: 'Pasta', categoryId: 5, unit: 'kg', price: 116.48, pkg: 'pkt', wt: 0.5, totalWt: 0.5, rmc: 58.24 },
    { id: 26, name: 'Flour', categoryId: 5, unit: 'kg', price: 23.75, pkg: 'bag', wt: 16, totalWt: 16, rmc: 380 },
    { id: 27, name: 'Donut', categoryId: 5, unit: 'unit', price: 1.41, pkg: 'box', wt: 12, totalWt: 12, rmc: 16.95 },
    { id: 28, name: 'Brownie', categoryId: 5, unit: 'unit', price: 35, pkg: 'box', wt: 15, totalWt: 15, rmc: 525 },
    { id: 29, name: 'Ice Cream', categoryId: 5, unit: 'ltr', price: 95, pkg: 'box', wt: 4, totalWt: 4, rmc: 380 },
    { id: 30, name: 'Hot Dog Brioche Roll', categoryId: 5, unit: 'unit', price: 1.50, pkg: 'unit', wt: 6, totalWt: 0, rmc: 9 },
    { id: 31, name: 'Bread Crumbs', categoryId: 5, unit: 'kg', price: 7, pkg: 'bag', wt: 10, totalWt: 10, rmc: 70 },

    // === Mains ===
    { id: 32, name: 'Veg Cutlet', categoryId: 6, unit: 'pcs', price: 111.62, pkg: 'kg', wt: 20, totalWt: 20, rmc: 111.62 },
    { id: 33, name: 'Veg Satellite Cutlet', categoryId: 6, unit: 'pcs', price: 111.62, pkg: 'kg', wt: 3, totalWt: 3, rmc: 111.62 },
    { id: 34, name: 'Paneer Cutlet', categoryId: 6, unit: 'pcs', price: 420, pkg: 'kg', wt: 4, totalWt: 4, rmc: 420 },
    { id: 35, name: 'Paneer (Fried 4 pcs)', categoryId: 6, unit: 'pcs', price: 44, pkg: 'kg', wt: 8, totalWt: 8, rmc: 352 },
    { id: 36, name: 'Paneer (Fried 8 pcs)', categoryId: 6, unit: 'pcs', price: 88, pkg: 'kg', wt: 4, totalWt: 4, rmc: 352 },
    { id: 37, name: 'Chicken (Grilled)', categoryId: 6, unit: 'kg', price: 165, pkg: 'pkt', wt: 2, totalWt: 2, rmc: 650 },
    { id: 38, name: 'Chicken (YSC)', categoryId: 6, unit: 'kg', price: 325, pkg: 'pkt', wt: 2, totalWt: 2, rmc: 650 },
    { id: 39, name: 'Chicken Sausage', categoryId: 6, unit: 'pcs', price: 25.51, pkg: 'pkt', wt: 9, totalWt: 9, rmc: 229.60 },
    { id: 40, name: 'Mutton/Lamb (Grilled)', categoryId: 6, unit: 'kg', price: 1333.33, pkg: 'pcs', wt: 1.2, totalWt: 1.2, rmc: 1600 },
    { id: 41, name: 'Lamb Kidney', categoryId: 6, unit: 'pcs', price: 35, pkg: 'pcs', wt: 1, totalWt: 1, rmc: 35 },
    { id: 42, name: 'Lamb Liver', categoryId: 6, unit: 'kg', price: 580, pkg: 'kg', wt: 1, totalWt: 1, rmc: 580 },
    { id: 43, name: 'Mutton Chops', categoryId: 6, unit: 'kg', price: 640, pkg: 'kg', wt: 1, totalWt: 1, rmc: 640 },
    { id: 44, name: 'Steak (Grilled)', categoryId: 6, unit: 'kg', price: 500, pkg: 'kg', wt: 1, totalWt: 1, rmc: 500 },
    { id: 45, name: 'Steak (YSS)', categoryId: 6, unit: 'kg', price: 500, pkg: 'pkt', wt: 1, totalWt: 1, rmc: 500 },
    { id: 46, name: 'Fish', categoryId: 6, unit: 'pcs', price: 312.50, pkg: 'pcs', wt: 4, totalWt: 4, rmc: 1250 },
    { id: 47, name: 'Prawns (Grilled)', categoryId: 6, unit: 'pcs', price: 38.64, pkg: 'kg', wt: 22, totalWt: 22, rmc: 850 },
    { id: 48, name: 'Lobster', categoryId: 6, unit: 'pcs', price: 700, pkg: 'kg', wt: 2, totalWt: 2, rmc: 1400 },
    { id: 49, name: 'Egg', categoryId: 6, unit: 'unit', price: 7.30, pkg: 'pkt', wt: 1, totalWt: 30, rmc: 219 },
    { id: 50, name: 'Paneer', categoryId: 6, unit: 'kg', price: 367, pkg: 'pkt', wt: 1, totalWt: 1, rmc: 367 },
    { id: 51, name: 'Chicken Bone', categoryId: 6, unit: 'kg', price: 230, pkg: 'pkt', wt: 1.3, totalWt: 1, rmc: 230 },
    { id: 52, name: 'Chicken Boneless', categoryId: 6, unit: 'kg', price: 336, pkg: 'pkt', wt: 1, totalWt: 2, rmc: 672 },
    { id: 53, name: 'Steak', categoryId: 6, unit: 'kg', price: 440, pkg: 'pkt', wt: 1, totalWt: 1, rmc: 440 },
    { id: 54, name: 'Prawns', categoryId: 6, unit: 'kg', price: 750, pkg: 'pkt', wt: 1, totalWt: 1, rmc: 750 },

    // === Sauces ===
    { id: 55, name: 'Garlic Sauce', categoryId: 7, unit: 'ltr', price: 116.74, pkg: 'tub', wt: 60, totalWt: 60, rmc: 0 },
    { id: 56, name: 'Pepper Sauce', categoryId: 7, unit: 'ltr', price: 0, pkg: 'tub', wt: 30, totalWt: 30, rmc: 0 },
    { id: 57, name: 'Mushroom Sauce', categoryId: 7, unit: 'ltr', price: 0, pkg: 'tub', wt: 20, totalWt: 20, rmc: 0 },
    { id: 58, name: 'Spaghetti Sauce', categoryId: 7, unit: 'ltr', price: 0, pkg: 'tub', wt: 100, totalWt: 100, rmc: 0 },
    { id: 59, name: 'Pasta Sauce', categoryId: 7, unit: 'ltr', price: 0, pkg: 'tub', wt: 100, totalWt: 100, rmc: 0 },
    { id: 60, name: 'Schezwuan Sauce', categoryId: 7, unit: 'ltr', price: 14.13, pkg: 'btl', wt: 12, totalWt: 12, rmc: 169.60 },
    { id: 61, name: 'Sweet Sauce', categoryId: 7, unit: 'ltr', price: 0, pkg: 'tub', wt: 100, totalWt: 100, rmc: 0 },
    { id: 62, name: 'Soya Sauce', categoryId: 7, unit: 'kg', price: 83.55, pkg: 'jar', wt: 25, totalWt: 25, rmc: 2088.80 },

    // === Cheese ===
    { id: 63, name: 'Cheese Block', categoryId: 8, unit: 'kg', price: 497, pkg: 'pkt', wt: 1, totalWt: 1, rmc: 497 },
    { id: 64, name: 'Cheese Slice', categoryId: 8, unit: 'kg', price: 6.43, pkg: 'pkt', wt: 51, totalWt: 51, rmc: 328 },

    // === Butter ===
    { id: 65, name: 'Butter', categoryId: 9, unit: 'kg', price: 556, pkg: 'pkt', wt: 0.5, totalWt: 0.5, rmc: 278 },

    // === Liquid ===
    { id: 66, name: 'Tomato Ketchup', categoryId: 10, unit: 'ltr', price: 83.12, pkg: 'bottle', wt: 0.95, totalWt: 0.95, rmc: 78.96 },
    { id: 67, name: 'Lemon Juice', categoryId: 10, unit: 'ltr', price: 133.33, pkg: 'bottle', wt: 0.03, totalWt: 0.06, rmc: 8 },
    { id: 68, name: 'White Vinegar', categoryId: 10, unit: 'ltr', price: 33.05, pkg: 'bottle', wt: 5, totalWt: 5, rmc: 165.25 },
    { id: 69, name: 'Water', categoryId: 10, unit: 'ltr', price: 12.11, pkg: 'bottle', wt: 1, totalWt: 1, rmc: 12.11 },
    { id: 70, name: 'Orange Juice', categoryId: 10, unit: 'ltr', price: 106.96, pkg: 'bottle', wt: 1, totalWt: 1, rmc: 106.96 },
    { id: 71, name: 'Worcestershire Sauce', categoryId: 10, unit: 'ltr', price: 294, pkg: 'bottle', wt: 0.2, totalWt: 0.2, rmc: 58.80 },
    { id: 72, name: 'Dark Soya Sauce', categoryId: 10, unit: 'kg', price: 83.55, pkg: 'bottle', wt: 25, totalWt: 25, rmc: 2088.80 },
    { id: 73, name: 'Ice Cubes', categoryId: 10, unit: 'kg', price: 8, pkg: 'bag', wt: 1, totalWt: 1, rmc: 8 },
    { id: 74, name: 'Sugar Syrup', categoryId: 10, unit: 'ltr', price: 45.40, pkg: 'bottle', wt: 1, totalWt: 1, rmc: 45.40 },
    { id: 75, name: 'Soda', categoryId: 10, unit: 'ltr', price: 25, pkg: 'bottle', wt: 0.3, totalWt: 0.3, rmc: 7.50 },
    { id: 76, name: 'Tea Powder', categoryId: 10, unit: 'kg', price: 370, pkg: 'pkt', wt: 1, totalWt: 1, rmc: 370 },
    { id: 77, name: 'Coffee Powder', categoryId: 10, unit: 'kg', price: 40, pkg: 'pkt', wt: 10, totalWt: 10, rmc: 400 },
    { id: 78, name: 'Milk', categoryId: 10, unit: 'ltr', price: 72, pkg: 'pkt', wt: 1, totalWt: 1, rmc: 72 },
    { id: 79, name: 'Chocolate Sauce', categoryId: 10, unit: 'ltr', price: 160, pkg: 'bottle', wt: 1.3, totalWt: 1.3, rmc: 208 },
    { id: 80, name: 'Peach Iced Tea Powder', categoryId: 10, unit: 'kg', price: 470, pkg: 'pkt', wt: 1, totalWt: 1, rmc: 470 },

    // === Vegetable ===
    { id: 81, name: 'French Beans (Fresh)', categoryId: 11, unit: 'kg', price: 50, pkg: 'loose', wt: 1, totalWt: 1, rmc: 50 },
    { id: 82, name: 'Carrot (Fresh)', categoryId: 11, unit: 'kg', price: 48, pkg: 'loose', wt: 1, totalWt: 1, rmc: 48 },
    { id: 83, name: 'Green Peas (Fresh)', categoryId: 11, unit: 'kg', price: 85, pkg: 'loose', wt: 1, totalWt: 1, rmc: 85 },
    { id: 84, name: 'Potato', categoryId: 11, unit: 'kg', price: 0.42, pkg: 'bag', wt: 1, totalWt: 50, rmc: 21 },
    { id: 85, name: 'Ginger', categoryId: 11, unit: 'kg', price: 60, pkg: 'loose', wt: 1, totalWt: 1, rmc: 60 },
    { id: 86, name: 'Garlic', categoryId: 11, unit: 'kg', price: 140, pkg: 'loose', wt: 1, totalWt: 1, rmc: 140 },
    { id: 87, name: 'Celery', categoryId: 11, unit: 'unit', price: 35, pkg: 'pcs', wt: 1, totalWt: 1, rmc: 35 },
    { id: 88, name: 'Babycorn (Fresh)', categoryId: 11, unit: 'kg', price: 140, pkg: 'loose', wt: 1, totalWt: 1, rmc: 140 },
    { id: 89, name: 'Onion', categoryId: 11, unit: 'kg', price: 30, pkg: 'loose', wt: 1, totalWt: 1, rmc: 30 },
    { id: 90, name: 'Spring Onion', categoryId: 11, unit: 'kg', price: 18, pkg: 'bundle', wt: 1, totalWt: 1, rmc: 18 },
    { id: 91, name: 'Papaya', categoryId: 11, unit: 'unit', price: 60, pkg: 'pcs', wt: 1, totalWt: 1, rmc: 60 },
    { id: 92, name: 'Pineapple', categoryId: 11, unit: 'unit', price: 90, pkg: 'pcs', wt: 1, totalWt: 1, rmc: 90 },

    // === Seasoning ===
    { id: 93, name: 'Salt', categoryId: 12, unit: 'kg', price: 28, pkg: 'pkt', wt: 1, totalWt: 1, rmc: 28 },
    { id: 94, name: 'Sugar', categoryId: 12, unit: 'kg', price: 18, pkg: 'pkt', wt: 25, totalWt: 25, rmc: 450 },
    { id: 95, name: 'Garam Masala', categoryId: 12, unit: 'kg', price: 136.50, pkg: 'pkt', wt: 1, totalWt: 1, rmc: 136.50 },
    { id: 96, name: 'Mustard Powder', categoryId: 12, unit: 'kg', price: 646, pkg: 'pkt', wt: 2, totalWt: 2, rmc: 1292 },
    { id: 97, name: 'Chilli Powder', categoryId: 12, unit: 'kg', price: 393.75, pkg: 'pkt', wt: 1, totalWt: 1, rmc: 393.75 },
    { id: 98, name: 'Turmeric Powder', categoryId: 12, unit: 'kg', price: 225.75, pkg: 'pkt', wt: 1, totalWt: 1, rmc: 225.75 },
    { id: 99, name: 'Coriander Powder', categoryId: 12, unit: 'kg', price: 168, pkg: 'pkt', wt: 1, totalWt: 1, rmc: 168 },
    { id: 100, name: 'Coriander Leaves', categoryId: 12, unit: 'kg', price: 9.38, pkg: 'pkt', wt: 0.16, totalWt: 3.2, rmc: 30 },
    { id: 101, name: 'Bay Leaves', categoryId: 12, unit: 'kg', price: 240, pkg: 'pkt', wt: 0.1, totalWt: 1, rmc: 240 },
    { id: 102, name: 'Mustard Seeds', categoryId: 12, unit: 'kg', price: 960, pkg: 'pkt', wt: 0.1, totalWt: 0.1, rmc: 96 },
    { id: 103, name: 'Cumin Seeds', categoryId: 12, unit: 'kg', price: 900, pkg: 'pkt', wt: 0.4, totalWt: 0.4, rmc: 360 },
    { id: 104, name: 'Green Chillies', categoryId: 12, unit: 'kg', price: 23.33, pkg: 'pkt', wt: 3, totalWt: 3, rmc: 70 },
    { id: 105, name: 'Black Pepper', categoryId: 12, unit: 'kg', price: 126, pkg: 'pkt', wt: 1, totalWt: 1, rmc: 126 },
    { id: 106, name: 'White Pepper Powder', categoryId: 12, unit: 'kg', price: 46.32, pkg: 'tub', wt: 1.7, totalWt: 1.7, rmc: 78.75 },
    { id: 107, name: 'Cardamom', categoryId: 12, unit: 'kg', price: 3200, pkg: 'pkt', wt: 1, totalWt: 1, rmc: 3200 },
    { id: 108, name: 'Cloves', categoryId: 12, unit: 'kg', price: 960, pkg: 'pkt', wt: 1, totalWt: 1, rmc: 960 },
    { id: 109, name: 'Cinnamon', categoryId: 12, unit: 'kg', price: 400, pkg: 'pkt', wt: 1, totalWt: 1, rmc: 400 },
    { id: 110, name: 'Ajinomoto', categoryId: 12, unit: 'kg', price: 126, pkg: 'pkt', wt: 1, totalWt: 1, rmc: 126 },
  ],
  orders: [],
};

// Utility Functions
const formatCurrency = (amount) => `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', { 
  day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
});

// ============================================
// MAIN APP COMPONENT (Supabase-powered)
// ============================================
export default function YokoSizzlersApp() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Core data state (loaded from Supabase)
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState({});
  const [revenueData, setRevenueData] = useState({});
  const [stockOutHistory, setStockOutHistory] = useState({});
  const [orderCounters, setOrderCounters] = useState({ Santacruz: 0, Bandra: 0, Oshiwara: 0 });

  // ── Helper: Convert DB row to app format ──
  const dbItemToApp = (row) => ({
    id: row.id,
    name: row.name,
    categoryId: row.category_id,
    unit: row.unit,
    price: Number(row.price),
    pkg: row.pkg || '',
    wt: Number(row.wt) || 1,
    totalWt: Number(row.total_wt) || 1,
    rmc: Number(row.rmc) || 0,
    previousPrice: row.previous_price ? Number(row.previous_price) : undefined,
    priceChange: row.price_change ? Number(row.price_change) : undefined,
    priceChangePercent: row.price_change_percent ? Number(row.price_change_percent) : undefined,
    priceHistory: row.price_history || [],
    lastUpdated: row.last_updated,
  });

  const dbOrderToApp = (row) => ({
    id: row.id,
    outlet: row.outlet,
    items: row.items || [],
    totalAmount: Number(row.total_amount),
    status: row.status,
    createdBy: row.created_by,
    createdAt: row.created_at,
    dispatchedAt: row.dispatched_at,
    dispatchedBy: row.dispatched_by,
    acceptedAt: row.accepted_at,
    acceptedBy: row.accepted_by,
    completedAt: row.completed_at,
    notes: row.notes,
    dispute: row.dispute,
    requestedItems: row.requested_items,
  });

  // ── INITIAL DATA LOAD ──
  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        
        const sb = getSupabase();

        const [catRes, itemRes, orderRes, userRes, revRes, counterRes, stockOutRes] = await Promise.all([
          sb.from('categories').select('*').order('id'),
          sb.from('items').select('*').order('id'),
          sb.from('orders').select('*').order('created_at', { ascending: false }),
          sb.from('users').select('*'),
          sb.from('revenue_data').select('*'),
          sb.from('order_counters').select('*'),
          sb.from('stock_out_history').select('*').order('submitted_at', { ascending: false }),
        ]);

        if (catRes.error) throw catRes.error;
        if (itemRes.error) throw itemRes.error;
        if (orderRes.error) throw orderRes.error;
        if (userRes.error) throw userRes.error;
        if (revRes.error) throw revRes.error;
        if (counterRes.error) throw counterRes.error;
        if (stockOutRes.error) throw stockOutRes.error;

        setCategories(catRes.data.map(c => ({ id: c.id, name: c.name, description: c.description })));
        setItems(itemRes.data.map(dbItemToApp));
        setOrders(orderRes.data.map(dbOrderToApp));

        // Users: convert array to phone-keyed object
        const usersObj = {};
        userRes.data.forEach(u => {
          usersObj[u.phone] = { role: u.role, outlet: u.outlet, name: u.name };
        });
        setUsers(usersObj);

        // Revenue: convert to nested object { outlet: { month: revenue } }
        const revObj = {};
        revRes.data.forEach(r => {
          if (!revObj[r.outlet]) revObj[r.outlet] = {};
          revObj[r.outlet][r.month] = Number(r.revenue);
        });
        setRevenueData(revObj);

        // Counters
        const counterObj = {};
        counterRes.data.forEach(c => { counterObj[c.outlet] = c.counter; });
        setOrderCounters(counterObj);

        // Stock out history: group by outlet
        const stockObj = {};
        stockOutRes.data.forEach(s => {
          const outlet = s.outlet;
          if (!stockObj[outlet]) stockObj[outlet] = [];
          stockObj[outlet].push({
            id: s.id,
            effectiveDate: s.effective_date,
            submittedAt: s.submitted_at,
            submittedBy: s.submitted_by,
            items: s.items || [],
            outlet: s.outlet,
          });
        });
        setStockOutHistory(stockObj);

        setError(null);
      } catch (err) {
        console.error('Failed to load data:', err);
        // Only show error if data actually failed to load
        // Don't block app for realtime/schema errors
        if (err.message && err.message.includes('Invalid schema')) {
          console.warn('Schema error (likely realtime config) - proceeding without realtime');
          setError(null);
        } else {
          setError(err.message || 'Failed to connect to database');
        }
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  // ── REALTIME + POLLING (cross-device sync) ──
  useEffect(() => {
    if (loading) return;
    const sb = getSupabase();
    if (!sb) return;

    let channels = [];
    let pollInterval = null;
    let realtimeWorking = false;

    // Polling fallback: refresh orders and items every 5 seconds
    const startPolling = () => {
      if (pollInterval) return;
      pollInterval = setInterval(async () => {
        try {
          const [orderRes, itemRes, stockOutRes] = await Promise.all([
            sb.from('orders').select('*').order('created_at', { ascending: false }),
            sb.from('items').select('*').order('id'),
            sb.from('stock_out_history').select('*').order('submitted_at', { ascending: false }),
          ]);
          if (orderRes.data) setOrders(orderRes.data.map(dbOrderToApp));
          if (itemRes.data) setItems(itemRes.data.map(dbItemToApp));
          if (stockOutRes.data) {
            const stockObj = {};
            stockOutRes.data.forEach(s => {
              if (!stockObj[s.outlet]) stockObj[s.outlet] = [];
              stockObj[s.outlet].push({ id: s.id, effectiveDate: s.effective_date, submittedAt: s.submitted_at, submittedBy: s.submitted_by, items: s.items || [], outlet: s.outlet });
            });
            setStockOutHistory(stockObj);
          }
        } catch (e) { /* silent */ }
      }, 5000);
    };

    try {
      const ordersChannel = sb
        .channel('orders-rt')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
          realtimeWorking = true;
          if (payload.eventType === 'INSERT') {
            setOrders(prev => {
              if (prev.some(o => o.id === payload.new.id)) return prev;
              return [dbOrderToApp(payload.new), ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            setOrders(prev => prev.map(o => o.id === payload.new.id ? dbOrderToApp(payload.new) : o));
          } else if (payload.eventType === 'DELETE') {
            setOrders(prev => prev.filter(o => o.id !== payload.old.id));
          }
        })
        .subscribe((status) => {
          if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            console.warn('Realtime unavailable, falling back to polling');
            startPolling();
          }
        });

      const itemsChannel = sb
        .channel('items-rt')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, (payload) => {
          if (payload.eventType === 'UPDATE') setItems(prev => prev.map(i => i.id === payload.new.id ? dbItemToApp(payload.new) : i));
          else if (payload.eventType === 'INSERT') setItems(prev => [...prev, dbItemToApp(payload.new)]);
          else if (payload.eventType === 'DELETE') setItems(prev => prev.filter(i => i.id !== payload.old.id));
        })
        .subscribe();

      const stockOutChannel = sb
        .channel('stockout-rt')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'stock_out_history' }, (payload) => {
          const s = payload.new;
          setStockOutHistory(prev => ({
            ...prev,
            [s.outlet]: [{ id: s.id, effectiveDate: s.effective_date, submittedAt: s.submitted_at, submittedBy: s.submitted_by, items: s.items || [], outlet: s.outlet }, ...(prev[s.outlet] || [])]
          }));
        })
        .subscribe();

      channels = [ordersChannel, itemsChannel, stockOutChannel];
    } catch (e) {
      console.warn('Realtime setup failed:', e);
      startPolling();
    }

    // Also start polling as safety net (it's lightweight)
    startPolling();

    return () => {
      channels.forEach(ch => { try { sb.removeChannel(ch); } catch(e) {} });
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [loading]);


  // ── DATA OPERATIONS (write to Supabase) ──

  const handleLogin = (phone, user) => {
    setCurrentUser({ phone, ...user });
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const updateItems = async (newItems) => {
    // Batch upsert all items to Supabase
    const rows = newItems.map(item => ({
      id: item.id,
      name: item.name,
      category_id: item.categoryId,
      unit: item.unit,
      price: item.price,
      pkg: item.pkg || '',
      wt: item.wt || 1,
      total_wt: item.totalWt || 1,
      rmc: item.rmc || 0,
      previous_price: item.previousPrice || null,
      price_change: item.priceChange || null,
      price_change_percent: item.priceChangePercent || null,
      price_history: item.priceHistory || [],
      last_updated: item.lastUpdated || null,
    }));
    
    const { error } = await getSupabase().from('items').upsert(rows, { onConflict: 'id' });
    if (error) console.error('Update items error:', error);
    // Realtime subscription will update local state
    // But also update immediately for responsiveness
    setItems(newItems);
  };

  const updateRevenueDataFn = async (newRevenueData) => {
    // Convert nested object to rows and upsert
    const rows = [];
    Object.entries(newRevenueData).forEach(([outlet, months]) => {
      Object.entries(months).forEach(([month, revenue]) => {
        rows.push({ outlet, month: Number(month), revenue: Number(revenue) });
      });
    });
    
    const { error } = await getSupabase().from('revenue_data').upsert(rows, { onConflict: 'outlet,month' });
    if (error) console.error('Update revenue error:', error);
    setRevenueData(newRevenueData);
  };

  const updateCategories = async (newCategories) => {
    // Find new categories (no id or high id) to insert, existing to update
    for (const cat of newCategories) {
      const row = { name: cat.name, description: cat.description || '' };
      if (cat.id) {
        await getSupabase().from('categories').upsert({ id: cat.id, ...row }, { onConflict: 'id' });
      } else {
        const { data } = await getSupabase().from('categories').insert(row).select();
        if (data && data[0]) cat.id = data[0].id;
      }
    }
    setCategories(newCategories);
  };

  const updateStockOutHistoryFn = async (outlet, entry) => {
    const row = {
      id: entry.id,
      outlet: outlet,
      effective_date: entry.effectiveDate,
      submitted_at: entry.submittedAt,
      submitted_by: entry.submittedBy,
      items: entry.items,
    };
    
    const { error } = await getSupabase().from('stock_out_history').insert(row);
    if (error) console.error('Stock out insert error:', error);
    // Realtime will handle the state update, but also update immediately
    setStockOutHistory(prev => ({
      ...prev,
      [outlet]: [{ ...entry, outlet }, ...(prev[outlet] || [])]
    }));
  };

  const addOrder = async (order) => {
    // Get and increment counter atomically
    const prefixMap = { Santacruz: 'YS', Bandra: 'YB', Oshiwara: 'YO' };
    const prefix = prefixMap[order.outlet] || 'YX';
    
    // Fetch current counter
    const { data: counterData } = await getSupabase()
      .from('order_counters')
      .select('counter')
      .eq('outlet', order.outlet)
      .single();
    
    const newCounter = (counterData?.counter || 0) + 1;
    const orderId = `${prefix}${String(newCounter).padStart(4, '0')}`;
    
    // Update counter
    await getSupabase()
      .from('order_counters')
      .update({ counter: newCounter })
      .eq('outlet', order.outlet);
    
    // Insert order
    const row = {
      id: orderId,
      outlet: order.outlet,
      items: order.items,
      total_amount: order.totalAmount,
      status: order.status || 'pending',
      created_by: order.createdBy,
      created_at: order.createdAt,
      notes: order.notes || null,
      requested_items: order.requestedItems || null,
    };
    
    const { error } = await getSupabase().from('orders').insert(row);
    if (error) console.error('Insert order error:', error);
    // Realtime will add it to state
  };

  const updateOrderStatus = async (orderId, status, additionalData = {}) => {
    const updates = { status };
    if (additionalData.dispatchedAt) updates.dispatched_at = additionalData.dispatchedAt;
    if (additionalData.dispatchedBy) updates.dispatched_by = additionalData.dispatchedBy;
    if (additionalData.acceptedAt) updates.accepted_at = additionalData.acceptedAt;
    if (additionalData.acceptedBy) updates.accepted_by = additionalData.acceptedBy;
    if (additionalData.completedAt) updates.completed_at = additionalData.completedAt;
    if (additionalData.dispute) updates.dispute = additionalData.dispute;
    
    const { error } = await getSupabase().from('orders').update(updates).eq('id', orderId);
    if (error) console.error('Update order status error:', error);
    // Also update local state immediately for responsiveness
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, ...additionalData } : o));
  };

  const updateOrder = async (orderId, appUpdates) => {
    const dbUpdates = {};
    if (appUpdates.items !== undefined) dbUpdates.items = appUpdates.items;
    if (appUpdates.totalAmount !== undefined) dbUpdates.total_amount = appUpdates.totalAmount;
    if (appUpdates.status !== undefined) dbUpdates.status = appUpdates.status;
    if (appUpdates.dispatchedAt !== undefined) dbUpdates.dispatched_at = appUpdates.dispatchedAt;
    if (appUpdates.dispatchedBy !== undefined) dbUpdates.dispatched_by = appUpdates.dispatchedBy;
    if (appUpdates.acceptedAt !== undefined) dbUpdates.accepted_at = appUpdates.acceptedAt;
    if (appUpdates.acceptedBy !== undefined) dbUpdates.accepted_by = appUpdates.acceptedBy;
    if (appUpdates.completedAt !== undefined) dbUpdates.completed_at = appUpdates.completedAt;
    if (appUpdates.notes !== undefined) dbUpdates.notes = appUpdates.notes;
    if (appUpdates.dispute !== undefined) dbUpdates.dispute = appUpdates.dispute;
    if (appUpdates.requestedItems !== undefined) dbUpdates.requested_items = appUpdates.requestedItems;
    
    const { error } = await getSupabase().from('orders').update(dbUpdates).eq('id', orderId);
    if (error) console.error('Update order error:', error);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...appUpdates } : o));
  };

  // ── LOADING / ERROR STATES ──
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading Yoko Sizzlers...</p>
          <p className="text-stone-500 text-sm mt-1">Connecting to database</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-lg text-center">
          <span className="text-5xl mb-4 block">⚠️</span>
          <h2 className="text-xl font-bold text-red-400 mb-2">Connection Error</h2>
          <p className="text-stone-400 mb-4">{error}</p>
          <p className="text-stone-500 text-sm mb-4">Make sure the Supabase database is set up and the SQL seed script has been run.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginScreen users={users} onLogin={handleLogin} />;
  }

  // Build data object for components that expect it
  const data = {
    items,
    categories,
    orders,
    users,
    revenueData,
    stockOutHistory,
    orderCounters,
  };

  return (
    <div className="min-h-screen bg-stone-950">
      <GlobalStyles />
      <Header user={currentUser} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {currentUser.role === 'outlet' && (
          <OutletDashboard 
            user={currentUser} 
            items={items}
            categories={categories}
            orders={orders.filter(o => o.outlet === currentUser.outlet)}
            onAddOrder={addOrder}
            onUpdateOrderStatus={updateOrderStatus}
            onUpdateStockOut={updateStockOutHistoryFn}
            globalStockOutHistory={stockOutHistory}
          />
        )}
        {currentUser.role === 'central_kitchen' && (
          <CentralKitchenDashboard 
            user={currentUser}
            items={items}
            categories={categories}
            orders={orders}
            revenueData={revenueData}
            onUpdateItems={updateItems}
            onUpdateCategories={updateCategories}
            onUpdateOrderStatus={updateOrderStatus}
            onUpdateOrder={updateOrder}
            stockOutHistory={stockOutHistory}
          />
        )}
        {currentUser.role === 'admin' && (
          <AdminDashboard 
            data={{ ...data, stockOutHistory }}
            onUpdateItems={updateItems}
            onUpdateRevenueData={updateRevenueDataFn}
          />
        )}
      </main>
    </div>
  );
}

// ============================================
// LOGIN SCREEN - Direct Selection (No OTP)
// ============================================
function LoginScreen({ users, onLogin }) {
  const [selectedPhone, setSelectedPhone] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!selectedPhone) {
      setError('Please select a user to login');
      return;
    }
    onLogin(selectedPhone, users[selectedPhone]);
  };

  const userList = Object.entries(users).map(([phone, user]) => ({
    phone,
    ...user,
    displayName: user.role === 'outlet' ? `${user.outlet} Outlet` : 
                 user.role === 'central_kitchen' ? 'Central Kitchen' : 'Admin'
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-600/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-2xl shadow-amber-500/20 mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: 'system-ui' }}>
            YOKO SIZZLERS
          </h1>
          <p className="text-amber-200/60 mt-2 text-sm tracking-widest uppercase">Purchase Order System</p>
        </div>

        {/* Login Card */}
        <div className="bg-stone-900/80 backdrop-blur-xl border border-stone-800/50 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Sign In</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-stone-400 mb-2">Select User</label>
              <select
                value={selectedPhone}
                onChange={(e) => { setSelectedPhone(e.target.value); setError(''); }}
                className="w-full px-4 py-3.5 bg-stone-800/50 border border-stone-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
              >
                <option value="">-- Select User --</option>
                {userList.map(user => (
                  <option key={user.phone} value={user.phone}>
                    {user.displayName} ({user.name})
                  </option>
                ))}
              </select>
            </div>
            
            {selectedPhone && (
              <div className="p-3 bg-stone-800/30 rounded-xl border border-stone-700/30">
                <p className="text-xs text-stone-500 mb-1">Logging in as:</p>
                <p className="text-white font-medium">{users[selectedPhone].name}</p>
                <p className="text-sm text-stone-400">+91 {selectedPhone}</p>
              </div>
            )}

            {error && (
              <p className="text-red-400 text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            )}
            <button
              onClick={handleLogin}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all shadow-lg shadow-amber-500/20"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// HEADER COMPONENT
// ============================================
function Header({ user, onLogout }) {
  const getRoleBadge = (role) => {
    const badges = {
      outlet: { label: user.outlet, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
      central_kitchen: { label: 'Central Kitchen', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      admin: { label: 'Admin', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    };
    return badges[role];
  };

  const badge = getRoleBadge(user.role);

  return (
    <header className="bg-stone-900/80 backdrop-blur-xl border-b border-stone-800/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">YOKO SIZZLERS</h1>
                <p className="text-xs text-stone-500">Purchase Orders</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1.5 text-xs font-medium rounded-lg border ${badge.color}`}>
              {badge.label}
            </span>
            <div className="hidden sm:block text-right">
              <p className="text-sm text-white">{user.name}</p>
              <p className="text-xs text-stone-500">+91 {user.phone}</p>
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-all"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

// ============================================
// OUTLET DASHBOARD
// ============================================
function OutletDashboard({ user, items, categories, orders, onAddOrder, onUpdateOrderStatus, onUpdateStockOut, globalStockOutHistory }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [orderStep, setOrderStep] = useState('categories'); // 'categories' | 'items'
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [cart, setCart] = useState([]);
  const [showOrderPage, setShowOrderPage] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [lastOrderId, setLastOrderId] = useState(null);
  const [showAISuggestions, setShowAISuggestions] = useState(true);
  
  // Dispute state
  const [disputingOrder, setDisputingOrder] = useState(null);
  const [disputeItems, setDisputeItems] = useState({});
  const [disputeReason, setDisputeReason] = useState('');
  
  // Stock Out state
  const [stockOutData, setStockOutData] = useState({});
  const [stockOutHistory, setStockOutHistory] = useState(() => {
    // Load from global Supabase data
    return globalStockOutHistory?.[user.outlet] || [];
  });

  // Sync with global data when it changes
  useEffect(() => {
    setStockOutHistory(globalStockOutHistory?.[user.outlet] || []);
  }, [globalStockOutHistory, user.outlet]);

  // Confirmation dialog state
  const [showConfirmDialog, setShowConfirmDialog] = useState(null); // 'order' | 'stockOut' | null

  // Check if stock out can be submitted today (before 2am IST)
  const canSubmitStockOut = () => {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istNow = new Date(now.getTime() + istOffset);
    const hours = istNow.getUTCHours();
    
    // Day ends at 2am IST - if it's past 2am, we're in a new day
    const effectiveDate = hours < 2 
      ? new Date(istNow.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      : istNow.toISOString().split('T')[0];
    
    // Check if already submitted for this effective date
    const alreadySubmitted = stockOutHistory.some(entry => entry.effectiveDate === effectiveDate);
    
    return { canSubmit: !alreadySubmitted, effectiveDate, alreadySubmitted };
  };

  // Stock management state
  const [stockData, setStockData] = useState(() => {
    const saved = localStorage.getItem(`yokoStock_${user.outlet}`);
    if (saved) return JSON.parse(saved);
    const initialStock = {};
    items.forEach(item => {
      initialStock[item.id] = {
        current: Math.floor(Math.random() * 50) + 5,
        minimum: 10,
        unit: item.unit
      };
    });
    return initialStock;
  });

  const [stockHistory, setStockHistory] = useState(() => {
    const saved = localStorage.getItem(`yokoStockHistory_${user.outlet}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [stockHistoryMonth, setStockHistoryMonth] = useState(new Date().getMonth() + 1);
  const [stockHistoryYear, setStockHistoryYear] = useState(new Date().getFullYear());

  useEffect(() => {
    localStorage.setItem(`yokoStock_${user.outlet}`, JSON.stringify(stockData));
  }, [stockData, user.outlet]);

  useEffect(() => {
    localStorage.setItem(`yokoStockHistory_${user.outlet}`, JSON.stringify(stockHistory));
  }, [stockHistory, user.outlet]);

  const today = new Date();
  const currentMonth = today.getMonth() + 1;

  const getTodayOrders = () => orders.filter(o => new Date(o.createdAt).toDateString() === today.toDateString());
  const getMonthOrders = () => orders.filter(o => (new Date(o.createdAt).getMonth() + 1) === currentMonth);
  
  const dispatchedOrders = orders.filter(o => o.status === 'dispatched');
  const todayOrders = getTodayOrders();
  const monthOrders = getMonthOrders();

  const lowStockItems = items.filter(item => {
    const stock = stockData[item.id];
    return stock && stock.current <= stock.minimum;
  });

  // AI Suggestions
  const aiSuggestions = AIAnalytics.generateAutoOrderSuggestions(orders, user.outlet, items, categories);

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : 'Uncategorized';
  };

  // Get items for selected category
  const getCategoryItems = (categoryId) => {
    return items.filter(item => item.categoryId === categoryId);
  };

  // Cart functions
  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateCartQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCart(cart.filter(c => c.id !== id));
    } else {
      setCart(cart.map(c => c.id === id ? { ...c, quantity } : c));
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(c => c.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const submitOrder = () => {
    if (cart.length === 0) return;
    
    const order = {
      id: '', // Will be set by addOrder
      outlet: user.outlet,
      items: cart.map(c => ({ 
        ...c, 
        categoryName: getCategoryName(c.categoryId),
        requestedQuantity: c.quantity,
        totalCost: c.price * c.quantity 
      })),
      totalAmount: cartTotal,
      status: 'pending',
      createdAt: new Date().toISOString(),
      createdBy: user.name,
      dispatchedAt: null,
      dispatchedBy: null,
      completedAt: null,
      notes: '',
    };
    
    // Generate order ID based on outlet prefix
    const prefixMap = { Santacruz: 'YS', Bandra: 'YB', Oshiwara: 'YO' };
    const prefix = prefixMap[user.outlet] || 'YX';
    const tempOrderId = `${prefix}${String(orders.length + 1).padStart(4, '0')}`;
    
    onAddOrder(order);
    setLastOrderId(tempOrderId);
    setCart([]);
    setShowOrderPage(false);
    setOrderStep('categories');
    setSelectedCategoryId(null);
    setShowOrderSuccess(true);
    setShowConfirmDialog(null);
  };

  const handleOrderSuccessClose = () => {
    setShowOrderSuccess(false);
    setActiveTab('history');
  };

  // Confirmation Dialog Component
  const ConfirmDialog = ({ type, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-md animate-modal-in">
        <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {type === 'order' ? 'Submit Order?' : 'Submit Stock Out?'}
          </h3>
          <p className="text-stone-400 mb-6">
            {type === 'order' 
              ? 'Are you sure you want to submit this order? It will be sent to Central Kitchen for processing.'
              : 'Are you sure you want to submit stock out? This action cannot be undone and you cannot submit again today.'
            }
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 bg-stone-800 text-white rounded-xl font-medium hover:bg-stone-700 transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-3 rounded-xl font-medium transition-all active:scale-[0.98] ${
                type === 'order'
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
              }`}
            >
              Yes, Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const acceptOrder = (order) => {
    const newStockData = { ...stockData };
    const newHistoryEntries = [];

    order.items.forEach(item => {
      if (newStockData[item.id]) {
        newStockData[item.id] = {
          ...newStockData[item.id],
          current: (newStockData[item.id].current || 0) + item.quantity
        };
      } else {
        newStockData[item.id] = {
          current: item.quantity,
          minimum: 10,
          unit: item.unit
        };
      }

      newHistoryEntries.push({
        id: Date.now() + Math.random(),
        itemId: item.id,
        itemName: item.name,
        quantity: item.quantity,
        type: 'add',
        date: new Date().toISOString(),
        user: user.name,
        orderId: order.id
      });
    });

    setStockData(newStockData);
    setStockHistory(prev => [...newHistoryEntries, ...prev].slice(0, 100));

    onUpdateOrderStatus(order.id, 'delivered', {
      acceptedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      acceptedBy: user.name
    });
  };

  // Start dispute process
  const startDispute = (order) => {
    setDisputingOrder(order);
    const items = {};
    order.items.forEach(item => {
      items[item.id] = item.quantity; // Start with dispatched quantity
    });
    setDisputeItems(items);
    setDisputeReason('');
  };

  // Submit dispute
  const submitDispute = () => {
    if (!disputeReason.trim()) {
      alert('Please provide a reason for the dispute');
      return;
    }

    const newStockData = { ...stockData };
    const newHistoryEntries = [];

    // Add items to stock based on disputed quantities (what was actually received)
    disputingOrder.items.forEach(item => {
      const receivedQty = disputeItems[item.id] || 0;
      if (receivedQty > 0) {
        if (newStockData[item.id]) {
          newStockData[item.id] = {
            ...newStockData[item.id],
            current: (newStockData[item.id].current || 0) + receivedQty
          };
        } else {
          newStockData[item.id] = {
            current: receivedQty,
            minimum: 10,
            unit: item.unit
          };
        }

        newHistoryEntries.push({
          id: Date.now() + Math.random(),
          itemId: item.id,
          itemName: item.name,
          quantity: receivedQty,
          type: 'add',
          date: new Date().toISOString(),
          user: user.name,
          orderId: disputingOrder.id,
          isDisputed: true
        });
      }
    });

    setStockData(newStockData);
    setStockHistory(prev => [...newHistoryEntries, ...prev].slice(0, 100));

    // Create dispute details
    const disputeDetails = {
      disputedAt: new Date().toISOString(),
      disputedBy: user.name,
      disputeReason: disputeReason,
      originalItems: disputingOrder.items.map(item => ({
        id: item.id,
        name: item.name,
        dispatchedQty: item.quantity,
        receivedQty: disputeItems[item.id] || 0,
        difference: item.quantity - (disputeItems[item.id] || 0)
      }))
    };

    onUpdateOrderStatus(disputingOrder.id, 'disputed', {
      completedAt: new Date().toISOString(),
      acceptedBy: user.name,
      dispute: disputeDetails
    });

    setDisputingOrder(null);
    setDisputeItems({});
    setDisputeReason('');
  };

  // Submit Stock Out function
  const submitStockOut = () => {
    const { canSubmit, effectiveDate } = canSubmitStockOut();
    if (!canSubmit) return;

    // Update stock data
    const newStockData = { ...stockData };
    const newHistoryEntries = [];
    
    items.forEach(item => {
      const remaining = stockOutData[item.id] ?? (stockData[item.id]?.current || 0);
      const current = stockData[item.id]?.current || 0;
      const used = current - remaining;
      
      if (used > 0) {
        newStockData[item.id] = {
          ...newStockData[item.id],
          current: remaining
        };
        
        newHistoryEntries.push({
          id: Date.now() + Math.random(),
          itemId: item.id,
          itemName: item.name,
          quantity: used,
          type: 'use',
          date: new Date().toISOString(),
          user: user.name,
          reason: 'Stock Out Entry'
        });
      }
    });

    setStockData(newStockData);
    setStockHistory(prev => [...newHistoryEntries, ...prev].slice(0, 200));

    // Save stock out entry
    const entry = {
      id: `SO-${Date.now()}`,
      effectiveDate,
      submittedAt: new Date().toISOString(),
      submittedBy: user.name,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        unit: item.unit,
        before: stockData[item.id]?.current || 0,
        remaining: stockOutData[item.id] ?? (stockData[item.id]?.current || 0),
        used: (stockData[item.id]?.current || 0) - (stockOutData[item.id] ?? (stockData[item.id]?.current || 0)),
        categoryId: item.categoryId
      })),
      outlet: user.outlet
    };

    setStockOutHistory(prev => [entry, ...prev]);
    // Also save to global state for Admin reports
    if (onUpdateStockOut) {
      onUpdateStockOut(user.outlet, entry);
    }
    setStockOutData({});
    setShowConfirmDialog(null);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'stock', label: 'Stock', icon: '📦' },
    { id: 'stockOut', label: 'Stock Out', icon: '📤' },
    { id: 'stockHistory', label: 'Stock History', icon: '📋' },
    { id: 'history', label: 'Purchase History', icon: '🛒' },
    { id: 'monthly', label: 'Monthly', icon: '📅' },
  ];

  // ORDER CREATION PAGE
  if (showOrderPage) {
    return (
      <div className="space-y-6">
        {/* Confirmation Dialog for Order Page */}
        {showConfirmDialog === 'order' && (
          <ConfirmDialog 
            type="order"
            onConfirm={submitOrder}
            onCancel={() => setShowConfirmDialog(null)}
          />
        )}

        {/* Header */}
        <div className="flex items-center gap-4 pb-4 border-b border-stone-800">
          <button
            onClick={() => {
              setShowConfirmDialog(null); // Reset confirmation dialog
              if (orderStep === 'items') {
                setOrderStep('categories');
                setSelectedCategoryId(null);
              } else {
                setShowOrderPage(false);
                setCart([]);
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-stone-800 text-white rounded-xl hover:bg-stone-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {orderStep === 'items' ? 'Back to Categories' : 'Back to Dashboard'}
          </button>
          <h1 className="text-xl font-bold text-white">Create New Order</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {orderStep === 'categories' ? (
              /* CATEGORY SELECTION */
              <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📦</span>
                  <h2 className="text-lg font-semibold text-white">Select Category</h2>
                </div>
                <p className="text-sm text-stone-500 mb-6">Choose a category to view available items for ordering</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
                  {categories.map(category => {
                    const itemCount = getCategoryItems(category.id).length;
                    return (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategoryId(category.id);
                          setOrderStep('items');
                        }}
                        className="flex items-center justify-between p-4 bg-stone-800/30 border border-stone-700/50 rounded-xl hover:bg-stone-800/50 hover:border-amber-500/50 transition-all text-left group active:scale-[0.98] hover:shadow-lg hover:shadow-amber-500/10"
                      >
                        <div>
                          <p className="text-white font-medium group-hover:text-amber-400 transition-colors">{category.name}</p>
                          {category.description && (
                            <p className="text-xs text-stone-500 mt-1">{category.description}</p>
                          )}
                          <p className="text-xs text-stone-600 mt-1">{itemCount} items</p>
                        </div>
                        <svg className="w-5 h-5 text-stone-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* ITEM SELECTION */
              <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🛒</span>
                  <h2 className="text-lg font-semibold text-white">{getCategoryName(selectedCategoryId)}</h2>
                </div>
                <p className="text-sm text-stone-500 mb-6">Select items to add to your order</p>
                
                <div className="space-y-3">
                  {getCategoryItems(selectedCategoryId).map(item => {
                    const inCart = cart.find(c => c.id === item.id);
                    return (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-stone-800/30 border border-stone-700/50 rounded-xl transition-all hover:bg-stone-800/50 hover:border-stone-600">
                        <div>
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-sm text-stone-500">{formatCurrency(item.price)} per {item.unit}</p>
                        </div>
                        {inCart ? (
                          <div className="flex items-center gap-3 animate-fade-in">
                            <button
                              onClick={() => updateCartQuantity(item.id, inCart.quantity - 1)}
                              className="w-8 h-8 rounded-lg bg-stone-700 text-white hover:bg-stone-600 transition-all active:scale-90 flex items-center justify-center"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              value={inCart.quantity}
                              onChange={(e) => updateCartQuantity(item.id, parseFloat(e.target.value) || 0)}
                              className="w-16 px-2 py-1 bg-stone-700 border border-stone-600 rounded-lg text-white text-center transition-all focus:ring-2 focus:ring-amber-500/50"
                            />
                            <button
                              onClick={() => updateCartQuantity(item.id, inCart.quantity + 1)}
                              className="w-8 h-8 rounded-lg bg-stone-700 text-white hover:bg-stone-600 transition-all active:scale-90 flex items-center justify-center"
                            >
                              +
                            </button>
                            <span className="text-xs text-stone-500 w-8">{item.unit}</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            className="px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-all active:scale-95 font-medium ripple"
                          >
                            + Add
                          </button>
                        )}
                      </div>
                    );
                  })}
                  {getCategoryItems(selectedCategoryId).length === 0 && (
                    <div className="text-center py-8 text-stone-500">
                      <p>No items in this category</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cart Sidebar */}
          <div className="w-full lg:w-80">
            <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-4 sticky top-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                🛒 Order Cart
                {cart.length > 0 && (
                  <span className="ml-auto px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full">{cart.length}</span>
                )}
              </h3>

              {cart.length === 0 ? (
                <div className="text-center py-8 text-stone-500">
                  <span className="text-4xl mb-2 block">🛒</span>
                  <p className="text-sm">Your cart is empty</p>
                  <p className="text-xs mt-1">Add items from categories</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2 max-h-80 overflow-y-auto mb-4">
                    {cart.map(item => (
                      <div key={item.id} className="bg-stone-800/50 rounded-xl p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-white text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-stone-500">{formatCurrency(item.price)} × {item.quantity} {item.unit}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-stone-500 hover:text-red-400 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-amber-400 font-medium text-sm text-right">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-stone-700 pt-4">
                    <div className="flex justify-between text-lg font-semibold mb-4">
                      <span className="text-stone-400">Total</span>
                      <span className="text-white animate-count-up">{formatCurrency(cartTotal)}</span>
                    </div>
                    <button
                      onClick={() => setShowConfirmDialog('order')}
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/20 ripple"
                    >
                      Submit Order
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MAIN DASHBOARD
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <ConfirmDialog 
          type={showConfirmDialog}
          onConfirm={showConfirmDialog === 'order' ? submitOrder : submitStockOut}
          onCancel={() => setShowConfirmDialog(null)}
        />
      )}

      {/* Order Success Animation */}
      <OrderSuccessAnimation 
        show={showOrderSuccess} 
        onClose={handleOrderSuccessClose}
        orderId={lastOrderId}
      />

      {/* Tab Navigation */}
      <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-2 flex gap-1 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap active:scale-95 ${
              activeTab === tab.id
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20 scale-[1.02]'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <span className={activeTab === tab.id ? 'animate-pop' : ''}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6 tab-content stagger-children">
          {/* AI Auto-Order Suggestions */}
          {showAISuggestions && aiSuggestions.length > 0 && (
            <AIAlertCard
              type="ai"
              title="Smart Order Suggestions"
              description={`Based on your ordering patterns and today being ${new Date().toLocaleDateString('en-IN', { weekday: 'long' })}, here are recommended items to order.`}
              onDismiss={() => setShowAISuggestions(false)}
              onAction={() => {
                // Add all suggestions to cart
                aiSuggestions.forEach(s => {
                  const existing = cart.find(c => c.id === s.item.id);
                  if (!existing) {
                    setCart(prev => [...prev, { ...s.item, quantity: s.suggestedQty }]);
                  }
                });
                setShowOrderPage(true);
              }}
              actionLabel="Add All to Order"
              items={aiSuggestions.slice(0, 5).map((s, idx) => (
                <div key={idx} className="bg-stone-900/50 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{s.item.name}</p>
                    <p className="text-xs text-stone-500">{s.reason}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-amber-400 font-semibold">{s.suggestedQty} {s.item.unit}</p>
                    <p className="text-xs text-stone-500">Avg: {s.avgPerWeek}/week</p>
                  </div>
                </div>
              ))}
            />
          )}

          {/* Pending Deliveries Alert */}
          {dispatchedOrders.length > 0 && (
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📦</span>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-400">Deliveries Ready to Accept</h3>
                    <p className="text-sm text-stone-400">{dispatchedOrders.length} order(s) dispatched from Central Kitchen</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                {dispatchedOrders.map(order => (
                  <div key={order.id} className="bg-stone-900/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-white font-medium">{order.id}</p>
                        <p className="text-xs text-stone-500">Dispatched: {formatDate(order.dispatchedAt)}</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-lg font-medium">
                        {order.items.length} items
                      </span>
                    </div>
                    
                    <div className="mb-3 space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-stone-300">{item.name}</span>
                          <div className="flex items-center gap-2">
                            {item.requestedQuantity !== item.quantity && (
                              <span className="text-orange-400 text-xs line-through">{item.requestedQuantity}</span>
                            )}
                            <span className={`font-medium ${item.requestedQuantity !== item.quantity ? 'text-orange-400' : 'text-white'}`}>
                              {item.quantity} {item.unit}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {order.notes && (
                      <p className="text-xs text-stone-500 mb-3 italic">Note: {order.notes}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-amber-400 font-semibold">{formatCurrency(order.items.reduce((s, i) => s + (i.price * i.quantity), 0))}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startDispute(order)}
                          className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg font-medium hover:bg-orange-500/30 transition-all active:scale-95 flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          Dispute
                        </button>
                        <button
                          onClick={() => acceptOrder(order)}
                          className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-all active:scale-95 flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Accept & Restock
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DISPUTE MODAL */}
          {disputingOrder && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 overflow-y-auto">
              <div className="min-h-full flex items-start justify-center p-4 py-8">
                <div className="bg-stone-900 border border-orange-500/30 rounded-2xl w-full max-w-2xl animate-modal-in">
                  {/* Header */}
                  <div className="p-4 border-b border-stone-800 flex items-center justify-between bg-orange-500/10 rounded-t-2xl">
                    <div>
                      <h2 className="text-xl font-semibold text-orange-400 flex items-center gap-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Dispute Order
                      </h2>
                      <p className="text-sm text-stone-500">{disputingOrder.id} • Report quantity discrepancies</p>
                    </div>
                    <button
                      onClick={() => { setDisputingOrder(null); setDisputeItems({}); setDisputeReason(''); }}
                      className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-all active:scale-95"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="bg-stone-800/30 rounded-xl p-4 mb-4">
                      <p className="text-sm text-stone-400">Adjust quantities to reflect what you <span className="text-white font-medium">actually received</span></p>
                    </div>

                    <h3 className="text-sm font-medium text-stone-400 uppercase mb-3">Items Received</h3>
                    <div className="space-y-3">
                      {disputingOrder.items.map(item => {
                        const receivedQty = disputeItems[item.id] || 0;
                        const difference = item.quantity - receivedQty;
                        return (
                          <div key={item.id} className="bg-stone-800/50 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="text-white font-medium">{item.name}</p>
                                <p className="text-xs text-stone-500">Dispatched: {item.quantity} {item.unit}</p>
                              </div>
                              {difference !== 0 && (
                                <span className={`px-2 py-1 text-xs rounded-lg font-medium ${
                                  difference > 0 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                                }`}>
                                  {difference > 0 ? `-${difference}` : `+${Math.abs(difference)}`} {item.unit}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-stone-400">Actually Received:</span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setDisputeItems(prev => ({ ...prev, [item.id]: Math.max(0, (prev[item.id] || 0) - 1) }))}
                                  className="w-8 h-8 rounded-lg bg-stone-700 text-white hover:bg-stone-600 flex items-center justify-center transition-all active:scale-90"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  value={receivedQty}
                                  onChange={(e) => setDisputeItems(prev => ({ ...prev, [item.id]: Math.max(0, parseFloat(e.target.value) || 0) }))}
                                  className="w-20 px-2 py-1 bg-stone-700 border border-stone-600 rounded-lg text-white text-center"
                                />
                                <button
                                  onClick={() => setDisputeItems(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }))}
                                  className="w-8 h-8 rounded-lg bg-stone-700 text-white hover:bg-stone-600 flex items-center justify-center transition-all active:scale-90"
                                >
                                  +
                                </button>
                                <span className="text-sm text-stone-500">{item.unit}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4">
                      <label className="text-sm text-orange-400 block mb-2">Reason for Dispute <span className="text-red-400">*</span></label>
                      <textarea
                        value={disputeReason}
                        onChange={(e) => setDisputeReason(e.target.value)}
                        placeholder="e.g., Items were damaged, wrong quantities delivered, missing items..."
                        className="w-full px-3 py-2 bg-stone-800 border border-orange-500/30 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-sm"
                        rows={3}
                        required
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-4 border-t border-stone-800 bg-stone-900/50 rounded-b-2xl">
                    <div className="flex gap-3">
                      <button
                        onClick={() => { setDisputingOrder(null); setDisputeItems({}); setDisputeReason(''); }}
                        className="flex-1 py-3 bg-stone-800 text-white rounded-xl font-medium hover:bg-stone-700 transition-all active:scale-[0.98]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={submitDispute}
                        disabled={!disputeReason.trim()}
                        className={`flex-1 py-3 rounded-xl font-medium transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                          disputeReason.trim()
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/20'
                            : 'bg-stone-700 text-stone-500 cursor-not-allowed'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Submit Dispute
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Summary */}
            <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-amber-400 mb-2 flex items-center gap-2">
                <span>💰</span> Today's Summary
              </h3>
              <p className="text-sm text-stone-500 mb-4">Real-time overview</p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 border-b border-stone-800/50">
                  <span className="text-stone-300">Total Orders:</span>
                  <span className="text-xl font-bold text-white">{todayOrders.length}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-stone-800/50">
                  <span className="text-stone-300">Total Value:</span>
                  <span className="text-xl font-bold text-emerald-400">{formatCurrency(todayOrders.reduce((s, o) => s + o.totalAmount, 0))}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-stone-800/50">
                  <span className="text-stone-300">Pending:</span>
                  <span className="text-xl font-bold text-yellow-400">{todayOrders.filter(o => o.status === 'pending').length}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-stone-800/50">
                  <span className="text-stone-300">Dispatched:</span>
                  <span className="text-xl font-bold text-blue-400">{todayOrders.filter(o => o.status === 'dispatched').length}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-stone-300">Delivered:</span>
                  <span className="text-xl font-bold text-emerald-400">{todayOrders.filter(o => o.status === 'delivered' || o.status === 'completed').length}</span>
                </div>
              </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-orange-400 flex items-center gap-2">
                    <span>⚠️</span> Low Stock Alerts
                  </h3>
                </div>
                {lowStockItems.length > 0 && (
                  <span className="text-3xl">⚠️</span>
                )}
              </div>
              
              {lowStockItems.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl mb-2 block">✅</span>
                  <p className="text-emerald-400 font-medium">All items in stock</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-5xl font-bold text-orange-400 mb-2">{lowStockItems.length}</p>
                  <p className="text-stone-400 mb-4">Items need reordering</p>
                  <button
                    onClick={() => setActiveTab('stock')}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                  >
                    Click to view details
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-emerald-400 mb-2">Quick Actions</h3>
            <p className="text-sm text-stone-500 mb-4">Create new orders and track existing ones</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setShowOrderPage(true)}
                className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/20 ripple"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Order
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className="flex items-center justify-center gap-3 p-4 bg-stone-800 text-white rounded-xl font-medium hover:bg-stone-700 transition-all active:scale-[0.98] border border-stone-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                View My Orders
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STOCK TAB */}
      {activeTab === 'stock' && (
        <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl overflow-hidden">
          <div className="p-4 bg-stone-800/30 border-b border-stone-800/50">
            <h3 className="text-lg font-semibold text-white">Current Stock Levels</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-stone-500 uppercase bg-stone-800/20">
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Current Stock</th>
                  <th className="px-4 py-3 text-right">Min Level</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => {
                  const stock = stockData[item.id] || { current: 0, minimum: 10 };
                  const isLow = stock.current <= stock.minimum;
                  const isCritical = stock.current <= stock.minimum / 2;
                  
                  return (
                    <tr key={item.id} className="border-t border-stone-800/30 hover:bg-stone-800/20">
                      <td className="px-4 py-3 text-white font-medium">{item.name}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs rounded-md bg-stone-800 text-stone-400">{getCategoryName(item.categoryId)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-lg font-semibold ${isCritical ? 'text-red-400' : isLow ? 'text-orange-400' : 'text-white'}`}>
                          {stock.current}
                        </span>
                        <span className="text-sm text-stone-500 ml-1">{item.unit}</span>
                      </td>
                      <td className="px-4 py-3 text-right text-stone-400">{stock.minimum} {item.unit}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`px-2 py-1 text-xs rounded-lg font-medium ${
                          isCritical ? 'bg-red-500/20 text-red-400' :
                          isLow ? 'bg-orange-500/20 text-orange-400' :
                          'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {isCritical ? 'Critical' : isLow ? 'Low' : 'OK'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STOCK OUT TAB */}
      {activeTab === 'stockOut' && (
        <div className="space-y-6">
          {(() => {
            const { canSubmit, effectiveDate, alreadySubmitted } = canSubmitStockOut();
            const todayEntry = stockOutHistory.find(e => e.effectiveDate === effectiveDate);

            return (
              <>
                {/* Info Card */}
                <div className={`border rounded-2xl p-6 ${alreadySubmitted ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{alreadySubmitted ? '✅' : '📤'}</span>
                    <div>
                      <h3 className={`text-lg font-semibold ${alreadySubmitted ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {alreadySubmitted ? 'Stock Out Submitted' : 'Daily Stock Out Entry'}
                      </h3>
                      <p className="text-sm text-stone-400 mt-1">
                        {alreadySubmitted 
                          ? `Stock out for ${effectiveDate} was submitted at ${todayEntry ? formatDate(todayEntry.submittedAt) : ''}`
                          : `Enter remaining stock at end of day. Deadline: 2:00 AM IST`
                        }
                      </p>
                      <p className="text-xs text-stone-500 mt-2">
                        ⚠️ Stock out can only be submitted once per day and cannot be edited after submission.
                      </p>
                    </div>
                  </div>
                </div>

                {alreadySubmitted && todayEntry ? (
                  /* Show submitted data */
                  <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl overflow-hidden">
                    <div className="p-4 bg-stone-800/30 border-b border-stone-800/50">
                      <h3 className="text-lg font-semibold text-white">Submitted Stock Out - {effectiveDate}</h3>
                      <p className="text-xs text-stone-500">Submitted by {todayEntry.submittedBy} at {formatDate(todayEntry.submittedAt)}</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-xs text-stone-500 uppercase bg-stone-800/20">
                            <th className="px-4 py-3">Item</th>
                            <th className="px-4 py-3 text-right">Before</th>
                            <th className="px-4 py-3 text-right">Remaining</th>
                            <th className="px-4 py-3 text-right">Used</th>
                          </tr>
                        </thead>
                        <tbody>
                          {todayEntry.items.map((item, idx) => (
                            <tr key={idx} className="border-t border-stone-800/30">
                              <td className="px-4 py-3 text-white">{item.name}</td>
                              <td className="px-4 py-3 text-right text-stone-400">{item.before} {item.unit}</td>
                              <td className="px-4 py-3 text-right text-white">{item.remaining} {item.unit}</td>
                              <td className="px-4 py-3 text-right text-red-400">-{item.used} {item.unit}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  /* Stock Out Entry Form */
                  <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl overflow-hidden">
                    <div className="p-4 bg-stone-800/30 border-b border-stone-800/50">
                      <h3 className="text-lg font-semibold text-white">Enter Remaining Stock</h3>
                      <p className="text-sm text-stone-400">Enter the quantity remaining for each item at end of day</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-xs text-stone-500 uppercase bg-stone-800/20">
                            <th className="px-4 py-3">Item</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3 text-right">Current Stock</th>
                            <th className="px-4 py-3 text-right">Remaining</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map(item => {
                            const stock = stockData[item.id] || { current: 0 };
                            return (
                              <tr key={item.id} className="border-t border-stone-800/30 hover:bg-stone-800/20">
                                <td className="px-4 py-3 text-white font-medium">{item.name}</td>
                                <td className="px-4 py-3">
                                  <span className="px-2 py-1 text-xs rounded-md bg-stone-800 text-stone-400">{getCategoryName(item.categoryId)}</span>
                                </td>
                                <td className="px-4 py-3 text-right text-stone-400">{stock.current} {item.unit}</td>
                                <td className="px-4 py-3 text-right">
                                  <input
                                    type="number"
                                    min="0"
                                    max={stock.current}
                                    value={stockOutData[item.id] ?? ''}
                                    onChange={(e) => setStockOutData(prev => ({
                                      ...prev,
                                      [item.id]: Math.min(Math.max(0, parseFloat(e.target.value) || 0), stock.current)
                                    }))}
                                    placeholder={stock.current.toString()}
                                    className="w-24 px-3 py-1.5 bg-stone-700 border border-stone-600 rounded-lg text-white text-right"
                                  />
                                  <span className="text-stone-500 ml-2 text-sm">{item.unit}</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="p-4 border-t border-stone-800/50">
                      <button
                        onClick={() => setShowConfirmDialog('stockOut')}
                        disabled={!canSubmit}
                        className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                          canSubmit
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 active:scale-[0.98]'
                            : 'bg-stone-700 text-stone-500 cursor-not-allowed'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Submit Stock Out
                      </button>
                    </div>
                  </div>
                )}

                {/* Stock Out History */}
                <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl overflow-hidden">
                  <div className="p-4 bg-stone-800/30 border-b border-stone-800/50">
                    <h3 className="text-lg font-semibold text-white">Stock Out History</h3>
                  </div>
                  {stockOutHistory.length === 0 ? (
                    <div className="text-center py-12 text-stone-500">
                      <span className="text-4xl mb-3 block">📋</span>
                      <p>No stock out entries yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-stone-800/30">
                      {stockOutHistory.slice(0, 10).map(entry => (
                        <div key={entry.id} className="p-4 hover:bg-stone-800/20">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">{entry.effectiveDate}</span>
                            <span className="text-xs text-stone-500">{formatDate(entry.submittedAt)}</span>
                          </div>
                          <p className="text-sm text-stone-400">
                            {entry.items.filter(i => i.used > 0).length} items used • 
                            Total: {entry.items.reduce((s, i) => s + i.used, 0)} units consumed
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* STOCK HISTORY TAB */}
      {activeTab === 'stockHistory' && (
        <div className="space-y-6">
          {/* Month Filter */}
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-white font-medium">Filter by Month:</span>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: 1, label: 'Jan' }, { value: 2, label: 'Feb' }, { value: 3, label: 'Mar' },
                  { value: 4, label: 'Apr' }, { value: 5, label: 'May' }, { value: 6, label: 'Jun' },
                  { value: 7, label: 'Jul' }, { value: 8, label: 'Aug' }, { value: 9, label: 'Sep' },
                  { value: 10, label: 'Oct' }, { value: 11, label: 'Nov' }, { value: 12, label: 'Dec' }
                ].map(month => (
                  <button
                    key={month.value}
                    onClick={() => setStockHistoryMonth(month.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      stockHistoryMonth === month.value
                        ? 'bg-amber-500 text-white'
                        : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                    }`}
                  >
                    {month.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stock Movement Graph */}
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-amber-400 mb-2 flex items-center gap-2">
              <span>📈</span> Stock Movement Chart
            </h3>
            <p className="text-sm text-stone-500 mb-6">
              Daily stock additions and usage for {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][stockHistoryMonth - 1]} {stockHistoryYear}
            </p>
            
            {(() => {
              // Filter history for selected month
              const filteredHistory = stockHistory.filter(entry => {
                const d = new Date(entry.date);
                return (d.getMonth() + 1) === stockHistoryMonth && d.getFullYear() === stockHistoryYear;
              });

              if (filteredHistory.length === 0) {
                return (
                  <div className="text-center py-12 text-stone-500">
                    <span className="text-4xl mb-3 block">📊</span>
                    <p>No stock movements recorded for this month</p>
                  </div>
                );
              }

              // Group by day
              const dailyData = {};
              const daysInMonth = new Date(stockHistoryYear, stockHistoryMonth, 0).getDate();
              
              for (let i = 1; i <= daysInMonth; i++) {
                dailyData[i] = { added: 0, used: 0 };
              }

              filteredHistory.forEach(entry => {
                const day = new Date(entry.date).getDate();
                if (entry.type === 'add') {
                  dailyData[day].added += entry.quantity;
                } else {
                  dailyData[day].used += entry.quantity;
                }
              });

              const maxValue = Math.max(
                ...Object.values(dailyData).map(d => Math.max(d.added, d.used)),
                1
              );

              // Get days with activity
              const activeDays = Object.entries(dailyData)
                .filter(([_, data]) => data.added > 0 || data.used > 0)
                .map(([day, data]) => ({ day: parseInt(day), ...data }));

              return (
                <div className="space-y-4">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-stone-800/30 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-emerald-400">
                        {filteredHistory.filter(e => e.type === 'add').reduce((s, e) => s + e.quantity, 0)}
                      </p>
                      <p className="text-xs text-stone-500">Total Added</p>
                    </div>
                    <div className="bg-stone-800/30 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-red-400">
                        {filteredHistory.filter(e => e.type === 'use').reduce((s, e) => s + e.quantity, 0)}
                      </p>
                      <p className="text-xs text-stone-500">Total Used</p>
                    </div>
                    <div className="bg-stone-800/30 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-amber-400">
                        {filteredHistory.length}
                      </p>
                      <p className="text-xs text-stone-500">Transactions</p>
                    </div>
                    <div className="bg-stone-800/30 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-blue-400">
                        {activeDays.length}
                      </p>
                      <p className="text-xs text-stone-500">Active Days</p>
                    </div>
                  </div>

                  {/* Bar Chart */}
                  <div className="bg-stone-800/20 rounded-xl p-4">
                    <div className="flex items-end gap-1 h-48 overflow-x-auto pb-2">
                      {Object.entries(dailyData).map(([day, data]) => {
                        const addedHeight = maxValue > 0 ? (data.added / maxValue) * 100 : 0;
                        const usedHeight = maxValue > 0 ? (data.used / maxValue) * 100 : 0;
                        const hasData = data.added > 0 || data.used > 0;
                        
                        return (
                          <div key={day} className="flex flex-col items-center min-w-[20px] flex-1 group">
                            <div className="flex gap-0.5 items-end h-36">
                              {/* Added bar */}
                              <div 
                                className={`w-2 rounded-t transition-all duration-300 ${hasData ? 'bg-emerald-500' : 'bg-stone-700/30'}`}
                                style={{ height: `${Math.max(addedHeight, hasData ? 0 : 2)}%` }}
                                title={`Added: ${data.added}`}
                              />
                              {/* Used bar */}
                              <div 
                                className={`w-2 rounded-t transition-all duration-300 ${hasData ? 'bg-red-500' : 'bg-stone-700/30'}`}
                                style={{ height: `${Math.max(usedHeight, hasData ? 0 : 2)}%` }}
                                title={`Used: ${data.used}`}
                              />
                            </div>
                            <span className={`text-[10px] mt-1 ${hasData ? 'text-stone-400' : 'text-stone-600'}`}>{day}</span>
                            
                            {/* Tooltip on hover */}
                            {hasData && (
                              <div className="absolute bottom-full mb-2 hidden group-hover:block bg-stone-800 border border-stone-700 rounded-lg p-2 text-xs whitespace-nowrap z-10">
                                <p className="text-white font-medium">Day {day}</p>
                                <p className="text-emerald-400">Added: {data.added}</p>
                                <p className="text-red-400">Used: {data.used}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Legend */}
                    <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-stone-700/50">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-emerald-500" />
                        <span className="text-sm text-stone-400">Stock Added</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-red-500" />
                        <span className="text-sm text-stone-400">Stock Used</span>
                      </div>
                    </div>
                  </div>

                  {/* Item-wise breakdown */}
                  <div className="bg-stone-800/20 rounded-xl p-4">
                    <h4 className="text-white font-medium mb-4">Item-wise Movement</h4>
                    {(() => {
                      const itemStats = {};
                      filteredHistory.forEach(entry => {
                        if (!itemStats[entry.itemName]) {
                          itemStats[entry.itemName] = { added: 0, used: 0 };
                        }
                        if (entry.type === 'add') {
                          itemStats[entry.itemName].added += entry.quantity;
                        } else {
                          itemStats[entry.itemName].used += entry.quantity;
                        }
                      });

                      const sortedItems = Object.entries(itemStats)
                        .sort((a, b) => (b[1].added + b[1].used) - (a[1].added + a[1].used));

                      const itemMax = Math.max(...sortedItems.map(([_, d]) => Math.max(d.added, d.used)), 1);

                      return (
                        <div className="space-y-3">
                          {sortedItems.slice(0, 10).map(([itemName, data]) => (
                            <div key={itemName} className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-white">{itemName}</span>
                                <div className="flex gap-4 text-xs">
                                  <span className="text-emerald-400">+{data.added}</span>
                                  <span className="text-red-400">-{data.used}</span>
                                </div>
                              </div>
                              <div className="flex gap-1 h-2">
                                <div 
                                  className="bg-emerald-500 rounded-full transition-all duration-500"
                                  style={{ width: `${(data.added / itemMax) * 50}%` }}
                                />
                                <div 
                                  className="bg-red-500 rounded-full transition-all duration-500"
                                  style={{ width: `${(data.used / itemMax) * 50}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Transaction History Table */}
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl overflow-hidden">
            <div className="p-4 bg-stone-800/30 border-b border-stone-800/50">
              <h3 className="text-lg font-semibold text-white">Transaction History</h3>
              <p className="text-sm text-stone-500">
                {stockHistory.filter(entry => {
                  const d = new Date(entry.date);
                  return (d.getMonth() + 1) === stockHistoryMonth && d.getFullYear() === stockHistoryYear;
                }).length} transactions in {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][stockHistoryMonth - 1]}
              </p>
            </div>
            {stockHistory.filter(entry => {
              const d = new Date(entry.date);
              return (d.getMonth() + 1) === stockHistoryMonth && d.getFullYear() === stockHistoryYear;
            }).length === 0 ? (
              <div className="text-center py-12 text-stone-500">
                <span className="text-4xl mb-3 block">📋</span>
                <p>No stock movements recorded for this month</p>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-96">
                <table className="w-full">
                  <thead className="sticky top-0 bg-stone-900">
                    <tr className="text-left text-xs text-stone-500 uppercase">
                      <th className="px-4 py-3">Date & Time</th>
                      <th className="px-4 py-3">Item</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3 text-right">Quantity</th>
                      <th className="px-4 py-3">By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockHistory
                      .filter(entry => {
                        const d = new Date(entry.date);
                        return (d.getMonth() + 1) === stockHistoryMonth && d.getFullYear() === stockHistoryYear;
                      })
                      .map(entry => (
                        <tr key={entry.id} className="border-t border-stone-800/30 hover:bg-stone-800/20">
                          <td className="px-4 py-3 text-stone-400 text-sm">{formatDate(entry.date)}</td>
                          <td className="px-4 py-3 text-white">{entry.itemName}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs rounded-lg font-medium ${
                              entry.type === 'add' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {entry.type === 'add' ? 'Added' : 'Used'}
                            </span>
                          </td>
                          <td className={`px-4 py-3 text-right font-medium ${
                            entry.type === 'add' ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                            {entry.type === 'add' ? '+' : '-'}{entry.quantity}
                          </td>
                          <td className="px-4 py-3 text-stone-400 text-sm">{entry.user}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PURCHASE HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Purchase History</h3>
            <button
              onClick={() => setShowOrderPage(true)}
              className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Order
            </button>
          </div>
          <OrderHistory orders={orders} showOutlet={false} />
        </div>
      )}

      {/* MONTHLY TAB */}
      {activeTab === 'monthly' && (
        <div className="space-y-6">
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-amber-400 mb-2 flex items-center gap-2">
              <span>📅</span> Monthly Report - {today.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </h3>
            <p className="text-sm text-stone-500 mb-6">Your outlet's monthly purchase summary</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-stone-800/30 rounded-xl p-4 text-center">
                <p className="text-sm text-stone-400 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-white">{monthOrders.length}</p>
              </div>
              <div className="bg-stone-800/30 rounded-xl p-4 text-center">
                <p className="text-sm text-stone-400 mb-1">Total Spend</p>
                <p className="text-3xl font-bold text-amber-400">{formatCurrency(monthOrders.reduce((s, o) => s + o.totalAmount, 0))}</p>
              </div>
              <div className="bg-stone-800/30 rounded-xl p-4 text-center">
                <p className="text-sm text-stone-400 mb-1">Avg Order Value</p>
                <p className="text-3xl font-bold text-emerald-400">
                  {formatCurrency(monthOrders.length > 0 ? monthOrders.reduce((s, o) => s + o.totalAmount, 0) / monthOrders.length : 0)}
                </p>
              </div>
            </div>

            <h4 className="text-white font-medium mb-3">Top Ordered Items</h4>
            {(() => {
              const itemStats = {};
              monthOrders.forEach(order => {
                order.items.forEach(item => {
                  if (itemStats[item.id]) {
                    itemStats[item.id].quantity += item.quantity;
                    itemStats[item.id].cost += item.totalCost;
                  } else {
                    itemStats[item.id] = { ...item, quantity: item.quantity, cost: item.totalCost };
                  }
                });
              });
              const sorted = Object.values(itemStats).sort((a, b) => b.cost - a.cost).slice(0, 5);

              return sorted.length === 0 ? (
                <p className="text-stone-500 text-center py-4">No orders this month</p>
              ) : (
                <div className="space-y-2">
                  {sorted.map((item, idx) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-stone-800/30 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-stone-500 font-medium w-6">{idx + 1}.</span>
                        <span className="text-white">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-amber-400 font-medium">{formatCurrency(item.cost)}</span>
                        <span className="text-stone-500 text-sm ml-2">({item.quantity} {item.unit})</span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
// ============================================
// CENTRAL KITCHEN DASHBOARD
// ============================================
function CentralKitchenDashboard({ user, items, categories, orders, revenueData, onUpdateItems, onUpdateCategories, onUpdateOrderStatus, onUpdateOrder }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOutlet, setSelectedOutlet] = useState('All');
  const [priceEditing, setPriceEditing] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [reviewingOrder, setReviewingOrder] = useState(null);
  const [editedItems, setEditedItems] = useState({});
  const [dispatchNote, setDispatchNote] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [showOverOrderingAlerts, setShowOverOrderingAlerts] = useState(true);
  const [showVendorAlerts, setShowVendorAlerts] = useState(true);
  const [vendorPriceAlerts, setVendorPriceAlerts] = useState([]);
  
  // Load vendor alerts on mount (simulated weekly check)
  useEffect(() => {
    const alerts = AIAnalytics.compareVendorPrices(items);
    setVendorPriceAlerts(alerts);
  }, [items]);

  // AI Over-ordering analysis for each outlet
  const outlets = ['Santacruz', 'Bandra', 'Oshiwara'];
  const overOrderingByOutlet = {};
  outlets.forEach(outlet => {
    overOrderingByOutlet[outlet] = AIAnalytics.analyzeOverOrdering(orders, outlet, items);
  });
  const totalOverOrderingAlerts = Object.values(overOrderingByOutlet).reduce((sum, arr) => sum + arr.length, 0);
  
  // Category & Item management
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [newItemData, setNewItemData] = useState({ name: '', categoryId: '', unit: 'kg', price: '' });
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const [viewingOrderDetails, setViewingOrderDetails] = useState(null);
  const [itemSearchId, setItemSearchId] = useState('');
  const [itemSearchOutletView, setItemSearchOutletView] = useState('consolidated');

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : 'Uncategorized';
  };

  // Get budget (30% of revenue) for an outlet for a specific month
  const getBudget = (outlet, month = currentMonth) => {
    const revenue = revenueData?.[outlet]?.[month] || 0;
    return revenue * 0.30;
  };

  // Category management functions
  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    const newId = Math.max(...categories.map(c => c.id), 0) + 1;
    onUpdateCategories([...categories, { id: newId, name: newCategoryName, description: newCategoryDesc }]);
    setNewCategoryName('');
    setNewCategoryDesc('');
    setShowAddCategory(false);
  };

  const deleteCategory = (id) => {
    if (items.some(item => item.categoryId === id)) {
      alert('Cannot delete category with items. Move or delete items first.');
      return;
    }
    onUpdateCategories(categories.filter(c => c.id !== id));
  };

  // Item management functions
  const addItem = () => {
    if (!newItemData.name.trim() || !newItemData.categoryId || !newItemData.price) return;
    const newId = Math.max(...items.map(i => i.id), 0) + 1;
    onUpdateItems([...items, { 
      id: newId, 
      name: newItemData.name, 
      categoryId: parseInt(newItemData.categoryId), 
      unit: newItemData.unit, 
      price: parseFloat(newItemData.price) 
    }]);
    setNewItemData({ name: '', categoryId: '', unit: 'kg', price: '' });
    setShowAddItem(false);
  };

  const deleteItem = (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      onUpdateItems(items.filter(item => item.id !== id));
    }
  };

  // Pending orders that need review
  const pendingOrders = orders.filter(o => o.status === 'pending');

  // Start reviewing an order
  const startReview = (order) => {
    setReviewingOrder(order);
    const items = {};
    order.items.forEach(item => {
      items[item.id] = item.quantity;
    });
    setEditedItems(items);
    setDispatchNote('');
  };

  // Update quantity during review
  const updateItemQuantity = (itemId, quantity) => {
    setEditedItems(prev => ({
      ...prev,
      [itemId]: Math.max(0, quantity)
    }));
  };

  // Dispatch the order
  const dispatchOrder = () => {
    if (!reviewingOrder) return;

    const updatedItems = reviewingOrder.items.map(item => ({
      ...item,
      quantity: editedItems[item.id] || 0,
      totalCost: item.price * (editedItems[item.id] || 0)
    })).filter(item => item.quantity > 0);

    const totalAmount = updatedItems.reduce((sum, item) => sum + item.totalCost, 0);

    onUpdateOrder(reviewingOrder.id, {
      items: updatedItems,
      totalAmount,
      status: 'dispatched',
      dispatchedAt: new Date().toISOString(),
      dispatchedBy: user?.name || 'Central Kitchen',
      notes: dispatchNote
    });

    setReviewingOrder(null);
    setEditedItems({});
    setDispatchNote('');
  };

  // Filter helpers
  const getTodayOrders = () => orders.filter(o => new Date(o.createdAt).toDateString() === today.toDateString());
  const getMonthOrders = (month = currentMonth, year = currentYear) => 
    orders.filter(o => {
      const d = new Date(o.createdAt);
      return (d.getMonth() + 1) === month && d.getFullYear() === year;
    });
  const getOutletOrders = (outlet) => orders.filter(o => o.outlet === outlet);
  const getOutletMonthOrders = (outlet, month = currentMonth) => 
    orders.filter(o => o.outlet === outlet && (new Date(o.createdAt).getMonth() + 1) === month);

  const todayOrders = getTodayOrders();
  const monthOrders = getMonthOrders();

  // Get disputed orders
  const getDisputedOrders = (outlet = null, month = currentMonth) => {
    return orders.filter(o => {
      const d = new Date(o.createdAt);
      const matchesMonth = (d.getMonth() + 1) === month;
      const matchesOutlet = outlet ? o.outlet === outlet : true;
      return o.status === 'disputed' && matchesMonth && matchesOutlet;
    });
  };

  const disputedOrdersThisMonth = getDisputedOrders();
  const disputesByOutlet = {};
  outlets.forEach(outlet => {
    disputesByOutlet[outlet] = getDisputedOrders(outlet).length;
  });
  const totalDisputes = disputedOrdersThisMonth.length;

  // Calculate cumulative quantities for pending orders
  const getCumulativeOrders = () => {
    const cumulative = {};
    pendingOrders.forEach(order => {
      order.items.forEach(item => {
        if (cumulative[item.id]) {
          cumulative[item.id].quantity += item.quantity;
          cumulative[item.id].totalCost += item.totalCost;
          if (!cumulative[item.id].outlets.includes(order.outlet)) {
            cumulative[item.id].outlets.push(order.outlet);
          }
        } else {
          cumulative[item.id] = {
            ...item,
            quantity: item.quantity,
            totalCost: item.totalCost,
            outlets: [order.outlet],
          };
        }
      });
    });
    return cumulative;
  };

  const handlePriceUpdate = (itemId) => {
    const price = parseFloat(newPrice);
    if (isNaN(price) || price <= 0) return;
    
    const currentItem = items.find(i => i.id === itemId);
    const previousPrice = currentItem?.price || 0;
    const priceChange = price - previousPrice;
    const priceChangePercent = previousPrice > 0 ? ((priceChange / previousPrice) * 100) : 0;
    
    onUpdateItems(items.map(item => 
      item.id === itemId ? { 
        ...item, 
        price, 
        lastUpdated: new Date().toISOString(),
        previousPrice: previousPrice,
        priceChange: priceChange,
        priceChangePercent: priceChangePercent,
        priceHistory: [
          ...(item.priceHistory || []),
          {
            price: previousPrice,
            changedAt: new Date().toISOString(),
            changedTo: price
          }
        ].slice(-10) // Keep last 10 price changes
      } : item
    ));
    setPriceEditing(null);
    setNewPrice('');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'history', label: 'Purchase History', icon: '📋' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'manage', label: 'Manage Items', icon: '📦' },
    { id: 'prices', label: 'Prices', icon: '💰' },
    { id: 'budget', label: 'Budget', icon: '🎯' },
    { id: 'monthly', label: 'Monthly', icon: '📅' },
    { id: 'ai', label: 'AI Insights', icon: '🤖' },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-2 flex gap-1 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
            {tab.id === 'ai' && (totalOverOrderingAlerts > 0 || vendorPriceAlerts.length > 0) && (
              <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {totalOverOrderingAlerts + vendorPriceAlerts.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* AI Over-ordering Alert Summary */}
          {showOverOrderingAlerts && totalOverOrderingAlerts > 0 && (
            <AIAlertCard
              type="warning"
              title="Over-Ordering Detected"
              description={`${totalOverOrderingAlerts} item(s) are being ordered more than last week across outlets. Click to view AI Insights tab for details.`}
              onDismiss={() => setShowOverOrderingAlerts(false)}
              onAction={() => setActiveTab('ai')}
              actionLabel="View Details"
            />
          )}

          {/* Vendor Price Alert Summary */}
          {showVendorAlerts && vendorPriceAlerts.length > 0 && (
            <AIAlertCard
              type="price"
              title="Better Prices Found"
              description={`AI found ${vendorPriceAlerts.length} item(s) available at lower prices from Mumbai vendors. Potential savings identified.`}
              onDismiss={() => setShowVendorAlerts(false)}
              onAction={() => setActiveTab('ai')}
              actionLabel="View Vendor Prices"
            />
          )}

          {/* Disputes Alert */}
          {totalDisputes > 0 && (
            <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h3 className="text-base font-semibold text-red-400">Disputes This Month: {totalDisputes}</h3>
                    <p className="text-xs text-stone-400">
                      {outlets.map(o => `${o}: ${disputesByOutlet[o]}`).join(' • ')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('history')}
                  className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          )}

          {/* Pending Orders Alert */}
          {pendingOrders.length > 0 && (
            <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🔔</span>
                <div>
                  <h3 className="text-lg font-semibold text-orange-400">Orders Pending Dispatch</h3>
                  <p className="text-sm text-stone-400">{pendingOrders.length} order(s) waiting to be reviewed and dispatched</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {pendingOrders.map(order => (
                  <div key={order.id} className="bg-stone-900/50 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-white font-medium">{order.id}</span>
                        <span className="px-2 py-0.5 bg-stone-700 text-stone-300 text-xs rounded-lg">{order.outlet}</span>
                      </div>
                      <p className="text-xs text-stone-500">{formatDate(order.createdAt)} • {order.items.length} items • {formatCurrency(order.totalAmount)}</p>
                    </div>
                    <button
                      onClick={() => startReview(order)}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                    >
                      Review & Dispatch
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Today's Summary */}
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-amber-400 mb-2 flex items-center gap-2">
              <span>📊</span> Today's Summary
            </h3>
            <p className="text-sm text-stone-500 mb-4">Real-time overview of today's orders</p>
            
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div className="bg-stone-800/30 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-blue-400">{todayOrders.length}</p>
                <p className="text-sm text-stone-400 mt-1">Total Orders</p>
              </div>
              <div className="bg-stone-800/30 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-emerald-400">{formatCurrency(todayOrders.reduce((s, o) => s + o.totalAmount, 0))}</p>
                <p className="text-sm text-stone-400 mt-1">Total Value</p>
              </div>
              <div className="bg-stone-800/30 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-yellow-400">{todayOrders.filter(o => o.status === 'pending').length}</p>
                <p className="text-sm text-stone-400 mt-1">Pending</p>
              </div>
              <div className="bg-stone-800/30 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-blue-400">{todayOrders.filter(o => o.status === 'dispatched').length}</p>
                <p className="text-sm text-stone-400 mt-1">Dispatched</p>
              </div>
              <div className="bg-stone-800/30 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-purple-400">{todayOrders.filter(o => o.status === 'delivered' || o.status === 'completed').length}</p>
                <p className="text-sm text-stone-400 mt-1">Delivered</p>
              </div>
              <div className="bg-stone-800/30 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-red-400">{todayOrders.filter(o => o.status === 'disputed').length}</p>
                <p className="text-sm text-stone-400 mt-1">Disputed</p>
              </div>
            </div>

            {/* Outlet Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {outlets.map(outlet => {
                const outletTodayOrders = todayOrders.filter(o => o.outlet === outlet);
                const outletTotal = outletTodayOrders.reduce((s, o) => s + o.totalAmount, 0);
                const outletPending = outletTodayOrders.filter(o => o.status === 'pending').length;
                const outletDispatched = outletTodayOrders.filter(o => o.status === 'dispatched').length;
                return (
                  <div key={outlet} className="bg-stone-800/20 border border-stone-700/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{outlet}</span>
                      <div className="flex gap-1">
                        {outletPending > 0 && (
                          <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-lg">{outletPending} pending</span>
                        )}
                        {outletDispatched > 0 && (
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-lg">{outletDispatched} sent</span>
                        )}
                      </div>
                    </div>
                    <p className="text-xl font-bold text-amber-400">{formatCurrency(outletTotal)}</p>
                    <p className="text-xs text-stone-500">{outletTodayOrders.length} orders</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cumulative Pending Orders for Vendor */}
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-amber-400 mb-2 flex items-center gap-2">
              <span>🛒</span> Cumulative Pending Orders
            </h3>
            <p className="text-sm text-stone-500 mb-4">Combined quantities from all outlets for vendor ordering</p>
            
            {Object.keys(getCumulativeOrders()).length === 0 ? (
              <div className="text-center py-8 text-stone-500">
                <p>No pending orders to process</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-stone-500 uppercase border-b border-stone-800">
                      <th className="pb-3">Item</th>
                      <th className="pb-3">Outlets</th>
                      <th className="pb-3 text-right">Total Qty</th>
                      <th className="pb-3 text-right">Unit Price</th>
                      <th className="pb-3 text-right">Total Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(getCumulativeOrders()).map(item => (
                      <tr key={item.id} className="border-b border-stone-800/30">
                        <td className="py-3">
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-xs text-stone-500">{item.categoryName || getCategoryName(item.categoryId)}</p>
                        </td>
                        <td className="py-3">
                          <div className="flex gap-1 flex-wrap">
                            {item.outlets.map(o => (
                              <span key={o} className="text-xs px-2 py-0.5 bg-stone-700 rounded text-stone-300">{o}</span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          <span className="text-lg font-semibold text-white">{item.quantity}</span>
                          <span className="text-sm text-stone-500 ml-1">{item.unit}</span>
                        </td>
                        <td className="py-3 text-right text-stone-400">{formatCurrency(item.price)}</td>
                        <td className="py-3 text-right text-amber-400 font-semibold">{formatCurrency(item.totalCost)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-stone-700">
                      <td colSpan={4} className="py-4 text-right font-semibold text-stone-400">Grand Total:</td>
                      <td className="py-4 text-right text-xl font-bold text-amber-400">
                        {formatCurrency(Object.values(getCumulativeOrders()).reduce((s, i) => s + i.totalCost, 0))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setActiveTab('prices')}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2"
            >
              <span>💰</span> Manage Prices
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className="bg-stone-800 text-white p-4 rounded-xl font-medium hover:bg-stone-700 transition-all flex items-center justify-center gap-2 border border-stone-700"
            >
              <span>📋</span> View All Orders
            </button>
          </div>
        </div>
      )}

      {/* ORDER REVIEW MODAL */}
      {reviewingOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-full flex items-start justify-center p-4 py-8">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-2xl animate-modal-in">
              {/* Header */}
              <div className="p-4 border-b border-stone-800 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">Review Order</h2>
                  <p className="text-sm text-stone-500">{reviewingOrder.id} • {reviewingOrder.outlet}</p>
                </div>
                <button
                  onClick={() => { setReviewingOrder(null); setEditedItems({}); }}
                  className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-all active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="bg-stone-800/30 rounded-xl p-4 mb-4">
                  <p className="text-sm text-stone-400">Requested by: <span className="text-white">{reviewingOrder.createdBy}</span></p>
                  <p className="text-sm text-stone-400">Date: <span className="text-white">{formatDate(reviewingOrder.createdAt)}</span></p>
                </div>

                <h3 className="text-sm font-medium text-stone-400 uppercase mb-3">Items (Adjust quantities if needed)</h3>
                <div className="space-y-3">
                  {reviewingOrder.items.map(item => (
                    <div key={item.id} className="bg-stone-800/50 rounded-xl p-4 transition-all hover:bg-stone-800/70">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-xs text-stone-500">{item.categoryName || getCategoryName(item.categoryId)} • {formatCurrency(item.price)}/{item.unit}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-stone-400">Requested: <span className="text-white">{item.requestedQuantity || item.quantity} {item.unit}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-stone-400">Send:</span>
                          <button
                            onClick={() => updateItemQuantity(item.id, (editedItems[item.id] || 0) - 1)}
                            className="w-8 h-8 rounded-lg bg-stone-700 text-white hover:bg-stone-600 flex items-center justify-center transition-all active:scale-90"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={editedItems[item.id] || 0}
                            onChange={(e) => updateItemQuantity(item.id, parseFloat(e.target.value) || 0)}
                            className="w-20 px-2 py-1 bg-stone-700 border border-stone-600 rounded-lg text-white text-center"
                          />
                          <button
                            onClick={() => updateItemQuantity(item.id, (editedItems[item.id] || 0) + 1)}
                            className="w-8 h-8 rounded-lg bg-stone-700 text-white hover:bg-stone-600 flex items-center justify-center transition-all active:scale-90"
                          >
                            +
                          </button>
                          <span className="text-sm text-stone-500">{item.unit}</span>
                        </div>
                      </div>
                      {editedItems[item.id] !== (item.requestedQuantity || item.quantity) && (
                        <p className="text-xs text-orange-400 mt-2 animate-pulse">
                          ⚠️ Modified from requested quantity
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <label className="text-sm text-stone-400 block mb-2">Note for outlet (optional)</label>
                  <textarea
                    value={dispatchNote}
                    onChange={(e) => setDispatchNote(e.target.value)}
                    placeholder="e.g., Some items were out of stock..."
                    className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm transition-all"
                    rows={2}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-stone-800 bg-stone-900/50 rounded-b-2xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-stone-400">Total Amount:</span>
                  <span className="text-xl font-bold text-amber-400">
                    {formatCurrency(reviewingOrder.items.reduce((sum, item) => sum + (item.price * (editedItems[item.id] || 0)), 0))}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setReviewingOrder(null); setEditedItems({}); }}
                    className="flex-1 py-3 bg-stone-800 text-white rounded-xl font-medium hover:bg-stone-700 transition-all active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={dispatchOrder}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Dispatch Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PURCHASE HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-white">Purchase History</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedOutlet('All')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedOutlet === 'All' ? 'bg-amber-500 text-white' : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                  }`}
                >
                  All Outlets
                </button>
                {outlets.map(outlet => (
                  <button
                    key={outlet}
                    onClick={() => setSelectedOutlet(outlet)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedOutlet === outlet ? 'bg-amber-500 text-white' : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                    }`}
                  >
                    {outlet}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <ItemSearchAnalytics
            items={items}
            categories={categories}
            orders={orders}
            outlets={outlets}
            searchItemId={itemSearchId}
            onSearchItemChange={setItemSearchId}
            outletView={itemSearchOutletView}
            onOutletViewChange={setItemSearchOutletView}
          />

          <OrderHistory 
            orders={selectedOutlet === 'All' ? orders : orders.filter(o => o.outlet === selectedOutlet)}
            showOutlet={true}
            showActions={true}
            onUpdateStatus={onUpdateOrderStatus}
          />
        </div>
      )}

      {/* ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Top Ordered Items */}
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
              <span>🏆</span> Top Ordered Items (This Month)
            </h3>
            {(() => {
              const itemStats = {};
              monthOrders.forEach(order => {
                order.items.forEach(item => {
                  if (itemStats[item.id]) {
                    itemStats[item.id].quantity += item.quantity;
                    itemStats[item.id].totalCost += item.totalCost;
                    itemStats[item.id].orderCount += 1;
                  } else {
                    itemStats[item.id] = {
                      ...item,
                      quantity: item.quantity,
                      totalCost: item.totalCost,
                      orderCount: 1,
                    };
                  }
                });
              });
              const sorted = Object.values(itemStats).sort((a, b) => b.totalCost - a.totalCost).slice(0, 10);
              const maxCost = sorted[0]?.totalCost || 1;

              return sorted.length === 0 ? (
                <p className="text-stone-500 text-center py-8">No orders this month</p>
              ) : (
                <div className="space-y-3">
                  {sorted.map((item, idx) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <span className="text-lg font-bold text-stone-500 w-6">{idx + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-medium">{item.name}</span>
                          <span className="text-amber-400 font-semibold">{formatCurrency(item.totalCost)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-stone-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                              style={{ width: `${(item.totalCost / maxCost) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-stone-500">{item.quantity} {item.unit}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Category Analysis */}
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
              <span>📦</span> Category Breakdown (This Month)
            </h3>
            {(() => {
              const categoryStats = {};
              monthOrders.forEach(order => {
                order.items.forEach(item => {
                  const catName = item.categoryName || getCategoryName(item.categoryId) || 'Uncategorized';
                  if (categoryStats[catName]) {
                    categoryStats[catName].cost += item.totalCost;
                    categoryStats[catName].items += item.quantity;
                  } else {
                    categoryStats[catName] = { cost: item.totalCost, items: item.quantity };
                  }
                });
              });
              const total = Object.values(categoryStats).reduce((s, c) => s + c.cost, 0);
              const sorted = Object.entries(categoryStats).sort((a, b) => b[1].cost - a[1].cost);

              return sorted.length === 0 ? (
                <p className="text-stone-500 text-center py-8">No data available</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sorted.map(([category, data]) => (
                    <div key={category} className="bg-stone-800/30 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{category}</span>
                        <span className="text-xs text-stone-500">{total > 0 ? ((data.cost / total) * 100).toFixed(1) : 0}%</span>
                      </div>
                      <p className="text-xl font-bold text-amber-400">{formatCurrency(data.cost)}</p>
                      <div className="h-1.5 bg-stone-700 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: `${total > 0 ? (data.cost / total) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Outlet Comparison */}
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
              <span>🏪</span> Outlet Comparison (This Month)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-stone-500 uppercase border-b border-stone-800">
                    <th className="pb-3">Outlet</th>
                    <th className="pb-3 text-right">Orders</th>
                    <th className="pb-3 text-right">Total Spend</th>
                    <th className="pb-3 text-right">Avg Order Value</th>
                    <th className="pb-3 text-right">Pending</th>
                  </tr>
                </thead>
                <tbody>
                  {outlets.map(outlet => {
                    const outletOrders = getOutletMonthOrders(outlet);
                    const totalSpend = outletOrders.reduce((s, o) => s + o.totalAmount, 0);
                    const avgOrder = outletOrders.length > 0 ? totalSpend / outletOrders.length : 0;
                    const pending = outletOrders.filter(o => o.status === 'pending').length;
                    return (
                      <tr key={outlet} className="border-b border-stone-800/30">
                        <td className="py-3 text-white font-medium">{outlet}</td>
                        <td className="py-3 text-right text-stone-300">{outletOrders.length}</td>
                        <td className="py-3 text-right text-amber-400 font-semibold">{formatCurrency(totalSpend)}</td>
                        <td className="py-3 text-right text-stone-400">{formatCurrency(avgOrder)}</td>
                        <td className="py-3 text-right">
                          <span className={`px-2 py-1 rounded-lg text-xs ${pending > 0 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                            {pending}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MANAGE ITEMS TAB */}
      {activeTab === 'manage' && (
        <div className="space-y-6">
          {/* Categories Section */}
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-amber-400 flex items-center gap-2">
                  <span>📁</span> Categories
                </h3>
                <p className="text-sm text-stone-500">Manage product categories</p>
              </div>
              <button
                onClick={() => setShowAddCategory(true)}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Category
              </button>
            </div>

            {showAddCategory && (
              <div className="bg-stone-800/50 rounded-xl p-4 mb-4">
                <h4 className="text-white font-medium mb-3">New Category</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Category Name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="px-4 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={newCategoryDesc}
                    onChange={(e) => setNewCategoryDesc(e.target.value)}
                    className="px-4 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addCategory}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600"
                  >
                    Save Category
                  </button>
                  <button
                    onClick={() => { setShowAddCategory(false); setNewCategoryName(''); setNewCategoryDesc(''); }}
                    className="px-4 py-2 bg-stone-700 text-white rounded-lg hover:bg-stone-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map(category => {
                const categoryItems = items.filter(i => i.categoryId === category.id);
                const itemCount = categoryItems.length;
                const isExpanded = expandedCategoryId === category.id;
                return (
                  <div key={category.id} className="bg-stone-800/30 rounded-xl border border-stone-700/50 overflow-hidden transition-all">
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-stone-800/50 transition-colors"
                      onClick={() => setExpandedCategoryId(isExpanded ? null : category.id)}
                    >
                      <div className="flex items-center gap-3">
                        <svg className={`w-5 h-5 text-stone-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <div>
                          <p className="text-white font-medium">{category.name}</p>
                          <p className="text-xs text-stone-500">{itemCount} items</p>
                        </div>
                      </div>
                      {itemCount === 0 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteCategory(category.id); }}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    {/* Expanded Items List */}
                    {isExpanded && (
                      <div className="border-t border-stone-700/50 bg-stone-900/30 p-4">
                        {categoryItems.length === 0 ? (
                          <p className="text-stone-500 text-sm text-center py-4">No items in this category</p>
                        ) : (
                          <div className="space-y-2">
                            {categoryItems.map(item => (
                              <div key={item.id} className="flex items-center justify-between py-2 px-3 bg-stone-800/50 rounded-lg">
                                <div>
                                  <p className="text-white text-sm font-medium">{item.name}</p>
                                  <p className="text-xs text-stone-500">{item.unit}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-amber-400 font-medium">{formatCurrency(item.price)}</span>
                                  <button
                                    onClick={() => deleteItem(item.id)}
                                    className="p-1.5 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items Section */}
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
                  <span>🛒</span> Items
                </h3>
                <p className="text-sm text-stone-500">Manage products in each category</p>
              </div>
              <button
                onClick={() => setShowAddItem(true)}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Item
              </button>
            </div>

            {showAddItem && (
              <div className="bg-stone-800/50 rounded-xl p-4 mb-4">
                <h4 className="text-white font-medium mb-3">New Item</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={newItemData.name}
                    onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
                    className="px-4 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                  <select
                    value={newItemData.categoryId}
                    onChange={(e) => setNewItemData({ ...newItemData, categoryId: e.target.value })}
                    className="px-4 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <select
                    value={newItemData.unit}
                    onChange={(e) => setNewItemData({ ...newItemData, unit: e.target.value })}
                    className="px-4 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    <option value="kg">kg</option>
                    <option value="ltr">ltr</option>
                    <option value="pcs">pcs</option>
                    <option value="pkt">pkt</option>
                    <option value="box">box</option>
                    <option value="case">case</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Price (₹)"
                    value={newItemData.price}
                    onChange={(e) => setNewItemData({ ...newItemData, price: e.target.value })}
                    className="px-4 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addItem}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600"
                  >
                    Save Item
                  </button>
                  <button
                    onClick={() => { setShowAddItem(false); setNewItemData({ name: '', categoryId: '', unit: 'kg', price: '' }); }}
                    className="px-4 py-2 bg-stone-700 text-white rounded-lg hover:bg-stone-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Category Filter */}
            <div className="mb-4">
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-4 py-2 bg-stone-800 border border-stone-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-stone-500 uppercase border-b border-stone-800">
                    <th className="pb-3 px-2">Item</th>
                    <th className="pb-3 px-2">Category</th>
                    <th className="pb-3 px-2">Unit</th>
                    <th className="pb-3 px-2 text-right">Price</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items
                    .filter(item => selectedCategoryFilter === 'All' || item.categoryId === parseInt(selectedCategoryFilter))
                    .map(item => (
                    <tr key={item.id} className="border-b border-stone-800/30 hover:bg-stone-800/20">
                      <td className="py-3 px-2 text-white font-medium">{item.name}</td>
                      <td className="py-3 px-2">
                        <span className="px-2 py-1 text-xs bg-stone-800 text-stone-400 rounded-lg">{getCategoryName(item.categoryId)}</span>
                      </td>
                      <td className="py-3 px-2 text-stone-400">{item.unit}</td>
                      <td className="py-3 px-2 text-right text-amber-400 font-medium">{formatCurrency(item.price)}</td>
                      <td className="py-3 px-2 text-right">
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PRICES TAB */}
      {activeTab === 'prices' && (
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-stone-400">Filter by Category:</span>
              <button
                onClick={() => setSelectedCategoryFilter('All')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedCategoryFilter === 'All'
                    ? 'bg-amber-500 text-white'
                    : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedCategoryFilter === cat.id
                      ? 'bg-amber-500 text-white'
                      : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl overflow-hidden">
          <div className="p-4 bg-stone-800/30 border-b border-stone-800/50">
            <h3 className="text-lg font-semibold text-white">Price Management</h3>
            <p className="text-sm text-stone-400">Update item prices - changes apply to new orders automatically</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-stone-400 uppercase tracking-wider">
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Unit</th>
                  <th className="px-4 py-3">Pkg</th>
                  <th className="px-4 py-3 text-right">Wt.</th>
                  <th className="px-4 py-3 text-right">Price/{`Unit`}</th>
                  <th className="px-4 py-3 text-right">Last Updated</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.filter(item => selectedCategoryFilter === 'All' || item.categoryId === selectedCategoryFilter).map(item => (
                  <tr key={item.id} className="border-t border-stone-800/30 hover:bg-stone-800/20">
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">{item.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs rounded-md bg-stone-800 text-stone-400">{getCategoryName(item.categoryId)}</span>
                    </td>
                    <td className="px-4 py-3 text-stone-400 text-sm">{item.unit}</td>
                    <td className="px-4 py-3 text-stone-400 text-sm">{item.pkg || '-'}</td>
                    <td className="px-4 py-3 text-right text-stone-400 text-sm">{item.wt || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      {priceEditing === item.id ? (
                        <input
                          type="number"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          className="w-28 px-3 py-1.5 bg-stone-700 border border-stone-600 rounded-lg text-white text-right"
                          autoFocus
                        />
                      ) : (
                        <span className="text-amber-400 font-semibold">₹{item.price.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-stone-500">
                      {item.lastUpdated ? formatDate(item.lastUpdated) : '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {priceEditing === item.id ? (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handlePriceUpdate(item.id)}
                            className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 text-sm rounded-lg hover:bg-emerald-500/30"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => { setPriceEditing(null); setNewPrice(''); }}
                            className="px-3 py-1.5 bg-stone-700 text-stone-400 text-sm rounded-lg hover:bg-stone-600"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setPriceEditing(item.id); setNewPrice(item.price.toString()); }}
                          className="px-4 py-1.5 bg-amber-500/20 text-amber-400 text-sm rounded-lg hover:bg-amber-500/30"
                        >
                          Edit Price
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      )}

      {/* BUDGET TAB */}
      {activeTab === 'budget' && (
        <div className="space-y-6">
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-amber-400 mb-2 flex items-center gap-2">
              <span>🎯</span> Monthly Purchase Budget
            </h3>
            <p className="text-sm text-stone-500 mb-6">
              Budget allocation for {today.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {outlets.map(outlet => {
                const spent = getOutletMonthOrders(outlet).reduce((s, o) => s + o.totalAmount, 0);
                const budget = getBudget(outlet);
                const percentage = budget > 0 ? (spent / budget) * 100 : 0;
                const isOverBudget = percentage > 100;

                return (
                  <div key={outlet} className="bg-stone-800/30 rounded-xl p-5 border border-stone-700/30">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-white">{outlet}</h4>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-stone-400">Monthly Budget</span>
                        <span className="text-white font-medium">{formatCurrency(budget)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-stone-400">Spent</span>
                        <span className={`font-medium ${isOverBudget ? 'text-red-400' : 'text-emerald-400'}`}>{formatCurrency(spent)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-stone-400">Remaining</span>
                        <span className={`font-medium ${isOverBudget ? 'text-red-400' : 'text-white'}`}>
                          {isOverBudget ? '-' : ''}{formatCurrency(Math.abs(budget - spent))}
                        </span>
                      </div>

                      <div className="pt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-stone-500">Usage</span>
                          <span className={isOverBudget ? 'text-red-400' : 'text-stone-400'}>{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="h-3 bg-stone-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              isOverBudget ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Total Budget Overview */}
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Total Budget Overview</h3>
            {(() => {
              const totalBudget = outlets.reduce((s, o) => s + getBudget(o), 0);
              const totalSpent = monthOrders.reduce((s, o) => s + o.totalAmount, 0);
              const totalRemaining = totalBudget - totalSpent;

              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-stone-800/30 rounded-xl p-4 text-center">
                    <p className="text-sm text-stone-400 mb-1">Total Monthly Budget</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(totalBudget)}</p>
                  </div>
                  <div className="bg-stone-800/30 rounded-xl p-4 text-center">
                    <p className="text-sm text-stone-400 mb-1">Total Spent</p>
                    <p className="text-2xl font-bold text-amber-400">{formatCurrency(totalSpent)}</p>
                  </div>
                  <div className="bg-stone-800/30 rounded-xl p-4 text-center">
                    <p className="text-sm text-stone-400 mb-1">Total Remaining</p>
                    <p className={`text-2xl font-bold ${totalRemaining >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {formatCurrency(Math.abs(totalRemaining))}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* MONTHLY TAB */}
      {activeTab === 'monthly' && (
        <div className="space-y-6">
          {/* Monthly Summary */}
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-amber-400 mb-2 flex items-center gap-2">
              <span>📅</span> Monthly Report - {today.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </h3>
            <p className="text-sm text-stone-500 mb-6">Detailed monthly breakdown by outlet</p>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-stone-500 uppercase border-b border-stone-800">
                    <th className="pb-3">Outlet</th>
                    <th className="pb-3 text-right">Orders</th>
                    <th className="pb-3 text-right">Items Ordered</th>
                    <th className="pb-3 text-right">Total Spend</th>
                    <th className="pb-3 text-right">Avg/Order</th>
                    <th className="pb-3 text-right">Budget Status</th>
                  </tr>
                </thead>
                <tbody>
                  {outlets.map(outlet => {
                    const outletOrders = getOutletMonthOrders(outlet);
                    const totalItems = outletOrders.reduce((s, o) => s + o.items.reduce((is, i) => is + i.quantity, 0), 0);
                    const totalSpend = outletOrders.reduce((s, o) => s + o.totalAmount, 0);
                    const avgOrder = outletOrders.length > 0 ? totalSpend / outletOrders.length : 0;
                    const budget = getBudget(outlet);
                    const budgetUsage = budget > 0 ? (totalSpend / budget) * 100 : 0;

                    return (
                      <tr key={outlet} className="border-b border-stone-800/30">
                        <td className="py-4 text-white font-medium">{outlet}</td>
                        <td className="py-4 text-right text-stone-300">{outletOrders.length}</td>
                        <td className="py-4 text-right text-stone-300">{totalItems.toFixed(1)}</td>
                        <td className="py-4 text-right text-amber-400 font-semibold">{formatCurrency(totalSpend)}</td>
                        <td className="py-4 text-right text-stone-400">{formatCurrency(avgOrder)}</td>
                        <td className="py-4 text-right">
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            budgetUsage > 100 ? 'bg-red-500/20 text-red-400' :
                            budgetUsage > 80 ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {budgetUsage.toFixed(0)}% used
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-stone-700">
                    <td className="py-4 font-semibold text-white">Total</td>
                    <td className="py-4 text-right font-semibold text-white">{monthOrders.length}</td>
                    <td className="py-4 text-right font-semibold text-white">
                      {monthOrders.reduce((s, o) => s + o.items.reduce((is, i) => is + i.quantity, 0), 0).toFixed(1)}
                    </td>
                    <td className="py-4 text-right font-bold text-amber-400 text-lg">
                      {formatCurrency(monthOrders.reduce((s, o) => s + o.totalAmount, 0))}
                    </td>
                    <td className="py-4 text-right text-stone-400">
                      {formatCurrency(monthOrders.length > 0 ? monthOrders.reduce((s, o) => s + o.totalAmount, 0) / monthOrders.length : 0)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Daily Breakdown */}
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Daily Order Breakdown</h3>
            {(() => {
              const dailyData = {};
              monthOrders.forEach(order => {
                const day = new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
                if (dailyData[day]) {
                  dailyData[day].orders += 1;
                  dailyData[day].total += order.totalAmount;
                } else {
                  dailyData[day] = { orders: 1, total: order.totalAmount };
                }
              });
              const days = Object.entries(dailyData).slice(-14); // Last 14 days
              const maxTotal = Math.max(...days.map(d => d[1].total), 1);

              return days.length === 0 ? (
                <p className="text-stone-500 text-center py-8">No orders this month</p>
              ) : (
                <div className="space-y-2">
                  {days.map(([day, data]) => (
                    <div key={day} className="flex items-center gap-4">
                      <span className="text-sm text-stone-400 w-16">{day}</span>
                      <div className="flex-1 h-8 bg-stone-800 rounded-lg overflow-hidden relative">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500/80 to-orange-500/80 rounded-lg"
                          style={{ width: `${(data.total / maxTotal) * 100}%` }}
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white">
                          {data.orders} orders
                        </span>
                      </div>
                      <span className="text-sm font-medium text-amber-400 w-24 text-right">{formatCurrency(data.total)}</span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* AI INSIGHTS TAB */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          {/* AI Header */}
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🤖</span>
              <div>
                <h2 className="text-xl font-bold text-white">AI-Powered Insights</h2>
                <p className="text-sm text-stone-400">Smart analytics to optimize your purchasing and detect anomalies</p>
              </div>
            </div>
          </div>

          {/* Over-Ordering Analysis */}
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-orange-400 mb-2 flex items-center gap-2">
              <span>⚠️</span> Over-Ordering Detection
              {totalOverOrderingAlerts > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                  {totalOverOrderingAlerts} alerts
                </span>
              )}
            </h3>
            <p className="text-sm text-stone-500 mb-4">Items being ordered 30% or more than last week</p>

            {totalOverOrderingAlerts === 0 ? (
              <div className="text-center py-8 text-stone-500">
                <span className="text-4xl mb-2 block">✅</span>
                <p>No over-ordering detected this week</p>
              </div>
            ) : (
              <div className="space-y-4">
                {outlets.map(outlet => {
                  const alerts = overOrderingByOutlet[outlet];
                  if (alerts.length === 0) return null;
                  
                  return (
                    <div key={outlet} className="bg-stone-800/30 rounded-xl p-4">
                      <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-stone-700 text-stone-300 text-xs rounded-lg">{outlet}</span>
                        <span className="text-orange-400 text-sm">{alerts.length} items</span>
                      </h4>
                      <div className="space-y-2">
                        {alerts.map((alert, idx) => (
                          <div key={idx} className="flex items-center justify-between py-2 border-b border-stone-700/50 last:border-0">
                            <div>
                              <p className="text-white">{alert.item.name}</p>
                              <p className="text-xs text-stone-500">
                                Last week: {alert.lastWeek} {alert.item.unit} → This week: {alert.thisWeek} {alert.item.unit}
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded-lg font-medium">
                              +{alert.increase}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Vendor Price Comparison */}
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-purple-400 mb-2 flex items-center gap-2">
              <span>💰</span> Vendor Price Comparison
              {vendorPriceAlerts.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                  {vendorPriceAlerts.length} better prices found
                </span>
              )}
            </h3>
            <p className="text-sm text-stone-500 mb-4">AI-scanned Mumbai vendors for better prices (weekly update)</p>

            {vendorPriceAlerts.length === 0 ? (
              <div className="text-center py-8 text-stone-500">
                <span className="text-4xl mb-2 block">✅</span>
                <p>All items are at competitive prices</p>
              </div>
            ) : (
              <div className="space-y-3">
                {vendorPriceAlerts.map((alert, idx) => (
                  <div key={idx} className="bg-stone-800/30 rounded-xl p-4 hover:bg-stone-800/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{alert.item.name}</h4>
                        <p className="text-sm text-stone-500 mt-1">{alert.vendor.name}</p>
                        <p className="text-xs text-stone-600">{alert.vendor.location} • ⭐ {alert.vendor.rating}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-stone-400 line-through text-sm">{formatCurrency(alert.currentPrice)}/{alert.item.unit}</p>
                        <p className="text-emerald-400 font-bold text-lg">{formatCurrency(alert.vendorPrice)}/{alert.item.unit}</p>
                        <p className="text-xs text-emerald-400 mt-1">Save {alert.savingsPercent}% ({formatCurrency(alert.savings)})</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Total Potential Savings */}
                <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-400 font-medium">Total Potential Savings</p>
                      <p className="text-xs text-stone-500">If all recommended vendors are used</p>
                    </div>
                    <p className="text-2xl font-bold text-emerald-400">
                      {formatCurrency(vendorPriceAlerts.reduce((sum, a) => sum + a.savings, 0))}/unit
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// ADMIN DASHBOARD
// ============================================
function AdminDashboard({ data, onUpdateItems, onUpdateRevenueData }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [editingRevenue, setEditingRevenue] = useState(null);
  const [newRevenue, setNewRevenue] = useState('');
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const [showAIAlerts, setShowAIAlerts] = useState(true);
  const [vendorPriceAlerts, setVendorPriceAlerts] = useState([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [reportMonth, setReportMonth] = useState(new Date().getMonth() + 1);
  const [reportOutlet, setReportOutlet] = useState('All');
  const [activeReport, setActiveReport] = useState(null);
  const [expandedReportItem, setExpandedReportItem] = useState(null);
  const [reportCategoryFilter, setReportCategoryFilter] = useState('All');
  const [reportItemFilter, setReportItemFilter] = useState('');
  const [reportSortBy, setReportSortBy] = useState('quantity'); // 'quantity', 'name', 'cost'
  const [reportSortOrder, setReportSortOrder] = useState('desc'); // 'asc', 'desc'
  const [adminItemSearchId, setAdminItemSearchId] = useState('');
  const [adminItemSearchOutletView, setAdminItemSearchOutletView] = useState('consolidated');

  const { orders, items, users, revenueData, categories, stockOutHistory } = data;
  const outlets = ['Santacruz', 'Bandra', 'Oshiwara'];

  // AI Analysis
  useEffect(() => {
    const alerts = AIAnalytics.compareVendorPrices(items);
    setVendorPriceAlerts(alerts);
  }, [items]);

  // Over-ordering analysis for all outlets
  const overOrderingByOutlet = {};
  outlets.forEach(outlet => {
    overOrderingByOutlet[outlet] = AIAnalytics.analyzeOverOrdering(orders, outlet, items);
  });
  const totalOverOrderingAlerts = Object.values(overOrderingByOutlet).reduce((sum, arr) => sum + arr.length, 0);

  // Dispute tracking
  const getDisputedOrders = (outlet = null, month = null) => {
    const now = new Date();
    const targetMonth = month || (now.getMonth() + 1);
    return orders.filter(o => {
      const d = new Date(o.createdAt);
      const matchesMonth = (d.getMonth() + 1) === targetMonth;
      const matchesOutlet = outlet ? o.outlet === outlet : true;
      return o.status === 'disputed' && matchesMonth && matchesOutlet;
    });
  };

  const disputedOrdersThisMonth = getDisputedOrders();
  const disputesByOutlet = {};
  outlets.forEach(outlet => {
    disputesByOutlet[outlet] = getDisputedOrders(outlet).length;
  });
  const totalDisputes = disputedOrdersThisMonth.length;

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const cat = (categories || []).find(c => c.id === categoryId);
    return cat ? cat.name : 'Uncategorized';
  };
  const months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
    { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
    { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' }
  ];

  const getDateFilteredOrders = () => {
    const now = new Date();
    return orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      if (dateRange === 'today') return orderDate.toDateString() === now.toDateString();
      if (dateRange === 'week') return (now - orderDate) / (1000 * 60 * 60 * 24) <= 7;
      if (dateRange === 'month') return orderDate.getMonth() === now.getMonth();
      return true;
    });
  };

  const filteredOrders = getDateFilteredOrders();
  const totalSpend = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const outletStats = outlets.map(outlet => ({
    name: outlet,
    orders: filteredOrders.filter(o => o.outlet === outlet).length,
    spend: filteredOrders.filter(o => o.outlet === outlet).reduce((sum, o) => sum + o.totalAmount, 0),
  }));

  // Category breakdown
  const categoryBreakdown = {};
  filteredOrders.forEach(order => {
    order.items.forEach(item => {
      const catName = item.categoryName || getCategoryName(item.categoryId) || 'Uncategorized';
      if (!categoryBreakdown[catName]) {
        categoryBreakdown[catName] = { quantity: 0, cost: 0 };
      }
      categoryBreakdown[catName].quantity += item.quantity;
      categoryBreakdown[catName].cost += item.totalCost;
    });
  });

  const handleRevenueUpdate = (outlet, month) => {
    const revenue = parseFloat(newRevenue);
    if (isNaN(revenue) || revenue <= 0) return;
    
    const updatedRevenueData = {
      ...revenueData,
      [outlet]: {
        ...revenueData[outlet],
        [month]: revenue
      }
    };
    onUpdateRevenueData(updatedRevenueData);
    setEditingRevenue(null);
    setNewRevenue('');
  };

  const getBudget = (outlet, month) => {
    return (revenueData?.[outlet]?.[month] || 0) * 0.30;
  };

  const formatLakhs = (amount) => {
    return `₹${(amount / 100000).toFixed(2)}L`;
  };

  return (
    <div className="space-y-6">
      {/* Date Filter */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
        <div className="flex gap-2">
          {[
            { key: 'today', label: 'Today' },
            { key: 'week', label: 'This Week' },
            { key: 'month', label: 'This Month' },
            { key: 'all', label: 'All Time' },
          ].map(range => (
            <button
              key={range.key}
              onClick={() => setDateRange(range.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                dateRange === range.key
                  ? 'bg-amber-500 text-white'
                  : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Orders" 
          value={filteredOrders.length}
          icon="📋"
          color="amber"
          onClick={() => setActiveTab('orders')}
        />
        <div onClick={() => setActiveTab('spendTracker')} className="cursor-pointer">
        <StatCard 
          title="Total Spend" 
          value={formatCurrency(totalSpend)}
          icon="💰"
          color="emerald"
        />
        </div>
        <div onClick={() => { setActiveTab('orders'); }} className="cursor-pointer">
        <StatCard 
          title="Pending" 
          value={filteredOrders.filter(o => o.status === 'pending').length}
          icon="⏳"
          color="blue"
        />
        </div>
        <div onClick={() => setActiveTab('orders')} className="cursor-pointer">
        <StatCard 
          title="Delivered" 
          value={filteredOrders.filter(o => o.status === 'delivered' || o.status === 'completed').length}
          icon="✅"
          color="purple"
        />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-stone-800 pb-2 overflow-x-auto">
        <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
          Overview
        </TabButton>
        <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')}>
          All Orders
        </TabButton>
        <TabButton active={activeTab === 'revenue'} onClick={() => setActiveTab('revenue')}>
          Revenue & Budget
        </TabButton>
        <TabButton active={activeTab === 'spendTracker'} onClick={() => setActiveTab('spendTracker')}>
          Spend Tracker
        </TabButton>
        <TabButton active={activeTab === 'monthlySpending'} onClick={() => setActiveTab('monthlySpending')}>
          Monthly Spending
        </TabButton>
        <TabButton active={activeTab === 'reports'} onClick={() => setActiveTab('reports')}>
          📊 Reports
        </TabButton>
        <TabButton active={activeTab === 'dispatchTime'} onClick={() => setActiveTab('dispatchTime')}>
          🚚 Dispatch Time
        </TabButton>
        <TabButton active={activeTab === 'ai'} onClick={() => setActiveTab('ai')}>
          🤖 AI Insights {(totalOverOrderingAlerts + vendorPriceAlerts.length) > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
              {totalOverOrderingAlerts + vendorPriceAlerts.length}
            </span>
          )}
        </TabButton>
        <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
          Users
        </TabButton>
        <TabButton active={activeTab === 'items'} onClick={() => setActiveTab('items')}>
          Items & Prices
        </TabButton>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* AI Alerts Summary */}
          {showAIAlerts && (totalOverOrderingAlerts > 0 || vendorPriceAlerts.length > 0 || totalDisputes > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {totalOverOrderingAlerts > 0 && (
                <AIAlertCard
                  type="warning"
                  title="Over-Ordering Detected"
                  description={`${totalOverOrderingAlerts} items across outlets are being ordered more than usual this week.`}
                  onAction={() => setActiveTab('ai')}
                  actionLabel="View Details"
                />
              )}
              {vendorPriceAlerts.length > 0 && (
                <AIAlertCard
                  type="price"
                  title="Better Vendor Prices Found"
                  description={`${vendorPriceAlerts.length} items available at lower prices from Mumbai vendors.`}
                  onAction={() => setActiveTab('ai')}
                  actionLabel="View Vendors"
                />
              )}
              {totalDisputes > 0 && (
                <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <h4 className="font-semibold text-red-400 flex items-center gap-2">
                        Disputes This Month
                        <span className="text-xs px-2 py-0.5 bg-red-500/20 rounded-full">{totalDisputes}</span>
                      </h4>
                      <p className="text-sm text-stone-400 mt-1">
                        {outlets.filter(o => disputesByOutlet[o] > 0).map(o => `${o}: ${disputesByOutlet[o]}`).join(' • ')}
                      </p>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="mt-2 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-colors"
                      >
                        View Disputed Orders
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Outlet Performance */}
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Outlet Performance</h3>
            <div className="space-y-4">
              {outletStats.map(outlet => (
                <div key={outlet.name} className="bg-stone-800/30 rounded-xl p-4 cursor-pointer hover:bg-stone-800/50 transition-colors" onClick={() => { setSelectedOutlet(outlet.name); setActiveTab('monthlySpending'); }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{outlet.name}</span>
                      {disputesByOutlet[outlet.name] > 0 && (
                        <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                          {disputesByOutlet[outlet.name]} disputes
                        </span>
                      )}
                    </div>
                    <span className="text-amber-400 font-semibold">{formatCurrency(outlet.spend)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-400">{outlet.orders} orders</span>
                    <div className="w-32 h-2 bg-stone-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                        style={{ width: `${totalSpend ? (outlet.spend / totalSpend) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Category Breakdown</h3>
            <div className="space-y-3">
              {Object.entries(categoryBreakdown).sort((a, b) => b[1].cost - a[1].cost).map(([category, data]) => (
                <div key={category} className="flex items-center justify-between py-2 border-b border-stone-800/30 last:border-0">
                  <div>
                    <span className="text-white">{category}</span>
                    <p className="text-xs text-stone-500">{data.quantity} units ordered</p>
                  </div>
                  <span className="text-amber-400 font-medium">{formatCurrency(data.cost)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-4">
          <ItemSearchAnalytics
            items={items}
            categories={categories}
            orders={orders}
            outlets={outlets}
            searchItemId={adminItemSearchId}
            onSearchItemChange={setAdminItemSearchId}
            outletView={adminItemSearchOutletView}
            onOutletViewChange={setAdminItemSearchOutletView}
          />
          <OrderHistory orders={filteredOrders} showOutlet={true} />
        </div>
      )}

      {activeTab === 'revenue' && (
        <div className="space-y-6">
          {/* Month Selector */}
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-white font-medium">Select Month:</span>
              <div className="flex gap-2 flex-wrap">
                {months.map(month => (
                  <button
                    key={month.value}
                    onClick={() => setSelectedMonth(month.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedMonth === month.value
                        ? 'bg-amber-500 text-white'
                        : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                    }`}
                  >
                    {month.label.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Revenue & Budget Management */}
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-amber-400 mb-2 flex items-center gap-2">
              <span>💰</span> Revenue & Budget Management - {months.find(m => m.value === selectedMonth)?.label}
            </h3>
            <p className="text-sm text-stone-500 mb-6">
              Set monthly revenue for each outlet. Budget is automatically calculated as 30% of revenue.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-stone-500 uppercase border-b border-stone-800">
                    <th className="pb-3">Outlet</th>
                    <th className="pb-3 text-right">Monthly Revenue</th>
                    <th className="pb-3 text-right">Purchase Budget (30%)</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {outlets.map(outlet => {
                    const revenue = revenueData?.[outlet]?.[selectedMonth] || 0;
                    const budget = revenue * 0.30;
                    const editKey = `${outlet}-${selectedMonth}`;

                    return (
                      <tr key={outlet} className="border-b border-stone-800/30">
                        <td className="py-4">
                          <p className="text-white font-medium">{outlet}</p>
                          <p className="text-xs text-stone-500">
                            Avg: {outlet === 'Santacruz' ? '₹60L' : outlet === 'Bandra' ? '₹28L' : '₹45L'}/month
                          </p>
                        </td>
                        <td className="py-4 text-right">
                          {editingRevenue === editKey ? (
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-stone-500">₹</span>
                              <input
                                type="number"
                                value={newRevenue}
                                onChange={(e) => setNewRevenue(e.target.value)}
                                className="w-32 px-3 py-1.5 bg-stone-700 border border-stone-600 rounded-lg text-white text-right"
                                placeholder="Amount"
                                autoFocus
                              />
                            </div>
                          ) : (
                            <div>
                              <p className="text-xl font-bold text-emerald-400">{formatLakhs(revenue)}</p>
                              <p className="text-xs text-stone-500">{formatCurrency(revenue)}</p>
                            </div>
                          )}
                        </td>
                        <td className="py-4 text-right">
                          <div>
                            <p className="text-xl font-bold text-amber-400">{formatLakhs(budget)}</p>
                            <p className="text-xs text-stone-500">{formatCurrency(budget)}</p>
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          {editingRevenue === editKey ? (
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleRevenueUpdate(outlet, selectedMonth)}
                                className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 text-sm rounded-lg hover:bg-emerald-500/30"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => { setEditingRevenue(null); setNewRevenue(''); }}
                                className="px-3 py-1.5 bg-stone-700 text-stone-400 text-sm rounded-lg hover:bg-stone-600"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => { setEditingRevenue(editKey); setNewRevenue(revenue.toString()); }}
                              className="px-4 py-1.5 bg-amber-500/20 text-amber-400 text-sm rounded-lg hover:bg-amber-500/30"
                            >
                              Edit Revenue
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-stone-700">
                    <td className="py-4 font-semibold text-white">Total</td>
                    <td className="py-4 text-right">
                      <p className="text-xl font-bold text-emerald-400">
                        {formatLakhs(outlets.reduce((s, o) => s + (revenueData?.[o]?.[selectedMonth] || 0), 0))}
                      </p>
                    </td>
                    <td className="py-4 text-right">
                      <p className="text-xl font-bold text-amber-400">
                        {formatLakhs(outlets.reduce((s, o) => s + ((revenueData?.[o]?.[selectedMonth] || 0) * 0.30), 0))}
                      </p>
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Annual Overview */}
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>📊</span> Annual Revenue & Budget Overview
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-stone-500 uppercase border-b border-stone-800">
                    <th className="pb-3 text-left">Outlet</th>
                    {months.map(m => (
                      <th key={m.value} className="pb-3 text-right px-2">{m.label.slice(0, 3)}</th>
                    ))}
                    <th className="pb-3 text-right px-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {outlets.map(outlet => (
                    <tr key={outlet} className="border-b border-stone-800/30">
                      <td className="py-3 text-white font-medium">{outlet}</td>
                      {months.map(m => {
                        const rev = revenueData?.[outlet]?.[m.value] || 0;
                        return (
                          <td key={m.value} className="py-3 text-right px-2 text-stone-400">
                            {(rev / 100000).toFixed(1)}L
                          </td>
                        );
                      })}
                      <td className="py-3 text-right px-2 text-emerald-400 font-semibold">
                        {formatLakhs(months.reduce((s, m) => s + (revenueData?.[outlet]?.[m.value] || 0), 0))}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-stone-700">
                    <td className="py-3 font-semibold text-white">Budget (30%)</td>
                    {months.map(m => {
                      const totalRev = outlets.reduce((s, o) => s + (revenueData?.[o]?.[m.value] || 0), 0);
                      return (
                        <td key={m.value} className="py-3 text-right px-2 text-amber-400 font-medium">
                          {((totalRev * 0.30) / 100000).toFixed(1)}L
                        </td>
                      );
                    })}
                    <td className="py-3 text-right px-2 text-amber-400 font-bold">
                      {formatLakhs(months.reduce((s, m) => s + outlets.reduce((os, o) => os + ((revenueData?.[o]?.[m.value] || 0) * 0.30), 0), 0))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SPEND TRACKER TAB */}
      {activeTab === 'spendTracker' && (
        <div className="space-y-6">
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <span>💰</span> Outlet-Wise Spend Tracker
            </h3>
            <p className="text-sm text-stone-500 mb-6">Daily and monthly spend compared to budget caps</p>

            <div className="space-y-6">
              {outlets.map(outlet => {
                const monthBudget = getBudget(outlet, selectedMonth);
                const dailyBudget = monthBudget / 30; // Daily allocation
                
                // Today's orders for this outlet
                const todayOrders = orders.filter(o => 
                  o.outlet === outlet && 
                  new Date(o.createdAt).toDateString() === new Date().toDateString()
                );
                const todaySpend = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
                
                // This month's orders for this outlet
                const monthOrders = orders.filter(o => {
                  const d = new Date(o.createdAt);
                  return o.outlet === outlet && 
                    (d.getMonth() + 1) === selectedMonth && 
                    d.getFullYear() === new Date().getFullYear();
                });
                const monthSpend = monthOrders.reduce((sum, o) => sum + o.totalAmount, 0);
                
                const dailyUtilization = dailyBudget > 0 ? (todaySpend / dailyBudget) * 100 : 0;
                const monthlyUtilization = monthBudget > 0 ? (monthSpend / monthBudget) * 100 : 0;
                
                const isDailyExceeded = dailyUtilization > 100;
                const isMonthlyExceeded = monthlyUtilization > 100;
                const isWarning = monthlyUtilization > 80 && !isMonthlyExceeded;

                return (
                  <div 
                    key={outlet} 
                    className={`rounded-2xl p-6 border transition-all ${
                      isMonthlyExceeded 
                        ? 'bg-red-500/10 border-red-500/30' 
                        : isWarning 
                          ? 'bg-yellow-500/10 border-yellow-500/30'
                          : 'bg-stone-800/30 border-stone-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-semibold text-white">{outlet}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isMonthlyExceeded 
                          ? 'bg-red-500 text-white' 
                          : isWarning
                            ? 'bg-yellow-500 text-white'
                            : 'bg-blue-500 text-white'
                      }`}>
                        {isMonthlyExceeded ? 'Over Budget' : isWarning ? 'Near Limit' : 'Within Budget'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Daily Spend */}
                      <div>
                        <p className="text-sm text-stone-400 mb-1">Daily Spend</p>
                        <p className={`text-2xl font-bold ${isDailyExceeded ? 'text-red-400' : 'text-white'}`}>
                          {formatCurrency(todaySpend)}
                        </p>
                        <p className="text-xs text-stone-500">Limit: {formatCurrency(dailyBudget)}</p>
                        {isDailyExceeded && (
                          <p className="text-xs text-red-400 mt-1">⚠️ Exceeded by {formatCurrency(todaySpend - dailyBudget)}</p>
                        )}
                      </div>

                      {/* Monthly Spend */}
                      <div>
                        <p className="text-sm text-stone-400 mb-1">Monthly Spend</p>
                        <p className={`text-2xl font-bold ${isMonthlyExceeded ? 'text-red-400' : 'text-white'}`}>
                          {formatCurrency(monthSpend)}
                        </p>
                        <p className="text-xs text-stone-500">
                          Avg per day: {formatCurrency(monthOrders.length > 0 ? monthSpend / new Date().getDate() : 0)}
                        </p>
                        {isMonthlyExceeded && (
                          <p className="text-xs text-red-400 mt-1">⚠️ Exceeded by {formatCurrency(monthSpend - monthBudget)}</p>
                        )}
                      </div>

                      {/* Budget Utilization */}
                      <div>
                        <p className="text-sm text-stone-400 mb-1">Budget Utilization</p>
                        <p className={`text-2xl font-bold ${
                          isMonthlyExceeded ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-white'
                        }`}>
                          {monthlyUtilization.toFixed(1)}%
                        </p>
                        <div className="mt-2 h-3 bg-stone-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              isMonthlyExceeded 
                                ? 'bg-gradient-to-r from-red-500 to-red-600' 
                                : isWarning
                                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500'
                                  : 'bg-gradient-to-r from-emerald-500 to-green-500'
                            }`}
                            style={{ width: `${Math.min(monthlyUtilization, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-stone-500 mt-1">Budget: {formatCurrency(monthBudget)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Month Selector */}
            <div className="mt-6 pt-6 border-t border-stone-800">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-stone-400">Select Month:</span>
                {months.map(month => (
                  <button
                    key={month.value}
                    onClick={() => setSelectedMonth(month.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedMonth === month.value
                        ? 'bg-amber-500 text-white'
                        : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                    }`}
                  >
                    {month.label.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MONTHLY SPENDING TAB */}
      {activeTab === 'monthlySpending' && (
        <div className="space-y-6">
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <span>📅</span> Monthly Spending Analysis
            </h3>
            <p className="text-sm text-stone-500 mb-6">Search and compare month-on-month spend for any outlet</p>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div>
                <label className="block text-xs text-stone-500 mb-1">Select Outlet</label>
                <select
                  value={selectedOutlet || 'all'}
                  onChange={(e) => setSelectedOutlet(e.target.value === 'all' ? null : e.target.value)}
                  className="px-4 py-2 bg-stone-800 border border-stone-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  <option value="all">All Outlets</option>
                  {outlets.map(outlet => (
                    <option key={outlet} value={outlet}>{outlet}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Monthly Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-stone-500 uppercase border-b border-stone-800">
                    <th className="pb-3">Month</th>
                    {(!selectedOutlet || selectedOutlet === 'all' ? outlets : [selectedOutlet]).map(outlet => (
                      <th key={outlet} className="pb-3 text-right">{outlet}</th>
                    ))}
                    <th className="pb-3 text-right">Total</th>
                    <th className="pb-3 text-right">Budget</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {months.map(month => {
                    const activeOutlets = !selectedOutlet || selectedOutlet === 'all' ? outlets : [selectedOutlet];
                    const monthlyData = {};
                    let totalSpend = 0;
                    let totalBudget = 0;

                    activeOutlets.forEach(outlet => {
                      const outletOrders = orders.filter(o => {
                        const d = new Date(o.createdAt);
                        return o.outlet === outlet && 
                          (d.getMonth() + 1) === month.value && 
                          d.getFullYear() === new Date().getFullYear();
                      });
                      const spend = outletOrders.reduce((sum, o) => sum + o.totalAmount, 0);
                      monthlyData[outlet] = spend;
                      totalSpend += spend;
                      totalBudget += getBudget(outlet, month.value);
                    });

                    const utilization = totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0;
                    const isExceeded = utilization > 100;
                    const isWarning = utilization > 80 && !isExceeded;

                    return (
                      <tr key={month.value} className="border-b border-stone-800/30 hover:bg-stone-800/20">
                        <td className="py-4 text-white font-medium">{month.label}</td>
                        {activeOutlets.map(outlet => (
                          <td key={outlet} className="py-4 text-right text-stone-300">
                            {formatCurrency(monthlyData[outlet])}
                          </td>
                        ))}
                        <td className="py-4 text-right font-semibold text-amber-400">
                          {formatCurrency(totalSpend)}
                        </td>
                        <td className="py-4 text-right text-stone-400">
                          {formatCurrency(totalBudget)}
                        </td>
                        <td className="py-4 text-right">
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            isExceeded 
                              ? 'bg-red-500/20 text-red-400' 
                              : isWarning
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {utilization.toFixed(0)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-stone-700">
                    <td className="py-4 font-semibold text-white">Year Total</td>
                    {(!selectedOutlet || selectedOutlet === 'all' ? outlets : [selectedOutlet]).map(outlet => {
                      const yearSpend = months.reduce((sum, month) => {
                        const outletOrders = orders.filter(o => {
                          const d = new Date(o.createdAt);
                          return o.outlet === outlet && 
                            (d.getMonth() + 1) === month.value && 
                            d.getFullYear() === new Date().getFullYear();
                        });
                        return sum + outletOrders.reduce((s, o) => s + o.totalAmount, 0);
                      }, 0);
                      return (
                        <td key={outlet} className="py-4 text-right font-semibold text-white">
                          {formatCurrency(yearSpend)}
                        </td>
                      );
                    })}
                    <td className="py-4 text-right font-bold text-amber-400 text-lg">
                      {formatCurrency(
                        months.reduce((sum, month) => {
                          return sum + ((!selectedOutlet || selectedOutlet === 'all' ? outlets : [selectedOutlet]).reduce((os, outlet) => {
                            const outletOrders = orders.filter(o => {
                              const d = new Date(o.createdAt);
                              return o.outlet === outlet && 
                                (d.getMonth() + 1) === month.value && 
                                d.getFullYear() === new Date().getFullYear();
                            });
                            return os + outletOrders.reduce((s, o) => s + o.totalAmount, 0);
                          }, 0));
                        }, 0)
                      )}
                    </td>
                    <td className="py-4 text-right text-stone-400">
                      {formatCurrency(
                        months.reduce((sum, month) => {
                          return sum + ((!selectedOutlet || selectedOutlet === 'all' ? outlets : [selectedOutlet]).reduce((os, outlet) => {
                            return os + getBudget(outlet, month.value);
                          }, 0));
                        }, 0)
                      )}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Visual Chart */}
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Monthly Spending Trend</h3>
            <div className="space-y-3">
              {months.map(month => {
                const activeOutlets = !selectedOutlet || selectedOutlet === 'all' ? outlets : [selectedOutlet];
                let totalSpend = 0;
                let totalBudget = 0;

                activeOutlets.forEach(outlet => {
                  const outletOrders = orders.filter(o => {
                    const d = new Date(o.createdAt);
                    return o.outlet === outlet && 
                      (d.getMonth() + 1) === month.value && 
                      d.getFullYear() === new Date().getFullYear();
                  });
                  totalSpend += outletOrders.reduce((sum, o) => sum + o.totalAmount, 0);
                  totalBudget += getBudget(outlet, month.value);
                });

                const percentage = totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0;
                const isExceeded = percentage > 100;

                return (
                  <div key={month.value} className="flex items-center gap-4">
                    <span className="text-stone-400 w-12 text-sm">{month.label.slice(0, 3)}</span>
                    <div className="flex-1 h-8 bg-stone-800 rounded-lg overflow-hidden relative">
                      <div 
                        className={`h-full rounded-lg transition-all duration-500 ${
                          isExceeded 
                            ? 'bg-gradient-to-r from-red-500 to-red-600' 
                            : 'bg-gradient-to-r from-amber-500 to-orange-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white font-medium">
                        {formatCurrency(totalSpend)}
                      </span>
                    </div>
                    <span className={`text-sm font-medium w-16 text-right ${
                      isExceeded ? 'text-red-400' : 'text-stone-400'
                    }`}>
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* DISPATCH TIME TAB */}
      {activeTab === 'dispatchTime' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🚚</span>
              <div>
                <h2 className="text-xl font-bold text-white">Dispatch Time Analytics</h2>
                <p className="text-sm text-stone-400">Track delivery times from Central Kitchen to each outlet</p>
              </div>
            </div>
          </div>

          {(() => {
            // Get all delivered/completed/disputed orders with both timestamps
            const deliveredOrders = orders.filter(o => 
              o.dispatchedAt && o.acceptedAt && (o.status === 'delivered' || o.status === 'completed' || o.status === 'disputed')
            );

            // Calculate dispatch times per outlet
            const outletStats = {};
            outlets.forEach(outlet => {
              const outletOrders = deliveredOrders.filter(o => o.outlet === outlet);
              const times = outletOrders.map(o => {
                const dispatchTime = Math.round((new Date(o.acceptedAt) - new Date(o.dispatchedAt)) / 60000);
                const processingTime = Math.round((new Date(o.dispatchedAt) - new Date(o.createdAt)) / 60000);
                const totalTime = Math.round((new Date(o.acceptedAt) - new Date(o.createdAt)) / 60000);
                return { 
                  orderId: o.id, 
                  dispatchTime, 
                  processingTime,
                  totalTime,
                  createdAt: o.createdAt,
                  dispatchedAt: o.dispatchedAt,
                  acceptedAt: o.acceptedAt,
                  dispatchedBy: o.dispatchedBy,
                  acceptedBy: o.acceptedBy
                };
              });

              const avgDispatch = times.length > 0 ? Math.round(times.reduce((s, t) => s + t.dispatchTime, 0) / times.length) : 0;
              const avgProcessing = times.length > 0 ? Math.round(times.reduce((s, t) => s + t.processingTime, 0) / times.length) : 0;
              const avgTotal = times.length > 0 ? Math.round(times.reduce((s, t) => s + t.totalTime, 0) / times.length) : 0;
              const fastest = times.length > 0 ? Math.min(...times.map(t => t.dispatchTime)) : 0;
              const slowest = times.length > 0 ? Math.max(...times.map(t => t.dispatchTime)) : 0;

              outletStats[outlet] = { times, avgDispatch, avgProcessing, avgTotal, fastest, slowest, count: times.length };
            });

            const formatMins = (mins) => {
              if (mins < 60) return `${mins} min`;
              const hrs = Math.floor(mins / 60);
              const rem = mins % 60;
              return `${hrs}h ${rem}m`;
            };

            return (
              <>
                {/* Summary Cards per Outlet */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {outlets.map(outlet => {
                    const stats = outletStats[outlet];
                    const isGood = stats.avgDispatch > 0 && stats.avgDispatch <= 30;
                    const isWarning = stats.avgDispatch > 30 && stats.avgDispatch <= 60;
                    return (
                      <div key={outlet} className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white">{outlet}</h3>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            stats.count === 0 ? 'bg-stone-700 text-stone-400' :
                            isGood ? 'bg-emerald-500/20 text-emerald-400' :
                            isWarning ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {stats.count === 0 ? 'No data' : isGood ? 'Fast' : isWarning ? 'Average' : 'Slow'}
                          </span>
                        </div>
                        
                        {stats.count > 0 ? (
                          <>
                            <div className="text-center mb-4">
                              <p className={`text-4xl font-bold ${
                                isGood ? 'text-emerald-400' : isWarning ? 'text-yellow-400' : 'text-red-400'
                              }`}>
                                {formatMins(stats.avgDispatch)}
                              </p>
                              <p className="text-sm text-stone-500 mt-1">Avg Delivery Time</p>
                            </div>
                            
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between py-2 border-t border-stone-800/50">
                                <span className="text-stone-400">Avg Processing (CK)</span>
                                <span className="text-blue-400 font-medium">{formatMins(stats.avgProcessing)}</span>
                              </div>
                              <div className="flex justify-between py-2 border-t border-stone-800/50">
                                <span className="text-stone-400">Avg Total (Order → Delivery)</span>
                                <span className="text-amber-400 font-medium">{formatMins(stats.avgTotal)}</span>
                              </div>
                              <div className="flex justify-between py-2 border-t border-stone-800/50">
                                <span className="text-stone-400">Fastest Delivery</span>
                                <span className="text-emerald-400">{formatMins(stats.fastest)}</span>
                              </div>
                              <div className="flex justify-between py-2 border-t border-stone-800/50">
                                <span className="text-stone-400">Slowest Delivery</span>
                                <span className="text-red-400">{formatMins(stats.slowest)}</span>
                              </div>
                              <div className="flex justify-between py-2 border-t border-stone-800/50">
                                <span className="text-stone-400">Orders Tracked</span>
                                <span className="text-white font-medium">{stats.count}</span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-8">
                            <span className="text-3xl mb-2 block">📭</span>
                            <p className="text-stone-500 text-sm">No delivered orders yet</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Detailed History per Outlet */}
                {outlets.map(outlet => {
                  const stats = outletStats[outlet];
                  if (stats.count === 0) return null;
                  return (
                    <div key={outlet} className="bg-stone-900/50 border border-stone-800/50 rounded-2xl overflow-hidden">
                      <div className="p-4 bg-stone-800/30 border-b border-stone-800/50">
                        <h3 className="text-white font-semibold flex items-center gap-2">
                          <span>🏪</span> {outlet} — Dispatch History
                          <span className="text-xs text-stone-500 font-normal ml-2">Last {Math.min(stats.count, 20)} orders</span>
                        </h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left text-xs text-stone-500 uppercase bg-stone-800/20">
                              <th className="px-4 py-3">Order</th>
                              <th className="px-4 py-3">Ordered At</th>
                              <th className="px-4 py-3">Dispatched At</th>
                              <th className="px-4 py-3">Delivered At</th>
                              <th className="px-4 py-3 text-right">Processing</th>
                              <th className="px-4 py-3 text-right">Delivery</th>
                              <th className="px-4 py-3 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stats.times.slice(-20).reverse().map((t, idx) => (
                              <tr key={idx} className="border-t border-stone-800/30 hover:bg-stone-800/20">
                                <td className="px-4 py-3 text-white font-medium">{t.orderId}</td>
                                <td className="px-4 py-3 text-stone-400 text-sm">{formatDate(t.createdAt)}</td>
                                <td className="px-4 py-3 text-blue-400 text-sm">{formatDate(t.dispatchedAt)}</td>
                                <td className="px-4 py-3 text-emerald-400 text-sm">{formatDate(t.acceptedAt)}</td>
                                <td className="px-4 py-3 text-right">
                                  <span className="text-blue-400 text-sm">{formatMins(t.processingTime)}</span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <span className={`text-sm font-medium ${
                                    t.dispatchTime <= 30 ? 'text-emerald-400' :
                                    t.dispatchTime <= 60 ? 'text-yellow-400' : 'text-red-400'
                                  }`}>{formatMins(t.dispatchTime)}</span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <span className="text-amber-400 text-sm">{formatMins(t.totalTime)}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </>
            );
          })()}
        </div>
      )}

      {/* AI INSIGHTS TAB */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          {/* AI Header */}
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🤖</span>
              <div>
                <h2 className="text-xl font-bold text-white">AI-Powered Admin Insights</h2>
                <p className="text-sm text-stone-400">Cross-outlet analytics and vendor optimization recommendations</p>
              </div>
            </div>
          </div>

          {/* Over-Ordering Analysis */}
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-orange-400 mb-2 flex items-center gap-2">
              <span>⚠️</span> Over-Ordering Detection (All Outlets)
              {totalOverOrderingAlerts > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                  {totalOverOrderingAlerts} alerts
                </span>
              )}
            </h3>
            <p className="text-sm text-stone-500 mb-4">Items being ordered 30% or more than last week</p>

            {totalOverOrderingAlerts === 0 ? (
              <div className="text-center py-8 text-stone-500">
                <span className="text-4xl mb-2 block">✅</span>
                <p>No over-ordering detected across any outlets this week</p>
              </div>
            ) : (
              <div className="space-y-4">
                {outlets.map(outlet => {
                  const alerts = overOrderingByOutlet[outlet];
                  if (alerts.length === 0) return null;
                  
                  return (
                    <div key={outlet} className="bg-stone-800/30 rounded-xl p-4">
                      <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-stone-700 text-stone-300 text-xs rounded-lg">{outlet}</span>
                        <span className="text-orange-400 text-sm">{alerts.length} items flagged</span>
                      </h4>
                      <div className="space-y-2">
                        {alerts.map((alert, idx) => (
                          <div key={idx} className="flex items-center justify-between py-2 border-b border-stone-700/50 last:border-0">
                            <div>
                              <p className="text-white">{alert.item.name}</p>
                              <p className="text-xs text-stone-500">
                                Last week: {alert.lastWeek} {alert.item.unit} → This week: {alert.thisWeek} {alert.item.unit}
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded-lg font-medium">
                              +{alert.increase}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Vendor Price Comparison */}
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-purple-400 mb-2 flex items-center gap-2">
              <span>💰</span> Vendor Price Comparison
              {vendorPriceAlerts.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                  {vendorPriceAlerts.length} opportunities
                </span>
              )}
            </h3>
            <p className="text-sm text-stone-500 mb-4">AI-scanned Mumbai vendors for better prices</p>

            {vendorPriceAlerts.length === 0 ? (
              <div className="text-center py-8 text-stone-500">
                <span className="text-4xl mb-2 block">✅</span>
                <p>All items are at competitive prices</p>
              </div>
            ) : (
              <div className="space-y-3">
                {vendorPriceAlerts.map((alert, idx) => (
                  <div key={idx} className="bg-stone-800/30 rounded-xl p-4 hover:bg-stone-800/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{alert.item.name}</h4>
                        <p className="text-sm text-stone-500 mt-1">{alert.vendor.name}</p>
                        <p className="text-xs text-stone-600">{alert.vendor.location} • ⭐ {alert.vendor.rating}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-stone-400 line-through text-sm">{formatCurrency(alert.currentPrice)}/{alert.item.unit}</p>
                        <p className="text-emerald-400 font-bold text-lg">{formatCurrency(alert.vendorPrice)}/{alert.item.unit}</p>
                        <p className="text-xs text-emerald-400 mt-1">Save {alert.savingsPercent}%</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Total Potential Savings */}
                <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-400 font-medium">Total Potential Savings</p>
                      <p className="text-xs text-stone-500">Per unit if all recommended vendors are used</p>
                    </div>
                    <p className="text-2xl font-bold text-emerald-400">
                      {formatCurrency(vendorPriceAlerts.reduce((sum, a) => sum + a.savings, 0))}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Budget Status Summary */}
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
              <span>📊</span> Budget Status Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {outlets.map(outlet => {
                const monthBudget = getBudget(outlet, new Date().getMonth() + 1);
                const monthOrders = orders.filter(o => {
                  const d = new Date(o.createdAt);
                  return o.outlet === outlet && 
                    (d.getMonth() + 1) === (new Date().getMonth() + 1) && 
                    d.getFullYear() === new Date().getFullYear();
                });
                const monthSpend = monthOrders.reduce((sum, o) => sum + o.totalAmount, 0);
                const utilization = monthBudget > 0 ? (monthSpend / monthBudget) * 100 : 0;
                const isExceeded = utilization > 100;
                const isWarning = utilization > 80 && !isExceeded;

                return (
                  <div 
                    key={outlet} 
                    className={`rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02] ${
                      isExceeded 
                        ? 'bg-red-500/10 border border-red-500/30' 
                        : isWarning
                          ? 'bg-yellow-500/10 border border-yellow-500/30'
                          : 'bg-emerald-500/10 border border-emerald-500/30'
                    }`}
                    onClick={() => { setSelectedOutlet(outlet); setActiveTab('spendTracker'); }}
                  >
                    <h4 className="text-white font-medium mb-2">{outlet}</h4>
                    <p className={`text-2xl font-bold ${
                      isExceeded ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-emerald-400'
                    }`}>
                      {utilization.toFixed(0)}%
                    </p>
                    <p className="text-xs text-stone-500">
                      {formatCurrency(monthSpend)} / {formatCurrency(monthBudget)}
                    </p>
                    <div className="mt-2 h-2 bg-stone-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          isExceeded ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(utilization, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* REPORTS TAB */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Reports Header */}
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">📊</span>
                <div>
                  <h2 className="text-xl font-bold text-white">AI-Powered Reports</h2>
                  <p className="text-sm text-stone-400">Intelligent analysis of stock, purchases, and pricing trends</p>
                </div>
              </div>
              
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={reportMonth}
                  onChange={(e) => setReportMonth(parseInt(e.target.value))}
                  className="px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg text-white text-sm"
                >
                  {[
                    { value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
                    { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
                    { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
                    { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' }
                  ].map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
                <select
                  value={reportOutlet}
                  onChange={(e) => setReportOutlet(e.target.value)}
                  className="px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg text-white text-sm"
                >
                  <option value="All">All Outlets</option>
                  {outlets.map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Report Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Stock Consumed Report Card */}
            <div 
              onClick={() => setActiveReport(activeReport === 'stockConsumed' ? null : 'stockConsumed')}
              className={`bg-stone-900/50 border rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.02] ${
                activeReport === 'stockConsumed' ? 'border-red-500/50 ring-2 ring-red-500/20' : 'border-stone-800/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <span className="text-2xl">📤</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Stock Consumed</h3>
                  <p className="text-xs text-stone-500">Daily stock out entries</p>
                </div>
              </div>
              <p className="text-sm text-stone-400">Track what outlets actually used from their stock via daily stock out submissions.</p>
            </div>

            {/* Stock Ordered Report Card */}
            <div 
              onClick={() => setActiveReport(activeReport === 'stockOrdered' ? null : 'stockOrdered')}
              className={`bg-stone-900/50 border rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.02] ${
                activeReport === 'stockOrdered' ? 'border-emerald-500/50 ring-2 ring-emerald-500/20' : 'border-stone-800/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <span className="text-2xl">🛒</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Stock Ordered</h3>
                  <p className="text-xs text-stone-500">Purchase orders placed</p>
                </div>
              </div>
              <p className="text-sm text-stone-400">Analysis of items ordered by outlets including quantities, costs, and trends.</p>
            </div>

            {/* Price History Report Card */}
            <div 
              onClick={() => setActiveReport(activeReport === 'priceHistory' ? null : 'priceHistory')}
              className={`bg-stone-900/50 border rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.02] ${
                activeReport === 'priceHistory' ? 'border-orange-500/50 ring-2 ring-orange-500/20' : 'border-stone-800/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Price Changes</h3>
                  <p className="text-xs text-stone-500">Price fluctuations</p>
                </div>
              </div>
              <p className="text-sm text-stone-400">Track price changes, identify items with major fluctuations.</p>
            </div>

            {/* Dispute Report Card */}
            <div 
              onClick={() => setActiveReport(activeReport === 'disputes' ? null : 'disputes')}
              className={`bg-stone-900/50 border rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.02] ${
                activeReport === 'disputes' ? 'border-yellow-500/50 ring-2 ring-yellow-500/20' : 'border-stone-800/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Disputes</h3>
                  <p className="text-xs text-stone-500">Order discrepancies</p>
                </div>
              </div>
              <p className="text-sm text-stone-400">Detailed analysis of disputed orders, reasons, and patterns.</p>
            </div>

            {/* Category Spending Report Card */}
            <div 
              onClick={() => setActiveReport(activeReport === 'categorySpending' ? null : 'categorySpending')}
              className={`bg-stone-900/50 border rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.02] ${
                activeReport === 'categorySpending' ? 'border-cyan-500/50 ring-2 ring-cyan-500/20' : 'border-stone-800/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Category Analysis</h3>
                  <p className="text-xs text-stone-500">Spending by category</p>
                </div>
              </div>
              <p className="text-sm text-stone-400">Breakdown of spending across different product categories.</p>
            </div>

            {/* Outlet Comparison Report Card */}
            <div 
              onClick={() => setActiveReport(activeReport === 'outletComparison' ? null : 'outletComparison')}
              className={`bg-stone-900/50 border rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.02] ${
                activeReport === 'outletComparison' ? 'border-purple-500/50 ring-2 ring-purple-500/20' : 'border-stone-800/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <span className="text-2xl">🏪</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Outlet Comparison</h3>
                  <p className="text-xs text-stone-500">Performance metrics</p>
                </div>
              </div>
              <p className="text-sm text-stone-400">Compare ordering patterns, costs, and efficiency across outlets.</p>
            </div>
          </div>

          {/* DETAILED REPORT VIEW */}
          {activeReport && (
            <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl overflow-hidden animate-slide-up">
              {/* Stock Consumed Report Detail */}
              {activeReport === 'stockConsumed' && (
                <>
                  <div className="p-4 bg-red-500/10 border-b border-stone-800/50">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-red-400 flex items-center gap-2">
                          <span>📤</span> Stock Consumed Report
                        </h3>
                        <p className="text-sm text-stone-400 mt-1">Detailed item-level consumption from daily stock out entries</p>
                      </div>
                      <button onClick={() => setActiveReport(null)} className="text-stone-400 hover:text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Filters Row */}
                    <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-stone-700/50">
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-stone-500">Month:</label>
                        <select
                          value={reportMonth}
                          onChange={(e) => setReportMonth(parseInt(e.target.value))}
                          className="px-2 py-1 bg-stone-800 border border-stone-700 rounded-lg text-white text-sm"
                        >
                          {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                            <option key={m} value={m}>{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m-1]}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-stone-500">Outlet:</label>
                        <select
                          value={reportOutlet}
                          onChange={(e) => setReportOutlet(e.target.value)}
                          className="px-2 py-1 bg-stone-800 border border-stone-700 rounded-lg text-white text-sm"
                        >
                          <option value="All">All Outlets</option>
                          {outlets.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-stone-500">Category:</label>
                        <select
                          value={reportCategoryFilter}
                          onChange={(e) => setReportCategoryFilter(e.target.value)}
                          className="px-2 py-1 bg-stone-800 border border-stone-700 rounded-lg text-white text-sm"
                        >
                          <option value="All">All Categories</option>
                          {(categories || []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-stone-500">Search:</label>
                        <input
                          type="text"
                          value={reportItemFilter}
                          onChange={(e) => setReportItemFilter(e.target.value)}
                          placeholder="Search item..."
                          className="px-2 py-1 bg-stone-800 border border-stone-700 rounded-lg text-white text-sm w-32"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-stone-500">Sort:</label>
                        <select
                          value={reportSortBy}
                          onChange={(e) => setReportSortBy(e.target.value)}
                          className="px-2 py-1 bg-stone-800 border border-stone-700 rounded-lg text-white text-sm"
                        >
                          <option value="quantity">Quantity Used</option>
                          <option value="name">Item Name</option>
                          <option value="cost">Estimated Cost</option>
                        </select>
                        <button
                          onClick={() => setReportSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                          className="px-2 py-1 bg-stone-800 border border-stone-700 rounded-lg text-white text-sm"
                        >
                          {reportSortOrder === 'asc' ? '↑' : '↓'}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {(() => {
                      // Aggregate all stock out data from all outlets
                      const allStockOutEntries = [];
                      const activeOutlets = reportOutlet === 'All' ? outlets : [reportOutlet];
                      
                      activeOutlets.forEach(outlet => {
                        const outletHistory = stockOutHistory?.[outlet] || [];
                        outletHistory.forEach(entry => {
                          const entryDate = new Date(entry.submittedAt);
                          if ((entryDate.getMonth() + 1) === reportMonth) {
                            allStockOutEntries.push({ ...entry, outlet });
                          }
                        });
                      });

                      // Aggregate by item
                      const itemConsumption = {};
                      const dailyData = {};
                      const outletBreakdown = {};
                      
                      allStockOutEntries.forEach(entry => {
                        const dateKey = entry.effectiveDate;
                        if (!dailyData[dateKey]) dailyData[dateKey] = { entries: 0, totalUsed: 0 };
                        dailyData[dateKey].entries += 1;
                        
                        if (!outletBreakdown[entry.outlet]) {
                          outletBreakdown[entry.outlet] = { entries: 0, totalUsed: 0, items: {} };
                        }
                        outletBreakdown[entry.outlet].entries += 1;
                        
                        (entry.items || []).forEach(item => {
                          if (item.used > 0) {
                            const itemData = items.find(i => i.id === item.id);
                            const categoryId = item.categoryId || itemData?.categoryId;
                            const categoryName = getCategoryName(categoryId);
                            
                            // Apply filters
                            if (reportCategoryFilter !== 'All' && categoryId !== reportCategoryFilter) return;
                            if (reportItemFilter && !item.name.toLowerCase().includes(reportItemFilter.toLowerCase())) return;
                            
                            const key = item.id || item.name;
                            if (!itemConsumption[key]) {
                              itemConsumption[key] = {
                                id: item.id,
                                name: item.name,
                                unit: item.unit,
                                categoryId,
                                categoryName,
                                totalUsed: 0,
                                estimatedCost: 0,
                                entries: [],
                                byOutlet: {},
                                byDate: {}
                              };
                            }
                            
                            const itemPrice = itemData?.price || 0;
                            itemConsumption[key].totalUsed += item.used;
                            itemConsumption[key].estimatedCost += item.used * itemPrice;
                            itemConsumption[key].entries.push({
                              date: entry.effectiveDate,
                              outlet: entry.outlet,
                              used: item.used,
                              before: item.before,
                              remaining: item.remaining,
                              submittedBy: entry.submittedBy,
                              submittedAt: entry.submittedAt
                            });
                            
                            if (!itemConsumption[key].byOutlet[entry.outlet]) {
                              itemConsumption[key].byOutlet[entry.outlet] = 0;
                            }
                            itemConsumption[key].byOutlet[entry.outlet] += item.used;
                            
                            if (!itemConsumption[key].byDate[entry.effectiveDate]) {
                              itemConsumption[key].byDate[entry.effectiveDate] = 0;
                            }
                            itemConsumption[key].byDate[entry.effectiveDate] += item.used;
                            
                            dailyData[dateKey].totalUsed += item.used;
                            outletBreakdown[entry.outlet].totalUsed += item.used;
                            
                            if (!outletBreakdown[entry.outlet].items[key]) {
                              outletBreakdown[entry.outlet].items[key] = { name: item.name, used: 0 };
                            }
                            outletBreakdown[entry.outlet].items[key].used += item.used;
                          }
                        });
                      });

                      // Sort items
                      let sortedItems = Object.values(itemConsumption);
                      sortedItems.sort((a, b) => {
                        let comparison = 0;
                        if (reportSortBy === 'quantity') comparison = b.totalUsed - a.totalUsed;
                        else if (reportSortBy === 'name') comparison = a.name.localeCompare(b.name);
                        else if (reportSortBy === 'cost') comparison = b.estimatedCost - a.estimatedCost;
                        return reportSortOrder === 'asc' ? -comparison : comparison;
                      });

                      const totalItemsUsed = sortedItems.reduce((s, i) => s + i.totalUsed, 0);
                      const totalEstimatedCost = sortedItems.reduce((s, i) => s + i.estimatedCost, 0);
                      const totalEntries = allStockOutEntries.length;
                      const uniqueDays = Object.keys(dailyData).length;

                      if (allStockOutEntries.length === 0) {
                        return (
                          <div className="text-center py-12">
                            <span className="text-5xl mb-4 block">📋</span>
                            <p className="text-stone-400 text-lg mb-2">No Stock Out Data Available</p>
                            <p className="text-stone-500 text-sm">
                              Stock consumption data is collected when outlets submit their daily stock out entries.
                            </p>
                            <p className="text-stone-600 text-xs mt-4">
                              Tip: Ensure outlets submit stock out daily before 2:00 AM IST
                            </p>
                          </div>
                        );
                      }

                      return (
                        <>
                          {/* Summary Cards */}
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                            <div className="bg-stone-800/30 rounded-xl p-4 text-center">
                              <p className="text-2xl font-bold text-red-400">{totalEntries}</p>
                              <p className="text-xs text-stone-500">Stock Out Entries</p>
                            </div>
                            <div className="bg-stone-800/30 rounded-xl p-4 text-center">
                              <p className="text-2xl font-bold text-blue-400">{uniqueDays}</p>
                              <p className="text-xs text-stone-500">Days Reported</p>
                            </div>
                            <div className="bg-stone-800/30 rounded-xl p-4 text-center">
                              <p className="text-2xl font-bold text-amber-400">{sortedItems.length}</p>
                              <p className="text-xs text-stone-500">Items Consumed</p>
                            </div>
                            <div className="bg-stone-800/30 rounded-xl p-4 text-center">
                              <p className="text-2xl font-bold text-purple-400">{totalItemsUsed.toFixed(1)}</p>
                              <p className="text-xs text-stone-500">Total Units Used</p>
                            </div>
                            <div className="bg-stone-800/30 rounded-xl p-4 text-center">
                              <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalEstimatedCost)}</p>
                              <p className="text-xs text-stone-500">Est. Cost</p>
                            </div>
                          </div>

                          {/* Outlet Breakdown */}
                          <div className="mb-6">
                            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                              <span>🏪</span> Consumption by Outlet
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {outlets.map(outlet => {
                                const data = outletBreakdown[outlet] || { entries: 0, totalUsed: 0, items: {} };
                                const topItems = Object.values(data.items).sort((a, b) => b.used - a.used).slice(0, 3);
                                return (
                                  <div key={outlet} className="bg-stone-800/30 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-3">
                                      <h5 className="text-white font-medium">{outlet}</h5>
                                      <span className={`px-2 py-0.5 text-xs rounded-full ${data.entries > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-stone-700 text-stone-500'}`}>
                                        {data.entries} entries
                                      </span>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-stone-400">Total Used</span>
                                        <span className="text-red-400 font-medium">{data.totalUsed.toFixed(1)} units</span>
                                      </div>
                                      {topItems.length > 0 && (
                                        <div className="pt-2 border-t border-stone-700/50">
                                          <p className="text-xs text-stone-500 mb-1">Top Items:</p>
                                          {topItems.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-xs">
                                              <span className="text-stone-400 truncate">{item.name}</span>
                                              <span className="text-stone-300">{item.used}</span>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Detailed Items Table */}
                          <div className="mb-6">
                            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                              <span>📦</span> Item-Level Consumption Details
                              <span className="text-xs text-stone-500 font-normal">({sortedItems.length} items)</span>
                            </h4>
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="text-left text-xs text-stone-500 uppercase bg-stone-800/20">
                                    <th className="px-4 py-3">Item</th>
                                    <th className="px-4 py-3">Category</th>
                                    <th className="px-4 py-3 text-right">Total Used</th>
                                    <th className="px-4 py-3 text-right">Est. Cost</th>
                                    <th className="px-4 py-3 text-right">% of Total</th>
                                    <th className="px-4 py-3 text-center">Entries</th>
                                    <th className="px-4 py-3 text-center">Details</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {sortedItems.map(item => {
                                    const pct = totalItemsUsed > 0 ? (item.totalUsed / totalItemsUsed * 100) : 0;
                                    const isExpanded = expandedReportItem === item.id;
                                    return (
                                      <React.Fragment key={item.id}>
                                        <tr className="border-t border-stone-800/30 hover:bg-stone-800/20">
                                          <td className="px-4 py-3">
                                            <p className="text-white font-medium">{item.name}</p>
                                          </td>
                                          <td className="px-4 py-3">
                                            <span className="px-2 py-1 text-xs rounded-md bg-stone-800 text-stone-400">{item.categoryName}</span>
                                          </td>
                                          <td className="px-4 py-3 text-right">
                                            <span className="text-red-400 font-semibold">{item.totalUsed.toFixed(1)}</span>
                                            <span className="text-stone-500 text-sm ml-1">{item.unit}</span>
                                          </td>
                                          <td className="px-4 py-3 text-right text-amber-400">{formatCurrency(item.estimatedCost)}</td>
                                          <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                              <div className="w-16 h-2 bg-stone-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-red-500 rounded-full" style={{ width: `${pct}%` }} />
                                              </div>
                                              <span className="text-stone-400 text-sm w-12">{pct.toFixed(1)}%</span>
                                            </div>
                                          </td>
                                          <td className="px-4 py-3 text-center text-stone-400">{item.entries.length}</td>
                                          <td className="px-4 py-3 text-center">
                                            <button
                                              onClick={() => setExpandedReportItem(isExpanded ? null : item.id)}
                                              className="px-2 py-1 bg-stone-800 text-stone-400 rounded text-xs hover:bg-stone-700 hover:text-white"
                                            >
                                              {isExpanded ? 'Hide' : 'View'}
                                            </button>
                                          </td>
                                        </tr>
                                        {isExpanded && (
                                          <tr>
                                            <td colSpan={7} className="bg-stone-800/10 p-4">
                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* By Outlet */}
                                                <div className="bg-stone-800/30 rounded-lg p-3">
                                                  <h6 className="text-xs text-stone-500 uppercase mb-2">Usage by Outlet</h6>
                                                  {Object.entries(item.byOutlet).map(([outlet, used]) => (
                                                    <div key={outlet} className="flex justify-between text-sm py-1">
                                                      <span className="text-stone-300">{outlet}</span>
                                                      <span className="text-red-400">{used.toFixed(1)} {item.unit}</span>
                                                    </div>
                                                  ))}
                                                </div>
                                                {/* Recent Entries */}
                                                <div className="bg-stone-800/30 rounded-lg p-3">
                                                  <h6 className="text-xs text-stone-500 uppercase mb-2">Recent Stock Out Entries</h6>
                                                  {item.entries.slice(0, 5).map((entry, idx) => (
                                                    <div key={idx} className="flex justify-between text-sm py-1 border-b border-stone-700/30 last:border-0">
                                                      <span className="text-stone-400">{entry.date} • {entry.outlet}</span>
                                                      <span className="text-stone-300">{entry.before} → {entry.remaining} (-{entry.used})</span>
                                                    </div>
                                                  ))}
                                                  {item.entries.length > 5 && (
                                                    <p className="text-xs text-stone-500 mt-2">+{item.entries.length - 5} more entries</p>
                                                  )}
                                                </div>
                                              </div>
                                            </td>
                                          </tr>
                                        )}
                                      </React.Fragment>
                                    );
                                  })}
                                </tbody>
                                <tfoot>
                                  <tr className="border-t-2 border-stone-700 bg-stone-800/20">
                                    <td className="px-4 py-3 font-semibold text-white" colSpan={2}>TOTAL</td>
                                    <td className="px-4 py-3 text-right font-bold text-red-400">{totalItemsUsed.toFixed(1)} units</td>
                                    <td className="px-4 py-3 text-right font-bold text-amber-400">{formatCurrency(totalEstimatedCost)}</td>
                                    <td className="px-4 py-3 text-right text-stone-400">100%</td>
                                    <td className="px-4 py-3 text-center text-stone-400">{allStockOutEntries.length}</td>
                                    <td></td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          </div>

                          {/* Daily Breakdown Chart */}
                          <div>
                            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                              <span>📅</span> Daily Consumption Trend
                            </h4>
                            <div className="bg-stone-800/30 rounded-xl p-4">
                              {Object.keys(dailyData).length > 0 ? (
                                <div className="space-y-2">
                                  {Object.entries(dailyData).sort((a, b) => a[0].localeCompare(b[0])).slice(-14).map(([date, data]) => {
                                    const maxUsed = Math.max(...Object.values(dailyData).map(d => d.totalUsed));
                                    const pct = maxUsed > 0 ? (data.totalUsed / maxUsed * 100) : 0;
                                    return (
                                      <div key={date} className="flex items-center gap-3">
                                        <span className="text-stone-400 text-sm w-24">{date}</span>
                                        <div className="flex-1 h-6 bg-stone-700 rounded overflow-hidden relative">
                                          <div 
                                            className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded"
                                            style={{ width: `${pct}%` }}
                                          />
                                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white">
                                            {data.totalUsed.toFixed(1)} units
                                          </span>
                                        </div>
                                        <span className="text-stone-500 text-xs w-16">{data.entries} entry</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="text-stone-500 text-center py-4">No daily data available</p>
                              )}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </>
              )}

              {/* Stock Ordered Report Detail */}
              {activeReport === 'stockOrdered' && (
                <>
                  <div className="p-4 bg-emerald-500/10 border-b border-stone-800/50">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
                          <span>🛒</span> Stock Ordered Report
                        </h3>
                        <p className="text-sm text-stone-400 mt-1">Detailed item-level purchase orders from outlets</p>
                      </div>
                      <button onClick={() => setActiveReport(null)} className="text-stone-400 hover:text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Filters Row */}
                    <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-stone-700/50">
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-stone-500">Month:</label>
                        <select
                          value={reportMonth}
                          onChange={(e) => setReportMonth(parseInt(e.target.value))}
                          className="px-2 py-1 bg-stone-800 border border-stone-700 rounded-lg text-white text-sm"
                        >
                          {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                            <option key={m} value={m}>{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m-1]}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-stone-500">Outlet:</label>
                        <select
                          value={reportOutlet}
                          onChange={(e) => setReportOutlet(e.target.value)}
                          className="px-2 py-1 bg-stone-800 border border-stone-700 rounded-lg text-white text-sm"
                        >
                          <option value="All">All Outlets</option>
                          {outlets.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-stone-500">Category:</label>
                        <select
                          value={reportCategoryFilter}
                          onChange={(e) => setReportCategoryFilter(e.target.value)}
                          className="px-2 py-1 bg-stone-800 border border-stone-700 rounded-lg text-white text-sm"
                        >
                          <option value="All">All Categories</option>
                          {(categories || []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-stone-500">Search:</label>
                        <input
                          type="text"
                          value={reportItemFilter}
                          onChange={(e) => setReportItemFilter(e.target.value)}
                          placeholder="Search item..."
                          className="px-2 py-1 bg-stone-800 border border-stone-700 rounded-lg text-white text-sm w-32"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-stone-500">Sort:</label>
                        <select
                          value={reportSortBy}
                          onChange={(e) => setReportSortBy(e.target.value)}
                          className="px-2 py-1 bg-stone-800 border border-stone-700 rounded-lg text-white text-sm"
                        >
                          <option value="cost">Total Cost</option>
                          <option value="quantity">Quantity</option>
                          <option value="name">Item Name</option>
                        </select>
                        <button
                          onClick={() => setReportSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                          className="px-2 py-1 bg-stone-800 border border-stone-700 rounded-lg text-white text-sm"
                        >
                          {reportSortOrder === 'asc' ? '↑' : '↓'}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    {(() => {
                      const filteredOrders = orders.filter(o => {
                        const d = new Date(o.createdAt);
                        const matchMonth = (d.getMonth() + 1) === reportMonth;
                        const matchOutlet = reportOutlet === 'All' || o.outlet === reportOutlet;
                        return matchMonth && matchOutlet && o.status !== 'cancelled';
                      });

                      const itemsOrdered = {};
                      filteredOrders.forEach(order => {
                        order.items.forEach(item => {
                          const categoryId = item.categoryId;
                          const categoryName = item.categoryName || getCategoryName(categoryId);
                          
                          // Apply filters
                          if (reportCategoryFilter !== 'All' && categoryId !== reportCategoryFilter) return;
                          if (reportItemFilter && !item.name.toLowerCase().includes(reportItemFilter.toLowerCase())) return;
                          
                          const key = item.id || item.name;
                          if (!itemsOrdered[key]) {
                            itemsOrdered[key] = {
                              id: item.id,
                              name: item.name,
                              unit: item.unit,
                              quantity: 0,
                              cost: 0,
                              orders: [],
                              category: categoryName,
                              categoryId: categoryId,
                              byOutlet: {},
                              byDate: {}
                            };
                          }
                          itemsOrdered[key].quantity += item.quantity;
                          itemsOrdered[key].cost += item.totalCost || (item.price * item.quantity);
                          itemsOrdered[key].orders.push({
                            orderId: order.id,
                            outlet: order.outlet,
                            date: order.createdAt,
                            qty: item.quantity,
                            price: item.price,
                            status: order.status
                          });
                          
                          if (!itemsOrdered[key].byOutlet[order.outlet]) {
                            itemsOrdered[key].byOutlet[order.outlet] = { qty: 0, cost: 0 };
                          }
                          itemsOrdered[key].byOutlet[order.outlet].qty += item.quantity;
                          itemsOrdered[key].byOutlet[order.outlet].cost += item.totalCost || (item.price * item.quantity);
                          
                          const dateKey = new Date(order.createdAt).toLocaleDateString();
                          if (!itemsOrdered[key].byDate[dateKey]) {
                            itemsOrdered[key].byDate[dateKey] = 0;
                          }
                          itemsOrdered[key].byDate[dateKey] += item.quantity;
                        });
                      });

                      // Apply sorting
                      let sorted = Object.entries(itemsOrdered);
                      sorted.sort((a, b) => {
                        let comparison = 0;
                        if (reportSortBy === 'cost') comparison = b[1].cost - a[1].cost;
                        else if (reportSortBy === 'quantity') comparison = b[1].quantity - a[1].quantity;
                        else if (reportSortBy === 'name') comparison = a[1].name.localeCompare(b[1].name);
                        return reportSortOrder === 'asc' ? -comparison : comparison;
                      });

                      const totalCost = sorted.reduce((s, [_, d]) => s + d.cost, 0);
                      const totalQty = sorted.reduce((s, [_, d]) => s + d.quantity, 0);
                      const totalOrders = filteredOrders.length;

                      return (
                        <>
                          {/* Summary Cards */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-stone-800/30 rounded-xl p-4 text-center">
                              <p className="text-2xl font-bold text-blue-400">{totalOrders}</p>
                              <p className="text-xs text-stone-500">Total Orders</p>
                            </div>
                            <div className="bg-stone-800/30 rounded-xl p-4 text-center">
                              <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalCost)}</p>
                              <p className="text-xs text-stone-500">Total Value</p>
                            </div>
                            <div className="bg-stone-800/30 rounded-xl p-4 text-center">
                              <p className="text-2xl font-bold text-amber-400">{sorted.length}</p>
                              <p className="text-xs text-stone-500">Unique Items</p>
                            </div>
                            <div className="bg-stone-800/30 rounded-xl p-4 text-center">
                              <p className="text-2xl font-bold text-purple-400">
                                {totalOrders > 0 ? formatCurrency(totalCost / totalOrders) : '₹0'}
                              </p>
                              <p className="text-xs text-stone-500">Avg Order Value</p>
                            </div>
                          </div>

                          {/* Items Table */}
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="text-left text-xs text-stone-500 uppercase bg-stone-800/20">
                                  <th className="px-4 py-3">Item</th>
                                  <th className="px-4 py-3">Category</th>
                                  <th className="px-4 py-3 text-right">Qty Ordered</th>
                                  <th className="px-4 py-3 text-right">Total Cost</th>
                                  <th className="px-4 py-3 text-right">% of Total</th>
                                  <th className="px-4 py-3 text-center">Orders</th>
                                </tr>
                              </thead>
                              <tbody>
                                {sorted.map(([key, data]) => {
                                  const pct = totalCost > 0 ? (data.cost / totalCost * 100) : 0;
                                  return (
                                    <React.Fragment key={key}>
                                      <tr 
                                        className="border-t border-stone-800/30 hover:bg-stone-800/20 cursor-pointer"
                                        onClick={() => setExpandedReportItem(expandedReportItem === key ? null : key)}
                                      >
                                        <td className="px-4 py-3">
                                          <div className="flex items-center gap-2">
                                            <svg className={`w-4 h-4 text-stone-500 transition-transform ${expandedReportItem === key ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                            <span className="text-white font-medium">{data.name}</span>
                                          </div>
                                        </td>
                                        <td className="px-4 py-3">
                                          <span className="px-2 py-1 text-xs rounded-md bg-stone-800 text-stone-400">{data.category}</span>
                                        </td>
                                        <td className="px-4 py-3 text-right text-white">{data.quantity} {data.unit}</td>
                                        <td className="px-4 py-3 text-right text-amber-400 font-medium">{formatCurrency(data.cost)}</td>
                                        <td className="px-4 py-3 text-right">
                                          <div className="flex items-center justify-end gap-2">
                                            <div className="w-16 h-2 bg-stone-700 rounded-full overflow-hidden">
                                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                                            </div>
                                            <span className="text-stone-400 text-sm">{pct.toFixed(1)}%</span>
                                          </div>
                                        </td>
                                        <td className="px-4 py-3 text-center text-stone-400">{data.orders.length}</td>
                                      </tr>
                                      {expandedReportItem === key && (
                                        <tr>
                                          <td colSpan={6} className="bg-stone-800/10 px-4 py-3">
                                            <div className="pl-6 space-y-2">
                                              <p className="text-xs text-stone-500 uppercase mb-2">Order Details</p>
                                              {data.orders.slice(0, 5).map((o, idx) => (
                                                <div key={idx} className="flex items-center justify-between text-sm py-1 border-b border-stone-800/30 last:border-0">
                                                  <span className="text-white">{o.orderId}</span>
                                                  <span className="text-stone-400">{o.outlet}</span>
                                                  <span className="text-stone-500">{formatDate(o.date)}</span>
                                                  <span className="text-amber-400">{o.qty} {data.unit}</span>
                                                </div>
                                              ))}
                                              {data.orders.length > 5 && (
                                                <p className="text-xs text-stone-500">+{data.orders.length - 5} more orders</p>
                                              )}
                                            </div>
                                          </td>
                                        </tr>
                                      )}
                                    </React.Fragment>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                          {sorted.length === 0 && (
                            <p className="text-stone-500 text-center py-8">No orders found for the selected period</p>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </>
              )}

              {/* Price History Report Detail */}
              {activeReport === 'priceHistory' && (
                <>
                  <div className="p-4 bg-orange-500/10 border-b border-stone-800/50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-orange-400 flex items-center gap-2">
                        <span>💰</span> Price Change Report
                      </h3>
                      <button onClick={() => setActiveReport(null)} className="text-stone-400 hover:text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm text-stone-400 mt-1">Track all price updates and identify major fluctuations. Price changes apply to new orders only - existing orders retain their original prices.</p>
                  </div>
                  <div className="p-4">
                    {(() => {
                      const itemsWithPrices = items
                        .filter(item => item.lastUpdated)
                        .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));

                      // Find items with significant price changes
                      const significantChanges = items.filter(item => 
                        item.priceChangePercent && Math.abs(item.priceChangePercent) >= 10
                      );

                      return (
                        <>
                          {/* Alert for significant changes */}
                          {significantChanges.length > 0 && (
                            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-6">
                              <h4 className="text-orange-400 font-medium mb-2 flex items-center gap-2">
                                <span>⚠️</span> Significant Price Changes Detected
                              </h4>
                              <div className="space-y-2">
                                {significantChanges.map(item => (
                                  <div key={item.id} className="flex items-center justify-between text-sm">
                                    <span className="text-white">{item.name}</span>
                                    <span className={item.priceChange > 0 ? 'text-red-400' : 'text-emerald-400'}>
                                      {item.priceChange > 0 ? '↑' : '↓'} {Math.abs(item.priceChangePercent).toFixed(1)}% 
                                      ({formatCurrency(item.previousPrice)} → {formatCurrency(item.price)})
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {itemsWithPrices.length === 0 ? (
                            <p className="text-stone-500 text-center py-8">No price changes recorded</p>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="text-left text-xs text-stone-500 uppercase bg-stone-800/20">
                                    <th className="px-4 py-3">Item</th>
                                    <th className="px-4 py-3">Category</th>
                                    <th className="px-4 py-3 text-right">Previous Price</th>
                                    <th className="px-4 py-3 text-right">Current Price</th>
                                    <th className="px-4 py-3 text-right">Change</th>
                                    <th className="px-4 py-3 text-right">Last Updated</th>
                                    <th className="px-4 py-3 text-center">History</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {itemsWithPrices.map(item => (
                                    <React.Fragment key={item.id}>
                                      <tr className="border-t border-stone-800/30 hover:bg-stone-800/20">
                                        <td className="px-4 py-3 text-white font-medium">{item.name}</td>
                                        <td className="px-4 py-3">
                                          <span className="px-2 py-1 text-xs rounded-md bg-stone-800 text-stone-400">{getCategoryName(item.categoryId)}</span>
                                        </td>
                                        <td className="px-4 py-3 text-right text-stone-400">
                                          {item.previousPrice ? formatCurrency(item.previousPrice) : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-right text-amber-400 font-semibold">{formatCurrency(item.price)}/{item.unit}</td>
                                        <td className="px-4 py-3 text-right">
                                          {item.priceChange ? (
                                            <span className={item.priceChange > 0 ? 'text-red-400' : 'text-emerald-400'}>
                                              {item.priceChange > 0 ? '+' : ''}{formatCurrency(item.priceChange)}
                                              <span className="text-xs ml-1">({item.priceChange > 0 ? '+' : ''}{item.priceChangePercent?.toFixed(1)}%)</span>
                                            </span>
                                          ) : (
                                            <span className="text-stone-500">-</span>
                                          )}
                                        </td>
                                        <td className="px-4 py-3 text-right text-stone-400 text-sm">{formatDate(item.lastUpdated)}</td>
                                        <td className="px-4 py-3 text-center">
                                          {item.priceHistory && item.priceHistory.length > 0 ? (
                                            <button
                                              onClick={() => setExpandedReportItem(expandedReportItem === item.id ? null : item.id)}
                                              className="px-2 py-1 bg-stone-800 text-stone-400 rounded text-xs hover:bg-stone-700 hover:text-white"
                                            >
                                              {item.priceHistory.length} changes
                                            </button>
                                          ) : (
                                            <span className="text-stone-600 text-xs">-</span>
                                          )}
                                        </td>
                                      </tr>
                                      {expandedReportItem === item.id && item.priceHistory && (
                                        <tr>
                                          <td colSpan={7} className="bg-stone-800/10 px-4 py-3">
                                            <div className="pl-4">
                                              <p className="text-xs text-stone-500 uppercase mb-2">Price History (Last 10)</p>
                                              <div className="space-y-1">
                                                {item.priceHistory.slice().reverse().map((history, idx) => (
                                                  <div key={idx} className="flex items-center justify-between text-sm py-1 border-b border-stone-700/30 last:border-0">
                                                    <span className="text-stone-400">{formatDate(history.changedAt)}</span>
                                                    <span className="text-stone-300">
                                                      {formatCurrency(history.price)} → {formatCurrency(history.changedTo)}
                                                    </span>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      )}
                                    </React.Fragment>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </>
              )}

              {/* Disputes Report Detail */}
              {activeReport === 'disputes' && (
                <>
                  <div className="p-4 bg-yellow-500/10 border-b border-stone-800/50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
                        <span>⚠️</span> Disputes Report
                        <span className="text-xs font-normal text-stone-500 ml-2">
                          {[{ value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
                            { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
                            { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
                            { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' }
                          ].find(m => m.value === reportMonth)?.label} • {reportOutlet === 'All' ? 'All Outlets' : reportOutlet}
                        </span>
                      </h3>
                      <button onClick={() => setActiveReport(null)} className="text-stone-400 hover:text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm text-stone-400 mt-1">Detailed analysis of disputed orders</p>
                  </div>
                  <div className="p-4">
                    {(() => {
                      const disputedOrders = orders.filter(o => {
                        const d = new Date(o.createdAt);
                        const matchMonth = (d.getMonth() + 1) === reportMonth;
                        const matchOutlet = reportOutlet === 'All' || o.outlet === reportOutlet;
                        return o.status === 'disputed' && matchMonth && matchOutlet;
                      });

                      // Summary by outlet
                      const byOutlet = {};
                      (reportOutlet === 'All' ? outlets : [reportOutlet]).forEach(outlet => {
                        const outletDisputes = disputedOrders.filter(o => o.outlet === outlet);
                        const totalOutletOrders = orders.filter(o => {
                          const d = new Date(o.createdAt);
                          return o.outlet === outlet && (d.getMonth() + 1) === reportMonth;
                        }).length;
                        byOutlet[outlet] = {
                          disputes: outletDisputes.length,
                          total: totalOutletOrders,
                          rate: totalOutletOrders > 0 ? (outletDisputes.length / totalOutletOrders * 100) : 0
                        };
                      });

                      return (
                        <>
                          {/* Summary Cards */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            {Object.entries(byOutlet).map(([outlet, data]) => (
                              <div key={outlet} className={`rounded-xl p-4 ${data.rate > 10 ? 'bg-red-500/10 border border-red-500/30' : 'bg-stone-800/30'}`}>
                                <h4 className="text-white font-medium mb-2">{outlet}</h4>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-stone-400">Disputes</span>
                                    <span className={data.disputes > 0 ? 'text-red-400 font-medium' : 'text-white'}>{data.disputes}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-stone-400">Total Orders</span>
                                    <span className="text-white">{data.total}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-stone-400">Dispute Rate</span>
                                    <span className={data.rate > 10 ? 'text-red-400' : 'text-emerald-400'}>{data.rate.toFixed(1)}%</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Disputed Orders List */}
                          {disputedOrders.length > 0 ? (
                            <div className="space-y-3">
                              <h4 className="text-white font-medium">Disputed Orders</h4>
                              {disputedOrders.map(order => (
                                <div 
                                  key={order.id} 
                                  className="bg-stone-800/30 rounded-xl p-4 cursor-pointer hover:bg-stone-800/50"
                                  onClick={() => setExpandedReportItem(expandedReportItem === order.id ? null : order.id)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-white font-medium">{order.id}</span>
                                        <span className="px-2 py-0.5 bg-stone-700 text-stone-300 text-xs rounded-lg">{order.outlet}</span>
                                      </div>
                                      <p className="text-xs text-stone-500 mt-1">{formatDate(order.createdAt)}</p>
                                    </div>
                                    <svg className={`w-5 h-5 text-stone-500 transition-transform ${expandedReportItem === order.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </div>
                                  {expandedReportItem === order.id && order.dispute && (
                                    <div className="mt-3 pt-3 border-t border-stone-700/50">
                                      <p className="text-sm text-orange-400 mb-2">Reason: {order.dispute.disputeReason}</p>
                                      <p className="text-xs text-stone-500 mb-2">Disputed by {order.dispute.disputedBy}</p>
                                      <div className="space-y-1">
                                        {order.dispute.originalItems?.filter(i => i.difference !== 0).map((item, idx) => (
                                          <div key={idx} className="flex justify-between text-sm">
                                            <span className="text-stone-300">{item.name}</span>
                                            <span className="text-red-400">
                                              Sent: {item.dispatchedQty} → Received: {item.receivedQty}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-stone-500 text-center py-8">No disputes found for the selected period 🎉</p>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </>
              )}

              {/* Category Spending Report Detail */}
              {activeReport === 'categorySpending' && (
                <>
                  <div className="p-4 bg-cyan-500/10 border-b border-stone-800/50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
                        <span>📈</span> Category-wise Spending
                        <span className="text-xs font-normal text-stone-500 ml-2">
                          {[{ value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
                            { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
                            { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
                            { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' }
                          ].find(m => m.value === reportMonth)?.label} • {reportOutlet === 'All' ? 'All Outlets' : reportOutlet}
                        </span>
                      </h3>
                      <button onClick={() => setActiveReport(null)} className="text-stone-400 hover:text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    {(() => {
                      const filteredOrders = orders.filter(o => {
                        const d = new Date(o.createdAt);
                        const matchMonth = (d.getMonth() + 1) === reportMonth;
                        const matchOutlet = reportOutlet === 'All' || o.outlet === reportOutlet;
                        return matchMonth && matchOutlet && o.status !== 'cancelled';
                      });

                      const catSpend = {};
                      filteredOrders.forEach(order => {
                        order.items.forEach(item => {
                          const catName = item.categoryName || getCategoryName(item.categoryId) || 'Uncategorized';
                          if (!catSpend[catName]) catSpend[catName] = { cost: 0, items: {}, orders: 0 };
                          catSpend[catName].cost += item.totalCost || (item.price * item.quantity);
                          catSpend[catName].orders += 1;
                          if (!catSpend[catName].items[item.name]) {
                            catSpend[catName].items[item.name] = { qty: 0, cost: 0, unit: item.unit };
                          }
                          catSpend[catName].items[item.name].qty += item.quantity;
                          catSpend[catName].items[item.name].cost += item.totalCost || (item.price * item.quantity);
                        });
                      });

                      const sorted = Object.entries(catSpend).sort((a, b) => b[1].cost - a[1].cost);
                      const total = sorted.reduce((s, [_, d]) => s + d.cost, 0);

                      return sorted.length === 0 ? (
                        <p className="text-stone-500 text-center py-8">No spending data for the selected period</p>
                      ) : (
                        <div className="space-y-4">
                          {sorted.map(([cat, data]) => {
                            const pct = total > 0 ? (data.cost / total * 100) : 0;
                            return (
                              <div key={cat} className="bg-stone-800/30 rounded-xl p-4">
                                <div 
                                  className="flex items-center justify-between cursor-pointer"
                                  onClick={() => setExpandedReportItem(expandedReportItem === cat ? null : cat)}
                                >
                                  <div>
                                    <h4 className="text-white font-medium">{cat}</h4>
                                    <p className="text-xs text-stone-500">{Object.keys(data.items).length} items • {data.orders} line items</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-amber-400 font-semibold">{formatCurrency(data.cost)}</p>
                                    <p className="text-xs text-stone-500">{pct.toFixed(1)}% of total</p>
                                  </div>
                                </div>
                                <div className="mt-3 h-2 bg-stone-700 rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                                </div>
                                {expandedReportItem === cat && (
                                  <div className="mt-4 pt-3 border-t border-stone-700/50 space-y-2">
                                    {Object.entries(data.items).sort((a, b) => b[1].cost - a[1].cost).map(([itemName, itemData]) => (
                                      <div key={itemName} className="flex justify-between text-sm">
                                        <span className="text-stone-300">{itemName}</span>
                                        <span className="text-stone-400">{itemData.qty} {itemData.unit} • {formatCurrency(itemData.cost)}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </>
              )}

              {/* Outlet Comparison Report Detail */}
              {activeReport === 'outletComparison' && (
                <>
                  <div className="p-4 bg-purple-500/10 border-b border-stone-800/50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-purple-400 flex items-center gap-2">
                        <span>🏪</span> Outlet Comparison
                        <span className="text-xs font-normal text-stone-500 ml-2">
                          {[{ value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
                            { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
                            { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
                            { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' }
                          ].find(m => m.value === reportMonth)?.label}
                        </span>
                      </h3>
                      <button onClick={() => setActiveReport(null)} className="text-stone-400 hover:text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-xs text-stone-500 uppercase bg-stone-800/20">
                            <th className="px-4 py-3">Outlet</th>
                            <th className="px-4 py-3 text-right">Orders</th>
                            <th className="px-4 py-3 text-right">Total Spend</th>
                            <th className="px-4 py-3 text-right">Avg Order</th>
                            <th className="px-4 py-3 text-right">Disputes</th>
                            <th className="px-4 py-3 text-right">Dispute Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {outlets.map(outlet => {
                            const outletOrders = orders.filter(o => {
                              const d = new Date(o.createdAt);
                              return o.outlet === outlet && (d.getMonth() + 1) === reportMonth && o.status !== 'cancelled';
                            });
                            const totalSpend = outletOrders.reduce((s, o) => s + o.totalAmount, 0);
                            const disputes = outletOrders.filter(o => o.status === 'disputed').length;
                            const disputeRate = outletOrders.length > 0 ? (disputes / outletOrders.length * 100) : 0;

                            return (
                              <tr key={outlet} className="border-t border-stone-800/30 hover:bg-stone-800/20">
                                <td className="px-4 py-3 text-white font-medium">{outlet}</td>
                                <td className="px-4 py-3 text-right text-stone-400">{outletOrders.length}</td>
                                <td className="px-4 py-3 text-right text-amber-400 font-semibold">{formatCurrency(totalSpend)}</td>
                                <td className="px-4 py-3 text-right text-stone-400">
                                  {outletOrders.length > 0 ? formatCurrency(totalSpend / outletOrders.length) : '₹0'}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <span className={disputes > 0 ? 'text-red-400' : 'text-stone-400'}>{disputes}</span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <span className={disputeRate > 10 ? 'text-red-400' : 'text-emerald-400'}>{disputeRate.toFixed(1)}%</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-stone-400 uppercase tracking-wider bg-stone-800/30">
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Outlet</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(users).map(([phone, user]) => (
                <tr key={phone} className="border-t border-stone-800/30 hover:bg-stone-800/20">
                  <td className="px-4 py-3 text-white font-mono">+91 {phone}</td>
                  <td className="px-4 py-3 text-white">{user.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-lg ${
                      user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' :
                      user.role === 'central_kitchen' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-stone-400">{user.outlet || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'items' && (
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-stone-400">Filter by Category:</span>
              <button
                onClick={() => setSelectedCategoryFilter('All')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedCategoryFilter === 'All'
                    ? 'bg-amber-500 text-white'
                    : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                }`}
              >
                All
              </button>
              {(categories || []).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedCategoryFilter === cat.id
                      ? 'bg-amber-500 text-white'
                      : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-stone-400 uppercase tracking-wider bg-stone-800/30">
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Unit</th>
                <th className="px-4 py-3 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {items.filter(item => selectedCategoryFilter === 'All' || item.categoryId === selectedCategoryFilter).map(item => (
                <tr key={item.id} className="border-t border-stone-800/30 hover:bg-stone-800/20">
                  <td className="px-4 py-3 text-white font-medium">{item.name}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-md bg-stone-800 text-stone-400">{getCategoryName(item.categoryId)}</span>
                  </td>
                  <td className="px-4 py-3 text-stone-400">{item.unit}</td>
                  <td className="px-4 py-3 text-right text-amber-400 font-semibold">{formatCurrency(item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// SHARED COMPONENTS
// ============================================
function StatCard({ title, value, icon, color }) {
  const colors = {
    amber: 'from-amber-500/10 to-orange-500/10 border-amber-500/20',
    blue: 'from-blue-500/10 to-cyan-500/10 border-blue-500/20',
    emerald: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20',
    purple: 'from-purple-500/10 to-pink-500/10 border-purple-500/20',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-2xl p-5 card-hover transition-all hover:scale-[1.02]`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-stone-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white mt-1 number-animate">{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap active:scale-95 ${
        active
          ? 'bg-amber-500/20 text-amber-400 scale-[1.02]'
          : 'text-stone-400 hover:text-white hover:bg-stone-800'
      }`}
    >
      {children}
    </button>
  );
}

// ============================================
// ITEM SEARCH ANALYTICS COMPONENT
// ============================================
function ItemSearchAnalytics({ items, categories, orders, outlets, searchItemId, onSearchItemChange, outletView, onOutletViewChange }) {
  const selectedItem = items.find(i => i.id === Number(searchItemId));
  
  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : 'Unknown';
  };

  // Calculate quantities for time periods
  const calcQty = (filterOrders) => {
    if (!selectedItem) return 0;
    let total = 0;
    filterOrders.forEach(order => {
      if (order.status === 'cancelled') return;
      order.items.forEach(item => {
        if (item.id === selectedItem.id) {
          total += item.quantity;
        }
      });
    });
    return total;
  };

  const now = new Date();
  const oneWeek = new Date(now); oneWeek.setDate(now.getDate() - 7);
  const oneMonth = new Date(now); oneMonth.setMonth(now.getMonth() - 1);
  const threeMonths = new Date(now); threeMonths.setMonth(now.getMonth() - 3);
  const sixMonths = new Date(now); sixMonths.setMonth(now.getMonth() - 6);

  const getOrdersInRange = (start, outletFilter) => {
    return orders.filter(o => {
      const d = new Date(o.createdAt);
      const inRange = start ? d >= start : true;
      const matchOutlet = outletFilter === 'All' ? true : o.outlet === outletFilter;
      return inRange && matchOutlet;
    });
  };

  const periods = [
    { label: 'Last 7 Days', key: 'week', start: oneWeek, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { label: 'Last 30 Days', key: 'month', start: oneMonth, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Last 3 Months', key: '3months', start: threeMonths, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Last 6 Months', key: '6months', start: sixMonths, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'All Time', key: 'all', start: null, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  ];

  // Group items by category for dropdown
  const groupedItems = {};
  categories.forEach(cat => {
    const catItems = items.filter(i => i.categoryId === cat.id);
    if (catItems.length > 0) groupedItems[cat.name] = catItems;
  });

  return (
    <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl overflow-hidden">
      <div className="p-4 bg-stone-800/30 border-b border-stone-800/50">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>🔍</span> Item Purchase Lookup
        </h3>
        <p className="text-sm text-stone-500 mt-1">Search any item to see ordering history across time periods</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Search Controls */}
        <div className="flex flex-wrap gap-3 items-end">
          {/* Item Dropdown */}
          <div className="flex-1 min-w-[220px]">
            <label className="text-xs text-stone-500 uppercase mb-1 block">Select Item</label>
            <select
              value={searchItemId}
              onChange={(e) => onSearchItemChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-white appearance-none cursor-pointer"
            >
              <option value="">-- Choose an item --</option>
              {Object.entries(groupedItems).map(([catName, catItems]) => (
                <optgroup key={catName} label={`── ${catName} ──`}>
                  {catItems.map(item => (
                    <option key={item.id} value={item.id}>{item.name} ({item.unit})</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div>
            <label className="text-xs text-stone-500 uppercase mb-1 block">View</label>
            <div className="flex rounded-xl overflow-hidden border border-stone-700">
              <button
                onClick={() => onOutletViewChange('consolidated')}
                className={`px-4 py-2.5 text-sm font-medium transition-all ${
                  outletView === 'consolidated'
                    ? 'bg-amber-500 text-white'
                    : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                }`}
              >
                Consolidated
              </button>
              <button
                onClick={() => onOutletViewChange('outletwise')}
                className={`px-4 py-2.5 text-sm font-medium transition-all ${
                  outletView === 'outletwise'
                    ? 'bg-amber-500 text-white'
                    : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                }`}
              >
                Outlet-wise
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {selectedItem && (
          <div className="space-y-4 animate-fade-in">
            {/* Item Info */}
            <div className="flex items-center gap-3 p-3 bg-stone-800/30 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 text-lg font-bold">
                {selectedItem.name.charAt(0)}
              </div>
              <div>
                <p className="text-white font-semibold">{selectedItem.name}</p>
                <p className="text-xs text-stone-500">{getCategoryName(selectedItem.categoryId)} • {selectedItem.unit} • ₹{selectedItem.price.toFixed(2)}/{selectedItem.unit}</p>
              </div>
            </div>

            {outletView === 'consolidated' ? (
              /* Consolidated View */
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {periods.map(period => {
                  const qty = calcQty(getOrdersInRange(period.start, 'All'));
                  const cost = qty * selectedItem.price;
                  return (
                    <div key={period.key} className={`rounded-xl p-4 border ${period.bg}`}>
                      <p className="text-xs text-stone-500 mb-2">{period.label}</p>
                      <p className={`text-2xl font-bold ${period.color}`}>
                        {qty.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-stone-500 mt-1">{selectedItem.unit}</p>
                      <p className={`text-sm font-medium mt-2 ${period.color}`}>
                        ₹{cost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Outlet-wise View */
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-stone-500 uppercase bg-stone-800/30">
                      <th className="px-4 py-3">Outlet</th>
                      {periods.map(p => (
                        <th key={p.key} className="px-4 py-3 text-right">{p.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {outlets.map(outlet => (
                      <tr key={outlet} className="border-t border-stone-800/30 hover:bg-stone-800/10">
                        <td className="px-4 py-3 text-white font-medium">{outlet}</td>
                        {periods.map(period => {
                          const qty = calcQty(getOrdersInRange(period.start, outlet));
                          return (
                            <td key={period.key} className="px-4 py-3 text-right">
                              <span className={`font-semibold ${period.color}`}>{qty.toLocaleString('en-IN')}</span>
                              <span className="text-stone-600 text-xs ml-1">{selectedItem.unit}</span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                    {/* Totals row */}
                    <tr className="border-t-2 border-stone-700 bg-stone-800/20 font-semibold">
                      <td className="px-4 py-3 text-amber-400">Total</td>
                      {periods.map(period => {
                        const qty = calcQty(getOrdersInRange(period.start, 'All'));
                        return (
                          <td key={period.key} className="px-4 py-3 text-right text-amber-400">
                            {qty.toLocaleString('en-IN')}
                            <span className="text-stone-600 text-xs ml-1">{selectedItem.unit}</span>
                          </td>
                        );
                      })}
                    </tr>
                    {/* Cost row */}
                    <tr className="border-t border-stone-800/30 bg-stone-800/10 text-sm">
                      <td className="px-4 py-2 text-stone-400">Est. Cost</td>
                      {periods.map(period => {
                        const qty = calcQty(getOrdersInRange(period.start, 'All'));
                        const cost = qty * selectedItem.price;
                        return (
                          <td key={period.key} className="px-4 py-2 text-right text-stone-400">
                            ₹{cost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Recent Orders containing this item */}
            <div className="mt-2">
              <p className="text-sm text-stone-400 mb-2 font-medium">📋 Recent orders containing {selectedItem.name}:</p>
              {(() => {
                const recentOrders = orders
                  .filter(o => o.status !== 'cancelled' && o.items.some(i => i.id === selectedItem.id))
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 8);
                
                if (recentOrders.length === 0) return (
                  <p className="text-stone-600 text-sm py-3">No orders found for this item</p>
                );
                
                return (
                  <div className="space-y-1.5 max-h-52 overflow-y-auto">
                    {recentOrders.map(order => {
                      const itemInOrder = order.items.find(i => i.id === selectedItem.id);
                      return (
                        <div key={order.id} className="flex items-center justify-between py-2 px-3 bg-stone-800/20 rounded-lg text-sm">
                          <div className="flex items-center gap-3">
                            <span className="text-white font-medium">{order.id}</span>
                            <span className="text-stone-500">{order.outlet}</span>
                            <span className="text-stone-600">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-amber-400 font-medium">{itemInOrder?.quantity} {selectedItem.unit}</span>
                            <span className={`px-2 py-0.5 text-xs rounded-lg ${
                              order.status === 'delivered' || order.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                              order.status === 'dispatched' ? 'bg-blue-500/20 text-blue-400' :
                              order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                              order.status === 'disputed' ? 'bg-orange-500/20 text-orange-400' :
                              'bg-stone-700 text-stone-400'
                            }`}>{order.status}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {!selectedItem && searchItemId === '' && (
          <div className="text-center py-8">
            <span className="text-4xl mb-3 block">📦</span>
            <p className="text-stone-500">Select an item from the dropdown to view its purchase history</p>
          </div>
        )}
      </div>
    </div>
  );
}

function OrderHistory({ orders, showOutlet, showActions, onUpdateStatus }) {
  const [expandedOrder, setExpandedOrder] = useState(null);

  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      dispatched: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      delivered: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
      disputed: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    };
    return badges[status] || badges.pending;
  };

  if (orders.length === 0) {
    return (
      <div className="bg-stone-900/50 border border-stone-800/50 rounded-2xl p-12 text-center">
        <svg className="w-16 h-16 mx-auto mb-4 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-stone-500">No orders found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedOrders.map(order => (
        <div key={order.id} className="bg-stone-900/50 border border-stone-800/50 rounded-2xl overflow-hidden">
          <div 
            className="p-4 cursor-pointer hover:bg-stone-800/20 transition-colors"
            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-white font-medium">{order.id}</p>
                  <p className="text-xs text-stone-500">{formatDate(order.createdAt)}</p>
                </div>
                {showOutlet && (
                  <span className="px-3 py-1 bg-stone-800 text-stone-300 text-sm rounded-lg">
                    {order.outlet}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 text-xs font-medium rounded-lg border ${getStatusBadge(order.status)}`}>
                  {order.status}
                </span>
                <span className="text-amber-400 font-semibold">{formatCurrency(order.totalAmount)}</span>
                <svg 
                  className={`w-5 h-5 text-stone-500 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {expandedOrder === order.id && (
            <div className="border-t border-stone-800/50 p-4 bg-stone-800/10">
              <table className="w-full mb-4">
                <thead>
                  <tr className="text-left text-xs text-stone-500 uppercase">
                    <th className="pb-2">Item</th>
                    <th className="pb-2 text-right">Requested</th>
                    <th className="pb-2 text-right">Sent</th>
                    <th className="pb-2 text-right">Price</th>
                    <th className="pb-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="text-sm">
                      <td className="py-1.5 text-white">{item.name}</td>
                      <td className="py-1.5 text-right text-stone-400">
                        {item.requestedQuantity || item.quantity} {item.unit}
                      </td>
                      <td className="py-1.5 text-right">
                        <span className={`${(item.requestedQuantity && item.requestedQuantity !== item.quantity) ? 'text-orange-400' : 'text-white'}`}>
                          {item.quantity} {item.unit}
                        </span>
                      </td>
                      <td className="py-1.5 text-right text-stone-400">{formatCurrency(item.price)}</td>
                      <td className="py-1.5 text-right text-amber-400">{formatCurrency(item.totalCost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-xs text-stone-500 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  <p>📝 Order Placed by: {order.createdBy} • {formatDate(order.createdAt)}</p>
                </div>
                {order.dispatchedAt && (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <p>🚚 Dispatched by: {order.dispatchedBy} • {formatDate(order.dispatchedAt)}
                      <span className="text-blue-400 ml-2">
                        (after {(() => {
                          const mins = Math.round((new Date(order.dispatchedAt) - new Date(order.createdAt)) / 60000);
                          if (mins < 60) return `${mins} min`;
                          const hrs = Math.floor(mins / 60);
                          const remMins = mins % 60;
                          return `${hrs}h ${remMins}m`;
                        })()})
                      </span>
                    </p>
                  </div>
                )}
                {order.acceptedAt && (order.status === 'delivered' || order.status === 'completed') && (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <p>✅ Delivered & Accepted by: {order.acceptedBy} • {formatDate(order.acceptedAt)}
                      {order.dispatchedAt && (
                        <span className="text-emerald-400 ml-2">
                          (delivery: {(() => {
                            const mins = Math.round((new Date(order.acceptedAt) - new Date(order.dispatchedAt)) / 60000);
                            if (mins < 60) return `${mins} min`;
                            const hrs = Math.floor(mins / 60);
                            const remMins = mins % 60;
                            return `${hrs}h ${remMins}m`;
                          })()})
                        </span>
                      )}
                    </p>
                  </div>
                )}
                {order.completedAt && !order.acceptedAt && order.status !== 'disputed' && (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <p>✅ Accepted • {formatDate(order.completedAt)}</p>
                  </div>
                )}
                {order.notes && (
                  <p className="text-orange-400 mt-2">Note: {order.notes}</p>
                )}
                
                {/* Dispute Details */}
                {order.status === 'disputed' && order.dispute && (
                  <div className="mt-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                    <p className="text-orange-400 font-medium mb-2">⚠️ Disputed Order</p>
                    <p className="text-stone-400">Disputed by: {order.dispute.disputedBy} • {formatDate(order.dispute.disputedAt)}</p>
                    <p className="text-orange-300 mt-2 font-medium">Reason: {order.dispute.disputeReason}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-stone-500 text-[11px] uppercase">Quantity Discrepancies:</p>
                      {order.dispute.originalItems.filter(i => i.difference !== 0).map((item, idx) => (
                        <div key={idx} className="flex justify-between text-stone-400">
                          <span>{item.name}</span>
                          <span>
                            Sent: {item.dispatchedQty} → Received: {item.receivedQty} 
                            <span className="text-red-400 ml-1">({item.difference > 0 ? `-${item.difference}` : `+${Math.abs(item.difference)}`})</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {showActions && order.status === 'pending' && onUpdateStatus && (
                <div className="flex gap-2 pt-3 mt-3 border-t border-stone-800/50">
                  <button
                    onClick={(e) => { e.stopPropagation(); onUpdateStatus(order.id, 'cancelled'); }}
                    className="px-4 py-2 bg-red-500/20 text-red-400 text-sm rounded-lg hover:bg-red-500/30"
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
