const STARTER_LIST = [

  ["Cylindrical mass 50g", 50, 0],
  ["Levelling pad assembly", 10, 0],
  ["Stopper fork assembly", 10, 0],
  ["Reagent bottle", 1, 0],

  ["Amber glass", 5, 0],
  ["Alumina crucible 30 ml", 3, 0],
  ["Porcelain mortar", 6, 0],
  ["Porcelain mortar pestle (Small)", 4, 0],
  ["Porcelain mortar pestle (Medium)", 1, 0],
  ["Porcelain mortar pestle (Large)", 5, 0],
  ["Plastic container for microscope", 48, 0],
  ["Silicon or PVC rubber mold", 10, 0],
  ["Cast iron support ring", 8, 0],
  ["Mechanical spring balance", 2, 0],
  ["Friction board", 22, 0],
  ["Metal support rods", 149, 0],
  ["Triple beam balance", 18, 1],
  ["Test tube (16 mm x 150 mm dimensions)", 11, 1],
  ["Erlenmeyer flask / Conical flask (250 mL capacity)", 4, 0],
  ["Amber reagent bottle / Reagent bottle with a ground glass stopper (24/29 joint size)", 5, 0],

  ["Tripod Stand", 4, 0],
  ["Mesh 60g", 5, 0],
  ["Mesh 35g", 5, 0],
  ["Mesh 5g", 5, 0],
  ["Mesh 120g", 5, 0],
  ["Mesh 10g", 5, 0],
  ["Mesh 230g", 4, 0],
  ["Convention tank", 20, 0],
  ["Microscope", 3, 1],
  ["Laboratory pipette", 1, 0],
  ["Glass-straight-shank", 8, 0],
  ["Test paper - red", 3, 0],
  ["Test paper - blue", 2, 0],
  ["Beaker 100 ml", 10, 0],
  ["Beaker 500 ml", 1, 0],
  ["Beaker 1000 ml", 2, 0],
  ["Sterglass 50 ml", 5, 0],
  ["Glass alcohol burner", 4, 0],
  ["Wire gauze set", 5, 0],
  ["Pocket balance", 2, 0],
  ["Light source (single slit)", 10, 0],
  ["Heat conductivity apparatus", 20, 0],
  ["Test tube rack", 3, 0],
  ["Scikit mechanics storage case 001", 5, 0],

  ["Ball case", 5, 0],
  ["Digital timer assembly", 5, 0],
  ["Steel spherical ball 12.7 mm", 10, 0],
  ["Steel spherical ball 25 mm", 10, 0],
  ["Pad switch assembly", 5, 0],
  ["Solenoid assembly", 5, 0],

  ["Manual Vacuum Pump", 40, 0],
  ["Strobe Light", 5, 0],
  ["Ripple tank", 20, 0],
  ["Haloagen tube laser light", 20, 0],
  ["Power adapter and power cord for generator strobscope", 20, 0],
  ["Sporadic device set glass plate", 20, 0],
  ["Tripod Base", 20, 0],
  ["Removable Legs", 20, 0],
  ["Scikit mechanics case 003", 20, 0],
  ["Scikit mechanics case 002", 2, 0],
  ["Scikit basic case", 12, 0],

  ["Optical Bench Set (stand)", 3, 0],
  ["Support Rod & Temperature Sensor", 10, 0],
  ["Ticker Time Set", 10, 0],
  ["Filter Paper", 3, 0],
  ["Sedimentator", 45, 0],
  ["Motor Input 6V-12V Generator Output", 30, 0],
  ["Heating Element", 36, 0],
  ["Support Rod() & Temperature Sensor (2)", 6, 0],   // same name as above, so I added (2)

  ["Cork", 52, 0],
  ["Paraffin Pan", 3, 0],
  ["Cylindrical Glass", 5, 0],
  ["Glass Stirring Rods", 17, 0],
  ["Borosilicate Glass", 33, 0],
  ["Measuring Cup 2 Table Spoon", 5, 0],
  ["Dual-Ended Laboratory Spatula", 5, 0],
  ["Glass Culture Tube", 10, 0],
  ["Stainless Crucibe Tong", 4, 0],
  ["Glass Dropper", 4, 0],
  ["Spatula Porcelain", 1, 0],
  ["Glass Slide", 42, 0],
  ["Broken Glass Slide", 21, 0],
  ["Glass Pipette", 3, 0]
];


if (Object.keys(data.equipment).length === 0) {
  STARTER_LIST.forEach(([name, t, b]) => {
    data.equipment[slug(name)] = { name: name, t: t, b: b };
  });

  try {
    persist();         
  } catch (e) {}

  notify("equipment");  
}