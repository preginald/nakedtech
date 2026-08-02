const { services } = require('./serviceCatalogue.js')

module.exports = services
  .filter((service) => service.presentation.group === 'problem')
  .map((service) => ({
    id: service.serviceKey,
    path: service.path,
    navTitle: service.presentation.navTitle,
    navDescription: service.presentation.navDescription,
    navGroup: service.presentation.navGroup,
    label: service.name,
    title: service.presentation.title,
    description: service.description,
    price: service.pricing.displayText,
    cta: service.presentation.cta,
    iconPath: service.presentation.iconPath,
  }))
