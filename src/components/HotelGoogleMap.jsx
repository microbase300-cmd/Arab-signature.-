import React, { useState, useEffect, useRef } from 'react';
import { HOTEL_INFO } from '../data/hotelData';
import {
  MapPin, Navigation, Compass, Car, Clock, Sparkles, ExternalLink,
  LocateFixed, Layers, Route as RouteIcon, CheckCircle2, Phone, ShieldCheck, Copy, Check
} from 'lucide-react';

// Popular departure landmarks with real GPS coordinates for instant route & ETA calculation
const QUICK_ORIGINS = [
  {
    id: 'onitsha-bridge',
    label: 'Onitsha Head Bridge / River Niger',
    address: 'River Niger Bridge, Onitsha, Anambra State, Nigeria',
    coords: { lat: 6.1328, lng: 6.7625 },
    driveTime: '22 mins',
    distance: '14.8 km',
  },
  {
    id: 'anambra-airport',
    label: 'Chinua Achebe Intl Airport (Umueri)',
    address: 'Anambra International Cargo Airport, Umueri, Nigeria',
    coords: { lat: 6.2653, lng: 6.8764 },
    driveTime: '15 mins',
    distance: '9.4 km',
  },
  {
    id: 'awka-aroma',
    label: 'Awka (Aroma Junction)',
    address: 'Aroma Junction, Awka, Anambra State, Nigeria',
    coords: { lat: 6.2220, lng: 7.0821 },
    driveTime: '38 mins',
    distance: '34.2 km',
  },
  {
    id: 'asaba-airport',
    label: 'Asaba International Airport',
    address: 'Asaba International Airport, Asaba, Delta State, Nigeria',
    coords: { lat: 6.2042, lng: 6.6628 },
    driveTime: '35 mins',
    distance: '24.6 km',
  },
];

