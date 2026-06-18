Handlebars.registerHelper('replaceAll', function (string, search, replacement) {
    return (string !== undefined && string !== null) ? string.replaceAll(search, replacement) : '';
});

Handlebars.registerHelper('split', function (string, separator, index) {
    try {
        return string.split(separator)[index].trim();
    } catch (e) {
        return '';
    }
});

window.JSONEditor.defaults.callbacks.autocomplete = {
    'search_deposition': function (editor, input) {
        if (input.length < 3) return [];
        return restRequest({
            url: 'deposition',
            method: 'GET',
            data: { q: input, limit: 10 }
        }).then(function (results) {
            return results.filter(function (result) {
                try {
                    const localId = result.metadata.alternateIdentifiers.find(
                        (id) => id.alternateIdentifierType.toLowerCase() === 'local'
                    );
                    return localId && localId.alternateIdentifier.startsWith('Sheet_');
                } catch (e) {
                    return false;
                }
            });
        });
    },
    'render_deposition': function (editor, result, props) {
        try {
            const localId = result.metadata.alternateIdentifiers.find(
                (id) => id.alternateIdentifierType.toLowerCase() === 'local'
            );
            return `<li ${props}>${result.igsn} (localId: ${localId.alternateIdentifier})</li>`;
        } catch (e) {
            return `<li ${props}>${result.igsn} (title: ${result.metadata.titles[0]['title']})</li>`;
        }
    },
    'get_deposition_value': function (editor, result) {
        try {
            const localId = result.metadata.alternateIdentifiers.find(
                (id) => id.alternateIdentifierType.toLowerCase() === 'local'
            );
            return `${result.igsn} - ${result._id} - ${localId.alternateIdentifier}`;
        } catch (e) {
            return `${result.igsn} - ${result._id} - no localId`;
        }
    }
};