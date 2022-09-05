module.exports = {
  connector: './layer0',
  routes: './layer0/routes.ts',
  includeFiles: { 'toPrefetchList.json': true },
  backends: {
    storyblok: {
      domainOrIp: 'a.storyblok.com',
      hostHeader: 'a.storyblok.com',
      disableCheckCert: true,
    },
  },
}
