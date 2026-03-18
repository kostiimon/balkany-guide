import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TabId =
  | 'overview' | 'itinerary' | 'transport' | 'mapa'
  | 'accommodation' | 'costs' | 'briefs'
  | 'country-al' | 'country-mk' | 'country-ko' | 'country-me'
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
  readonly activeTab    = signal<TabId>('overview');
  readonly openDays     = signal<Set<string>>(new Set());
  readonly openCountries = signal<Set<string>>(new Set(['al', 'mk', 'ko', 'me']));
  readonly sidebarOpen  = signal(false);

  readonly navItems: NavItem[] = [
    { id: 'overview',       label: '🗺️ Trasa' },
    { id: 'itinerary',      label: '📅 14 dni' },
    { id: 'transport',      label: '🚌 Transport' },
    { id: 'mapa',           label: '📍 Mapa' },
    { id: 'accommodation',  label: '🛏️ Noclegi' },
    { id: 'costs',          label: '💶 Koszty' },
    { id: 'briefs',         label: '📖 Lokalizacje' },
    { id: 'country-al',     label: '🇦🇱 Albania' },
    { id: 'country-mk',     label: '🇲🇰 Macedonia' },
    { id: 'country-ko',     label: '🇽🇰 Kosowo' },
    { id: 'country-me',     label: '🇲🇪 Czarnogóra' },
    { id: 'history',        label: '📜 Historia' },
    { id: 'practical',      label: '🔧 Praktycznie' },
  ];

  readonly navGroups = [
    { label: 'Podróż', items: this.navItems.slice(0, 7) },
    { label: 'Kraje',  items: this.navItems.slice(7, 11) },
    { label: 'Info',   items: this.navItems.slice(11) },
  ];

  showTab(id: TabId)    { this.activeTab.set(id); }
  isTab(id: TabId)      { return this.activeTab() === id; }
  toggleSidebar()       { this.sidebarOpen.update(v => !v); }
  closeSidebar()        { this.sidebarOpen.set(false); }

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
}
