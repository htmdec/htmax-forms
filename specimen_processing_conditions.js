window.JSONEditor.defaults.callbacks.autocomplete = {
    'search_powder': function (editor, input) {
        if (input.length < 4) {
            return [];
        }

        return restRequest({
            url: 'entry/search',
            method: 'GET',
            data: {
                query: input,
                field: 'formulationId',
                formId: '680aaacd152b337e6d25001f',
                limit: 20
            }
        })
    },
    'render_powder': function (editor, result, props) {
        // result is list of _id;label, split it into two parts
        const powder = result.split(';');
        return `<li ${props}> ${powder[1]} (id:${powder[0]})</li>`;
    },
    'get_powder_value': function (editor, result) {
        return result;
    }
};
Handlebars.registerHelper('getDensityRatio', function (measured, theoretical) {
    try {
        return (measured / theoretical).toFixed(4);
    } catch (e) {
        return 0.0;
    }
});
Handlebars.registerHelper('getDensity', function (dryMass, wetMass) {
    try {
        return (dryMass / (dryMass - wetMass) * 0.997).toFixed(4);
    } catch (e) {
        return 0.0;
    }
});
Handlebars.registerHelper('split', function (string, separator, index) {
    try {
        return string.split(separator)[index].trim();
    } catch (e) {
        return '';
    }
});
Handlebars.registerHelper('divide', function (a, b) {
    if (a === undefined || a === null ) {
        a = 0;
    }
    if (b === undefined || b === null ) {
        b = 1;
    }
    return a / b;
});
Handlebars.registerHelper('shrinkage', function (a, b, digits) {
    if (a === undefined || a === null ) {
        a = 0;
    }
    if (b === undefined || b === null ) {
        b = 0;
    }
    return ((b - a) / a * 100).toFixed(digits);
});
Handlebars.registerHelper('igsnTitle', function (sampleId) {
    if (sampleId === undefined || sampleId === null ) {
        return '';
    }
    const inputString = sampleId.split('_')[0];
    console.log(inputString);
     // Define map from element symbols to their compound forms
    const compoundMap = {
        Si: 'SiC',
        B: 'B4C',
        Al: 'Al2O3',
        Ti: 'TiC',
        Zr: 'ZrO2',
        // Add more as needed
    };

    // Parse the input into pairs of elements and percentages
    const parts = [];
    const unitRegex = /((?:[A-Za-z]+|\([^)]+\)))(\d+)/g;

    let materials = [];
    let percentages = [];

    // Use matchAll to find all non-overlapping matches of the unit pattern in the input string.
    // This returns an iterator, which we can spread into an array or loop through.
    const matches = [...inputString.matchAll(unitRegex)];

    // If no matches are found, return the original string as no transformation is possible.
    if (matches.length === 0) {
        return inputString;
    }

    // Iterate through each match to extract the material and percentage.
    for (const match of matches) {
        materials.push(compoundMap[match[1]] || match[1]);   // Capture Group 1: The material string
        percentages.push(match[2]); // Capture Group 2: The percentage string
    }
    console.log(materials, percentages);

    // Join the collected materials with a '+' sign.
    const materialsPart = materials.join('+');

    // Join the collected percentages with a ':' sign.
    const percentagesPart = percentages.join(':');

    return `Ceramic composite ${materialsPart} (${percentagesPart})`;
});
