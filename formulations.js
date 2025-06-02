Handlebars.registerHelper('sampleRoot', function(compounds, mass) {
  // Helper function to extract chemical symbol (first capital + optional lowercase)
  if (!compounds) return '';
  if (!mass) return '';

  const elementToSymbol = {
    SiC: "Si",
    B4C: "B",
    TaC: "Ta",
    NbC: "Nb",
    HfC: "Hf",
    TiC: "Ti",
    Silicon: "Si",
    Boron: "B",
    Tantalum: "Ta",
    Niobium: "Nb",
    Hafnium: "Hf",
    Titanium: "Ti",
    // Add more as needed
  };
  
  // Extract the element name (assumed to be the first word)
  const getSymbol = (compoundName) => {
    const firstWord = compoundName.split(' ')[0];
    return elementToSymbol[firstWord] || firstWord[0]; // fallback: first letter
  };

  const massParts = mass.split(':'); // e.g., ["80", "20"]
  if (!compounds) return '';
  if (compounds.length !== massParts.length) {
    return 'Mismatch between number of compounds and mass parts';
  }

  return compounds.map((item, index) => {
    const symbol = getSymbol(item.compound);
    return `${symbol}${massParts[index]}`;
  }).join('');
});
Handlebars.registerHelper('binderRoot', function(compounds) {
  if (!compounds) return '';
  const binderMap = {
    PDADMAC: 1,
    PEG: 2,
    PAA: 3,
    PVA: 4
  };

  // Use a Set to collect unique binder numbers
  const presentBinders = new Set();

  compounds.forEach(item => {
    const binderValue = binderMap[item.compound];
    if (binderValue) {
      presentBinders.add(binderValue);
    }
  });

  // Convert Set to sorted array and join with "."
  return Array.from(presentBinders).sort((a, b) => a - b).join('.');
});
