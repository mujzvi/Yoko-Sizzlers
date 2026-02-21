import React, { useState, useEffect, useRef, useCallback } from 'react';

// ============================================
// YOKO SIZZLERS PURCHASE ORDER SYSTEM
// ============================================

// Supabase REST API (direct fetch - bypasses client library 406 issues)
const SUPABASE_URL = 'https://rrmscslchpjpatcdimtv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJybXNjc2xjaHBqcGF0Y2RpbXR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NzQxMzUsImV4cCI6MjA4NTU1MDEzNX0.tJAgiO6_yp2yTQbCEEYhaCbA0O6aG0cZsodbGBnGX5w';
const REST_URL = `${SUPABASE_URL}/rest/v1`;

const supaHeaders = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

// Simple REST wrapper that mimics Supabase client API
const supaRest = {
  async select(table, options = {}) {
    let url = `${REST_URL}/${table}?select=*`;
    if (options.order) {
      url += `&order=${options.order}.${options.ascending === false ? 'desc' : 'asc'}`;
    }
    if (options.eq) {
      Object.entries(options.eq).forEach(([col, val]) => {
        url += `&${col}=eq.${encodeURIComponent(val)}`;
      });
    }
    const res = await fetch(url, { headers: { ...supaHeaders, 'Accept': 'application/json' } });
    if (!res.ok) throw new Error(`Select ${table} failed: ${res.status}`);
    return await res.json();
  },
  
  async insert(table, rows) {
    const body = Array.isArray(rows) ? rows : [rows];
    const res = await fetch(`${REST_URL}/${table}`, {
      method: 'POST',
      headers: { ...supaHeaders, 'Accept': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Insert ${table} failed: ${res.status}`);
    return await res.json();
  },
  
  async update(table, updates, eq) {
    let url = `${REST_URL}/${table}`;
    const params = Object.entries(eq).map(([col, val]) => `${col}=eq.${encodeURIComponent(val)}`).join('&');
    url += `?${params}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { ...supaHeaders, 'Accept': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error(`Update ${table} failed: ${res.status}`);
    return await res.json();
  },
  
  async upsert(table, rows, onConflict) {
    const body = Array.isArray(rows) ? rows : [rows];
    let url = `${REST_URL}/${table}`;
    const headers = { ...supaHeaders, 'Accept': 'application/json' };
    
    // For upsert, use Prefer header with on_conflict
    if (onConflict) {
      headers['Prefer'] = `return=representation,resolution=merge-duplicates`;
    } else {
      headers['Prefer'] = 'return=representation';
    }
    
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Upsert ${table} failed: ${res.status} - ${errText}`);
    }
    return await res.json();
  },
};

// Dummy getSupabase for compatibility
const getSupabase = () => null;

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
      @keyframes blob {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(20px, -30px) scale(1.1); }
        50% { transform: translate(-20px, 20px) scale(0.9); }
        75% { transform: translate(30px, 10px) scale(1.05); }
      }
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.3); }
        50% { box-shadow: 0 0 40px rgba(251, 191, 36, 0.5); }
      }
      @keyframes scale-in {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
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
      .animate-blob { animation: blob 8s ease-in-out infinite; }
      .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
      .animate-scale-in { animation: scale-in 0.4s ease-out backwards; }
      .animate-float { animation: float 3s ease-in-out infinite; }
      .animation-delay-2000 { animation-delay: 2s; }
      .animation-delay-4000 { animation-delay: 4s; }
      
      /* Button press effect */
      .btn-press:active { transform: scale(0.96); }
      
      /* Tab switch animation */
      .tab-content { animation: fade-in 0.2s ease-out; }
      
      /* Card hover lift */
      .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
      .card-hover:hover { transform: translateY(-4px); }
      
      /* Liquid Glass Styles */
      .glass-bg {
        background: linear-gradient(135deg, rgba(250,250,249,0.95) 0%, rgba(245,245,244,0.9) 50%, rgba(255,251,235,0.85) 100%);
      }
      
      .glass-card {
        background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-radius: 24px;
        border: 1px solid rgba(255,255,255,0.9);
        box-shadow: 
          0 16px 48px rgba(0,0,0,0.08),
          0 4px 16px rgba(0,0,0,0.04),
          inset 0 2px 4px rgba(255,255,255,1),
          inset 0 -1px 2px rgba(0,0,0,0.02);
        transition: all 0.3s ease;
      }
      .glass-card:hover {
        box-shadow: 
          0 20px 60px rgba(0,0,0,0.12),
          0 8px 24px rgba(0,0,0,0.06),
          inset 0 2px 4px rgba(255,255,255,1);
      }
      
      .glass-card-dark {
        background: linear-gradient(135deg, rgba(30,20,45,0.8) 0%, rgba(25,15,40,0.6) 100%);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-radius: 24px;
        border: 1px solid rgba(var(--accent-rgb, 139,92,246),0.2);
        box-shadow: 
          0 16px 48px rgba(0,0,0,0.3),
          0 4px 16px rgba(0,0,0,0.2),
          inset 0 1px 2px rgba(255,255,255,0.05),
          inset 0 -1px 2px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
      }
      .glass-card-dark:hover {
        box-shadow: 
          0 24px 64px rgba(0,0,0,0.4),
          0 8px 24px rgba(var(--accent-rgb, 139,92,246),0.15),
          inset 0 1px 2px rgba(255,255,255,0.08);
        border-color: rgba(var(--accent-rgb, 139,92,246),0.4);
      }
      
      .glass-input {
        padding: 14px 18px;
        background: rgba(255,255,255,0.6);
        border: 1px solid rgba(255,255,255,0.8);
        border-radius: 16px;
        color: #1c1917;
        font-size: 15px;
        outline: none;
        transition: all 0.3s ease;
        box-shadow: 
          inset 0 2px 4px rgba(0,0,0,0.02),
          0 2px 8px rgba(0,0,0,0.04);
      }
      .glass-input:focus {
        background: rgba(255,255,255,0.9);
        border-color: rgba(251,191,36,0.5);
        box-shadow: 
          0 0 0 4px rgba(251,191,36,0.15),
          inset 0 2px 4px rgba(0,0,0,0.02);
      }
      
      .glass-input-dark {
        padding: 14px 18px;
        background: rgba(41,37,36,0.6);
        border: 1px solid rgba(68,64,60,0.5);
        border-radius: 16px;
        color: #fafaf9;
        font-size: 15px;
        outline: none;
        transition: all 0.3s ease;
        box-shadow: 
          inset 0 2px 4px rgba(0,0,0,0.1),
          0 2px 8px rgba(0,0,0,0.1);
      }
      .glass-input-dark:focus {
        background: rgba(41,37,36,0.8);
        border-color: var(--accent-primary, #8b5cf6);
        box-shadow: 
          0 0 0 4px rgba(var(--accent-rgb, 139,92,246),0.15),
          inset 0 2px 4px rgba(0,0,0,0.1);
      }
      .glass-input-dark::placeholder {
        color: #78716c;
      }
      
      .glass-button {
        position: relative;
        padding: 14px 24px;
        background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%);
        border: 1px solid rgba(255,255,255,0.9);
        border-radius: 16px;
        color: #44403c;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 
          0 4px 16px rgba(0,0,0,0.06),
          inset 0 2px 4px rgba(255,255,255,1),
          inset 0 -2px 4px rgba(0,0,0,0.02);
      }
      .glass-button:hover {
        transform: translateY(-2px);
        box-shadow: 
          0 8px 24px rgba(0,0,0,0.1),
          inset 0 2px 4px rgba(255,255,255,1);
      }
      .glass-button:active {
        transform: translateY(0) scale(0.98);
      }
      
      .glass-button-primary {
        position: relative;
        padding: 14px 24px;
        background: var(--accent-gradient, linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%));
        border: none;
        border-radius: 16px;
        color: white;
        font-weight: 600;
        cursor: pointer;
        overflow: hidden;
        transition: all 0.3s ease;
        box-shadow: 
          0 4px 16px var(--accent-glow, rgba(139,92,246,0.4)),
          inset 0 2px 4px rgba(255,255,255,0.3),
          inset 0 -2px 4px rgba(0,0,0,0.1);
      }
      .glass-button-primary:hover {
        transform: translateY(-2px);
        box-shadow: 
          0 8px 24px var(--accent-glow, rgba(139,92,246,0.5)),
          inset 0 2px 4px rgba(255,255,255,0.3);
      }
      .glass-button-primary:active {
        transform: translateY(0) scale(0.98);
      }
      .glass-button-primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }
      
      .glass-button-danger {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        box-shadow: 
          0 4px 16px rgba(239,68,68,0.4),
          inset 0 2px 4px rgba(255,255,255,0.2);
      }
      .glass-button-danger:hover {
        box-shadow: 
          0 8px 24px rgba(239,68,68,0.5),
          inset 0 2px 4px rgba(255,255,255,0.2);
      }
      
      .glass-button-success {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        box-shadow: 
          0 4px 16px rgba(16,185,129,0.4),
          inset 0 2px 4px rgba(255,255,255,0.2);
      }
      .glass-button-success:hover {
        box-shadow: 
          0 8px 24px rgba(16,185,129,0.5),
          inset 0 2px 4px rgba(255,255,255,0.2);
      }
      
      .glass-stat-card {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 20px;
        background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%);
        border-radius: 20px;
        border: 1px solid rgba(255,255,255,0.9);
        box-shadow: 
          0 8px 32px rgba(0,0,0,0.06),
          inset 0 2px 4px rgba(255,255,255,1);
        transition: all 0.3s ease;
      }
      .glass-stat-card:hover {
        transform: translateY(-4px);
        box-shadow: 
          0 16px 48px rgba(0,0,0,0.1),
          inset 0 2px 4px rgba(255,255,255,1);
      }
      
      .glass-stat-card-dark {
        background: linear-gradient(135deg, rgba(41,37,36,0.9) 0%, rgba(28,25,23,0.8) 100%);
        border: 1px solid rgba(68,64,60,0.5);
        box-shadow: 
          0 8px 32px rgba(0,0,0,0.2),
          inset 0 1px 2px rgba(255,255,255,0.05);
      }
      .glass-stat-card-dark:hover {
        box-shadow: 
          0 16px 48px rgba(0,0,0,0.3),
          inset 0 1px 2px rgba(255,255,255,0.08);
        border-color: rgba(251,191,36,0.3);
      }
      
      .glass-icon {
        width: 56px;
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255,255,255,0.8);
        border-radius: 16px;
        border: 1px solid rgba(255,255,255,1);
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
      }
      
      .glass-icon-dark {
        background: rgba(41,37,36,0.8);
        border: 1px solid rgba(68,64,60,0.5);
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
      }
      
      .glass-tabs {
        display: flex;
        gap: 8px;
        padding: 8px;
        background: rgba(255,255,255,0.6);
        border-radius: 20px;
        border: 1px solid rgba(255,255,255,0.8);
        box-shadow: 0 4px 24px rgba(0,0,0,0.04);
        overflow-x: auto;
      }
      
      .glass-tabs-dark {
        background: rgba(28,25,23,0.6);
        border: 1px solid rgba(68,64,60,0.3);
        box-shadow: 0 4px 24px rgba(0,0,0,0.2);
      }
      
      .glass-tab {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        border-radius: 14px;
        font-weight: 500;
        color: #78716c;
        transition: all 0.3s ease;
        white-space: nowrap;
        border: 1px solid transparent;
      }
      .glass-tab:hover {
        background: rgba(255,255,255,0.6);
        color: #44403c;
      }
      .glass-tab.active {
        background: var(--accent-gradient, linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%));
        color: white;
        box-shadow: 
          0 4px 16px var(--accent-glow, rgba(139,92,246,0.4)),
          inset 0 2px 4px rgba(255,255,255,0.2);
      }
      
      .glass-tab-dark {
        color: #a8a29e;
      }
      .glass-tab-dark:hover {
        background: rgba(68,64,60,0.4);
        color: #e7e5e4;
      }
      .glass-tab-dark.active {
        background: var(--accent-gradient, linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%));
        color: white;
      }
      
      .glass-header {
        background: linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-bottom: 1px solid rgba(255,255,255,0.8);
        box-shadow: 0 4px 30px rgba(0,0,0,0.05);
      }
      
      .glass-header-dark {
        background: linear-gradient(to bottom, rgba(28,25,23,0.95) 0%, rgba(28,25,23,0.85) 100%);
        border-bottom: 1px solid rgba(68,64,60,0.3);
        box-shadow: 0 4px 30px rgba(0,0,0,0.2);
      }
      
      .glass-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 24px;
        height: 24px;
        padding: 0 8px;
        background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
        color: white;
        font-size: 12px;
        font-weight: 600;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(251,191,36,0.3);
      }
      
      .glass-badge-success {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        box-shadow: 0 2px 8px rgba(16,185,129,0.3);
      }
      
      .glass-badge-danger {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        box-shadow: 0 2px 8px rgba(239,68,68,0.3);
      }
      
      .glass-badge-info {
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        box-shadow: 0 2px 8px rgba(59,130,246,0.3);
      }
      
      .glass-select {
        appearance: none;
        padding: 14px 44px 14px 18px;
        background: rgba(41,37,36,0.6) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2378716c'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E") no-repeat right 14px center;
        background-size: 20px;
        border: 1px solid rgba(68,64,60,0.5);
        border-radius: 16px;
        color: #fafaf9;
        font-size: 15px;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .glass-select:focus {
        outline: none;
        border-color: rgba(251,191,36,0.5);
        box-shadow: 0 0 0 4px rgba(251,191,36,0.15);
      }
      
      .glass-table {
        border-collapse: separate;
        border-spacing: 0 8px;
      }
      .glass-table th {
        padding: 12px 16px;
        text-align: left;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #78716c;
      }
      .glass-table td {
        padding: 16px;
        background: rgba(41,37,36,0.4);
        border-top: 1px solid rgba(68,64,60,0.2);
        border-bottom: 1px solid rgba(68,64,60,0.2);
        transition: all 0.2s ease;
      }
      .glass-table td:first-child {
        border-left: 1px solid rgba(68,64,60,0.2);
        border-radius: 12px 0 0 12px;
      }
      .glass-table td:last-child {
        border-right: 1px solid rgba(68,64,60,0.2);
        border-radius: 0 12px 12px 0;
      }
      .glass-table tr:hover td {
        background: rgba(68,64,60,0.4);
      }
      
      .glass-modal-overlay {
        background: rgba(15,10,25,0.8);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }
      
      .glass-scrollbar::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      .glass-scrollbar::-webkit-scrollbar-track {
        background: rgba(139,92,246,0.1);
        border-radius: 4px;
      }
      .glass-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(139,92,246,0.4);
        border-radius: 4px;
      }
      .glass-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(139,92,246,0.6);
      }
      
      /* Purple Glassmorphism Dashboard Theme */
      .dashboard-bg {
        background: linear-gradient(135deg, #0f0a19 0%, #1a1025 25%, #1e1230 50%, #150d20 75%, #0d0815 100%);
        min-height: 100vh;
      }
      
      .glass-card-purple {
        background: linear-gradient(135deg, rgba(30,20,45,0.8) 0%, rgba(25,15,40,0.6) 100%);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-radius: 20px;
        border: 1px solid rgba(139,92,246,0.2);
        box-shadow: 
          0 8px 32px rgba(0,0,0,0.4),
          inset 0 1px 1px rgba(255,255,255,0.05);
        transition: all 0.3s ease;
      }
      .glass-card-purple:hover {
        border-color: rgba(139,92,246,0.4);
        box-shadow: 
          0 12px 40px rgba(139,92,246,0.15),
          0 8px 32px rgba(0,0,0,0.4),
          inset 0 1px 1px rgba(255,255,255,0.08);
      }
      
      .glass-card-gradient {
        background: linear-gradient(135deg, rgba(139,92,246,0.3) 0%, rgba(236,72,153,0.2) 50%, rgba(34,211,238,0.2) 100%);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-radius: 20px;
        border: 1px solid rgba(255,255,255,0.15);
        box-shadow: 0 8px 32px rgba(139,92,246,0.2);
      }
      
      .glass-input-purple {
        padding: 14px 18px;
        background: rgba(30,20,45,0.6);
        border: 1px solid rgba(139,92,246,0.3);
        border-radius: 12px;
        color: #f5f3ff;
        font-size: 15px;
        outline: none;
        transition: all 0.3s ease;
      }
      .glass-input-purple:focus {
        background: rgba(30,20,45,0.8);
        border-color: rgba(139,92,246,0.6);
        box-shadow: 0 0 0 4px rgba(139,92,246,0.15);
      }
      .glass-input-purple::placeholder {
        color: rgba(167,139,250,0.5);
      }
      
      .glass-button-purple {
        padding: 12px 24px;
        background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
        border: none;
        border-radius: 12px;
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 20px rgba(139,92,246,0.4);
      }
      .glass-button-purple:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(139,92,246,0.5);
      }
      
      .glass-button-gradient {
        padding: 12px 24px;
        background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #22d3ee 100%);
        background-size: 200% 200%;
        border: none;
        border-radius: 12px;
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 20px rgba(139,92,246,0.4);
      }
      .glass-button-gradient:hover {
        background-position: 100% 100%;
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(236,72,153,0.4);
      }
      
      .gradient-text {
        background: linear-gradient(135deg, #a78bfa 0%, #f472b6 50%, #22d3ee 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .gradient-border {
        position: relative;
        background: linear-gradient(135deg, rgba(30,20,45,0.9) 0%, rgba(25,15,40,0.8) 100%);
        border-radius: 20px;
      }
      .gradient-border::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 20px;
        padding: 1px;
        background: linear-gradient(135deg, rgba(139,92,246,0.5) 0%, rgba(236,72,153,0.3) 50%, rgba(34,211,238,0.3) 100%);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        pointer-events: none;
      }
      
      .glow-purple {
        box-shadow: 0 0 30px rgba(139,92,246,0.3);
      }
      .glow-pink {
        box-shadow: 0 0 30px rgba(236,72,153,0.3);
      }
      .glow-cyan {
        box-shadow: 0 0 30px rgba(34,211,238,0.3);
      }
      
      /* Stagger children animation */
      .stagger-children > * {
        animation: slide-up 0.4s ease-out backwards;
      }
      .stagger-children > *:nth-child(1) { animation-delay: 0ms; }
      .stagger-children > *:nth-child(2) { animation-delay: 50ms; }
      .stagger-children > *:nth-child(3) { animation-delay: 100ms; }
      .stagger-children > *:nth-child(4) { animation-delay: 150ms; }
      .stagger-children > *:nth-child(5) { animation-delay: 200ms; }
      .stagger-children > *:nth-child(6) { animation-delay: 250ms; }
      .stagger-children > *:nth-child(7) { animation-delay: 300ms; }
      .stagger-children > *:nth-child(8) { animation-delay: 350ms; }
      .stagger-children > *:nth-child(9) { animation-delay: 400ms; }
      .stagger-children > *:nth-child(10) { animation-delay: 450ms; }
    `}</style>
  );
}

// Utility function to get accent colors for each user type
const getAccentColor = (user) => {
  if (!user) return { primary: '#8b5cf6', glow: 'rgba(139,92,246,0.4)', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)', rgb: '139,92,246' };
  if (user.role === 'outlet') {
    switch (user.outlet) {
      case 'Santacruz': return { primary: '#f59e0b', glow: 'rgba(245,158,11,0.4)', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', rgb: '245,158,11' }; // Gold
      case 'Bandra': return { primary: '#10b981', glow: 'rgba(16,185,129,0.4)', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', rgb: '16,185,129' }; // Green
      case 'Oshiwara': return { primary: '#8b5cf6', glow: 'rgba(139,92,246,0.4)', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', rgb: '139,92,246' }; // Purple
      default: return { primary: '#8b5cf6', glow: 'rgba(139,92,246,0.4)', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)', rgb: '139,92,246' };
    }
  }
  if (user.role === 'central_kitchen') return { primary: '#eab308', glow: 'rgba(234,179,8,0.4)', gradient: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)', rgb: '234,179,8' }; // Yellow
  if (user.role === 'admin') return { primary: '#3b82f6', glow: 'rgba(59,130,246,0.4)', gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', rgb: '59,130,246' }; // Blue
  return { primary: '#8b5cf6', glow: 'rgba(139,92,246,0.4)', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)', rgb: '139,92,246' };
};

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
    <div className="glass-card-dark p-4 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
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
    updatedBy: row.updated_by,
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
        
        // Load data via REST API
        const [catData, itemData, orderData, userData, revData, counterData, stockOutData] = await Promise.all([
          supaRest.select('categories', { order: 'id' }),
          supaRest.select('items', { order: 'id' }),
          supaRest.select('orders', { order: 'created_at', ascending: false }),
          supaRest.select('users'),
          supaRest.select('revenue_data'),
          supaRest.select('order_counters'),
          supaRest.select('stock_out_history', { order: 'submitted_at', ascending: false }),
        ]);

        setCategories(catData.map(c => ({ id: c.id, name: c.name, description: c.description })));
        setItems(itemData.map(dbItemToApp));
        setOrders(orderData.map(dbOrderToApp));

        // Users: convert array to phone-keyed object
        const usersObj = {};
        userData.forEach(u => {
          usersObj[u.phone] = { role: u.role, outlet: u.outlet, name: u.name };
        });
        setUsers(usersObj);

        // Revenue: convert to nested object { outlet: { month: revenue } }
        const revObj = {};
        revData.forEach(r => {
          if (!revObj[r.outlet]) revObj[r.outlet] = {};
          revObj[r.outlet][r.month] = Number(r.revenue);
        });
        setRevenueData(revObj);

        // Counters
        const counterObj = {};
        counterData.forEach(c => { counterObj[c.outlet] = c.counter; });
        setOrderCounters(counterObj);

        // Stock out history: group by outlet
        const stockObj = {};
        stockOutData.forEach(s => {
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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  // ── POLLING FOR REALTIME (replaces broken Supabase realtime) ──
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const [orderData, itemData, stockOutData] = await Promise.all([
          supaRest.select('orders', { order: 'created_at', ascending: false }),
          supaRest.select('items', { order: 'id' }),
          supaRest.select('stock_out_history', { order: 'submitted_at', ascending: false }),
        ]);
        setOrders(orderData.map(dbOrderToApp));
        setItems(itemData.map(dbItemToApp));
        
        const stockObj = {};
        stockOutData.forEach(s => {
          if (!stockObj[s.outlet]) stockObj[s.outlet] = [];
          stockObj[s.outlet].push({
            id: s.id, effectiveDate: s.effective_date, submittedAt: s.submitted_at,
            submittedBy: s.submitted_by, items: s.items || [], outlet: s.outlet,
          });
        });
        setStockOutHistory(stockObj);
      } catch (e) { console.error('Poll error:', e); }
    }, 5000);
    return () => clearInterval(pollInterval);
  }, []);

  // ── DATA OPERATIONS (write to Supabase via REST) ──

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
      updated_by: item.updatedBy || null,
    }));
    
    const { error } = await getSupabase().from('items').upsert(rows, { onConflict: 'id' });
    try {
      await supaRest.upsert('items', rows, 'id');
    } catch (e) { console.error('Update items error:', e); }
    setItems(newItems);
  };

  const updateRevenueDataFn = async (newRevenueData) => {
    // Update each revenue entry individually using PATCH
    try {
      for (const [outlet, months] of Object.entries(newRevenueData)) {
        for (const [month, revenue] of Object.entries(months)) {
          const url = `${REST_URL}/revenue_data?outlet=eq.${encodeURIComponent(outlet)}&month=eq.${month}`;
          const res = await fetch(url, {
            method: 'PATCH',
            headers: { ...supaHeaders, 'Accept': 'application/json', 'Prefer': 'return=representation' },
            body: JSON.stringify({ revenue: Number(revenue) }),
          });
          if (!res.ok) {
            const errText = await res.text();
            console.error('Update revenue error:', errText);
          }
        }
      }
      console.log('Revenue saved successfully');
    } catch (e) { 
      console.error('Update revenue error:', e);
      alert('Failed to save revenue: ' + e.message);
    }
    setRevenueData(newRevenueData);
  };

  const updateCategories = async (newCategories) => {
    // Find new categories (no id or high id) to insert, existing to update
    for (const cat of newCategories) {
      const row = { name: cat.name, description: cat.description || '' };
      try {
        if (cat.id) {
          await supaRest.upsert('categories', { id: cat.id, ...row }, 'id');
        } else {
          const data = await supaRest.insert('categories', row);
          if (data && data[0]) cat.id = data[0].id;
        }
      } catch (e) { console.error('Update categories error:', e); }
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
    
    try {
      await supaRest.insert('stock_out_history', row);
    } catch (e) { console.error('Stock out insert error:', e); }
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
    const counterData = await supaRest.select('order_counters', { eq: { outlet: order.outlet } });
    const newCounter = (counterData?.[0]?.counter || 0) + 1;
    const orderId = `${prefix}${String(newCounter).padStart(4, '0')}`;
    
    // Update counter
    try {
      await supaRest.update('order_counters', { counter: newCounter }, { outlet: order.outlet });
    } catch (e) { console.error('Update counter error:', e); }
    
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
    
    try {
      await supaRest.insert('orders', row);
    } catch (e) { console.error('Insert order error:', e); }
  };

  const updateOrderStatus = async (orderId, status, additionalData = {}) => {
    const updates = { status };
    if (additionalData.dispatchedAt) updates.dispatched_at = additionalData.dispatchedAt;
    if (additionalData.dispatchedBy) updates.dispatched_by = additionalData.dispatchedBy;
    if (additionalData.acceptedAt) updates.accepted_at = additionalData.acceptedAt;
    if (additionalData.acceptedBy) updates.accepted_by = additionalData.acceptedBy;
    if (additionalData.completedAt) updates.completed_at = additionalData.completedAt;
    if (additionalData.dispute) updates.dispute = additionalData.dispute;
    
    try {
      await supaRest.update('orders', updates, { id: orderId });
    } catch (e) { console.error('Update order status error:', e); }
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
    
    try {
      await supaRest.update('orders', dbUpdates, { id: orderId });
    } catch (e) { console.error('Update order error:', e); }
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

  const accent = getAccentColor(currentUser);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0f0a19 0%, #1a1025 25%, #1e1230 50%, #150d20 75%, #0d0815 100%)',
      '--accent-gradient': accent.gradient,
      '--accent-glow': accent.glow,
      '--accent-primary': accent.primary,
      '--accent-rgb': accent.rgb
    }}>
      {/* Animated background blobs - colored based on user */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl animate-blob" style={{ background: `rgba(${accent.rgb},0.15)` }}></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 rounded-full blur-3xl animate-blob animation-delay-2000" style={{ background: `rgba(${accent.rgb},0.1)` }}></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full blur-3xl animate-blob animation-delay-4000" style={{ background: `rgba(${accent.rgb},0.08)` }}></div>
      </div>
      <GlobalStyles />
      <Header user={currentUser} onLogout={handleLogout} accent={accent} />
      <main className="relative max-w-7xl mx-auto px-4 py-6">
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
            accent={accent}
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
            globalStockOutHistory={stockOutHistory}
            accent={accent}
          />
        )}
        {currentUser.role === 'admin' && (
          <AdminDashboard 
            data={{ ...data, stockOutHistory }}
            onUpdateItems={updateItems}
            onUpdateRevenueData={updateRevenueDataFn}
            accent={accent}
          />
        )}
      </main>
    </div>
  );
}

