const koreanbots = require('koreanbots')
const Extension = require('../../classes/Extension')

class KoreanbotsExtension extends Extension {
  constructor(client) {
    super(client, {
      name: 'koreanbots',
      description: 'Extension for Koreanbots'
    })
  }
  init() {
    if(typeof this._config.token !== 'string' || this._config.token.length < 1) return this._logger.error('Invalid token provided. Extension stopped.')

    this.bot = new koreanbots.MyBot(this._config.token)

    this.recentGuildCount = 0
    this.saveGuildCount()
    this.intervalID = setInterval(this.saveGuildCount.bind(this), this._config.saveInterval || 10000)
  }

  destroy() {
    clearInterval(this.intervalID)
  }

  saveGuildCount() {
    const guildCount = this._client.guilds.cache.size
    if(guildCount === this.recentGuildCount) return this._logger.debug('Guild Count same as before: ' + guildCount + ', Skipping.')

    if(typeof this._config.token !== 'string' || this._config.token.length < 1) return this._logger.error('Invalid token provided.')
    this.bot.update(guildCount)
      .then(() => {
        this._logger.log('Guild Count updated: ' + guildCount)
        this.recentGuildCount = guildCount
      })
      .catch((err) => this._logger.error(err))
  }
}

module.exports = KoreanbotsExtension
