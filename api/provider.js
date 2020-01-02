module.exports = {
  discriminator: 'user',
  model: {
    schema: {
      companyName: {
        type: String,
        index: true
      }
    }
  }
}