// Calculate Haversine road-adjusted distance & driving ETA from user's live GPS
function calculateRouteMetrics(originCoords, destCoords) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(destCoords.lat - originCoords.lat);
  const dLng = toRad(destCoords.lng - originCoords.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(originCoords.lat)) *
      Math.cos(toRad(destCoords.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightKm = R * c;
  const roadKm = Math.max(1.2, straightKm * 1.28); // Road winding factor
  const estMinutes = Math.max(4, Math.round((roadKm / 42) * 60)); // Avg 42 km/h arterial speed
  return {
    distance: `${roadKm.toFixed(1)} km`,
    driveTime:
      estMinutes >= 60
        ? `${Math.floor(estMinutes / 60)} hr ${estMinutes % 60} mins`
        : `${estMinutes} mins`,
  };
}

export default function HotelGoogleMap() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const hotelCoords = HOTEL_INFO.coordinates || { lat: 6.2458, lng: 6.8142 };
  const hotelDestinationQuery =
    'Arab Signature Hotel and Suites, College Area, By Somadina Ifinta Street, No. 6 Road, Nsugbe, Onitsha, Anambra State, Nigeria';

  const [mapMode, setMapMode] = useState('place'); // 'place' | 'directions'
  const [mapLayer, setMapLayer] = useState('m'); // 'm' = Standard Road Map, 'k' = Satellite Hybrid
  const [originInput, setOriginInput] = useState('');
  const [activeOrigin, setActiveOrigin] = useState('');
  const [routeStats, setRouteStats] = useState(null);
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Ref for optional Google Maps JS SDK container when API key is configured
  const jsMapRef = useRef(null);
  const [jsSdkReady, setJsSdkReady] = useState(false);

  // Initialize official Google Maps JavaScript API + AdvancedMarkerElement + Routes API if API key is present
  useEffect(() => {
    if (!apiKey || !jsMapRef.current) return;

    let isCancelled = false;

    const loadGoogleMapsSdk = async () => {
      try {
        if (!window.google || !window.google.maps) {
          await new Promise((resolve, reject) => {
            const existingScript = document.getElementById('gmp-js-sdk');
            if (existingScript) {
              existingScript.addEventListener('load', resolve);
              return;
            }
            const script = document.createElement('script');
            script.id = 'gmp-js-sdk';
            script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
              apiKey
            )}&v=beta&libraries=maps,marker,routes`;
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        if (isCancelled || !window.google?.maps?.importLibrary) return;

        const { Map } = await window.google.maps.importLibrary('maps');
        const { AdvancedMarkerElement, PinElement } =
          await window.google.maps.importLibrary('marker');

        const mapInstance = new Map(jsMapRef.current, {
          center: hotelCoords,
          zoom: 16,
          mapId: 'DEMO_MAP_ID',
          mapTypeId: mapLayer === 'k' ? 'hybrid' : 'roadmap',
          // Mandatory Google Maps Platform attribution ID
          internalUsageAttributionIds: ['gmp_git_agentskills_v1'],
        });

        const pin = new PinElement({
          background: '#5c0725',
          borderColor: '#d4af37',
          glyphColor: '#f3e5ab',
          scale: 1.25,
        });

        const marker = new AdvancedMarkerElement({
          map: mapInstance,
          position: hotelCoords,
          title: 'Arab Signature Hotel & Suites — Nsugbe, Onitsha',
        });
        marker.append(pin);

        // If directions mode is active and Route class is available, compute route via modern Routes API
        if (mapMode === 'directions' && activeOrigin) {
          const routesLib = await window.google.maps.importLibrary('routes');
          if (routesLib?.Route?.computeRoutes) {
            const { routes } = await routesLib.Route.computeRoutes({
              origin: activeOrigin,
              destination: hotelCoords,
              travelMode: 'DRIVING',
              fields: ['path', 'distanceMeters', 'durationMillis', 'viewport'],
            });
            if (routes && routes[0]) {
              routes[0].createPolylines({ map: mapInstance });
              if (routes[0].viewport) {
                mapInstance.fitBounds(routes[0].viewport);
              }
            }
          }
        }

        setJsSdkReady(true);
      } catch {
        setJsSdkReady(false);
      }
    };

    loadGoogleMapsSdk();

    return () => {
      isCancelled = true;
    };
  }, [apiKey, mapLayer, mapMode, activeOrigin]);

  // Handle "Use My Current GPS Location"
  const handleUseMyGps = () => {
    setGpsError('');
    if (!navigator.geolocation) {
      setGpsError('GPS Geolocation is not supported by your browser.');
      return;
    }

    setIsLocatingGps(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const coordString = `${userLat.toFixed(6)},${userLng.toFixed(6)}`;
        const metrics = calculateRouteMetrics(
          { lat: userLat, lng: userLng },
          hotelCoords
        );
        setOriginInput('My Current GPS Location');
        setActiveOrigin(coordString);
        setRouteStats({
          fromLabel: 'Your Current GPS Position',
          distance: metrics.distance,
          driveTime: metrics.driveTime,
        });
        setMapMode('directions');
        setIsLocatingGps(false);
      },
      () => {
        setIsLocatingGps(false);
        setGpsError(
          'Unable to read live GPS. Please select a landmark below or enter your starting location.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Handle selecting a preset landmark origin
  const handleSelectQuickOrigin = (item) => {
    setGpsError('');
    setOriginInput(item.label);
    setActiveOrigin(item.address);
    setRouteStats({
      fromLabel: item.label,
      distance: item.distance,
      driveTime: item.driveTime,
    });
    setMapMode('directions');
  };

  // Handle custom origin form submit
  const handleCustomRouteSubmit = (e) => {
    e.preventDefault();
    if (!originInput.trim()) return;
    setGpsError('');
    setActiveOrigin(originInput.trim());
    setRouteStats({
      fromLabel: originInput.trim(),
      distance: 'Live Route Calculated',
      driveTime: 'Turn-by-Turn Ready',
    });
    setMapMode('directions');
  };

  // Construct Official Maps Embed API URL (when API key is provided) or Interactive Google Maps Embed URL
  const getEmbedMapUrl = () => {
    if (apiKey) {
      if (mapMode === 'directions' && activeOrigin) {
        return `https://www.google.com/maps/embed/v1/directions?key=${encodeURIComponent(
          apiKey
        )}&origin=${encodeURIComponent(
          activeOrigin
        )}&destination=${encodeURIComponent(
          hotelDestinationQuery
        )}&mode=driving&maptype=${
          mapLayer === 'k' ? 'satellite' : 'roadmap'
        }&solution_id=gmp_git_agentskills_v1`;
      }
      return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(
        apiKey
      )}&q=${encodeURIComponent(
        hotelDestinationQuery
      )}&zoom=16&maptype=${
        mapLayer === 'k' ? 'satellite' : 'roadmap'
      }&solution_id=gmp_git_agentskills_v1`;
    }

    // Immediate zero-config Google Maps interactive embed with live route support
    if (mapMode === 'directions' && activeOrigin) {
      return `https://maps.google.com/maps?saddr=${encodeURIComponent(
        activeOrigin
      )}&daddr=${encodeURIComponent(
        'Arab Signature Hotel and Suites, Nsugbe, Onitsha, Anambra, Nigeria'
      )}&t=${mapLayer}&z=13&ie=UTF8&iwloc=&output=embed`;
    }

    return `https://maps.google.com/maps?q=${encodeURIComponent(
      'Arab Signature Hotel and Suites, College Area, Somadina Ifinta Street, No 6 Road, Nsugbe, Onitsha, Anambra, Nigeria'
    )}&t=${mapLayer}&z=16&ie=UTF8&iwloc=&output=embed`;
  };

  // Direct Google Maps Turn-by-Turn Navigation URL (opens Google Maps App / Web Directions)
  const getDirectNavigationUrl = () => {
    const base = 'https://www.google.com/maps/dir/?api=1';
    const dest = `&destination=${encodeURIComponent(
      'Arab Signature Hotel and Suites, Nsugbe, Onitsha, Anambra State, Nigeria'
    )}&travelmode=driving`;
    const orig = activeOrigin
      ? `&origin=${encodeURIComponent(activeOrigin)}`
      : '';
    return `${base}${orig}${dest}`;
  };

  const handleCopyAddress = () => {
    navigator.clipboard?.writeText(HOTEL_INFO.address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  return (
    <div className="rounded-3xl bg-[#18030c] border-2 border-[#d4af37]/40 shadow-[0_25px_80px_rgba(0,0,0,0.85)] overflow-hidden">
      {/* 1. TOP HEADER BAR */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-[#280210] via-[#4a061e] to-[#280210] border-b border-[#d4af37]/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/50 border border-[#d4af37]/50 text-[#f3e5ab] text-[11px] font-mono uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Google Maps Live Location & Route Engine</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white">
            Interactive Hotel Map & <span className="gold-text-gradient">Turn-by-Turn Directions</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-200 flex items-center gap-2 flex-wrap">
            <MapPin size={15} className="text-[#d4af37] flex-shrink-0" />
            <span>{HOTEL_INFO.address}</span>
            <button
              onClick={handleCopyAddress}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-mono text-[#f3e5ab] flex items-center gap-1 transition-all"
            >
              {copiedAddress ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copiedAddress ? 'Address Copied' : 'Copy Address'}</span>
            </button>
          </p>
        </div>

        {/* Mode & Satellite Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="p-1 rounded-2xl bg-black/60 border border-white/15 flex items-center gap-1">
            <button
              onClick={() => setMapMode('place')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                mapMode === 'place'
                  ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black shadow-md'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <MapPin size={13} />
              <span>Hotel Pin</span>
            </button>
            <button
              onClick={() => {
                setMapMode('directions');
                if (!activeOrigin) {
                  handleSelectQuickOrigin(QUICK_ORIGINS[0]);
                }
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                mapMode === 'directions'
                  ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black shadow-md'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <RouteIcon size={13} />
              <span>Live Route</span>
            </button>
          </div>

          <button
            onClick={() => setMapLayer(mapLayer === 'm' ? 'k' : 'm')}
            className="px-3.5 py-2.5 rounded-2xl bg-black/60 hover:bg-white/10 text-xs font-bold text-[#f3e5ab] border border-[#d4af37]/40 flex items-center gap-1.5 transition-all"
          >
            <Layers size={14} className="text-[#d4af37]" />
            <span>{mapLayer === 'm' ? 'Satellite View' : 'Road Map View'}</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN INTERACTIVE GRID: LEFT ROUTE PLANNER + RIGHT GOOGLE MAP */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Column: Live Directions & Origin Selector */}
        <div className="lg:col-span-5 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-white/10 space-y-6 bg-[#14020a]">
          
          {/* One-Tap Live GPS Route Button */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#d4af37] font-bold block">
              1. Instant GPS Route From Your Location
            </label>
            <button
              type="button"
              onClick={handleUseMyGps}
              disabled={isLocatingGps}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#5c0725] via-[#7a0932] to-[#5c0725] hover:from-[#720a2f] hover:to-[#720a2f] text-white border border-[#d4af37]/60 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer"
            >
              <LocateFixed size={16} className={`text-[#d4af37] ${isLocatingGps ? 'animate-spin' : ''}`} />
              <span>
                {isLocatingGps
                  ? 'Detecting Your Live GPS Coordinates...'
                  : 'Use My Current GPS Location for Directions'}
              </span>
            </button>
            {gpsError && (
              <p className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2">
                {gpsError}
              </p>
            )}
          </div>

          {/* Custom Starting Point Form */}
          <form onSubmit={handleCustomRouteSubmit} className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-gray-400 font-semibold block">
              2. Or Enter Any Starting City / Landmark
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={originInput}
                onChange={(e) => setOriginInput(e.target.value)}
                placeholder="e.g. Onitsha GRA, Awka, Enugu, Asaba..."
                className="flex-1 px-4 py-3 rounded-xl bg-black/70 border border-white/15 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#d4af37]"
              />
              <button
                type="submit"
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-extrabold text-xs uppercase tracking-wider shadow-md hover:opacity-95 flex items-center gap-1.5 flex-shrink-0"
              >
                <Navigation size={13} />
                <span>Route</span>
              </button>
            </div>
          </form>

          {/* Preset Popular Landmarks */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400 font-semibold block">
              3. Quick Departure Hubs (1-Tap Route)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {QUICK_ORIGINS.map((hub) => {
                const isSelected = activeOrigin === hub.address;
                return (
                  <button
                    key={hub.id}
                    type="button"
                    onClick={() => handleSelectQuickOrigin(hub)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-[#5c0725]/60 border-[#d4af37] text-white shadow-lg'
                        : 'bg-black/40 border-white/10 text-gray-300 hover:border-[#d4af37]/40 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Car size={15} className="text-[#d4af37] flex-shrink-0" />
                      <span className="text-xs font-semibold truncate">{hub.label}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#f3e5ab] bg-black/50 px-2 py-0.5 rounded-lg flex-shrink-0">
                      {hub.driveTime}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Route ETA Summary Card */}
          {routeStats && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#260310] to-[#3d061a] border border-[#d4af37]/50 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#d4af37]">
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={13} className="text-emerald-400" /> ACTIVE ROUTE TO HOTEL
                </span>
                <span>DRIVING MODE</span>
              </div>
              <div className="text-xs text-gray-200">
                From: <strong className="text-white">{routeStats.fromLabel}</strong>
              </div>
              <div className="flex items-center gap-4 pt-1">
                <div className="px-3 py-1.5 rounded-xl bg-black/50 border border-white/10">
                  <span className="text-[10px] text-gray-400 block">Est. Drive Time</span>
                  <span className="text-sm font-extrabold text-[#f3e5ab] flex items-center gap-1">
                    <Clock size={13} className="text-[#d4af37]" /> {routeStats.driveTime}
                  </span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-black/50 border border-white/10">
                  <span className="text-[10px] text-gray-400 block">Road Distance</span>
                  <span className="text-sm font-extrabold text-white">{routeStats.distance}</span>
                </div>
              </div>
            </div>
          )}

          {/* Direct Launch into Google Maps App for Turn-by-Turn Voice Navigation */}
          <div className="pt-2 space-y-2.5">
            <a
              href={getDirectNavigationUrl()}
              target="_blank"
              rel="noreferrer"
              className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-extrabold text-xs uppercase tracking-widest shadow-xl shadow-[#d4af37]/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
            >
              <Compass size={16} />
              <span>Start Live Google Maps Navigation</span>
              <ExternalLink size={14} />
            </a>
            <p className="text-[11px] text-center text-gray-400">
              Opens native turn-by-turn voice directions in Google Maps on your phone or browser.
            </p>
          </div>
        </div>

        {/* Right Column: Live Embedded Interactive Google Map (Height explicitly set to prevent CF2 Map Height Collapse) */}
        <div className="lg:col-span-7 relative min-h-[420px] sm:min-h-[540px] h-full w-full bg-[#0b0105]">
          {/* Optional JS SDK container if VITE_GOOGLE_MAPS_API_KEY is configured and active */}
          {apiKey && (
            <div
              ref={jsMapRef}
              className={`w-full h-[420px] sm:h-[580px] ${jsSdkReady ? 'block' : 'hidden'}`}
            />
          )}

          {/* Live Google Maps Interactive Iframe (Always works immediately & supports Directions + Satellite) */}
          {(!apiKey || !jsSdkReady) && (
            <iframe
              key={`${mapMode}-${mapLayer}-${activeOrigin}`}
              title="Arab Signature Hotel and Suites Nsugbe Live Google Map"
              src={getEmbedMapUrl()}
              className="w-full h-[420px] sm:h-[580px] border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}

          {/* Floating Hotel Verification Badge Over Bottom of Map */}
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm p-4 rounded-2xl bg-[#120208]/95 backdrop-blur-xl border border-[#d4af37]/50 shadow-2xl flex items-start gap-3 pointer-events-auto">
            <div className="w-10 h-10 rounded-xl bg-[#5c0725] border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37] flex-shrink-0 mt-0.5">
              <ShieldCheck size={20} />
            </div>
            <div className="space-y-1 text-xs">
              <div className="font-cinzel font-bold text-white flex items-center gap-1.5">
                <span>Arab Signature Hotel & Suites</span>
              </div>
              <p className="text-[11px] text-gray-300 leading-snug">
                College Area, By Somadina Ifinta Street, No. 6 Road, Nsugbe, Onitsha
              </p>
              <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-[#d4af37]">
                <span>GPS: 6.2458° N, 6.8142° E</span>
                <span>•</span>
                <a href={`tel:${HOTEL_INFO.phone.replace(/\s+/g, '')}`} className="underline hover:text-white">
                  {HOTEL_INFO.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
