<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

	<!-- Output Params -->
	<xsl:output method="xml" media-type="text/xml" indent="yes"/>

	<xsl:template match="book">
		<index>
			<xsl:apply-templates select="node" />
		</index>
	</xsl:template>

	<xsl:template match="node">
		<xsl:param name="url" select="@url"/>
		<xsl:param name="page" select="document(@url)" />
		<xsl:choose>
			<xsl:when test="$page[article]">
				<entry title="{normalize-space($page/article/title)}" href="{$url}" />
				<xsl:for-each select="$page/article/content/section">
					<entry title="- {normalize-space(title/locale[1])}" href="{$url}" />
				</xsl:for-each>
			</xsl:when>
			<xsl:when test="$page[object | element | interface]">
				<xsl:variable name="name" select="$page/*/@name" />
				<entry title="{normalize-space($name)}" href="{$url}"/>
				<xsl:for-each select="$page/*/members/*/*">
					<entry title="{normalize-space(@name)} ({$name})">
						<xsl:attribute name="href"><xsl:value-of select="$url" />#<xsl:value-of select="local-name()" />-<xsl:value-of select="@name" /></xsl:attribute>
					</entry>
				</xsl:for-each>
			</xsl:when>
			<xsl:otherwise />
		</xsl:choose>
		<xsl:apply-templates select="node" />
	</xsl:template>
</xsl:stylesheet>