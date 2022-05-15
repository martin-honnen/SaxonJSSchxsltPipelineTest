const SaxonJS = require('saxon-js');

const xml = '<root>This is a test</root>';

console.log(xml);

const identityXslt = `<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  version="3.0"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  xmlns:saxon="http://saxon.sf.net/"
  exclude-result-prefixes="#all"
  expand-text="yes">

	<xsl:mode on-no-match="shallow-copy"/>

	<xsl:template match="/" name="xsl:initial-template">
		<xsl:next-match/>
		<xsl:comment>Run with {system-property('xsl:product-name')} {system-property('xsl:product-version')} {system-property('Q{http://saxon.sf.net/}platform')} at {saxon:timestamp()}</xsl:comment>
	</xsl:template>

</xsl:stylesheet>`;

const xslt = `<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="#all"
    version="3.0">

	<xsl:param name="xslt-uri" as="xs:string?" select="()"/>

	<xsl:param name="instance-uri" as="xs:string?" select="()"/>

	<xsl:param name="xslt-text" as="xs:string?" select="()"/>

	<xsl:param name="instance-text" as="xs:string?" select="()"/>

	<xsl:output indent="yes"/>

	<xsl:variable name="transformed-xslt">
		<xsl:variable name="xslt"
            select="if (empty($xslt-uri))
                    then parse-xml($xslt-text)
                    else if (doc-available($xslt-uri))
                    then doc($xslt-uri)
                    else doc(resolve-uri($xslt-uri, base-uri(/)))"/>
		<xsl:copy-of select="$xslt/node()"/>
	</xsl:variable>

	<xsl:template name="xsl:initial-template">
		<xsl:sequence
            select="transform(map {
            'stylesheet-node' : $transformed-xslt,
            'source-node' : parse-xml($instance-text)
            })?output"/>
	</xsl:template>

	<xsl:template match="/">
		<xsl:sequence
            select="transform(map {
                      'stylesheet-node' : $transformed-xslt,
                      'source-node' : .
                   })?output"/>
	</xsl:template>

</xsl:stylesheet>`;

const result = SaxonJS.XPath.evaluate(`
  transform(map {
   'stylesheet-text' : $xslt,
   'initial-template' : QName('http://www.w3.org/1999/XSL/Transform', 'initial-template'),
   'stylesheet-params' : map {
     QName('', 'xslt-text') : $xslt-text,
     QName('', 'instance-text') : $instance-text
   }
  })?output`,
  [],
  {
	params: {
		'xslt': xslt,
		'xslt-text': identityXslt,
		'instance-text': xml
	}
	}
);