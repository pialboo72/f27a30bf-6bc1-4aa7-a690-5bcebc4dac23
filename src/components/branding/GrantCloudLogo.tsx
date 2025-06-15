
import * as React from "react";

interface GrantCloudLogoProps {
  size?: number;
  className?: string;
}

const GrantCloudLogo: React.FC<GrantCloudLogoProps> = ({
  size = 48,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 60 60"
    fill="none"
    className={className}
    aria-label="GrantCloud Logo"
  >
    <defs>
      <linearGradient id="cloudGradient" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
        <stop stopColor="#60A5FA" />     {/* brand-400 */}
        <stop offset="1" stopColor="#2563EB" /> {/* brand-600 */}
      </linearGradient>
    </defs>
    {/* 雲朵 */}
    <ellipse cx="32" cy="34" rx="18" ry="11" fill="url(#cloudGradient)" />
    <ellipse cx="24" cy="39" rx="11" ry="8" fill="url(#cloudGradient)" opacity="0.88" />
    {/* 文件主體 */}
    <rect x="18" y="12" width="20" height="26" rx="3" fill="#fff" stroke="#2563EB" strokeWidth="2" />
    {/* 文件摺角 */}
    <polyline points="34,12 38,16 34,16" fill="#E0E7FF" stroke="#2563EB" strokeWidth="1" />
    {/* 細節線條 */}
    <rect x="22" y="18" width="12" height="2" rx="1" fill="#60A5FA"/>
    <rect x="22" y="23" width="10" height="2" rx="1" fill="#93C5FD"/>
    <rect x="22" y="28" width="8" height="2" rx="1" fill="#93C5FD"/>
  </svg>
);

export default GrantCloudLogo;
