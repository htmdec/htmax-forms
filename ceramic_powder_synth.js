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
                field: 'sampleId',
                formId: '66afac8fbcc722774ce5e6e5',
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

Handlebars.registerHelper('suffixCounter', function(count) {
    try {
        if (count > 1 && count < 10) {
            return `_${count}`;
        } else {
            return '';
        }
    } catch (e) {
        return '';
    }
});

Handlebars.registerHelper('processName', function (process) {
    if (process === "CH4") {
        return "Gas carburization in 10% CH4/Bal Ar";
    } else if (process === "NH3") {
        return "Gas nitridation in 10% NH3/Bal Ar";
    } else {
        return process;
    }
});

Handlebars.registerHelper('split', function (string, separator, index) {
    try {
        return string.split(separator)[index].trim();
    } catch (e) {
        return '';
    }
});

Handlebars.registerHelper('sum', function (array, field) {
   // sum the field of the array of objects
   try {
       return array.reduce((acc, obj) => acc + obj[field], 0);
   } catch (e) {
        return 0;
   }
});
