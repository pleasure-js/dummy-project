module.exports = {
  debug: true,
  api: {
    debug: process.env.NODE_ENV === 'development',
    entitiesUri: '/schemas'
  }
}
