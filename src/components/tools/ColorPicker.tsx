import { useState, useEffect } from "react";

// Color utility functions
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
};

const rgbToHsl = (
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

const hslToRgb = (
  h: number,
  s: number,
  l: number
): { r: number; g: number; b: number } => {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

const hslToHex = (h: number, s: number, l: number): string => {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
};

const getLuminance = (r: number, g: number, b: number): number => {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

const getContrastRatio = (
  rgb1: { r: number; g: number; b: number },
  rgb2: { r: number; g: number; b: number }
): number => {
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
};

interface Toast {
  msg: string;
  type: "success" | "error";
}

const ColorPicker = () => {
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [bgColor, setBgColor] = useState("#0369a1");
  const [contrastRatio, setContrastRatio] = useState(0);
  const [harmonies, setHarmonies] = useState<{ name: string; color: string }[]>(
    []
  );
  const [toast, setToast] = useState<Toast | null>(null);

  // Text color input states
  const [textHexInput, setTextHexInput] = useState("#FFFFFF");
  const [textRgbInput, setTextRgbInput] = useState("255, 255, 255");
  const [textHslInput, setTextHslInput] = useState("0, 0%, 100%");

  // Background color input states
  const [bgHexInput, setBgHexInput] = useState("#0369a1");
  const [bgRgbInput, setBgRgbInput] = useState("3, 105, 161");
  const [bgHslInput, setBgHslInput] = useState("199, 96%, 32%");

  useEffect(() => {
    const textRgb = hexToRgb(textColor);
    const bgRgb = hexToRgb(bgColor);
    const ratio = getContrastRatio(textRgb, bgRgb);
    setContrastRatio(ratio);

    // Update input fields
    setTextHexInput(textColor.toUpperCase());
    setTextRgbInput(`${textRgb.r}, ${textRgb.g}, ${textRgb.b}`);
    const textHsl = rgbToHsl(textRgb.r, textRgb.g, textRgb.b);
    setTextHslInput(`${textHsl.h}, ${textHsl.s}%, ${textHsl.l}%`);

    setBgHexInput(bgColor.toUpperCase());
    setBgRgbInput(`${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}`);
    const bgHsl = rgbToHsl(bgRgb.r, bgRgb.g, bgRgb.b);
    setBgHslInput(`${bgHsl.h}, ${bgHsl.s}%, ${bgHsl.l}%`);

    // Generate harmonies based on text color
    const newHarmonies = [
      { name: "Base", color: textColor },
      {
        name: "Complementary",
        color: hslToHex((textHsl.h + 180) % 360, textHsl.s, textHsl.l),
      },
      {
        name: "Triadic 1",
        color: hslToHex((textHsl.h + 120) % 360, textHsl.s, textHsl.l),
      },
      {
        name: "Triadic 2",
        color: hslToHex((textHsl.h + 240) % 360, textHsl.s, textHsl.l),
      },
      {
        name: "Analogous",
        color: hslToHex((textHsl.h + 30) % 360, textHsl.s, textHsl.l),
      },
    ];
    setHarmonies(newHarmonies);
  }, [textColor, bgColor]);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => showToast("Copied to clipboard!", "success"),
      () => showToast("Failed to copy", "error")
    );
  };

  const handleTextHexChange = (value: string) => {
    setTextHexInput(value);
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      setTextColor(value.toUpperCase());
    }
  };

  const handleTextRgbChange = (value: string) => {
    setTextRgbInput(value);
    const match = value.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (match) {
      const r = Math.min(255, Math.max(0, parseInt(match[1])));
      const g = Math.min(255, Math.max(0, parseInt(match[2])));
      const b = Math.min(255, Math.max(0, parseInt(match[3])));
      setTextColor(rgbToHex(r, g, b));
    }
  };

  const handleTextHslChange = (value: string) => {
    setTextHslInput(value);
    const match = value.match(/(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/);
    if (match) {
      const h = parseInt(match[1]) % 360;
      const s = Math.min(100, Math.max(0, parseInt(match[2])));
      const l = Math.min(100, Math.max(0, parseInt(match[3])));
      setTextColor(hslToHex(h, s, l));
    }
  };

  const handleBgHexChange = (value: string) => {
    setBgHexInput(value);
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      setBgColor(value.toUpperCase());
    }
  };

  const handleBgRgbChange = (value: string) => {
    setBgRgbInput(value);
    const match = value.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (match) {
      const r = Math.min(255, Math.max(0, parseInt(match[1])));
      const g = Math.min(255, Math.max(0, parseInt(match[2])));
      const b = Math.min(255, Math.max(0, parseInt(match[3])));
      setBgColor(rgbToHex(r, g, b));
    }
  };

  const handleBgHslChange = (value: string) => {
    setBgHslInput(value);
    const match = value.match(/(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/);
    if (match) {
      const h = parseInt(match[1]) % 360;
      const s = Math.min(100, Math.max(0, parseInt(match[2])));
      const l = Math.min(100, Math.max(0, parseInt(match[3])));
      setBgColor(hslToHex(h, s, l));
    }
  };

  const getBadgeClass = (ratio: number, level: "AA" | "AAA") => {
    if (level === "AA") {
      return ratio >= 4.5
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800";
    } else {
      return ratio >= 7
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800";
    }
  };

  const getBadgeText = (ratio: number, level: "AA" | "AAA") => {
    if (level === "AA") {
      return ratio >= 4.5 ? "PASS" : "FAIL";
    } else {
      return ratio >= 7 ? "PASS" : "FAIL";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto space-y-8 px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Color Picker
          </h1>
          <p className="text-gray-600">
            Convert between HEX, RGB, HSL color formats with visual picker and
            accessibility checker
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {/* Text Color Values */}
            <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
                Text Color
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    HEX
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={textHexInput}
                      onChange={(e) => handleTextHexChange(e.target.value)}
                      className="font-mono w-full pl-4 pr-10 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    />
                    <button
                      onClick={() => copyToClipboard(textColor)}
                      className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-blue-500 transition-colors"
                      title="Copy"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    RGB
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={textRgbInput}
                      onChange={(e) => handleTextRgbChange(e.target.value)}
                      placeholder="255, 255, 255"
                      className="font-mono w-full pl-4 pr-10 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    />
                    <button
                      onClick={() => copyToClipboard(`rgb(${textRgbInput})`)}
                      className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-blue-500 transition-colors"
                      title="Copy"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    HSL
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={textHslInput}
                      onChange={(e) => handleTextHslChange(e.target.value)}
                      placeholder="0, 0%, 100%"
                      className="font-mono w-full pl-4 pr-10 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    />
                    <button
                      onClick={() => copyToClipboard(`hsl(${textHslInput})`)}
                      className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-blue-500 transition-colors"
                      title="Copy"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Color Picker */}
            <div
              className="p-6 flex flex-col justify-center items-center transition-all duration-300 min-h-[280px] border-b md:border-b-0 md:border-r border-gray-200"
              style={{ backgroundColor: bgColor }}
            >
              <h2
                className="text-xl font-bold mb-4 text-center"
                style={{
                  color: textColor,
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Text Preview
              </h2>
              <div className="relative w-full max-w-[150px] h-[150px] rounded-xl shadow-2xl overflow-hidden ring-4 ring-white/50">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value.toUpperCase())}
                  className="w-full h-full cursor-pointer border-none"
                  style={{ padding: 0 }}
                />
              </div>
              <p
                className="mt-4 text-sm font-medium"
                style={{
                  color: textColor,
                  textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                }}
              >
                Click to change
              </p>
            </div>

            {/* Background Color Picker */}
            <div
              className="p-6 flex flex-col justify-center items-center transition-all duration-300 min-h-[280px] border-b md:border-b-0 md:border-r border-gray-200"
              style={{ backgroundColor: bgColor }}
            >
              <h2
                className="text-xl font-bold mb-4 text-center"
                style={{
                  color: textColor,
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Background
              </h2>
              <div className="relative w-full max-w-[150px] h-[150px] rounded-xl shadow-2xl overflow-hidden ring-4 ring-white/50">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value.toUpperCase())}
                  className="w-full h-full cursor-pointer border-none"
                  style={{ padding: 0 }}
                />
              </div>
              <p
                className="mt-4 text-sm font-medium"
                style={{
                  color: textColor,
                  textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                }}
              >
                Click to change
              </p>
            </div>

            {/* Background Color Values */}
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
                Background Color
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    HEX
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={bgHexInput}
                      onChange={(e) => handleBgHexChange(e.target.value)}
                      className="font-mono w-full pl-4 pr-10 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    />
                    <button
                      onClick={() => copyToClipboard(bgColor)}
                      className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-blue-500 transition-colors"
                      title="Copy"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    RGB
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={bgRgbInput}
                      onChange={(e) => handleBgRgbChange(e.target.value)}
                      placeholder="3, 105, 161"
                      className="font-mono w-full pl-4 pr-10 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    />
                    <button
                      onClick={() => copyToClipboard(`rgb(${bgRgbInput})`)}
                      className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-blue-500 transition-colors"
                      title="Copy"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    HSL
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={bgHslInput}
                      onChange={(e) => handleBgHslChange(e.target.value)}
                      placeholder="199, 96%, 32%"
                      className="font-mono w-full pl-4 pr-10 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    />
                    <button
                      onClick={() => copyToClipboard(`hsl(${bgHslInput})`)}
                      className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-blue-500 transition-colors"
                      title="Copy"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accessibility Checker */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Accessibility Checker
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <h3 className="font-bold text-lg mb-4 text-gray-900">
                Contrast Ratio
              </h3>
              <div className="text-4xl font-bold mb-3 text-blue-600">
                {contrastRatio.toFixed(2)}:1
              </div>
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${contrastRatio >= 4.5 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {contrastRatio >= 4.5 ? "✓ AA Compliant" : "✗ Non-Compliant"}
              </div>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
              <h3 className="font-bold text-lg mb-4 text-gray-900">
                Normal Text
              </h3>
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-3 ${getBadgeClass(contrastRatio, "AA")}`}
              >
                {getBadgeText(contrastRatio, "AA")} AA
              </div>
              <p className="text-sm text-gray-600">Minimum ratio: 4.5:1</p>
              <p className="text-xs text-gray-500 mt-1">
                For body text under 18pt
              </p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
              <h3 className="font-bold text-lg mb-4 text-gray-900">
                Large Text
              </h3>
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-3 ${getBadgeClass(contrastRatio, "AAA")}`}
              >
                {getBadgeText(contrastRatio, "AAA")} AAA
              </div>
              <p className="text-sm text-gray-600">Minimum ratio: 7:1</p>
              <p className="text-xs text-gray-500 mt-1">Enhanced contrast</p>
            </div>
          </div>
        </div>

        {/* UI Component Preview */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            UI Component Preview
          </h2>
          <div
            className="p-8 rounded-xl transition-all duration-300 shadow-inner"
            style={{ backgroundColor: bgColor, color: textColor }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-bold mb-3">Heading Text</h3>
                  <p className="mb-4 text-lg leading-relaxed">
                    This is paragraph text to test readability and contrast. It
                    should be easily readable against the background.
                  </p>
                  <p className="text-sm opacity-80">
                    This is smaller text that might be used for captions or
                    metadata. Testing different sizes.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    className="px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                    style={{ backgroundColor: textColor, color: bgColor }}
                  >
                    Primary Button
                  </button>
                  <button
                    className="px-6 py-3 rounded-lg font-semibold border-2 hover:opacity-80 transition-all"
                    style={{
                      borderColor: textColor,
                      color: textColor,
                      backgroundColor: "transparent",
                    }}
                  >
                    Secondary Button
                  </button>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-semibold mb-4">Form Elements</h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Input field"
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        borderColor: textColor,
                        color: bgColor,
                        backgroundColor: textColor,
                      }}
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="preview-checkbox"
                        className="w-5 h-5 rounded"
                        style={{ accentColor: textColor }}
                      />
                      <label htmlFor="preview-checkbox" className="text-sm">
                        Checkbox example
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Color Harmony */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Color Harmony
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {harmonies.map((harmony, index) => (
              <div
                key={index}
                className="flex flex-col items-center group cursor-pointer"
                onClick={() => copyToClipboard(harmony.color)}
              >
                <div
                  className="w-full h-28 rounded-xl shadow-md mb-3 group-hover:shadow-xl transition-all transform group-hover:scale-105 ring-2 ring-transparent group-hover:ring-blue-400"
                  style={{ backgroundColor: harmony.color }}
                ></div>
                <span className="font-semibold text-sm text-gray-900 mb-1">
                  {harmony.name}
                </span>
                <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                  {harmony.color}
                </span>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            Click any color to copy to clipboard
          </p>
        </div>

        {toast && (
          <div
            className={`fixed bottom-6 right-6 text-white px-6 py-4 rounded-lg shadow-2xl z-50 flex items-center gap-3 ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}
          >
            {toast.type === "success" ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            <span className="font-medium">{toast.msg}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;
