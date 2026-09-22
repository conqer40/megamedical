/* ==========================================================================
   Mega Medical - Official Medical Consumables Dataset (2026 Catalogue)
   Parent Conglomerate: El Salhy Group (Established 1983)
   ========================================================================== */

const productsData = [
  {
    id: 1,
    code: "MM-01",
    category: "gloves",
    name: "Nitrile Examination Gloves, Powder Free",
    tag: "Medical Exam Grade · Single Use · Ambidextrous",
    image: "assets/products/01_nitrile_gloves.jpg",
    specs: [
      "CE / ISO certified medical examination standard",
      "100 pcs/box · 10 boxes/carton (1,000 pcs/carton)",
      "Powder-free, ambidextrous, micro-textured fingertips for non-slip grip",
      "Full size range available: Small, Medium, Large, Extra Large (S–XL)",
      "20ft container load depends on carton dimensions (Ask factory CBM)"
    ],
    certs: ["CE", "ISO 13485", "Medical Grade"],
    packing: "100 pcs/box · 10 boxes/ctn (1,000 pcs)",
    hsCode: "4015.19",
    origin: "Egypt / Approved Partner Facilities"
  },
  {
    id: 2,
    code: "MM-02",
    category: "gloves",
    name: "Latex Surgical Gloves, Sterile, Powder Free",
    tag: "Sterile Pair Pack · Anatomical Curved Fit",
    image: "assets/products/02_latex_surgical_gloves.jpg",
    specs: [
      "Individually wrapped sterile pair pack · 100% Powder-free",
      "CE / ISO 13485 certified surgical grade latex",
      "Ergonomic anatomical fit to prevent hand fatigue during prolonged procedures",
      "Sizes: 6.0 to 8.5 (Custom mixed-size orders supported)",
      "Reinforced heavy-duty carton for export protection & optimal FCL packing"
    ],
    certs: ["CE", "ISO 13485", "Sterile EO"],
    packing: "50 pairs/box · 8 boxes/ctn (400 pairs)",
    hsCode: "4015.11",
    origin: "Egypt / Approved Partner Facilities"
  },
  {
    id: 3,
    code: "MM-03",
    category: "syringes",
    name: "Disposable Syringes with Needle (3-Part)",
    tag: "3-Part EO Sterile · Luer Slip / Luer Lock",
    image: "assets/products/03_disposable_syringes.jpg",
    specs: [
      "Capacities available: 1 ml / 2 ml / 3 ml / 5 ml / 10 ml / 20 ml",
      "3-part construction with medical rubber gasket for seamless plunger motion",
      "Sterile EO gas · CE / ISO 7886-1 standard · HS Code 901831",
      "Available with Luer slip or secure Luer lock tip on request",
      "Robust Egyptian industrial manufacturing foundation for large tenders"
    ],
    certs: ["CE", "ISO 7886", "EO Sterile"],
    packing: "100 pcs/box · 12-24 boxes/ctn (varies by volume)",
    hsCode: "9018.31",
    origin: "Egypt (Primary Manufacturing Base)"
  },
  {
    id: 4,
    code: "MM-04",
    category: "syringes",
    name: "Insulin Syringes 1 ml U-100 Fixed Needle",
    tag: "Ultra-Fine Gauge · Zero Dead Space",
    image: "assets/products/04_insulin_syringes.jpg",
    specs: [
      "1 ml U-100 capacity with integrated fixed needle, sterile, CE marked",
      "Ultra-fine micro gauge needle (29G - 31G) for painless subcutaneous injection",
      "Crystal-clear transparent barrel with bold, indelible graduation markings",
      "Individually blister packed or multi-pack polybag as specified by buyer",
      "Confirm units scale calibration and needle length (8 mm / 12.7 mm)"
    ],
    certs: ["CE", "ISO 8537", "Sterile EO"],
    packing: "100 pcs/box · 10-20 boxes/ctn",
    hsCode: "9018.31",
    origin: "Egypt"
  },
  {
    id: 5,
    code: "MM-05",
    category: "gloves",
    name: "3-Ply Surgical Face Masks with Earloop",
    tag: "BFE ≥ 98% · Meltblown Filter Barrier",
    image: "assets/products/05_surgical_masks.jpg",
    specs: [
      "Bacterial Filtration Efficiency (BFE) ≥ 98% · CE marked standard",
      "3-Layer structure: Spunbond PP + Meltblown filter media + Skin-friendly inner",
      "Ultrasonically welded elastic earloops and malleable enclosed nose wire",
      "Standard factory pack: 50 pcs/box · 40 boxes/carton (2,000 pcs)",
      "20ft container load ≈ 0.9 to 1.0 million pieces (50×40 packing scheme)"
    ],
    certs: ["CE", "EN 14683 Type II", "ISO 9001"],
    packing: "50 pcs/box · 40 boxes/ctn (2,000 pcs)",
    hsCode: "6307.90",
    origin: "Egypt"
  },
  {
    id: 6,
    code: "MM-06",
    category: "gloves",
    name: "Isolation & Surgical Gowns (Non-Woven)",
    tag: "Disposable Fluid Resistant · AAMI Levels 1-3",
    image: "assets/products/06_surgical_gown.jpg",
    specs: [
      "Disposable medical non-woven protective gown, CE certified",
      "Isolation standard or Sterile surgical grade available on request",
      "Ergonomic ties, thumb loops, elastic cuffs, or knitted soft cuffs",
      "Fabric options: Premium SMS, SMMS, or PP+PE fluid-barrier laminate",
      "AAMI Level 1, Level 2, or Level 3 certified protection levels"
    ],
    certs: ["CE", "AAMI Standards", "ISO 13485"],
    packing: "10 pcs/polybag · 100 pcs/master ctn",
    hsCode: "6210.10",
    origin: "Egypt"
  },
  {
    id: 7,
    code: "MM-07",
    category: "infusion",
    name: "IV Infusion Set with Needle (Sterile EO)",
    tag: "PVC 150 cm · 20 Drops/ml · Precision Roller",
    image: "assets/products/07_iv_infusion_set.jpg",
    specs: [
      "Sterile EO gas sterilization · CE / ISO 8536-4 compliant",
      "Medical-grade kink-resistant flexible PVC tubing (150 cm length)",
      "Transparent drip chamber with 20 drops/ml calibration & solution filter",
      "High-precision roller clamp for smooth gravity flow administration",
      "Luer lock connector · Supplied with or without 21G sharp vein needle",
      "Packing: 25 pcs/polybag, 500 pcs/carton · Egyptian factory direct"
    ],
    certs: ["CE", "ISO 8536-4", "EO Sterile"],
    packing: "25 pcs/bag · 500 pcs/ctn",
    hsCode: "9018.90",
    origin: "Egypt"
  },
  {
    id: 8,
    code: "MM-08",
    category: "infusion",
    name: "IV Cannula / IV Catheter (14G – 26G)",
    tag: "Color-Coded · PTFE / FEP · Farcomake Line",
    image: "assets/products/08_iv_cannula.jpg",
    specs: [
      "Standard color-coding: 14G (Orange), 16G (Grey), 18G (Green), 20G (Pink), 22G (Blue), 24G (Yellow), 26G (Violet)",
      "High-grade biocompatible PTFE / FEP catheter with radiopaque stripes for X-ray visibility",
      "Sharp back-cut Japanese stainless steel needle for gentle, painless venipuncture",
      "Color-coded injection port with non-return silicone valve and secure fixation wings",
      "Crystal flashback chamber for immediate blood visualization confirmation",
      "Packing: 100 pcs/box, 1,000 pcs/carton · Egyptian source (Farcomake line)"
    ],
    certs: ["CE", "ISO 10555", "ISO 13485"],
    packing: "100 pcs/box · 1,000 pcs/ctn",
    hsCode: "9018.39",
    origin: "Egypt (Farcomake Line)"
  },
  {
    id: 9,
    code: "MM-09",
    category: "urology",
    name: "Urine Drainage Bag 2000 ml with T-Valve",
    tag: "2000 ml Graduated · Anti-Reflux Valve",
    image: "assets/products/09_urine_bag.jpg",
    specs: [
      "2,000 ml graduated volumetric collection bag with prominent measurement scale",
      "Reinforced heavy-duty medical PVC with universal bedside hanger holes",
      "Bottom T-valve / push-pull drainage tap for hygienic, splash-free emptying",
      "Integrated one-way flutter anti-reflux valve preventing retrograde infection",
      "90 cm kink-resistant tubing with universal stepped connector and protective cap"
    ],
    certs: ["CE", "ISO 8669", "Sterile EO"],
    packing: "10 pcs/bag · 250 pcs/ctn",
    hsCode: "9018.90",
    origin: "Egypt / Approved Partner Facilities"
  },
  {
    id: 10,
    code: "MM-10",
    category: "wound",
    name: "Sterile Gauze Swabs & Pure Cotton Rolls",
    tag: "100% Egyptian Cotton · Maximum Absorbency",
    image: "assets/products/10_sterile_gauze.jpg",
    specs: [
      "Woven from 100% authentic long-staple premium Egyptian cotton fibers",
      "Tucked folded edges to prevent stray threads and linting during surgical interventions",
      "Standard sizes: 5×5 cm, 7.5×7.5 cm, 10×10 cm (8, 12, 16 ply counts)",
      "Sterile peel pouches (2, 5, or 10 pcs/pack) or non-sterile bulk rolls for clinics",
      "Bleached absorbent cotton wool rolls: 500g and 1,000g hospital-grade"
    ],
    certs: ["CE", "EN 14079", "ISO 13485"],
    packing: "Sterile peel pouches or bulk master cartons",
    hsCode: "3005.90",
    origin: "Egypt (World-Renowned Cotton Heritage)"
  },
  {
    id: 11,
    code: "MM-11",
    category: "wound",
    name: "Crepe & Elastic Bandages (Various Sizes)",
    tag: "Orthopedic Compression · High Elasticity",
    image: "assets/products/11_elastic_bandage.jpg",
    specs: [
      "Medical-grade woven cotton and elastic threads for orthopedic compression and support",
      "Standard widths: 5 cm / 7.5 cm / 10 cm / 15 cm (Stretched length 4.5 meters)",
      "Supplied with or without metal/elastic securing clips according to tender criteria",
      "Washable, reusable, breathable, skin-friendly composition with persistent elastic tension",
      "High local availability — ideal for export mix-loading and hospital procurement tenders"
    ],
    certs: ["CE", "ISO 9001", "Hospital Grade"],
    packing: "10 rolls/pack · 200-400 rolls/ctn",
    hsCode: "3005.90",
    origin: "Egypt"
  },
  {
    id: 12,
    code: "MM-12",
    category: "mix",
    name: "Hospital Consumables — One-Stop Mix Load",
    tag: "Gloves + Syringes + Masks + IV Sets in 1 FCL",
    image: "assets/products/12_onestop_mix.jpg",
    specs: [
      "Tailored specifically for African, COMESA, and Middle East hospital procurement tenders",
      "Combines gloves, syringes, masks, IV sets, and catheters in a single 20ft/40ft container",
      "One certified supplier, unified commercial invoice, single bill of lading, unified inspection certificates",
      "Custom volumetric container loading plan engineered by Mega Medical logistics specialists",
      "Substantial cost savings in ocean freight, banking fees, and port customs clearance"
    ],
    certs: ["COMESA Certified", "ISO / CE Full Documentation", "COO EUR.1"],
    packing: "20ft FCL / 40ft HQ Consolidated Export Load",
    hsCode: "Multiple Medical Codes",
    origin: "Egypt (Global & Regional Shipping Hub)"
  },
  {
    id: 13,
    code: "MM-13",
    category: "critical",
    name: "Suction Catheter (48 / 53 / 60 cm)",
    tag: "Color-Coded Funnel · Lateral Eye · Atraumatic",
    image: "assets/products/13_suction_catheter.jpg",
    specs: [
      "Indicated for oral, tracheal, and endobronchial clearance of secretions in intensive care",
      "Manufactured from non-toxic, kink-resistant transparent medical grade PVC",
      "Color-coded funnel connector conforming to international sizing standards",
      "Rounded soft atraumatic distal tip with lateral eye to prevent mucosal damage",
      "Lengths: 48 cm, 53 cm, 60 cm · Sterile peel pouch · Egyptian factory direct"
    ],
    certs: ["CE", "ISO 13485", "Sterile EO"],
    packing: "50 pcs/box · 500 pcs/ctn",
    hsCode: "9018.39",
    origin: "Egypt"
  },
  {
    id: 14,
    code: "MM-14",
    category: "urology",
    name: "Nelaton Urinary Catheter (6 – 20 Fr)",
    tag: "Thermo-Sensitive Polymer · Male / Female / Ped",
    image: "assets/products/14_nelaton_catheter.jpg",
    specs: [
      "Intermittent bladder catheterization with smooth insertion comfort",
      "Color-coded funnel for instantaneous size identification (6 Fr to 20 Fr)",
      "Anatomical gender variants: Male (40 cm), Female (20 cm), Pediatric lengths",
      "Thermo-sensitive medical polymer softens at body temperature for maximum patient ease",
      "Smooth polished closed distal tip with two lateral eyes for rapid, complete drainage"
    ],
    certs: ["CE", "ISO 13485", "Sterile EO"],
    packing: "50 pcs/box · 500 pcs/ctn",
    hsCode: "9018.39",
    origin: "Egypt"
  },
  {
    id: 15,
    code: "MM-15",
    category: "infusion",
    name: "3-Way Stopcock, High Pressure Luer Lock",
    tag: "360° Rotation · 3-Bar Tested · Leak-Free",
    image: "assets/products/15_3way_stopcock.jpg",
    specs: [
      "Smooth 360-degree rotational taps with sharp arrows indicating fluid direction",
      "Hydrostatically tested up to 3 Bar (43.5 psi) guaranteeing zero leak risk",
      "Standard 6% conical Luer taper compatible with all international infusion lines",
      "Color-coded tap handles: Red (Arterial), Blue (Venous), White (General administration)",
      "Individually packed in rigid EO sterile blister packaging (50 inner / 500 master)"
    ],
    certs: ["CE", "ISO 13485", "3-Bar Pressure Tested"],
    packing: "50 pcs/box · 500 pcs/ctn",
    hsCode: "9018.90",
    origin: "Egypt"
  },
  {
    id: 16,
    code: "MM-16",
    category: "infusion",
    name: "Blood Transfusion Set with Micro Filter",
    tag: "170–210µ Micro Filter · 18G Needle · Dual Chamber",
    image: "assets/products/16_blood_transfusion_set.jpg",
    specs: [
      "Engineered specifically for sterile gravity administration of whole blood and blood derivatives",
      "Cylindrical drip chamber fitted with a 170 to 210 micron mesh filter to retain blood clots",
      "Furnished with siliconized 18G sharp venipuncture needle for effortless administration",
      "Smooth roller clamp allowing micro-metered drip rate adjustment",
      "Sterile peel-open pouch · Manufactured in advanced Egyptian cleanrooms"
    ],
    certs: ["CE", "ISO 1135-4", "EO Sterile"],
    packing: "25 pcs/bag · 400 pcs/ctn",
    hsCode: "9018.90",
    origin: "Egypt"
  },
  {
    id: 17,
    code: "MM-17",
    category: "critical",
    name: "Endotracheal Tube (Cuffed & Plain)",
    tag: "Murphy Eye · HVLP Cuff · Radiopaque Line",
    image: "assets/products/17_endotracheal_tube.jpg",
    specs: [
      "Thermosensitive transparent medical PVC contouring smoothly to airway anatomy",
      "Features atraumatic rounded tip with Murphy Eye ensuring continuous bilateral ventilation",
      "Continuous radiopaque X-ray line along full length with calibrated depth centimeter markings",
      "Universal 15 mm standard connector compatible with all ventilators and anesthesia machines",
      "High Volume Low Pressure (HVLP) cuff provides optimal tracheal seal without mucosal ischemia"
    ],
    certs: ["CE", "ISO 5356-1", "ISO 13485"],
    packing: "10 pcs/box · 100 pcs/ctn",
    hsCode: "9018.39",
    origin: "Egypt / Approved Partner Facilities"
  },
  {
    id: 18,
    code: "MM-18",
    category: "critical",
    name: "Ryle / Nasogastric Feeding Tube",
    tag: "Shore A80 PVC · X-Ray Opaque Tip · 4 Side Eyes",
    image: "assets/products/18_ryle_tube.jpg",
    specs: [
      "Indicated for enteral nutrition, stomach decompression, and oral drug administration",
      "Biocompatible flexible PVC (Shore A80) with frosted low-friction outer finish",
      "Embedded radiopaque lead balls in distal tip for immediate fluoroscopic placement confirmation",
      "Four staggered lateral eyes to prevent occlusion and ensure continuous suction flow",
      "Calibrated depth rings at 40, 50, 60, and 70 cm from the tip · with or without adaptor"
    ],
    certs: ["CE", "ISO 13485", "Sterile EO"],
    packing: "50 pcs/box · 400 pcs/ctn",
    hsCode: "9018.39",
    origin: "Egypt"
  },
  {
    id: 19,
    code: "MM-19",
    category: "dialysis",
    name: "AV Fistula Needle for Hemodialysis (15G / 16G / 17G)",
    tag: "Siliconized Thin-Wall · Rotating Wings · Back-Eye",
    image: "assets/products/19_av_fistula_needle.jpg",
    specs: [
      "Ultra-thin wall siliconized needle providing maximum blood flow rate with minimal puncture discomfort",
      "Available gauge sizes: 15G (Orange), 16G (Green), 17G (Red) in arterial and venous models",
      "Available with or without oval back-eye to enhance laminar blood flow and prevent turbulence",
      "Textured color-coded rotating wings for ergonomic grip and stable skin placement",
      "Flexible medical tubing: 15 cm or 30 cm with safety pinch clamp and Luer lock connector"
    ],
    certs: ["CE", "ISO 13485", "Dialysis Grade"],
    packing: "50 pairs/box · 200 pairs/ctn",
    hsCode: "9018.39",
    origin: "Egypt / Approved Partner Facilities"
  },
  {
    id: 20,
    code: "MM-20",
    category: "dialysis",
    name: "Hemodialysis Bloodline Tubing Set",
    tag: "Fresenius / Gambro / Nipro / Baxter Compatible",
    image: "assets/products/20_hemodialysis_bloodline.jpg",
    specs: [
      "Complete extracorporeal blood circuit comprising color-coded Arterial (Red) and Venous (Blue) lines",
      "Precision-calibrated silicone pump segment compatible with major dialysis systems (Fresenius, Gambro, Nipro, Baxter, B.Braun)",
      "Fitted with hydrophobic transducer protectors, heparin infusion line, drip chambers, and priming bag",
      "Biocompatible non-DEHP medical PVC formulated to minimize hemolysis and thrombogenesis",
      "100% Egyptian precision cleanroom extrusion, ultrasonic assembly, and EO sterilization"
    ],
    certs: ["CE", "ISO 8637-2", "ISO 13485"],
    packing: "1 set/sterile pouch · 24 sets/master ctn",
    hsCode: "9018.90",
    origin: "Egypt (High-Tech Dialysis Extrusion Line)"
  }
];

const containerSpecs = {
  fcl20: {
    volumeCbm: 28.0,
    maxWeightKg: 18000,
    name: "20ft FCL Standard Container (28 CBM)"
  },
  fcl40: {
    volumeCbm: 65.0,
    maxWeightKg: 26000,
    name: "40ft HQ High-Cube Container (65 CBM)"
  }
};
