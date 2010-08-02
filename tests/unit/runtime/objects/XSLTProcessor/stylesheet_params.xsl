<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns="http://www.w3.org/1999/xhtml"
	xmlns:x="http://www.w3.org/1999/xhtml">

	<!-- Output Params -->
	<xsl:output method="html" />

	<xsl:param name="string" />
	<xsl:param name="node" />

	<xsl:template match="x:ul">
		<table border="1">
			<tbody>
				<xsl:apply-templates />
				<xsl:apply-templates select="$node//x:li"/>
			</tbody>
		</table>
	</xsl:template>

	<xsl:template match="x:li">
		<tr>
			<td><xsl:value-of select="$string" /></td>
			<td><xsl:value-of select="text()" /></td>
		</tr>
	</xsl:template>
</xsl:stylesheet>