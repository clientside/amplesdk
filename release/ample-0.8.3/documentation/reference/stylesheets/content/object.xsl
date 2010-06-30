<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:exslt="http://exslt.org/common">


	<!--  -->
	<xsl:param name="implementation-node-set">
		<xsl:choose>
			<!-- EXSLT way -->
			<xsl:when test="function-available('exslt:node-set')">
				<xsl:value-of select="'exslt'" />
			</xsl:when>
			<!-- MSXSL way -->
			<xsl:when test="function-available('msxsl:node-set')">
				<xsl:value-of select="'msxsl'" />
			</xsl:when>
			<!-- OTHERWISE -->
			<xsl:otherwise>
				<xsl:value-of select="''" />
			</xsl:otherwise>
		</xsl:choose>
	</xsl:param>

	<!--xsl:param name="show_inherited" select="local-name(/*) = 'object'" /-->
	<xsl:param name="show_inherited" select="true()" />
	<!--
	<xsl:param name="show_core" select="true()" />
 	-->

	<!--  -->
	<xsl:template match="@extends">
		<p class="headline"><xsl:value-of select="$strings/title_extends" /></p>
		<blockquote>
			<a href="../{substring-before(., ':')}/{substring-after(., ':')}.xml">
				<xsl:value-of select="substring-after(., ':')" />
			</a>
		</blockquote>
	</xsl:template>

	<xsl:template match="implements">
		<xsl:if test="*">
			<p class="headline"><xsl:value-of select="$strings/impl_title" /></p>
			<blockquote>
				<xsl:if test="interface">
					<xsl:value-of select="substring-before($strings/impl_descr, '{name}')" />
						<b><xsl:value-of select="$name"/></b>
					<xsl:value-of select="substring-after($strings/impl_descr, '{name}')" />
					<xsl:for-each select="interface">
						<xsl:if test="position()!=1">, </xsl:if>
						<a href="../{substring-before(@name, ':')}/{substring-after(@name, ':')}.xml">
							<xsl:value-of select="substring-after(@name, ':')"/>
						</a>
					</xsl:for-each>
					<xsl:text>.</xsl:text>
				</xsl:if>
			</blockquote>
		</xsl:if>
	</xsl:template>

	<xsl:template name="extend">
		<xsl:param name="document" />
		<xsl:param name="extends" select="document(concat('../../books/ample/', substring-before($document/*/@extends, ':'), '/', substring-after($document/*/@extends, ':'), '.xml'))"/>
		<xsl:if test="$extends">
			<xsl:if test="$extends/*/@extends">
				<xsl:call-template name="extend">
					<xsl:with-param name="document" select="$extends" />
				</xsl:call-template>
			</xsl:if>
			<xsl:call-template name="extend-members">
				<xsl:with-param name="document" select="$extends" />
			</xsl:call-template>
		</xsl:if>
		<!--
		<xsl:for-each select="$document/*/implements/interface">
			<xsl:call-template name="extend-members">
				<xsl:with-param name="document" select="document(concat('../../books/ample/', substring-before(@name, ':'), '/', substring-after(@name, ':'), '.xml'))" />
			</xsl:call-template>
		</xsl:for-each>
		 -->
	</xsl:template>

	<xsl:template name="extend-members">
		<xsl:param name="document" />
		<xsl:copy-of select="$document/*/members/*[not(local-name(.) = 'constants')]" />
	</xsl:template>

	<!--xsl:template name="implement">
		<xsl:param name="document" />
		<xsl:for-each select="$document/*/implements/interface">
			<xsl:call-template name="inherit">
				<xsl:with-param name="extends" select="$document/*/@name" />
			</xsl:call-template>
		</xsl:for-each>
	</xsl:template-->

	<!--
		Template: Members
	-->
	<xsl:template match="members">
		<!-- Own members -->
		<xsl:param name="members" select="*[*]" />

		<!-- Inherited members -->
		<xsl:param name="members_inherited">
			<xsl:if test="/*/@extends">
				<xsl:call-template name="extend">
					<xsl:with-param name="document" select="/" />
				</xsl:call-template>
			</xsl:if>
		</xsl:param>

		<xsl:choose>
			<!-- EXSLT way -->
			<xsl:when test="$implementation-node-set = 'exslt'">
				<xsl:call-template name="members">
					<xsl:with-param name="members" select="$members | exslt:node-set($members_inherited)/*[*]" />
				</xsl:call-template>
			</xsl:when>
			<!-- MSXSL way -->
			<xsl:when test="$implementation-node-set = 'msxsl'">
				<xsl:call-template name="members">
					<xsl:with-param name="members" select="$members | msxsl:node-set($members_inherited)/*[*]" />
				</xsl:call-template>
			</xsl:when>
			<!-- OTHERWISE -->
			<xsl:otherwise>
				<xsl:call-template name="members">
					<xsl:with-param name="members" select="$members" />
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="members">

		<xsl:param name="members" />

		<p class="headline"><xsl:value-of select="$strings/members" /></p>
		<blockquote>
			<p>
				<xsl:value-of select="substring-before($strings/members_description, '{name}')" />
				<b><xsl:value-of select="$name" /></b>
				<xsl:value-of select="substring-after($strings/members_description, '{name}')" />
			</p>
			<p>
				<input type="checkbox" id="show_inherited" onclick="onShowInheritedClick(this)">
					<xsl:choose>
						<xsl:when test="$implementation-node-set = '' or not(/*/@extends)">
							<xsl:attribute name="disabled">
								<xsl:value-of select="'disabled'" />
							</xsl:attribute>
						</xsl:when>
						<xsl:otherwise>
							<xsl:if test="$show_inherited">
								<xsl:attribute name="checked">
									<xsl:value-of select="'checked'" />
								</xsl:attribute>
							</xsl:if>
						</xsl:otherwise>
					</xsl:choose>
				</input>
				<xsl:text> </xsl:text>
				<label for="show_inherited" class="show_inherited">
					<xsl:value-of select="$strings/members_show_inherited" />
				</label>
				<!--
				<br />
				<input type="checkbox" id="show_core" onclick="onShowCoreClick(this)">
					<xsl:choose>
						<xsl:when test="$implementation-node-set = ''">
							<xsl:attribute name="disabled">
								<xsl:value-of select="'disabled'" />
							</xsl:attribute>
						</xsl:when>
						<xsl:otherwise>
							<xsl:if test="$show_core">
								<xsl:attribute name="checked">
									<xsl:value-of select="'checked'" />
								</xsl:attribute>
							</xsl:if>
						</xsl:otherwise>
					</xsl:choose>
				</input>
				<xsl:text> </xsl:text>
				<label for="show_core" class="show_inherited">
					<xsl:value-of select="$strings/members_show_inherited" />
				</label>
				 -->
			</p>
			<table id="eTableMembers" cellPadding="0" cellSpacing="0" border="0" class="members">
				<thead>
					<tr class="members-head">
						<th colSpan="2">
							<table cellPadding="0" cellSpacing="0" border="0" width="100%">
							<tbody>
								<tr>
									<td id="eTableMembersHeader"></td>
									<td id="eTableMembersMenu" class="members-menu">
										<a href="javascript:;" class="members-menu-close" onclick="onMenuClick(this)" title="{$strings/collapse_expand}"></a>
									</td>
								</tr>
							</tbody>
							</table>
						</th>
					</tr>
				</thead>
				<tbody>
					<xsl:if test="not($show_inherited)">
						<xsl:attribute name="class">hide-inherited</xsl:attribute>
					</xsl:if>
					<tr>
						<td valign="top" class="members-tabs" height="100%">
							<div style="padding: 5px; padding-top: 0px;"><b><xsl:value-of select="$strings/show" /></b></div>
							<table cellPadding="0" cellSpacing="0" border="0" width="100%">
							<tbody>
								<xsl:call-template name="members.tabs">
									<xsl:with-param name="members" select="$members" />
								</xsl:call-template>
							</tbody>
							</table>
						</td>
						<td valign="top">
							<div id="eTableMembersPane" class="members-pane members-pane-close">
								<xsl:call-template name="members.panes">
									<xsl:with-param name="members" select="$members" />
								</xsl:call-template>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</blockquote>
	</xsl:template>

	<xsl:template name="members.tabs">
		<xsl:param name="members" />

		<xsl:if test="$members/attribute">
			<xsl:call-template name="members.tabs.tab">
				<xsl:with-param name="member_type" select="'attributes'" />
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="$members/property">
			<xsl:call-template name="members.tabs.tab">
				<xsl:with-param name="member_type" select="'properties'" />
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="$members/method">
			<xsl:call-template name="members.tabs.tab">
				<xsl:with-param name="member_type" select="'methods'" />
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="$members/event">
			<xsl:call-template name="members.tabs.tab">
				<xsl:with-param name="member_type" select="'events'" />
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="$members/constant">
			<xsl:call-template name="members.tabs.tab">
				<xsl:with-param name="member_type" select="'constants'" />
			</xsl:call-template>
		</xsl:if>
	</xsl:template>

	<xsl:template name="members.tabs.tab">
		<xsl:param name="member_type" />
		<tr>
			<td id="eTab_{$member_type}" class="members-tab members-tab-normal" tabIndex="0"
				onmouseover="this.className=this.className.replace('normal', 'hover')"
				onmouseout="this.className=this.className.replace('hover', 'normal')"
				onclick="onTabClick('{$member_type}');"
				onkeypress="if (event.keyCode == 13) onTabClick('{$member_type}');">
				<xsl:choose>
					<xsl:when test="$member_type = 'constants'"><xsl:value-of select="$strings/constants" /></xsl:when>
					<xsl:when test="$member_type = 'properties'"><xsl:value-of select="$strings/properties" /></xsl:when>
					<xsl:when test="$member_type = 'methods'"><xsl:value-of select="$strings/methods" /></xsl:when>
					<xsl:when test="$member_type = 'events'"><xsl:value-of select="$strings/events" /></xsl:when>
					<xsl:when test="$member_type = 'attributes'"><xsl:value-of select="$strings/attributes" /></xsl:when>
				</xsl:choose>
			</td>
		</tr>
	</xsl:template>

	<xsl:template name="members.panes">
		<xsl:param name="members" />
		<xsl:call-template name="attributes">
			<xsl:with-param name="members" select="$members" />
		</xsl:call-template>
		<xsl:call-template name="properties">
			<xsl:with-param name="members" select="$members" />
		</xsl:call-template>
		<xsl:call-template name="methods">
			<xsl:with-param name="members" select="$members" />
		</xsl:call-template>
		<xsl:call-template name="events">
			<xsl:with-param name="members" select="$members" />
		</xsl:call-template>
		<xsl:call-template name="constants">
			<xsl:with-param name="members" select="$members" />
		</xsl:call-template>

		<!-- Display first available tab -->
		<xsl:choose>
			<xsl:when test="$members/attribute">
				<script type="text/javascript">onTabClick('attributes');</script>
			</xsl:when>
			<xsl:when test="$members/property">
				<script type="text/javascript">onTabClick('properties');</script>
			</xsl:when>
			<xsl:when test="$members/method">
				<script type="text/javascript">onTabClick('methods');</script>
			</xsl:when>
			<xsl:when test="$members/event">
				<script type="text/javascript">onTabClick('events');</script>
			</xsl:when>
			<xsl:when test="$members/constant">
				<script type="text/javascript">onTabClick('constants');</script>
			</xsl:when>
		</xsl:choose>
	</xsl:template>

	<!--
		Template: Attributes
	-->
	<xsl:template name="attributes">
		<xsl:param name="members" />
		<table id="ePane_attributes" cellPadding="0" cellSpacing="0" border="2" width="100%" class="members-list" style="display:none">
		<thead>
			<tr>
				<td><b><xsl:value-of select="$strings/attr_name" /></b></td>
				<td nowrap="yes"><b><xsl:value-of select="$strings/attr_ronly" /></b></td>
				<td width="100%"><b><xsl:value-of select="$strings/attr_descr" /></b></td>
			</tr>
		</thead>
		<tbody>
			<xsl:apply-templates select="$members/attribute">
				<xsl:sort data-type="text" select="@name"/>
			</xsl:apply-templates>
		</tbody>
		</table>
	</xsl:template>

	<xsl:template match="attribute">
		<tr>
			<!-- Set class if member is inherited -->
			<xsl:if test="not(local-name(/*[1]) = 'object') and not(local-name(/*[1]) = 'element')">
				<xsl:attribute name="class"><xsl:text>member-inherited</xsl:text></xsl:attribute>
			</xsl:if>
			<xsl:attribute name="id">attribute-<xsl:value-of select="@name" /></xsl:attribute>
			<td nowrap="yes">
				<xsl:choose>
					<xsl:when test="values/*">
						<a href="javascript:void(0)">
							<xsl:attribute name="onclick">var o = document.getElementById('e_<xsl:value-of select="@name" />'); if (o.style.display == '') o.style.display='none'; else {o.style.display='';o.previousSibling.scrollIntoView(true);}</xsl:attribute>
							<xsl:value-of select="@name" />
						</a>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="@name" />
					</xsl:otherwise>
				</xsl:choose>
				<!-- Flag if member is inherited -->
				<xsl:if test="not(local-name(/*[1]) = 'object') and not(local-name(/*[1]) = 'element')">
					<xsl:text> *</xsl:text>
				</xsl:if>
			</td>
			<td nowrap="yes">
				<xsl:choose>
					<xsl:when test="@readonly">
						<xsl:value-of select="@readonly" />
					</xsl:when>
					<xsl:otherwise>
						false
					</xsl:otherwise>
				</xsl:choose>
			</td>
			<td><xsl:apply-templates select="description"/></td>
		</tr>
		<xsl:if test="values/*">
			<tr style="display: none;">
				<xsl:attribute name="id">e_<xsl:value-of select="@name"/></xsl:attribute>
				<td colSpan="3">
					<xsl:value-of select="$strings/values_title" />
					<p style="padding-left: 10px; padding-right: 5px;">
						<table cellPadding="0" cellSpacing="0" border="0" class="inner">
						<thead>
							<td width="116"><b><xsl:value-of select="$strings/values_value" /></b></td>
							<td><b><xsl:value-of select="$strings/values_descr" /></b></td>
						</thead>
						<xsl:for-each select="values/value">
						<tr>
							<td>
								<i>
									<xsl:if test="@name = parent::*/parent::*/@default">
										<xsl:attribute name="style">text-decoration:underline</xsl:attribute>
										<xsl:attribute name="title"><xsl:value-of select="$strings/values_default" /></xsl:attribute>
									</xsl:if>
									<xsl:value-of select="@name"/>
								</i>
							</td>
							<td><xsl:apply-templates select="description"/></td>
						</tr>
						</xsl:for-each>
						</table>
					</p>
				</td>
			</tr>
		</xsl:if>
	</xsl:template>

	<!--
		Template: Properties
	-->
	<xsl:template name="properties">
		<xsl:param name="members" />
		<table id="ePane_properties" cellPadding="0" cellSpacing="0" border="0" width="100%" class="members-list" style="display: none">
		<thead>
			<tr>
				<td><b><xsl:value-of select="$strings/properties_name" /></b></td>
				<td><b><xsl:value-of select="$strings/properties_type" /></b></td>
				<td><b><xsl:value-of select="$strings/properties_ronly" /></b></td>
				<td width="100%"><b><xsl:value-of select="$strings/properties_descr" /></b></td>
			</tr>
		</thead>
		<tbody>
			<xsl:apply-templates select="$members/property">
				<xsl:sort data-type="text" select="@name"/>
			</xsl:apply-templates>
		</tbody>
		</table>
	</xsl:template>

	<xsl:template match="property">
		<tr>
			<!-- Set class if member is inherited -->
			<xsl:if test="not(local-name(/*[1]) = 'object') and not(local-name(/*[1]) = 'element')">
				<xsl:attribute name="class"><xsl:text>member-inherited</xsl:text></xsl:attribute>
			</xsl:if>
			<xsl:attribute name="id">property-<xsl:value-of select="@name" /></xsl:attribute>
			<td nowrap="yes">
				<xsl:choose>
					<xsl:when test="values/*">
						<a href="javascript:void(0)">
							<xsl:attribute name="onclick">var o = document.getElementById('e_<xsl:value-of select="@name" />'); if (o.style.display == '') o.style.display='none'; else {o.style.display='';o.previousSibling.scrollIntoView(true);}</xsl:attribute>
							<xsl:value-of select="@name" />
						</a>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="@name" />
					</xsl:otherwise>
				</xsl:choose>
				<!-- Flag if member is inherited -->
				<xsl:if test="not(local-name(/*[1]) = 'object') and not(local-name(/*[1]) = 'element')">
					<xsl:text> *</xsl:text>
				</xsl:if>
			</td>
			<td nowrap="yes">
				<xsl:choose>
					<xsl:when test="starts-with(@type, 'AML')">
						<a href="../runtime/{@type}.xml" class="object"><xsl:value-of select="@type" /></a>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="@type" />
					</xsl:otherwise>
				</xsl:choose>
			</td>
			<td nowrap="yes">
				<xsl:choose>
					<xsl:when test="@readonly">
						<xsl:value-of select="@readonly" />
					</xsl:when>
					<xsl:otherwise>
						false
					</xsl:otherwise>
				</xsl:choose>
			</td>
			<td><xsl:apply-templates select="description"/></td>
		</tr>
		<xsl:if test="values/*">
			<tr style="display: none;">
				<xsl:attribute name="id">e_<xsl:value-of select="@name"/></xsl:attribute>
				<td colSpan="4">
					<xsl:value-of select="$strings/values_title" />
					<p style="margin-left: 10px; margin-right: 5px;">
						<table cellPadding="0" cellSpacing="0" border="0" width="96%" class="inner">
						<thead>
							<td><b><xsl:value-of select="$strings/values_value" /></b></td>
							<td><b><xsl:value-of select="$strings/values_descr" /></b></td>
						</thead>
						<xsl:for-each select="values/value">
						<tr>
							<td nowrap="yes">
								<i>
									<xsl:if test="@name = parent::*/parent::*/@default">
										<xsl:attribute name="style">text-decoration:underline</xsl:attribute>
										<xsl:attribute name="title"><xsl:value-of select="$strings/values_default" /></xsl:attribute>
									</xsl:if>
									<xsl:value-of select="@name"/>
								</i>
							</td>
							<td><xsl:apply-templates select="description"/></td>
						</tr>
						</xsl:for-each>
						</table>
					</p>
				</td>
			</tr>
		</xsl:if>
	</xsl:template>

	<!--
		Template: Constants
	-->
	<xsl:template name="constants">
		<xsl:param name="members" />
		<table id="ePane_constants" cellPadding="0" cellSpacing="0" border="0" width="100%" class="members-list" style="display:none">
		<thead>
			<tr>
				<td><b><xsl:value-of select="$strings/constants_name" /></b></td>
				<td><b><xsl:value-of select="$strings/constants_value" /></b></td>
				<td width="100%"><b><xsl:value-of select="$strings/constants_descr" /></b></td>
			</tr>
		</thead>
		<tbody>
			<xsl:apply-templates select="$members/constant" />
		</tbody>
		</table>
	</xsl:template>

	<xsl:template match="constant">
		<tr>
			<xsl:attribute name="id">constant-<xsl:value-of select="@name" /></xsl:attribute>
			<td nowrap="yes">
				<xsl:value-of select="@name" />
			</td>
			<td nowrap="yes"><xsl:value-of select="@value" /></td>
			<td><xsl:apply-templates select="description"/></td>
		</tr>
	</xsl:template>

	<!--
		Template: Methods
	-->
	<xsl:template name="methods">
		<xsl:param name="members" />
		<table id="ePane_methods" cellPadding="0" cellSpacing="0" border="0" width="100%" class="members-list" style="display:none">
		<thead>
			<tr>
				<td><b><xsl:value-of select="$strings/methods_name" /></b></td>
				<td><b><xsl:value-of select="$strings/methods_returns" /></b></td>
				<td width="100%"><b><xsl:value-of select="$strings/methods_descr" /></b></td>
			</tr>
		</thead>
		<tbody>
			<xsl:apply-templates select="$members/method">
				<xsl:sort data-type="text" select="@name"/>
			</xsl:apply-templates>
		</tbody>
		</table>
	</xsl:template>

	<xsl:template match="method">
		<tr>
			<!-- Set class if member is inherited -->
			<xsl:if test="not(local-name(/*[1]) = 'object') and not(local-name(/*[1]) = 'element')">
				<xsl:attribute name="class"><xsl:text>member-inherited</xsl:text></xsl:attribute>
			</xsl:if>
			<xsl:attribute name="id">method-<xsl:value-of select="@name" /></xsl:attribute>
			<td nowrap="yes">
				<a href="javascript:void(0)">
					<xsl:attribute name="onclick">var o = document.getElementById('e_<xsl:value-of select="@name" />'); if (o.style.display == '') o.style.display='none'; else {o.style.display='';o.previousSibling.scrollIntoView(true);}</xsl:attribute>
					<xsl:value-of select="@name" />
				</a>
				<!-- Flag if member is inherited -->
				<xsl:if test="not(local-name(/*[1]) = 'object') and not(local-name(/*[1]) = 'element')">
					<xsl:text> *</xsl:text>
				</xsl:if>
			</td>
			<td nowrap="yes">
				<xsl:choose>
					<xsl:when test="starts-with(@type, 'AML')">
						<a href="../runtime/{@type}.xml" class="object"><xsl:value-of select="@type" /></a>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="@type" />
					</xsl:otherwise>
				</xsl:choose>
			</td>
			<td><xsl:apply-templates select="description"/></td>
		</tr>
		<tr style="display: none;">
			<xsl:attribute name="id">e_<xsl:value-of select="@name"/></xsl:attribute>
			<td colspan="3">
				<xsl:value-of select="$strings/methods_syntax" />
				<p style="padding-left:10px;">
					object.<b><xsl:value-of select="@name" />(</b>
					<xsl:for-each select="arguments/argument">
						<xsl:if test="(not(preceding-sibling::*[1]/@required) or preceding-sibling::*[1]/@required='true' or position()=1) and @required='false'">
							<b>[</b>
						</xsl:if>
						<i><xsl:value-of select="@name"/></i>
						<xsl:if test="position()!=last()"><b>, </b></xsl:if>
						<xsl:if test="position()=last() and @required='false'"><b>]</b></xsl:if>
					</xsl:for-each><b>)</b>
				</p>
				<xsl:if test="arguments/argument">
					<xsl:value-of select="$strings/methods_args" />
					<p style="padding-left:10px;padding-right:5px;">
						<table cellPadding="0" cellSpacing="0" border="0" class="inner">
						<thead>
							<td><b><xsl:value-of select="$strings/methods_arg_name" /></b></td>
							<td><b><xsl:value-of select="$strings/methods_arg_type" /></b></td>
							<td title="{$strings/methods_arg_o_title}"><b><xsl:value-of select="$strings/methods_arg_o" /></b></td>
							<td width="100%"><b><xsl:value-of select="$strings/methods_arg_descr" /></b></td>
						</thead>
						<xsl:for-each select="arguments/argument">
						<tr>
							<td nowrap="yes"><i><xsl:value-of select="@name"/></i></td>
							<td nowrap="yes">
								<xsl:choose>
									<xsl:when test="starts-with(@type, 'AML')">
										<a href="../runtime/{@type}.xml" class="object"><xsl:value-of select="@type" /></a>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of select="@type" />
									</xsl:otherwise>
								</xsl:choose>
							</td>
							<td nowrap="yes">
								<xsl:choose>
									<xsl:when test="@required='false'">
										<font color="green"><xsl:value-of select="$strings/methods_arg_opt" /></font>
									</xsl:when>
									<xsl:otherwise>
										<font color="#a40101"><xsl:value-of select="$strings/methods_arg_req" /></font>
									</xsl:otherwise>
								</xsl:choose>
							</td>
							<td><xsl:apply-templates select="description"/></td>
						</tr>
						</xsl:for-each>
						</table>
					</p>
				</xsl:if>
			</td>
		</tr>
	</xsl:template>

	<!--
		Template: Events
	-->
	<xsl:template name="events">
		<xsl:param name="members" />
		<table id="ePane_events" cellPadding="0" cellSpacing="0" border="0" width="100%" class="members-list" style="display:none">
		<thead>
			<tr>
				<td><b><xsl:value-of select="$strings/event_name" /></b></td>
				<td title="{$strings/event_bubbleable_title}"><b><xsl:value-of select="$strings/event_bubbleable" /></b></td>
				<td title="{$strings/event_cancelable_title}"><b><xsl:value-of select="$strings/event_cancelable" /></b></td>
				<td><b><xsl:value-of select="$strings/event_interface" /></b></td>
				<td width="100%"><b><xsl:value-of select="$strings/event_descr" /></b></td>
			</tr>
		</thead>
		<tbody>
			<xsl:apply-templates select="$members/event">
				<xsl:sort data-type="text" select="@name"/>
			</xsl:apply-templates>
		</tbody>
		</table>
	</xsl:template>

	<xsl:template match="event">
		<tr>
			<!-- Set class if member is inherited -->
			<xsl:if test="not(local-name(/*[1]) = 'object') and not(local-name(/*[1]) = 'element')">
				<xsl:attribute name="class"><xsl:text>member-inherited</xsl:text></xsl:attribute>
			</xsl:if>
			<xsl:attribute name="id">event-<xsl:value-of select="@name" /></xsl:attribute>
			<td nowrap="yes">
				<xsl:value-of select="@name" />
				<!-- Flag if member is inherited -->
				<xsl:if test="not(local-name(/*[1]) = 'object') and not(local-name(/*[1]) = 'element')">
					<xsl:text> *</xsl:text>
				</xsl:if>
			</td>
			<td nowrap="yes" align="center">
				<xsl:choose>
					<xsl:when test="@bubbles = 'true'">+</xsl:when>
					<xsl:otherwise>-</xsl:otherwise>
				</xsl:choose>
			</td>
			<td nowrap="yes" align="center">
				<xsl:choose>
					<xsl:when test="@cancelable = 'true'">+</xsl:when>
					<xsl:otherwise>-</xsl:otherwise>
				</xsl:choose>
			</td>
			<td nowrap="yes">
				<a href="../runtime/AML{@group}.xml"><xsl:value-of select="@group" /></a>
			</td>
			<td><xsl:apply-templates select="description"/></td>
		</tr>
	</xsl:template>

	<!-- Template: description -->
	<xsl:template match="description">
		<xsl:apply-templates />
	</xsl:template>

</xsl:stylesheet>