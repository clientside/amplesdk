<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

	<xsl:template match="article/content">
		<xsl:if test="section/title/locale">
			<h5><xsl:value-of select="$strings/overview" /></h5>
			<xsl:call-template name="toc">
				<xsl:with-param name="context" select="section" />
			</xsl:call-template>
		</xsl:if>
		<p>
			<xsl:apply-templates />
		</p>
	</xsl:template>

	<xsl:template name="toc">
		<xsl:param name="context" />
		<ul class="contents">
			<xsl:for-each select="$context">
				<li>
					<a>
						<xsl:attribute name="href">#<xsl:value-of select="generate-id(title)"/></xsl:attribute>
						<xsl:apply-templates select="title/locale"/>
					</a>
				</li>
				<xsl:call-template name="toc">
					<xsl:with-param name="context" select="section" />
				</xsl:call-template>
			</xsl:for-each>
		</ul>
	</xsl:template>

	<xsl:template match="section">
		<xsl:if test="title">
			<a name="{generate-id(title)}"></a>
			<h5>
				<xsl:apply-templates select="title/locale"/>
			</h5>
		</xsl:if>
		<p>
			<xsl:apply-templates />
		</p>
	</xsl:template>

</xsl:stylesheet>