// ============================================
// LOGIN SCREEN - Ribbon Style Design
// ============================================
function LoginScreen({ users, onLogin }) {
  const [selectedPhone, setSelectedPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifyingLocation, setIsVerifyingLocation] = useState(false);

  // Outlet coordinates
  const outletCoordinates = {
    'Bandra': { lat: 19.056270092585304, lng: 72.83468181333015 },
    'Santacruz': { lat: 19.077778732891147, lng: 72.83803091516391 },
    'Oshiwara': { lat: 19.148278915321782, lng: 72.83166328691618 },
  };

  // Password map for each user type
  const passwords = {
    'Bandra': 'Y0koBandra@50',
    'Santacruz': 'Yok0Cruz@54',
    'Oshiwara': 'Y0k0Oshi@102',
    'Central Kitchen': 'YokoCK@49',
    'Admin': 'ysp2025#YOKO',
  };

  // Accent colors for each user type
  const getAccentColor = (user) => {
    if (!user) return { primary: '#8b5cf6', glow: 'rgba(139,92,246,0.4)', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)' };
    if (user.role === 'outlet') {
      switch (user.outlet) {
        case 'Santacruz': return { primary: '#f59e0b', glow: 'rgba(245,158,11,0.4)', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }; // Gold
        case 'Bandra': return { primary: '#10b981', glow: 'rgba(16,185,129,0.4)', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }; // Green
        case 'Oshiwara': return { primary: '#8b5cf6', glow: 'rgba(139,92,246,0.4)', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }; // Purple
        default: return { primary: '#8b5cf6', glow: 'rgba(139,92,246,0.4)', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)' };
      }
    }
    if (user.role === 'central_kitchen') return { primary: '#eab308', glow: 'rgba(234,179,8,0.4)', gradient: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)' }; // Yellow
    if (user.role === 'admin') return { primary: '#3b82f6', glow: 'rgba(59,130,246,0.4)', gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }; // Blue
    return { primary: '#8b5cf6', glow: 'rgba(139,92,246,0.4)', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)' };
  };

  const userList = Object.entries(users).map(([phone, data]) => ({
    phone,
    ...data,
    displayName: data.role === 'outlet' ? `${data.outlet} Outlet` : 
                 data.role === 'central_kitchen' ? 'Central Kitchen' : 'Admin'
  }));

  const selectedUser = selectedPhone ? users[selectedPhone] : null;
  const accent = getAccentColor(selectedUser);

  // Calculate distance between two coordinates in meters (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleLogin = async () => {
    if (!selectedPhone) {
      setError('Please select a user to login');
      return;
    }
    
    const user = users[selectedPhone];
    const masterPassword = passwords['Admin'];
    let expectedPassword = '';
    
    if (user.role === 'outlet') {
      expectedPassword = passwords[user.outlet];
    } else if (user.role === 'central_kitchen') {
      expectedPassword = passwords['Central Kitchen'];
    } else if (user.role === 'admin') {
      expectedPassword = passwords['Admin'];
    }
    
    const usingMasterPassword = password === masterPassword;
    
    if (password !== expectedPassword && !usingMasterPassword) {
      setError('Incorrect password');
      return;
    }

    // GPS verification only for outlet users AND not using master password
    if (user.role === 'outlet' && !usingMasterPassword) {
      setIsVerifyingLocation(true);
      setError('');
      
      try {
        const position = await new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported'));
            return;
          }
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          });
        });

        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const outletCoords = outletCoordinates[user.outlet];
        
        if (!outletCoords) {
          setError('Outlet location not configured');
          setIsVerifyingLocation(false);
          return;
        }

        const distance = calculateDistance(userLat, userLng, outletCoords.lat, outletCoords.lng);
        const maxDistance = 30;

        if (distance > maxDistance) {
          setError(`You must be at ${user.outlet} outlet to login. You are ${Math.round(distance)}m away.`);
          setIsVerifyingLocation(false);
          return;
        }

        setIsVerifyingLocation(false);
        onLogin(selectedPhone, users[selectedPhone]);
        
      } catch (geoError) {
        setIsVerifyingLocation(false);
        if (geoError.code === 1) {
          setError('Location access denied. Please enable location services.');
        } else if (geoError.code === 2) {
          setError('Unable to determine location. Please try again.');
        } else if (geoError.code === 3) {
          setError('Location request timed out. Please try again.');
        } else {
          setError(geoError.message || 'Location verification failed');
        }
      }
    } else {
      onLogin(selectedPhone, users[selectedPhone]);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f0a19 0%, #1a1025 25%, #1e1230 50%, #150d20 75%, #0d0815 100%)'
      }}
    >
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{ background: accent.glow, opacity: 0.3 }}
        ></div>
        <div 
          className="absolute bottom-40 right-20 w-80 h-80 rounded-full blur-3xl animate-pulse"
          style={{ background: 'rgba(236,72,153,0.15)', animationDelay: '1s' }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full blur-3xl animate-pulse"
          style={{ background: 'rgba(34,211,238,0.1)', animationDelay: '2s' }}
        ></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div 
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 transition-all duration-500"
            style={{
              background: accent.gradient,
              boxShadow: `0 0 40px ${accent.glow}`
            }}
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>YOKO SIZZLERS</h1>
          <p className="text-violet-400/50 mt-2 text-sm">Purchase Order System</p>
        </div>

        {/* Login Card */}
        <div 
          className="p-6 rounded-2xl backdrop-blur-xl transition-all duration-500"
          style={{
            background: 'linear-gradient(135deg, rgba(30,20,45,0.8) 0%, rgba(25,15,40,0.6) 100%)',
            border: `1px solid ${selectedPhone ? accent.primary + '40' : 'rgba(139,92,246,0.2)'}`,
            boxShadow: selectedPhone ? `0 8px 32px ${accent.glow}` : '0 8px 32px rgba(0,0,0,0.3)'
          }}
        >
          <h2 className="text-xl font-semibold text-white mb-6">Sign In</h2>
          
          <div className="space-y-4">
            {/* User Select */}
            <div>
              <label className="block text-sm text-violet-300/70 mb-2">Select User</label>
              <select
                value={selectedPhone}
                onChange={(e) => { setSelectedPhone(e.target.value); setError(''); setPassword(''); }}
                className="w-full px-4 py-3 rounded-xl text-white outline-none transition-all cursor-pointer"
                style={{
                  background: 'rgba(30,20,45,0.6)',
                  border: `1px solid ${selectedPhone ? accent.primary + '50' : 'rgba(139,92,246,0.3)'}`,
                }}
              >
                <option value="">-- Select User --</option>
                {userList.map(user => (
                  <option key={user.phone} value={user.phone}>
                    {user.displayName} ({user.name})
                  </option>
                ))}
              </select>
            </div>
            
            {/* Password Input */}
            {selectedPhone && (
              <div>
                <label className="block text-sm text-violet-300/70 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 rounded-xl text-white placeholder-violet-400/30 outline-none transition-all pr-12"
                    style={{
                      background: 'rgba(30,20,45,0.6)',
                      border: `1px solid ${accent.primary}30`,
                    }}
                    onFocus={(e) => e.target.style.borderColor = accent.primary + '60'}
                    onBlur={(e) => e.target.style.borderColor = accent.primary + '30'}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-violet-400/50 hover:text-violet-300 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <p className="text-rose-400 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            )}

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={!selectedPhone || !password || isVerifyingLocation}
              className={`w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${
                (!selectedPhone || !password || isVerifyingLocation) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:-translate-y-0.5 active:scale-[0.98]'
              }`}
              style={{
                background: accent.gradient,
                boxShadow: (!selectedPhone || !password || isVerifyingLocation) ? 'none' : `0 4px 20px ${accent.glow}`
              }}
            >
              {isVerifyingLocation ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Verifying Location...
                </>
              ) : (
                <>
                  Login
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
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
function Header({ user, onLogout, accent }) {
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
    <header className="sticky top-0 z-50" style={{
      background: 'linear-gradient(135deg, rgba(30,20,45,0.95) 0%, rgba(20,15,35,0.9) 100%)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${accent.primary}30`,
      boxShadow: '0 4px 30px rgba(0,0,0,0.3)'
    }}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{
                background: accent.gradient,
                boxShadow: `0 0 30px ${accent.glow}`
              }}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>YOKO SIZZLERS</h1>
                <p className="text-xs" style={{ color: `${accent.primary}90` }}>Purchase Orders</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{
              background: `rgba(${accent.rgb},0.2)`,
              color: accent.primary,
              border: `1px solid ${accent.primary}40`
            }}>
              {badge.label}
            </span>
            <div className="hidden sm:block text-right">
              <p className="text-sm text-white font-medium">{user.name}</p>
              <p className="text-xs" style={{ color: `${accent.primary}80` }}>+91 {user.phone}</p>
            </div>
            <button
              onClick={onLogout}
              className="p-2.5 rounded-xl transition-all hover:scale-105"
              style={{
                background: `rgba(${accent.rgb},0.1)`,
                border: `1px solid ${accent.primary}30`,
                color: `${accent.primary}90`
              }}
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
function OutletDashboard({ user, items, categories, orders, onAddOrder, onUpdateOrderStatus, onUpdateStockOut, globalStockOutHistory, accent }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [orderStep, setOrderStep] = useState('categories'); // 'categories' | 'items'
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [cart, setCart] = useState([]);
  const [showOrderPage, setShowOrderPage] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [lastOrderId, setLastOrderId] = useState(null);
  const [showAISuggestions, setShowAISuggestions] = useState(true);
  
  // Invoice Search state
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState('');
  const [invoiceSearchResults, setInvoiceSearchResults] = useState([]);
  
  // Item Search state (for placing orders)
  const [itemSearchQuery, setItemSearchQuery] = useState('');
  
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

  // Check if stock out can be submitted (10pm to 2am IST window)
  const canSubmitStockOut = () => {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istNow = new Date(now.getTime() + istOffset);
    const hours = istNow.getUTCHours();
    const minutes = istNow.getUTCMinutes();
    
    // Window: 10pm (22:00) to 2am (02:00) IST
    // Hours 22, 23, 0, 1 are valid (before 2am)
    const isInWindow = hours >= 22 || hours < 2;
    
    // Calculate effective date (the business day we're submitting for)
    // Before 2am = yesterday's date, After 2am = today's date
    const effectiveDate = hours < 2 
      ? new Date(istNow.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      : istNow.toISOString().split('T')[0];
    
    // Check if already submitted for this effective date
    const alreadySubmitted = stockOutHistory.some(entry => entry.effectiveDate === effectiveDate);
    
    // Calculate time until window opens (if before 10pm)
    let timeUntilOpen = null;
    if (hours < 22 && hours >= 2) {
      const hoursUntil = 22 - hours - 1;
      const minsUntil = 60 - minutes;
      timeUntilOpen = `${hoursUntil}h ${minsUntil}m`;
    }
    
    // Calculate time until deadline (if in window)
    let timeUntilDeadline = null;
    if (isInWindow && !alreadySubmitted) {
      if (hours >= 22) {
        // Between 10pm and midnight
        const hoursUntil = (24 - hours) + 2 - 1;
        const minsUntil = 60 - minutes;
        timeUntilDeadline = `${hoursUntil}h ${minsUntil}m`;
      } else {
        // Between midnight and 2am
        const hoursUntil = 2 - hours - 1;
        const minsUntil = 60 - minutes;
        timeUntilDeadline = `${hoursUntil}h ${minsUntil}m`;
      }
    }
    
    // Format current IST time
    const currentTimeIST = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} IST`;
    
    return { 
      canSubmit: isInWindow && !alreadySubmitted, 
      effectiveDate, 
      alreadySubmitted,
      isInWindow,
      timeUntilOpen,
      timeUntilDeadline,
      currentTimeIST,
      windowStart: '10:00 PM',
      windowEnd: '2:00 AM'
    };
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
                setItemSearchQuery('');
              } else {
                setShowOrderPage(false);
                setCart([]);
                setItemSearchQuery('');
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

        {/* Item Search Bar */}
        <div className="bg-stone-900/50 border border-stone-800/50 rounded-xl p-3 mb-4">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={itemSearchQuery}
              onChange={(e) => setItemSearchQuery(e.target.value)}
              placeholder="Search items across all categories..."
              className="flex-1 bg-transparent text-white placeholder-stone-500 outline-none"
            />
            {itemSearchQuery && (
              <button onClick={() => setItemSearchQuery('')} className="text-stone-500 hover:text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        {itemSearchQuery.trim() && (
          <div className="bg-stone-900/50 border border-amber-500/30 rounded-2xl p-4 mb-4">
            <p className="text-sm text-amber-400 mb-3">Search results for "{itemSearchQuery}"</p>
            {(() => {
              const searchResults = items.filter(item => 
                item.name.toLowerCase().includes(itemSearchQuery.toLowerCase())
              );
              if (searchResults.length === 0) {
                return <p className="text-stone-500 text-center py-4">No items found</p>;
              }
              return (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {searchResults.map(item => {
                    const inCart = cart.find(c => c.id === item.id);
                    return (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-stone-800/50 rounded-xl">
                        <div>
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-xs text-stone-500">{getCategoryName(item.categoryId)} • {formatCurrency(item.price)}/{item.unit}</p>
                        </div>
                        {inCart ? (
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateCartQuantity(item.id, inCart.quantity - 1)} className="w-8 h-8 bg-stone-700 text-white rounded-lg hover:bg-stone-600">-</button>
                            <span className="w-12 text-center text-white font-medium">{inCart.quantity}</span>
                            <button onClick={() => updateCartQuantity(item.id, inCart.quantity + 1)} className="w-8 h-8 bg-amber-500 text-white rounded-lg hover:bg-amber-600">+</button>
                          </div>
                        ) : (
                          <button onClick={() => addToCart(item)} className="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600">Add</button>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {orderStep === 'categories' ? (
              /* CATEGORY SELECTION */
              <div className="glass-card-dark p-6">
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
                          setItemSearchQuery('');
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
              <div className="glass-card-dark p-6">
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
            <div className="glass-card-dark p-4 sticky top-4">
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
      <div className="glass-card-dark p-2 flex gap-1 overflow-x-auto">
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
            <div className="glass-card-dark p-6">
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
            <div className="glass-card-dark p-6">
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
          <div className="glass-card-dark p-6">
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
        <div className="glass-card-dark overflow-hidden">
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
            const { canSubmit, effectiveDate, alreadySubmitted, isInWindow, timeUntilOpen, timeUntilDeadline, currentTimeIST, windowStart, windowEnd } = canSubmitStockOut();
            const todayEntry = stockOutHistory.find(e => e.effectiveDate === effectiveDate);

            return (
              <>
                {/* Time Window Info Card */}
                <div 
                  className="border rounded-2xl p-6"
                  style={{
                    background: alreadySubmitted 
                      ? 'rgba(16,185,129,0.1)' 
                      : isInWindow 
                        ? `rgba(${accent.rgb},0.1)` 
                        : 'rgba(239,68,68,0.1)',
                    borderColor: alreadySubmitted 
                      ? 'rgba(16,185,129,0.3)' 
                      : isInWindow 
                        ? `rgba(${accent.rgb},0.3)` 
                        : 'rgba(239,68,68,0.3)'
                  }}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">
                      {alreadySubmitted ? '✅' : isInWindow ? '📤' : '🔒'}
                    </span>
                    <div className="flex-1">
                      <h3 
                        className="text-lg font-semibold"
                        style={{ 
                          color: alreadySubmitted 
                            ? '#34d399' 
                            : isInWindow 
                              ? accent.primary 
                              : '#f87171' 
                        }}
                      >
                        {alreadySubmitted 
                          ? 'Stock Out Submitted' 
                          : isInWindow 
                            ? 'Daily Stock Out Entry' 
                            : 'Stock Out Window Closed'}
                      </h3>
                      <p className="text-sm text-stone-400 mt-1">
                        {alreadySubmitted 
                          ? `Stock out for ${effectiveDate} was submitted at ${todayEntry ? formatDate(todayEntry.submittedAt) : ''}`
                          : isInWindow
                            ? `Enter remaining stock for ${effectiveDate}. Submit before deadline.`
                            : `Stock out can only be submitted between ${windowStart} and ${windowEnd} IST`
                        }
                      </p>
                      
                      {/* Time Display */}
                      <div className="flex flex-wrap items-center gap-4 mt-4">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-800/50">
                          <span className="text-stone-500 text-sm">Current Time:</span>
                          <span className="text-white font-mono font-medium">{currentTimeIST}</span>
                        </div>
                        
                        {!alreadySubmitted && (
                          <>
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-800/50">
                              <span className="text-stone-500 text-sm">Window:</span>
                              <span className="font-medium" style={{ color: accent.primary }}>{windowStart}</span>
                              <span className="text-stone-500">→</span>
                              <span className="text-red-400 font-medium">{windowEnd}</span>
                            </div>
                            
                            {isInWindow && timeUntilDeadline && (
                              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30">
                                <span className="text-red-400 text-sm">⏰ Deadline in:</span>
                                <span className="text-red-400 font-mono font-bold">{timeUntilDeadline}</span>
                              </div>
                            )}
                            
                            {!isInWindow && timeUntilOpen && (
                              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: `rgba(${accent.rgb},0.1)`, border: `1px solid rgba(${accent.rgb},0.3)` }}>
                                <span className="text-sm" style={{ color: accent.primary }}>🕙 Opens in:</span>
                                <span className="font-mono font-bold" style={{ color: accent.primary }}>{timeUntilOpen}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      
                      <p className="text-xs text-stone-500 mt-3">
                        ⚠️ Stock out can only be submitted once per day between {windowStart} - {windowEnd} IST and cannot be edited after submission.
                      </p>
                    </div>
                  </div>
                </div>

                {alreadySubmitted && todayEntry ? (
                  /* Show submitted data */
                  <div className="glass-card-dark overflow-hidden">
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
                ) : !isInWindow ? (
                  /* Window Closed Message */
                  <div className="glass-card-dark p-8 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                      <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Submission Window Closed</h3>
                    <p className="text-stone-400 mb-4">
                      Stock out entries can only be submitted between <span className="font-semibold" style={{ color: accent.primary }}>{windowStart}</span> and <span className="text-red-400 font-semibold">{windowEnd} IST</span>
                    </p>
                    {timeUntilOpen && (
                      <p className="text-stone-500">
                        Window opens in <span className="font-mono font-bold" style={{ color: accent.primary }}>{timeUntilOpen}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  /* Stock Out Entry Form */
                  <div className="glass-card-dark overflow-hidden">
                    <div className="p-4 bg-stone-800/30 border-b border-stone-800/50 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">Enter Remaining Stock</h3>
                        <p className="text-sm text-stone-400">Enter the quantity remaining for each item at end of day</p>
                      </div>
                      {timeUntilDeadline && (
                        <div className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30">
                          <p className="text-xs text-red-400">Deadline in</p>
                          <p className="text-lg font-mono font-bold text-red-400">{timeUntilDeadline}</p>
                        </div>
                      )}
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
                <div className="glass-card-dark overflow-hidden">
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
          <div className="glass-card-dark p-4">
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
          <div className="glass-card-dark p-6">
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
          <div className="glass-card-dark overflow-hidden">
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
              className="px-4 py-2 glass-button-primary glass-button-success transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Order
            </button>
          </div>
          
          {/* Invoice Search */}
          <div className="bg-stone-900/50 border border-stone-800/50 rounded-xl p-4">
            <h4 className="text-amber-400 font-medium mb-3 flex items-center gap-2">
              <span>🔍</span> Invoice Search
            </h4>
            <div className="flex gap-3">
              <input
                type="text"
                value={invoiceSearchQuery}
                onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                placeholder="Search by Order ID..."
                className="flex-1 glass-input-dark placeholder-stone-500 text-sm"
              />
              <button
                onClick={() => {
                  const q = invoiceSearchQuery.trim().toUpperCase();
                  if (!q) { setInvoiceSearchResults([]); return; }
                  const results = orders.filter(o => o.id.toUpperCase().includes(q));
                  setInvoiceSearchResults(results);
                }}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium text-sm hover:bg-amber-600 transition-all"
              >
                Search
              </button>
            </div>
            
            {invoiceSearchResults.length > 0 && (
              <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                {invoiceSearchResults.map(order => (
                  <div key={order.id} className="bg-stone-800/50 rounded-lg p-3 border border-stone-700/30">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium text-sm">{order.id}</span>
                        <span className={`px-2 py-0.5 text-xs rounded-lg ${
                          order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          order.status === 'dispatched' ? 'bg-blue-500/20 text-blue-400' :
                          order.status === 'delivered' || order.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                          order.status === 'disputed' ? 'bg-red-500/20 text-red-400' : 'bg-stone-700 text-stone-400'
                        }`}>{order.status}</span>
                      </div>
                      <span className="text-amber-400 font-semibold text-sm">{formatCurrency(order.totalAmount)}</span>
                    </div>
                    <p className="text-xs text-stone-500">{formatDate(order.createdAt)}</p>
                    <div className="mt-2 text-xs text-stone-400">
                      {order.items.map((item, idx) => (
                        <span key={idx}>{idx > 0 ? ', ' : ''}{item.name} ({item.quantity} {item.unit})</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {invoiceSearchQuery && invoiceSearchResults.length === 0 && (
              <p className="text-stone-500 text-sm text-center mt-3">No orders found</p>
            )}
          </div>
          
          <OrderHistory orders={orders} showOutlet={false} />
        </div>
      )}

      {/* MONTHLY TAB */}
      {activeTab === 'monthly' && (
        <div className="space-y-6">
          <div className="glass-card-dark p-6">
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
function CentralKitchenDashboard({ user, items, categories, orders, revenueData, onUpdateItems, onUpdateCategories, onUpdateOrderStatus, onUpdateOrder, globalStockOutHistory, accent }) {
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
  
  // Invoice Search state
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState('');
  const [invoiceSearchResults, setInvoiceSearchResults] = useState([]);
  
  // Stock Difference Report state
  const [stockDiffPeriod, setStockDiffPeriod] = useState('today');
  const [stockDiffOutlet, setStockDiffOutlet] = useState('All');
  const [stockDiffItemFilter, setStockDiffItemFilter] = useState('');
  
  // Clickable summary state
  const [summaryFilter, setSummaryFilter] = useState(null);
  const [expandedOutlet, setExpandedOutlet] = useState(null);
  
  // Global Item Search with Analysis
  const [globalItemSearch, setGlobalItemSearch] = useState('');
  const [selectedAnalysisItem, setSelectedAnalysisItem] = useState(null);
  
  // Item editing state (unit, packaging, weight)
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingItemData, setEditingItemData] = useState({ unit: '', pkg: '', wt: '' });
  
  // PDF Price Extraction state
  const [showPdfExtractor, setShowPdfExtractor] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfExtracting, setPdfExtracting] = useState(false);
  const [pdfExtractedPrices, setPdfExtractedPrices] = useState([]);
  const [pdfExtractError, setPdfExtractError] = useState(null);
  const [pdfMatchedItems, setPdfMatchedItems] = useState([]);
  
  // Custom metrics (stored in localStorage, can be added by CK)
  const [unitOptions, setUnitOptions] = useState(() => {
    const saved = localStorage.getItem('yokoUnitOptions');
    return saved ? JSON.parse(saved) : ['kg', 'litre', 'piece', 'bundle'];
  });
  const [packagingOptions, setPackagingOptions] = useState(() => {
    const saved = localStorage.getItem('yokoPackagingOptions');
    return saved ? JSON.parse(saved) : ['tin', 'bottle', 'piece', 'loose', 'box', 'can', 'packet', 'bag'];
  });
  const [showAddUnit, setShowAddUnit] = useState(false);
  const [showAddPackaging, setShowAddPackaging] = useState(false);
  const [newUnitOption, setNewUnitOption] = useState('');
  const [newPackagingOption, setNewPackagingOption] = useState('');
  
  // Save custom metrics to localStorage when changed
  useEffect(() => {
    localStorage.setItem('yokoUnitOptions', JSON.stringify(unitOptions));
  }, [unitOptions]);
  
  useEffect(() => {
    localStorage.setItem('yokoPackagingOptions', JSON.stringify(packagingOptions));
  }, [packagingOptions]);
  
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

  // Save item unit, packaging, weight changes
  const saveItemDetails = (itemId) => {
    onUpdateItems(items.map(item => 
      item.id === itemId ? {
        ...item,
        unit: editingItemData.unit || item.unit,
        pkg: editingItemData.pkg || item.pkg || '',
        wt: parseFloat(editingItemData.wt) || item.wt || 1,
      } : item
    ));
    setEditingItemId(null);
    setEditingItemData({ unit: '', pkg: '', wt: '' });
  };

  // Start editing an item
  const startEditingItem = (item) => {
    setEditingItemId(item.id);
    setEditingItemData({
      unit: item.unit || 'kg',
      pkg: item.pkg || '',
      wt: item.wt || 1,
    });
  };

  // Add new unit option
  const addUnitOption = () => {
    if (newUnitOption.trim() && !unitOptions.includes(newUnitOption.trim().toLowerCase())) {
      setUnitOptions([...unitOptions, newUnitOption.trim().toLowerCase()]);
      setNewUnitOption('');
      setShowAddUnit(false);
    }
  };

  // Add new packaging option
  const addPackagingOption = () => {
    if (newPackagingOption.trim() && !packagingOptions.includes(newPackagingOption.trim().toLowerCase())) {
      setPackagingOptions([...packagingOptions, newPackagingOption.trim().toLowerCase()]);
      setNewPackagingOption('');
      setShowAddPackaging(false);
    }
  };

  // PDF Price Extraction with AI
  const extractPricesFromPdf = async () => {
    if (!pdfFile) return;
    
    setPdfExtracting(true);
    setPdfExtractError(null);
    setPdfExtractedPrices([]);
    setPdfMatchedItems([]);
    
    try {
      // Read PDF as base64
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = () => reject(new Error('Failed to read PDF'));
        reader.readAsDataURL(pdfFile);
      });
      
      // Create item list for matching
      const itemList = items.map(i => ({ id: i.id, name: i.name, currentPrice: i.price, unit: i.unit }));
      
      // Call Claude API for extraction
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          messages: [{
            role: 'user',
            content: [
              {
                type: 'document',
                source: { type: 'base64', media_type: 'application/pdf', data: base64Data }
              },
              {
                type: 'text',
                text: `Extract all item prices from this vendor invoice/price list PDF. 

Here are our inventory items to match against:
${JSON.stringify(itemList, null, 2)}

For each price you find in the PDF, try to match it to one of our inventory items by name (fuzzy match is OK - e.g., "Chicken Breast" matches "Boneless Chicken Breast").

Return ONLY a JSON array with this format, no other text:
[
  {
    "pdfItemName": "exact name from PDF",
    "pdfPrice": 123.45,
    "pdfUnit": "kg or piece or unit from PDF",
    "matchedItemId": 123 or null if no match,
    "matchedItemName": "our item name" or null,
    "confidence": "high" or "medium" or "low"
  }
]

If you cannot extract prices or the PDF is not a price list, return: []`
              }
            ]
          }]
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      const text = data.content?.[0]?.text || '[]';
      
      // Parse JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const extracted = JSON.parse(jsonMatch[0]);
        setPdfExtractedPrices(extracted);
        
        // Create matched items list for review
        const matched = extracted
          .filter(e => e.matchedItemId)
          .map(e => ({
            ...e,
            currentItem: items.find(i => i.id === e.matchedItemId),
            selected: true,
          }));
        setPdfMatchedItems(matched);
      } else {
        setPdfExtractError('Could not extract prices from this PDF. Make sure it contains a price list or invoice.');
      }
    } catch (err) {
      console.error('PDF extraction error:', err);
      // Check if it's a CORS/network error
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setPdfExtractError('Cannot connect to AI service. This feature requires an API key to be configured. Please update prices manually for now.');
      } else {
        setPdfExtractError(err.message || 'Failed to process PDF');
      }
    } finally {
      setPdfExtracting(false);
    }
  };

  // Apply extracted prices to items
  const applyExtractedPrices = () => {
    const selectedMatches = pdfMatchedItems.filter(m => m.selected && m.matchedItemId);
    if (selectedMatches.length === 0) return;
    
    const updatedItems = items.map(item => {
      const match = selectedMatches.find(m => m.matchedItemId === item.id);
      if (match) {
        const newPrice = match.pdfPrice;
        const previousPrice = item.price;
        const priceChange = newPrice - previousPrice;
        const priceChangePercent = previousPrice > 0 ? ((priceChange / previousPrice) * 100) : 0;
        
        return {
          ...item,
          price: newPrice,
          lastUpdated: new Date().toISOString(),
          updatedBy: 'PDF Import',
          previousPrice: previousPrice,
          priceChange: priceChange,
          priceChangePercent: priceChangePercent,
          priceHistory: [
            ...(item.priceHistory || []),
            {
              price: previousPrice,
              changedAt: new Date().toISOString(),
              changedTo: newPrice,
              changedBy: 'PDF Import'
            }
          ].slice(-10)
        };
      }
      return item;
    });
    
    onUpdateItems(updatedItems);
    
    // Reset state
    setShowPdfExtractor(false);
    setPdfFile(null);
    setPdfExtractedPrices([]);
    setPdfMatchedItems([]);
    alert(`Updated prices for ${selectedMatches.length} item(s)`);
  };

  // Toggle match selection
  const toggleMatchSelection = (index) => {
    setPdfMatchedItems(prev => prev.map((m, i) => 
      i === index ? { ...m, selected: !m.selected } : m
    ));
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
        updatedBy: user.name || 'Central Kitchen',
        previousPrice: previousPrice,
        priceChange: priceChange,
        priceChangePercent: priceChangePercent,
        priceHistory: [
          ...(item.priceHistory || []),
          {
            price: previousPrice,
            changedAt: new Date().toISOString(),
            changedTo: price,
            changedBy: user.name || 'Central Kitchen'
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
    { id: 'reports', label: 'Reports', icon: '📑' },
    { id: 'ai', label: 'AI Insights', icon: '🤖' },
  ];

  // Get item analysis data
  const getItemAnalysis = (item) => {
    const now = new Date();
    const thisMonth = now.getMonth() + 1;
    const lastMonth = thisMonth === 1 ? 12 : thisMonth - 1;
    
    // Orders by outlet (all time and this month)
    const ordersByOutlet = {};
    const thisMonthOrdersByOutlet = {};
    outlets.forEach(outlet => {
      ordersByOutlet[outlet] = { qty: 0, cost: 0 };
      thisMonthOrdersByOutlet[outlet] = { qty: 0, cost: 0 };
    });
    
    orders.forEach(order => {
      const orderMonth = new Date(order.createdAt).getMonth() + 1;
      (order.items || []).forEach(oi => {
        if (oi.id === item.id) {
          ordersByOutlet[order.outlet].qty += oi.quantity;
          ordersByOutlet[order.outlet].cost += oi.quantity * oi.price;
          if (orderMonth === thisMonth) {
            thisMonthOrdersByOutlet[order.outlet].qty += oi.quantity;
            thisMonthOrdersByOutlet[order.outlet].cost += oi.quantity * oi.price;
          }
        }
      });
    });
    
    // Consumed (from stock out history)
    let totalConsumed = 0;
    let thisMonthConsumed = 0;
    outlets.forEach(outlet => {
      (globalStockOutHistory?.[outlet] || []).forEach(entry => {
        const entryMonth = new Date(entry.submittedAt).getMonth() + 1;
        (entry.items || []).forEach(si => {
          if (si.id === item.id && si.used > 0) {
            totalConsumed += si.used;
            if (entryMonth === thisMonth) {
              thisMonthConsumed += si.used;
            }
          }
        });
      });
    });
    
    const totalOrdered = Object.values(ordersByOutlet).reduce((s, o) => s + o.qty, 0);
    const thisMonthOrdered = Object.values(thisMonthOrdersByOutlet).reduce((s, o) => s + o.qty, 0);
    const consumedPercent = totalOrdered > 0 ? (totalConsumed / totalOrdered * 100) : 0;
    
    return {
      ordersByOutlet,
      thisMonthOrdersByOutlet,
      totalOrdered,
      thisMonthOrdered,
      totalConsumed,
      thisMonthConsumed,
      consumedPercent,
      currentPrice: item.price,
      previousPrice: item.previousPrice || null,
      priceChange: item.priceChange || 0,
      priceHistory: item.priceHistory || [],
      lastUpdated: item.lastUpdated,
      updatedBy: item.updatedBy,
    };
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="glass-card-dark p-2 flex gap-1 overflow-x-auto">
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

      {/* Global Item Search */}
      <div className="glass-card-dark p-4">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={globalItemSearch}
            onChange={(e) => { setGlobalItemSearch(e.target.value); setSelectedAnalysisItem(null); }}
            placeholder="Search items for detailed analysis..."
            className="flex-1 bg-transparent text-white placeholder-stone-500 outline-none"
          />
          {globalItemSearch && (
            <button onClick={() => { setGlobalItemSearch(''); setSelectedAnalysisItem(null); }} className="text-stone-500 hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Search Results Dropdown */}
        {globalItemSearch.trim() && !selectedAnalysisItem && (
          <div className="mt-3 border-t border-stone-800 pt-3 max-h-48 overflow-y-auto">
            {(() => {
              const results = items.filter(i => i.name.toLowerCase().includes(globalItemSearch.toLowerCase())).slice(0, 10);
              if (results.length === 0) return <p className="text-stone-500 text-sm">No items found</p>;
              return results.map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedAnalysisItem(item)}
                  className="w-full text-left p-2 hover:bg-stone-800/50 rounded-lg transition-colors flex items-center justify-between"
                >
                  <div>
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-xs text-stone-500">{getCategoryName(item.categoryId)}</p>
                  </div>
                  <span className="text-amber-400 font-medium">{formatCurrency(item.price)}</span>
                </button>
              ));
            })()}
          </div>
        )}
        
        {/* Item Analysis Panel */}
        {selectedAnalysisItem && (
          <div className="mt-4 border-t border-stone-700 pt-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{selectedAnalysisItem.name}</h3>
                <p className="text-sm text-stone-500">{getCategoryName(selectedAnalysisItem.categoryId)} • {selectedAnalysisItem.unit}</p>
              </div>
              <button onClick={() => setSelectedAnalysisItem(null)} className="text-stone-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {(() => {
              const analysis = getItemAnalysis(selectedAnalysisItem);
              return (
                <div className="space-y-4">
                  {/* Price Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-stone-800/30 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-amber-400">{formatCurrency(analysis.currentPrice)}</p>
                      <p className="text-xs text-stone-500">Current Price</p>
                    </div>
                    <div className="bg-stone-800/30 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-stone-400">{analysis.previousPrice ? formatCurrency(analysis.previousPrice) : '-'}</p>
                      <p className="text-xs text-stone-500">Previous Price</p>
                    </div>
                    <div className="bg-stone-800/30 rounded-xl p-3 text-center">
                      <p className={`text-2xl font-bold ${analysis.priceChange > 0 ? 'text-red-400' : analysis.priceChange < 0 ? 'text-emerald-400' : 'text-stone-400'}`}>
                        {analysis.priceChange !== 0 ? (analysis.priceChange > 0 ? '+' : '') + formatCurrency(analysis.priceChange) : '-'}
                      </p>
                      <p className="text-xs text-stone-500">Price Change</p>
                    </div>
                    <div className="bg-stone-800/30 rounded-xl p-3 text-center">
                      <p className={`text-2xl font-bold ${analysis.consumedPercent >= 80 ? 'text-emerald-400' : analysis.consumedPercent >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {analysis.consumedPercent.toFixed(0)}%
                      </p>
                      <p className="text-xs text-stone-500">Consumed vs Ordered</p>
                    </div>
                  </div>
                  
                  {/* Order Stats by Outlet */}
                  <div className="bg-stone-800/20 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-white mb-3">Orders by Outlet (This Month)</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {outlets.map(outlet => (
                        <div key={outlet} className="bg-stone-800/30 rounded-lg p-3 text-center">
                          <p className="text-lg font-bold text-white">{analysis.thisMonthOrdersByOutlet[outlet].qty}</p>
                          <p className="text-xs text-stone-500">{outlet}</p>
                          <p className="text-xs text-amber-400">{formatCurrency(analysis.thisMonthOrdersByOutlet[outlet].cost)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
                      <p className="text-xl font-bold text-emerald-400">{analysis.totalOrdered}</p>
                      <p className="text-xs text-stone-500">Total Ordered (All Time)</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center">
                      <p className="text-xl font-bold text-blue-400">{analysis.thisMonthOrdered}</p>
                      <p className="text-xs text-stone-500">Ordered This Month</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
                      <p className="text-xl font-bold text-red-400">{analysis.totalConsumed}</p>
                      <p className="text-xs text-stone-500">Total Consumed</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 text-center">
                      <p className="text-xl font-bold text-purple-400">{analysis.thisMonthConsumed}</p>
                      <p className="text-xs text-stone-500">Consumed This Month</p>
                    </div>
                  </div>
                  
                  {/* Last Updated */}
                  {analysis.lastUpdated && (
                    <p className="text-xs text-stone-500 text-right">
                      Last price update: {formatDate(analysis.lastUpdated)} {analysis.updatedBy && `by ${analysis.updatedBy}`}
                    </p>
                  )}
                </div>
              );
            })()}
          </div>
        )}
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
          <div className="glass-card-dark p-6">
            <h3 className="text-lg font-semibold text-amber-400 mb-2 flex items-center gap-2">
              <span>📊</span> Today's Summary
            </h3>
            <p className="text-sm text-stone-500 mb-4">Click a status to filter outlet orders below</p>
            
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div 
                onClick={() => setSummaryFilter(summaryFilter === 'all' ? null : 'all')}
                className={`bg-stone-800/30 rounded-xl p-4 text-center cursor-pointer transition-all hover:bg-stone-800/50 ${summaryFilter === 'all' ? 'ring-2 ring-blue-500' : ''}`}
              >
                <p className="text-3xl font-bold text-blue-400">{todayOrders.length}</p>
                <p className="text-sm text-stone-400 mt-1">Total Orders</p>
              </div>
              <div className="bg-stone-800/30 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-emerald-400">{formatCurrency(todayOrders.reduce((s, o) => s + o.totalAmount, 0))}</p>
                <p className="text-sm text-stone-400 mt-1">Total Value</p>
              </div>
              <div 
                onClick={() => setSummaryFilter(summaryFilter === 'pending' ? null : 'pending')}
                className={`bg-stone-800/30 rounded-xl p-4 text-center cursor-pointer transition-all hover:bg-stone-800/50 ${summaryFilter === 'pending' ? 'ring-2 ring-yellow-500' : ''}`}
              >
                <p className="text-3xl font-bold text-yellow-400">{todayOrders.filter(o => o.status === 'pending').length}</p>
                <p className="text-sm text-stone-400 mt-1">Pending</p>
              </div>
              <div 
                onClick={() => setSummaryFilter(summaryFilter === 'dispatched' ? null : 'dispatched')}
                className={`bg-stone-800/30 rounded-xl p-4 text-center cursor-pointer transition-all hover:bg-stone-800/50 ${summaryFilter === 'dispatched' ? 'ring-2 ring-blue-500' : ''}`}
              >
                <p className="text-3xl font-bold text-blue-400">{todayOrders.filter(o => o.status === 'dispatched').length}</p>
                <p className="text-sm text-stone-400 mt-1">Dispatched</p>
              </div>
              <div 
                onClick={() => setSummaryFilter(summaryFilter === 'delivered' ? null : 'delivered')}
                className={`bg-stone-800/30 rounded-xl p-4 text-center cursor-pointer transition-all hover:bg-stone-800/50 ${summaryFilter === 'delivered' ? 'ring-2 ring-purple-500' : ''}`}
              >
                <p className="text-3xl font-bold text-purple-400">{todayOrders.filter(o => o.status === 'delivered' || o.status === 'completed').length}</p>
                <p className="text-sm text-stone-400 mt-1">Delivered</p>
              </div>
              <div 
                onClick={() => setSummaryFilter(summaryFilter === 'disputed' ? null : 'disputed')}
                className={`bg-stone-800/30 rounded-xl p-4 text-center cursor-pointer transition-all hover:bg-stone-800/50 ${summaryFilter === 'disputed' ? 'ring-2 ring-red-500' : ''}`}
              >
                <p className="text-3xl font-bold text-red-400">{todayOrders.filter(o => o.status === 'disputed').length}</p>
                <p className="text-sm text-stone-400 mt-1">Disputed</p>
              </div>
            </div>

            {/* Outlet Breakdown - Clickable & Expandable */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {outlets.map(outlet => {
                const outletTodayOrders = todayOrders.filter(o => o.outlet === outlet);
                const outletTotal = outletTodayOrders.reduce((s, o) => s + o.totalAmount, 0);
                const outletPending = outletTodayOrders.filter(o => o.status === 'pending').length;
                const outletDispatched = outletTodayOrders.filter(o => o.status === 'dispatched').length;
                const isExpanded = expandedOutlet === outlet;
                
                // Filter orders based on summaryFilter
                const displayOrders = summaryFilter 
                  ? outletTodayOrders.filter(o => {
                      if (summaryFilter === 'pending') return o.status === 'pending';
                      if (summaryFilter === 'dispatched') return o.status === 'dispatched';
                      if (summaryFilter === 'delivered') return o.status === 'delivered' || o.status === 'completed';
                      if (summaryFilter === 'disputed') return o.status === 'disputed';
                      return true;
                    })
                  : outletTodayOrders;
                
                return (
                  <div key={outlet} className="bg-stone-800/20 border border-stone-700/30 rounded-xl overflow-hidden">
                    <div 
                      className="p-4 cursor-pointer hover:bg-stone-800/40 transition-colors"
                      onClick={() => setExpandedOutlet(isExpanded ? null : outlet)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{outlet}</span>
                          <svg className={`w-4 h-4 text-stone-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
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
                      <p className="text-xs text-stone-500">{outletTodayOrders.length} orders • Click to expand</p>
                    </div>
                    
                    {/* Expanded Order Details */}
                    {isExpanded && (
                      <div className="border-t border-stone-700/50 bg-stone-900/30 p-4 animate-slide-up">
                        {displayOrders.length === 0 ? (
                          <p className="text-center text-stone-500 py-2">No {summaryFilter || ''} orders</p>
                        ) : (
                          <div className="space-y-3 max-h-80 overflow-y-auto">
                            {displayOrders.map(order => (
                              <div key={order.id} className="bg-stone-800/50 rounded-lg p-3 border border-stone-700/30">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-white font-medium text-sm">{order.id}</span>
                                    <span className={`px-2 py-0.5 text-xs rounded-lg ${
                                      order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                      order.status === 'dispatched' ? 'bg-blue-500/20 text-blue-400' :
                                      order.status === 'delivered' || order.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                                      order.status === 'disputed' ? 'bg-red-500/20 text-red-400' : 'bg-stone-700 text-stone-400'
                                    }`}>{order.status}</span>
                                  </div>
                                  <span className="text-amber-400 font-semibold text-sm">{formatCurrency(order.totalAmount)}</span>
                                </div>
                                <p className="text-xs text-stone-500 mb-2">{formatDate(order.createdAt)} by {order.createdBy}</p>
                                <div className="text-xs text-stone-400 space-y-0.5">
                                  {order.items.slice(0, 5).map((item, idx) => (
                                    <div key={idx} className="flex justify-between">
                                      <span>{item.name}</span>
                                      <span>{item.quantity} {item.unit}</span>
                                    </div>
                                  ))}
                                  {order.items.length > 5 && (
                                    <p className="text-stone-500 italic">+{order.items.length - 5} more items</p>
                                  )}
                                </div>
                                {order.status === 'pending' && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); startReview(order); }}
                                    className="mt-2 w-full px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-medium hover:bg-orange-600 transition-colors"
                                  >
                                    Review & Dispatch
                                  </button>
                                )}
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
            
            {/* Filter indicator */}
            {summaryFilter && (
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-xs text-stone-500">Filtering by: <span className="text-amber-400 capitalize">{summaryFilter}</span></span>
                <button 
                  onClick={() => setSummaryFilter(null)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Clear filter
                </button>
              </div>
            )}
          </div>

          {/* Cumulative Pending Orders for Vendor */}
          <div className="glass-card-dark p-6">
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
          <div className="glass-card-dark p-4">
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
          <div className="glass-card-dark p-6">
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
          <div className="glass-card-dark p-6">
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
          <div className="glass-card-dark p-6">
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
          <div className="glass-card-dark p-6">
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
                    
                    {/* Expanded Items List with Edit */}
                    {isExpanded && (
                      <div className="border-t border-stone-700/50 bg-stone-900/30 p-4">
                        {categoryItems.length === 0 ? (
                          <p className="text-stone-500 text-sm text-center py-4">No items in this category</p>
                        ) : (
                          <div className="space-y-2">
                            {categoryItems.map(item => (
                              <div key={item.id} className="bg-stone-800/50 rounded-lg overflow-hidden">
                                {editingItemId === item.id ? (
                                  /* Edit Mode */
                                  <div className="p-3 space-y-3">
                                    <div className="flex items-center justify-between">
                                      <p className="text-white font-medium">{item.name}</p>
                                      <span className="text-amber-400 font-medium">{formatCurrency(item.price)}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                      <div>
                                        <label className="text-xs text-stone-500 block mb-1">Unit</label>
                                        <div className="flex gap-1">
                                          <select
                                            value={editingItemData.unit}
                                            onChange={(e) => setEditingItemData({...editingItemData, unit: e.target.value})}
                                            className="flex-1 px-2 py-1.5 bg-stone-700 border border-stone-600 rounded text-white text-sm"
                                          >
                                            {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
                                          </select>
                                          <button
                                            onClick={() => setShowAddUnit(true)}
                                            className="px-2 py-1 bg-stone-600 text-stone-300 rounded text-xs hover:bg-stone-500"
                                            title="Add new unit"
                                          >+</button>
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-xs text-stone-500 block mb-1">Packaging</label>
                                        <div className="flex gap-1">
                                          <select
                                            value={editingItemData.pkg}
                                            onChange={(e) => setEditingItemData({...editingItemData, pkg: e.target.value})}
                                            className="flex-1 px-2 py-1.5 bg-stone-700 border border-stone-600 rounded text-white text-sm"
                                          >
                                            <option value="">Select...</option>
                                            {packagingOptions.map(p => <option key={p} value={p}>{p}</option>)}
                                          </select>
                                          <button
                                            onClick={() => setShowAddPackaging(true)}
                                            className="px-2 py-1 bg-stone-600 text-stone-300 rounded text-xs hover:bg-stone-500"
                                            title="Add new packaging"
                                          >+</button>
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-xs text-stone-500 block mb-1">Weight</label>
                                        <input
                                          type="number"
                                          step="0.1"
                                          value={editingItemData.wt}
                                          onChange={(e) => setEditingItemData({...editingItemData, wt: e.target.value})}
                                          className="w-full px-2 py-1.5 bg-stone-700 border border-stone-600 rounded text-white text-sm"
                                          placeholder="e.g. 1"
                                        />
                                      </div>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                      <button
                                        onClick={() => saveItemDetails(item.id)}
                                        className="px-3 py-1.5 bg-emerald-500 text-white rounded text-sm font-medium hover:bg-emerald-600"
                                      >Save</button>
                                      <button
                                        onClick={() => { setEditingItemId(null); setEditingItemData({ unit: '', pkg: '', wt: '' }); }}
                                        className="px-3 py-1.5 bg-stone-600 text-white rounded text-sm hover:bg-stone-500"
                                      >Cancel</button>
                                    </div>
                                  </div>
                                ) : (
                                  /* View Mode */
                                  <div className="flex items-center justify-between py-2 px-3">
                                    <div className="flex-1">
                                      <p className="text-white text-sm font-medium">{item.name}</p>
                                      <p className="text-xs text-stone-500">
                                        {item.unit}
                                        {item.pkg && <span className="ml-2">• {item.pkg}</span>}
                                        {item.wt && item.wt !== 1 && <span className="ml-2">• {item.wt} {item.unit}</span>}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-amber-400 font-medium">{formatCurrency(item.price)}</span>
                                      <button
                                        onClick={() => startEditingItem(item)}
                                        className="p-1.5 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                                        title="Edit unit, packaging, weight"
                                      >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                      </button>
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
                                )}
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
            
            {/* Add New Unit Modal */}
            {showAddUnit && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                <div className="bg-stone-800 rounded-xl p-6 w-full max-w-sm animate-modal-in">
                  <h4 className="text-white font-semibold mb-4">Add New Unit</h4>
                  <input
                    type="text"
                    value={newUnitOption}
                    onChange={(e) => setNewUnitOption(e.target.value)}
                    placeholder="e.g. dozen, gram, ml"
                    className="w-full px-4 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white placeholder-stone-500 mb-4"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button onClick={addUnitOption} className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600">Add</button>
                    <button onClick={() => { setShowAddUnit(false); setNewUnitOption(''); }} className="flex-1 px-4 py-2 bg-stone-600 text-white rounded-lg hover:bg-stone-500">Cancel</button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Add New Packaging Modal */}
            {showAddPackaging && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                <div className="bg-stone-800 rounded-xl p-6 w-full max-w-sm animate-modal-in">
                  <h4 className="text-white font-semibold mb-4">Add New Packaging</h4>
                  <input
                    type="text"
                    value={newPackagingOption}
                    onChange={(e) => setNewPackagingOption(e.target.value)}
                    placeholder="e.g. carton, tray, pouch"
                    className="w-full px-4 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white placeholder-stone-500 mb-4"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button onClick={addPackagingOption} className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600">Add</button>
                    <button onClick={() => { setShowAddPackaging(false); setNewPackagingOption(''); }} className="flex-1 px-4 py-2 bg-stone-600 text-white rounded-lg hover:bg-stone-500">Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Items Section */}
          <div className="glass-card-dark p-6">
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
          {/* Bulk Price Update Card */}
          <div className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📋</span>
                <div>
                  <h3 className="text-lg font-semibold text-violet-400">Bulk Price Update</h3>
                  <p className="text-sm text-stone-400">Paste price list to update multiple items at once</p>
                </div>
              </div>
              <button
                onClick={() => setShowPdfExtractor(true)}
                className="px-4 py-2 bg-violet-500 text-white rounded-xl font-medium hover:bg-violet-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Bulk Update
              </button>
            </div>
          </div>

          {/* PDF Extractor Modal */}
          {showPdfExtractor && (
            <div className="fixed inset-0 glass-modal-overlay flex items-center justify-center z-50 p-4">
              <div className="bg-stone-900 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-modal-in">
                <div className="p-6 border-b border-stone-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🤖</span>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Bulk Price Update</h3>
                        <p className="text-sm text-stone-400">Paste item names and prices to update in bulk</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setShowPdfExtractor(false); setPdfFile(null); setPdfExtractedPrices([]); setPdfMatchedItems([]); setPdfExtractError(null); }}
                      className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  {/* Bulk Text Input Section */}
                  {!pdfMatchedItems.length && !pdfExtracting && (
                    <div className="space-y-4">
                      <div className="bg-stone-800/50 rounded-xl p-4">
                        <p className="text-sm text-stone-300 mb-2">Paste your price list in this format (one per line):</p>
                        <p className="text-xs text-stone-500 font-mono mb-3">Item Name, Price</p>
                        <p className="text-xs text-stone-500">Example:</p>
                        <p className="text-xs text-stone-400 font-mono">Chicken Boneless, 280</p>
                        <p className="text-xs text-stone-400 font-mono">Eggs, 7.50</p>
                        <p className="text-xs text-stone-400 font-mono">Butter, 550</p>
                      </div>
                      
                      <textarea
                        value={pdfFile || ''}
                        onChange={(e) => setPdfFile(e.target.value)}
                        placeholder="Paste your price list here..."
                        className="w-full h-48 px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-white placeholder-stone-500 font-mono text-sm resize-none"
                      />
                      
                      {pdfExtractError && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
                          {pdfExtractError}
                        </div>
                      )}
                      
                      <button
                        onClick={() => {
                          if (!pdfFile || !pdfFile.trim()) return;
                          setPdfExtracting(true);
                          setPdfExtractError(null);
                          
                          try {
                            const lines = pdfFile.split('\n').filter(l => l.trim());
                            const matched = [];
                            
                            lines.forEach(line => {
                              // Parse "Item Name, Price" or "Item Name - Price" or "Item Name  Price"
                              const parts = line.split(/[,\-\t]|\s{2,}/).map(p => p.trim()).filter(Boolean);
                              if (parts.length >= 2) {
                                const itemName = parts[0];
                                const price = parseFloat(parts[parts.length - 1].replace(/[₹,]/g, ''));
                                
                                if (!isNaN(price)) {
                                  // Find matching item
                                  const itemNameLower = itemName.toLowerCase();
                                  const matchedItem = items.find(i => {
                                    const iNameLower = i.name.toLowerCase();
                                    return iNameLower === itemNameLower || 
                                           iNameLower.includes(itemNameLower) || 
                                           itemNameLower.includes(iNameLower) ||
                                           // Check if most words match
                                           itemNameLower.split(' ').filter(w => iNameLower.includes(w)).length >= 2;
                                  });
                                  
                                  if (matchedItem) {
                                    matched.push({
                                      pdfItemName: itemName,
                                      pdfPrice: price,
                                      matchedItemId: matchedItem.id,
                                      matchedItemName: matchedItem.name,
                                      currentItem: matchedItem,
                                      confidence: matchedItem.name.toLowerCase() === itemNameLower ? 'high' : 'medium',
                                      selected: true,
                                    });
                                  } else {
                                    matched.push({
                                      pdfItemName: itemName,
                                      pdfPrice: price,
                                      matchedItemId: null,
                                      matchedItemName: null,
                                      currentItem: null,
                                      confidence: 'low',
                                      selected: false,
                                    });
                                  }
                                }
                              }
                            });
                            
                            if (matched.length === 0) {
                              setPdfExtractError('No valid price entries found. Use format: Item Name, Price');
                            } else {
                              setPdfMatchedItems(matched);
                            }
                          } catch (err) {
                            setPdfExtractError('Failed to parse price list: ' + err.message);
                          } finally {
                            setPdfExtracting(false);
                          }
                        }}
                        disabled={!pdfFile || !pdfFile.trim()}
                        className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                          pdfFile && pdfFile.trim()
                            ? 'bg-violet-500 text-white hover:bg-violet-600' 
                            : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                        }`}
                      >
                        <span>🔍</span> Match & Preview Prices
                      </button>
                    </div>
                  )}
                  
                  {/* Loading State */}
                  {pdfExtracting && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-white font-medium">Processing...</p>
                    </div>
                  )}
                  
                  {/* Results Section */}
                  {pdfMatchedItems.length > 0 && !pdfExtracting && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-white font-medium">
                          Found {pdfMatchedItems.length} matching item(s)
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setPdfMatchedItems(prev => prev.map(m => ({ ...m, selected: true })))}
                            className="px-3 py-1 bg-stone-800 text-stone-300 rounded-lg text-sm hover:bg-stone-700"
                          >
                            Select All
                          </button>
                          <button
                            onClick={() => setPdfMatchedItems(prev => prev.map(m => ({ ...m, selected: false })))}
                            className="px-3 py-1 bg-stone-800 text-stone-300 rounded-lg text-sm hover:bg-stone-700"
                          >
                            Deselect All
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {pdfMatchedItems.map((match, idx) => (
                          <div 
                            key={idx}
                            onClick={() => toggleMatchSelection(idx)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all ${
                              match.selected 
                                ? 'bg-violet-500/10 border-violet-500/50' 
                                : 'bg-stone-800/30 border-stone-700/50 opacity-60'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                match.selected ? 'bg-violet-500 border-violet-500' : 'border-stone-600'
                              }`}>
                                {match.selected && (
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="text-white font-medium">{match.matchedItemName}</p>
                                  <span className={`px-1.5 py-0.5 text-xs rounded ${
                                    match.confidence === 'high' ? 'bg-emerald-500/20 text-emerald-400' :
                                    match.confidence === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-orange-500/20 text-orange-400'
                                  }`}>{match.confidence}</span>
                                </div>
                                <p className="text-xs text-stone-500">PDF: "{match.pdfItemName}"</p>
                              </div>
                              <div className="text-right">
                                <p className="text-stone-500 line-through text-sm">₹{match.currentItem?.price?.toFixed(2)}</p>
                                <p className="text-emerald-400 font-semibold">₹{match.pdfPrice?.toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Unmatched items info */}
                      {pdfExtractedPrices.filter(e => !e.matchedItemId).length > 0 && (
                        <div className="bg-stone-800/30 rounded-xl p-3">
                          <p className="text-xs text-stone-500">
                            {pdfExtractedPrices.filter(e => !e.matchedItemId).length} item(s) from PDF couldn't be matched to inventory
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Footer */}
                {pdfMatchedItems.length > 0 && !pdfExtracting && (
                  <div className="p-6 border-t border-stone-800 flex gap-3">
                    <button
                      onClick={() => { setPdfFile(null); setPdfExtractedPrices([]); setPdfMatchedItems([]); }}
                      className="flex-1 py-3 bg-stone-800 text-white rounded-xl font-medium hover:bg-stone-700 transition-colors"
                    >
                      Upload Different PDF
                    </button>
                    <button
                      onClick={applyExtractedPrices}
                      disabled={!pdfMatchedItems.some(m => m.selected)}
                      className={`flex-1 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                        pdfMatchedItems.some(m => m.selected)
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                          : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      <span>✓</span> Apply {pdfMatchedItems.filter(m => m.selected).length} Price(s)
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Category Filter */}
          <div className="glass-card-dark p-4">
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

          <div className="glass-card-dark overflow-hidden">
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
          <div className="glass-card-dark p-6">
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
          <div className="glass-card-dark p-6">
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
          <div className="glass-card-dark p-6">
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
          <div className="glass-card-dark p-6">
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

      {/* REPORTS TAB - CK */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Reports Header */}
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">📑</span>
              <div>
                <h2 className="text-xl font-bold text-white">Reports & Search</h2>
                <p className="text-sm text-stone-400">Stock difference analysis and invoice lookup</p>
              </div>
            </div>
          </div>

          {/* Invoice Search Section */}
          <div className="glass-card-dark p-6">
            <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
              <span>🔍</span> Invoice Search
            </h3>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={invoiceSearchQuery}
                onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                placeholder="Enter Order ID (e.g., YS0001, YB0002)..."
                className="flex-1 px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:ring-2 focus:ring-amber-500/50"
              />
              <button
                onClick={() => {
                  const q = invoiceSearchQuery.trim().toUpperCase();
                  if (!q) { setInvoiceSearchResults([]); return; }
                  const results = orders.filter(o => 
                    o.id.toUpperCase().includes(q) || 
                    o.outlet.toUpperCase().includes(q) ||
                    (o.createdBy && o.createdBy.toUpperCase().includes(q))
                  );
                  setInvoiceSearchResults(results);
                }}
                className="px-6 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-all active:scale-95"
              >
                Search
              </button>
            </div>
            
            {invoiceSearchResults.length > 0 && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <p className="text-sm text-stone-400">{invoiceSearchResults.length} result(s) found</p>
                {invoiceSearchResults.map(order => (
                  <div key={order.id} className="bg-stone-800/50 rounded-xl p-4 border border-stone-700/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">{order.id}</span>
                        <span className="px-2 py-0.5 bg-stone-700 text-stone-300 text-xs rounded-lg">{order.outlet}</span>
                        <span className={`px-2 py-0.5 text-xs rounded-lg ${
                          order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          order.status === 'dispatched' ? 'bg-blue-500/20 text-blue-400' :
                          order.status === 'delivered' || order.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                          order.status === 'disputed' ? 'bg-red-500/20 text-red-400' : 'bg-stone-700 text-stone-400'
                        }`}>{order.status}</span>
                      </div>
                      <span className="text-amber-400 font-semibold">{formatCurrency(order.totalAmount)}</span>
                    </div>
                    <p className="text-xs text-stone-500 mb-2">Created: {formatDate(order.createdAt)} by {order.createdBy}</p>
                    {order.dispatchedAt && <p className="text-xs text-stone-500">Dispatched: {formatDate(order.dispatchedAt)} by {order.dispatchedBy}</p>}
                    {order.acceptedAt && <p className="text-xs text-stone-500">Delivered: {formatDate(order.acceptedAt)} by {order.acceptedBy}</p>}
                    <div className="mt-3 border-t border-stone-700/50 pt-3">
                      <p className="text-xs text-stone-400 mb-2">Items:</p>
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-stone-300">{item.name}</span>
                            <span className="text-stone-400">{item.quantity} {item.unit} × {formatCurrency(item.price)} = {formatCurrency(item.quantity * item.price)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {order.dispute && (
                      <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                        <p className="text-xs text-red-400">Dispute: {order.dispute.reason}</p>
                        {order.dispute.notes && <p className="text-xs text-stone-500">{order.dispute.notes}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {invoiceSearchQuery && invoiceSearchResults.length === 0 && (
              <p className="text-stone-500 text-center py-4">No orders found matching "{invoiceSearchQuery}"</p>
            )}
          </div>

          {/* Stock Difference Report */}
          <div className="glass-card-dark p-6">
            <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
              <span>⚖️</span> Stock Difference Report
              <span className="text-xs text-stone-500 font-normal">(Ordered vs Consumed)</span>
            </h3>
            
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b border-stone-700/50">
              <div className="flex items-center gap-2">
                <label className="text-xs text-stone-500">Period:</label>
                <select
                  value={stockDiffPeriod}
                  onChange={(e) => setStockDiffPeriod(e.target.value)}
                  className="glass-input-dark text-sm"
                >
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="thisWeek">This Week</option>
                  <option value="lastWeek">Last Week</option>
                  <option value="lastMonth">Last Month</option>
                  <option value="last3Months">Last 3 Months</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-stone-500">Outlet:</label>
                <select
                  value={stockDiffOutlet}
                  onChange={(e) => setStockDiffOutlet(e.target.value)}
                  className="glass-input-dark text-sm"
                >
                  <option value="All">All Outlets</option>
                  {outlets.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-stone-500">Search Item:</label>
                <input
                  type="text"
                  value={stockDiffItemFilter}
                  onChange={(e) => setStockDiffItemFilter(e.target.value)}
                  placeholder="Filter by item name..."
                  className="glass-input-dark text-sm w-40"
                />
              </div>
            </div>

            {/* Report Content */}
            {(() => {
              const now = new Date();
              let startDate, endDate;
              
              switch(stockDiffPeriod) {
                case 'today':
                  startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                  endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
                  break;
                case 'yesterday':
                  startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
                  endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                  break;
                case 'thisWeek':
                  const dayOfWeek = now.getDay();
                  startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
                  endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
                  break;
                case 'lastWeek':
                  const lastWeekDay = now.getDay();
                  startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - lastWeekDay - 7);
                  endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - lastWeekDay);
                  break;
                case 'lastMonth':
                  startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                  endDate = new Date(now.getFullYear(), now.getMonth(), 1);
                  break;
                case 'last3Months':
                  startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                  endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                  break;
                default:
                  startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                  endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
              }

              const activeOutlets = stockDiffOutlet === 'All' ? outlets : [stockDiffOutlet];
              const periodOrders = orders.filter(o => {
                const orderDate = new Date(o.createdAt);
                return activeOutlets.includes(o.outlet) && 
                       orderDate >= startDate && 
                       orderDate < endDate &&
                       (o.status === 'delivered' || o.status === 'completed' || o.status === 'dispatched');
              });

              const orderedByItem = {};
              periodOrders.forEach(order => {
                (order.items || []).forEach(item => {
                  if (!orderedByItem[item.id]) {
                    orderedByItem[item.id] = { 
                      id: item.id, name: item.name, unit: item.unit, categoryId: item.categoryId,
                      ordered: 0, consumed: 0
                    };
                  }
                  orderedByItem[item.id].ordered += item.quantity;
                });
              });

              activeOutlets.forEach(outlet => {
                const outletHistory = globalStockOutHistory?.[outlet] || [];
                outletHistory.forEach(entry => {
                  const entryDate = new Date(entry.submittedAt);
                  if (entryDate >= startDate && entryDate < endDate) {
                    (entry.items || []).forEach(item => {
                      if (item.used > 0) {
                        if (!orderedByItem[item.id]) {
                          const itemData = items.find(i => i.id === item.id);
                          orderedByItem[item.id] = { 
                            id: item.id, name: item.name || itemData?.name || 'Unknown',
                            unit: item.unit || itemData?.unit || '', categoryId: item.categoryId || itemData?.categoryId,
                            ordered: 0, consumed: 0
                          };
                        }
                        orderedByItem[item.id].consumed += item.used;
                      }
                    });
                  }
                });
              });

              let reportItems = Object.values(orderedByItem)
                .filter(item => {
                  if (stockDiffItemFilter) return item.name.toLowerCase().includes(stockDiffItemFilter.toLowerCase());
                  return item.ordered > 0 || item.consumed > 0;
                })
                .map(item => ({
                  ...item,
                  difference: item.ordered - item.consumed,
                }))
                .sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference));

              const totalOrdered = reportItems.reduce((s, i) => s + i.ordered, 0);
              const totalConsumed = reportItems.reduce((s, i) => s + i.consumed, 0);

              return (
                <>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-stone-800/30 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-emerald-400">{totalOrdered.toFixed(1)}</p>
                      <p className="text-xs text-stone-400">Total Ordered</p>
                    </div>
                    <div className="bg-stone-800/30 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-red-400">{totalConsumed.toFixed(1)}</p>
                      <p className="text-xs text-stone-400">Total Consumed</p>
                    </div>
                    <div className="bg-stone-800/30 rounded-xl p-4 text-center">
                      <p className={`text-2xl font-bold ${totalOrdered - totalConsumed >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                        {totalOrdered - totalConsumed >= 0 ? '+' : ''}{(totalOrdered - totalConsumed).toFixed(1)}
                      </p>
                      <p className="text-xs text-stone-400">Net Difference</p>
                    </div>
                  </div>

                  {reportItems.length === 0 ? (
                    <div className="text-center py-8 text-stone-500">No stock data for this period</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-xs text-stone-500 uppercase border-b border-stone-700">
                            <th className="pb-3">Item</th>
                            <th className="pb-3 text-right">Ordered</th>
                            <th className="pb-3 text-right">Consumed</th>
                            <th className="pb-3 text-right">Difference</th>
                            <th className="pb-3 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportItems.slice(0, 50).map(item => (
                            <tr key={item.id} className="border-b border-stone-800/30 hover:bg-stone-800/20">
                              <td className="py-3">
                                <p className="text-white font-medium">{item.name}</p>
                                <p className="text-xs text-stone-500">{getCategoryName(item.categoryId)}</p>
                              </td>
                              <td className="py-3 text-right">
                                <span className="text-emerald-400 font-medium">{item.ordered.toFixed(1)}</span>
                                <span className="text-stone-500 text-xs ml-1">{item.unit}</span>
                              </td>
                              <td className="py-3 text-right">
                                <span className="text-red-400 font-medium">{item.consumed.toFixed(1)}</span>
                                <span className="text-stone-500 text-xs ml-1">{item.unit}</span>
                              </td>
                              <td className="py-3 text-right">
                                <span className={`font-semibold ${item.difference >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                                  {item.difference >= 0 ? '+' : ''}{item.difference.toFixed(1)}
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                {item.difference > 0 ? (
                                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-lg">Surplus</span>
                                ) : item.difference < 0 ? (
                                  <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-lg">Deficit</span>
                                ) : (
                                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-lg">Balanced</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {reportItems.length > 50 && (
                        <p className="text-center text-stone-500 text-sm mt-3">Showing top 50 items</p>
                      )}
                    </div>
                  )}
                </>
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
          <div className="glass-card-dark p-6">
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
          <div className="glass-card-dark p-6">
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
function AdminDashboard({ data, onUpdateItems, onUpdateRevenueData, accent }) {
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
  
  // Stock Difference Report state
  const [stockDiffPeriod, setStockDiffPeriod] = useState('today');
  const [stockDiffOutlet, setStockDiffOutlet] = useState('All');
  const [stockDiffItemFilter, setStockDiffItemFilter] = useState('');
  
  // Invoice Search state
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState('');
  const [invoiceSearchResults, setInvoiceSearchResults] = useState([]);
  
  // Global Item Search with Analysis
  const [globalItemSearch, setGlobalItemSearch] = useState('');
  const [selectedAnalysisItem, setSelectedAnalysisItem] = useState(null);

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

  // Get item analysis data for Admin
  const getItemAnalysis = (item) => {
    const now = new Date();
    const thisMonth = now.getMonth() + 1;
    
    const ordersByOutlet = {};
    const thisMonthOrdersByOutlet = {};
    outlets.forEach(outlet => {
      ordersByOutlet[outlet] = { qty: 0, cost: 0 };
      thisMonthOrdersByOutlet[outlet] = { qty: 0, cost: 0 };
    });
    
    orders.forEach(order => {
      const orderMonth = new Date(order.createdAt).getMonth() + 1;
      (order.items || []).forEach(oi => {
        if (oi.id === item.id) {
          ordersByOutlet[order.outlet].qty += oi.quantity;
          ordersByOutlet[order.outlet].cost += oi.quantity * oi.price;
          if (orderMonth === thisMonth) {
            thisMonthOrdersByOutlet[order.outlet].qty += oi.quantity;
            thisMonthOrdersByOutlet[order.outlet].cost += oi.quantity * oi.price;
          }
        }
      });
    });
    
    let totalConsumed = 0, thisMonthConsumed = 0;
    outlets.forEach(outlet => {
      (stockOutHistory?.[outlet] || []).forEach(entry => {
        const entryMonth = new Date(entry.submittedAt).getMonth() + 1;
        (entry.items || []).forEach(si => {
          if (si.id === item.id && si.used > 0) {
            totalConsumed += si.used;
            if (entryMonth === thisMonth) thisMonthConsumed += si.used;
          }
        });
      });
    });
    
    const totalOrdered = Object.values(ordersByOutlet).reduce((s, o) => s + o.qty, 0);
    const thisMonthOrdered = Object.values(thisMonthOrdersByOutlet).reduce((s, o) => s + o.qty, 0);
    const consumedPercent = totalOrdered > 0 ? (totalConsumed / totalOrdered * 100) : 0;
    
    return { ordersByOutlet, thisMonthOrdersByOutlet, totalOrdered, thisMonthOrdered, totalConsumed, thisMonthConsumed, consumedPercent, currentPrice: item.price, previousPrice: item.previousPrice || null, priceChange: item.priceChange || 0, lastUpdated: item.lastUpdated, updatedBy: item.updatedBy };
  };

  return (
    <div className="space-y-6">
      {/* Global Item Search */}
      <div className="glass-card-dark p-4">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={globalItemSearch}
            onChange={(e) => { setGlobalItemSearch(e.target.value); setSelectedAnalysisItem(null); }}
            placeholder="Search items for detailed analysis..."
            className="flex-1 bg-transparent text-white placeholder-stone-500 outline-none"
          />
          {globalItemSearch && (
            <button onClick={() => { setGlobalItemSearch(''); setSelectedAnalysisItem(null); }} className="text-stone-500 hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        {globalItemSearch.trim() && !selectedAnalysisItem && (
          <div className="mt-3 border-t border-stone-800 pt-3 max-h-48 overflow-y-auto">
            {(() => {
              const results = items.filter(i => i.name.toLowerCase().includes(globalItemSearch.toLowerCase())).slice(0, 10);
              if (results.length === 0) return <p className="text-stone-500 text-sm">No items found</p>;
              return results.map(item => (
                <button key={item.id} onClick={() => setSelectedAnalysisItem(item)} className="w-full text-left p-2 hover:bg-stone-800/50 rounded-lg transition-colors flex items-center justify-between">
                  <div><p className="text-white font-medium">{item.name}</p><p className="text-xs text-stone-500">{getCategoryName(item.categoryId)}</p></div>
                  <span className="text-purple-400 font-medium">{formatCurrency(item.price)}</span>
                </button>
              ));
            })()}
          </div>
        )}
        
        {selectedAnalysisItem && (
          <div className="mt-4 border-t border-stone-700 pt-4">
            <div className="flex items-center justify-between mb-4">
              <div><h3 className="text-lg font-semibold text-white">{selectedAnalysisItem.name}</h3><p className="text-sm text-stone-500">{getCategoryName(selectedAnalysisItem.categoryId)} • {selectedAnalysisItem.unit}</p></div>
              <button onClick={() => setSelectedAnalysisItem(null)} className="text-stone-400 hover:text-white"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            {(() => {
              const analysis = getItemAnalysis(selectedAnalysisItem);
              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-stone-800/30 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-purple-400">{formatCurrency(analysis.currentPrice)}</p><p className="text-xs text-stone-500">Current Price</p></div>
                    <div className="bg-stone-800/30 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-stone-400">{analysis.previousPrice ? formatCurrency(analysis.previousPrice) : '-'}</p><p className="text-xs text-stone-500">Previous Price</p></div>
                    <div className="bg-stone-800/30 rounded-xl p-3 text-center"><p className={`text-2xl font-bold ${analysis.priceChange > 0 ? 'text-red-400' : analysis.priceChange < 0 ? 'text-emerald-400' : 'text-stone-400'}`}>{analysis.priceChange !== 0 ? (analysis.priceChange > 0 ? '+' : '') + formatCurrency(analysis.priceChange) : '-'}</p><p className="text-xs text-stone-500">Price Change</p></div>
                    <div className="bg-stone-800/30 rounded-xl p-3 text-center"><p className={`text-2xl font-bold ${analysis.consumedPercent >= 80 ? 'text-emerald-400' : analysis.consumedPercent >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{analysis.consumedPercent.toFixed(0)}%</p><p className="text-xs text-stone-500">Consumed vs Ordered</p></div>
                  </div>
                  <div className="bg-stone-800/20 rounded-xl p-4"><h4 className="text-sm font-semibold text-white mb-3">Orders by Outlet (This Month)</h4><div className="grid grid-cols-3 gap-3">{outlets.map(outlet => (<div key={outlet} className="bg-stone-800/30 rounded-lg p-3 text-center"><p className="text-lg font-bold text-white">{analysis.thisMonthOrdersByOutlet[outlet].qty}</p><p className="text-xs text-stone-500">{outlet}</p><p className="text-xs text-purple-400">{formatCurrency(analysis.thisMonthOrdersByOutlet[outlet].cost)}</p></div>))}</div></div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center"><p className="text-xl font-bold text-emerald-400">{analysis.totalOrdered}</p><p className="text-xs text-stone-500">Total Ordered</p></div>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center"><p className="text-xl font-bold text-blue-400">{analysis.thisMonthOrdered}</p><p className="text-xs text-stone-500">This Month</p></div>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center"><p className="text-xl font-bold text-red-400">{analysis.totalConsumed}</p><p className="text-xs text-stone-500">Total Consumed</p></div>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 text-center"><p className="text-xl font-bold text-purple-400">{analysis.thisMonthConsumed}</p><p className="text-xs text-stone-500">Consumed This Month</p></div>
                  </div>
                  {analysis.lastUpdated && <p className="text-xs text-stone-500 text-right">Last price update: {formatDate(analysis.lastUpdated)} {analysis.updatedBy && `by ${analysis.updatedBy}`}</p>}
                </div>
              );
            })()}
          </div>
        )}
      </div>

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
                  ? 'text-white'
                  : 'bg-stone-800/50 text-stone-400 hover:bg-stone-700/50'
              }`}
              style={dateRange === range.key ? {
                background: 'var(--accent-gradient)',
                boxShadow: '0 4px 15px var(--accent-glow)'
              } : {}}
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
          color="accent"
          onClick={() => setActiveTab('orders')}
          accent={accent}
        />
        <div onClick={() => setActiveTab('spendTracker')} className="cursor-pointer">
        <StatCard 
          title="Total Spend" 
          value={formatCurrency(totalSpend)}
          icon="💰"
          color="accent"
          accent={accent}
        />
        </div>
        <div onClick={() => { setActiveTab('orders'); }} className="cursor-pointer">
        <StatCard 
          title="Pending" 
          value={filteredOrders.filter(o => o.status === 'pending').length}
          icon="⏳"
          color="accent"
          accent={accent}
        />
        </div>
        <div onClick={() => setActiveTab('orders')} className="cursor-pointer">
        <StatCard 
          title="Delivered" 
          value={filteredOrders.filter(o => o.status === 'delivered' || o.status === 'completed').length}
          icon="✅"
          color="accent"
          accent={accent}
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
          Reports
        </TabButton>
        <TabButton active={activeTab === 'dispatchTime'} onClick={() => setActiveTab('dispatchTime')}>
          Dispatch Time
        </TabButton>
        <TabButton active={activeTab === 'ai'} onClick={() => setActiveTab('ai')}>
          AI Insights {(totalOverOrderingAlerts + vendorPriceAlerts.length) > 0 && (
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
          <div className="glass-card-dark p-6">
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
          <div className="glass-card-dark p-6">
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
          <div className="glass-card-dark p-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-white font-medium">Select Month:</span>
              <div className="flex gap-2 flex-wrap">
                {months.map(month => (
                  <button
                    key={month.value}
                    onClick={() => setSelectedMonth(month.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedMonth === month.value
                        ? 'text-white'
                        : 'bg-stone-800/50 text-stone-400 hover:bg-stone-700/50'
                    }`}
                    style={selectedMonth === month.value ? {
                      background: 'var(--accent-gradient)',
                      boxShadow: '0 4px 15px var(--accent-glow)'
                    } : {}}
                  >
                    {month.label.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Revenue & Budget Management */}
          <div className="glass-card-dark p-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2" style={{ color: accent.primary }}>
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
                              className="px-4 py-1.5 text-sm rounded-lg transition-all"
                              style={{
                                background: `rgba(${accent.rgb},0.2)`,
                                color: accent.primary
                              }}
                              onMouseEnter={(e) => e.target.style.background = `rgba(${accent.rgb},0.3)`}
                              onMouseLeave={(e) => e.target.style.background = `rgba(${accent.rgb},0.2)`}
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
          <div className="glass-card-dark p-6">
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
          <div className="glass-card-dark p-6">
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
                        ? 'text-white'
                        : 'bg-stone-800/50 text-stone-400 hover:bg-stone-700/50'
                    }`}
                    style={selectedMonth === month.value ? {
                      background: 'var(--accent-gradient)',
                      boxShadow: '0 4px 15px var(--accent-glow)'
                    } : {}}
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
          <div className="glass-card-dark p-6">
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
                  className="glass-input-dark focus:outline-none focus:ring-2 focus:ring-amber-500/50"
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
          <div className="glass-card-dark p-6">
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
                      <div key={outlet} className="glass-card-dark p-6">
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
                    <div key={outlet} className="glass-card-dark overflow-hidden">
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
          <div className="glass-card-dark p-6">
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
          <div className="glass-card-dark p-6">
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
          <div className="glass-card-dark p-6">
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
                  className="glass-input-dark text-sm"
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
                  className="glass-input-dark text-sm"
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

            {/* Stock Difference Report Card */}
            <div 
              onClick={() => setActiveReport(activeReport === 'stockDifference' ? null : 'stockDifference')}
              className={`bg-stone-900/50 border rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.02] ${
                activeReport === 'stockDifference' ? 'border-teal-500/50 ring-2 ring-teal-500/20' : 'border-stone-800/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center">
                  <span className="text-2xl">⚖️</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Stock Difference</h3>
                  <p className="text-xs text-stone-500">Ordered vs Consumed</p>
                </div>
              </div>
              <p className="text-sm text-stone-400">Compare stock ordered against actual consumption to identify surplus or deficit.</p>
            </div>

            {/* Invoice Search Card */}
            <div 
              onClick={() => setActiveReport(activeReport === 'invoiceSearch' ? null : 'invoiceSearch')}
              className={`bg-stone-900/50 border rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.02] ${
                activeReport === 'invoiceSearch' ? 'border-amber-500/50 ring-2 ring-amber-500/20' : 'border-stone-800/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <span className="text-2xl">🔍</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Invoice Search</h3>
                  <p className="text-xs text-stone-500">Find orders quickly</p>
                </div>
              </div>
              <p className="text-sm text-stone-400">Search for orders by ID, outlet, or creator to view full details.</p>
            </div>
          </div>

          {/* DETAILED REPORT VIEW */}
          {activeReport && (
            <div className="glass-card-dark overflow-hidden animate-slide-up">
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
                                        <td className="px-4 py-3 text-right text-stone-400 text-sm">
                                          {formatDate(item.lastUpdated)}
                                          {item.updatedBy && <p className="text-xs text-blue-400">by {item.updatedBy}</p>}
                                        </td>
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
                                                    <span className="text-stone-400">
                                                      {formatDate(history.changedAt)}
                                                      {history.changedBy && <span className="text-blue-400 ml-2">by {history.changedBy}</span>}
                                                    </span>
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

              {/* Stock Difference Report Detail */}
              {activeReport === 'stockDifference' && (
                <>
                  <div className="p-4 bg-teal-500/10 border-b border-stone-800/50">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-teal-400 flex items-center gap-2">
                          <span>⚖️</span> Stock Difference Report
                        </h3>
                        <p className="text-sm text-stone-400 mt-1">Compare ordered vs consumed quantities</p>
                      </div>
                      <button onClick={() => setActiveReport(null)} className="text-stone-400 hover:text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-stone-700/50">
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-stone-500">Period:</label>
                        <select value={stockDiffPeriod} onChange={(e) => setStockDiffPeriod(e.target.value)}
                          className="px-2 py-1 bg-stone-800 border border-stone-700 rounded-lg text-white text-sm">
                          <option value="today">Today</option>
                          <option value="yesterday">Yesterday</option>
                          <option value="thisWeek">This Week</option>
                          <option value="lastWeek">Last Week</option>
                          <option value="lastMonth">Last Month</option>
                          <option value="last3Months">Last 3 Months</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-stone-500">Outlet:</label>
                        <select value={stockDiffOutlet} onChange={(e) => setStockDiffOutlet(e.target.value)}
                          className="px-2 py-1 bg-stone-800 border border-stone-700 rounded-lg text-white text-sm">
                          <option value="All">All Outlets</option>
                          {outlets.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-stone-500">Search:</label>
                        <input type="text" value={stockDiffItemFilter} onChange={(e) => setStockDiffItemFilter(e.target.value)}
                          placeholder="Filter item..." className="px-2 py-1 bg-stone-800 border border-stone-700 rounded-lg text-white text-sm w-32" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    {(() => {
                      const now = new Date();
                      let startDate, endDate;
                      switch(stockDiffPeriod) {
                        case 'today': startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1); break;
                        case 'yesterday': startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1); endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); break;
                        case 'thisWeek': const dow = now.getDay(); startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dow); endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1); break;
                        case 'lastWeek': const lwd = now.getDay(); startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - lwd - 7); endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - lwd); break;
                        case 'lastMonth': startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1); endDate = new Date(now.getFullYear(), now.getMonth(), 1); break;
                        case 'last3Months': startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1); endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1); break;
                        default: startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
                      }
                      const activeOutlets = stockDiffOutlet === 'All' ? outlets : [stockDiffOutlet];
                      const periodOrders = orders.filter(o => { const d = new Date(o.createdAt); return activeOutlets.includes(o.outlet) && d >= startDate && d < endDate && ['delivered','completed','dispatched'].includes(o.status); });
                      const orderedByItem = {};
                      periodOrders.forEach(order => { (order.items || []).forEach(item => { if (!orderedByItem[item.id]) orderedByItem[item.id] = { id: item.id, name: item.name, unit: item.unit, categoryId: item.categoryId, ordered: 0, consumed: 0 }; orderedByItem[item.id].ordered += item.quantity; }); });
                      activeOutlets.forEach(outlet => { (stockOutHistory?.[outlet] || []).forEach(entry => { const ed = new Date(entry.submittedAt); if (ed >= startDate && ed < endDate) { (entry.items || []).forEach(item => { if (item.used > 0) { if (!orderedByItem[item.id]) { const id = items.find(i => i.id === item.id); orderedByItem[item.id] = { id: item.id, name: item.name || id?.name || 'Unknown', unit: item.unit || id?.unit || '', categoryId: item.categoryId || id?.categoryId, ordered: 0, consumed: 0 }; } orderedByItem[item.id].consumed += item.used; } }); } }); });
                      let reportItems = Object.values(orderedByItem).filter(i => stockDiffItemFilter ? i.name.toLowerCase().includes(stockDiffItemFilter.toLowerCase()) : i.ordered > 0 || i.consumed > 0).map(i => ({ ...i, difference: i.ordered - i.consumed })).sort((a,b) => Math.abs(b.difference) - Math.abs(a.difference));
                      const totalOrdered = reportItems.reduce((s,i) => s + i.ordered, 0);
                      const totalConsumed = reportItems.reduce((s,i) => s + i.consumed, 0);
                      return (
                        <>
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="bg-stone-800/30 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-emerald-400">{totalOrdered.toFixed(1)}</p><p className="text-xs text-stone-400">Total Ordered</p></div>
                            <div className="bg-stone-800/30 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-red-400">{totalConsumed.toFixed(1)}</p><p className="text-xs text-stone-400">Total Consumed</p></div>
                            <div className="bg-stone-800/30 rounded-xl p-4 text-center"><p className={`text-2xl font-bold ${totalOrdered-totalConsumed >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>{totalOrdered-totalConsumed >= 0 ? '+' : ''}{(totalOrdered-totalConsumed).toFixed(1)}</p><p className="text-xs text-stone-400">Net Difference</p></div>
                          </div>
                          {reportItems.length === 0 ? <p className="text-center py-8 text-stone-500">No data for this period</p> : (
                            <div className="overflow-x-auto"><table className="w-full"><thead><tr className="text-left text-xs text-stone-500 uppercase border-b border-stone-700"><th className="pb-3">Item</th><th className="pb-3 text-right">Ordered</th><th className="pb-3 text-right">Consumed</th><th className="pb-3 text-right">Difference</th><th className="pb-3 text-right">Status</th></tr></thead><tbody>
                              {reportItems.slice(0,50).map(item => (<tr key={item.id} className="border-b border-stone-800/30 hover:bg-stone-800/20"><td className="py-3"><p className="text-white font-medium">{item.name}</p><p className="text-xs text-stone-500">{getCategoryName(item.categoryId)}</p></td><td className="py-3 text-right"><span className="text-emerald-400 font-medium">{item.ordered.toFixed(1)}</span><span className="text-stone-500 text-xs ml-1">{item.unit}</span></td><td className="py-3 text-right"><span className="text-red-400 font-medium">{item.consumed.toFixed(1)}</span><span className="text-stone-500 text-xs ml-1">{item.unit}</span></td><td className="py-3 text-right"><span className={`font-semibold ${item.difference >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>{item.difference >= 0 ? '+' : ''}{item.difference.toFixed(1)}</span></td><td className="py-3 text-right">{item.difference > 0 ? <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-lg">Surplus</span> : item.difference < 0 ? <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-lg">Deficit</span> : <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-lg">Balanced</span>}</td></tr>))}
                            </tbody></table></div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </>
              )}

              {/* Invoice Search Detail */}
              {activeReport === 'invoiceSearch' && (
                <>
                  <div className="p-4 bg-amber-500/10 border-b border-stone-800/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-amber-400 flex items-center gap-2"><span>🔍</span> Invoice Search</h3>
                        <p className="text-sm text-stone-400 mt-1">Search orders by ID, outlet, or creator</p>
                      </div>
                      <button onClick={() => setActiveReport(null)} className="text-stone-400 hover:text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex gap-3 mb-4">
                      <input type="text" value={invoiceSearchQuery} onChange={(e) => setInvoiceSearchQuery(e.target.value)} placeholder="Enter Order ID, outlet, or creator..." className="flex-1 px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-white placeholder-stone-500" />
                      <button onClick={() => { const q = invoiceSearchQuery.trim().toUpperCase(); if (!q) { setInvoiceSearchResults([]); return; } setInvoiceSearchResults(orders.filter(o => o.id.toUpperCase().includes(q) || o.outlet.toUpperCase().includes(q) || (o.createdBy && o.createdBy.toUpperCase().includes(q)))); }} className="px-6 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600">Search</button>
                    </div>
                    {invoiceSearchResults.length > 0 && (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        <p className="text-sm text-stone-400">{invoiceSearchResults.length} result(s)</p>
                        {invoiceSearchResults.map(order => (
                          <div key={order.id} className="bg-stone-800/50 rounded-xl p-4 border border-stone-700/30">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-white font-semibold">{order.id}</span>
                                <span className="px-2 py-0.5 bg-stone-700 text-stone-300 text-xs rounded-lg">{order.outlet}</span>
                                <span className={`px-2 py-0.5 text-xs rounded-lg ${order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : order.status === 'dispatched' ? 'bg-blue-500/20 text-blue-400' : order.status === 'delivered' || order.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : order.status === 'disputed' ? 'bg-red-500/20 text-red-400' : 'bg-stone-700 text-stone-400'}`}>{order.status}</span>
                              </div>
                              <span className="text-amber-400 font-semibold">{formatCurrency(order.totalAmount)}</span>
                            </div>
                            <p className="text-xs text-stone-500 mb-2">Created: {formatDate(order.createdAt)} by {order.createdBy}</p>
                            {order.dispatchedAt && <p className="text-xs text-stone-500">Dispatched: {formatDate(order.dispatchedAt)} by {order.dispatchedBy}</p>}
                            {order.acceptedAt && <p className="text-xs text-stone-500">Delivered: {formatDate(order.acceptedAt)} by {order.acceptedBy}</p>}
                            <div className="mt-3 border-t border-stone-700/50 pt-3"><p className="text-xs text-stone-400 mb-2">Items:</p><div className="space-y-1">{order.items.map((item, idx) => (<div key={idx} className="flex justify-between text-sm"><span className="text-stone-300">{item.name}</span><span className="text-stone-400">{item.quantity} {item.unit} × {formatCurrency(item.price)} = {formatCurrency(item.quantity * item.price)}</span></div>))}</div></div>
                            {order.dispute && <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-lg p-2"><p className="text-xs text-red-400">Dispute: {order.dispute.reason}</p>{order.dispute.notes && <p className="text-xs text-stone-500">{order.dispute.notes}</p>}</div>}
                          </div>
                        ))}
                      </div>
                    )}
                    {invoiceSearchQuery && invoiceSearchResults.length === 0 && <p className="text-stone-500 text-center py-4">No orders found</p>}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="glass-card-dark overflow-hidden">
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
          <div className="glass-card-dark p-4">
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

          <div className="glass-card-dark overflow-hidden">
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
function StatCard({ title, value, icon, color, accent }) {
  const colors = {
    amber: 'border-amber-500/30',
    blue: 'border-blue-500/30',
    emerald: 'border-emerald-500/30',
    purple: 'border-purple-500/30',
    red: 'border-red-500/30',
    accent: '', // Will use inline style
  };
  
  const iconColors = {
    amber: 'from-amber-500/20 to-orange-500/20',
    blue: 'from-blue-500/20 to-cyan-500/20',
    emerald: 'from-emerald-500/20 to-teal-500/20',
    purple: 'from-purple-500/20 to-pink-500/20',
    red: 'from-red-500/20 to-rose-500/20',
    accent: '', // Will use inline style
  };

  const useAccent = color === 'accent' && accent;

  return (
    <div 
      className={`glass-stat-card-dark ${!useAccent ? colors[color] : ''} animate-scale-in`}
      style={useAccent ? { borderColor: `rgba(${accent.rgb},0.3)` } : {}}
    >
      <div 
        className={`glass-icon-dark ${!useAccent ? `bg-gradient-to-br ${iconColors[color]}` : ''}`}
        style={useAccent ? { background: `rgba(${accent.rgb},0.2)` } : {}}
      >
        <span className="text-2xl">{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-stone-400">{title}</p>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`glass-tab glass-tab-dark ${active ? 'active' : ''}`}
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
    <div className="glass-card-dark overflow-hidden">
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
      <div className="glass-card-dark p-12 text-center">
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
        <div key={order.id} className="glass-card-dark overflow-hidden">
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
