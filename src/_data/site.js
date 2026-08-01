const siteContent = require('./siteContent.json')
const { serviceAreas } = require('./serviceCatalogue.js')

module.exports = {
  ...siteContent,
  serviceAreas: serviceAreas.map(
    (area) => `${area.locality} ${area.region} ${area.postcode}`,
  ),
}
