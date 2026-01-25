"use client";

import { useImageSettings } from "../contexts/ImageSettingsContext";

interface DevicesProps {
  selectedImage?: string | null;
  className?: string;
  deviceType?: "imac" | "windows" | "tablet" | "android" | "ios" | "watch" | "macos" | "windowslaptop" | "tv";
}

interface DeviceComponentProps {
  className?: string;
}

function IOSDevice({ className = "" }: DeviceComponentProps) {
  return (
    <div className={`relative ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 326.3 675.02"
        className="w-full h-full"
      >
        <g fill="currentColor" stroke="currentColor" strokeMiterlimit="10" className="fill-primary stroke-primary">
          {/* Side buttons */}
          <line x1="324.8" y1="210.43" x2="324.8" y2="290.13" strokeWidth="3" strokeLinecap="round" />
          <line x1="1.5" y1="138.86" x2="1.5" y2="169.44" strokeWidth="3" strokeLinecap="round" />
          <line x1="1.5" y1="192.97" x2="1.5" y2="242.63" strokeWidth="3" strokeLinecap="round" />
          <line x1="1.5" y1="257.05" x2="1.5" y2="307.69" strokeWidth="3" strokeLinecap="round" />

          {/* Outer body */}
          <rect x="2.31" y=".5" width="321.83" height="674.02" rx="56.77" ry="56.77" className="fill-tertiary stroke-tertiary" />

          {/* Inner frame */}
          <rect x="7.23" y="5.09" width="312.58" height="665.35" rx="52.34" ry="52.34" className="fill-primary stroke-primary" />

          {/* Screen */}
          <rect x="12.72" y="11.74" width="300.14" height="652.34" rx="44.24" ry="44.24" fill="none" className="fill-background stroke-primary" />

          {/* Speaker */}
          <rect x="115.95" y="21.21" width="93.9" height="28.08" rx="14.04" ry="14.04" className="fill-primary stroke-primary" />

          {/* Camera (outer) */}
          <circle cx="195.45" cy="35.25" r="5.24" className="fill-primary stroke-tertiary" strokeWidth="0.5" strokeMiterlimit="10" />
          {/* Camera (inner) */}
          <circle cx="195.45" cy="35.25" r="3.25" className="fill-tertiary stroke-tertiary" strokeWidth="0.5" strokeMiterlimit="10" />

          {/* Sensor */}
          <circle cx="127.73" cy="35.25" r=".73" className="fill-tertiary stroke-tertiary" />
        </g>

        {/* Image container within screen */}
        <foreignObject
          x="12.72"
          y="11.74"
          width="300.14"
          height="652.34"
          clipPath="url(#iosScreenClip)"
        >
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-base font-medium text-foreground/40">Coming Soon</span>
          </div>
        </foreignObject>

        {/* Clip path for screen area */}
        <defs>
          <clipPath id="iosScreenClip">
            <rect x="12.72" y="11.74" width="300.14" height="652.34" rx="44.24" ry="44.24" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function AndroidDevice({ className = "" }: DeviceComponentProps) {
  return (
    <div className={`relative ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 309.08 630.86"
        className="w-full h-full"
      >
        {/* Side buttons */}
        <line
          x1="307.49"
          y1="139.38"
          x2="307.49"
          y2="172.29"
          fill="none"
          className="stroke-primary"
          strokeWidth="3"
          strokeLinecap="round"
          strokeMiterlimit="10"
        />

        <line
          x1="307.58"
          y1="231.79"
          x2="307.58"
          y2="286.98"
          fill="none"
          className="stroke-primary"
          strokeWidth="3"
          strokeLinecap="round"
          strokeMiterlimit="10"
        />

        {/* Outer frame */}
        <rect
          x="0.5"
          y="0.5"
          width="306.29"
          height="629.86"
          rx="31.45"
          ry="31.45"
          className="fill-tertiary stroke-tertiary"
          strokeMiterlimit="10"
        />

        {/* Middle frame */}
        <rect
          x="4.55"
          y="3.83"
          width="298.41"
          height="621.98"
          rx="29.64"
          ry="29.64"
          className="fill-primary stroke-primary"
          strokeLinecap="round"
          strokeMiterlimit="10"
        />

        {/* Screen area */}
        <rect
          x="12.5"
          y="12.32"
          width="281.49"
          height="578.82"
          rx="15.89"
          ry="15.89"
          className="fill-background stroke-primary"
          strokeLinecap="round"
          strokeMiterlimit="10"
        />

        {/* Top notch/speaker area */}
        <path
          d="M93.28,12.32l3.04,1.52,1.84,1.95,1.95,2.06.98,2.71v11.93s1.52,11.93,13.45,13.55,71.67.43,71.67.43l3.14-.11s10.63-2.71,11.93-11.49.76-9.87.76-9.87l.11-2.71,1.19-4.23,2.49-3.14,1.73-2.6"
          className="fill-primary stroke-primary"
          strokeLinecap="round"
          strokeMiterlimit="10"
        />

        {/* Front camera (outer) */}
        <circle
          cx="122.04"
          cy="31.56"
          r="5.79"
          className="fill-primary stroke-tertiary"
          strokeWidth="0.5"
          strokeMiterlimit="10"
        />

        {/* Front camera (inner) */}
        <circle
          cx="122.04"
          cy="31.56"
          r="3.6"
          className="fill-tertiary stroke-tertiary"
          strokeWidth="0.5"
          strokeMiterlimit="10"
        />

        {/* Secondary sensor (outer) */}
        <circle
          cx="184.11"
          cy="31.56"
          r="5.79"
          className="fill-primary stroke-tertiary"
          strokeWidth="0.5"
          strokeMiterlimit="10"
        />

        {/* Secondary sensor (inner) */}
        <circle
          cx="184.11"
          cy="31.56"
          r="3.6"
          className="fill-tertiary stroke-tertiary"
          strokeWidth="0.5"
          strokeMiterlimit="10"
        />

        {/* Speaker grille */}
        <rect
          x="138.5"
          y="31.56"
          width="30.07"
          height="5.79"
          rx="1.71"
          ry="1.71"
          className="fill-tertiary stroke-tertiary"
          strokeWidth="0.5"
          strokeMiterlimit="10"
        />

        {/* Home indicator */}
        <rect
          x="106.48"
          y="607.87"
          width="87.98"
          height="4.7"
          rx="1.71"
          ry="1.71"
          className="fill-tertiary stroke-tertiary"
          strokeWidth="0.5"
          strokeMiterlimit="10"
        />

        {/* Image container within screen */}
        <foreignObject
          x="12.5"
          y="12.32"
          width="281.49"
          height="578.82"
          clipPath="url(#androidScreenClip)"
        >
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-base font-medium text-foreground/40">Coming Soon</span>
          </div>
        </foreignObject>

        {/* Clip path for screen area */}
        <defs>
          <clipPath id="androidScreenClip">
            <rect x="12.5" y="12.32" width="281.49" height="578.82" rx="15.89" ry="15.89" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function WatchDevice({ className = "" }: DeviceComponentProps) {
  return (
    <div className={`relative ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 350.47 539.81"
        className="w-full h-full"
      >
        {/* Outer watch frame */}
        <rect
          x="0.5"
          y="88.8"
          width="330"
          height="383"
          rx="77"
          ry="77"
          className="fill-tertiary stroke-tertiary"
          strokeMiterlimit="10"
        />

        {/* Middle frame */}
        <rect
          x="13.5"
          y="104.8"
          width="309"
          height="358"
          rx="59.5"
          ry="59.5"
          className="fill-primary stroke-primary"
          strokeMiterlimit="10"
        />

        {/* Screen area */}
        <rect
          x="37.5"
          y="137.8"
          width="254"
          height="291"
          rx="30"
          ry="30"
          className="fill-background stroke-background"
          strokeMiterlimit="10"
        />

        {/* Crown/button on right side */}
        <path
          d="M330.5,176.71l15.12,1.3s4.55,1.52,4.34,26.24c-.22,24.72-1.08,28.41-1.08,28.41,0,0-.87,2.82-.98,3.69s-2.17,3.9-2.17,3.9l-2.49,1.95-4.01.43h-8.72"
          className="fill-primary stroke-primary"
          strokeMiterlimit="10"
        />

        {/* Bottom strap connection */}
        <path
          d="M283.04,465.93s-7.9,3.98-13.54,13.52-7.16,19.95-8.02,21.9-3.69,20.82-3.69,20.82l-1.95,5.86-3.9,6.51-2.6,4.77H79.23l-5.2-2.96-3.9-5.06-2.46-6.07-1.45-6.65-1.01-9.83-1.01-7.23-2.02-10.84-3.47-8.1-2.31-5.93-2.02-4.83-5-5.3"
          className="fill-tertiary stroke-tertiary"
          strokeMiterlimit="10"
        />

        {/* Top strap connection */}
        <path
          d="M49.15,94.19l2.72-2.39,3.69-4.88,2.28-4.88,2.39-4.55,2.93-5.31,1.3-7.27,1.95-9.65.76-7.7,1.08-8.89,1.63-8.46,1.95-8.78,1.41-8.35,2.17-5.86,2.17-3.58,3.25-3.14,171.98.22,3.04,1.63,3.14,3.36,1.3,3.8,1.95,5.53,1.63,6.61,1.73,6.4,1.19,9.54,1.3,7.27s.65,3.36,1.08,7.81.65,3.8.65,3.8l.87,6.72,1.08,4.34,2.06,6.4.76,4.55,1.19,3.36,3.25,5.31,3.69,4.88,3.93,4.27"
          className="fill-tertiary stroke-tertiary"
          strokeMiterlimit="10"
        />

        {/* Top strap ellipses */}
        <ellipse cx="120.8" cy="5.42" rx="13.52" ry="4.92" className="fill-primary stroke-primary" />
        <ellipse cx="206.46" cy="5.42" rx="12.87" ry="4.7" className="fill-primary stroke-primary" />
        <ellipse cx="165.58" cy="17.52" rx="14.92" ry="8.6" className="fill-primary stroke-primary" />
        <ellipse cx="119.64" cy="31.69" rx="17.57" ry="11.78" className="fill-primary stroke-primary" />
        <ellipse cx="166.69" cy="53.04" rx="17.55" ry="16.13" className="fill-primary stroke-primary" />
        <ellipse cx="211.47" cy="31.87" rx="16.97" ry="14.35" className="fill-primary stroke-primary" />

        {/* Bottom strap ellipses */}
        <ellipse cx="163.07" cy="502.38" rx="19.97" ry="12.85" className="fill-primary stroke-primary" />
        <ellipse cx="116.68" cy="519.5" rx="18.07" ry="9.33" className="fill-primary stroke-primary" />
        <ellipse cx="162.54" cy="530.05" rx="17.96" ry="6.72" className="fill-primary stroke-primary" />
        <ellipse cx="208.05" cy="520.51" rx="18.8" ry="8.89" className="fill-primary stroke-primary" />
        <ellipse cx="118.63" cy="536.52" rx="16.12" ry="2.78" className="fill-primary stroke-primary" />
        <ellipse cx="204.01" cy="537.17" rx="16.63" ry="2.13" className="fill-primary stroke-primary" />

        {/* Image container within screen */}
        <foreignObject
          x="37.5"
          y="137.8"
          width="254"
          height="291"
          clipPath="url(#watchScreenClip)"
        >
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-base font-medium text-foreground/40">Coming Soon</span>
          </div>
        </foreignObject>

        {/* Clip path for screen area */}
        <defs>
          <clipPath id="watchScreenClip">
            <rect x="37.5" y="137.8" width="254" height="291" rx="30" ry="30" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function MacOSDevice({ className = "" }: DeviceComponentProps) {
  return (
    <div className={`relative ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 491.39 298.85"
        className="w-full h-full"
      >
        {/* Stand feet */}
        <line
          x1="441.03"
          y1="296.85"
          x2="466.73"
          y2="296.85"
          fill="none"
          className="stroke-primary"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          strokeMiterlimit="10"
        />

        <line
          x1="25.01"
          y1="296.85"
          x2="50.7"
          y2="296.85"
          fill="none"
          className="stroke-primary"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          strokeMiterlimit="10"
        />

        {/* Outer frame */}
        <path
          d="M48.84.5h393.6c5.62,0,10.17,4.56,10.17,10.17v269.37H38.67V10.67c0-5.62,4.56-10.17,10.17-10.17Z"
          className="fill-primary stroke-primary"
          strokeMiterlimit="10"
        />

        {/* Screen area */}
        <path
          d="M51.32,5.87h390.07c3.51,0,6.36,2.85,6.36,6.36v253.99H44.96V12.23c0-3.51,2.85-6.36,6.36-6.36Z"
          className="fill-background stroke-primary"
          strokeMiterlimit="10"
        />

        {/* Bottom bezel */}
        <path
          d="M.5,280.04h490.39v8.7c0,4.47-3.63,8.11-8.11,8.11H8.61c-4.47,0-8.11-3.63-8.11-8.11v-8.7h0Z"
          className="fill-tertiary stroke-tertiary"
          strokeMiterlimit="10"
        />

        {/* Top notch/camera area */}
        <path
          d="M222.72,5.87c1.56.84,1.88,3.12,1.75,4.8-.08,1.73.76,2.63,2.05,2.68,1.07.02,3.95,0,7.29,0,9.33,0,21.93,0,31.15,0,2.49-.12,2.25-3.45,2.45-5.15.14-.72.8-1.49,1.57-2.33"
          className="fill-primary stroke-primary"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          strokeMiterlimit="10"
        />

        {/* Camera (outer) */}
        <circle
          cx="245.64"
          cy="9.61"
          r="2.7"
          className="fill-primary stroke-tertiary"
          strokeWidth="0.5"
          strokeMiterlimit="10"
        />

        {/* Camera (inner) */}
        <circle
          cx="245.64"
          cy="9.61"
          r="1.68"
          className="fill-secondary stroke-tertiary"
          strokeWidth="0.5"
          strokeMiterlimit="10"
        />

        {/* Microphones */}
        <circle
          cx="231.76"
          cy="9.61"
          r="0.73"
          className="fill-tertiary stroke-tertiary"
          strokeMiterlimit="10"
        />

        <circle
          cx="260.36"
          cy="9.61"
          r="0.73"
          className="fill-tertiary stroke-tertiary"
          strokeMiterlimit="10"
        />

        {/* Bottom detail/logo area */}
        <path
          d="M207.61,280.04s.94,3.78,2.6,4.86,9.76,1.08,9.76,1.08l28.7-.36,17.42-.22,11.57.07s6,1.27,6.22-5.44"
          className="fill-primary stroke-primary"
          strokeMiterlimit="10"
        />

        {/* Image container within screen */}
        <foreignObject
          x="51.32"
          y="5.87"
          width="390.07"
          height="253.99"
          clipPath="url(#macosScreenClip)"
        >
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-base font-medium text-foreground/40">Coming Soon</span>
          </div>
        </foreignObject>

        {/* Clip path for screen area */}
        <defs>
          <clipPath id="macosScreenClip">
            <path d="M51.32,5.87h390.07c3.51,0,6.36,2.85,6.36,6.36v253.99H44.96V12.23c0-3.51,2.85-6.36,6.36-6.36Z" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function TabletDevice({ className = "" }: DeviceComponentProps) {
  return (
    <div className={`relative ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 538.88 389.89"
        className="w-full h-full"
      >
        {/* Top connectors */}
        <line
          x1="42.91"
          y1="1"
          x2="64.38"
          y2="1"
          fill="none"
          className="stroke-primary"
          strokeWidth="2"
          strokeLinecap="round"
          strokeMiterlimit="10"
        />

        <line
          x1="72.05"
          y1="1"
          x2="93.19"
          y2="1"
          fill="none"
          className="stroke-primary"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
        />

        {/* Side connector */}
        <line
          x1="1"
          y1="29.45"
          x2="1"
          y2="54.82"
          fill="none"
          className="stroke-primary"
          strokeWidth="2"
          strokeLinecap="round"
          strokeMiterlimit="10"
        />

        {/* Main tablet frame */}
        <rect
          x="1.63"
          y="2.06"
          width="536.75"
          height="387.33"
          rx="25.54"
          ry="25.54"
          className="fill-primary stroke-primary"
          strokeMiterlimit="10"
        />

        {/* Screen area */}
        <rect
          x="20.08"
          y="21.26"
          width="498.14"
          height="347.64"
          rx="9.76"
          ry="9.76"
          className="fill-background stroke-primary"
          strokeMiterlimit="10"
        />

        {/* Side buttons */}
        <circle
          cx="10.63"
          cy="224.67"
          r="2.68"
          className="fill-tertiary stroke-tertiary"
          strokeMiterlimit="10"
        />

        <circle
          cx="10.63"
          cy="208.47"
          r="3.19"
          className="fill-tertiary stroke-tertiary"
          strokeMiterlimit="10"
        />

        <circle
          cx="10.63"
          cy="167.37"
          r="3.19"
          className="fill-tertiary stroke-tertiary"
          strokeMiterlimit="10"
        />

        <circle
          cx="10.63"
          cy="182.86"
          r="0.73"
          className="fill-tertiary stroke-tertiary"
          strokeMiterlimit="10"
        />

        {/* Power button (outer) */}
        <circle
          cx="10.63"
          cy="195.8"
          r="3.46"
          className="fill-primary stroke-tertiary"
          strokeWidth="0.5"
          strokeMiterlimit="10"
        />

        {/* Power button (inner) */}
        <circle
          cx="10.63"
          cy="195.8"
          r="2.15"
          className="fill-accent stroke-tertiary"
          strokeWidth="0.5"
          strokeMiterlimit="10"
        />

        {/* Image container within screen */}
        <foreignObject
          x="20.08"
          y="21.26"
          width="498.14"
          height="347.64"
          clipPath="url(#tabletScreenClip)"
        >
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-base font-medium text-foreground/40">Coming Soon</span>
          </div>
        </foreignObject>

        {/* Clip path for screen area */}
        <defs>
          <clipPath id="tabletScreenClip">
            <rect x="20.08" y="21.26" width="498.14" height="347.64" rx="9.76" ry="9.76" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function WindowsDevice({ className = "" }: DeviceComponentProps) {
  return (
    <div className={`relative ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 514.98 395.48"
        className="w-full h-full"
      >
        {/* Stand/Base vertical */}
        <rect
          x="222.14"
          y="299.78"
          width="71.35"
          height="88.27"
          className="fill-tertiary stroke-tertiary"
          strokeMiterlimit="10"
        />

        {/* Stand connection */}
        <path
          d="M248.81,299.78h20.08v32.68c0,5.54-4.5,10.04-10.04,10.04h0c-5.54,0-10.04-4.5-10.04-10.04v-32.68Z"
          className="fill-background stroke-background"
          strokeMiterlimit="10"
        />

        {/* Main monitor frame */}
        <rect
          x="0.5"
          y="0.5"
          width="513.98"
          height="299.28"
          rx="8.46"
          ry="8.46"
          className="fill-primary stroke-primary"
          strokeMiterlimit="10"
        />

        {/* Screen area */}
        <rect
          x="9.17"
          y="8.31"
          width="497.06"
          height="276.72"
          className="fill-background stroke-primary"
          strokeMiterlimit="10"
        />

        {/* Power button indicator */}
        <path
          d="M487.72,291.68h0.75c0.55,0,1,0.45,1,1v7.1h-2.75v-7.1c0-0.55,0.45-1,1-1Z"
          className="fill-accent stroke-accent"
          strokeMiterlimit="10"
        />

        {/* Base foot */}
        <path
          d="M187.01,388.04h140.53c1.92,0,3.47,1.55,3.47,3.47v3.47h-147.47v-3.47c0-1.92,1.55-3.47,3.47-3.47Z"
          className="fill-tertiary stroke-tertiary"
          strokeMiterlimit="10"
        />

        {/* Image container within screen */}
        <foreignObject
          x="9.17"
          y="8.31"
          width="497.06"
          height="276.72"
          clipPath="url(#windowsScreenClip)"
        >
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-base font-medium text-foreground/40">Coming Soon</span>
          </div>
        </foreignObject>

        {/* Clip path for screen area */}
        <defs>
          <clipPath id="windowsScreenClip">
            <rect x="9.17" y="8.31" width="497.06" height="276.72" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function WindowsLaptopDevice({ className = "" }: DeviceComponentProps) {
  return (
    <div className={`relative ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 511.07 292.05"
        className="w-full h-full"
      >
        {/* Outer frame */}
        <path
          d="M39.91.5h433.11c3.33,0,6.03,2.7,6.03,6.03v270.5H33.88V6.53c0-3.33,2.7-6.03,6.03-6.03Z"
          className="fill-primary stroke-primary"
          strokeMiterlimit="10"
        />

        {/* Screen area */}
        <rect
          x="42.28"
          y="8.84"
          width="427.81"
          height="240"
          className="fill-background stroke-primary"
          strokeMiterlimit="10"
        />

        {/* Bottom base */}
        <path
          d="M.5,282.82c9.98,6.65,34.55,8.53,34.55,8.53,0,0,422.31.72,442.12-.58s33.4-7.37,33.4-7.37v-6.36H.5v5.78Z"
          className="fill-tertiary stroke-tertiary"
          strokeMiterlimit="10"
        />

        {/* Center line */}
        <line
          x1="245.85"
          y1="282.24"
          x2="266.96"
          y2="282.24"
          className="stroke-primary"
          strokeWidth="2"
          strokeLinecap="round"
          strokeMiterlimit="10"
        />

        {/* Logo / text paths */}
        <path
          d="M265,266.31v-8.16h1.89v6.5h3.31v1.65h-5.2ZM249.95,261.23l4.61-3.54c.43.35.87.71,1.3,1.06l-4.37,3.31.94.83,4.37-3.43c.43.35.87.71,1.3,1.06-1.45,1.15-2.91,2.29-4.37,3.43l.94.83,4.37-3.55v-3.07h1.89v6.5h3.43v1.65h-5.2v-3.07c-1.54,1.18-3.07,2.36-4.61,3.54l-4.61-3.54c-.22,1.13-1.01,2.1-2.03,2.62-.44.23-.92.37-1.41.43-.28.03-.57.03-.85.03h-2.91v-8.15h3.36c.88,0,1.73.31,2.42.86.7.56,1.2,1.35,1.43,2.21M244.54,259.75v4.96h1.47c.63-.02,1.21-.32,1.6-.81.66-.83.77-1.98.28-2.92-.31-.59-.86-1.03-1.51-1.18-.26-.06-.52-.05-.78-.05h-1.06Z"
          className="fill-background stroke-background"
          strokeMiterlimit="10"
        />

        {/* Image container within screen */}
        <foreignObject
          x="42.28"
          y="8.84"
          width="427.81"
          height="240"
          clipPath="url(#windowsLaptopScreenClip)"
        >
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-base font-medium text-foreground/40">Coming Soon</span>
          </div>
        </foreignObject>

        {/* Clip path for screen area */}
        <defs>
          <clipPath id="windowsLaptopScreenClip">
            <rect x="42.28" y="8.84" width="427.81" height="240" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function TVDevice({ className = "" }: DeviceComponentProps) {
  return (
    <div className={`relative ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 491.34 308.51"
        className="w-full h-full"
      >
        {/* Outer frame */}
        <rect
          x="0.5"
          y="0.5"
          width="490.34"
          height="279.33"
          rx="5.96"
          ry="5.96"
          className="fill-primary stroke-primary"
          strokeMiterlimit="10"
        />

        {/* Screen area */}
        <rect
          x="7.37"
          y="6.86"
          width="477.11"
          height="264.87"
          className="fill-background stroke-primary"
          strokeMiterlimit="10"
        />

        {/* Stand top */}
        <path
          d="M181.3,279.83s9.25,5.06,15.61,5.64c3,.27,24.29.42,45.98.49,24.33.09,49.16.09,49.16.09,0,0,8.67-1.59,18.36-6.22"
          className="fill-tertiary stroke-tertiary"
          strokeMiterlimit="10"
        />

        {/* Stand base */}
        <path
          d="M248.23,286.04c9.96,4.32,19.61,8.41,30.54,10.23,15.65,2.36,31.76,2.82,47.57,4.33,9.9.82,20.34,2.01,25.96,3.26,1.9.52,4.27.75,5.5,2.14.33,1.63-5.7,1.9-10.64,2-5.53.05-12.76-.34-19.52-1-31.81-3.43-64.07-9.87-96.25-7.92-28.9,1.22-59.22,6.95-88.38,7.73-6.65.15-16.85-.57-7.08-3.16,7.33-2.05,25.7-3.86,37.3-4.56,11.72-.92,23.57-1.31,35.19-2.83,12.13-1.66,23.34-5.85,34.47-10.31"
          className="fill-tertiary stroke-tertiary"
          strokeMiterlimit="10"
        />

        {/* Image container within screen */}
        <foreignObject
          x="7.37"
          y="6.86"
          width="477.11"
          height="264.87"
          clipPath="url(#tvScreenClip)"
        >
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-base font-medium text-foreground/40">Coming Soon</span>
          </div>
        </foreignObject>

        {/* Clip path for screen area */}
        <defs>
          <clipPath id="tvScreenClip">
            <rect x="7.37" y="6.86" width="477.11" height="264.87" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IMacDevice({ className = "" }: DeviceComponentProps) {
  return (
    <div className={`relative ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 555.69 456.39"
        className="w-full h-full"
      >
        {/* Main screen bezel */}
        <path
          d="M555.19,330.46H.66V16.2C.66,7.53,7.69.5,16.37.5h523.12c8.67,0,15.7,7.03,15.7,15.7v314.26Z"
          className="fill-primary stroke-primary"
          strokeMiterlimit="10"
        />

        {/* Stand */}
        <path
          d="M224.25,380.78c-1.64,17.04-2.25,39.77-7.37,56.17-3.6,3.52-11.45,10.17-15.83,12.58-1.44.84-4.2,2.77-5.42,3.9-2.79,2.34,2.57,3.51,3.25,2.39,47.25,1.13,109.72.19,157.01.48h3.9c4.89-.6.43-3.88-1.08-3.95-3.62-1.99-10.44-6.72-13.66-9.33l-3.9-3.04-2.6-4.55c-2.18-6.48-3.42-16.57-3.69-23.42-1.61-8.74-2.73-22.28-3.04-31.23H224.25Z"
          className="fill-tertiary"
        />

        {/* Screen area */}
        <rect
          x="21.7"
          y="20.99"
          width="512.13"
          height="289.41"
          className="fill-background stroke-primary"
          strokeMiterlimit="10"
        />

        {/* Bottom bezel - area between screen and stand */}
        <path
          d="M539.33,380.78H16.2c-8.67,0-15.7-7.03-15.7-15.7v-34.61h554.53v34.61c0,8.67-7.03,15.7-15.7,15.7Z"
          className="fill-tertiary stroke-primary"
          strokeMiterlimit="10"
        />

        {/* Apple logo */}
        <path
          d="M285.41,355.29c-.01-2.17.97-3.81,2.96-5.01-1.79-3.54-7.88-2.56-10.24-1.41-.89,0-2.92-1.17-4.52-1.17-9.9-.15-7.85,18,.38,20.08,8.45-3.3,9.99,5.08,15.06-7.05-3.85-1.81-3.65-5.32-3.65-5.43ZM282.06,345.58c1.61-1.92,1.47-3.66,1.42-4.29-3.06.26-5.8,3.14-5.53,6.31,1.54.12,2.95-.67,4.11-2.03Z"
          className="fill-primary"
        />

        {/* Image container within screen - always visible */}
        <foreignObject
          x="21.7"
          y="20.99"
          width="512.13"
          height="289.41"
          clipPath="url(#screenClip)"
        >
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-base font-medium text-foreground/40">Coming Soon</span>
          </div>
        </foreignObject>

        {/* Clip path for screen area */}
        <defs>
          <clipPath id="screenClip">
            <rect x="21.7" y="20.99" width="512.13" height="289.41" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

export default function Devices({ selectedImage: _selectedImage, className = "", deviceType = "imac" }: DevicesProps) {
  useImageSettings(); // Keep hook call for potential future use

  if (deviceType === "ios") {
    return <IOSDevice className={className} />;
  }

  if (deviceType === "android") {
    return <AndroidDevice className={className} />;
  }

  if (deviceType === "watch") {
    return <WatchDevice className={className} />;
  }

  if (deviceType === "macos") {
    return <MacOSDevice className={className} />;
  }

  if (deviceType === "tablet") {
    return <TabletDevice className={className} />;
  }

  if (deviceType === "windows") {
    return <WindowsDevice className={className} />;
  }

  if (deviceType === "windowslaptop") {
    return <WindowsLaptopDevice className={className} />;
  }

  if (deviceType === "tv") {
    return <TVDevice className={className} />;
  }

  // iMac (default)
  return <IMacDevice className={className} />;
}