// Handlebars helpers
Handlebars.registerHelper('nextVersionForIGSN', function (sampleId) {
  if (!sampleId) return 1;
  // Extract IGSN from Sample_ID (format: "entryId;igsn" or just "igsn")
  const igsn = sampleId.includes(';') ? sampleId.split(';')[1] : sampleId;

  // Query the number of existing entries for this IGSN
  let count = 0;
  try {
    const response = fetch(`/api/v1/entry/search?field=Sample_ID&query=${igsn}&formId=material_properties&limit=1000`, {
      method: 'GET'
    }).then(r => r.json()).then(data => {
      return (data.results || []).length;
    });
    count = response || 0;
  } catch (e) {
    console.warn('Could not fetch version count:', e);
  }

  return count + 1;
});