<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

	<!-- Output Params -->
	<xsl:output method="html" />

	<!-- Root Transformation -->
	<xsl:template match="book">
		<html>
			<head>
				<title></title>
				<link rel="stylesheet" type="text/css" href="../resources/css/book.css" />
				<script type="text/javascript" src="../resources/js/book.js" />
			</head>
			<body onselectstart="return false" onmousedown="return false;" scroll="auto">
				<ul class="root">
					<xsl:apply-templates select="node" />
				</ul>
			</body>
		</html>
	</xsl:template>

	<!-- Book Node Transformation -->
	<xsl:template match="node">
		<xsl:param name="id" select="generate-id(.)"/>
		<li>
			<xsl:choose>
				<xsl:when test="count(node)">
					<xsl:attribute name="onclick">onTocClick('<xsl:value-of select="$id"/>');event.cancelBubble=true;</xsl:attribute>
					<img align="absmiddle">
						<xsl:attribute name="src">
							<xsl:choose>
								<xsl:when test="@open = 'true'">../resources/img/open.gif</xsl:when>
								<xsl:otherwise>../resources/img/close.gif</xsl:otherwise>
							</xsl:choose>
						</xsl:attribute>
						<xsl:attribute name="id">toc_<xsl:value-of select="$id"/></xsl:attribute>
						<xsl:attribute name="style">
							<xsl:choose>
								<xsl:when test="position() = last()">background:url(../resources/img/L.gif);</xsl:when>
								<xsl:otherwise>background:url(../resources/img/T.gif);</xsl:otherwise>
							</xsl:choose>
						</xsl:attribute>
					</img>
					<img align="absmiddle">
						<xsl:attribute name="src">
							<xsl:choose>
								<xsl:when test="@url != ''">
									<xsl:choose>
										<xsl:when test="@open = 'true'">../resources/img/toc_open.gif</xsl:when>
										<xsl:otherwise>../resources/img/toc_close.gif</xsl:otherwise>
									</xsl:choose>
								</xsl:when>
								<xsl:otherwise>
									<xsl:choose>
										<xsl:when test="@open = 'true'">../resources/img/toc2_open.gif</xsl:when>
										<xsl:otherwise>../resources/img/toc2_close.gif</xsl:otherwise>
									</xsl:choose>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:attribute>
						<xsl:attribute name="id">img_<xsl:value-of select="$id"/></xsl:attribute>
					</img>
				</xsl:when>
				<xsl:otherwise>
					<img align="absmiddle">
						<xsl:attribute name="src">
							<xsl:choose>
								<xsl:when test="position() = last()">../resources/img/L.gif</xsl:when>
								<xsl:otherwise>../resources/img/T.gif</xsl:otherwise>
							</xsl:choose>
						</xsl:attribute>
					</img>
					<img src="../resources/img/toc_leaf.gif" align="absmiddle"/>
				</xsl:otherwise>
			</xsl:choose>
			<a target="content" onclick="if (this.href != 'javascript:void(0);') event.cancelBubble=true;">
				<xsl:choose>
					<xsl:when test="@url != ''">
						<xsl:attribute name="href">
							<xsl:value-of select="@url" />
						</xsl:attribute>
					</xsl:when>
					<xsl:otherwise>
						<xsl:choose>
							<xsl:when test="not(count(*))">
								<xsl:attribute name="style">color:#b0b0b0;</xsl:attribute>
							</xsl:when>
							<xsl:otherwise>
								<xsl:attribute name="href">javascript:void(0);</xsl:attribute>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:otherwise>
				</xsl:choose>
				<xsl:attribute name="title"><xsl:value-of select="@title" /></xsl:attribute>
				<xsl:value-of select="@title" />
			</a>
		</li>
		<xsl:if test="count(node)">
			<ul>
				<xsl:attribute name="id"><xsl:value-of select="$id"/></xsl:attribute>
				<xsl:attribute name="style">
					<xsl:if test="position() != last()">background: url('../resources/img/I.gif') repeat-y;</xsl:if>
					<xsl:choose>
						<xsl:when test="@open = 'true'">display: block;</xsl:when>
						<xsl:otherwise>display: none;</xsl:otherwise>
					</xsl:choose>
				</xsl:attribute>
				<xsl:apply-templates select="node" />
			</ul>
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>