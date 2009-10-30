<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

	<!-- Output Params -->
	<xsl:output method="xml" media-type="text/xml" indent="yes"/>

	<xsl:template match="book">
		<!--  Eclipse Help processing instruction -->
		<xsl:processing-instruction name="NLS">TYPE="org.eclipse.help.toc"</xsl:processing-instruction>
		<!-- Root element (could have been bound to toc.xml#reference) -->
		<toc label="Ample SDK Reference" link_to="../com.aptana.ide.documentation/tocreference.xml#libraries">
			<topic label="Ample SDK" href="docs/index.html">
				<xsl:apply-templates select="node" />
			</topic>
		</toc>
	</xsl:template>

	<xsl:template match="node">
		<topic label="{@title}">
			<xsl:if test="@url">
				<xsl:attribute name="href"><xsl:value-of select="concat('docs/books/', @url)" /></xsl:attribute>
			</xsl:if>
			<xsl:apply-templates select="node" />
		</topic>
	</xsl:template>

</xsl:stylesheet>