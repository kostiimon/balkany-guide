import { Component, signal, effect, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TabId =
  | 'overview' | 'itinerary' | 'transport' | 'mapa'
  | 'accommodation' | 'costs' | 'briefs'
  | 'city-tirana'     | 'city-tirana-area'
  | 'city-sarande'    | 'city-sarande-area'
  | 'city-ohrid'      | 'city-ohrid-area'
  | 'city-skopje'     | 'city-skopje-area'
  | 'city-prishtina'  | 'city-prishtina-area'
  | 'city-prizren'    | 'city-prizren-area'
  | 'city-pec'        | 'city-pec-area'
  | 'city-kotor'      | 'city-kotor-area'
  | 'city-podgorica'  | 'city-podgorica-area'
  | 'history' | 'practical';

export interface NavItem { id: TabId; label: string; sub?: boolean; }

interface CityMarker { lat: number; lng: number; icon: string; label: string; }
interface CityMapCfg { center: [number, number]; zoom: number; markers: CityMarker[]; }

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
  readonly lightboxSrc   = signal<string | null>(null);

  readonly navItems: NavItem[] = [
    { id: 'overview',              label: '🗺️ Trasa' },
    { id: 'itinerary',             label: '📅 14 dni' },
    { id: 'transport',             label: '🚌 Transport' },
    { id: 'mapa',                  label: '📍 Mapa' },
    { id: 'accommodation',         label: '🛏️ Noclegi' },
    { id: 'costs',                 label: '💶 Koszty' },
    { id: 'briefs',                label: '📖 Lokalizacje' },
    { id: 'city-tirana',           label: '🏙️ Tirana' },
    { id: 'city-tirana-area',      label: '↳ Okolice Tirany', sub: true },
    { id: 'city-sarande',          label: '🌊 Sarandë' },
    { id: 'city-sarande-area',     label: '↳ Okolice Sarandë', sub: true },
    { id: 'city-ohrid',            label: '🏞️ Ohrid' },
    { id: 'city-ohrid-area',       label: '↳ Okolice Ohridu', sub: true },
    { id: 'city-skopje',           label: '🗿 Skopje' },
    { id: 'city-skopje-area',      label: '↳ Okolice Skopje', sub: true },
    { id: 'city-prishtina',        label: '🆕 Prisztina' },
    { id: 'city-prishtina-area',   label: '↳ Okolice Prisztiny', sub: true },
    { id: 'city-prizren',          label: '🌉 Prizren' },
    { id: 'city-prizren-area',     label: '↳ Okolice Prizrenu', sub: true },
    { id: 'city-pec',              label: '🏔️ Peć' },
    { id: 'city-pec-area',         label: '↳ Okolice Peć', sub: true },
    { id: 'city-kotor',            label: '🏰 Kotor' },
    { id: 'city-kotor-area',       label: '↳ Okolice Kotoru', sub: true },
    { id: 'city-podgorica',        label: '👑 Podgorica' },
    { id: 'city-podgorica-area',   label: '↳ Okolice Podgoricy', sub: true },
    { id: 'history',               label: '📜 Historia' },
    { id: 'practical',             label: '🔧 Praktycznie' },
  ];

  readonly navGroups = [
    { label: 'Podróż',         items: this.navItems.slice(0, 7)   },
    { label: '🇦🇱 Albania',   items: this.navItems.slice(7, 11)  },
    { label: '🇲🇰 Macedonia', items: this.navItems.slice(11, 15) },
    { label: '🇽🇰 Kosowo',    items: this.navItems.slice(15, 21) },
    { label: '🇲🇪 Czarnogóra',items: this.navItems.slice(21, 25) },
    { label: 'Info',           items: this.navItems.slice(25)     },
  ];

  private readonly cityMapConfig: Record<string, CityMapCfg> = {
    'city-tirana': { center: [41.3265, 19.8175], zoom: 15, markers: [
      { lat: 41.3281, lng: 19.8188, icon: '🏛️', label: 'Plac Skanderbega' },
      { lat: 41.3278, lng: 19.8190, icon: '🕌', label: 'Meczet Et\'hem Beja' },
      { lat: 41.3252, lng: 19.8180, icon: '🔺', label: 'Piramida Tirany' },
      { lat: 41.3283, lng: 19.8178, icon: '🏛️', label: 'Muzeum Narodowe' },
      { lat: 41.3303, lng: 19.8156, icon: '🛒', label: 'Pazari i Ri' },
      { lat: 41.3232, lng: 19.8172, icon: '🍷', label: 'Dzielnica Bllok' },
      { lat: 41.3270, lng: 19.8165, icon: '💀', label: 'BunkArt 2' },
      { lat: 41.3225, lng: 19.8168, icon: '🌙', label: 'Komiteti Bar' },
    ]},
    'city-sarande': { center: [39.8756, 20.0055], zoom: 15, markers: [
      { lat: 39.8757, lng: 20.0054, icon: '🌊', label: 'Promenada' },
      { lat: 39.8753, lng: 20.0046, icon: '✡️', label: 'Synagoga IV w.' },
      { lat: 39.8751, lng: 20.0068, icon: '⛴️', label: 'Terminal promowy (→Korfu)' },
      { lat: 39.8770, lng: 20.0055, icon: '🏛️', label: 'Centrum / rynek' },
      { lat: 39.8748, lng: 20.0050, icon: '🍽️', label: 'Restauracje przy porcie' },
      { lat: 39.8762, lng: 20.0040, icon: '🏨', label: 'Dzielnica noclegowa' },
    ]},
    'city-ohrid': { center: [41.1130, 20.7980], zoom: 15, markers: [
      { lat: 41.1090, lng: 20.7895, icon: '⛪', label: 'Śv. Jovan Kaneo' },
      { lat: 41.1118, lng: 20.8007, icon: '🏛️', label: 'Katedra Śv. Sofia' },
      { lat: 41.1133, lng: 20.7980, icon: '🏰', label: 'Twierdza Samuela' },
      { lat: 41.1145, lng: 20.7970, icon: '🎭', label: 'Teatr antyczny' },
      { lat: 41.1122, lng: 20.7997, icon: '🖼️', label: 'Muzeum Ikon' },
      { lat: 41.1260, lng: 20.8067, icon: '🏖️', label: 'Plaże miejskie' },
      { lat: 41.1106, lng: 20.7872, icon: '📚', label: 'Starówka' },
    ]},
    'city-skopje': { center: [42.0010, 21.4355], zoom: 15, markers: [
      { lat: 42.0024, lng: 21.4387, icon: '🌉', label: 'Most Kamienny' },
      { lat: 42.0042, lng: 21.4378, icon: '🕌', label: 'Stary Bazar Čaršija' },
      { lat: 41.9965, lng: 21.4314, icon: '🗿', label: 'Aleksander Wielki / Projekt 2014' },
      { lat: 42.0048, lng: 21.4336, icon: '🏰', label: 'Twierdza Kale' },
      { lat: 42.0018, lng: 21.4362, icon: '✡️', label: 'Muzeum Holocaustu' },
      { lat: 42.0052, lng: 21.4342, icon: '🕌', label: 'Meczet Mustafa Paszy' },
    ]},
    'city-prishtina': { center: [42.6610, 21.1655], zoom: 15, markers: [
      { lat: 42.6585, lng: 21.1672, icon: '🆕', label: 'NEWBORN Monument' },
      { lat: 42.6620, lng: 21.1650, icon: '🇺🇸', label: 'Bulwar Billa Clintona' },
      { lat: 42.6606, lng: 21.1651, icon: '📚', label: 'Biblioteka Narodowa' },
      { lat: 42.6618, lng: 21.1635, icon: '🕌', label: 'Meczet Cara Sultana' },
      { lat: 42.6591, lng: 21.1591, icon: '⛪', label: 'Kościół Chrystusa Zbawiciela' },
      { lat: 42.6630, lng: 21.1590, icon: '🏛️', label: 'Muzeum Kosowa' },
      { lat: 42.6605, lng: 21.1700, icon: '🛍️', label: 'Centrum handlowe' },
    ]},
    'city-prizren': { center: [42.2145, 20.7410], zoom: 16, markers: [
      { lat: 42.2149, lng: 20.7394, icon: '🌉', label: 'Most Kamienny' },
      { lat: 42.2135, lng: 20.7447, icon: '🏰', label: 'Twierdza Kalaja' },
      { lat: 42.2152, lng: 20.7392, icon: '🕌', label: 'Meczet Sinan Paszy' },
      { lat: 42.2155, lng: 20.7385, icon: '🏛️', label: 'Liga Prizreńska 1878' },
      { lat: 42.2148, lng: 20.7400, icon: '⛪', label: 'Kościół Bogurodzicy Lewiszki' },
      { lat: 42.2140, lng: 20.7380, icon: '🌊', label: 'Rzeka Bistrica' },
      { lat: 42.2160, lng: 20.7420, icon: '🍽️', label: 'Restauracje nad rzeką' },
    ]},
    'city-pec': { center: [42.6580, 20.2870], zoom: 15, markers: [
      { lat: 42.6570, lng: 20.2680, icon: '⛪', label: 'Patriarchat Pecki (UNESCO)' },
      { lat: 42.6590, lng: 20.2883, icon: '🏙️', label: 'Centrum Peć' },
      { lat: 42.6610, lng: 20.2650, icon: '🏔️', label: 'Wejście Kanionu Rugova' },
      { lat: 42.6587, lng: 20.2901, icon: '🍺', label: 'Browar Peja' },
      { lat: 42.6600, lng: 20.2860, icon: '🛒', label: 'Bazar miejski' },
    ]},
    'city-kotor': { center: [42.4248, 18.7700], zoom: 16, markers: [
      { lat: 42.4249, lng: 18.7694, icon: '🚪', label: 'Brama Morska' },
      { lat: 42.4249, lng: 18.7703, icon: '⛪', label: 'Katedra Śv. Tripuna' },
      { lat: 42.4230, lng: 18.7680, icon: '🏰', label: 'Twierdza San Giovanni' },
      { lat: 42.4260, lng: 18.7705, icon: '🐱', label: 'Muzeum Kotów' },
      { lat: 42.4244, lng: 18.7725, icon: '🛍️', label: 'Brama Północna' },
      { lat: 42.4248, lng: 18.7680, icon: '🏛️', label: 'Muzeum Morskie' },
    ]},
    'city-podgorica': { center: [42.4411, 19.2636], zoom: 14, markers: [
      { lat: 42.4428, lng: 19.2618, icon: '🕌', label: 'Stara Varoš' },
      { lat: 42.4430, lng: 19.2625, icon: '⛪', label: 'Meczet Osmana Paszy' },
      { lat: 42.4380, lng: 19.2510, icon: '🌉', label: 'Most Milenijny' },
      { lat: 42.4420, lng: 19.2580, icon: '🏛️', label: 'Muzeum Narodowe' },
      { lat: 42.4350, lng: 19.2630, icon: '🌿', label: 'Park Miejski' },
      { lat: 42.4411, lng: 19.2636, icon: '🚂', label: 'Dworzec kolejowy' },
    ]},
  };

  constructor() {
    effect(() => {
      const tab = this.activeTab();
      if (tab === 'mapa') {
        setTimeout(() => this.initLeafletMap(), 120);
      } else if (tab.startsWith('city-') && !tab.endsWith('-area')) {
        setTimeout(() => this.initCityMap(tab), 150);
      }
    });
  }

  showTab(id: TabId) {
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

  openLightbox(src: string) { this.lightboxSrc.set(src); }
  closeLightbox()           { this.lightboxSrc.set(null); }

  @HostListener('document:keydown.escape')
  onEscape() { if (this.lightboxSrc()) this.closeLightbox(); }

  onMainClick(e: MouseEvent) {
    const img = (e.target as HTMLElement).closest('img') as HTMLImageElement | null;
    if (img && (img.closest('.tc-img') || img.closest('.photo-card'))) {
      this.openLightbox(img.currentSrc || img.src);
    }
  }

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
      { lat: 41.3275, lng: 19.8187, name: 'Tirana',    dates: '08–10.04', c: 'al', n: 1, tab: 'city-tirana'    },
      { lat: 39.8756, lng: 20.0050, name: 'Sarandë',   dates: '10–12.04', c: 'al', n: 2, tab: 'city-sarande'   },
      { lat: 41.1172, lng: 20.8016, name: 'Ohrid',     dates: '12–14.04', c: 'mk', n: 3, tab: 'city-ohrid'     },
      { lat: 41.9965, lng: 21.4314, name: 'Skopje',    dates: '14–15.04', c: 'mk', n: 4, tab: 'city-skopje'    },
      { lat: 42.6629, lng: 21.1655, name: 'Prisztina', dates: '15–16.04', c: 'ko', n: 5, tab: 'city-prishtina' },
      { lat: 42.2139, lng: 20.7397, name: 'Prizren',   dates: '16–18.04', c: 'ko', n: 6, tab: 'city-prizren'   },
      { lat: 42.6590, lng: 20.2883, name: 'Peć',       dates: '18–19.04', c: 'ko', n: 7, tab: 'city-pec'       },
      { lat: 42.4247, lng: 18.7712, name: 'Kotor',     dates: '19–21.04', c: 'me', n: 8, tab: 'city-kotor'     },
      { lat: 42.4411, lng: 19.2636, name: 'Podgorica', dates: '21–22.04', c: 'me', n: 9, tab: 'city-podgorica' },
    ];

    const colors: Record<string, string> = {
      al: '#d96060', mk: '#c8903a', ko: '#4878d0', me: '#52a870'
    };

    L.polyline(stops.map(s => [s.lat, s.lng] as [number, number]), {
      color: '#48b87e', weight: 2.5, opacity: .65, dashArray: '8 5'
    }).addTo(map);

    const self = this;
    stops.forEach(s => {
      const color = colors[s.c];
      const icon = L.divIcon({
        className: '',
        html: `<div style="background:${color};color:#fff;border-radius:50%;width:28px;height:28px;
               display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;
               box-shadow:0 2px 10px rgba(0,0,0,.55);border:2px solid rgba(255,255,255,.22);
               cursor:pointer;font-family:'DM Sans',sans-serif">${s.n}</div>`,
        iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -18]
      });
      L.marker([s.lat, s.lng], { icon })
        .bindPopup(
          `<b>${s.name}</b><br>${s.dates}<br>
           <a href="#" onclick="event.preventDefault();window.__showTab('${s.tab}')"
              style="color:#48b87e;font-weight:700;text-decoration:none">
              → Zobacz kartę miasta
           </a>`,
          { className: 'dark-popup' }
        )
        .addTo(map);
    });

    (window as any).__showTab = (id: string) => self.showTab(id as TabId);
  }

  initCityMap(tab: TabId) {
    const L = (window as any)['L'];
    if (!L) return;
    const cityId = tab.replace('city-', '');
    const el = document.getElementById(`cmap-${cityId}`);
    if (!el) return;
    if ((el as any)._leaflet_id) { el.innerHTML = ''; delete (el as any)._leaflet_id; }

    const cfg = this.cityMapConfig[tab];
    if (!cfg) return;

    const map = L.map(`cmap-${cityId}`, { zoomControl: true, scrollWheelZoom: false })
      .setView(cfg.center, cfg.zoom);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO',
      subdomains: 'abcd', maxZoom: 19
    }).addTo(map);

    cfg.markers.forEach(m => {
      const icon = L.divIcon({
        className: '',
        html: `<div title="${m.label}" style="font-size:20px;line-height:1;
               filter:drop-shadow(0 2px 6px rgba(0,0,0,.8));cursor:default">${m.icon}</div>`,
        iconSize: [26, 26], iconAnchor: [13, 13], popupAnchor: [0, -16]
      });
      L.marker([m.lat, m.lng], { icon })
        .bindPopup(`<b>${m.label}</b>`, { className: 'dark-popup' })
        .addTo(map);
    });
  }
}
