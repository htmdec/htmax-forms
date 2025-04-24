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
                formId: 'PLACEHOLDER',
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
    const input = sampleId.split('_')[0];
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
    const regex = /([A-Z][a-z]*)(\d+)/g;
    let match;

    while ((match = regex.exec(input)) !== null) {
        const element = match[1];
        const percentage = parseInt(match[2], 10);
        parts.push({ element, percentage });
    }

    if (parts.length === 0) {
        return "Invalid composition format";
    }

    // Build the compound names and ratio string
    const compoundNames = parts.map(p => compoundMap[p.element] || p.element);
    const ratios = parts.map(p => p.percentage).join(':');

    return `Ceramic composite ${compoundNames.join('+')} (${ratios})`;
});
