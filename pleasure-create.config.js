const path = require('path')
const empty = s => {
  return /^[\s]*$/.test(s)
}

module.exports = {
  prompts (dest) {
    return [{
      name: 'projectName',
      default: path.basename(dest),
      validate (s) {
        return empty(s) ? `Enter the project name` : ''
      }
    }]
  }
}
