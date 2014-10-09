LocationFinderNVS
=================

The locations finder has been developed on top of the one that already exists on novartis.com.

The only difference is that it uses SVG instead of Flash for the map.

Known issues: 
 - Google Maps: Getting the direction to a specific place is not working
 - Google Maps API v2 is used (we should migrate to v3, but the entire app needs to be re-developed)
 - IE9 compatibility issues for the JvectorMap … FIXED

Please note:
 - The locations.js file is coming from an external provider. 
   We should find a solution to get this file. 
   In this source code, we're assuming the locations.js file is already stored in our server. 
 - The code is not well commented and some clean-up needs to be done. 
