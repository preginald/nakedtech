const projectContent = require('./projectServices.json')
const { services } = require('./serviceCatalogue.js')

const contentByKey = Object.fromEntries(
  projectContent.map((content) => [content.serviceKey, content]),
)

module.exports = services
  .filter((service) => service.presentation.group === 'project')
  .map((service) => ({
    ...contentByKey[service.serviceKey],
    catalogueService: service,
    slug: service.serviceKey,
    name: service.name,
    category: service.serviceType,
    cardDescription: service.description,
    typicalInvestment: service.pricing.displayText,
    priceLine: service.presentation.priceLine,
    iconPath: service.presentation.iconPath,
  }))
