<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<!-- Imports -->
	<xsl:import href="content/markup.xsl" />
	<xsl:import href="content/object.xsl" />
	<xsl:import href="content/article.xsl" />

	<!-- Output Params -->
	<xsl:output method="html" media-type="text/html"/>

	<!-- Global Params -->
	<xsl:param name="locale" select="'en'" />

	<xsl:param name="strings" select="document(concat('locale/', $locale, '/strings.xml'))/strings" />
	<xsl:param name="name" select="./*/@name"/>
	<xsl:param name="title">
		<xsl:choose>
			<xsl:when test="local-name(./*) = 'article'">
				<xsl:value-of select="article/title" />
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when test="local-name(*) = 'object'"><xsl:value-of select="$strings/title_object" /></xsl:when>
					<xsl:when test="local-name(*) = 'element'"><xsl:value-of select="$strings/title_element" /></xsl:when>
					<xsl:when test="local-name(*) = 'interface'"><xsl:value-of select="$strings/title_interface" /></xsl:when>
				</xsl:choose>
				<xsl:value-of select="concat(' ', $name)" />
			</xsl:otherwise>
		</xsl:choose>
	</xsl:param>

	<!-- Root Transformation -->
	<xsl:template match="/">
		<html>
			<head>
				<title></title>
				<!-- Prettify -->
				<link type="text/css" href="../../../schemes/default/css/3rdparty/prettify/prettify.css" rel="stylesheet" />
				<script type="text/javascript" src="../../../js/3rdparty/prettify/prettify.js"></script>

				<!--  -->
				<link type="text/css" href="../../../schemes/default/css/content/markup.css" rel="stylesheet" />
				<link type="text/css" href="../../../schemes/default/css/content/object.css" rel="stylesheet" />
				<script type="text/javascript" src="../../../js/content/object.js"></script>
			</head>
			<body>
				<xsl:call-template name="page.header" />
				<div class="main">
					<xsl:apply-templates />
				</div>
				<xsl:call-template name="page.footer" />
			</body>
		</html>
	</xsl:template>

	<xsl:template match="object|element|interface">
		<xsl:apply-templates select="warning"/>
		<xsl:apply-templates select="abstract"/>
		<xsl:apply-templates select="@extends"/>
		<xsl:apply-templates select="implements" />
		<xsl:apply-templates select="members" />
		<xsl:apply-templates select="remarks" />
		<xsl:apply-templates select="examples" />
	</xsl:template>

	<xsl:template match="article">
		<xsl:apply-templates />
	</xsl:template>

</xsl:stylesheet>