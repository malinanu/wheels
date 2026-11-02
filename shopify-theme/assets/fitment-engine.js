/**
 * AGNI FORGED WHEELS - Verified Fitment Engine
 * Authoritative fitment verification for performance and exotic platforms.
 */

window.AgniFitmentEngine = (function() {
  const FITMENT_DATABASE = [
    {
      make: "Ferrari",
      model: "812 GTS / Superfast",
      years: ["2021", "2022", "2023", "2024"],
      trims: [
        {
          name: "812 GTS 6.5L V12 Spider",
          pcd: "5x114.3",
          cb: 67.1,
          front: { diameter: '21"', width: '10.0J', offset: 'ET44' },
          rear: { diameter: '22"', width: '12.5J', offset: 'ET38' },
          brakes: "Brembo 398mm CCM-R Carbon Ceramic Cleared",
          status: "VERIFIED"
        }
      ]
    },
    {
      make: "Porsche",
      model: "911 GT3 (992)",
      years: ["2022", "2023", "2024", "2025"],
      trims: [
        {
          name: "GT3 Standard / Touring (Centerlock)",
          pcd: "Centerlock",
          cb: 84.0,
          front: { diameter: '20"', width: '9.5J', offset: 'ET46' },
          rear: { diameter: '21"', width: '12.0J', offset: 'ET45' },
          brakes: "Standard 408mm Cast-Iron / 410mm PCCB",
          status: "VERIFIED"
        },
        {
          name: "GT3 RS (992)",
          pcd: "Centerlock",
          cb: 84.0,
          front: { diameter: '20"', width: '10.0J', offset: 'ET45' },
          rear: { diameter: '21"', width: '13.0J', offset: 'ET46' },
          brakes: "PCCB Ceramic Aerodisc Cleared",
          status: "VERIFIED"
        }
      ]
    },
    {
      make: "BMW",
      model: "M4 / M3 (G80/G82)",
      years: ["2021", "2022", "2023", "2024", "2025"],
      trims: [
        {
          name: "Competition xDrive",
          pcd: "5x112",
          cb: 66.6,
          front: { diameter: '20"', width: '10.0J', offset: 'ET14' },
          rear: { diameter: '20"', width: '11.0J', offset: 'ET12' },
          brakes: "M Carbon Ceramic / Standard Steel 6-Piston",
          status: "VERIFIED"
        },
        {
          name: "M4 CSL",
          pcd: "5x112",
          cb: 66.6,
          front: { diameter: '19"', width: '9.5J', offset: 'ET20' },
          rear: { diameter: '20"', width: '10.5J', offset: 'ET20' },
          brakes: "M Compound High-Thermal",
          status: "VERIFIED"
        }
      ]
    },
    {
      make: "Audi",
      model: "RS6 Avant (C8)",
      years: ["2020", "2021", "2022", "2023", "2024", "2025"],
      trims: [
        {
          name: "RS6 Performance 4.0T",
          pcd: "5x112",
          cb: 66.5,
          front: { diameter: '22"', width: '10.5J', offset: 'ET19' },
          rear: { diameter: '22"', width: '10.5J', offset: 'ET19' },
          brakes: "440mm Ceramic 10-Piston Caliper Cleared",
          status: "VERIFIED"
        }
      ]
    },
    {
      make: "Mercedes-AMG",
      model: "AMG GT Coupé (C192 / C190)",
      years: ["2021", "2022", "2023", "2024"],
      trims: [
        {
          name: "AMG GT 63 S 4MATIC+",
          pcd: "5x112",
          cb: 66.6,
          front: { diameter: '21"', width: '10.5J', offset: 'ET30' },
          rear: { diameter: '21"', width: '11.5J', offset: 'ET30' },
          brakes: "AMG High-Performance Composite",
          status: "VERIFIED"
        }
      ]
    },
    {
      make: "Nissan",
      model: "GT-R (R35)",
      years: ["2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
      trims: [
        {
          name: "Nismo / Premium",
          pcd: "5x114.3",
          cb: 66.1,
          front: { diameter: '20"', width: '10.0J', offset: 'ET35' },
          rear: { diameter: '20"', width: '12.0J', offset: 'ET20' },
          brakes: "Brembo Carbon Ceramic 410mm",
          status: "VERIFIED"
        }
      ]
    },
    {
      make: "Chevrolet",
      model: "Corvette Z06 (C8)",
      years: ["2023", "2024", "2025"],
      trims: [
        {
          name: "Z06 with Z07 Performance Package",
          pcd: "5x120",
          cb: 66.9,
          front: { diameter: '20"', width: '10.0J', offset: 'ET40' },
          rear: { diameter: '21"', width: '13.0J', offset: 'ET34' },
          brakes: "Brembo 398mm Carbon Ceramic",
          status: "VERIFIED"
        }
      ]
    }
  ];

  let selectedVehicle = {
    make: "Ferrari",
    model: "812 GTS / Superfast",
    year: "2024",
    trim: "812 GTS 6.5L V12 Spider",
    fitmentData: FITMENT_DATABASE[0].trims[0]
  };

  function getMakes() {
    return FITMENT_DATABASE.map(entry => entry.make);
  }

  function getModels(make) {
    const entry = FITMENT_DATABASE.find(e => e.make.toLowerCase() === make.toLowerCase());
    return entry ? [entry.model] : [];
  }

  function getYears(make, model) {
    const entry = FITMENT_DATABASE.find(e => e.make.toLowerCase() === make.toLowerCase() && e.model.toLowerCase() === model.toLowerCase());
    return entry ? entry.years : ["2024", "2023", "2022"];
  }

  function getTrims(make, model) {
    const entry = FITMENT_DATABASE.find(e => e.make.toLowerCase() === make.toLowerCase() && e.model.toLowerCase() === model.toLowerCase());
    return entry ? entry.trims : [];
  }

  function checkFitment(make, model, year, trimName) {
    const entry = FITMENT_DATABASE.find(e => e.make.toLowerCase() === (make || '').toLowerCase() && e.model.toLowerCase() === (model || '').toLowerCase());
    if (!entry) {
      return {
        status: "UNVERIFIED",
        message: "Vehicle data not in verified database. Engineering review required."
      };
    }
    const trim = entry.trims.find(t => t.name.toLowerCase() === (trimName || '').toLowerCase()) || entry.trims[0];
    return {
      status: trim.status,
      details: trim,
      summary: `${entry.make} ${entry.model} (${year || '2024'}) - PCD: ${trim.pcd} | Front: ${trim.front.diameter} ${trim.front.width} ${trim.front.offset} | Rear: ${trim.rear.diameter} ${trim.rear.width} ${trim.rear.offset}`
    };
  }

  function setVehicle(make, model, year, trimName) {
    const res = checkFitment(make, model, year, trimName);
    selectedVehicle = {
      make,
      model,
      year,
      trim: trimName,
      fitmentData: res.details || null,
      status: res.status
    };
    // Persist to session
    sessionStorage.setItem('agni_selected_vehicle', JSON.stringify(selectedVehicle));
    window.dispatchEvent(new CustomEvent('agni:vehicleChanged', { detail: selectedVehicle }));
    return selectedVehicle;
  }

  function getSelectedVehicle() {
    const saved = sessionStorage.getItem('agni_selected_vehicle');
    if (saved) {
      try { selectedVehicle = JSON.parse(saved); } catch(e){}
    }
    return selectedVehicle;
  }

  // 10 Core AGNI Designs (Mapped to RVRN High-Performance Forged Catalog)
  const WHEEL_CATALOG = [
    {
      code: "AF-01",
      rvrnCode: "RV-DC35",
      name: "AF-01 CONCAVE BILLET",
      construction: "1-Piece Monoblock",
      category: "1-piece",
      spokes: "5-Spoke Deep Concave with Black Flange",
      weightFrom: "8.6 kg (19\")",
      diameters: "19\" – 24\"",
      basePrice: 3396,
      image: "https://cdn.shopify.com/s/files/1/0571/2353/7032/files/rvrn-rv-dc35-5spoke-concave-c8-corvette-black-rims-wheel.png?v=1783321593",
      profile: "Deep Concave Monoblock",
      brakes: "Up to 440mm PCCB Cleared"
    },
    {
      code: "AF-02",
      rvrnCode: "RV-DC24",
      name: "AF-02 DIRECTIONAL GT",
      construction: "2-Piece Modular",
      category: "2-piece",
      spokes: "Y-Spoke Aston Martin Spec Split Lip",
      weightFrom: "10.3 kg (20\")",
      diameters: "19\" – 23\"",
      basePrice: 4396,
      image: "https://cdn.shopify.com/s/files/1/0571/2353/7032/files/rvrn-rv-dc24-forged-y-spoke-aston-martin-red-black-wheel.jpg?v=1776231943",
      profile: "Stepped Lip Modular",
      brakes: "High Offset Caliper Cleared"
    },
    {
      code: "AF-03",
      rvrnCode: "RV-DB082",
      name: "AF-03 MULTI-SPOKE EXOTIC",
      construction: "2-Piece Modular",
      category: "2-piece",
      spokes: "Ferrari 812 Spec Bronze Multi-Spoke",
      weightFrom: "9.9 kg (20\")",
      diameters: "19\" – 22\"",
      basePrice: 4396,
      image: "https://cdn.shopify.com/s/files/1/0571/2353/7032/files/rvrn-rv-db082-forged-multi-spoke-ferrari-bronze-wheel.png?v=1776407074",
      profile: "Exotic Multi-Spoke",
      brakes: "398mm CCM-R Carbon Ceramic Cleared"
    },
    {
      code: "AF-04",
      rvrnCode: "RV-DS016",
      name: "AF-04 CARBON FLASH",
      construction: "2-Piece Modular",
      category: "2-piece",
      spokes: "Carbon Flash Metallic Deep Lip",
      weightFrom: "10.4 kg (20\")",
      diameters: "19\" – 24\"",
      basePrice: 4996,
      image: "https://cdn.shopify.com/s/files/1/0571/2353/7032/files/rvrn-rv-ds016-forged-carbon-flash-corvette-red-black-wheel.jpg?v=1779683353",
      profile: "Carbon Flash Lip",
      brakes: "C8 Z06 Z07 Cleared"
    },
    {
      code: "AF-05",
      rvrnCode: "RV-DR08D",
      name: "AF-05 DEEP DISH STEP-LIP",
      construction: "2-Piece Modular",
      category: "2-piece",
      spokes: "Step Lip Deep Dish Gold & Gloss Black",
      weightFrom: "10.2 kg (19\")",
      diameters: "18\" – 22\"",
      basePrice: 4196,
      image: "https://cdn.shopify.com/s/files/1/0571/2353/7032/files/rvrn-rv-dr08d-forged-deep-dish-mustang-gold-black-wheel.jpg?v=1776333853",
      profile: "Step Lip Deep Dish",
      brakes: "High Clearance Stepped Lip"
    },
    {
      code: "AF-06",
      rvrnCode: "RV-T081",
      name: "AF-06 CARBON THREE-PIECE",
      construction: "3-Piece Custom",
      category: "3-piece",
      spokes: "Carbon Fiber Deep Dish with Hidden ARP Screws",
      weightFrom: "9.8 kg (20\")",
      diameters: "19\" – 24\"",
      basePrice: 6796,
      image: "https://cdn.shopify.com/s/files/1/0571/2353/7032/files/rvrn-rv-t081-forged-carbon-fiber-deep-dish-corvette-yellow-black-wheel.png?v=1779971539",
      profile: "Hidden Hardware Carbon",
      brakes: "Custom Offset Radial Clearance"
    },
    {
      code: "AF-07",
      rvrnCode: "RV-DC25",
      name: "AF-07 SPLIT 5 STAGGERED",
      construction: "2-Piece Modular",
      category: "2-piece",
      spokes: "Split 5-Spoke Deep Staggered Lip",
      weightFrom: "10.1 kg (20\")",
      diameters: "19\" – 23\"",
      basePrice: 4396,
      image: "https://cdn.shopify.com/s/files/1/0571/2353/7032/files/rvrn-rv-dc25-forged-5-spoke-corvette-yellow-black-wheel.png?v=1781683030",
      profile: "Deep Staggered Lip",
      brakes: "Up to 410mm High-Pot Cleared"
    },
    {
      code: "AF-08",
      rvrnCode: "RV-MC35",
      name: "AF-08 CARBON MONOBLOCK",
      construction: "1-Piece Monoblock",
      category: "1-piece",
      spokes: "Carbon Fiber Wrapped 5-Spoke Monoblock",
      weightFrom: "8.5 kg (19\")",
      diameters: "18\" – 22\"",
      basePrice: 3396,
      image: "https://cdn.shopify.com/s/files/1/0571/2353/7032/files/rvrn-rv-mc35-forged-carbon-fiber-bmw-black-carbon-fiber-wheel.jpg?v=1781154109",
      profile: "Carbon Monoblock Track",
      brakes: "GT3 Cup / M Carbon Ceramic"
    },
    {
      code: "AF-09",
      rvrnCode: "RV-MF14",
      name: "AF-09 CONCAVE POLISHED",
      construction: "1-Piece Monoblock",
      category: "1-piece",
      spokes: "Forged 1-Piece Polished & Black 5-Spoke",
      weightFrom: "8.6 kg (19\")",
      diameters: "18\" – 22\"",
      basePrice: 3396,
      image: "https://cdn.shopify.com/s/files/1/0571/2353/7032/files/rvrn-rv-mf14-forged-5-spoke-concave-corvette-polished-black-wheel.png?v=1782205938",
      profile: "Deep Concave Monoblock",
      brakes: "Extreme Concave Profile"
    },
    {
      code: "AF-10",
      rvrnCode: "RV-MS808",
      name: "AF-10 CHROME MESH GT",
      construction: "1-Piece Monoblock",
      category: "1-piece",
      spokes: "1-Piece Ultra-Thin Mesh Chrome Transparent",
      weightFrom: "8.8 kg (19\")",
      diameters: "18\" – 22\"",
      basePrice: 3396,
      image: "https://cdn.shopify.com/s/files/1/0571/2353/7032/files/rvrn-rv-ms808-chrome-transparent-wheel.png?v=1776215386",
      profile: "Ultra-Thin Multi-Spoke",
      brakes: "420mm Ultra-Large Caliper Cleared"
    }
  ];

  function getWheelByCode(code) {
    if (!code) return WHEEL_CATALOG[0];
    const c = code.toUpperCase();
    return WHEEL_CATALOG.find(w => w.code === c || w.rvrnCode === c || w.name.toUpperCase().includes(c)) || WHEEL_CATALOG[0];
  }

  return {
    getMakes,
    getModels,
    getYears,
    getTrims,
    checkFitment,
    setVehicle,
    getSelectedVehicle,
    getWheelCatalog: () => WHEEL_CATALOG,
    getWheelByCode,
    database: FITMENT_DATABASE
  };
})();

