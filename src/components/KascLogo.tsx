import React from 'react';

interface KascLogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'color';
}

export function KascLogo({ className = "w-16 h-16" }: KascLogoProps) {
  return (
    <svg 
      viewBox="0 0 300 300" 
      className={`${className} select-none`}
      xmlns="http://www.w3.org/2000/svg"
      id="kasc-svg-logo"
    >
      <defs>
        {/* Top text path - arch from left to right wrapping the top half of the circle */}
        <path id="kasc-text-path-top" d="M 35,150 A 115,115 0 0,1 265,150" fill="none" />
        {/* Bottom text path - elegant quadratic bezier curve allowing text to read left-to-right right-side-up */}
        <path id="kasc-text-path-bottom" d="M 50,225 Q 150,278 250,225" fill="none" />
      </defs>

      {/* Main Base Circles */}
      <circle cx="150" cy="150" r="142" fill="white" stroke="#1e2e6b" strokeWidth="6" />
      <circle cx="150" cy="150" r="118" fill="none" stroke="#1e2e6b" strokeWidth="2" />
      
      {/* Star/Floral separators framing the text */}
      <g fill="#1e2e6b">
        {/* Left divider symbol */}
        <path d="M 30,150 L 34,154 L 30,158 L 26,154 Z" />
        <circle cx="30" cy="154" r="1" fill="white" />
        
        {/* Right divider symbol */}
        <path d="M 270,150 L 274,154 L 270,158 L 266,154 Z" />
        <circle cx="270" cy="154" r="1" fill="white" />
      </g>

      {/* College Name Top Arc */}
      <text fill="#1e2e6b" className="font-sans" fontSize="13px" fontWeight="900" letterSpacing="0.4px">
        <textPath href="#kasc-text-path-top" startOffset="50%" textAnchor="middle">
          KONGUNADU ARTS AND SCIENCE COLLEGE
        </textPath>
      </text>

      {/* Coimbatore Location Bottom Arc */}
      <text fill="#1e2e6b" className="font-sans" fontSize="13px" fontWeight="800" letterSpacing="4px">
        <textPath href="#kasc-text-path-bottom" startOffset="50%" textAnchor="middle">
          COIMBATORE
        </textPath>
      </text>

      {/* Center Temple Gopuram/Gate Silhouette */}
      <g stroke="#1e2e6b" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Ground Foundations */}
        <path d="M 95,215 L 205,215" strokeWidth="3.5" />
        <path d="M 100,211 L 200,211" strokeWidth="2" />
        
        {/* Inner Arch opening */}
        <path d="M 126,211 L 126,170 C 126,148 174,148 174,170 L 174,211" strokeWidth="2.5" />
        <path d="M 132,211 L 132,174 C 132,156 168,156 168,174 L 168,211" strokeWidth="1" strokeDasharray="2,2" />

        {/* Pillars supporting the dome structure */}
        {/* Left Pillar */}
        <line x1="112" y1="211" x2="112" y2="152" strokeWidth="2.5" />
        <line x1="120" y1="211" x2="120" y2="152" strokeWidth="1.2" />
        <rect x="109" y="152" width="14" height="5" fill="#1e2e6b" />
        <path d="M 106,157 L 123,157 L 120,162 L 109,162 Z" fill="#1e2e6b" />

        {/* Right Pillar */}
        <line x1="188" y1="211" x2="188" y2="152" strokeWidth="2.5" />
        <line x1="180" y1="211" x2="180" y2="152" strokeWidth="1.2" />
        <rect x="177" y="152" width="14" height="5" fill="#1e2e6b" />
        <path d="M 174,157 L 191,157 L 188,162 L 177,162 Z" fill="#1e2e6b" />

        {/* Horizontal Tiers/Roofs */}
        <rect x="98" y="146" width="104" height="6" fill="#1e2e6b" />
        <rect x="105" y="137" width="90" height="9" fill="#1e2e6b" />
        
        {/* Middle Tier Arch Canopy */}
        <path d="M 111,137 C 111,116 189,116 189,137 Z" fill="#1e2e6b" opacity="0.15" />
        <path d="M 111,137 C 111,116 189,116 189,137" strokeWidth="2" />
        <path d="M 125,137 C 125,123 175,123 175,137" strokeWidth="1" />
        
        {/* Upper Tier Shikhara Cupola */}
        <path d="M 123,116 C 123,94 177,94 177,116 Z" fill="#1e2e6b" opacity="0.25" />
        <path d="M 123,116 C 123,94 177,94 177,116" strokeWidth="2" />
        
        {/* Highest Dome Pinnacle Base */}
        <path d="M 134,96 C 134,80 166,80 166,96 Z" fill="#1e2e6b" />

        {/* Center Golden Kalasha Pinnacle Spires */}
        <path d="M 150,80 L 150,45" strokeWidth="3" />
        <circle cx="150" cy="49" r="4" fill="#1e2e6b" />
        <circle cx="150" cy="58" r="3" fill="#1e2e6b" />
        <circle cx="150" cy="67" r="2" fill="#1e2e6b" />

        {/* Flanking left pinnacle */}
        <path d="M 130,116 L 130,100" strokeWidth="1.5" />
        <circle cx="130" cy="100" r="2" fill="#1e2e6b" />

        {/* Flanking right pinnacle */}
        <path d="M 170,116 L 170,100" strokeWidth="1.5" />
        <circle cx="170" cy="100" r="2" fill="#1e2e6b" />
      </g>

      {/* Slogans in Authentic College Red */}
      {/* left: அறிவு (Knowledge) */}
      <text x="72" y="166" fill="#e11d48" className="font-sans" fontSize="13px" fontWeight="900" textAnchor="middle">
        அறிவு
      </text>

      {/* right: உழைப்பு (Hard Work) */}
      <text x="228" y="166" fill="#e11d48" className="font-sans" fontSize="13px" fontWeight="900" textAnchor="middle">
        உழைப்பு
      </text>

      {/* center inside the portal: பண்பு (Virtue) */}
      <text x="150" y="174" fill="#e11d48" className="font-sans" fontSize="11px" fontWeight="bold" textAnchor="middle">
        பண்பு
      </text>

      {/* Foundation/ESTD metadata with elegant wheels */}
      <g transform="translate(0, 10)">
        {/* Left Wheel */}
        <g transform="translate(100, 227) scale(0.6)" fill="#1e2e6b">
          <circle cx="0" cy="0" r="5" fill="none" stroke="#1e2e6b" strokeWidth="2" />
          <path d="M -8,0 L 8,0 M 0,-8 L 0,8 M -5,-5 L 5,5 M -5,5 L 5,-5" stroke="#1e2e6b" strokeWidth="1.2" />
        </g>

        {/* ESTD Text */}
        <text x="150" y="231" fill="#e11d48" className="font-mono" fontSize="11.5px" fontWeight="900" letterSpacing="0.5px" textAnchor="middle" dominantBaseline="middle">
          ESTD. 1973
        </text>

        {/* Right Wheel */}
        <g transform="translate(200, 227) scale(0.6)" fill="#1e2e6b">
          <circle cx="0" cy="0" r="5" fill="none" stroke="#1e2e6b" strokeWidth="2" />
          <path d="M -8,0 L 8,0 M 0,-8 L 0,8 M -5,-5 L 5,5 M -5,5 L 5,-5" stroke="#1e2e6b" strokeWidth="1.2" />
        </g>
      </g>
    </svg>
  );
}
