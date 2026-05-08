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
        return result.igsn;
    }
};

Handlebars.registerHelper('igsn_version', function() {
    const sample_id = this.Sample_ID || '';
    const version = this.version || '';
    return `${sample_id}_v${version}`;
});