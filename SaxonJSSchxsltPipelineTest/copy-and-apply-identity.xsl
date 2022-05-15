<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="#all"
    version="3.0">

	<xsl:param name="xslt-uri" as="xs:string?" select="()"/>

	<xsl:param name="instance-uri" as="xs:string?" select="()"/>

	<xsl:param name="xslt-text" as="xs:string?" select="()"/>

	<xsl:param name="instance-text" as="xs:string?" select="()"/>

	<xsl:import href="identity.xsl"/>

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

</xsl:stylesheet>