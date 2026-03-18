import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TabId =
  | 'overview' | 'itinerary' | 'transport' | 'mapa'
  | 'accommodation' | 'costs' | 'briefs'
  | 'city-tirana' | 'city-sarande'
  | 'city-ohrid' | 'city-skopje'
  | 'city-prishtina' | 'city-prizren' | 'city-pec'
  | 'city-kotor' | 'city-podgorica'
  | 'history' | 'practical';

export interface NavItem { id: TabId; label: string; }

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly activeTab     = signal<TabId>('overview');
  readonly openDays      = signal<Set<string>>(new Set());
  readonly openCountries = signal<Set<string>>(new Set(['al', 'mk', 'ko', 'me']));
  readonly sidebarOpen   = signal(false);

  readonly navItems: NavItem[] = [
    { id: 'overview',        label: '🗺️ Trasa' },
    { id: 'itinerary',       label: '📅 14 dni' },
    { id: 'transport',       label: '🚌 Transport' },
    { id: 'mapa',            label: '📍 Mapa' },
    { id: 'accommodation',   label: '🛏️ Noclegi' },
    { id: 'costs',           label: '💶 Koszty' },
    { id: 'briefs',          label: '📖 Lokalizacje' },
    { id: 'city-tirana',     label: '🏙️ Tirana' },
    { id: 'city-sarande',    label: '🌊 Sarandë' },
    { id: 'city-ohrid',      label: '🏞️ Ohrid' },
    { id: 'city-skopje',     label: '🗿 Skopje' },
    { id: 'city-prishtina',  label: '🆕 Prisztina' },
    { id: 'city-prizren',    label: '🌉 Prizren' },
    { id: 'city-pec',        label: '🏔️ Peć' },
    { id: 'city-kotor',      label: '🏰 Kotor' },
    { id: 'city-podgorica',  label: '👑 Podgorica' },
    { id: 'history',         label: '📜 Historia' },
    { id: 'practical',       label: '🔧 Praktycznie' },
  ];

  readonly navGroups = [
    { label: 'Podróż',        items: this.navItems.slice(0, 7)   },
    { label: '🇦🇱 Albania',   items: this.navItems.slice(7, 9)   },
    { label: '🇲🇰 Macedonia', items: this.navItems.slice(9, 11)  },
    { label: '🇽🇰 Kosowo',    items: this.navItems.slice(11, 14) },
    { label: '🇲🇪 Czarnogóra',items: this.navItems.slice(14, 16) },
    { label: 'Info',           items: this.navItems.slice(16)     },
  ];

  constructor() {
    effect(() => {
      if (this.activeTab() === 'mapa') {
        setTimeout(() => this.initLeafletMap(), 120);
      }
    });
  }

  showTab(id: TabId)  {
    this.activeTab.set(id);
    const mc = document.querySelector('.main-content');
    if (mc) mc.scrollTop = 0;
    window.scrollTo(0, 0);
  }
  isTab(id: TabId)    { return this.activeTab() === id; }
  toggleSidebar()     { this.sidebarOpen.update(v => !v); }
  closeSidebar()      { this.sidebarOpen.set(false); }

  toggleDay(key: string) {
    const s = new Set(this.openDays());
    s.has(key) ? s.delete(key) : s.add(key);
    this.openDays.set(s);
  }
  isDayOpen(key: string) { return this.openDays().has(key); }

  toggleCountry(key: string) {
    const s = new Set(this.openCountries());
    s.has(key) ? s.delete(key) : s.add(key);
    this.openCountries.set(s);
  }
  isCountryOpen(key: string) { return this.openCountries().has(key); }

  initLeafletMap() {
    const L = (window as any)['L'];
    if (!L) return;
    const el = document.getElementById('route-map');
    if (!el) return;
    if ((el as any)._leaflet_id) { el.innerHTML = ''; delete (el as any)._leaflet_id; }

    const map = L.map('route-map', { zoomControl: true }).setView([41.6, 20.3], 7);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> © <a href="https://carto.com">CARTO</a>',
      subdomains: 'abcd', maxZoom: 19
    }).addTo(map);

    const stops = [
      { lat: 41.3275, lng: 19.8187, name: 'Tirana',    dates: '08–10.04', c: 'al', n: 1 },
      { lat: 39.8756, lng: 20.0050, name: 'Sarandë',   dates: '10–12.04', c: 'al', n: 2 },
      { lat: 41.1172, lng: 20.8016, name: 'Ohrid',     dates: '12–14.04', c: 'mk', n: 3 },
      { lat: 41.9965, lng: 21.4314, name: 'Skopje',    dates: '14–15.04', c: 'mk', n: 4 },
      { lat: 42.6629, lng: 21.1655, name: 'Prisztina', dates: '15–16.04', c: 'ko', n: 5 },
      { lat: 42.2139, lng: 20.7397, name: 'Prizren',   dates: '16–18.04', c: 'ko', n: 6 },
      { lat: 42.6590, lng: 20.2883, name: 'Peć',       dates: '18–19.04', c: 'ko', n: 7 },
      { lat: 42.4247, lng: 18.7712, name: 'Kotor',     dates: '19–21.04', c: 'me', n: 8 },
      { lat: 42.4411, lng: 19.2636, name: 'Podgorica', dates: '21–22.04', c: 'me', n: 9 },
    ];

    const colors: Record<string, string> = {
      al: '#d96060', mk: '#c8903a', ko: '#4878d0', me: '#52a870'
    };

    L.polyline(stops.map(s => [s.lat, s.lng] as [number, number]), {
      color: '#48b87e', weight: 2.5, opacity: .65, dashArray: '8 5'
    }).addTo(map);

    stops.forEach(s => {
      const color = colors[s.c];
      const icon = L.divIcon({
        className: '',
        html: `<div style="background:${color};color:#fff;border-radius:50%;width:28px;height:28px;
               display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;
               box-shadow:0 2px 10px rgba(0,0,0,.55);border:2px solid rgba(255,255,255,.22);
               font-family:'DM Sans',sans-serif">${s.n}</div>`,
        iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -18]
      });
      L.marker([s.lat, s.lng], { icon })
        .bindPopup(`<b>${s.name}</b><br>${s.dates}`, { className: 'dark-popup' })
        .addTo(map);
    });
  }
}
