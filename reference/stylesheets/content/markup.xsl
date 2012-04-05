<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

	<xsl:template match="title" />

	<xsl:template match="locale">
		<xsl:param name="default" select="parent::node()/locale[not(@xml:lang)]" />
		<xsl:param name="localized" select="parent::node()/locale[@xml:lang = $locale]" />
		<xsl:choose>
			<!-- If there is localized content -->
			<xsl:when test="$localized">
				<xsl:if test="$localized = .">
					<xsl:apply-templates />
				</xsl:if>
			</xsl:when>
			<!-- If there is content in fallback language (en) -->
			<xsl:when test="$default">
				<xsl:if test="$default = .">
					<span>
						<xsl:if test="$locale != 'en'">
							<xsl:attribute name="style">color:gray</xsl:attribute>
						</xsl:if>
						<xsl:apply-templates />
					</span>
				</xsl:if>
			</xsl:when>
			<!-- Otherwise output message on missing content -->
			<xsl:otherwise>
				<font style="color:red; font-style: italic">
					missing text from default locale
				</font>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!--
		Template: page.header
	-->
	<xsl:template name="page.header">
		<div class="head">
			<xsl:value-of select="$title" />
		</div>
		<script type="text/javascript">
			(function() {
				var oDocument	= window.parent ? window.parent.document : document;
				oDocument.title	= '<xsl:value-of select="$title" />';
			})();
		</script>
	</xsl:template>

	<!--
		Template: page.footer
	-->
	<xsl:template name="page.footer">
		<div class="foot">
			<xsl:copy-of select="$strings/copyright" />
		</div>
	</xsl:template>

	<!--
		Template: abstract
	-->
	<xsl:template match="abstract">
		<p>
			<xsl:apply-templates />
		</p>
	</xsl:template>

	<!--
		Template: link
	-->
	<xsl:template match="link">
		<xsl:choose>
			<xsl:when test="$name = text()">
				<b><xsl:value-of select="text()" /></b>
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when test="@type='element' or @type='class' or @type='interface' or @type='object'">
						<a href="{.}.xml" class="object">
							<xsl:value-of select="."/>
						</a>
					</xsl:when>
					<xsl:when test="@type='attribute' or @type='event' or @type='method' or @type='property' or @type='constant'">
						<xsl:choose>
							<xsl:when test="@href">
								<a href="../{translate(@href, ':', '/')}.xml#{@type}-{text()}">
									<xsl:value-of select="."/>
								</a>
							</xsl:when>
							<xsl:otherwise>
								<b>
									<xsl:value-of select="." />
								</b>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:when>
					<xsl:when test="@type='article'">
						<a href="{@href}">
							<xsl:value-of select="."/>
						</a>
					</xsl:when>
					<xsl:otherwise>
						<xsl:choose>
							<xsl:when test="starts-with(@href, '.')">
								<a href="{@href}">
									<xsl:value-of select="."/>
								</a>
							</xsl:when>
							<xsl:otherwise>
								<a href="{@href}" target="_blank">
									<xsl:attribute name="title">
										<xsl:if test="@title">
											<xsl:value-of select="concat(@title, ' - ')" />
										</xsl:if>
										<xsl:value-of select="$strings/link_external" />
									</xsl:attribute>
									<xsl:value-of select="."/>
								</a>
								<img src="../../../schemes/default/img/link_external.gif" width="16" height="11" align="absmiddle" style="margin-left: 5px" title="{$strings/link_external}"/>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!--
		Template: uri
	-->
	<xsl:template match="uri">
		<acronym>
			<xsl:attribute name="title"><xsl:value-of select="concat($strings/uri, ': ', text())" /></xsl:attribute>
			<xsl:value-of select="." />
		</acronym>
	</xsl:template>

	<!--
		Template: seealso
	-->
	<xsl:template match="seealso">
		<p class="headline"><xsl:value-of select="$strings/seealso" /></p>
		<ul>
			<xsl:for-each select="*">
				<li><xsl:apply-templates select="."/></li>
			</xsl:for-each>
		</ul>
	</xsl:template>

	<!--
		Template: examples
	-->
	<xsl:template match="examples">
		<xsl:if test="count(*)">
			<p class="headline"><xsl:value-of select="$strings/examples" /></p>
			<blockquote>
				<xsl:for-each select="example">
					<xsl:apply-templates />
				</xsl:for-each>
			</blockquote>
		</xsl:if>
	</xsl:template>

	<!--
		Template: warning
	-->
	<xsl:template match="warning">
		<p class="warning" title="{$strings/attention}!">
			<b class="attention"><xsl:value-of select="$strings/attention" />:</b><xsl:apply-templates />
		</p>
	</xsl:template>

	<!--
		Template: note
	-->
	<xsl:template match="note">
		<p class="note">
			<xsl:apply-templates />
		</p>
	</xsl:template>

	<!--
		Template: remarks
	-->
	<xsl:template match="remarks">
		<xsl:if test="remark">
			<p class="headline"><xsl:value-of select="$strings/remarks" /></p>
			<blockquote>
				<xsl:for-each select="remark">
					<xsl:apply-templates />
				</xsl:for-each>
			</blockquote>
		</xsl:if>
	</xsl:template>

	<!--
		Template: code
	-->
	<xsl:template match="code">
		<pre>
			<xsl:attribute name="class">
				<xsl:value-of select="'prettyprint lang-'" />
				<xsl:choose>
					<xsl:when test="@type = 'text/xml'">xml</xsl:when>
					<xsl:when test="@type = 'text/css'">css</xsl:when>
					<xsl:otherwise>js</xsl:otherwise>
				</xsl:choose>
			</xsl:attribute>
			<xsl:value-of select="."/>
		</pre>
	</xsl:template>

	<!--
		Template: b
	-->
	<xsl:template match="b">
		<b>
			<xsl:apply-templates />
		</b>
	</xsl:template>

	<!--
		Template: em
	-->
	<xsl:template match="em">
		<em>
			<xsl:apply-templates />
		</em>
	</xsl:template>

	<!--
		Template: p
	-->
	<xsl:template match="p">
		<p>
			<xsl:apply-templates />
		</p>
	</xsl:template>

	<!--
		Template: ul/ol/li
	-->
	<xsl:template match="ul|ol|li">
		<xsl:element name="{local-name()}">
			<xsl:apply-templates />
		</xsl:element>
	</xsl:template>

	<!--
		Template: br
	-->
	<xsl:template match="br">
		<br />
	</xsl:template>

	<!--
		Template: a
	-->
	<xsl:template match="a">
		<a href="{@href}" title="{@title}">
			<xsl:apply-templates />
		</a>
	</xsl:template>

	<!--
		Template: img
	-->
	<xsl:template match="img">
		<img src="{@src}">
			<xsl:if test="@align">
				<xsl:attribute name="align">
					<xsl:value-of select="@align"/>
				</xsl:attribute>
			</xsl:if>
		</img>
	</xsl:template>

</xsl:stylesheet>