'use strict';

const SaxonJS = require('saxon-js');

const xml = `<root>This is an example.</root>`;


let xsltResult = SaxonJS.transform(
    {
        stylesheetLocation: 'run-and-apply-identity.sef.json',
        stylesheetParams: {
            'xslt-uri': 'identity.xsl',
            'instance-text': xml
        },
        destination: 'document'
    }
).principalResult;

console.log(SaxonJS.serialize(xsltResult, { method: 'xml', indent: true }));
