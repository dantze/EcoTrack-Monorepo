/**
 * Seeded dataset for mock mode.
 *
 * Deterministic: every name, id, link and choice comes from a fixed-seed PRNG,
 * so two runs produce byte-identical data. Dates are the one exception — they
 * are generated relative to today so the routes board always shows a live
 * few-weeks window rather than a calendar frozen at whenever this was written.
 *
 * Scale (see the bottom of the file for the exact counts):
 *   40 clients · 15 products · 8 subscriptions · 12 employees
 *   120 orders · 20 routes · ~150 tasks · 25 recurring sanitation plans
 *
 * Cross-references are consistent by construction: a task's clientName is
 * derived from its order's client, coordinates come from the same site as the
 * order they serve, and orderIndex is compacted per route at the end.
 */

import type { Client, Employee, Product, Role, Subscription, TaskStatus, TaskType } from '@/types/domain';
import { clientName } from '@/types/domain';
import type {
  AccessRequestRow,
  AuthSessionRow,
  EmployeeEmailRow,
  MockDb,
  OrderRow,
  RecurringRow,
  RouteRow,
  TaskRow,
} from './store';

// ---------------------------------------------------------------------------
// Deterministic randomness
// ---------------------------------------------------------------------------

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = mulberry32(0x0ec07ac4);

const int = (min: number, max: number): number => min + Math.floor(random() * (max - min + 1));
const pick = <T>(items: readonly T[]): T => items[Math.floor(random() * items.length)]!;
const chance = (probability: number): boolean => random() < probability;

// ---------------------------------------------------------------------------
// Dates
// ---------------------------------------------------------------------------

const now = new Date();
/** Today at UTC midnight, so `.toISOString().slice(0,10)` is never off by one. */
const TODAY = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

const addDays = (base: Date, days: number): Date =>
  new Date(base.getTime() + days * 24 * 60 * 60 * 1000);

const isoDate = (date: Date): string => date.toISOString().slice(0, 10);

