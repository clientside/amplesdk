<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

	<!-- Output Params -->
	<xsl:output method="xml" media-type="text/xml" indent="yes"/>

	<xsl:template match="book">
		<!-- Root element (could have been bound to toc.xml#reference) -->
		<javascript>
			<!-- global ample object -->
			<class type="Global">
				<properties>
					<property name="ample" type="AMLDocument" scope="static" access="read">
						<description>
							Represents the Ample SDK document.
						</description>
						<xsl:call-template name="browsers" />
					</property>
				</properties>
			</class>
			<!-- classes -->
			<xsl:apply-templates select="//node[@title='JavaScript technologies']" />
		</javascript>
	</xsl:template>

	<xsl:template match="node">
		<xsl:param name="url" select="@url"/>
		<xsl:param name="root" select="document(@url)/*" />
		<xsl:param name="singleton" select="$root/@singleton = 'true'" />
		<xsl:if test="local-name($root) = 'object'">
			<!-- class description -->
			<class type="{$root/@name}">
				<xsl:choose>
					<xsl:when test="$root/@extends">
						<xsl:attribute name="superclass">
							<xsl:choose>
								<xsl:when test="contains($root/@extends, ':')">
									<xsl:value-of select="substring-after($root/@extends, ':')" />
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="$root/@extends" />
								</xsl:otherwise>
							</xsl:choose>
						</xsl:attribute>
					</xsl:when>
					<xsl:otherwise>Object</xsl:otherwise>
				</xsl:choose>
				<description>
					<xsl:value-of select="normalize-space($root/abstract/locale[not(@xml:lang)])" />
				</description>
				<!-- constructors>
					<constructor scope="instance" type="{$root/@name}"/>
				</constructors-->
				<!-- browser support -->
				<xsl:call-template name="browsers" />
				<!-- properties (properties / constants) -->
				<xsl:if test="$root/members/properties[property] | $root/members/constants[constant]">
					<properties>
						<xsl:for-each select="$root/members/properties/property">
							<property name="{@name}" type="{@type}">
								<xsl:attribute name="scope">
									<xsl:choose>
										<xsl:when test="$singleton">static</xsl:when>
										<xsl:otherwise>instance</xsl:otherwise>
									</xsl:choose>
								</xsl:attribute>
								<xsl:attribute name="access">
									<xsl:choose>
										<xsl:when test="@readonly = 'true'">read</xsl:when>
										<xsl:otherwise>read-write</xsl:otherwise>
									</xsl:choose>
								</xsl:attribute>
								<description>
									<xsl:value-of select="normalize-space(description/locale[not(@xml:lang)])" />
								</description>
								<!-- browser support -->
								<xsl:call-template name="browsers" />
							</property>
						</xsl:for-each>
						<xsl:for-each select="$root/members/constants/constant">
							<property name="{@name}" type="Number" scope="static" access="read">
								<description>
									<xsl:value-of select="normalize-space(description/locale[not(@xml:lang)])" />
								</description>
								<!-- browser support -->
								<xsl:call-template name="browsers" />
							</property>
						</xsl:for-each>
					</properties>
				</xsl:if>
				<!-- methods -->
				<xsl:if test="$root/members/methods[method]">
					<methods>
						<xsl:for-each select="$root/members/methods/method">
							<method name="{@name}">
								<xsl:attribute name="scope">
									<xsl:choose>
										<xsl:when test="$singleton">static</xsl:when>
										<xsl:otherwise>instance</xsl:otherwise>
									</xsl:choose>
								</xsl:attribute>
								<description>
									<xsl:value-of select="normalize-space(description/locale[not(@xml:lang)])" />
								</description>
								<!-- browser support -->
								<xsl:call-template name="browsers" />
								<!-- parameters -->
								<parameters>
									<xsl:for-each select="arguments/argument">
										<parameter name="{@name}" type="{@type}">
											<xsl:attribute name="usage">
												<xsl:choose>
													<xsl:when test="@required = 'true'">required</xsl:when>
													<xsl:otherwise>optional</xsl:otherwise>
												</xsl:choose>
											</xsl:attribute>
											<description>
												<xsl:value-of select="normalize-space(description/locale[not(@xml:lang)])" />
											</description>
										</parameter>
									</xsl:for-each>
								</parameters>
								<!-- returns -->
								<return-types>
									<return-type type="{@type}"/>
								</return-types>
							</method>
						</xsl:for-each>
					</methods>
				</xsl:if>
			</class>
		</xsl:if>
		<xsl:apply-templates select="node" />
	</xsl:template>

	<xsl:template name="browsers">
		<browsers>
			<browser platform="IE" version="5.5+"/>
			<browser platform="Mozilla" version="1.6+"/>
			<browser platform="Firefox" version="1.0+"/>
			<browser platform="Opera" version="9.1+" />
			<browser platform="Safari" version="3.0+" />
			<browser platform="Chrome" version="0.1+" />
			<browser platform="Konqueror" version="3.5+" />
		</browsers>
	</xsl:template>

</xsl:stylesheet>