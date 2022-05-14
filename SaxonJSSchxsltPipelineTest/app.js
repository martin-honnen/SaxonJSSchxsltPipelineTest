'use strict';

const SaxonJS = require('saxon-js');

const xml = `<root>This is an example.</root>`;

const schematron = `<schema xmlns="http://purl.oclc.org/dsdl/schematron" queryBinding="xslt3">
    <pattern>
        <rule context="root">
            <assert test="@*">root has no attributes.</assert>
            <report test=". = 'This is an example.'">root element has value 'This is an example.'</report>
        </rule>
    </pattern>
</schema>`;

let svrlResult = SaxonJS.transform(
    {
        stylesheetLocation: 'run-pipeline-for-svrl-and-apply-to-schema.sef.json',
        stylesheetParams: {
            'schema-text': schematron,
            'instance-text': xml
        },
        destination: 'document'
    }
).principalResult;

console.log(SaxonJS.serialize(svrlResult, { method: 'xml', indent: true }));
