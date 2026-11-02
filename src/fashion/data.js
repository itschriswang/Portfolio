// ============================================================================
// OPENWEAVE — data layer for the fashion brand transparency lookup.
//
// WHAT THIS IS
//   A practical tool for looking up what major fashion brands actually
//   disclose about their supply chains and climate impact. Not a moral
//   ranking. Every company below is a real, publicly listed or privately
//   held business, grouped under its real corporate parent.
//
// HONESTY RULES, load-bearing
//   - We never invent a metric. A value is either sourced or marked
//     'needs-research'. There are no placeholder numbers on this page.
//   - The one quantified signal we carry is the Fashion Transparency Index
//     (FTI) score, published by Fashion Revolution. It measures how much a
//     brand DISCLOSES across policy, governance, supply-chain traceability,
//     and impact. It is NOT a measure of environmental performance. A brand
//     can score high on disclosure and still have a large footprint.
//   - Parent company, segment and headquarters are stable public facts.
//   - Everything a human still needs to verify is tracked in
//     public/data/fashion-brands.csv so it can be filled in over time.
//
// SOURCES
//   Fashion Revolution, Fashion Transparency Index 2023 (250 brands scored
//   on public disclosure). Company ownership from corporate filings and
//   official brand ownership pages. See SOURCES export at the foot of file.
// ============================================================================

// --- Disclosure status vocabulary. Deliberately plain. No "good"/"bad". ---
export const STATUS = {
  disclosed: { id: 'disclosed', label: 'Disclosed' },
  partial: { id: 'partial', label: 'Partly disclosed' },
  parent: { id: 'parent', label: 'Parent-level only' },
  notFound: { id: 'notFound', label: 'Not found' },
  research: { id: 'research', label: 'Needs research' },
};

// --- Market segments, used for the directory filter chips. ---
export const SEGMENTS = [
  { id: 'sportswear', label: 'Sportswear' },
  { id: 'luxury', label: 'Luxury' },
  { id: 'fastfashion', label: 'Fast fashion' },
  { id: 'department', label: 'Department & value' },
  { id: 'outdoor', label: 'Outdoor' },
  { id: 'denim', label: 'Denim' },
  { id: 'footwear', label: 'Footwear' },
  { id: 'online', label: 'Online retail' },
  { id: 'basics', label: 'Basics & mass market' },
];

// FTI score bands. Fashion Revolution groups results into 0-10% ... 81-100%
// brackets. We collapse to four plain-English bands for the signal chip.
export const FTI_BANDS = [
  { min: 60, id: 'high', label: 'High disclosure', note: 'Publishes a lot of supply-chain and policy detail.' },
  { min: 35, id: 'mid', label: 'Moderate disclosure', note: 'Discloses the basics; gaps remain in the detail.' },
  { min: 15, id: 'low', label: 'Low disclosure', note: 'Publishes little that can be independently checked.' },
  { min: 0, id: 'minimal', label: 'Minimal disclosure', note: 'Almost nothing public to work from.' },
];

export function ftiBand(score) {
  if (score == null) return null;
  return FTI_BANDS.find((b) => score >= b.min) || FTI_BANDS[FTI_BANDS.length - 1];
}