/** Local date-time with no zone, matching Java's LocalDateTime serialisation. */
const isoDateTime = (date: Date, hour: number, minute = 0): string =>
  `${isoDate(date)}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;

/** Instant with a zone, matching how java.util.Date comes off the wire. */
const isoInstant = (date: Date, hour = 9): string =>
  new Date(date.getTime() + hour * 60 * 60 * 1000).toISOString();

const dayOfWeekIso = (date: Date): number => date.getUTCDay() || 7;

/** Romanian weekday names, indexed 1 = Monday … 7 = Sunday. */
const WEEKDAYS_RO = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'];


// ---------------------------------------------------------------------------
// Romanian vocabulary
// ---------------------------------------------------------------------------

const FIRST_NAMES = [
  'Andrei', 'Mihai', 'Elena', 'Ioana', 'Cristian', 'Alexandru', 'Gabriela', 'Vasile',
  'Marius', 'Daniela', 'Florin', 'Adrian', 'Nicolae', 'Ana-Maria', 'Bogdan', 'Raluca',
  'Ștefan', 'Cătălin', 'Mirela', 'Lucian', 'Sorin', 'Camelia', 'Radu', 'Oana',
  'Petru', 'Simona', 'Dragoș', 'Alina', 'Valentin', 'Roxana', 'Ionuț', 'Carmen',
] as const;

const LAST_NAMES = [
  'Popescu', 'Ionescu', 'Dumitru', 'Stan', 'Georgescu', 'Constantinescu', 'Marin',
  'Munteanu', 'Radu', 'Nistor', 'Barbu', 'Toma', 'Diaconu', 'Șerban', 'Vasilescu',
  'Lungu', 'Pavel', 'Coman', 'Neagu', 'Cristea', 'Ene', 'Iliescu', 'Moldovan',
  'Preda', 'Tudor', 'Sandu', 'Grigore', 'Anton', 'Voicu', 'Bălan', 'Dobre', 'Croitoru',
] as const;

const COMPANY_HEADS = [
  'Construct', 'Terra', 'Hidro', 'Agro', 'Eco', 'Prima', 'Alfa', 'Delta', 'Metro',
  'Nord', 'Vertical', 'Rapid', 'Green', 'Trans', 'Instal', 'Beton', 'Granit', 'Aqua',
  'Solar', 'Forte', 'Panoramic', 'Danubius',
] as const;

const COMPANY_TAILS = [
  'Build', 'Invest', 'Prod', 'Grup', 'Serv', 'Tech', 'Construct', 'Logistic',
  'Impex', 'Trans', 'Company', 'Systems',
] as const;

const LEGAL_FORMS = ['SRL', 'SRL', 'SRL', 'SA'] as const;

const STREETS = [
  'Str. Aurel Vlaicu', 'Bd. Unirii', 'Calea Victoriei', 'Str. Mihai Eminescu',
  'Șos. Chitilei', 'Str. Libertății', 'Str. Gării', 'Bd. Timișoara', 'Str. Fabricii',
  'Str. Podului', 'Str. Griviței', 'Bd. Iuliu Maniu', 'Str. Ciocârliei', 'Str. Morii',
  'Șos. Berceni', 'Str. Nucului', 'Str. Vulturilor', 'Bd. Muncii', 'Str. Zorilor',
  'Str. Salcâmilor',
] as const;

const SITE_LABELS = [
  'șantier bloc',
  'depozit',
  'hala producție',
  'punct de lucru',
  'parcare evenimente',
  'șantier hala',
  'bază logistică',
  'teren organizare',
] as const;

interface Locality {
  name: string;
  lat: number;
  lng: number;
}

interface Area {
  county: string;
  /** Roughly how many client sites should land here. */
  weight: number;
  zones: readonly string[];
  localities: readonly Locality[];
}

const AREAS: readonly Area[] = [
  {
    county: 'București',
    weight: 5,
    zones: ['București Nord', 'București Sud', 'București Est', 'București Vest'],
    localities: [
      { name: 'Sector 1', lat: 44.4795, lng: 26.085 },
      { name: 'Sector 2', lat: 44.452, lng: 26.14 },
      { name: 'Sector 3', lat: 44.418, lng: 26.15 },
      { name: 'Sector 4', lat: 44.39, lng: 26.11 },
      { name: 'Sector 5', lat: 44.405, lng: 26.06 },
      { name: 'Sector 6', lat: 44.44, lng: 26.025 },
    ],
  },
  {
    county: 'Ilfov',
    weight: 4,
    zones: ['Ilfov Nord', 'Ilfov Est', 'Ilfov Vest'],
    localities: [
      { name: 'Otopeni', lat: 44.551, lng: 26.0714 },
      { name: 'Voluntari', lat: 44.49, lng: 26.18 },
      { name: 'Popești-Leordeni', lat: 44.383, lng: 26.167 },
      { name: 'Chitila', lat: 44.5083, lng: 25.9833 },
      { name: 'Bragadiru', lat: 44.3667, lng: 25.9833 },
      { name: 'Pantelimon', lat: 44.4514, lng: 26.2 },
      { name: 'Buftea', lat: 44.5606, lng: 25.9481 },
    ],
  },
  {
    county: 'Prahova',
    weight: 2,
    zones: ['Prahova Sud', 'Valea Prahovei'],
    localities: [
      { name: 'Ploiești', lat: 44.9419, lng: 26.0225 },
      { name: 'Câmpina', lat: 45.1281, lng: 25.7369 },
      { name: 'Sinaia', lat: 45.35, lng: 25.55 },
      { name: 'Băicoi', lat: 45.0333, lng: 25.85 },
    ],
  },
  {
    county: 'Brașov',
    weight: 2,
    zones: ['Brașov Oraș', 'Țara Bârsei'],
    localities: [
      { name: 'Brașov', lat: 45.6427, lng: 25.5887 },
      { name: 'Făgăraș', lat: 45.8447, lng: 24.9731 },
      { name: 'Săcele', lat: 45.6167, lng: 25.7 },
      { name: 'Râșnov', lat: 45.5833, lng: 25.4667 },
    ],
  },
  {
    county: 'Cluj',
    weight: 2,
    zones: ['Cluj Oraș', 'Cluj Periferie'],
    localities: [
      { name: 'Cluj-Napoca', lat: 46.7712, lng: 23.6236 },
      { name: 'Turda', lat: 46.5667, lng: 23.7833 },
      { name: 'Dej', lat: 47.14, lng: 23.87 },
      { name: 'Florești', lat: 46.745, lng: 23.49 },
    ],
  },
];

/** Area pool weighted so most work sits around Bucharest, as it does in reality. */
const WEIGHTED_AREAS: Area[] = AREAS.flatMap((area) => Array.from({ length: area.weight }, () => area));

// ---------------------------------------------------------------------------
// Field generators
// ---------------------------------------------------------------------------

const DIACRITIC_MAP: Record<string, string> = {
  ă: 'a', â: 'a', î: 'i', ș: 's', ş: 's', ț: 't', ţ: 't',
  Ă: 'A', Â: 'A', Î: 'I', Ș: 'S', Ş: 'S', Ț: 'T', Ţ: 'T',
};

const deaccent = (value: string): string => value.replace(/[ăâîșşțţĂÂÎȘŞȚŢ]/g, (ch) => DIACRITIC_MAP[ch] ?? ch);

const slug = (value: string): string =>
  deaccent(value).toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '');

function phone(): string {
  const prefix = pick(['072', '073', '074', '075', '076', '077', '078'] as const);
  const rest = String(int(1000000, 9999999)).padStart(7, '0');
  return `${prefix}${rest.slice(0, 1)} ${rest.slice(1, 4)} ${rest.slice(4, 7)}`;
}

/** Plausible 13-digit CNP: S YY MM DD JJ NNN C. */
function cnp(): string {
  const gender = pick([1, 2, 5, 6] as const);
  const year = String(int(55, 99)).padStart(2, '0');
  const month = String(int(1, 12)).padStart(2, '0');
  const day = String(int(1, 28)).padStart(2, '0');
  const county = String(int(1, 46)).padStart(2, '0');
  const serial = String(int(1, 999)).padStart(3, '0');
  const control = int(0, 9);
  return `${gender}${year}${month}${day}${county}${serial}${control}`;
}

const cui = (): string => `RO${int(1000000, 49999999)}`;

interface Site {
  county: string;
  address: string;
  coordinates: string;
  label: string;
}

function makeSite(area: Area): Site {
  const locality = pick(area.localities);
  // ±0.045° ≈ ±5 km — keeps points inside the right town.
  const lat = locality.lat + (random() - 0.5) * 0.09;
  const lng = locality.lng + (random() - 0.5) * 0.09;
  return {
    county: area.county,
    address: `${pick(STREETS)} nr. ${int(1, 240)}, ${locality.name}`,
    coordinates: `${lat.toFixed(6)},${lng.toFixed(6)}`,
    label: pick(SITE_LABELS),
  };
}

// ---------------------------------------------------------------------------
// Static catalogues
// ---------------------------------------------------------------------------

const PRODUCT_SEED: ReadonlyArray<Omit<Product, 'id'>> = [
  { name: 'Toaletă ecologică standard', description: 'Cabină mobilă cu rezervor 250L, ventilație pasivă.', price: 850, isActive: true },
  { name: 'Toaletă ecologică cu chiuvetă', description: 'Cabină cu lavoar și rezervor apă curată 60L.', price: 1150, isActive: true },
  { name: 'Toaletă ecologică VIP', description: 'Cabină premium, oglindă, iluminat LED, pardoseală antiderapantă.', price: 1750, isActive: true },
  { name: 'Toaletă ecologică PMR', description: 'Cabină pentru persoane cu dizabilități, acces rampă, bare de sprijin.', price: 2100, isActive: true },
  { name: 'Toaletă ecologică dublă', description: 'Ansamblu de două cabine pe șasiu comun.', price: 1950, isActive: true },
  { name: 'Cabină duș mobilă', description: 'Duș cu boiler electric 30L și rezervor 200L.', price: 2400, isActive: true },
  { name: 'Pisoar mobil 4 posturi', description: 'Unitate pentru evenimente, rezervor 300L.', price: 1300, isActive: true },
  { name: 'Gard mobil galvanizat 3.5m', description: 'Panou 2.0 x 3.5 m, țeavă galvanizată la cald.', price: 180, isActive: true },
  { name: 'Gard mobil cu plasă opacă', description: 'Panou 2.0 x 3.5 m cu prelată de mascare șantier.', price: 210, isActive: true },
  { name: 'Picior beton gard mobil', description: 'Talpă prefabricată 27 kg pentru panouri mobile.', price: 45, isActive: true },
  { name: 'Clemă prindere gard mobil', description: 'Clemă zincată cu șurub pentru solidarizare panouri.', price: 12, isActive: true },
  { name: 'Container birou 6m', description: 'Container 6 x 2.4 m, izolat, instalație electrică, aer condiționat.', price: 9800, isActive: true },
  { name: 'Container vestiar 6m', description: 'Container 6 x 2.4 m cu dulapuri metalice și bănci.', price: 9200, isActive: true },
  { name: 'Container sanitar 6m', description: 'Container cu 2 dușuri, 2 WC-uri și boiler 80L.', price: 12500, isActive: true },
  { name: 'Container depozitare 12m', description: 'Container 12 x 2.4 m, uși duble, fără izolație.', price: 14200, isActive: true },
];

/** Indexes of PRODUCT_SEED that make sense as a placed/collected cabin. */
const CABIN_PRODUCT_INDEXES = [0, 1, 2, 3, 4, 5, 6] as const;
const GEAR_PRODUCT_INDEXES = [7, 8, 9, 11, 12, 13, 14] as const;

const SUBSCRIPTION_SEED: ReadonlyArray<Omit<Subscription, 'id'>> = [
  { name: 'Igienizare unică', description: 'O singură vidanjare și igienizare la cerere.', type: 'ONE_TIME', price: 150, visitsPerMonth: null, durationMonths: null, isIndefinite: null, isActive: true },
  { name: 'Igienizare unică extinsă', description: 'Vidanjare, spălare sub presiune și dezinfecție completă.', type: 'ONE_TIME', price: 220, visitsPerMonth: null, durationMonths: null, isIndefinite: null, isActive: true },
  { name: 'Abonament Bronze', description: 'O igienizare pe lună, consumabile incluse.', type: 'RECURRING', price: 260, visitsPerMonth: 1, durationMonths: 12, isIndefinite: false, isActive: true },
  { name: 'Abonament Silver', description: 'Două igienizări pe lună, consumabile și dezinfectant.', type: 'RECURRING', price: 460, visitsPerMonth: 2, durationMonths: 12, isIndefinite: false, isActive: true },
  { name: 'Abonament Gold', description: 'Patru igienizări pe lună, intervenție de urgență în 24h.', type: 'RECURRING', price: 820, visitsPerMonth: 4, durationMonths: null, isIndefinite: true, isActive: true },
  { name: 'Abonament Șantier Mare', description: 'Opt igienizări pe lună pentru organizări de peste 20 cabine.', type: 'RECURRING', price: 1500, visitsPerMonth: 8, durationMonths: null, isIndefinite: true, isActive: true },
  { name: 'Abonament Eveniment Sezonier', description: 'Trei vizite pe lună pe durata sezonului estival.', type: 'RECURRING', price: 600, visitsPerMonth: 3, durationMonths: 4, isIndefinite: false, isActive: true },
  { name: 'Abonament Standard 2023 (retras)', description: 'Plan istoric, păstrat pentru contractele vechi.', type: 'RECURRING', price: 340, visitsPerMonth: 2, durationMonths: 12, isIndefinite: false, isActive: false },
];

interface EmployeeSeed {
  fullName: string;
  username: string;
  county: string;
  roles: Role[];
}

const EMPLOYEE_SEED: readonly EmployeeSeed[] = [
  // Mock mode signs in as this account automatically - see AuthProvider. It
  // holds ADMIN so the Admin section is reachable, plus SALES/TECH so every
  // other section is too.
  { fullName: 'Administrator', username: 'admin', county: 'Cluj', roles: ['ADMIN', 'SALES', 'TECH'] },
  { fullName: 'Andreea Vasilescu', username: 'andreea.vasilescu', county: 'București', roles: ['SALES'] },
  { fullName: 'Mihai Popa', username: 'mihai.popa', county: 'București', roles: ['SALES'] },
  { fullName: 'Cristina Dobre', username: 'cristina.dobre', county: 'Ilfov', roles: ['SALES'] },
  { fullName: 'Radu Nistor', username: 'radu.nistor', county: 'Prahova', roles: ['SALES', 'TECH'] },
  { fullName: 'Ionuț Barbu', username: 'ionut.barbu', county: 'București', roles: ['DRIVER'] },
  { fullName: 'Vasile Coman', username: 'vasile.coman', county: 'Ilfov', roles: ['DRIVER'] },
  { fullName: 'Gheorghe Marin', username: 'gheorghe.marin', county: 'Prahova', roles: ['DRIVER'] },
  { fullName: 'Petre Lungu', username: 'petre.lungu', county: 'Brașov', roles: ['DRIVER'] },
  { fullName: 'Sorin Voicu', username: 'sorin.voicu', county: 'Cluj', roles: ['DRIVER'] },
  { fullName: 'Daniel Ene', username: 'daniel.ene', county: 'București', roles: ['TECH'] },
  { fullName: 'Florin Diaconu', username: 'florin.diaconu', county: 'Ilfov', roles: ['TECH'] },
  { fullName: 'Alina Grigore', username: 'alina.grigore', county: 'Cluj', roles: ['TECH'] },
];

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------

export function createSeedDb(): MockDb {
  // --- Products -----------------------------------------------------------
  const products: Product[] = PRODUCT_SEED.map((product, index) => ({ id: index + 1, ...product }));

  // --- Subscriptions ------------------------------------------------------
  const subscriptions: Subscription[] = SUBSCRIPTION_SEED.map((sub, index) => ({
    id: index + 1,
    ...sub,
  }));
  const recurringSubscriptions = subscriptions.filter((s) => s.type === 'RECURRING' && s.isActive);

  // --- Employees ----------------------------------------------------------
  const employees: Employee[] = EMPLOYEE_SEED.map((seed, index) => ({
    id: index + 1,
    username: seed.username,
    fullName: seed.fullName,
    phone: phone(),
    county: seed.county,
    roles: [...seed.roles],
  }));
  // The Employee entity has no email field; auth is the only consumer, so it
  // lives in this side table instead. Deterministic from the seed.
  const employeeEmails: EmployeeEmailRow[] = employees.map((employee) => ({
    employeeId: employee.id,
    email: `${employee.username}@ecotrack.ro`,
  }));
  const drivers = employees.filter((e) => e.roles.includes('DRIVER'));

  // --- Clients + their sites ---------------------------------------------
  const clients: Client[] = [];
  const sitesByClient = new Map<number, Site[]>();

  for (let index = 0; index < 40; index += 1) {
    const id = index + 1;
    const area = pick(WEIGHTED_AREAS);
    const homeSite = makeSite(area);
    // Roughly 60% companies — this is a B2B business with some private clients.
    const isCompany = index % 5 !== 0 && index % 5 !== 3;

    if (isCompany) {
      const name = `${pick(COMPANY_HEADS)} ${pick(COMPANY_TAILS)} ${pick(LEGAL_FORMS)}`;
      const adminName = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
      clients.push({
        id,
        type: 'company',
        name,
        CUI: cui(),
        adminName,
        email: `contact@${slug(name).replace(/\./g, '')}.ro`,
        phone: phone(),
        address: homeSite.address,
      });
    } else {
      const fullName = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
      clients.push({
        id,
        type: 'individual',
        fullName,
        CNP: cnp(),
        // A minority have their ID scanned in; the rest exercise the empty state.
        email: `${slug(fullName)}@gmail.com`,
        phone: phone(),
        address: homeSite.address,
      });
    }

    const extraSites = chance(0.35) ? [makeSite(area)] : [];
    sitesByClient.set(id, [homeSite, ...extraSites]);
  }

  const siteFor = (clientId: number): Site => pick(sitesByClient.get(clientId) ?? [makeSite(AREAS[0]!)]);

  // --- Routes -------------------------------------------------------------
  const routes: RouteRow[] = [];
  const ROUTE_PLAN: ReadonlyArray<{ county: string; count: number }> = [
    { county: 'București', count: 6 },
    { county: 'Ilfov', count: 5 },
    { county: 'Prahova', count: 3 },
    { county: 'Brașov', count: 3 },
    { county: 'Cluj', count: 3 },
  ];

  let routeId = 0;
  let dayCursor = -3; // A few routes in the recent past, the rest ahead.

  for (const plan of ROUTE_PLAN) {
    const area = AREAS.find((a) => a.county === plan.county)!;
    for (let n = 0; n < plan.count; n += 1) {
      routeId += 1;
      dayCursor += int(1, 3);
      const date = addDays(TODAY, dayCursor);
      const countyDrivers = drivers.filter((d) => d.county === plan.county);
      // Three routes are deliberately left without a driver to exercise the
      // "assign driver" flow on the routes screen.
      const unassigned = routeId % 7 === 0;
      const driver = unassigned ? null : (countyDrivers[n % Math.max(countyDrivers.length, 1)] ?? drivers[routeId % drivers.length]!);

      routes.push({
        id: routeId,
        // Named for the weekday it runs, not a calendar day: routes recur.
        name: `Ruta ${area.zones[n % area.zones.length]} — ${WEEKDAYS_RO[dayOfWeekIso(date) - 1]}`,
        dayOfWeek: dayOfWeekIso(date),
        county: plan.county,
        employeeId: driver ? driver.id : null,
      });
    }
  }

  const routesByCounty = new Map<string, RouteRow[]>();
  for (const route of routes) {
    const key = route.county ?? '';
    const bucket = routesByCounty.get(key);
    if (bucket) bucket.push(route);
    else routesByCounty.set(key, [route]);
  }
  const routeForCounty = (county: string): RouteRow => {
    const bucket = routesByCounty.get(county);
    return bucket && bucket.length > 0 ? pick(bucket) : pick(routes);
  };

  // --- Recurring sanitation plans ----------------------------------------
  const recurring: RecurringRow[] = [];

  for (let index = 0; index < 25; index += 1) {
    const id = index + 1;
    const client = pick(clients);
    const site = siteFor(client.id);
    const subscription = pick(recurringSubscriptions);
    const frequencyDays = pick([7, 14, 21, 30] as const);
    const start = addDays(TODAY, int(-70, 10));
    const indefinite = chance(0.45);
    // 10 of the 25 stay unassigned so the recurring screen has real work to do.
    const assigned = index % 5 !== 0 && index % 5 !== 2;
    const active = index % 8 !== 7;

    recurring.push({
      id,
      clientId: client.id,
      subscriptionId: subscription.id,
      frequencyDays,
      startDate: isoDate(start),
      endDate: indefinite ? null : isoDate(addDays(start, frequencyDays * int(6, 14))),
      isIndefinite: indefinite,
      sanitationLocationAddress: site.address,
      sanitationLocationCoordinates: site.coordinates,
      contact: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
      details: chance(0.4) ? `Acces ${pick(['dimineața', 'după ora 16:00', 'doar în zilele lucrătoare', 'pe poarta din spate'])}.` : null,
      routeId: assigned && active ? routeForCounty(site.county).id : null,
      active,
      lastGeneratedDate: null,
    });
  }

  // --- Orders -------------------------------------------------------------
  const orders: OrderRow[] = [];
  /** The site each order refers to, so its task can reuse the same coordinates. */
  const siteByOrder = new Map<number, Site>();

  const ORDER_MIX: ReadonlyArray<OrderRow['orderType']> = [
    ...Array.from({ length: 55 }, () => 'Amplasari' as const),
    ...Array.from({ length: 35 }, () => 'Ridicari' as const),
    ...Array.from({ length: 30 }, () => 'Igienizari' as const),
  ];

  // Recurring plans each own one companion Igienizare order, mirroring what
  // RecurringIgienizareService.create() does server-side.
  const plansNeedingOrder = recurring.slice(0, 12);
  let orderId = 0;
  let orderNumber = 2400;

  for (let index = 0; index < ORDER_MIX.length; index += 1) {
    orderId += 1;
    orderNumber += 1;
    const orderType = ORDER_MIX[index]!;
    const client = pick(clients);
    const site = siteFor(client.id);
    const placed = addDays(TODAY, int(-95, -1));
    siteByOrder.set(orderId, site);

    const base = {
      id: orderId,
      number: orderNumber,
      date: isoInstant(placed, int(8, 17)),
      clientId: client.id,
      contact: chance(0.75) ? `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}` : null,
      details: chance(0.45)
        ? `${site.label.charAt(0).toUpperCase()}${site.label.slice(1)} — ${pick([
            'acces cu autoutilitară de 7.5t',
            'contact telefonic cu o oră înainte',
            'poarta se deschide de la paznic',
            'se descarcă în curtea interioară',
            'program 07:00-15:00',
          ])}.`
        : null,
    };

    if (orderType === 'Amplasari') {
      const product = products[pick(CABIN_PRODUCT_INDEXES)]!;
      const indefinite = chance(0.2);
      const durationDays = indefinite ? null : pick([30, 60, 90, 120, 180] as const);
      const start = addDays(TODAY, int(-45, 25));
      orders.push({
        ...base,
        orderType: 'Amplasari',
        productId: product.id,
        quantity: int(1, 8),
        isIndefinite: indefinite,
        durationDays,
        startDate: isoDate(start),
        endDate: durationDays === null ? null : isoDate(addDays(start, durationDays)),
        locationCoordinates: site.coordinates,
        locationAddress: site.address,
        igienizariPerMonth: pick([1, 2, 2, 4] as const),
      });
      continue;
    }

    if (orderType === 'Ridicari') {
      const product = products[chance(0.75) ? pick(CABIN_PRODUCT_INDEXES) : pick(GEAR_PRODUCT_INDEXES)]!;
      orders.push({
        ...base,
        orderType: 'Ridicari',
        productId: product.id,
        pickupDate: isoDate(addDays(TODAY, int(-25, 28))),
        pickupQuantity: int(1, 5),
        pickupProductName: product.name,
        pickupLocationAddress: site.address,
        pickupLocationCoordinates: site.coordinates,
      });
      continue;
    }

    // Igienizari — the first dozen are the companion orders of recurring plans.
    const plan = plansNeedingOrder[orders.filter((o) => o.orderType === 'Igienizari').length];
    const planned = plan ?? null;
    const planSite: Site = planned
      ? {
          county: site.county,
          address: planned.sanitationLocationAddress ?? site.address,
          coordinates: planned.sanitationLocationCoordinates ?? site.coordinates,
          label: site.label,
        }
      : site;
    if (planned) siteByOrder.set(orderId, planSite);

    orders.push({
      ...base,
      clientId: planned ? planned.clientId : base.clientId,
      orderType: 'Igienizari',
      subscriptionId: planned ? planned.subscriptionId : pick(subscriptions.filter((s) => s.isActive)).id,
      sanitationDate: planned ? planned.startDate : isoDate(addDays(TODAY, int(-20, 35))),
      sanitationLocationAddress: planSite.address,
      sanitationLocationCoordinates: planSite.coordinates,
      recurringPlanId: planned ? planned.id : null,
    });
  }

  // --- Tasks --------------------------------------------------------------
  const tasks: TaskRow[] = [];
  let taskId = 0;

  const statusFor = (scheduled: Date): TaskStatus => {
    const dayDelta = Math.round((scheduled.getTime() - TODAY.getTime()) / 86400000);
    if (dayDelta < 0) return chance(0.85) ? 'COMPLETED' : 'IN_PROGRESS';
    if (dayDelta === 0) return chance(0.5) ? 'IN_PROGRESS' : 'NEW';
    return 'NEW';
  };

  const taskTypeFor = (orderType: OrderRow['orderType']): TaskType =>
    orderType === 'Amplasari' ? 'PLACEMENT' : orderType === 'Ridicari' ? 'PICKUP' : 'SANITIZATION';

  const photosFor = (id: number, status: TaskStatus): TaskRow['photos'] => {
    if (status !== 'COMPLETED' || !chance(0.55)) return [];
    return Array.from({ length: int(1, 3) }, (_, index) => ({
      id: id * 10 + index + 1,
      url: `https://picsum.photos/seed/task-${id}-${index}/800/600`,
    }));
  };

  // 95 of the 120 orders get a task, mirroring "not everything is dispatched yet".
  const orderIdsWithTasks = orders
    .map((order) => order.id)
    .filter((_, index) => index % 24 !== 7 && index % 24 !== 19 && index % 24 !== 23)
    .slice(0, 95);

  for (const sourceOrderId of orderIdsWithTasks) {
    const order = orders.find((o) => o.id === sourceOrderId)!;
    const site = siteByOrder.get(order.id)!;
    const client = clients.find((c) => c.id === order.clientId)!;
    taskId += 1;

    const scheduled = addDays(TODAY, int(-14, 24));
    const status = statusFor(scheduled);
    // A handful stay unrouted so the "neatribuite" bucket is never empty.
    const routed = taskId % 11 !== 5;
    const route = routed ? routeForCounty(site.county) : null;

    const productName =
      order.orderType === 'Amplasari'
        ? (products.find((p) => p.id === order.productId)?.name ?? null)
        : order.orderType === 'Ridicari'
          ? order.pickupProductName
          : (subscriptions.find((s) => s.id === order.subscriptionId)?.name ?? null);

    const quantity =
      order.orderType === 'Amplasari'
        ? order.quantity
        : order.orderType === 'Ridicari'
          ? order.pickupQuantity
          : null;

    tasks.push({
      id: taskId,
      type: taskTypeFor(order.orderType),
      scheduledTime: isoDateTime(scheduled, int(7, 16), pick([0, 15, 30, 45] as const)),
      scheduledDate: isoDate(scheduled),
      status,
      address: site.address,
      coordinates: site.coordinates,
      clientName: clientName(client),
      clientPhone: client.phone,
      contactPerson: order.contact,
      productName,
      quantity,
      internalNotes: order.details,
      orderIndex: 0,
      routeId: route ? route.id : null,
      orderId: order.id,
      recurringPlanId: order.orderType === 'Igienizari' ? order.recurringPlanId : null,
      photos: photosFor(taskId, status),
    });
  }

  // Recurring plans that have a route generate their upcoming visits, the same
  // way RecurringIgienizareService.generateTasksForPlan() does.
  for (const plan of recurring) {
    if (plan.routeId === null || !plan.active || plan.startDate === null) continue;

    const client = clients.find((c) => c.id === plan.clientId)!;
    const subscription = subscriptions.find((s) => s.id === plan.subscriptionId);
    const start = new Date(`${plan.startDate}T00:00:00.000Z`);
    let lastGenerated: string | null = null;

    for (let visit = 0; visit < int(2, 4); visit += 1) {
      const scheduled = addDays(start, plan.frequencyDays * visit);
      if (scheduled.getTime() > addDays(TODAY, 90).getTime()) break;

      taskId += 1;
      const status = statusFor(scheduled);
      tasks.push({
        id: taskId,
        type: 'SANITIZATION',
        scheduledTime: isoDateTime(scheduled, 8),
        scheduledDate: isoDate(scheduled),
        status,
        address: plan.sanitationLocationAddress,
        coordinates: plan.sanitationLocationCoordinates,
        clientName: clientName(client),
        clientPhone: client.phone,
        contactPerson: plan.contact,
        productName: subscription?.name ?? null,
        quantity: null,
        internalNotes: plan.details,
        orderIndex: 0,
        routeId: plan.routeId,
        orderId: null,
        recurringPlanId: plan.id,
        photos: photosFor(taskId, status),
      });
      lastGenerated = isoDate(scheduled);
    }

    plan.lastGeneratedDate = lastGenerated;
  }

  // A pool of ad-hoc tasks with no order behind them; most are unrouted, which
  // is what the dispatcher's inbox looks like in practice.
  for (let index = 0; index < 15; index += 1) {
    taskId += 1;
    const client = pick(clients);
    const site = siteFor(client.id);
    const scheduled = addDays(TODAY, int(-5, 20));
    const status = statusFor(scheduled);
    const routed = index % 3 === 0;

    tasks.push({
      id: taskId,
      type: pick(['PLACEMENT', 'PICKUP', 'SANITIZATION'] as const),
      scheduledTime: isoDateTime(scheduled, int(8, 15), pick([0, 30] as const)),
      scheduledDate: isoDate(scheduled),
      status,
      address: site.address,
      coordinates: site.coordinates,
      clientName: clientName(client),
      clientPhone: client.phone,
      contactPerson: chance(0.5) ? `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}` : null,
      productName: pick(products).name,
      quantity: int(1, 4),
      internalNotes: chance(0.4) ? 'Solicitare telefonică, fără comandă în sistem.' : null,
      orderIndex: 0,
      routeId: routed ? routeForCounty(site.county).id : null,
      orderId: null,
      recurringPlanId: null,
      photos: photosFor(taskId, status),
    });
  }

  // --- Auth sessions --------------------------------------------------------
  // A demo device or two per employee so "Sesiuni active" has something to
  // show and revoke on first login, rather than a lone current session.
  const authSessions: AuthSessionRow[] = [];

  // Two pending enrollment requests so "Cereri de acces" has something real to
  // approve in local development. Deliberately NOT auto-approved: the point of
  // the screen is exercising the approve/reject decision.
  const accessRequests: AccessRequestRow[] = [
    {
      id: 1,
      fullName: 'Marius Ciobanu',
      verificationCode: '481902',
      deviceLabel: 'Samsung Galaxy A54',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 2 * 60_000).toISOString(),
      expiresAt: new Date(Date.now() + 8 * 60_000).toISOString(),
      assignedRoleName: null,
      employeeId: null,
      claimSecret: 'mock.claim.seed.marius',
    },
    {
      id: 2,
      fullName: 'Elena Trandafir',
      verificationCode: '250714',
      deviceLabel: 'iPhone 13',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 5 * 60_000).toISOString(),
      expiresAt: new Date(Date.now() + 5 * 60_000).toISOString(),
      assignedRoleName: null,
      employeeId: null,
      claimSecret: 'mock.claim.seed.elena',
    },
  ];
  let sessionId = 0;
  const DEMO_DEVICES = ['Chrome · Windows', 'Aplicație mobilă · Android', 'Safari · iPhone'] as const;

  for (const employee of employees) {
    if (!chance(0.6)) continue;
    sessionId += 1;
    const createdAt = addDays(TODAY, -int(2, 30));
    authSessions.push({
      id: sessionId,
      employeeId: employee.id,
      // Never matches a real localStorage value, so it always shows as a
      // revocable "other" device rather than the current one.
      refreshToken: `mock.refresh.seed.${sessionId}`,
      device: pick(DEMO_DEVICES),
      createdAt: isoInstant(createdAt, int(8, 20)),
      lastUsedAt: isoInstant(addDays(createdAt, int(0, 5)), int(8, 20)),
      revoked: false,
    });
  }

  // --- Compact orderIndex per route --------------------------------------
  for (const route of routes) {
    tasks
      .filter((task) => task.routeId === route.id)
      .sort((a, b) => (a.scheduledTime ?? '').localeCompare(b.scheduledTime ?? '') || a.id - b.id)
      .forEach((task, index) => {
        task.orderIndex = index;
      });
  }

  return {
    clients,
    products,
    subscriptions,
    employees,
    employeeEmails,
    routes,
    tasks,
    orders,
    recurring,
    authSessions,
    accessRequests,
    seq: {
      client: clients.length,
      product: products.length,
      subscription: subscriptions.length,
      employee: employees.length,
      route: routes.length,
      task: taskId,
      order: orderId,
      orderNumber,
      recurring: recurring.length,
      photo: taskId * 10 + 10,
      session: sessionId,
      accessRequest: accessRequests.length,
    },
  };
}
