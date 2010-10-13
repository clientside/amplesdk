<?xml version="1.0" ?>
<xsl:stylesheet version="1.0"
	xmlns="http://www.w3.org/1999/xhtml"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<!-- Output Params -->
	<xsl:output method="xml" media-type="text/xml" indent="yes"/>

	<xsl:template match="/">
		<xsl:apply-templates />
	</xsl:template>

	<xsl:template match="data">
		<table border="1">
			<thead>
				<tr>
					<td>@id</td>
					<td>key</td>
					<td>value</td>
				</tr>
			</thead>
			<tbody>
				<xsl:apply-templates select="entry"/>
			</tbody>
		</table>
	</xsl:template>

	<xsl:template match="entry">
		<tr>
			<td><xsl:value-of select="@id" /></td>
			<td><xsl:value-of select="key/text()" /></td>
			<td><xsl:value-of select="value/text()" /></td>
		</tr>
	</xsl:template>
</xsl:stylesheet>