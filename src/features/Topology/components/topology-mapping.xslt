<?xml version="1.0" encoding="UTF-8"?>
<!--
  Maps the topology.xml file exported by topology.vue to a normalized
  topology(1).xml document. The transform preserves device attributes,
  port attributes, and optional edge elements.
-->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="xml" encoding="UTF-8" indent="yes"/>
  <xsl:strip-space elements="*"/>

  <xsl:template match="/">
    <topology>
      <xsl:apply-templates select="topology/device"/>
      <xsl:if test="topology/edge">
        <connections>
          <xsl:apply-templates select="topology/edge"/>
        </connections>
      </xsl:if>
    </topology>
  </xsl:template>

  <xsl:template match="device">
    <device>
      <xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
      <xsl:attribute name="type"><xsl:value-of select="@type"/></xsl:attribute>
      <xsl:attribute name="name"><xsl:value-of select="@name"/></xsl:attribute>
      <xsl:attribute name="ip"><xsl:value-of select="@ip"/></xsl:attribute>
      <xsl:if test="@protocolPort">
        <xsl:attribute name="protocolPort"><xsl:value-of select="@protocolPort"/></xsl:attribute>
      </xsl:if>
      <xsl:if test="@username">
        <xsl:attribute name="username"><xsl:value-of select="@username"/></xsl:attribute>
      </xsl:if>
      <xsl:if test="@password">
        <xsl:attribute name="password"><xsl:value-of select="@password"/></xsl:attribute>
      </xsl:if>
      <xsl:if test="@version">
        <xsl:attribute name="version"><xsl:value-of select="@version"/></xsl:attribute>
      </xsl:if>
      <position>
        <xsl:attribute name="x"><xsl:value-of select="@x"/></xsl:attribute>
        <xsl:attribute name="y"><xsl:value-of select="@y"/></xsl:attribute>
      </position>
      <ports>
        <xsl:apply-templates select="port"/>
      </ports>
    </device>
  </xsl:template>

  <xsl:template match="port">
    <port>
      <xsl:attribute name="name"><xsl:value-of select="@name"/></xsl:attribute>
      <xsl:attribute name="speed"><xsl:value-of select="@speed"/></xsl:attribute>
      <xsl:attribute name="pid"><xsl:value-of select="@pid"/></xsl:attribute>
      <xsl:if test="@side">
        <xsl:attribute name="side"><xsl:value-of select="@side"/></xsl:attribute>
      </xsl:if>
    </port>
  </xsl:template>

  <xsl:template match="edge">
    <connection>
      <xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
      <xsl:attribute name="source"><xsl:value-of select="@source"/></xsl:attribute>
      <xsl:attribute name="sourcePort"><xsl:value-of select="@sourceHandle"/></xsl:attribute>
      <xsl:attribute name="target"><xsl:value-of select="@target"/></xsl:attribute>
      <xsl:attribute name="targetPort"><xsl:value-of select="@targetHandle"/></xsl:attribute>
    </connection>
  </xsl:template>

</xsl:stylesheet>