// ---------------------------------------------------------------------------
// BRAND LOGOS.
//
// Each brand shows its REAL mark, loaded at runtime by the company's web
// domain (BRAND_DOMAIN below). Clearbit's free logo CDN was retired after the
// HubSpot acquisition, so instead of one provider the page walks an ordered
// chain of keyless icon services: Google's s2 favicon service (never 404s, but
// serves a tiny generic globe when it has nothing, which BrandLogo detects by
// rendered size and treats as a miss). If it misses, the brand falls back to a
// generated "woven care-label" monogram (deriveMonogram + SEGMENT_STYLE) so
// every brand always has a mark.
//
// Only google.com is called at runtime, on purpose: an earlier provider
// (icons.duckduckgo.com) was dropped because corporate web filters routinely
// categorise DuckDuckGo under "proxy avoidance / anonymisers" and block it,
// which flagged the whole page on locked-down networks. google.com is
// universally allow-listed, so the lookup no longer reaches a blocked host.
//
// LOGO_SOURCES stays the single swap-point: to move to a keyed provider later
// (e.g. Logo.dev or Brandfetch) prepend a URL builder here; nothing else moves.
// ---------------------------------------------------------------------------
export const LOGO_SOURCES = [
  (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
];

export function logoUrl(domain, source = 0) {
  if (!domain || source < 0 || source >= LOGO_SOURCES.length) return null;
  return LOGO_SOURCES[source](domain);
}

// Primary web domain per brand, used to fetch the logo. Kept as a flat map so
// adding a brand to RAW_BRANDS stays a one-liner; add its domain here too.
export const BRAND_DOMAIN = {
  Nike: 'nike.com',
  Adidas: 'adidas.com',
  Puma: 'puma.com',
  ASICS: 'asics.com',
  'New Balance': 'newbalance.com',
  'Under Armour': 'underarmour.com',
  lululemon: 'lululemon.com',
  'Louis Vuitton': 'louisvuitton.com',
  Dior: 'dior.com',
  Loewe: 'loewe.com',
  Fendi: 'fendi.com',
  Celine: 'celine.com',
  Gucci: 'gucci.com',
  'Saint Laurent': 'ysl.com',
  Balenciaga: 'balenciaga.com',
  'Bottega Veneta': 'bottegaveneta.com',
  Hermès: 'hermes.com',
  Chanel: 'chanel.com',
  Prada: 'prada.com',
  'Miu Miu': 'miumiu.com',
  Burberry: 'burberry.com',
  Moncler: 'moncler.com',
  'Ralph Lauren': 'ralphlauren.com',
  Zara: 'zara.com',
  'Pull&Bear': 'pullandbear.com',
  Bershka: 'bershka.com',
  'H&M': 'hm.com',
  COS: 'cosstores.com',
  Uniqlo: 'uniqlo.com',
  GU: 'gu-global.com',
  Shein: 'shein.com',
  Temu: 'temu.com',
  Primark: 'primark.com',
  Boohoo: 'boohoo.com',
  ASOS: 'asos.com',
  Zalando: 'zalando.com',
  Next: 'next.co.uk',
  'Levi Strauss': 'levi.com',
  Gap: 'gap.com',
  'Calvin Klein': 'calvinklein.com',
  'Tommy Hilfiger': 'tommy.com',
  'The North Face': 'thenorthface.com',
  Vans: 'vans.com',
  Timberland: 'timberland.com',
  Patagonia: 'patagonia.com',
  Coach: 'coach.com',
  'Kate Spade': 'katespade.com',
  'TK Maxx': 'tkmaxx.com',
  'Ross Stores': 'rossstores.com',
  'JD Sports': 'jdsports.co.uk',
  'Kmart Australia': 'kmart.com.au',
  'Target Australia': 'target.com.au',
  'Big W': 'bigw.com.au',
  'Cotton On': 'cottonon.com',
  'Country Road': 'countryroad.com.au',
  'The Iconic': 'theiconic.com.au',
  'R.M. Williams': 'rmwilliams.com.au',
  Zimmermann: 'zimmermann.com',
  Camilla: 'camilla.com',
  'Lorna Jane': 'lornajane.com.au',
  Bonds: 'bonds.com.au',
  Converse: 'converse.com',
  Jordan: 'nike.com',
  Champion: 'champion.com',
  Reebok: 'reebok.com',
  Fila: 'fila.com',
  Skechers: 'skechers.com',
  Speedo: 'speedo.com',
  Gymshark: 'gymshark.com',
  Lacoste: 'lacoste.com',
  Decathlon: 'decathlon.com',
  UGG: 'ugg.com',
  'Dr. Martens': 'drmartens.com',
  'Columbia Sportswear': 'columbia.com',
  Kathmandu: 'kathmandu.com.au',
  Guess: 'guess.com',
  'G-Star RAW': 'g-star.com',
  Diesel: 'diesel.com',
  Wrangler: 'wrangler.com',
  'C&A': 'c-and-a.com',
  'United Colors of Benetton': 'benetton.com',
  Mango: 'mango.com',
  'Massimo Dutti': 'massimodutti.com',
  Stradivarius: 'stradivarius.com',
  Superdry: 'superdry.com',
  'River Island': 'riverisland.com',
  'Abercrombie & Fitch': 'abercrombie.com',
  OVS: 'ovs.it',
  PrettyLittleThing: 'prettylittlething.com',
  'Marks & Spencer': 'marksandspencer.com',
  'Old Navy': 'oldnavy.gap.com',
  'Victoria’s Secret': 'victoriassecret.com',
  'Hugo Boss': 'hugoboss.com',
  Armani: 'armani.com',
  'Michael Kors': 'michaelkors.com',
  Versace: 'versace.com',
  'Salvatore Ferragamo': 'ferragamo.com',
  // Full-coverage batch. Confident, well-known primary domains only: a brand
  // whose domain is uncertain is left out on purpose and keeps its monogram.
  Aeropostale: 'aeropostale.com',
  AJIO: 'ajio.com',
  'ALDI Nord': 'aldi-nord.de',
  'ALDI SOUTH': 'aldi-sued.de',
  ALDO: 'aldoshoes.com',
  Amazon: 'amazon.com',
  'American Eagle': 'ae.com',
  Anthropologie: 'anthropologie.com',
  Aritzia: 'aritzia.com',
  Asda: 'asda.com',
  Bally: 'bally.com',
  'Banana Republic': 'bananarepublic.gap.com',
  Billabong: 'billabong.com',
  "Bloomingdale's": 'bloomingdales.com',
  Bonprix: 'bonprix.de',
  'Brooks Sports': 'brooksrunning.com',
  'Brunello Cucinelli': 'brunellocucinelli.com',
  Buckle: 'buckle.com',
  Burlington: 'burlington.com',
  Calzedonia: 'calzedonia.com',
  'Canada Goose': 'canadagoose.com',
  Carhartt: 'carhartt.com',
  'Carolina Herrera': 'carolinaherrera.com',
  Carrefour: 'carrefour.com',
  "Carter's": 'carters.com',
  celio: 'celio.com',
  "Chico's": 'chicos.com',
  Chloé: 'chloe.com',
  Clarks: 'clarks.com',
  Costco: 'costco.com',
  Deichmann: 'deichmann.com',
  Desigual: 'desigual.com',
  "Dick's Sporting Goods": 'dickssportinggoods.com',
  "Dillard's": 'dillards.com',
  Disney: 'disney.com',
  DKNY: 'dkny.com',
  'Dolce & Gabbana': 'dolcegabbana.com',
  Dressmann: 'dressmann.com',
  DSW: 'dsw.com',
  'Eddie Bauer': 'eddiebauer.com',
  'El Corte Inglés': 'elcorteingles.es',
  'Ermenegildo Zegna': 'zegna.com',
  Esprit: 'esprit.com',
  Express: 'express.com',
  Fabletics: 'fabletics.com',
  Falabella: 'falabella.com',
  'Famous Footwear': 'famousfootwear.com',
  Fanatics: 'fanatics.com',
  'Fashion Nova': 'fashionnova.com',
  Fjällräven: 'fjallraven.com',
  'Foot Locker': 'footlocker.com',
  Fossil: 'fossil.com',
  'Free People': 'freepeople.com',
  'Fruit of the Loom': 'fruit.com',
  Furla: 'furla.com',
  'Gerry Weber': 'gerryweber.com',
  Gildan: 'gildan.com',
  Hanes: 'hanes.com',
  'Helly Hansen': 'hellyhansen.com',
  HEMA: 'hema.nl',
  'Hollister Co.': 'hollisterco.com',
  "Hudson's Bay": 'thebay.com',
  Intimissimi: 'intimissimi.com',
  'Jack & Jones': 'jackjones.com',
  'Jack Wolfskin': 'jack-wolfskin.com',
  'Jil Sander': 'jilsander.com',
  Jockey: 'jockey.com',
  'Joe Fresh': 'joefresh.com',
  'John Lewis': 'johnlewis.com',
  'K-Way': 'k-way.com',
  Kaufland: 'kaufland.de',
  Kiabi: 'kiabi.com',
  KiK: 'kik.de',
  "Kohl's": 'kohls.com',
  'La Redoute': 'laredoute.fr',
  "Lands' End": 'landsend.com',
  'LC Waikiki': 'lcwaikiki.com',
  Lidl: 'lidl.com',
  Lindex: 'lindex.com',
  'LL Bean': 'llbean.com',
  Longchamp: 'longchamp.com',
  "Macy's": 'macys.com',
  Mammut: 'mammut.com',
  'Marc Jacobs': 'marcjacobs.com',
  Marni: 'marni.com',
  Matalan: 'matalan.co.uk',
  'Max Mara': 'maxmara.com',
  Merrell: 'merrell.com',
  Mizuno: 'mizuno.com',
  Monoprix: 'monoprix.fr',
  Morrisons: 'morrisons.com',
  Muji: 'muji.com',
  'New Look': 'newlook.com',
  'Nine West': 'ninewest.com',
  Nordstrom: 'nordstrom.com',
  Otto: 'otto.de',
  'Pepe Jeans': 'pepejeans.com',
  Quiksilver: 'quiksilver.com',
  REI: 'rei.com',
  Reserved: 'reserved.com',
  REVOLVE: 'revolve.com',
  Romwe: 'romwe.com',
  Roxy: 'roxy.com',
  'Russell Athletic': 'russellathletic.com',
  's.Oliver': 'soliver.com',
  "Sainsbury's": 'sainsburys.co.uk',
  'Saks Fifth Avenue': 'saksfifthavenue.com',
  Sandro: 'sandro-paris.com',
  'Savage X Fenty': 'savagex.com',
  'Sports Direct': 'sportsdirect.com',
  'Steve Madden': 'stevemadden.com',
  Tchibo: 'tchibo.de',
  'Ted Baker': 'tedbaker.com',
  Tesco: 'tesco.com',
  Tezenis: 'tezenis.com',
  "The Children's Place": 'childrensplace.com',
  'The Warehouse': 'thewarehouse.co.nz',
  "Tod's": 'tods.com',
  'Tom Ford': 'tomford.com',
  'Tommy Bahama': 'tommybahama.com',
  'Tory Burch': 'toryburch.com',
  Triumph: 'triumph.com',
  'Urban Outfitters': 'urbanoutfitters.com',
  Valentino: 'valentino.com',
  'Vero Moda': 'veromoda.com',
  Very: 'very.co.uk',
  Walmart: 'walmart.com',
  'Woolworths South Africa': 'woolworths.co.za',
  Zeeman: 'zeeman.com',
};

// Corporate-parent domains, for the real logo shown on each group card.
export const GROUP_DOMAIN = {
  LVMH: 'lvmh.com',
  Kering: 'kering.com',
  Inditex: 'inditex.com',
  'VF Corporation': 'vfc.com',
  'Fast Retailing': 'fastretailing.com',
  'H&M Group': 'hmgroup.com',
  'Prada Group': 'pradagroup.com',
  'PVH Corp.': 'pvh.com',
  'Tapestry, Inc.': 'tapestry.com',
  Wesfarmers: 'wesfarmers.com.au',
  'Nike, Inc.': 'nike.com',
  'Capri Holdings': 'capriholdings.com',
  Hanesbrands: 'hanesbrands.com',
  'Gap Inc.': 'gapinc.com',
  'Authentic Brands Group': 'authentic.com',
  URBN: 'urbn.com',
  'Calzedonia Group': 'calzedoniagroup.com',
  Boardriders: 'boardriders.com',
  'Schwarz Group': 'gruppe.schwarz',
  'Reliance Retail': 'relianceretail.com',
  'Otto Group': 'ottogroup.com',
  'OTB Group': 'otb.net',
  'Macy’s, Inc.': 'macysinc.com',
  'Landmark Group': 'landmarkgroup.com',
  'Hudson’s Bay Company': 'hbc.com',
  Bestseller: 'bestseller.com',
  'Berkshire Hathaway': 'berkshirehathaway.com',
  'Abercrombie & Fitch Co.': 'abercrombie.com',
};

// ---------------------------------------------------------------------------
// BRAND MONOGRAMS — the fallback mark when no real logo resolves.
//
// A self-derived monogram rendered as a fabric-label tile in the page's own
// visual language. It guarantees every brand (present or future) has a mark
// even with no domain on file or a CDN miss.
//
// A short override map is kept only for houses whose established lettermark is
// not what the plain derivation would produce (Gucci's double-G, YSL, and so
// on). Everything else falls through to deriveMonogram().
// ---------------------------------------------------------------------------
export const MONO_OVERRIDES = {
  Gucci: 'GG',
  'Saint Laurent': 'YSL',
  Dior: 'CD',
  Chanel: 'CC',
  Fendi: 'FF',
  'The North Face': 'TNF',
};

// Words we skip when taking initials, so "The North Face" reads NF not TN.
const MONO_STOPWORDS = new Set(['the', 'a', 'an', 'of', 'and', 'for']);

export function deriveMonogram(name) {
  if (!name) return '—';
  if (MONO_OVERRIDES[name]) return MONO_OVERRIDES[name];
  const words = name
    .replace(/&/g, ' ')
    .split(/[\s\-–—/]+/)
    .filter(Boolean)
    .filter((w) => !MONO_STOPWORDS.has(w.toLowerCase()));
  if (words.length === 0) return name.slice(0, 2).toUpperCase();
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  const w = words[0];
  if (w.length <= 3) return w.toUpperCase();
  return w.slice(0, 2).toUpperCase();
}

// Per-segment identity: which typeface the monogram is set in, and the colour
// of the label's stitch line. The accents are the site's chart-grade hues (the
// same darker steps the footprint dashboard validated for contrast and CVD
// separation), so the marks read as one family with the rest of the site. This
// is also a quiet legend: once you learn the colours, the directory reads as a
// segment map. type is 'disp' (couture display), 'sans' or 'mono' (retail).
export const SEGMENT_STYLE = {
  sportswear:  { type: 'sans', accent: 'var(--slate)' },
  luxury:      { type: 'disp', accent: '#635BFF' },
  fastfashion: { type: 'mono', accent: '#C7274A' },
  department:  { type: 'mono', accent: 'var(--subtle)' },
  outdoor:     { type: 'sans', accent: '#75821D' },
  denim:       { type: 'sans', accent: '#0891B2' },
  footwear:    { type: 'sans', accent: 'var(--mid)' },
  online:      { type: 'mono', accent: '#B56A00' },
  basics:      { type: 'mono', accent: '#8A4FBE' },
};

export function segmentStyle(id) {
  return SEGMENT_STYLE[id] || { type: 'sans', accent: 'var(--slate)' };
}

// ---------------------------------------------------------------------------
// THE BRAND UNIVERSE.
//
// Each entry carries only facts we can stand behind:
//   name       the brand as people know it
//   aliases    alternate spellings / search shortcuts
//   parent     the corporate parent (a real company)
//   group      the reporting group whose disclosures cover this brand,
//              when different from the parent trading name
//   segment    market segment id (see SEGMENTS)
//   country    headquarters country
//   au         true if it is an Australian brand or has a major AU presence
//   recognition 'high' | 'medium' — rough familiarity to a general audience
//   knownFor   one honest descriptor
//   fti        Fashion Transparency Index 2023 score (0-100) or null.
//              null renders as "Needs research", never as a guess.
//   ftiNote    context on the score (e.g. "scored under parent")
//   reportUrl  a real sustainability/ESG landing page, or null
//
// The heavier per-field disclosure statuses (scope 1/2, scope 3, materials,
// supply chain, circularity) are intentionally left to the research tracker
// rather than asserted here without a source. buildBrand() defaults them to
// 'needs-research' so the page never overclaims.
// ---------------------------------------------------------------------------
const RAW_BRANDS = [
  // ---- Sportswear -------------------------------------------------------
  { name: 'Nike', aliases: ['nike'], parent: 'Nike, Inc.', segment: 'sportswear', country: 'United States', recognition: 'high', knownFor: 'Footwear and athletic apparel', fti: null, reportUrl: 'https://about.nike.com/en/impact' },
  { name: 'Adidas', aliases: ['adidas'], parent: 'Adidas AG', segment: 'sportswear', country: 'Germany', recognition: 'high', knownFor: 'Sportswear and footwear', fti: null, reportUrl: 'https://www.adidas-group.com/en/sustainability/' },
  { name: 'Puma', aliases: ['puma'], parent: 'Puma SE', group: 'Puma SE (Artémis / Pinault-controlled)', segment: 'sportswear', country: 'Germany', recognition: 'high', knownFor: 'Sportswear and football boots', fti: null, reportUrl: 'https://about.puma.com/en/sustainability' },
  { name: 'ASICS', aliases: ['asics'], parent: 'ASICS Corporation', segment: 'sportswear', country: 'Japan', recognition: 'medium', knownFor: 'Running shoes', fti: null, reportUrl: 'https://corp.asics.com/en/csr' },
  { name: 'New Balance', aliases: ['new balance', 'nb'], parent: 'New Balance Athletics, Inc.', segment: 'sportswear', country: 'United States', recognition: 'high', knownFor: 'Running and lifestyle footwear', fti: null, reportUrl: 'https://www.newbalance.com/responsible-leadership/' },
  { name: 'Under Armour', aliases: ['under armour', 'underarmour', 'ua'], parent: 'Under Armour, Inc.', segment: 'sportswear', country: 'United States', recognition: 'high', knownFor: 'Performance sportswear', fti: null, reportUrl: 'https://about.underarmour.com/en/sustainability' },
  { name: 'lululemon', aliases: ['lululemon', 'lulu'], parent: 'lululemon athletica inc.', segment: 'sportswear', country: 'Canada', recognition: 'high', knownFor: 'Yoga and athleisure', fti: null, reportUrl: 'https://corporate.lululemon.com/our-impact' },

  // ---- Luxury (LVMH) ----------------------------------------------------
  { name: 'Louis Vuitton', aliases: ['louis vuitton', 'lv', 'vuitton'], parent: 'LVMH', segment: 'luxury', country: 'France', recognition: 'high', knownFor: 'Leather goods and fashion', fti: null, reportUrl: 'https://www.lvmh.com/en/our-commitments/environment' },
  { name: 'Dior', aliases: ['dior', 'christian dior'], parent: 'LVMH', segment: 'luxury', country: 'France', recognition: 'high', knownFor: 'Couture and ready-to-wear', fti: null, reportUrl: 'https://www.lvmh.com/en/our-commitments/environment' },
  { name: 'Loewe', aliases: ['loewe'], parent: 'LVMH', segment: 'luxury', country: 'Spain', recognition: 'medium', knownFor: 'Leather goods', fti: null, reportUrl: 'https://www.lvmh.com/en/our-commitments/environment' },
  { name: 'Fendi', aliases: ['fendi'], parent: 'LVMH', segment: 'luxury', country: 'Italy', recognition: 'medium', knownFor: 'Fur, leather and ready-to-wear', fti: null, reportUrl: 'https://www.lvmh.com/en/our-commitments/environment' },
  { name: 'Celine', aliases: ['celine', 'céline'], parent: 'LVMH', segment: 'luxury', country: 'France', recognition: 'medium', knownFor: 'Ready-to-wear and leather goods', fti: null, reportUrl: 'https://www.lvmh.com/en/our-commitments/environment' },

  // ---- Luxury (Kering) --------------------------------------------------
  { name: 'Gucci', aliases: ['gucci'], parent: 'Kering', segment: 'luxury', country: 'Italy', recognition: 'high', knownFor: 'Ready-to-wear, leather goods', fti: 80, ftiNote: 'Ranked 2nd of 250 in FTI 2023, up 21 points year on year and the first luxury house in the top tier.', reportUrl: 'https://www.kering.com/en/sustainability/' },
  { name: 'Saint Laurent', aliases: ['saint laurent', 'ysl', 'yves saint laurent'], parent: 'Kering', segment: 'luxury', country: 'France', recognition: 'high', knownFor: 'Ready-to-wear and leather', fti: null, reportUrl: 'https://www.kering.com/en/sustainability/' },
  { name: 'Balenciaga', aliases: ['balenciaga'], parent: 'Kering', segment: 'luxury', country: 'Spain', recognition: 'high', knownFor: 'Ready-to-wear and sneakers', fti: null, reportUrl: 'https://www.kering.com/en/sustainability/' },
  { name: 'Bottega Veneta', aliases: ['bottega veneta', 'bottega'], parent: 'Kering', segment: 'luxury', country: 'Italy', recognition: 'medium', knownFor: 'Woven leather goods', fti: null, reportUrl: 'https://www.kering.com/en/sustainability/' },

  // ---- Luxury (independent / other groups) ------------------------------
  { name: 'Hermès', aliases: ['hermes', 'hermès'], parent: 'Hermès International', segment: 'luxury', country: 'France', recognition: 'high', knownFor: 'Leather goods and silk', fti: null, reportUrl: 'https://finance.hermes.com/en/sustainable-development/' },
  { name: 'Chanel', aliases: ['chanel'], parent: 'Chanel Limited (private)', segment: 'luxury', country: 'France', recognition: 'high', knownFor: 'Couture, fragrance, leather', fti: null, reportUrl: 'https://www.chanelmission1o5.com/' },
  { name: 'Prada', aliases: ['prada'], parent: 'Prada Group', segment: 'luxury', country: 'Italy', recognition: 'high', knownFor: 'Ready-to-wear and leather', fti: null, reportUrl: 'https://www.pradagroup.com/en/sustainability.html' },
  { name: 'Miu Miu', aliases: ['miu miu', 'miumiu'], parent: 'Prada Group', segment: 'luxury', country: 'Italy', recognition: 'medium', knownFor: 'Ready-to-wear', fti: null, reportUrl: 'https://www.pradagroup.com/en/sustainability.html' },
  { name: 'Burberry', aliases: ['burberry'], parent: 'Burberry Group plc', segment: 'luxury', country: 'United Kingdom', recognition: 'high', knownFor: 'Trench coats and check', fti: null, reportUrl: 'https://www.burberryplc.com/en/responsibility.html' },
  { name: 'Moncler', aliases: ['moncler'], parent: 'Moncler Group', segment: 'luxury', country: 'Italy', recognition: 'medium', knownFor: 'Down outerwear', fti: null, reportUrl: 'https://www.monclergroup.com/en/sustainability' },
  { name: 'Ralph Lauren', aliases: ['ralph lauren', 'polo', 'polo ralph lauren'], parent: 'Ralph Lauren Corporation', segment: 'luxury', country: 'United States', recognition: 'high', knownFor: 'Preppy ready-to-wear', fti: null, reportUrl: 'https://corporate.ralphlauren.com/citizenship-sustainability' },

  // ---- Fast fashion (Inditex) -------------------------------------------
  { name: 'Zara', aliases: ['zara'], parent: 'Inditex', segment: 'fastfashion', country: 'Spain', recognition: 'high', knownFor: 'Fast fashion apparel', fti: null, reportUrl: 'https://www.inditex.com/itxcomweb/en/sustainability' },
  { name: 'Pull&Bear', aliases: ['pull&bear', 'pull and bear', 'pullandbear', 'pull bear'], parent: 'Inditex', segment: 'fastfashion', country: 'Spain', recognition: 'medium', knownFor: 'Youth fast fashion', fti: null, reportUrl: 'https://www.inditex.com/itxcomweb/en/sustainability' },
  { name: 'Bershka', aliases: ['bershka'], parent: 'Inditex', segment: 'fastfashion', country: 'Spain', recognition: 'medium', knownFor: 'Youth fast fashion', fti: null, reportUrl: 'https://www.inditex.com/itxcomweb/en/sustainability' },

  // ---- Fast fashion (H&M Group) -----------------------------------------
  { name: 'H&M', aliases: ['h&m', 'hm', 'h and m', 'hennes'], parent: 'H&M Group', segment: 'fastfashion', country: 'Sweden', recognition: 'high', knownFor: 'High-street fast fashion', fti: 71, ftiNote: 'Among the top-scoring brands in FTI 2023, one of the highest for a high-volume producer.', reportUrl: 'https://hmgroup.com/sustainability/' },
  { name: 'COS', aliases: ['cos'], parent: 'H&M Group', segment: 'fastfashion', country: 'Sweden', recognition: 'medium', knownFor: 'Minimal contemporary basics', fti: null, reportUrl: 'https://hmgroup.com/sustainability/' },

  // ---- Fast fashion / basics (Fast Retailing) ---------------------------
  { name: 'Uniqlo', aliases: ['uniqlo'], parent: 'Fast Retailing', segment: 'basics', country: 'Japan', recognition: 'high', knownFor: 'Everyday basics', fti: null, reportUrl: 'https://www.fastretailing.com/eng/sustainability/' },
  { name: 'GU', aliases: ['gu'], parent: 'Fast Retailing', segment: 'basics', country: 'Japan', recognition: 'medium', knownFor: 'Value basics', fti: null, reportUrl: 'https://www.fastretailing.com/eng/sustainability/' },

  // ---- Ultra-fast / marketplace -----------------------------------------
  { name: 'Shein', aliases: ['shein'], parent: 'Roadget Business / Shein Group', segment: 'fastfashion', country: 'Singapore / China', recognition: 'high', knownFor: 'Ultra-fast online fashion', fti: null, reportUrl: 'https://www.sheingroup.com/sustainability/' },
  { name: 'Temu', aliases: ['temu'], parent: 'PDD Holdings', segment: 'online', country: 'China', recognition: 'high', knownFor: 'Ultra-discount marketplace', fti: null, ftiScope: 'outside', ftiNote: 'Not assessed by the Fashion Transparency Index. The marketplace launched in 2022, outside the 2023 brand set.', reportUrl: null },

  // ---- Fast fashion / value (Europe) ------------------------------------
  { name: 'Primark', aliases: ['primark'], parent: 'Associated British Foods', segment: 'fastfashion', country: 'Ireland', recognition: 'high', knownFor: 'Ultra-low-price high street', fti: null, reportUrl: 'https://www.primark.com/en-gb/sustainability' },
  { name: 'Boohoo', aliases: ['boohoo'], parent: 'Boohoo Group plc', segment: 'online', country: 'United Kingdom', recognition: 'medium', knownFor: 'Online fast fashion', fti: null, reportUrl: 'https://www.boohooplc.com/sustainability' },
  { name: 'ASOS', aliases: ['asos'], parent: 'ASOS plc', segment: 'online', country: 'United Kingdom', recognition: 'high', knownFor: 'Online fashion retailer', fti: null, reportUrl: 'https://www.asosplc.com/fashion-with-integrity/' },
  { name: 'Zalando', aliases: ['zalando'], parent: 'Zalando SE', segment: 'online', country: 'Germany', recognition: 'medium', knownFor: 'Online fashion platform', fti: null, reportUrl: 'https://corporate.zalando.com/en/sustainability' },
  { name: 'Next', aliases: ['next'], parent: 'Next plc', segment: 'department', country: 'United Kingdom', recognition: 'medium', knownFor: 'High-street and online retail', fti: null, reportUrl: 'https://www.nextplc.co.uk/corporate-responsibility' },

  // ---- Denim & Americana ------------------------------------------------
  { name: 'Levi Strauss', aliases: ['levi', 'levis', "levi's", 'levi strauss'], parent: 'Levi Strauss & Co.', segment: 'denim', country: 'United States', recognition: 'high', knownFor: 'Denim jeans', fti: null, reportUrl: 'https://www.levistrauss.com/sustainability/' },
  { name: 'Gap', aliases: ['gap'], parent: 'Gap Inc.', segment: 'basics', country: 'United States', recognition: 'high', knownFor: 'Casual basics and denim', fti: null, reportUrl: 'https://www.gapinc.com/en-us/values/sustainability' },

  // ---- PVH --------------------------------------------------------------
  { name: 'Calvin Klein', aliases: ['calvin klein', 'ck'], parent: 'PVH Corp.', segment: 'basics', country: 'United States', recognition: 'high', knownFor: 'Underwear, denim, ready-to-wear', fti: null, reportUrl: 'https://www.pvh.com/responsibility' },
  { name: 'Tommy Hilfiger', aliases: ['tommy hilfiger', 'tommy'], parent: 'PVH Corp.', segment: 'basics', country: 'United States', recognition: 'high', knownFor: 'Preppy casualwear', fti: null, reportUrl: 'https://www.pvh.com/responsibility' },

  // ---- VF Corporation ---------------------------------------------------
  { name: 'The North Face', aliases: ['the north face', 'north face', 'tnf'], parent: 'VF Corporation', segment: 'outdoor', country: 'United States', recognition: 'high', knownFor: 'Outdoor and technical wear', fti: 66, ftiNote: 'Among the top scorers in FTI 2023; disclosures run through parent VF Corporation.', reportUrl: 'https://www.vfc.com/our-impact' },
  { name: 'Vans', aliases: ['vans'], parent: 'VF Corporation', segment: 'footwear', country: 'United States', recognition: 'high', knownFor: 'Skate and lifestyle footwear', fti: 65, ftiNote: 'Among the top scorers in FTI 2023; disclosures run through parent VF Corporation.', reportUrl: 'https://www.vfc.com/our-impact' },
  { name: 'Timberland', aliases: ['timberland'], parent: 'VF Corporation', segment: 'footwear', country: 'United States', recognition: 'high', knownFor: 'Boots and outdoor footwear', fti: 66, ftiNote: 'Among the top scorers in FTI 2023; disclosures run through parent VF Corporation.', reportUrl: 'https://www.vfc.com/our-impact' },

  // ---- Outdoor (independent) --------------------------------------------
  { name: 'Patagonia', aliases: ['patagonia'], parent: 'Patagonia, Inc. (Holdfast Collective)', segment: 'outdoor', country: 'United States', recognition: 'high', knownFor: 'Outdoor apparel and activism', fti: null, reportUrl: 'https://www.patagonia.com/our-footprint/' },

  // ---- Tapestry ---------------------------------------------------------
  { name: 'Coach', aliases: ['coach'], parent: 'Tapestry, Inc.', segment: 'luxury', country: 'United States', recognition: 'high', knownFor: 'Leather goods', fti: null, reportUrl: 'https://www.tapestry.com/responsibility/' },
  { name: 'Kate Spade', aliases: ['kate spade', 'katespade'], parent: 'Tapestry, Inc.', segment: 'luxury', country: 'United States', recognition: 'medium', knownFor: 'Accessories and ready-to-wear', fti: null, reportUrl: 'https://www.tapestry.com/responsibility/' },

  // ---- Off-price / department -------------------------------------------
  { name: 'TK Maxx', aliases: ['tk maxx', 'tkmaxx', 'tj maxx', 'tjmaxx', 'tjx'], parent: 'TJX Companies', segment: 'department', country: 'United States', recognition: 'high', knownFor: 'Off-price apparel retail', fti: null, reportUrl: 'https://www.tjx.com/responsibility' },
  { name: 'Ross Stores', aliases: ['ross', 'ross stores', 'ross dress for less'], parent: 'Ross Stores, Inc.', segment: 'department', country: 'United States', recognition: 'medium', knownFor: 'Off-price apparel retail', fti: null, reportUrl: 'https://corp.rossstores.com/corporate-responsibility/' },
  { name: 'JD Sports', aliases: ['jd sports', 'jd'], parent: 'JD Sports Fashion plc', segment: 'sportswear', country: 'United Kingdom', recognition: 'medium', knownFor: 'Sportswear retail', fti: null, reportUrl: 'https://www.jdplc.com/sustainability' },

  // ---- Australian-relevant ----------------------------------------------
  { name: 'Kmart Australia', aliases: ['kmart', 'kmart australia'], parent: 'Wesfarmers', group: 'Wesfarmers (Kmart Group)', segment: 'department', country: 'Australia', au: true, recognition: 'high', knownFor: 'Value apparel and homewares', fti: 76, ftiNote: 'Tied 3rd of 250 brands in FTI 2023. A separate company from US Kmart.', reportUrl: 'https://www.wesfarmers.com.au/sustainability' },
  { name: 'Target Australia', aliases: ['target', 'target australia'], parent: 'Wesfarmers', group: 'Wesfarmers (Kmart Group)', segment: 'department', country: 'Australia', au: true, recognition: 'high', knownFor: 'Value apparel and homewares', fti: 76, ftiNote: 'Tied 3rd of 250 brands in FTI 2023. A separate company from US Target.', reportUrl: 'https://www.wesfarmers.com.au/sustainability' },
  { name: 'Big W', aliases: ['big w', 'bigw'], parent: 'Woolworths Group', segment: 'department', country: 'Australia', au: true, recognition: 'high', knownFor: 'Value apparel and general merchandise', fti: null, reportUrl: 'https://www.woolworthsgroup.com.au/au/en/sustainability.html' },
  { name: 'Cotton On', aliases: ['cotton on', 'cottonon'], parent: 'Cotton On Group', segment: 'fastfashion', country: 'Australia', au: true, recognition: 'high', knownFor: 'Value fashion basics', fti: null, reportUrl: 'https://cottonon.com/AU/good-business/' },
  { name: 'Country Road', aliases: ['country road'], parent: 'Country Road Group', group: 'Country Road Group (Woolworths Holdings, South Africa)', segment: 'department', country: 'Australia', au: true, recognition: 'high', knownFor: 'Mid-market apparel and lifestyle', fti: null, reportUrl: 'https://www.countryroad.com.au/sustainability' },
  { name: 'The Iconic', aliases: ['the iconic', 'iconic'], parent: 'Global Fashion Group', segment: 'online', country: 'Australia', au: true, recognition: 'high', knownFor: 'Online fashion retailer', fti: null, ftiScope: 'outside', ftiNote: 'Not assessed by the Fashion Transparency Index. It is a multi-brand marketplace.', reportUrl: 'https://www.theiconic.com.au/considered/' },
  { name: 'R.M. Williams', aliases: ['rm williams', 'r.m. williams', 'rmwilliams'], parent: 'Tattarang', group: 'Tattarang (Andrew and Nicola Forrest)', segment: 'footwear', country: 'Australia', au: true, recognition: 'high', knownFor: 'Heritage leather boots', fti: null, reportUrl: null, notes: 'Certified B Corporation (2024). Australian-owned since Tattarang acquired it in 2020.' },
  { name: 'Zimmermann', aliases: ['zimmermann', 'zimmerman'], parent: 'Advent International', group: 'Advent International (majority, with the Zimmermann family)', segment: 'luxury', country: 'Australia', au: true, recognition: 'high', knownFor: 'Resort and occasion wear', fti: null, reportUrl: null, notes: 'Majority sold to private-equity firm Advent International in 2023.' },
  { name: 'Camilla', aliases: ['camilla', 'camilla franks'], parent: 'Camilla (private)', segment: 'luxury', country: 'Australia', au: true, recognition: 'medium', knownFor: 'Prints and resort wear', fti: null, reportUrl: null, notes: 'Certified B Corporation (2024).' },
  { name: 'Lorna Jane', aliases: ['lorna jane'], parent: 'Lorna Jane (private)', segment: 'sportswear', country: 'Australia', au: true, recognition: 'medium', knownFor: 'Womenswear activewear', fti: null, reportUrl: null },
  { name: 'Bonds', aliases: ['bonds'], parent: 'Hanesbrands', group: 'Hanesbrands (acquired by Gildan, 2025)', segment: 'basics', country: 'Australia', au: true, recognition: 'high', knownFor: 'Underwear and basics', fti: null, reportUrl: null },

  // ---- Expansion: recognisable brands scored in FTI 2023 ------------------
  // Sportswear & footwear
  { name: 'Converse', aliases: ['converse'], parent: 'Nike, Inc.', segment: 'footwear', country: 'United States', recognition: 'high', knownFor: 'Sneakers', reportUrl: null },
  { name: 'Jordan', aliases: ['jordan', 'air jordan'], parent: 'Nike, Inc.', segment: 'sportswear', country: 'United States', recognition: 'high', knownFor: 'Basketball footwear and apparel', reportUrl: null },
  { name: 'Champion', aliases: ['champion'], parent: 'Hanesbrands', segment: 'sportswear', country: 'United States', recognition: 'high', knownFor: 'Athletic and casual wear', reportUrl: null },
  { name: 'Reebok', aliases: ['reebok'], parent: 'Authentic Brands Group', segment: 'sportswear', country: 'United States', recognition: 'high', knownFor: 'Sportswear and footwear', reportUrl: null },
  { name: 'Fila', aliases: ['fila'], parent: 'Fila Holdings', segment: 'sportswear', country: 'South Korea', recognition: 'medium', knownFor: 'Sportswear and footwear', reportUrl: null },
  { name: 'Skechers', aliases: ['skechers'], parent: 'Skechers U.S.A., Inc.', segment: 'footwear', country: 'United States', recognition: 'high', knownFor: 'Comfort footwear', reportUrl: null },
  { name: 'Speedo', aliases: ['speedo'], parent: 'Pentland Brands', segment: 'sportswear', country: 'United Kingdom', recognition: 'high', knownFor: 'Swimwear', reportUrl: null },
  { name: 'Gymshark', aliases: ['gymshark'], parent: 'Gymshark Ltd', segment: 'sportswear', country: 'United Kingdom', recognition: 'medium', knownFor: 'Gym and fitness apparel', reportUrl: null },
  { name: 'Lacoste', aliases: ['lacoste'], parent: 'Maus Frères', segment: 'sportswear', country: 'France', recognition: 'high', knownFor: 'Polo shirts and tennis wear', reportUrl: null },
  { name: 'Decathlon', aliases: ['decathlon'], parent: 'Decathlon', segment: 'sportswear', country: 'France', recognition: 'high', knownFor: 'Value sporting goods', reportUrl: null },

  // Footwear & outdoor
  { name: 'UGG', aliases: ['ugg', 'uggs'], parent: 'Deckers Brands', segment: 'footwear', country: 'United States', recognition: 'high', knownFor: 'Sheepskin boots', reportUrl: null },
  { name: 'Dr. Martens', aliases: ['dr martens', 'dr. martens', 'doc martens', 'docs'], parent: 'Dr. Martens plc', segment: 'footwear', country: 'United Kingdom', recognition: 'high', knownFor: 'Leather boots', reportUrl: null },
  { name: 'Columbia Sportswear', aliases: ['columbia', 'columbia sportswear'], parent: 'Columbia Sportswear Company', segment: 'outdoor', country: 'United States', recognition: 'high', knownFor: 'Outdoor apparel', reportUrl: null },
  { name: 'Kathmandu', aliases: ['kathmandu'], parent: 'KMD Brands', group: 'KMD Brands (also Rip Curl, Oboz)', segment: 'outdoor', country: 'New Zealand', au: true, recognition: 'high', knownFor: 'Outdoor and travel gear', reportUrl: null },

  // Denim
  { name: 'Guess', aliases: ['guess'], parent: 'Guess?, Inc.', segment: 'denim', country: 'United States', recognition: 'high', knownFor: 'Denim and fashion', reportUrl: null },
  { name: 'G-Star RAW', aliases: ['g-star', 'g star', 'gstar', 'g-star raw'], parent: 'G-Star', segment: 'denim', country: 'Netherlands', recognition: 'medium', knownFor: 'Denim', reportUrl: null },
  { name: 'Diesel', aliases: ['diesel'], parent: 'OTB Group', segment: 'denim', country: 'Italy', recognition: 'high', knownFor: 'Denim and fashion', reportUrl: null },
  { name: 'Wrangler', aliases: ['wrangler'], parent: 'Kontoor Brands', segment: 'denim', country: 'United States', recognition: 'high', knownFor: 'Denim workwear', reportUrl: null },

  // Fast fashion & high street
  { name: 'C&A', aliases: ['c&a', 'c and a', 'c a'], parent: 'Cofra Holding', segment: 'fastfashion', country: 'Belgium', recognition: 'medium', knownFor: 'Value high-street fashion', reportUrl: null },
  { name: 'United Colors of Benetton', aliases: ['benetton', 'united colors of benetton'], parent: 'Benetton Group', segment: 'fastfashion', country: 'Italy', recognition: 'medium', knownFor: 'Colourful knitwear and basics', reportUrl: null },
  { name: 'Mango', aliases: ['mango'], parent: 'Punto Fa (Mango)', segment: 'fastfashion', country: 'Spain', recognition: 'high', knownFor: 'High-street fashion', reportUrl: null },
  { name: 'Massimo Dutti', aliases: ['massimo dutti'], parent: 'Inditex', segment: 'fastfashion', country: 'Spain', recognition: 'medium', knownFor: 'Smart-casual fashion', reportUrl: null },
  { name: 'Stradivarius', aliases: ['stradivarius'], parent: 'Inditex', segment: 'fastfashion', country: 'Spain', recognition: 'medium', knownFor: 'Youth fast fashion', reportUrl: null },
  { name: 'Superdry', aliases: ['superdry'], parent: 'Superdry plc', segment: 'fastfashion', country: 'United Kingdom', recognition: 'high', knownFor: 'Graphic casualwear', reportUrl: null },
  { name: 'River Island', aliases: ['river island'], parent: 'River Island', segment: 'fastfashion', country: 'United Kingdom', recognition: 'medium', knownFor: 'High-street fashion', reportUrl: null },
  { name: 'Abercrombie & Fitch', aliases: ['abercrombie', 'abercrombie & fitch', 'a&f'], parent: 'Abercrombie & Fitch Co.', segment: 'fastfashion', country: 'United States', recognition: 'high', knownFor: 'Casual American apparel', reportUrl: null },
  { name: 'OVS', aliases: ['ovs'], parent: 'OVS S.p.A.', segment: 'fastfashion', country: 'Italy', recognition: 'medium', knownFor: 'Value family fashion', reportUrl: null },
  { name: 'PrettyLittleThing', aliases: ['prettylittlething', 'plt', 'pretty little thing'], parent: 'Boohoo Group', segment: 'online', country: 'United Kingdom', recognition: 'high', knownFor: 'Online fast fashion', reportUrl: null },

  // Department, basics & value
  { name: 'Marks & Spencer', aliases: ['marks and spencer', 'marks & spencer', 'm&s'], parent: 'Marks & Spencer Group', segment: 'department', country: 'United Kingdom', recognition: 'high', knownFor: 'Clothing, food and home', reportUrl: null },
  { name: 'Old Navy', aliases: ['old navy'], parent: 'Gap Inc.', segment: 'basics', country: 'United States', recognition: 'high', knownFor: 'Value family basics', reportUrl: null },
  { name: 'Victoria’s Secret', aliases: ['victorias secret', 'victoria secret', 'victoria’s secret'], parent: 'Victoria’s Secret & Co.', segment: 'basics', country: 'United States', recognition: 'high', knownFor: 'Lingerie and beauty', reportUrl: null },

  // Luxury & premium
  { name: 'Hugo Boss', aliases: ['hugo boss', 'boss'], parent: 'Hugo Boss AG', segment: 'luxury', country: 'Germany', recognition: 'high', knownFor: 'Tailoring and ready-to-wear', reportUrl: null },
  { name: 'Armani', aliases: ['armani', 'giorgio armani', 'emporio armani'], parent: 'Giorgio Armani S.p.A.', segment: 'luxury', country: 'Italy', recognition: 'high', knownFor: 'Tailoring and ready-to-wear', reportUrl: null },
  { name: 'Michael Kors', aliases: ['michael kors', 'mk'], parent: 'Capri Holdings', segment: 'luxury', country: 'United States', recognition: 'high', knownFor: 'Accessories and ready-to-wear', reportUrl: null },
  { name: 'Versace', aliases: ['versace'], parent: 'Capri Holdings', segment: 'luxury', country: 'Italy', recognition: 'high', knownFor: 'Ready-to-wear and accessories', reportUrl: null },
  { name: 'Salvatore Ferragamo', aliases: ['ferragamo', 'salvatore ferragamo'], parent: 'Salvatore Ferragamo Group', segment: 'luxury', country: 'Italy', recognition: 'medium', knownFor: 'Footwear and leather goods', reportUrl: null },

  // ---- Full FTI 2023 coverage: the remaining ranked brands and retailers ----
  { name: "Aeropostale", aliases: ["aeropostale"], parent: "Authentic Brands Group LLC", segment: "fastfashion", country: "United States", recognition: "medium", knownFor: "Teen casualwear", reportUrl: null },
  { name: "AJIO", aliases: ["ajio"], parent: "Reliance Retail", segment: "online", country: "India", recognition: "low", knownFor: "Online fashion retailer", reportUrl: null },
  { name: "ALDI Nord", aliases: ["aldi nord"], parent: "ALDI Nord", segment: "department", country: "Germany", recognition: "high", knownFor: "Discount supermarket apparel", reportUrl: null },
  { name: "ALDI SOUTH", aliases: ["aldi south"], parent: "ALDI S\u00dcD", segment: "department", country: "Germany", recognition: "high", knownFor: "Discount supermarket apparel", reportUrl: null },
  { name: "ALDO", aliases: ["aldo"], parent: "The Aldo Group", segment: "footwear", country: "Canada", recognition: "medium", knownFor: "Footwear and accessories", reportUrl: null },
  { name: "Amazon", aliases: ["amazon"], parent: "Amazon.com, Inc.", segment: "online", country: "United States", recognition: "high", knownFor: "Online marketplace and own labels", reportUrl: null },
  { name: "American Eagle", aliases: ["american eagle"], parent: "American Eagle Outfitters", segment: "fastfashion", country: "United States", recognition: "high", knownFor: "Casual and denim", reportUrl: null },
  { name: "ANTA", aliases: ["anta"], parent: "ANTA Sports", segment: "sportswear", country: "China", recognition: "medium", knownFor: "Chinese sportswear group", reportUrl: null },
  { name: "Anthropologie", aliases: ["anthropologie"], parent: "URBN", segment: "fastfashion", country: "United States", recognition: "medium", knownFor: "Bohemian women\u2019s fashion", reportUrl: null },
  { name: "Aritzia", aliases: ["aritzia"], parent: "Aritzia", segment: "fastfashion", country: "Canada", recognition: "medium", knownFor: "Women\u2019s fashion", reportUrl: null },
  { name: "Asda", aliases: ["asda"], parent: "Asda (TDR Capital)", segment: "department", country: "United Kingdom", recognition: "medium", knownFor: "Supermarket apparel (George)", reportUrl: null },
  { name: "Bally", aliases: ["bally"], parent: "JAB Holding Company", segment: "luxury", country: "Switzerland", recognition: "medium", knownFor: "Luxury footwear and leather", reportUrl: null },
  { name: "Banana Republic", aliases: ["banana republic"], parent: "Gap Inc.", segment: "basics", country: "United States", recognition: "high", knownFor: "Smart-casual apparel", reportUrl: null },
  { name: "BCBGMAXAZRIA", aliases: ["bcbgmaxazria"], parent: "Marquee Brands", segment: "fastfashion", country: "United States", recognition: "low", knownFor: "Women\u2019s fashion", reportUrl: null },
  { name: "Beanpole", aliases: ["beanpole"], parent: "Samsung C&T", segment: "fastfashion", country: "South Korea", recognition: "low", knownFor: "Korean casualwear", reportUrl: null },
  { name: "Belle", aliases: ["belle"], parent: "Belle International", segment: "footwear", country: "China", recognition: "low", knownFor: "Chinese footwear", reportUrl: null },
  { name: "Big Bazaar \u2013 ffb", aliases: ["big bazaar \u2013 ffb"], parent: "Future Group", segment: "department", country: "India", recognition: "low", knownFor: "Indian hypermarket", reportUrl: null },
  { name: "Billabong", aliases: ["billabong"], parent: "Boardriders", segment: "outdoor", country: "Australia", au: true, recognition: "high", knownFor: "Surfwear", reportUrl: null },
  { name: "Bloomingdale's", aliases: ["bloomingdale's"], parent: "Macy\u2019s, Inc.", segment: "department", country: "United States", recognition: "medium", knownFor: "Department store", reportUrl: null },
  { name: "Bonprix", aliases: ["bonprix"], parent: "Otto Group", segment: "online", country: "Germany", recognition: "low", knownFor: "Online value fashion", reportUrl: null },
  { name: "Bosideng", aliases: ["bosideng"], parent: "Bosideng", segment: "outdoor", country: "China", recognition: "low", knownFor: "Chinese down jackets", reportUrl: null },
  { name: "Brooks Sports", aliases: ["brooks sports"], parent: "Berkshire Hathaway", segment: "sportswear", country: "United States", recognition: "medium", knownFor: "Running shoes", reportUrl: null },
  { name: "Brunello Cucinelli", aliases: ["brunello cucinelli"], parent: "Brunello Cucinelli", segment: "luxury", country: "Italy", recognition: "medium", knownFor: "Luxury knitwear", reportUrl: null },
  { name: "Buckle", aliases: ["buckle"], parent: "The Buckle, Inc.", segment: "fastfashion", country: "United States", recognition: "low", knownFor: "Denim and casual retailer", reportUrl: null },
  { name: "Burlington", aliases: ["burlington"], parent: "Burlington Stores", segment: "department", country: "United States", recognition: "medium", knownFor: "Off-price retailer", reportUrl: null },
  { name: "Calzedonia", aliases: ["calzedonia"], parent: "Calzedonia Group", segment: "basics", country: "Italy", recognition: "medium", knownFor: "Hosiery and swimwear", reportUrl: null },
  { name: "Canada Goose", aliases: ["canada goose"], parent: "Canada Goose", segment: "outdoor", country: "Canada", recognition: "high", knownFor: "Luxury outerwear", reportUrl: null },
  { name: "Carhartt", aliases: ["carhartt"], parent: "Carhartt", segment: "outdoor", country: "United States", recognition: "high", knownFor: "Workwear", reportUrl: null },
  { name: "Carolina Herrera", aliases: ["carolina herrera"], parent: "Puig", segment: "luxury", country: "United States", recognition: "medium", knownFor: "Luxury fashion", reportUrl: null },
  { name: "CAROLL", aliases: ["caroll"], parent: "CAROLL", segment: "fastfashion", country: "France", recognition: "low", knownFor: "Women\u2019s fashion", reportUrl: null },
  { name: "Carrefour", aliases: ["carrefour"], parent: "Carrefour", segment: "department", country: "France", recognition: "high", knownFor: "Hypermarket apparel (Tex)", reportUrl: null },
  { name: "Carter's", aliases: ["carter's"], parent: "Carter\u2019s, Inc.", segment: "basics", country: "United States", recognition: "medium", knownFor: "Children\u2019s clothing", reportUrl: null },
  { name: "celio", aliases: ["celio"], parent: "celio", segment: "fastfashion", country: "France", recognition: "low", knownFor: "Menswear", reportUrl: null },
  { name: "Chico's", aliases: ["chico's"], parent: "Chico\u2019s FAS", segment: "fastfashion", country: "United States", recognition: "low", knownFor: "Women\u2019s fashion", reportUrl: null },
  { name: "Chlo\u00e9", aliases: ["chlo\u00e9"], parent: "Richemont", segment: "luxury", country: "France", recognition: "high", knownFor: "Luxury ready-to-wear", reportUrl: null },
  { name: "Clarks", aliases: ["clarks"], parent: "Clarks", segment: "footwear", country: "United Kingdom", recognition: "high", knownFor: "Footwear", reportUrl: null },
  { name: "Cortefiel", aliases: ["cortefiel"], parent: "Tendam", segment: "fastfashion", country: "Spain", recognition: "low", knownFor: "Spanish fashion", reportUrl: null },
  { name: "Costco", aliases: ["costco"], parent: "Costco", segment: "department", country: "United States", recognition: "high", knownFor: "Warehouse retailer (Kirkland)", reportUrl: null },
  { name: "Deichmann", aliases: ["deichmann"], parent: "Deichmann", segment: "footwear", country: "Germany", recognition: "medium", knownFor: "Value footwear", reportUrl: null },
  { name: "Desigual", aliases: ["desigual"], parent: "Desigual", segment: "fastfashion", country: "Spain", recognition: "medium", knownFor: "Colourful fashion", reportUrl: null },
  { name: "Dick's Sporting Goods", aliases: ["dick's sporting goods"], parent: "Dick\u2019s Sporting Goods", segment: "sportswear", country: "United States", recognition: "medium", knownFor: "Sporting goods retailer", reportUrl: null },
  { name: "Dillard's", aliases: ["dillard's"], parent: "Dillard\u2019s", segment: "department", country: "United States", recognition: "low", knownFor: "Department store", reportUrl: null },
  { name: "Disney", aliases: ["disney"], parent: "The Walt Disney Company", segment: "department", country: "United States", recognition: "high", knownFor: "Licensed character apparel", reportUrl: null },
  { name: "DKNY", aliases: ["dkny"], parent: "G-III Apparel Group", segment: "fastfashion", country: "United States", recognition: "medium", knownFor: "Donna Karan New York", reportUrl: null },
  { name: "Dolce & Gabbana", aliases: ["dolce & gabbana"], parent: "Dolce & Gabbana", segment: "luxury", country: "Italy", recognition: "high", knownFor: "Luxury fashion", reportUrl: null },
  { name: "Dressmann", aliases: ["dressmann"], parent: "Varner", segment: "basics", country: "Norway", recognition: "low", knownFor: "Menswear", reportUrl: null },
  { name: "DSW", aliases: ["dsw"], parent: "Designer Brands", segment: "footwear", country: "United States", recognition: "low", knownFor: "Footwear retailer", reportUrl: null },
  { name: "Eddie Bauer", aliases: ["eddie bauer"], parent: "Authentic Brands Group", segment: "outdoor", country: "United States", recognition: "medium", knownFor: "Outdoor apparel", reportUrl: null },
  { name: "El Corte Ingl\u00e9s", aliases: ["el corte ingl\u00e9s"], parent: "El Corte Ingl\u00e9s", segment: "department", country: "Spain", recognition: "medium", knownFor: "Department store", reportUrl: null },
  { name: "Ermenegildo Zegna", aliases: ["ermenegildo zegna"], parent: "Ermenegildo Zegna Group", segment: "luxury", country: "Italy", recognition: "medium", knownFor: "Luxury menswear", reportUrl: null },
  { name: "Esprit", aliases: ["esprit"], parent: "Esprit", segment: "fastfashion", country: "Germany", recognition: "medium", knownFor: "Casual fashion", reportUrl: null },
  { name: "Express", aliases: ["express"], parent: "Express, Inc.", segment: "fastfashion", country: "United States", recognition: "medium", knownFor: "Workwear-casual fashion", reportUrl: null },
  { name: "Fabletics", aliases: ["fabletics"], parent: "TechStyle Fashion Group", segment: "sportswear", country: "United States", recognition: "medium", knownFor: "Activewear", reportUrl: null },
  { name: "Falabella", aliases: ["falabella"], parent: "Falabella", segment: "department", country: "Chile", recognition: "low", knownFor: "Latin American department store", reportUrl: null },
  { name: "Famous Footwear", aliases: ["famous footwear"], parent: "Caleres", segment: "footwear", country: "United States", recognition: "low", knownFor: "Footwear retailer", reportUrl: null },
  { name: "Fanatics", aliases: ["fanatics"], parent: "Fanatics", segment: "sportswear", country: "United States", recognition: "medium", knownFor: "Licensed sports merchandise", reportUrl: null },
  { name: "Fashion Nova", aliases: ["fashion nova"], parent: "Fashion Nova", segment: "online", country: "United States", recognition: "high", knownFor: "Online ultra-fast fashion", reportUrl: null },
  { name: "Fj\u00e4llr\u00e4ven", aliases: ["fj\u00e4llr\u00e4ven"], parent: "Fenix Outdoor", segment: "outdoor", country: "Sweden", recognition: "medium", knownFor: "Outdoor gear", reportUrl: null },
  { name: "Foot Locker", aliases: ["foot locker"], parent: "Foot Locker, Inc.", segment: "footwear", country: "United States", recognition: "high", knownFor: "Sneaker retailer", reportUrl: null },
  { name: "Foschini", aliases: ["foschini"], parent: "TFG", segment: "department", country: "South Africa", recognition: "low", knownFor: "Fashion retailer", reportUrl: null },
  { name: "Fossil", aliases: ["fossil"], parent: "Fossil Group, Inc.", segment: "basics", country: "United States", recognition: "medium", knownFor: "Watches and accessories", reportUrl: null },
  { name: "Free People", aliases: ["free people"], parent: "URBN", segment: "fastfashion", country: "United States", recognition: "medium", knownFor: "Bohemian women\u2019s fashion", reportUrl: null },
  { name: "Fruit of the Loom", aliases: ["fruit of the loom"], parent: "Berkshire Hathaway", segment: "basics", country: "United States", recognition: "high", knownFor: "Basics and underwear", reportUrl: null },
  { name: "Furla", aliases: ["furla"], parent: "Furla", segment: "luxury", country: "Italy", recognition: "medium", knownFor: "Leather goods", reportUrl: null },
  { name: "Gerry Weber", aliases: ["gerry weber"], parent: "Gerry Weber", segment: "fastfashion", country: "Germany", recognition: "low", knownFor: "Women\u2019s fashion", reportUrl: null },
  { name: "Gildan", aliases: ["gildan"], parent: "Gildan Activewear", segment: "basics", country: "Canada", recognition: "medium", knownFor: "Blank basics and underwear", reportUrl: null },
  { name: "Hanes", aliases: ["hanes"], parent: "Hanesbrands", segment: "basics", country: "United States", recognition: "high", knownFor: "Underwear and basics", reportUrl: null },
  { name: "Heilan Home", aliases: ["heilan home"], parent: "Heilan Home", segment: "basics", country: "China", recognition: "low", knownFor: "Chinese menswear", reportUrl: null },
  { name: "Helly Hansen", aliases: ["helly hansen"], parent: "Canadian Tire", segment: "outdoor", country: "Norway", recognition: "medium", knownFor: "Outdoor and sailing gear", reportUrl: null },
  { name: "HEMA", aliases: ["hema"], parent: "HEMA", segment: "department", country: "Netherlands", recognition: "medium", knownFor: "Value general retailer", reportUrl: null },
  { name: "Hollister Co.", aliases: ["hollister co."], parent: "Abercrombie & Fitch Co.", segment: "fastfashion", country: "United States", recognition: "high", knownFor: "Teen casualwear", reportUrl: null },
  { name: "Hudson's Bay", aliases: ["hudson's bay"], parent: "Hudson\u2019s Bay Company", segment: "department", country: "Canada", recognition: "low", knownFor: "Department store", reportUrl: null },
  { name: "Intimissimi", aliases: ["intimissimi"], parent: "Calzedonia Group", segment: "basics", country: "Italy", recognition: "medium", knownFor: "Lingerie", reportUrl: null },
  { name: "Ito-Yokado", aliases: ["ito-yokado"], parent: "Seven & i Holdings", segment: "department", country: "Japan", recognition: "low", knownFor: "Japanese superstore", reportUrl: null },
  { name: "Jack & Jones", aliases: ["jack & jones"], parent: "Bestseller", segment: "fastfashion", country: "Denmark", recognition: "medium", knownFor: "Menswear", reportUrl: null },
  { name: "Jack Wolfskin", aliases: ["jack wolfskin"], parent: "Topgolf Callaway", segment: "outdoor", country: "Germany", recognition: "medium", knownFor: "Outdoor apparel", reportUrl: null },
  { name: "Jil Sander", aliases: ["jil sander"], parent: "OTB Group", segment: "luxury", country: "Germany", recognition: "medium", knownFor: "Minimal luxury", reportUrl: null },
  { name: "Jockey", aliases: ["jockey"], parent: "Jockey International", segment: "basics", country: "United States", recognition: "medium", knownFor: "Underwear", reportUrl: null },
  { name: "Joe Fresh", aliases: ["joe fresh"], parent: "Loblaw Companies", segment: "fastfashion", country: "Canada", recognition: "low", knownFor: "Value fashion", reportUrl: null },
  { name: "John Lewis", aliases: ["john lewis"], parent: "John Lewis Partnership", segment: "department", country: "United Kingdom", recognition: "high", knownFor: "Department store", reportUrl: null },
  { name: "K-Way", aliases: ["k-way"], parent: "BasicNet", segment: "outdoor", country: "Italy", recognition: "low", knownFor: "Rainwear", reportUrl: null },
  { name: "Kaufland", aliases: ["kaufland"], parent: "Schwarz Group", segment: "department", country: "Germany", recognition: "medium", knownFor: "Hypermarket apparel", reportUrl: null },
  { name: "Kiabi", aliases: ["kiabi"], parent: "Kiabi", segment: "fastfashion", country: "France", recognition: "medium", knownFor: "Value family fashion", reportUrl: null },
  { name: "KiK", aliases: ["kik"], parent: "KiK", segment: "fastfashion", country: "Germany", recognition: "medium", knownFor: "Discount clothing", reportUrl: null },
  { name: "Kohl's", aliases: ["kohl's"], parent: "Kohl\u2019s", segment: "department", country: "United States", recognition: "medium", knownFor: "Department store", reportUrl: null },
  { name: "KOOVS", aliases: ["koovs"], parent: "KOOVS", segment: "online", country: "India", recognition: "low", knownFor: "Online fashion", reportUrl: null },
  { name: "La Redoute", aliases: ["la redoute"], parent: "Galeries Lafayette Group", segment: "online", country: "France", recognition: "medium", knownFor: "Online fashion", reportUrl: null },
  { name: "Lands' End", aliases: ["lands' end"], parent: "Lands\u2019 End", segment: "basics", country: "United States", recognition: "medium", knownFor: "Casual and outdoor basics", reportUrl: null },
  { name: "LC Waikiki", aliases: ["lc waikiki"], parent: "LC Waikiki", segment: "fastfashion", country: "Turkey", recognition: "low", knownFor: "Value fashion", reportUrl: null },
  { name: "Li-Ning", aliases: ["li-ning"], parent: "Li-Ning", segment: "sportswear", country: "China", recognition: "medium", knownFor: "Chinese sportswear", reportUrl: null },
  { name: "Lidl", aliases: ["lidl"], parent: "Schwarz Group", segment: "department", country: "Germany", recognition: "high", knownFor: "Discount supermarket apparel", reportUrl: null },
  { name: "Lindex", aliases: ["lindex"], parent: "Stockmann Group", segment: "fastfashion", country: "Sweden", recognition: "low", knownFor: "Women\u2019s fashion", reportUrl: null },
  { name: "LL Bean", aliases: ["ll bean"], parent: "L.L.Bean", segment: "outdoor", country: "United States", recognition: "medium", knownFor: "Outdoor apparel", reportUrl: null },
  { name: "Longchamp", aliases: ["longchamp"], parent: "Longchamp", segment: "luxury", country: "France", recognition: "medium", knownFor: "Leather goods", reportUrl: null },
  { name: "Macy's", aliases: ["macy's"], parent: "Macy\u2019s, Inc.", segment: "department", country: "United States", recognition: "high", knownFor: "Department store", reportUrl: null },
  { name: "Mammut", aliases: ["mammut"], parent: "Telemos Capital", segment: "outdoor", country: "Switzerland", recognition: "medium", knownFor: "Mountaineering gear", reportUrl: null },
  { name: "Marc Jacobs", aliases: ["marc jacobs"], parent: "LVMH", segment: "luxury", country: "United States", recognition: "high", knownFor: "Fashion", reportUrl: null },
  { name: "Marni", aliases: ["marni"], parent: "OTB Group", segment: "luxury", country: "Italy", recognition: "medium", knownFor: "Fashion", reportUrl: null },
  { name: "Matalan", aliases: ["matalan"], parent: "Matalan", segment: "fastfashion", country: "United Kingdom", recognition: "medium", knownFor: "Value fashion", reportUrl: null },
  { name: "Max", aliases: ["max"], parent: "Landmark Group", segment: "fastfashion", country: "United Arab Emirates", recognition: "low", knownFor: "Value fashion", reportUrl: null },
  { name: "Max Mara", aliases: ["max mara"], parent: "Max Mara Fashion Group", segment: "luxury", country: "Italy", recognition: "medium", knownFor: "Women\u2019s luxury", reportUrl: null },
  { name: "Merrell", aliases: ["merrell"], parent: "Wolverine World Wide", segment: "outdoor", country: "United States", recognition: "medium", knownFor: "Hiking footwear", reportUrl: null },
  { name: "Metersbonwe", aliases: ["metersbonwe"], parent: "Metersbonwe", segment: "fastfashion", country: "China", recognition: "low", knownFor: "Chinese casualwear", reportUrl: null },
  { name: "Mexx", aliases: ["mexx"], parent: "Mexx", segment: "fastfashion", country: "Netherlands", recognition: "low", knownFor: "Casual fashion", reportUrl: null },
  { name: "Mizuno", aliases: ["mizuno"], parent: "Mizuno", segment: "sportswear", country: "Japan", recognition: "medium", knownFor: "Sports equipment and footwear", reportUrl: null },
  { name: "Monoprix", aliases: ["monoprix"], parent: "Groupe Casino", segment: "department", country: "France", recognition: "medium", knownFor: "Supermarket apparel", reportUrl: null },
  { name: "Morrisons", aliases: ["morrisons"], parent: "Morrisons", segment: "department", country: "United Kingdom", recognition: "medium", knownFor: "Supermarket apparel (Nutmeg)", reportUrl: null },
  { name: "MRP", aliases: ["mrp"], parent: "Mr Price Group", segment: "fastfashion", country: "South Africa", recognition: "low", knownFor: "Value fashion (Mr Price)", reportUrl: null },
  { name: "Muji", aliases: ["muji"], parent: "Ryohin Keikaku", segment: "basics", country: "Japan", recognition: "high", knownFor: "Minimalist lifestyle goods", reportUrl: null },
  { name: "New Look", aliases: ["new look"], parent: "New Look", segment: "fastfashion", country: "United Kingdom", recognition: "medium", knownFor: "Value fashion", reportUrl: null },
  { name: "New Yorker", aliases: ["new yorker"], parent: "New Yorker", segment: "fastfashion", country: "Germany", recognition: "low", knownFor: "Youth fashion", reportUrl: null },
  { name: "Nine West", aliases: ["nine west"], parent: "Authentic Brands Group", segment: "footwear", country: "United States", recognition: "medium", knownFor: "Women\u2019s footwear", reportUrl: null },
  { name: "Nordstrom", aliases: ["nordstrom"], parent: "Nordstrom, Inc.", segment: "department", country: "United States", recognition: "high", knownFor: "Department store", reportUrl: null },
  { name: "Otto", aliases: ["otto"], parent: "Otto Group", segment: "online", country: "Germany", recognition: "medium", knownFor: "Online retail group", reportUrl: null },
  { name: "Paris", aliases: ["paris"], parent: "Cencosud", segment: "department", country: "Chile", recognition: "low", knownFor: "Latin American department store", reportUrl: null },
  { name: "Pepe Jeans", aliases: ["pepe jeans"], parent: "Pepe Jeans", segment: "denim", country: "Spain", recognition: "medium", knownFor: "Denim", reportUrl: null },
  { name: "Pimkie", aliases: ["pimkie"], parent: "Pimkie", segment: "fastfashion", country: "France", recognition: "low", knownFor: "Women\u2019s fashion", reportUrl: null },
  { name: "Prisma", aliases: ["prisma"], parent: "S Group", segment: "department", country: "Finland", recognition: "low", knownFor: "Hypermarket apparel", reportUrl: null },
  { name: "Quiksilver", aliases: ["quiksilver"], parent: "Boardriders", segment: "outdoor", country: "United States", recognition: "high", knownFor: "Surfwear", reportUrl: null },
  { name: "REI", aliases: ["rei"], parent: "REI Co-op", segment: "outdoor", country: "United States", recognition: "medium", knownFor: "Outdoor co-op retailer", reportUrl: null },
  { name: "Reliance Trends", aliases: ["reliance trends"], parent: "Reliance Retail", segment: "department", country: "India", recognition: "low", knownFor: "Indian fashion retailer", reportUrl: null },
  { name: "Reserved", aliases: ["reserved"], parent: "LPP", segment: "fastfashion", country: "Poland", recognition: "medium", knownFor: "Fast fashion", reportUrl: null },
  { name: "REVOLVE", aliases: ["revolve"], parent: "Revolve Group", segment: "online", country: "United States", recognition: "medium", knownFor: "Online fashion", reportUrl: null },
  { name: "Romwe", aliases: ["romwe"], parent: "Globalegrow", segment: "online", country: "China", recognition: "low", knownFor: "Online ultra-fast fashion", reportUrl: null },
  { name: "Roxy", aliases: ["roxy"], parent: "Boardriders", segment: "outdoor", country: "United States", recognition: "medium", knownFor: "Women\u2019s surfwear", reportUrl: null },
  { name: "Russell Athletic", aliases: ["russell athletic"], parent: "Fruit of the Loom", segment: "sportswear", country: "United States", recognition: "medium", knownFor: "Athletic basics", reportUrl: null },
  { name: "s.Oliver", aliases: ["s.oliver"], parent: "s.Oliver Group", segment: "fastfashion", country: "Germany", recognition: "low", knownFor: "Casual fashion", reportUrl: null },
  { name: "Sainsbury's", aliases: ["sainsbury's"], parent: "Sainsbury\u2019s", segment: "department", country: "United Kingdom", recognition: "high", knownFor: "Supermarket apparel (Tu)", reportUrl: null },
  { name: "Saks Fifth Avenue", aliases: ["saks fifth avenue"], parent: "Hudson\u2019s Bay Company", segment: "department", country: "United States", recognition: "medium", knownFor: "Luxury department store", reportUrl: null },
  { name: "Sandro", aliases: ["sandro"], parent: "SMCP", segment: "fastfashion", country: "France", recognition: "medium", knownFor: "Contemporary fashion", reportUrl: null },
  { name: "Savage X Fenty", aliases: ["savage x fenty"], parent: "Savage X Fenty", segment: "basics", country: "United States", recognition: "high", knownFor: "Lingerie", reportUrl: null },
  { name: "Semir", aliases: ["semir"], parent: "Semir", segment: "fastfashion", country: "China", recognition: "low", knownFor: "Chinese casualwear", reportUrl: null },
  { name: "Shimamura", aliases: ["shimamura"], parent: "Shimamura", segment: "fastfashion", country: "Japan", recognition: "low", knownFor: "Value fashion retailer", reportUrl: null },
  { name: "Splash", aliases: ["splash"], parent: "Landmark Group", segment: "fastfashion", country: "United Arab Emirates", recognition: "low", knownFor: "Value fashion", reportUrl: null },
  { name: "Sports Direct", aliases: ["sports direct"], parent: "Frasers Group", segment: "sportswear", country: "United Kingdom", recognition: "medium", knownFor: "Sports retailer", reportUrl: null },
  { name: "Steve Madden", aliases: ["steve madden"], parent: "Steven Madden, Ltd.", segment: "footwear", country: "United States", recognition: "medium", knownFor: "Footwear", reportUrl: null },
  { name: "Takko", aliases: ["takko"], parent: "Takko Fashion", segment: "fastfashion", country: "Germany", recognition: "low", knownFor: "Discount fashion", reportUrl: null },
  { name: "Tchibo", aliases: ["tchibo"], parent: "Tchibo", segment: "department", country: "Germany", recognition: "low", knownFor: "Coffee and apparel retailer", reportUrl: null },
  { name: "Ted Baker", aliases: ["ted baker"], parent: "Authentic Brands Group", segment: "fastfashion", country: "United Kingdom", recognition: "medium", knownFor: "Contemporary fashion", reportUrl: null },
  { name: "Tesco", aliases: ["tesco"], parent: "Tesco", segment: "department", country: "United Kingdom", recognition: "high", knownFor: "Supermarket apparel (F&F)", reportUrl: null },
  { name: "Tezenis", aliases: ["tezenis"], parent: "Calzedonia Group", segment: "basics", country: "Italy", recognition: "medium", knownFor: "Lingerie", reportUrl: null },
  { name: "The Children's Place", aliases: ["the children's place"], parent: "The Children\u2019s Place", segment: "basics", country: "United States", recognition: "medium", knownFor: "Children\u2019s clothing", reportUrl: null },
  { name: "The Warehouse", aliases: ["the warehouse"], parent: "The Warehouse Group", segment: "department", country: "New Zealand", recognition: "medium", knownFor: "Value retailer", reportUrl: null },
  { name: "Tod's", aliases: ["tod's"], parent: "Tod\u2019s", segment: "luxury", country: "Italy", recognition: "medium", knownFor: "Luxury footwear and leather", reportUrl: null },
  { name: "Tom Ford", aliases: ["tom ford"], parent: "The Est\u00e9e Lauder Companies", segment: "luxury", country: "United States", recognition: "high", knownFor: "Luxury fashion", reportUrl: null },
  { name: "Tom Tailor", aliases: ["tom tailor"], parent: "Tom Tailor", segment: "fastfashion", country: "Germany", recognition: "low", knownFor: "Casual fashion", reportUrl: null },
  { name: "Tommy Bahama", aliases: ["tommy bahama"], parent: "Oxford Industries", segment: "fastfashion", country: "United States", recognition: "low", knownFor: "Resort wear", reportUrl: null },
  { name: "TOPVALU COLLECTION", aliases: ["topvalu collection"], parent: "AEON", segment: "department", country: "Japan", recognition: "low", knownFor: "Supermarket apparel", reportUrl: null },
  { name: "Tory Burch", aliases: ["tory burch"], parent: "Tory Burch", segment: "luxury", country: "United States", recognition: "high", knownFor: "Accessories and fashion", reportUrl: null },
  { name: "Triumph", aliases: ["triumph"], parent: "Triumph International", segment: "basics", country: "Germany", recognition: "medium", knownFor: "Lingerie", reportUrl: null },
  { name: "Truworths", aliases: ["truworths"], parent: "Truworths", segment: "department", country: "South Africa", recognition: "low", knownFor: "Fashion retailer", reportUrl: null },
  { name: "United Arrows", aliases: ["united arrows"], parent: "United Arrows", segment: "fastfashion", country: "Japan", recognition: "low", knownFor: "Japanese fashion retailer", reportUrl: null },
  { name: "Urban Outfitters", aliases: ["urban outfitters"], parent: "URBN", segment: "fastfashion", country: "United States", recognition: "high", knownFor: "Youth fashion", reportUrl: null },
  { name: "Valentino", aliases: ["valentino"], parent: "Valentino", segment: "luxury", country: "Italy", recognition: "high", knownFor: "Luxury fashion", reportUrl: null },
  { name: "Van Heusen", aliases: ["van heusen"], parent: "Authentic Brands Group", segment: "basics", country: "United States", recognition: "medium", knownFor: "Dress shirts and menswear", reportUrl: null },
  { name: "Vero Moda", aliases: ["vero moda"], parent: "Bestseller", segment: "fastfashion", country: "Denmark", recognition: "medium", knownFor: "Women\u2019s fashion", reportUrl: null },
  { name: "Very", aliases: ["very"], parent: "The Very Group", segment: "online", country: "United Kingdom", recognition: "medium", knownFor: "Online retailer", reportUrl: null },
  { name: "Walmart", aliases: ["walmart"], parent: "Walmart Inc.", segment: "department", country: "United States", recognition: "high", knownFor: "Supermarket apparel (George)", reportUrl: null },
  { name: "Woolworths South Africa", aliases: ["woolworths south africa"], parent: "Woolworths Holdings", segment: "department", country: "South Africa", recognition: "medium", knownFor: "Department store", reportUrl: null },
  { name: "Youngor", aliases: ["youngor"], parent: "Youngor", segment: "basics", country: "China", recognition: "low", knownFor: "Chinese menswear", reportUrl: null },
  { name: "Zeeman", aliases: ["zeeman"], parent: "Zeeman", segment: "fastfashion", country: "Netherlands", recognition: "low", knownFor: "Discount clothing", reportUrl: null },
];

// ---------------------------------------------------------------------------
// buildBrand — expands a raw entry into the full record the UI reads. Every
// disclosure field the raw data does not assert defaults to 'needs-research'
// so the page never claims a status it cannot back up.
// ---------------------------------------------------------------------------
function slug(name) {
  return name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ---------------------------------------------------------------------------
// Commitments and memberships. Real, verifiable industry facts, not our own
// judgement. These are membership signals, not performance: a company can sign
// a pact and still move slowly. We only mark what a source confirms.
//   The Fashion Pact: CEO-led coalition on climate, biodiversity and oceans.
//     Signatory list per thefashionpact.org and 2019 founding coverage.
//     LVMH is notably NOT a signatory. Hermès signed then left in 2023.
//   Certified B Corporation: independently verified social/environmental
//     performance standard (B Lab). In this set: Patagonia, and the Australian
//     labels R.M. Williams and Camilla.
// ---------------------------------------------------------------------------
const FASHION_PACT_IDS = new Set([
  'adidas', 'nike', 'puma', 'burberry', 'chanel', 'moncler', 'prada', 'miu-miu',
  'ralph-lauren', 'gucci', 'saint-laurent', 'balenciaga', 'bottega-veneta',
  'zara', 'pullandbear', 'bershka', 'handm', 'cos', 'gap', 'calvin-klein',
  'tommy-hilfiger', 'coach', 'kate-spade',
  // expansion (founding / group signatories)
  'armani', 'michael-kors', 'versace', 'salvatore-ferragamo',
  'ermenegildo-zegna', 'nordstrom',
]);
const FASHION_PACT_FORMER = new Set(['herm-s']); // slug('Hermès') === 'herm-s'
const B_CORP_IDS = new Set(['patagonia', 'r-m-williams', 'camilla', 'chlo']);

// Science Based Targets initiative status, read from the SBTi "Companies
// Taking Action" export, 6 August 2026 snapshot (15,375 companies). Every id
// below has a near-term target with SBTi status "Targets set" (validated).
// Split by whether the validated entity is the brand's own company ('brand')
// or its corporate parent/group ('parent'), so the climate-target signal can
// be honest about the level. Parents not in the SBTi dataset (Wesfarmers,
// ABF, TJX, Ross, Cotton On, Boohoo, Tattarang, PDD) are absent and their
// brands stay "Needs research". ABF is the one case where the group is absent
// but the brand is not: Primark Limited holds its own validated target, so
// Primark is flagged at brand level while ABF stays off the list.
const SBTI_BRAND = new Set([
  'nike', 'adidas', 'puma', 'asics', 'new-balance', 'under-armour', 'lululemon',
  'herm-s', 'chanel', 'burberry', 'moncler', 'ralph-lauren', 'levi-strauss', 'gap',
  'patagonia', 'asos', 'zalando', 'next', 'jd-sports', 'zimmermann', 'handm',
  // expansion (own company validated)
  'gymshark', 'canda', 'mango', 'superdry', 'marks-and-spencer', 'guess',
  'g-star-raw', 'hugo-boss', 'ovs', 'decathlon', 'salvatore-ferragamo',
  'abercrombie-and-fitch', 'victoria-s-secret',
  // full-coverage batch (own company validated, exact SBTi name match)
  'american-eagle', 'aritzia', 'brunello-cucinelli', 'canada-goose', 'carrefour',
  'desigual', 'disney', 'fossil', 'gildan', 'hanes', 'john-lewis', 'kohl-s',
  'mizuno', 'nordstrom', 'otto', 's-oliver', 'shimamura', 'steve-madden',
  'tchibo', 'tom-tailor', 'united-arrows', 'very', 'walmart', 'woolworths-south-africa',
  // 6 August 2026 export (own company validated)
  'aldi-south', 'aldo', 'carter-s', 'celio', 'dr-martens', 'ermenegildo-zegna',
  'fruit-of-the-loom', 'helly-hansen', 'lacoste', 'lindex', 'primark', 'ted-baker',
  'tesco', 'the-children-s-place', 'tod-s', 'triumph',
]);
const SBTI_PARENT = new Set([
  'louis-vuitton', 'dior', 'loewe', 'fendi', 'celine', 'gucci', 'saint-laurent',
  'balenciaga', 'bottega-veneta', 'zara', 'pullandbear', 'bershka', 'uniqlo', 'gu',
  'cos', 'calvin-klein', 'tommy-hilfiger', 'the-north-face', 'vans', 'timberland',
  'coach', 'kate-spade', 'prada', 'miu-miu', 'bonds', 'big-w', 'country-road',
  'the-iconic', 'shein',
  // expansion (parent/group validated)
  'converse', 'jordan', 'champion', 'ugg', 'kathmandu', 'speedo', 'massimo-dutti',
  'stradivarius', 'diesel', 'wrangler', 'michael-kors', 'versace', 'old-navy',
  'united-colors-of-benetton',
  // full-coverage batch (parent/group validated)
  'banana-republic', 'bonprix', 'chlo', 'hollister-co', 'jack-and-jones',
  'joe-fresh', 'la-redoute', 'russell-athletic', 'sports-direct', 'vero-moda',
  // 6 August 2026 export (parent/group validated)
  'bally', 'marc-jacobs', 'sandro', 'topvalu-collection',
]);
function sbtiLevelFor(id) {
  if (SBTI_BRAND.has(id)) return 'brand';
  if (SBTI_PARENT.has(id)) return 'parent';
  return null;
}

function commitmentsFor(id) {
  const fashionPact = FASHION_PACT_IDS.has(id) ? 'yes' : (FASHION_PACT_FORMER.has(id) ? 'former' : 'no');
  return { fashionPact, bCorp: B_CORP_IDS.has(id), sbti: sbtiLevelFor(id) };
}

// The date the structural facts (ownership, provenance, memberships) were last
// checked. Shown as a freshness stamp: the one thing no competitor exposes.
export const VERIFIED_AS_OF = 'August 2026';

// ---------------------------------------------------------------------------
// Ownership provenance. The white space in this whole category: every rival
// tool rates a brand as an island. Who actually owns it, who owned it before,
// and whether the owner is a listed company or a private-equity firm is often
// the most decision-relevant fact, and the hardest to find. Verifiable facts
// only; brands without a confirmed note simply do not show this line.
// ---------------------------------------------------------------------------
const PROVENANCE = {
  gucci: 'Italian house, part of French group Kering since 1999.',
  'saint-laurent': 'French house, part of Kering since 1999.',
  balenciaga: 'Spanish-founded house, acquired by Kering in 2001.',
  'bottega-veneta': 'Italian house, acquired by Kering in 2001.',
  'louis-vuitton': 'The founding house of French group LVMH.',
  dior: 'French house, brought under the LVMH umbrella; Christian Dior SE is the Arnault family holding.',
  loewe: 'Spanish house, owned by LVMH since 1996.',
  fendi: 'Italian house, LVMH-controlled since 2001.',
  celine: 'French house, owned by LVMH.',
  'miu-miu': 'Sister label to Prada within the Prada Group.',
  moncler: 'Italian brand; acquired Stone Island in 2021.',
  'the-north-face': 'Part of US group VF Corporation.',
  vans: 'Part of US group VF Corporation.',
  timberland: 'Part of US group VF Corporation.',
  'calvin-klein': 'Owned by US group PVH Corp.',
  'tommy-hilfiger': 'Owned by US group PVH Corp.',
  coach: 'Part of US group Tapestry.',
  'kate-spade': 'Acquired by Tapestry in 2017.',
  gap: 'US group; also owns Old Navy, Banana Republic and Athleta.',
  boohoo: 'UK group that also owns PrettyLittleThing, Nasty Gal and Debenhams.',
  shein: 'Founded in China in 2012; now headquartered in Singapore.',
  temu: 'Owned by PDD Holdings, the group behind China’s Pinduoduo.',
  'kmart-australia': 'Owned by ASX-listed Wesfarmers. A separate company from US Kmart.',
  'target-australia': 'Owned by ASX-listed Wesfarmers. A separate company from US Target.',
  'country-road': 'Owned by Country Road Group, part of South Africa’s Woolworths Holdings, unrelated to Australian Woolworths.',
  'the-iconic': 'Owned by Global Fashion Group, a Berlin-listed e-commerce group.',
  zimmermann: 'Founded 1991 in Sydney; private-equity firm Advent International took a majority stake in 2023.',
  bonds: 'Australian icon founded 1915; owned by US-based Hanesbrands, which Gildan agreed to acquire in 2025.',
  'r-m-williams': 'Founded 1932 in South Australia; passed through L Catterton before Tattarang, the Forrests’ private group, bought it in 2020.',
  patagonia: 'Founder Yvon Chouinard transferred ownership to the Holdfast Collective and a purpose trust in 2022.',
  converse: 'Owned by Nike since 2003.',
  jordan: 'A Nike brand, built around Michael Jordan.',
  reebok: 'Sold by Adidas to Authentic Brands Group in 2021.',
  ugg: 'A brand of US group Deckers, which also owns Hoka.',
  diesel: 'Part of Italian group OTB, alongside Maison Margiela, Marni and Jil Sander.',
  wrangler: 'Spun out of VF Corporation into Kontoor Brands in 2019.',
  'michael-kors': 'Part of Capri Holdings, which also owns Versace and Jimmy Choo.',
  versace: 'Owned by Capri Holdings (formerly Michael Kors Holdings); a sale to Prada Group was agreed in 2025.',
  'old-navy': 'Part of Gap Inc.',
  'massimo-dutti': 'Part of Inditex, the group behind Zara.',
  stradivarius: 'Part of Inditex, the group behind Zara.',
  kathmandu: 'Part of KMD Brands, which also owns Rip Curl and Oboz.',
  champion: 'A Hanesbrands label; Hanesbrands agreed to a Gildan takeover in 2025.',
};

// ---------------------------------------------------------------------------
// Fashion Transparency Index 2023 scores, read directly from the published
// report's "Final Scores" table (Fashion Revolution, 2023 edition; 250 brands
// ranked by score out of 250, shown as a rounded-up percentage). These are the
// authoritative figures, keyed by our brand id. Brands Fashion Revolution did
// not score individually are absent here and stay "Needs research". A handful
// of raw entries carry the score inline already (with richer notes); those
// take precedence, so they are not repeated here.
// ---------------------------------------------------------------------------
const FTI_2023 = {
  nike: 50, adidas: 56, puma: 66, asics: 45, 'new-balance': 46, 'under-armour': 28,
  lululemon: 52, 'louis-vuitton': 29, dior: 29, fendi: 58, celine: 30,
  'saint-laurent': 51, balenciaga: 51, 'bottega-veneta': 51, 'herm-s': 28,
  chanel: 11, prada: 34, 'miu-miu': 34, burberry: 38, moncler: 27, 'ralph-lauren': 54,
  zara: 50, pullandbear: 50, bershka: 50, uniqlo: 51, gu: 51, shein: 7, primark: 40,
  boohoo: 14, asos: 50, zalando: 40, next: 36, 'levi-strauss': 60, gap: 48,
  'calvin-klein': 48, 'tommy-hilfiger': 50, patagonia: 40, coach: 42, 'kate-spade': 41,
  'jd-sports': 29, 'big-w': 39, 'cotton-on': 22, 'tk-maxx': 13, 'ross-stores': 6,
  // expansion batch
  converse: 50, jordan: 50, champion: 38, reebok: 1, fila: 15, skechers: 7,
  speedo: 47, gymshark: 27, lacoste: 38, decathlon: 26, ugg: 57, 'dr-martens': 35,
  'columbia-sportswear': 37, kathmandu: 29, guess: 31, 'g-star-raw': 49, diesel: 19,
  wrangler: 33, canda: 68, 'united-colors-of-benetton': 73, mango: 49,
  'massimo-dutti': 50, stradivarius: 50, superdry: 49, 'river-island': 32,
  'abercrombie-and-fitch': 33, ovs: 83, prettylittlething: 24, 'marks-and-spencer': 38,
  'old-navy': 48, 'victoria-s-secret': 19, 'hugo-boss': 55, armani: 38,
  'michael-kors': 23, versace: 24, 'salvatore-ferragamo': 24,
  // full-coverage batch
  'aeropostale': 3,
  'ajio': 8,
  'aldi-nord': 31,
  'aldi-south': 34,
  'aldo': 14,
  'amazon': 26,
  'american-eagle': 21,
  'anta': 0,
  'anthropologie': 13,
  'aritzia': 22,
  'asda': 28,
  'bally': 33,
  'banana-republic': 48,
  'bcbgmaxazria': 1,
  'beanpole': 7,
  'belle': 0,
  'big-bazaar-ffb': 0,
  'billabong': 6,
  'bloomingdale-s': 7,
  'bonprix': 37,
  'bosideng': 0,
  'brooks-sports': 36,
  'brunello-cucinelli': 14,
  'buckle': 4,
  'burlington': 14,
  'calzedonia': 63,
  'canada-goose': 16,
  'carhartt': 7,
  'carolina-herrera': 16,
  'caroll': 5,
  'carrefour': 24,
  'carter-s': 25,
  'celio': 1,
  'chico-s': 14,
  'chlo': 43,
  'clarks': 17,
  'cortefiel': 21,
  'costco': 10,
  'deichmann': 2,
  'desigual': 25,
  'dick-s-sporting-goods': 27,
  'dillard-s': 3,
  'disney': 22,
  'dkny': 1,
  'dolce-and-gabbana': 2,
  'dressmann': 65,
  'dsw': 7,
  'eddie-bauer': 5,
  'el-corte-ingl-s': 24,
  'ermenegildo-zegna': 33,
  'esprit': 45,
  'express': 6,
  'fabletics': 2,
  'falabella': 11,
  'famous-footwear': 9,
  'fanatics': 18,
  'fashion-nova': 0,
  'fj-llr-ven': 40,
  'foot-locker': 9,
  'foschini': 18,
  'fossil': 16,
  'free-people': 13,
  'fruit-of-the-loom': 34,
  'furla': 5,
  'gerry-weber': 8,
  'gildan': 54,
  'hanes': 38,
  'heilan-home': 0,
  'helly-hansen': 30,
  'hema': 24,
  'hollister-co': 33,
  'hudson-s-bay': 9,
  'intimissimi': 63,
  'ito-yokado': 11,
  'jack-and-jones': 41,
  'jack-wolfskin': 25,
  'jil-sander': 18,
  'jockey': 2,
  'joe-fresh': 18,
  'john-lewis': 32,
  'k-way': 0,
  'kaufland': 12,
  'kiabi': 16,
  'kik': 17,
  'kohl-s': 17,
  'koovs': 0,
  'la-redoute': 13,
  'lands-end': 12,
  'lc-waikiki': 4,
  'li-ning': 9,
  'lidl': 25,
  'lindex': 44,
  'll-bean': 8,
  'longchamp': 2,
  'macy-s': 7,
  'mammut': 35,
  'marc-jacobs': 28,
  'marni': 17,
  'matalan': 29,
  'max': 1,
  'max-mara': 0,
  'merrell': 8,
  'metersbonwe': 0,
  'mexx': 0,
  'mizuno': 18,
  'monoprix': 18,
  'morrisons': 29,
  'mrp': 11,
  'muji': 28,
  'new-look': 42,
  'new-yorker': 0,
  'nine-west': 1,
  'nordstrom': 26,
  'otto': 20,
  'paris': 25,
  'pepe-jeans': 2,
  'pimkie': 18,
  'prisma': 22,
  'quiksilver': 6,
  'rei': 22,
  'reliance-trends': 10,
  'reserved': 20,
  'revolve': 2,
  'romwe': 3,
  'roxy': 6,
  'russell-athletic': 34,
  's-oliver': 43,
  'sainsbury-s': 51,
  'saks-fifth-avenue': 9,
  'sandro': 22,
  'savage-x-fenty': 0,
  'semir': 0,
  'shimamura': 4,
  'splash': 0,
  'sports-direct': 7,
  'steve-madden': 13,
  'takko': 7,
  'tchibo': 43,
  'ted-baker': 26,
  'tesco': 48,
  'tezenis': 63,
  'the-children-s-place': 17,
  'the-warehouse': 17,
  'tod-s': 9,
  'tom-ford': 0,
  'tom-tailor': 50,
  'tommy-bahama': 10,
  'topvalu-collection': 13,
  'tory-burch': 1,
  'triumph': 7,
  'truworths': 7,
  'united-arrows': 17,
  'urban-outfitters': 13,
  'valentino': 18,
  'van-heusen': 0,
  'vero-moda': 41,
  'very': 27,
  'walmart': 23,
  'woolworths-south-africa': 29,
  'youngor': 0,
  'zeeman': 54,
};
// Score-specific context where the FTI listing name differs from ours.
const FTI_2023_NOTE = {
  'tk-maxx': 'Fashion Transparency Index 2023. FTI listed the TJX banner as "TJ Maxx"; TK Maxx is the same company.',
  'ross-stores': 'Fashion Transparency Index 2023, scored under its "Ross Dress for Less" banner.',
};

function buildBrand(raw) {
  const id = slug(raw.name);
  const fti = raw.fti != null ? raw.fti : (FTI_2023[id] != null ? FTI_2023[id] : null);
  const band = ftiBand(fti);
  const ftiNote = raw.ftiNote || FTI_2023_NOTE[id]
    || (FTI_2023[id] != null ? 'Fashion Transparency Index 2023 (final edition), published by Fashion Revolution.' : '');
  return {
    id,
    name: raw.name,
    mono: deriveMonogram(raw.name),
    domain: BRAND_DOMAIN[raw.name] || null,
    aliases: raw.aliases || [],
    parent: raw.parent,
    group: raw.group || raw.parent,
    segment: raw.segment,
    segmentLabel: (SEGMENTS.find((s) => s.id === raw.segment) || {}).label || raw.segment,
    country: raw.country,
    au: !!raw.au,
    recognition: raw.recognition || 'medium',
    knownFor: raw.knownFor || '',
    fti,
    ftiBand: band,
    ftiNote,
    // 'scored' = a verified FTI number; 'outside' = confirmed not assessed by
    // FTI; 'research' = in scope but the exact figure is still unverified.
    ftiScope: raw.ftiScope || (fti != null ? 'scored' : 'research'),
    reportUrl: raw.reportUrl || null,
    // Per-field disclosure statuses. These are the research surface: filled in
    // over time from the CSV tracker, never invented here.
    signals: {
      // A validated SBTi near-term target is a public, dated emissions target.
      // Brand-level validation reads as disclosed; group-level as parent-only.
      climateTarget: raw.climateTarget
        || (sbtiLevelFor(id) === 'brand' ? STATUS.disclosed.id
          : sbtiLevelFor(id) === 'parent' ? STATUS.parent.id
            : STATUS.research.id),
      scope12: raw.scope12 || STATUS.research.id,
      scope3: raw.scope3 || STATUS.research.id,
      materials: raw.materials || STATUS.research.id,
      supplyChain: raw.supplyChain || STATUS.research.id,
      circularity: raw.circularity || STATUS.research.id,
    },
    commitments: commitmentsFor(id),
    provenance: PROVENANCE[id] || raw.provenance || '',
    notes: raw.notes || '',
    needsResearch: fti == null && raw.ftiScope !== 'outside',
  };
}

export const BRANDS = RAW_BRANDS.map(buildBrand).sort((a, b) => a.name.localeCompare(b.name));

// Quick index helpers ------------------------------------------------------
export const BRAND_BY_ID = Object.fromEntries(BRANDS.map((b) => [b.id, b]));

// Corporate groups: how many recognisable brands each parent quietly owns.
// Real, and one of the most useful things a shopper does not know.
export function groupFamily(parentName) {
  return BRANDS.filter((b) => b.parent === parentName || b.group === parentName);
}

// Every parent, with the brands it owns on file. The group lens is built on
// this: ownership concentration is one of the least-understood facts in
// fashion, and the whole "read the parent, not the brand" thesis lives here.
export const GROUPS = (() => {
  const map = new Map();
  for (const b of BRANDS) {
    if (!map.has(b.parent)) map.set(b.parent, []);
    map.get(b.parent).push(b);
  }
  return [...map.entries()]
    .map(([parent, brands]) => {
      const scored = brands.filter((b) => b.fti != null);
      const avg = scored.length
        ? Math.round(scored.reduce((n, b) => n + b.fti, 0) / scored.length)
        : null;
      return { parent, brands, count: brands.length, scored, avg };
    })
    .sort((a, b) => b.count - a.count || a.parent.localeCompare(b.parent));
})();

// Parents that own more than one brand on file, for the directory group view.
export const MULTI_GROUPS = GROUPS.filter((g) => g.count > 1);

export function segmentCount(id) {
  return BRANDS.filter((b) => b.segment === id).length;
}

// Display metadata for the commitment badges on a brand card.
export const COMMITMENT_INFO = {
  fashionPact: {
    label: 'The Fashion Pact', former: 'Left the Fashion Pact',
    help: 'Signed the CEO-led coalition on climate, biodiversity and oceans. A commitment to act.',
    url: 'https://www.thefashionpact.org/',
  },
  bCorp: {
    label: 'Certified B Corp',
    help: 'Independently verified social and environmental performance, certified by B Lab.',
    url: 'https://www.bcorporation.net/',
  },
  sbti: {
    label: 'SBTi near-term target',
    parentLabel: 'SBTi target · group',
    help: 'Has a near-term emissions target validated by the Science Based Targets initiative.',
    parentHelp: 'The corporate parent has an SBTi-validated near-term target; brand-level detail may differ.',
    url: 'https://sciencebasedtargets.org/target-dashboard',
  },
};

export function commitmentCounts() {
  return {
    fashionPact: BRANDS.filter((b) => b.commitments.fashionPact === 'yes').length,
    bCorp: BRANDS.filter((b) => b.commitments.bCorp).length,
    sbti: BRANDS.filter((b) => b.commitments.sbti).length,
  };
}

// ---------------------------------------------------------------------------
// Materials guide. Fibre-level context for the "before you buy" job. Plain,
// honest, and deliberately careful: single "sustainability" rankings of fibres
// (notably the Higg Materials Sustainability Index) are contested. The Higg MSI
// scored synthetics well partly because it left out microplastic and ocean
// pollution, and its consumer-facing use was paused in 2022 after challenges
// from regulators in Norway and the Netherlands. So this names the trade-offs
// rather than crowning a winner. Impact notes are directional, from published
// LCA literature, not a measurement of any one garment.
// ---------------------------------------------------------------------------
export const FIBRES = [
  { name: 'Conventional cotton', kind: 'Natural', good: 'Breathable, durable, biodegradable.', watch: 'Thirsty crop; heavy irrigation and pesticide use where rain-fed farming is not used.' },
  { name: 'Organic cotton', kind: 'Natural', good: 'Grown without synthetic pesticides; look for GOTS certification.', watch: 'Still water-intensive; certification covers the field and stops at the dye house.' },
  { name: 'Linen', kind: 'Natural', good: 'Flax needs little water or pesticide; long-lasting and biodegradable.', watch: 'Creases readily; some processing uses chemical retting.' },
  { name: 'Hemp', kind: 'Natural', good: 'Low water and input; improves soil and lasts for years.', watch: 'Coarser hand feel; softer blends can add synthetics.' },
  { name: 'Wool', kind: 'Natural', good: 'Warm, long-lived, biodegradable, needs fewer washes.', watch: 'Higher on-farm emissions (methane); mulesing and animal-welfare questions.' },
  { name: 'Polyester', kind: 'Synthetic', good: 'Cheap, strong, low water to make; recyclable in theory.', watch: 'Fossil-derived; sheds microplastics in the wash and effectively never breaks down.' },
  { name: 'Recycled polyester (rPET)', kind: 'Synthetic', good: 'Roughly half the carbon of virgin polyester; look for GRS certification.', watch: 'Still sheds microplastics; mostly made from drink bottles, and it recycles once.' },
  { name: 'Nylon', kind: 'Synthetic', good: 'Strong and elastic; recycled versions (e.g. ECONYL) exist.', watch: 'Fossil-derived, energy-intensive, sheds microplastics.' },
  { name: 'Viscose / rayon', kind: 'Regenerated', good: 'Soft, breathable, plant-derived from wood pulp.', watch: 'Can drive deforestation and use harsh solvents unless responsibly sourced.' },
  { name: 'Lyocell (Tencel)', kind: 'Regenerated', good: 'Wood pulp spun in a closed-loop solvent system; look for FSC pulp.', watch: 'Lower-impact only when the pulp is responsibly sourced.' },
  { name: 'Leather', kind: 'Animal', good: 'Durable and repairable; ages well.', watch: 'Linked to land use and deforestation; tanning can be chemically intensive.' },
  { name: 'Elastane / spandex', kind: 'Synthetic', good: 'A little adds stretch and fit.', watch: 'Even small amounts blended in can make a garment unrecyclable.' },
];

// ---------------------------------------------------------------------------
// What certifications and indices actually verify. The other thing no rival
// tool does: decode the label. A certificate proves a specific, bounded thing.
// Knowing its edge is how you avoid reading it as a blanket "this is good".
// ---------------------------------------------------------------------------
export const CERTS = [
  { name: 'GOTS', verifies: 'Organic fibre content and processing standards for textiles, including some chemical and social criteria.', edge: 'Covers the certified product’s supply chain only.' },
  { name: 'GRS', verifies: 'Recycled content and chain of custody, plus some social and environmental criteria at certified facilities.', edge: 'Proves the recycled percentage, and stops there.' },
  { name: 'OEKO-TEX Standard 100', verifies: 'That the tested article is free of certain harmful substances above set limits.', edge: 'A chemical-safety test for the wearer.' },
  { name: 'B Corp', verifies: 'Independently assessed overall social and environmental performance and accountability of the company.', edge: 'A company-wide score, awarded to the business.' },
  { name: 'The Fashion Pact', verifies: 'That a CEO signed up to shared climate, biodiversity and ocean goals.', edge: 'A commitment to act, made at CEO level.' },
  { name: 'Fashion Transparency Index', verifies: 'How much a brand discloses publicly, scored 0 to 100.', edge: 'Measures disclosure. The signal this tool leans on, with that caveat.' },
];

// ---------------------------------------------------------------------------
// Regulation radar. Forward-looking, deliberately non-speculative about any
// one brand: these are the new rules that will change what brands must tell
// you. Sourced to their instruments; dates are the real phase-in dates.
// ---------------------------------------------------------------------------
export const REGULATION = [
  {
    name: 'EU Digital Product Passport',
    when: 'Textiles from ~2027 to 2028',
    what: 'A scannable passport per garment: fibre composition, recycled content, durability, repair and recycling instructions, and country of origin. The biggest structural change coming, though no per-garment passports exist yet.',
    tag: "What's coming",
  },
  {
    name: 'EU Empowering Consumers Directive',
    when: 'Applies 27 September 2026',
    what: 'Bans generic green claims like "eco-friendly" without proof, bans offset-based "carbon neutral" claims, and bans self-made sustainability labels across the EU. It sharpens the claim check above.',
    tag: 'In force',
  },
  {
    name: 'France · Coût Environnemental',
    when: 'Voluntary from Oct 2025',
    what: 'A single environmental-cost score per garment, using the open Ecobalyse method, with factors for microfibre release and fast-fashion overproduction. Third parties may publish a brand’s score from Oct 2026. The methodology is itself debated.',
    tag: 'Phasing in',
  },
];

// ---------------------------------------------------------------------------
// "Dig deeper" — reliable link-outs to richer per-brand data on other
// services. Cost Per Wear is a launchpad, not the last word: these send you to
// independent ratings and the primary sources so you can judge for yourself.
// We only LINK; we never restate another service's rating as our own.
// Good On You directory pages follow /brand/<slug>; a handful need an
// explicit slug where the obvious one would not resolve.
// ---------------------------------------------------------------------------
// Keys are Cost Per Wear brand ids (see slug()); values are the Good On You slug
// where it differs from ours. Best effort: a miss still lands on Good On You.
const GOODONYOU_SLUG = {
  handm: 'h-m', pullandbear: 'pull-bear', 'kmart-australia': 'kmart',
  'levi-strauss': 'levis',
};

function goodOnYouUrl(brand) {
  const slug = GOODONYOU_SLUG[brand.id] || brand.id;
  return `https://directory.goodonyou.eco/brand/${slug}`;
}

// Returns the ordered list of external references for a brand.
export function digLinks(brand) {
  const links = [];
  if (brand.reportUrl) {
    links.push({ label: 'Own sustainability report', url: brand.reportUrl, note: 'What the company says about itself' });
  }
  links.push({ label: 'Good On You rating', url: goodOnYouUrl(brand), note: 'Independent people, planet and animal score' });
  links.push({ label: 'Baptist World Aid (AU)', url: 'https://baptistworldaid.org.au/resources/ethical-fashion-guide/', note: 'Australian worker-rights and environment score out of 100' });
  links.push({ label: 'SBTi climate targets', url: 'https://sciencebasedtargets.org/target-dashboard', note: 'Check for a validated science-based emissions target' });
  links.push({ label: 'Fashion Transparency Index', url: 'https://www.fashionrevolution.org/about/transparency/', note: 'The source of the disclosure score above. 2023 was its final edition' });
  links.push({ label: 'What Fuels Fashion (2024)', url: 'https://www.fashionrevolution.org/what-fuels-fashion/', note: 'Fashion Revolution’s successor index, scoring decarbonisation disclosure' });
  return links;
}

// The signal fields shown, in display order, with their human labels.
export const SIGNAL_FIELDS = [
  { id: 'transparency', label: 'Transparency Index', help: 'Fashion Revolution FTI 2023 disclosure score.' },
  { id: 'climateTarget', label: 'Climate target', help: 'A public, dated emissions-reduction target.' },
  { id: 'scope12', label: 'Scope 1 & 2', help: 'Own-operations and purchased-energy emissions.' },
  { id: 'scope3', label: 'Scope 3', help: 'Supply-chain emissions, usually the bulk of the total.' },
  { id: 'materials', label: 'Materials', help: 'What fibres and materials the brand reports using.' },
  { id: 'supplyChain', label: 'Supplier list', help: 'A published list of manufacturing facilities.' },
  { id: 'circularity', label: 'Circularity', help: 'Repair, resale, take-back or recycling programmes.' },
];

// ---------------------------------------------------------------------------
// THE LENS — "what you can't know", by concern.
//
// The tool's decision aid, built without breaking the no-ranking rule: instead
// of scoring brands, it scores the COMPLETENESS of what a shopper can verify.
// Each concern maps onto the disclosure signals above; the lens then reads a
// brand's statuses and reports what can be checked, what only the parent
// publishes, what is not published, and what this tool has not verified yet.
// No new metric is invented: it is a re-reading of statuses already on file.
// ---------------------------------------------------------------------------
export const LENS_CONCERNS = [
  {
    id: 'climate', label: 'Climate', signals: ['climateTarget', 'scope12', 'scope3'],
    why: 'A dated target plus reported Scope 1, 2 and 3 emissions. Scope 3, the supply chain, is where most of fashion’s footprint sits.',
  },
  {
    id: 'supply', label: 'Supply chain and labour', signals: ['supplyChain'],
    why: 'A published factory list is the entry ticket. A brand that will not name its factories is choosing what you can check.',
  },
  {
    id: 'materials', label: 'Materials and fibres', signals: ['materials'],
    why: 'What the brand reports using. Fibre choice drives water use, microplastic shedding and what happens at end of life.',
  },
  {
    id: 'circularity', label: 'Circularity and waste', signals: ['circularity'],
    why: 'Repair, resale, take-back or recycling programmes with a real destination, beyond a bin at the door.',
  },
  {
    id: 'ownership', label: 'Ownership and governance', signals: [], ownership: true,
    why: 'Who makes the decisions on targets, suppliers and wages. Cost Per Wear verifies this for every brand on file.',
  },
];

// How a disclosure status reads through the lens. 'research' is kept honestly
// distinct from 'notFound': the first is this tool's gap, the second is the
// brand's silence.
export const LENS_READING = {
  disclosed: { id: 'open', label: 'You can check this' },
  partial: { id: 'part', label: 'Partly checkable' },
  parent: { id: 'parent', label: 'Only the parent publishes' },
  notFound: { id: 'dark', label: 'Not published' },
  research: { id: 'unverified', label: 'Not verified here yet' },
};

// ---------------------------------------------------------------------------
// CHANGE LOG — the freshness discipline made visible. Real, dated entries for
// every change to the dataset or the tool's method, newest first. Dates are
// the actual dates the changes landed in the repository.
// ---------------------------------------------------------------------------
export const CHANGELOG = [
  { date: '13 August 2026', note: 'SBTi climate-target status re-matched against the Companies Taking Action export, 6 August 2026 snapshot of 15,375 companies: 131 companies matched, up from 111. The 20 additions all meet the existing rule of a near-term target at status "Targets set", 16 through their own validated company row and 4 through a validated parent or group. No badge already on file was contradicted by the newer export: celio moved from committed to validated, and Primark holds its own validated target even though its parent, Associated British Foods, is not on the register.' },
  { date: '20 July 2026', note: 'The four explainers consolidated into one field guide; the personal lens and the ownership map added; the garment studio retired. Logo loading moved from the retired Clearbit CDN to a keyless multi-provider chain, with domains on file for the full brand universe.' },
  { date: '20 July 2026', note: 'Fashion Transparency Index 2023 relabelled as the final edition of that index. What Fuels Fashion 2024, Fashion Revolution’s successor on decarbonisation, added as a per-brand link-out; its scores await ingestion from the primary report.' },
  { date: '19 July 2026', note: 'Full FTI 2023 universe ingested: 258 brands and retailers on file, 248 with a score read from the report’s Final Scores table. SBTi climate-target status matched for 111 companies; fuzzy name matches discarded.' },
  { date: '19 July 2026', note: 'Ownership provenance lines and the verification stamp added. Bonds and Champion note the Gildan takeover of Hanesbrands agreed in 2025.' },
  { date: '18 July 2026', note: 'Fashion Pact, B Corp and SBTi memberships verified from source, with Hermès marked as having left the Fashion Pact in 2023. Australian labels R.M. Williams, Zimmermann, Camilla, Lorna Jane and Bonds added with verified ownership.' },
  { date: '18 July 2026', note: 'Cost Per Wear launched: verified corporate ownership, segments and headquarters for the initial brand set, with deep-linked lookups and the corporate group lens.' },
];

// ===========================================================================
// CLAIM CHECK — a small, honest greenwashing utility.
//
// Grounded in the ACCC's guidance "Making environmental claims: a guide for
// business" (the eight principles), with the same direction of travel as the
// EU Empowering Consumers Directive (in force, applies 27 Sept 2026, which
// bans generic claims like "eco-friendly", bans offset-based "carbon neutral"
// claims, and bans self-made sustainability labels), the UK CMA Green Claims
// Code and the US FTC Green Guides. (The separate EU Green Claims Directive
// was shelved in 2025, so it is not treated as law here.) It flags the vague
// and absolute terms regulators single out, and the qualifiers each one
// demands. It reads what YOU paste. It makes no claim about any real brand.
// ===========================================================================

// The eight ACCC principles, shown as the standard the checker applies.
export const ACCC_PRINCIPLES = [
  'Make accurate and truthful claims',
  'Have evidence to back up your claims',
  'Do not leave out or hide important information',
  'Explain any conditions or qualifications',
  'Avoid broad and unqualified claims',
  'Use clear and easy-to-understand language',
  'Visuals and imagery should not mislead',
  'Be transparent about your sustainability transition',
];

// Vague terms with no fixed meaning: regulators treat these as red flags
// unless the specific, measured impact is named alongside them.
export const VAGUE_TERMS = [
  { re: /\bsustainab(le|ly|ility)\b/gi, term: 'sustainable', ask: 'Sustaining what, measured how? Name the impact and the number.' },
  { re: /\beco[- ]?friendly\b/gi, term: 'eco-friendly', ask: 'Friendly compared with what? Every garment has a footprint.' },
  { re: /\bgreen\b/gi, term: 'green', ask: 'Green is a colour. Which impact fell, and by how much?' },
  { re: /\bconscious\b/gi, term: 'conscious', ask: 'Consciousness is not a supply-chain attribute. What changed in the product?' },
  { re: /\bnatural(ly)?\b/gi, term: 'natural', ask: 'Natural is not the same as low impact. Crude oil is natural.' },
  { re: /\bethical(ly)?\b/gi, term: 'ethical', ask: 'Whose code, audited by whom, and when was the last audit?' },
  { re: /\bresponsibl[ey]\b/gi, term: 'responsible', ask: 'Responsible to what standard? Point to it.' },
  { re: /\bclean\b/gi, term: 'clean', ask: 'Clean of what? Name the substance or drop the word.' },
  { re: /\bkind (to|on) the planet\b/gi, term: 'kind to the planet', ask: 'The planet has not been consulted. State the measured impact instead.' },
  { re: /\bplanet[- ](positive|friendly)\b/gi, term: 'planet positive', ask: 'A net-positive claim needs extraordinary evidence. Where is it?' },
  { re: /\bguilt[- ]free\b/gi, term: 'guilt-free', ask: 'Feelings are not a metric. State what the garment does.' },
  { re: /\bearth[- ]friendly\b/gi, term: 'earth-friendly', ask: 'Friendly how? Pick an impact, state the change.' },
];

// Absolute claims fail on the first exception: regulators expect these struck
// out unless every unit can be proven.
export const ABSOLUTE_TERMS = [
  { re: /\b100%\s*(sustainable|eco[- ]?friendly|green|recyclable|biodegradable|natural)\b/gi, term: 'the 100% absolute', ask: 'Absolute claims fail on the first exception. Strike it or prove every unit.' },
  { re: /\bzero\s*(impact|waste|emissions?|carbon)\b/gi, term: 'zero', ask: 'Nothing made at scale is zero anything. Show the boundary or strike it.' },
  { re: /\b(fully|completely|totally)\s+(sustainable|recyclable|biodegradable|circular)\b/gi, term: 'a totalising qualifier', ask: 'Fully, completely and totally are doing unpaid work here. Strike them.' },
  { re: /\bclimate[- ]positive\b/gi, term: 'climate positive', ask: 'Beyond neutral is a bold accounting position. Publish the ledger or strike it.' },
];

// Terms that can be legitimate but demand a specific qualifier.
export const QUALIFIER_TERMS = [
  { re: /\brecyclable\b/gi, term: 'recyclable', demand: 'In which stream, in which country, and what share is actually recycled today?' },
  { re: /\bbiodegradable\b/gi, term: 'biodegradable', demand: 'Under what conditions, and in how long? A landfill is not a compost heap.' },
  { re: /\bcompostable\b/gi, term: 'compostable', demand: 'Home or industrial composting? Name the standard.' },
  { re: /\brecycled\b/gi, term: 'recycled', demand: 'What percentage, of which component, certified by whom?' },
  { re: /\bcarbon[- ]neutral\b/gi, term: 'carbon neutral', demand: 'Reduced or offset? From 2026 the EU bans offset-based neutrality claims. Which scopes, whose offsets, what vintage?' },
  { re: /\borganic\b/gi, term: 'organic', demand: 'Certified to which scheme, and what share of the fibre?' },
  { re: /\brenewable\b/gi, term: 'renewable', demand: 'What share of energy, contracted how, over what period?' },
  { re: /\bplastic[- ]free\b/gi, term: 'plastic-free', demand: 'Product, packaging or both? Polyester is plastic.' },
  { re: /\bup to\b/gi, term: 'up to', demand: 'Up to includes zero. State the typical figure.' },
  { re: /\bplant[- ]based\b/gi, term: 'plant-based', demand: 'What share is plant-derived, and what carries the rest?' },
  { re: /\bwe plant a tree\b/gi, term: 'tree planting', demand: 'Survival rate, land tenure, and is it additional to what would grow anyway?' },
];

// Signals that a claim actually carries evidence.
export const EVIDENCE_PATTERNS = [
  /\b\d+(\.\d+)?\s*(%|percent|kg|g|litres?|l\b|kwh|tonnes?)/i,
  /\b(gots|grs|oeko[- ]?tex|fsc|bluesign|fair\s?trade|b corp|iso\s?14|climate active)\b/i,
  /\b(audit(ed)?|verif(y|ied|ication)|certif(y|ied|ication)|third[- ]party|independent)/i,
  /\b(report|published|publish|methodology|footprint)\b/i,
  /\b(20\d\d)\b/,
  /\bcompared (with|to)\b/i,
  /\bscope\s?[123]\b/i,
];

// Specimen claims to try, from empty to sound.
export const SPECIMEN_CLAIMS = [
  'Made with 100% sustainable materials.',
  'Our most eco-friendly collection yet.',
  'Kind to the planet, kind to you.',
  'Carbon neutral since 2022.',
  'This tee is 60% recycled polyester, certified to GRS, and we publish the third-party audit.',
  'Cut from organic cotton certified to GOTS, 41% less irrigation than our 2020 baseline.',
];

export const CLAIM_VERDICTS = {
  sound: { id: 'sound', label: 'Reads as substantiated', line: 'Specific, evidenced and qualified. This is what a claim that survives scrutiny looks like.' },
  vague: { id: 'vague', label: 'Vague', line: 'Not necessarily false, just empty. Every flagged word needs a number or a name behind it.' },
  risk: { id: 'risk', label: 'High greenwashing risk', line: 'Overclaimed and unsubstantiated. In Australia this is the pattern the ACCC has been pursuing.' },
};

// The analysis. Pure function over a string; no brand data involved.
export function analyseClaim(text) {
  const t = (text || '').trim();
  if (!t) return null;
  const hit = (list, key) => list
    .map((d) => { const m = t.match(d.re); return m ? { term: d.term, word: m[0], note: d[key] } : null; })
    .filter(Boolean);
  const vague = hit(VAGUE_TERMS, 'ask');
  const absolute = hit(ABSOLUTE_TERMS, 'ask');
  const qualifier = hit(QUALIFIER_TERMS, 'demand');
  const evidence = EVIDENCE_PATTERNS.filter((re) => re.test(t)).length;
  const flags = vague.length + absolute.length;
  let verdict;
  if (absolute.length > 0 || (flags >= 2 && evidence === 0)) verdict = CLAIM_VERDICTS.risk;
  else if (flags > 0 && evidence === 0) verdict = CLAIM_VERDICTS.vague;
  else if (flags > 0 && evidence > 0) verdict = qualifier.length && evidence < 2 ? CLAIM_VERDICTS.vague : CLAIM_VERDICTS.sound;
  else verdict = evidence > 0 ? CLAIM_VERDICTS.sound : CLAIM_VERDICTS.vague;
  return { vague, absolute, qualifier, evidence, verdict };
}

// ---------------------------------------------------------------------------
// Editorial copy. Australian English, plain, active. No em dashes.
// ---------------------------------------------------------------------------

// ===========================================================================
// THE GARMENT STUDIO — model factors for the four working tools: the carbon
// footprint estimator, the fabric comparator, the supply chain mapper and the
// circularity scorecard.
//
// HONESTY NOTE, load-bearing: every physical factor below is an indicative
// estimate assembled from published life cycle assessment literature ranges
// (fibre LCAs, mill energy studies, IMO/ICAO freight factors, public grid
// intensity data), rounded hard and simplified so they can be manipulated
// live. They support decisions and intuition. They are not an audit, and the
// UI says so in plain sight, once.
//
// Anchor sources (see docs/footprint-research/clothing/ and the footer Sources
// list):
//   Mistra Future Fashion 2019:05 (Sandin et al.) - six-garment cradle-to-grave
//     LCA, wet-treatment heat, cutting-loss and process-stage assumptions
//   ADEME 2018 (Lhotellier et al.) - per-fibre and per-garment LCAs
//   WRAP 2017, Valuing Our Clothes - UK use-phase and garment-life data
//   DESNZ/Defra 2026 GHG conversion factors - freight, grid and petrol car
// ===========================================================================

// Fibres the estimator and comparator share. One row per fibre:
//   ef        kg CO2e per kg of finished fibre, cradle to spinning gate
//   waterL    litres per kg of fibre (irrigated where relevant)
//   microMg   microfibre shed, mg per wash, indicative machine-wash figure
//   wearsMod  multiplier on garment life expectancy
//   decayYr   years to substantially break down buried in active soil
//   loop      'mono' closes a fibre recycling loop, 'jam' blocks it,
//             'hard' is technically possible but rarely done at scale
export const STUDIO_FIBRES = [
  { id: 'cotton', name: 'Cotton', kind: 'natural, conventional',
    ef: 5.0, waterL: 7000, microMg: 10, wearsMod: 1.0, decayYr: 0.6, loop: 'mono',
    read: 'Thirsty in the field, honest at end of life. Irrigation is the swing factor.' },
  { id: 'orgcotton', name: 'Organic cotton', kind: 'natural, certified growing',
    ef: 3.2, waterL: 5500, microMg: 10, wearsMod: 1.0, decayYr: 0.6, loop: 'mono',
    read: 'Lower-input growing, similar thirst. The certificate is about the field.' },
  { id: 'linen', name: 'Linen', kind: 'natural, bast fibre',
    ef: 2.1, waterL: 650, microMg: 6, wearsMod: 1.15, decayYr: 0.4, loop: 'mono',
    read: 'Rain-fed flax, small footprint, creases with pride and outlives trends.' },
  { id: 'hemp', name: 'Hemp', kind: 'natural, bast fibre',
    ef: 1.9, waterL: 500, microMg: 6, wearsMod: 1.2, decayYr: 0.4, loop: 'mono',
    read: 'The quiet achiever. Low water, low input, gets softer for a decade.' },
  { id: 'wool', name: 'Merino wool', kind: 'natural, protein fibre',
    ef: 21.0, waterL: 1250, microMg: 12, wearsMod: 1.25, decayYr: 1.5, loop: 'hard',
    read: 'Heavy at the farm gate, then repays it: fewer washes, long life, full breakdown.' },
  { id: 'poly', name: 'Polyester', kind: 'synthetic, virgin',
    ef: 5.4, waterL: 60, microMg: 260, wearsMod: 1.1, decayYr: 500, loop: 'mono',
    read: 'Cheap, strong, nearly waterless to make, and it never really leaves.' },
  { id: 'rpet', name: 'Recycled polyester', kind: 'synthetic, bottle-derived',
    ef: 2.4, waterL: 45, microMg: 260, wearsMod: 1.05, decayYr: 500, loop: 'hard',
    read: 'Half the carbon of virgin, same shedding, and bottles only recycle once this way.' },
  { id: 'lyocell', name: 'Lyocell', kind: 'regenerated cellulose',
    ef: 2.6, waterL: 320, microMg: 9, wearsMod: 0.95, decayYr: 0.8, loop: 'mono',
    read: 'Wood pulp spun in a closed solvent loop. Gentle drape, honest ending.' },
];

export const FIBRE_BY_ID = Object.fromEntries(STUDIO_FIBRES.map((f) => [f.id, f]));

// Garment cuts. Area is fabric consumed in m² including cutting-loss allowance
// at size M; gsm bounds are the realistic cloth-weight range for the cut.
export const GARMENT_TYPES = [
  { id: 'tee', name: 'Tee', area: 0.85, gsmMin: 120, gsmMax: 280, gsmDefault: 180, wearsBase: 90 },
  { id: 'shirt', name: 'Shirt', area: 1.1, gsmMin: 100, gsmMax: 220, gsmDefault: 140, wearsBase: 110 },
  { id: 'hoodie', name: 'Hoodie', area: 1.7, gsmMin: 240, gsmMax: 520, gsmDefault: 340, wearsBase: 150 },
  { id: 'jeans', name: 'Jeans', area: 1.6, gsmMin: 280, gsmMax: 480, gsmDefault: 400, wearsBase: 230 },
  { id: 'dress', name: 'Dress', area: 1.4, gsmMin: 110, gsmMax: 320, gsmDefault: 190, wearsBase: 60 },
];

// Size grades the pattern up or down; multipliers on fabric area.
export const SIZES = [
  { id: 'xs', label: 'XS', mult: 0.86 },
  { id: 's', label: 'S', mult: 0.93 },
  { id: 'm', label: 'M', mult: 1.0 },
  { id: 'l', label: 'L', mult: 1.08 },
  { id: 'xl', label: 'XL', mult: 1.17 },
  { id: 'xxl', label: 'XXL', mult: 1.27 },
];

// Making origins. Grid intensity is an indicative national average in
// kg CO2e per kWh; km is a rough freight distance to Melbourne. cell indexes
// into WORLD_MASK below as [col, row].
export const ORIGINS = [
  { id: 'vn', name: 'Vietnam', grid: 0.68, km: 7900, cell: [51, 12],
    note: 'Coal-heavy grid, deep garment expertise, short sea leg to Australia.' },
  { id: 'cn', name: 'China', grid: 0.64, km: 9200, cell: [52, 10],
    note: 'The full supply chain in one country, on a grid decarbonising unevenly.' },
  { id: 'bd', name: 'Bangladesh', grid: 0.74, km: 9300, cell: [48, 10],
    note: 'Gas and coal power most mills. Labour cost pressure is the industry story here.' },
  { id: 'in', name: 'India', grid: 0.77, km: 9800, cell: [45, 11],
    note: 'Cotton at the doorstep, one of the most carbon-intense grids in the trade.' },
  { id: 'tr', name: 'Türkiye', grid: 0.44, km: 14600, cell: [38, 7],
    note: 'Closer to European buyers than to you. Mid-intensity grid, strong denim craft.' },
  { id: 'pt', name: 'Portugal', grid: 0.17, km: 17600, cell: [30, 7],
    note: 'Wind and hydro do the wet processing. The distance is the price you pay.' },
  { id: 'au', name: 'Australia', grid: 0.63, km: 600, cell: [56, 19],
    note: 'Almost no freight, honest labour law, a grid still burning coal for now.' },
];

export const ORIGIN_BY_ID = Object.fromEntries(ORIGINS.map((o) => [o.id, o]));

// Destination pin for the freight route.
export const DEST = { name: 'Melbourne', cell: [57, 20] };

// A coarse dot map of the world, 64 columns by 23 rows, equirectangular-ish.
// '#' is land. It is a stylised chart, not cartography; hubs index into it.
export const WORLD_MASK = [
  '................................................................',
  '.......###.........#####..........##############................',
  '..#######*#........######......###################.#............',
  '.##########.........####.....######################..##.........',
  '..#########..........##....#..######################.###........',
  '...########...............###.#####################..##.........',
  '....######.................####.####################.##.........',
  '.....####.....................#######..####..######..#..........',
  '......##.......................######..#####.#####..............',
  '.......#........................#####...#######.##..............',
  '................#....................#...######..##.#............',
  '...............####..............####....#####...#.##...........',
  '...............######............#####....##....##..#...........',
  '................#######..........#####.....#....##.###..........',
  '................######...........####..........####..##.........',
  '.................####............###..........#######...........',
  '.................###.............##...........########..........',
  '..................##.............#............########..........',
  '..................##..........................#######...........',
  '..................#............................#####.#..........',
  '..................#.................................#...........',
  '...................................................#............',
  '................................................................',
];

// Process constants. Rounded, indicative, and labelled as such in the UI.
// Freight and the petrol-car equivalence are anchored to the DESNZ/Defra 2026
// conversion factors; wet-treatment heat matches Mistra Future Fashion's
// 30 MJ/kg fossil-fired dye bath; cutting loss sits at the low end of the
// 15 to 20 per cent range Mistra reports.
export const STUDIO_FACTORS = {
  spinKwhPerKg: 3.4,      // yarn prep, spinning, knitting or weaving
  dyeThermalPerKg: 2.2,   // ~30 MJ/kg fossil boiler heat (Mistra 2019), light fuel oil
  dyeElecKwhPerKg: 3.2,   // pumps, jets, drying, grid powered
  dyeWaterLPerKg: 120,    // process water for dye and finish
  makeKwhPerKg: 1.6,      // cut, sew, press
  trimsKg: 0.25,          // threads, labels, zips, buttons, flat allowance
  seaPerKgKm: 0.000016,   // Defra 2026 container ship average, 0.0161 kg CO2e/tonne.km
  airPerKgKm: 0.0009,     // Defra 2026 long-haul air freight incl. RF, 0.899 kg CO2e/tonne.km
  roadKm: 300,            // domestic road leg to the store
  roadPerKgKm: 0.0001,    // Defra 2026 average laden HGV, 0.104 kg CO2e/tonne.km
  retailKg: 0.28,         // packaging, DC and store overhead allowance
  cutLoss: 0.85,          // 15 per cent of cloth becomes offcut (Mistra 15 to 20 per cent)
  carKgPerKm: 0.16,       // Defra 2026 average petrol car, 0.162 kg CO2e/km
};

// The four streams the particle field renders, in the same chart-grade hues
// the footprint dashboard uses for its categories.
export const STREAMS = [
  { id: 'fibre', label: 'Fibre', color: '#75821D',
    note: 'Growing or extruding the raw fibre, cradle to spinning gate.' },
  { id: 'dyeing', label: 'Dyeing', color: '#635BFF',
    note: 'The dye house: tonnes of water heated to a simmer to fix colour. The hotspot.' },
  { id: 'assembly', label: 'Assembly', color: '#B56A00',
    note: 'Spinning, knitting, cutting and sewing, on the making country’s grid.' },
  { id: 'transport', label: 'Transport', color: '#C7274A',
    note: 'Sea freight to Melbourne, the road leg, and the retail allowance.' },
];

// Supply chain stages for the mapper. share() splits the four streams into six
// physical stops so the route reads as a journey, not an accounting table.
export const CHAIN_STAGES = [
  { id: 'fibre', name: 'Fibre', from: 'fibre', frac: 1,
    hud: 'Grown or extruded. For cotton, the irrigation decision starts here and never stops mattering.' },
  { id: 'spin', name: 'Spinning and knitting', from: 'assembly', frac: 0.68,
    hud: 'Fibre becomes yarn becomes cloth. Steady electricity, all grid, runs the mill.' },
  { id: 'dye', name: 'The dye house', from: 'dyeing', frac: 1,
    hud: 'Most of the energy your garment will ever use in production is spent in this shed.' },
  { id: 'make', name: 'Cut and sew', from: 'assembly', frac: 0.32,
    hud: 'Hands and machines. Modest energy, most of the labour story, all of the craft.' },
  { id: 'freight', name: 'Freight', from: 'transport', frac: null, // computed live
    hud: 'Sea freight barely registers per garment. Put the same box on a plane and watch.' },
  { id: 'retail', name: 'Retail', from: 'transport', frac: null,
    hud: 'Packed, trucked, lit and shelved. The last kilometres are short but never free.' },
];

// ---------------------------------------------------------------------------
// The garment model. One function the estimator, mapper and scorecard share.
// blend: { a: fibreId, b: fibreId|null, pctA: 50..100 }
// Returns per-stream kg CO2e, water, mass and life expectancy.
// ---------------------------------------------------------------------------
export function buildGarment({ typeId, sizeId, gsm, blend, originId, freight = 'sea' }) {
  const F = STUDIO_FACTORS;
  const type = GARMENT_TYPES.find((t) => t.id === typeId) || GARMENT_TYPES[0];
  const size = SIZES.find((s) => s.id === sizeId) || SIZES[2];
  const origin = ORIGIN_BY_ID[originId] || ORIGINS[0];
  const a = FIBRE_BY_ID[blend.a] || STUDIO_FIBRES[0];
  const b = blend.b ? FIBRE_BY_ID[blend.b] : null;
  const wA = b ? Math.min(Math.max(blend.pctA, 50), 100) / 100 : 1;
  const mix = (k) => a[k] * wA + (b ? b[k] * (1 - wA) : 0);

  const clothKg = (type.area * size.mult * gsm) / 1000;
  const fibreKg = clothKg / F.cutLoss; // offcuts still had to be grown
  const massKg = clothKg + F.trimsKg;

  const fibre = fibreKg * mix('ef');
  const dyeing = clothKg * (F.dyeThermalPerKg + F.dyeElecKwhPerKg * origin.grid);
  const spin = fibreKg * F.spinKwhPerKg * origin.grid;
  const make = clothKg * F.makeKwhPerKg * origin.grid;
  const assembly = spin + make;
  const perKgKm = freight === 'air' ? F.airPerKgKm : F.seaPerKgKm;
  const freightKg = massKg * (origin.km * perKgKm + F.roadKm * F.roadPerKgKm);
  const transport = freightKg + F.retailKg;

  const total = fibre + dyeing + assembly + transport;
  const waterL = fibreKg * mix('waterL') + clothKg * F.dyeWaterLPerKg;
  const wears = Math.round(type.wearsBase * mix('wearsMod'));
  const microMg = mix('microMg');
  const isBlend = Boolean(b) && wA < 0.95;
  // Recycling loop of the finished cloth: a true blend jams the shredder line
  // regardless of what each fibre could do alone.
  const loop = isBlend ? 'jam' : a.loop;
  const decayYr = Math.max(a.decayYr, b ? b.decayYr : 0);

  return {
    type, size, origin, fibreA: a, fibreB: b, pctA: Math.round(wA * 100),
    clothKg, massKg, total, waterL, wears, microMg, isBlend, loop, decayYr,
    streams: { fibre, dyeing, assembly, transport },
    chain: { fibre, spin, dye: dyeing, make, freight: freightKg, retail: F.retailKg },
    carKm: Math.round(total / F.carKgPerKm),
  };
}

// ---------------------------------------------------------------------------
// Circularity scorecard. A transparent rubric over the built garment plus
// design choices; a heuristic for intuition, not a certification, and the UI
// says so. Each row returns earned points, its ceiling, and a plain reason.
// ---------------------------------------------------------------------------
export const LOOP_CHOICES = [
  { id: 'spares', label: 'Repair spares in the hem',
    blurb: 'Buttons, patch cloth and thread sewn inside, so repair is the easy choice.' },
  { id: 'seams', label: 'Unpickable seams',
    blurb: 'Designed for disassembly: trims come off clean, panels part without shredding.' },
  { id: 'takeback', label: 'Take-back programme',
    blurb: 'The maker collects it at end of life and has somewhere real to send it.' },
  { id: 'resale', label: 'Built for resale',
    blurb: 'Construction and cloth chosen to survive a second owner.' },
];

export function scoreCircularity(g, choices) {
  const rows = [];

  if (!g.isBlend && g.loop === 'mono') {
    rows.push({ id: 'mono', label: 'One-fibre construction', pts: 25, max: 25,
      why: 'A single fibre means a recycler can take it.' });
  } else if (!g.isBlend) {
    rows.push({ id: 'mono', label: 'One-fibre construction', pts: 15, max: 25,
      why: `${g.fibreA.name} recycles in theory, rarely in practice. Points for possibility.` });
  } else {
    rows.push({ id: 'mono', label: 'One-fibre construction', pts: 0, max: 25,
      why: `A ${g.pctA}/${100 - g.pctA} blend jams the shredder line. No recycler will divorce these fibres.` });
  }

  if (g.decayYr <= 2) {
    rows.push({ id: 'eol', label: 'End of life', pts: 20, max: 20,
      why: `Buried, it substantially breaks down in about ${g.decayYr < 1 ? 'a year' : Math.round(g.decayYr) + ' years'}.` });
  } else if (g.loop !== 'jam') {
    rows.push({ id: 'eol', label: 'End of life', pts: 10, max: 20,
      why: 'It will not break down, so its only honest exit is the recycling loop.' });
  } else {
    rows.push({ id: 'eol', label: 'End of life', pts: 0, max: 20,
      why: `Recognisable in landfill for centuries, and the blend blocks recycling.` });
  }

  const durPts = Math.round(Math.min(1, g.wears / 250) * 20);
  rows.push({ id: 'durability', label: 'Durability', pts: durPts, max: 20,
    why: `Expected life of about ${g.wears} wears for this cut and cloth.` });

  const spares = choices.includes('spares') ? 8 : 0;
  const seams = choices.includes('seams') ? 7 : 0;
  rows.push({ id: 'repair', label: 'Repair and disassembly', pts: spares + seams, max: 15,
    why: spares + seams ? 'Designed to be fixed and taken apart.' : 'No repair spares, no unpickable seams. Repair is left to the owner’s stubbornness.' });

  rows.push({ id: 'takeback', label: 'Take-back', pts: choices.includes('takeback') ? 10 : 0, max: 10,
    why: choices.includes('takeback') ? 'Collection with a real destination beats a bin at the door.' : 'No take-back programme. The bin at the store is a bin.' });

  rows.push({ id: 'resale', label: 'Resale value', pts: choices.includes('resale') ? 10 : 0, max: 10,
    why: choices.includes('resale') ? 'Built well enough to sell twice. The loop closes wide.' : 'Not specified for a second owner.' });

  const score = rows.reduce((n, r) => n + r.pts, 0);
  const band = score >= 80 ? { id: 'closed', label: 'Closes the loop' }
    : score >= 60 ? { id: 'near', label: 'Nearly circular' }
      : score >= 40 ? { id: 'half', label: 'Half-way there' }
        : { id: 'linear', label: 'Linear by design' };
  return { rows, score, band };
}

export const COPY = {
  brand: 'Cost Per Wear',
  strap: 'Fashion brand transparency, in plain English',
  byline: 'A working tool by Chris Wang',
  backLabel: 'itschriswang.com',
  backHref: 'https://itschriswang.com/',

  hero: {
    kicker: 'Fashion brand transparency',
    headA: 'Look up the brands',
    headB: 'you wear',
    stand: 'Before you buy, see what a fashion brand is willing to tell you. Search any major label to find who really owns it, how much it discloses, and what still needs checking. What comes back is a disclosure record.',
    searchLabel: 'Search a fashion brand',
    searchPlaceholder: 'Try Nike, Zara, Gucci, Kmart, Uniqlo…',
    examplesLabel: 'Popular lookups',
    examples: ['Nike', 'Zara', 'Uniqlo', 'Gucci', 'The North Face', 'Kmart Australia'],
    countTemplate: '{n} brands and companies tracked',
    kbdHint: 'Press / to search from anywhere',
    recentLabel: 'Recently viewed',
    // The three swing tags drawn beside the headline, by brand id. Their
    // parent, segment and score come from the brand records.
    tagIds: ['uniqlo', 'gucci', 'kmart-australia'],
  },

  // At-a-glance stat band under the hero.
  stats: [
    { k: 'brands and companies', from: 'brands', icon: 'tag' },
    { k: 'corporate groups own them', from: 'groups', icon: 'building' },
    { k: 'transparency scores verified', from: 'scored', icon: 'chart' },
    { k: 'segments, from luxury to value', from: 'segments', icon: 'list' },
  ],

  lookup: {
    idx: '01',
    icon: 'tag',
    title: 'Brand lookup',
    sub: 'Search a label, read its tag',
    lede: 'Type a brand you recognise. You get its corporate parent, its market segment, and a plain reading of what it discloses. Where a figure has not been verified yet, it says so.',
    emptyTitle: 'Search or pick a brand',
    emptyBody: 'Start typing above, or choose one of the popular lookups. Every result shows what is known and what still needs research.',
    notFoundTitle: 'Not in the tracker yet',
    notFoundBody: 'We could not match that to a brand on file. It may be spelled differently, sold under a parent company, or simply not added yet. Add it to the research backlog below.',
    parentLabel: 'Parent company',
    segmentLabel: 'Segment',
    searchAgainLabel: 'Search again',
    hqLabel: 'Headquarters',
    familyLabel: 'Sister brands in this group',
    familyHint: 'The same owner reports for all of these. Tap to switch.',
    reportLabel: 'Sustainability report',
    reportMissing: 'No public report page on file',
    compareAdd: 'Add to compare',
    compareRemove: 'In compare',
    shareLabel: 'Copy link',
    shareDone: 'Link copied',
    researchTag: 'Needs research',
    digLabel: 'Dig deeper',
    digHint: 'Cost Per Wear is a launchpad. Cross-check this brand against independent ratings and the primary sources.',
    checklistLabel: 'Before you buy',
    checklistHint: 'A quick, practical read for this brand, built from what is on file.',
    commitmentsLabel: 'Commitments and memberships',
    commitmentsHint: 'Industry pledges this brand has signed.',
    commitmentsNone: 'No memberships confirmed on file yet.',
    provenanceLabel: 'Ownership',
    freshnessTemplate: 'Ownership and memberships verified as of {d}. Transparency score: Fashion Transparency Index 2023, the final edition of that index.',
  },

  compare: {
    idx: '02',
    icon: 'chart',
    title: 'Compare',
    sub: 'Two or three, signal by signal',
    lede: 'Line brands up in one table to see exactly where their disclosure differs. Add up to three from any lookup or from the directory.',
    empty: 'Add brands from the lookup above, or from the directory, to compare them here.',
    clear: 'Clear all',
    brandCol: 'Signal',
  },

  lens: {
    idx: '03',
    icon: 'target',
    title: 'What you can’t know',
    sub: 'Pick what you care about',
    lede: 'Most tools tell you which brands are good. This one tells you what you can and cannot verify. Choose the things you care about, and the lens reads the selected brand against them: what it publishes, what only its parent publishes, and what stays dark.',
    pickLabel: 'I care about',
    emptyTitle: 'No brand under the lens yet',
    emptyBody: 'Look up a brand above and this section will read it against the things you care about.',
    noneChecked: 'Pick at least one concern above to read this brand against it.',
    ownershipLine: 'Verified: {p}.',
    ownershipFallback: 'Verified owner: {p}.',
    summaryTemplate: 'Of the {n} signals behind what you care about, {open} can be checked, {parent} only through the parent, {dark} are not published, and {unverified} have not been verified by this tool yet.',
    note: 'A dark signal is not evidence of bad practice. It means the brand has not put the information anywhere you can test it, so whatever you believe about it there rests on trust.',
  },

  directory: {
    idx: '04',
    icon: 'building',
    title: 'The directory',
    sub: 'Every brand, and every owner',
    lede: 'The full universe of tracked companies. Filter by segment, narrow by hand, sort by what matters, then tap any tag to pull it into the lookup. Switch to Groups to see who owns whom.',
    filterAll: 'All segments',
    auOnly: 'Australian',
    filterPlaceholder: 'Filter by name…',
    viewBrands: 'Brands',
    viewGroups: 'Groups',
    scored: 'Scored only',
    pactOnly: 'Fashion Pact',
    bcorpOnly: 'B Corp',
    sort: {
      name: 'A to Z',
      fti: 'Transparency score',
      recognition: 'Best known',
      segment: 'By segment',
    },
    sortLabel: 'Sort',
    resultTemplate: '{n} shown',
    resultPartTemplate: '{shown} of {n} shown',
    scoreKey: 'The figure on each tag is its Fashion Transparency Index 2023 score out of 100. TBC means in scope but not yet verified; n/a means the index never assessed it.',
    showAllTemplate: 'Show all {n}',
    showFewer: 'Show fewer',
    noMatch: 'No brands match those filters.',
    groupsLede: 'Every tracked company grouped under its owner, largest holding first. Tap a brand to open it.',
    groupBrandsTemplate: '{n} brands on file',
    groupAvgLabel: 'Mean FTI of scored brands',
  },

  spotlight: {
    // {n}, {covered} and {total} are filled from the brand set at render time,
    // so this claim cannot drift as brands are added. An earlier version read
    // "Ten owners hold most of the brands on this page", which the data never
    // supported: the ten largest cover 38 of 258, and the map note directly
    // below already reported the 182 standalone labels that contradict it.
    stat: '{n} owners',
    line: 'hold more than one label each, covering {covered} of the {total} brands tracked here. Where a brand sits under one of them, the group sets the climate targets and the supplier standards.',
    sub: 'Which is why Cost Per Wear shows you the owner first',
    mapLede: 'Every owner of more than one brand on this page, sized by how many labels it holds. Tap an owner to open its group in the directory.',
    mapNote: 'Tile size is the number of brands on file under that owner. The number after each name is its brand count.',
    independentsTemplate: '+ {n} standalone labels that own no other brand on file',
  },

  // The Garment Studio: four working tools that show the speciality, not just
  // the directory. All figures downstream of buildGarment().
  studio: {
    kicker: 'The garment studio',
    lede: 'The lookup tells you what a brand says. The studio shows you what a garment costs the world, and where. Build one, follow it, then design its second life.',
    estimator: {
      idx: '05',
      icon: 'shirt',
      title: 'Carbon footprint estimator',
      sub: 'Build a garment, watch it cost',
      lede: 'Pick the cut, the size, the cloth and where it is made. Carbon dioxide equivalent gathers around the garment as you work: fibre, dyeing, assembly and transport each emit their own stream.',
      disclaimer: 'Figures are indicative estimates from published life cycle assessment factors, rounded and simplified so they move live. They are built for intuition.',
      typeLabel: 'The cut',
      sizeLabel: 'Size',
      gsmLabel: 'Cloth weight',
      blendLabel: 'The cloth',
      blendALabel: 'Main fibre',
      blendBLabel: 'Second fibre',
      blendNone: 'None, single fibre',
      pctTemplate: '{a}% {an} / {b}% {bn}',
      originLabel: 'Made in',
      originHint: 'Pick a port on the map, or use the list.',
      totalLabel: 'Cradle to shop floor',
      unit: 'kg CO2e',
      waterLabel: 'Water, cradle to gate',
      carTemplate: 'About the same as driving {n} km in an average petrol car.',
      wearsTemplate: 'Expected life around {n} wears.',
      srField: 'Decorative particle field showing the estimate as drifting motes; the figures are in the readout beside it.',
    },
    fabrics: {
      idx: '06',
      icon: 'leaf',
      title: 'Fabric comparator',
      sub: 'Three cloths on the bench',
      lede: 'Pin up to three fibres and put them through the same questions at the same time: carbon to make, water to grow, what sheds in the wash, how long it lives, and what happens when you bury it.',
      pinHint: 'Pin fibres from the shelf. Three at a time.',
      useThis: 'Cut the garment from this',
      rows: {
        ef: { label: 'Carbon to make', unit: 'kg CO2e / kg fibre', icon: 'flame' },
        waterL: { label: 'Water to grow', unit: 'litres / kg fibre', icon: 'drop' },
        microMg: { label: 'Sheds in the wash', unit: 'mg / wash', icon: 'wash' },
        wears: { label: 'Life expectancy', unit: 'relative to cotton', icon: 'clock' },
        decayYr: { label: 'Buried breakdown', unit: 'years to break down', icon: 'bin' },
      },
      decayCapNote: '500 means it effectively never leaves; polyester survives centuries.',
    },
    chain: {
      idx: '07',
      icon: 'globe',
      title: 'Supply chain mapper',
      sub: 'Follow the garment you just built',
      lede: 'The same garment, traced from fibre to a Melbourne shop floor. Each stop shows what it adds. Switch the freight to air to see why the boat matters.',
      routeTemplate: '{origin} to {dest}, about {km} km',
      seaLabel: 'By sea',
      airLabel: 'By air',
      stageLabel: 'Stage',
      hotspotNote: 'The dye house is the hotspot: heating water to fix colour spends more energy than any other step in the making.',
      airWarnTemplate: 'Air freight multiplies the transport stream by roughly {n}×, which on most garments is enough to outweigh the fibre choice entirely.',
    },
    loop: {
      idx: '08',
      icon: 'loop',
      title: 'Circularity scorecard',
      sub: 'Design its second life',
      lede: 'Most of what decides whether a garment can be repaired, resold or recycled is fixed at the design stage, long before anyone wears it. Score the one you built above, then change a choice and watch the score move.',
      choicesLabel: 'Design choices',
      scoreLabel: 'Circularity score',
      rubricNote: 'A transparent design heuristic scored out of 100. Every point is explained, and half of them were earned or lost back in the estimator.',
      maxLabel: 'of {n}',
    },
  },

  // The field guide: one section, four tabs. The working knowledge that used
  // to sprawl across four separate sections (materials, certifications,
  // regulation, claim check), collapsed so the page's spine stays the lookup.
  guide: {
    idx: '09',
    icon: 'book',
    title: 'Field guide',
    sub: 'Materials, labels, rules and claims',
    lede: 'The working knowledge behind the lookup, in one place: what the common fibres trade off, what certifications verify, the rules about to change what brands must tell you, and a checker for the claims on the swing tag.',
    tabs: [
      { id: 'materials', label: 'Materials' },
      { id: 'certs', label: 'Certifications' },
      { id: 'regulation', label: 'Regulation' },
      { id: 'claim', label: 'Claim check' },
    ],
    certTitle: 'What the certifications verify',
    certLede: 'A certificate proves one specific, bounded thing. Knowing its edge is how you avoid reading a single label as a blanket "this is good".',
    certVerifies: 'Verifies',
    certEdge: 'Its edge',
    regTitle: 'Regulation radar',
    regLede: 'The rules that will change what brands must tell you. Forward-looking, and deliberately not a claim about any one brand.',
  },

  claim: {
    title: 'Claim check',
    sub: 'Paste a green claim, see what holds up',
    lede: 'Marketing is where a brand chooses its words. Paste any sustainability claim and this checks it against the way regulators read it: flagging vague and absolute terms, and the qualifiers each one demands. It reads what you paste. It makes no judgement about any real brand.',
    placeholder: 'Paste or type a marketing claim…',
    run: 'Check it',
    tryLabel: 'Or try one',
    principlesLabel: 'The standard it applies',
    principlesNote: 'The ACCC’s eight principles for environmental claims, the benchmark for Australian businesses.',
    flaggedVague: 'Vague terms flagged',
    flaggedAbsolute: 'Absolute terms flagged',
    flaggedQualifier: 'Terms that need a qualifier',
    evidenceLabel: 'Evidence signals found',
    emptyResult: 'Type a claim above to check it.',
    disclaimer: 'This is an educational aid and not legal advice. It reflects the general direction of the ACCC guidance and its EU, UK and US equivalents.',
  },

  materials: {
    title: 'Materials',
    sub: 'What the fabric is telling you',
    lede: 'Half of a garment’s story is the fibre it is cut from. This is a plain read of the common ones and what each of them trades away. The caveat below explains why they are not ordered best to worst.',
    kindLabel: 'Type',
    goodLabel: 'In its favour',
    watchLabel: 'What to watch',
    caveatTitle: 'Why there is no single winner',
    caveat: 'Be wary of anyone who tells you one fibre is simply "the sustainable one". The best-known attempt at a single score, the Higg Materials Sustainability Index, ranked synthetics well partly because it left out microplastic and ocean pollution, and regulators in Norway and the Netherlands paused its consumer use in 2022. The honest answer is trade-offs: the lowest-impact garment is usually the one you already own, worn for years and repaired.',
  },

  signals: {
    idx: '10',
    icon: 'list',
    title: 'What the signals mean',
    sub: 'What the labels do and do not tell you',
    lede: 'Cost Per Wear measures what a brand tells the public. Read these before you draw a conclusion.',
    cards: [
      {
        h: 'Transparency is not performance',
        b: 'A high Fashion Transparency Index score means a brand publishes a lot: policies, supplier lists, audit results. It does not mean the brand has a small footprint. Some of the most transparent brands are also some of the largest producers. Disclosure is the price of being checkable.',
      },
      {
        h: 'The parent company matters',
        b: 'The label on the garment is rarely the company making the decisions. Gucci reports through Kering. Uniqlo reports through Fast Retailing. The North Face, Vans and Timberland all sit inside VF Corporation. If you want the real climate targets and supplier data, you often have to read the parent.',
      },
      {
        h: 'Scope 3 is where the weight sits',
        b: 'For almost every fashion company, the large majority of emissions are Scope 3: the farms, mills, dye houses and factories in the supply chain. A brand that reports Scope 1 and 2 but stays quiet on Scope 3 is disclosing the small part and leaving out the big one.',
      },
      {
        h: 'What the four labels mean',
        b: 'The vocabulary is Disclosed, Not found, Parent-level only, and Needs research. Every one of those describes where a piece of information sits, so you can go and check it. Words like "ethical" and "sustainable" hide the working, so this tool hands you the sources and leaves the verdict to you.',
      },
    ],
    disclaimer: 'Fashion Revolution retired the Transparency Index after the 2023 edition, so the scores here have a fixed vintage and will not move again. Its successor, What Fuels Fashion, is linked from each brand card until those scores can be read in from the primary report.',
  },

  backlog: {
    idx: '11',
    icon: 'scissors',
    title: 'Research backlog',
    sub: 'What still needs a human',
    lede: 'This tool is honest about its gaps. Structural facts, parent, segment, headquarters, are verified. Quantified disclosure fields are being filled in over time. Anything marked "Needs research" below is waiting for a checked source. Next on the list: verified What Fuels Fashion 2024 scores, read from the primary report, to succeed the retired Transparency Index.',
    logTitle: 'Change log',
    logLede: 'Every change to the dataset or the method, dated, newest first.',
    fileNote: 'The editable tracker lives in the repository at',
    filePath: 'public/data/fashion-brands.csv',
    fileHref: 'https://github.com/itschriswang/portfolio/blob/main/public/data/fashion-brands.csv',
    howTo: 'Fill a cell with a sourced value and note the source in the notes column. The page reads its dataset from src/fashion/data.js, so mirror confirmed values there to make them live.',
    countTemplate: '{n} brands still need a verified transparency score',
    fieldCountTemplate: '{n} disclosure fields awaiting a source',
  },

  footer: {
    method: 'Brand ownership is drawn from corporate filings and official brand pages. Transparency scores are the Fashion Transparency Index 2023, published by Fashion Revolution, which rates public disclosure only; 2023 was the final edition of that index, and its successor, What Fuels Fashion, is linked from every brand card until its scores are ingested from the primary report. Climate-target status is drawn from the Science Based Targets initiative’s Companies Taking Action export, 6 August 2026 snapshot, and counts only a near-term target the SBTi records as validated; memberships from The Fashion Pact and B Lab. Per-field disclosure statuses are tracked in the repository and marked "Needs research" until a source is confirmed. Garment studio figures are indicative estimates assembled from published life cycle assessment literature (including Mistra Future Fashion’s six-garment study and ADEME’s consumer-goods LCAs), freight and petrol-car factors from the DESNZ and Defra 2026 conversion factors, and public grid intensity data, rounded and simplified so they can be manipulated live. Nothing here is assured reporting, a product footprint, or advice about a real brand.',
    attributionLabel: 'Data and attribution',
    attribution: 'This tool reproduces published figures with attribution, and claims none of them as its own. Fashion Transparency Index scores are © Fashion Revolution CIC, used for reference under their public research. Science Based Targets initiative data © SBTi. Certification and membership marks belong to their owners: The Fashion Pact, B Lab (B Corp), and the brands named. Company ownership is a matter of public record. Cost Per Wear is an independent, non-commercial reference tool and is not affiliated with, or endorsed by, any brand or organisation named. Every figure links to its source so you can check it. If you own a listing and something is wrong, it can be corrected.',
    sourcesLabel: 'Sources',
    made: 'Built by Chris Wang in Melbourne.',
    top: 'Back to the top',
  },

  // Section rail: label + target id, in scroll order.
  rail: [
    { label: 'Lookup', id: 'lookup' },
    { label: 'Compare', id: 'compare' },
    { label: 'Your lens', id: 'lens' },
    { label: 'Directory', id: 'directory' },
    { label: 'Estimator', id: 'estimator' },
    { label: 'Fabrics', id: 'fabrics' },
    { label: 'Supply chain', id: 'chain' },
    { label: 'Circularity', id: 'loop' },
    { label: 'Field guide', id: 'guide' },
    { label: 'Signals', id: 'signals' },
    { label: 'Backlog', id: 'backlog' },
  ],
};

// ---------------------------------------------------------------------------
// Sources actually used to assemble the dataset. Shown in the footer.
// ---------------------------------------------------------------------------
export const SOURCES = [
  { label: 'Fashion Revolution · Fashion Transparency Index 2023', url: 'https://www.fashionrevolution.org/about/transparency/' },
  { label: 'Fashion Revolution · What Fuels Fashion 2024', url: 'https://www.fashionrevolution.org/what-fuels-fashion/' },
  { label: 'Science Based Targets initiative · Target dashboard', url: 'https://sciencebasedtargets.org/target-dashboard' },
  { label: 'Good On You · Brand ratings directory', url: 'https://directory.goodonyou.eco/' },
  { label: 'Baptist World Aid · Ethical Fashion Guide (AU)', url: 'https://baptistworldaid.org.au/resources/ethical-fashion-guide/' },
  { label: 'The Fashion Pact · Signatories', url: 'https://www.thefashionpact.org/' },
  { label: 'B Lab · Certified B Corporation directory', url: 'https://www.bcorporation.net/' },
  { label: 'ACCC · Making environmental claims: a guide for business', url: 'https://www.accc.gov.au/business/environmental-claims' },
  { label: 'LVMH · Environment and social commitments', url: 'https://www.lvmh.com/en/our-commitments' },
  { label: 'Kering · Sustainability', url: 'https://www.kering.com/en/sustainability/' },
  { label: 'Inditex · Sustainability', url: 'https://www.inditex.com/itxcomweb/en/sustainability' },
  { label: 'H&M Group · Sustainability', url: 'https://hmgroup.com/sustainability/' },
  { label: 'Fast Retailing · Sustainability', url: 'https://www.fastretailing.com/eng/sustainability/' },
  { label: 'VF Corporation · Our Impact', url: 'https://www.vfc.com/our-impact' },
  { label: 'Sandin, Roos et al. · Environmental assessment of Swedish clothing consumption, six garments (Mistra Future Fashion 2019:05)', url: 'https://mistrafuturefashion.com/' },
  { label: 'WRAP · Valuing Our Clothes: the cost of UK fashion (2017)', url: 'https://wrap.org.uk/resources/report/valuing-our-clothes-cost-uk-fashion' },
  { label: 'ADEME · Modélisation et évaluation ACV de produits de consommation et biens d’équipement (2018)', url: 'https://librairie.ademe.fr/' },
  { label: 'DESNZ & Defra · UK Government GHG conversion factors for company reporting 2026', url: 'https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting' },
];
