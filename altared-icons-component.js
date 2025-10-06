/**
 * Altared Alchemie Icon Pack
 * Custom icons designed for the Altared Alchemie brand
 * 
 * Colors:
 * - Primary: currentColor (inherits from parent)
 * - Accent: #E11D48 (brand rose/red)
 * 
 * Usage:
 * import { Icons } from './Icons';
 * 
 * <div className="w-16 h-16 text-white">
 *   <Icons.AIWebsite />
 * </div>
 */

export const Icons = {
  // Core Services
  AIWebsite: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="2" y="3" width="20" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M2 7h20" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="5" cy="5" r="0.5" fill="currentColor"/>
      <circle cx="7" cy="5" r="0.5" fill="currentColor"/>
      <circle cx="9" cy="5" r="0.5" fill="currentColor"/>
      <path d="M12 13.5l-2.5 3 2.5-3 2.5 3-2.5-3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 16.5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M13.5 12c0 .83-.67 1.5-1.5 1.5" stroke="#E11D48" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),

  Chatbot: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="4" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 21l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="9" cy="9" r="1.5" fill="currentColor"/>
      <circle cx="15" cy="9" r="1.5" fill="currentColor"/>
      <path d="M9 12.5c0 .83.67 1.5 1.5 1.5h1.5" stroke="#E11D48" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 14c.83 0 1.5-.67 1.5-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),

  AIAvatar: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16 8c1.38 0 2.5-1.12 2.5-2.5" stroke="#E11D48" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 8c-1.38 0-2.5-1.12-2.5-2.5" stroke="#E11D48" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="11" cy="7.5" r="0.5" fill="currentColor"/>
      <circle cx="13" cy="7.5" r="0.5" fill="currentColor"/>
    </svg>
  ),

  ContentGeneration: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 9h8M8 12h5M8 15h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="17" cy="17" r="3.5" fill="#0B0B0B" stroke="#E11D48" strokeWidth="1.5"/>
      <path d="M17 15.5v3M15.5 17h3" stroke="#E11D48" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),

  // Strategy
  StrategyAudit: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 12L8 8M12 12l4-4M12 12l-4 4M12 12l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="8" cy="8" r="1.5" fill="#E11D48"/>
      <circle cx="16" cy="8" r="1.5" stroke="#E11D48" strokeWidth="1.5"/>
      <circle cx="8" cy="16" r="1.5" stroke="#E11D48" strokeWidth="1.5"/>
      <circle cx="16" cy="16" r="1.5" stroke="#E11D48" strokeWidth="1.5"/>
    </svg>
  ),

  Automation: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M3 12h3M18 12h3M12 3v3M12 18v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M17.5 6.5l-2 2M17.5 17.5l-2-2M6.5 6.5l2 2M6.5 17.5l2-2" stroke="#E11D48" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="17.5" cy="6.5" r="1.5" fill="#E11D48"/>
      <circle cx="6.5" cy="17.5" r="1.5" stroke="#E11D48" strokeWidth="1"/>
    </svg>
  ),

  Analytics: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7 15v2M12 11v6M17 8v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="7" cy="15" r="1.5" fill="#E11D48"/>
      <circle cx="12" cy="11" r="1.5" fill="#E11D48"/>
      <circle cx="17" cy="8" r="1.5" fill="#E11D48"/>
      <path d="M7 15l5-4 5-3" stroke="#E11D48" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),

  // Training
  Training: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 3l9 5-9 5-9-5 9-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 13l9 5 9-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 18l9 5 9-5" stroke="#E11D48" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="19" cy="11" r="2" fill="#E11D48"/>
    </svg>
  ),

  // Specialized Services
  Ecommerce: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M3 5h18l-2 7H5L3 5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="9" cy="17" r="1" fill="#E11D48"/>
      <circle cx="15" cy="17" r="1" fill="#E11D48"/>
      <path d="M9 2h6v3H9V2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),

  TikTokShop: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M14 7v5c0 1.66-1.34 3-3 3s-3-1.34-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 9c1.1 0 2-.9 2-2" stroke="#E11D48" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="11" cy="12" r="1.5" fill="#E11D48"/>
      <path d="M4 17l16 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),

  AEMConsulting: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="3" y="4" width="8" height="16" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="13" y="4" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="13" y="14" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6 8h2M6 11h2M6 14h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="17" cy="8" r="1.5" fill="#E11D48"/>
      <path d="M15 17h4" stroke="#E11D48" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),

  // Metrics
  TimeSaved: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16.24 7.76a7 7 0 11-8.48 0" stroke="#E11D48" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="1.5" fill="#E11D48"/>
    </svg>
  ),

  Revenue: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M3 12l6-6 4 4 8-8" stroke="#E11D48" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 4v4h-4" stroke="#E11D48" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 20h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="3" cy="12" r="1.5" fill="#E11D48"/>
      <circle cx="9" cy="6" r="1.5" fill="currentColor"/>
      <circle cx="13" cy="10" r="1.5" fill="currentColor"/>
    </svg>
  ),

  ContentVelocity: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M4 12h16M4 8h16M4 16h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M15 3l6 9-6 9" stroke="#E11D48" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="6" cy="12" r="1.5" fill="#E11D48"/>
      <circle cx="6" cy="8" r="1" fill="currentColor"/>
      <circle cx="6" cy="16" r="1" fill="currentColor"/>
    </svg>
  ),

  // Brand Values
  FaithDriven: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2v8m0 0h8m-8 0H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 12v8" stroke="#E11D48" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="10" r="1.5" fill="#E11D48"/>
    </svg>
  ),

  Excellence: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2l3 6 6 1-4.5 4.5L18 20l-6-3-6 3 1.5-6.5L3 9l6-1 3-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="10" r="2" fill="#E11D48"/>
      <path d="M12 2v20" stroke="#E11D48" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),

  Integrity: (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2L4 6v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V6l-8-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 12l2 2 4-4" stroke="#E11D48" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

// Export individual icons for tree-shaking
export const AIWebsite = Icons.AIWebsite;
export const Chatbot = Icons.Chatbot;
export const AIAvatar = Icons.AIAvatar;
export const ContentGeneration = Icons.ContentGeneration;
export const StrategyAudit = Icons.StrategyAudit;
export const Automation = Icons.Automation;
export const Analytics = Icons.Analytics;
export const Training = Icons.Training;
export const Ecommerce = Icons.Ecommerce;
export const TikTokShop = Icons.TikTokShop;
export const AEMConsulting = Icons.AEMConsulting;
export const TimeSaved = Icons.TimeSaved;
export const Revenue = Icons.Revenue;
export const ContentVelocity = Icons.ContentVelocity;
export const FaithDriven = Icons.FaithDriven;
export const Excellence = Icons.Excellence;
export const Integrity = Icons.Integrity;

export default Icons;