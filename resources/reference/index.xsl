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
				<xsl:variable name="abstract" select="normalize-space($page/*/abstract/locale[@xml:lang='en' or not(@xml:lang)])" />
				<entry title="{normalize-space($page/article/title)}" href="{$url}">
					<xsl:value-of select="substring($abstract, 0, 75)" />
					<xsl:if test="string-length($abstract) &gt; 75">...</xsl:if>
				</entry>
			</xsl:when>
			<xsl:when test="$page[object | class | element]">
				<xsl:variable name="name" select="$page/*/@name" />
				<xsl:variable name="abstract" select="normalize-space($page/*/abstract/locale[@xml:lang='en' or not(@xml:lang)])" />
				<entry title="{$name}" href="{$url}">
					<xsl:value-of select="substring($abstract, 0, 75)" />
					<xsl:if test="string-length($abstract) &gt; 75">...</xsl:if>
				</entry>
				<xsl:for-each select="$page/*/members/*/*">
					<xsl:variable name="abstract" select="normalize-space(description/locale[@xml:lang='en' or not(@xml:lang)])" />
					<entry title="{@name}">
						<xsl:attribute name="href"><xsl:value-of select="$url" />#<xsl:value-of select="local-name()" />-<xsl:value-of select="@name" /></xsl:attribute>
						(<xsl:value-of select="$name" />)
						<xsl:value-of select="substring($abstract, 0, 75)" />
						<xsl:if test="string-length($abstract) &gt; 75">...</xsl:if>
					</entry>
				</xsl:for-each>
			</xsl:when>
			<xsl:otherwise />
		</xsl:choose>
		<xsl:apply-templates select="node" />
	</xsl:template>
</xsl:stylesheet>