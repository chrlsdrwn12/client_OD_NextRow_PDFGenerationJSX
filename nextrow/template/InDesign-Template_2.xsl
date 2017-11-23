<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:template match="table">
    <xsl:variable name="maxRows" select="count(tbody/tr)" />
    <xsl:variable name="maxColumns">
        <xsl:for-each select="tbody/tr">
            <xsl:sort select="sum(td/@colspan) + count(td[not(@colspan)])" data-type="number"/>
            <xsl:if test="position() = last()">
                <xsl:value-of select="sum(td/@colspan) + count(td[not(@colspan)])"/>
            </xsl:if>
        </xsl:for-each>
    </xsl:variable>
    <table xmlns:aid5='http://ns.adobe.com/AdobeInDesign/5.0/' xmlns:aid="http://ns.adobe.com/AdobeInDesign/4.0/" aid:table="table" aid5:tablestyle='specifications-table'>
        <xsl:attribute name="aid:trows">
            <xsl:value-of select="$maxRows"/>
        </xsl:attribute>
        <xsl:attribute name="aid:tcols">
            <xsl:value-of select="$maxColumns"/>
        </xsl:attribute>
        <xsl:if test="$maxColumns = 1">
            <xsl:for-each select="tbody/tr/td">
                <Cell aid:table="cell" aid:crows="1" aid:ccols="1" aid:ccolwidth="204.333">
                    <xsl:apply-templates />
                </Cell>   
            </xsl:for-each>
        </xsl:if>
        <xsl:if test="$maxColumns = 2">
            <xsl:for-each select="tbody/tr">
                <xsl:for-each select="td">
                    <xsl:if test="position() = 1">
                        <Cell aid:table="cell" aid:crows="1" aid:ccols="1" aid:ccolwidth="70.5">
                            <xsl:apply-templates />
                        </Cell>
                      </xsl:if>

                      <xsl:if test="position() = last()">
                        <Cell aid:table="cell" aid:crows="1" aid:ccols="1" aid:ccolwidth="134">
                            <xsl:apply-templates />
                        </Cell>
                      </xsl:if>
                </xsl:for-each>    
            </xsl:for-each>
        </xsl:if>
    </table>
</xsl:template>

<xsl:template match="table/tbody/tr/td/p">
    <p_td>
        <xsl:apply-templates select="@*|node()"/>
    </p_td>
</xsl:template>

<xsl:template match="specHeading/h3">
    <xsl:apply-templates select="@*|node()"/>
</xsl:template>

<xsl:template match="specSubHeading1/p">
    <xsl:apply-templates select="@*|node()"/>
</xsl:template>

<xsl:template match="specSubHeading2/p">
    <xsl:apply-templates select="@*|node()"/>
</xsl:template>

<xsl:template match="specSubHeading3/p">
    <xsl:apply-templates select="@*|node()"/>
</xsl:template>

<xsl:template match="specSubHeading4/p">
    <xsl:apply-templates select="@*|node()"/>
</xsl:template>

<xsl:template match="specSubHeading5/p">
    <xsl:apply-templates select="@*|node()"/>
</xsl:template>

<xsl:template match="specSubHeading6/p">
    <xsl:apply-templates select="@*|node()"/>
</xsl:template>

<xsl:template match="specSubHeading7/p">
    <xsl:apply-templates select="@*|node()"/>
</xsl:template>

<xsl:template match="specSubHeading8/p">
    <xsl:apply-templates select="@*|node()"/>
</xsl:template>

<xsl:template match="specSubHeading9/p">
    <xsl:apply-templates select="@*|node()"/>
</xsl:template>

<xsl:template match="specSubHeading10/p">
    <xsl:apply-templates select="@*|node()"/>
</xsl:template>

<xsl:template match="specSubHeading11/p">
    <xsl:apply-templates select="@*|node()"/>
</xsl:template>

<xsl:template match="specSubHeading12/p">
    <xsl:apply-templates select="@*|node()"/>
</xsl:template>

<xsl:template match="specSubHeading13/p">
    <xsl:apply-templates select="@*|node()"/>
</xsl:template>

<xsl:template match="specSubHeading14/p">
    <xsl:apply-templates select="@*|node()"/>
</xsl:template>

<xsl:template match="pageOneFooter/p">
    <p3>
        <xsl:apply-templates select="@*|node()"/>
    </p3>
</xsl:template>

<xsl:template match="pageTwoFooter/p[1]">
    <footer_contact>
        <xsl:apply-templates select="@*|node()"/>
    </footer_contact>
</xsl:template>

<xsl:template match="pageTwoFooter/p[2]">
    <pageTwoFooterp>
        <xsl:apply-templates select="@*|node()"/>
    </pageTwoFooterp>
</xsl:template>

<xsl:template match="idealAppTextHeader/p">
    <xsl:apply-templates select="@*|node()"/>
</xsl:template>

<xsl:template match="sidenote1/p[1]">
    <idealAppPara>
        <xsl:apply-templates select="@*|node()"/>
    </idealAppPara>
</xsl:template>

<!-- fallback rule -->
<xsl:template match="@*|node()">
    <xsl:copy>
        <xsl:apply-templates select="@*|node()"/>
    </xsl:copy>
</xsl:template>
</xsl:stylesheet>