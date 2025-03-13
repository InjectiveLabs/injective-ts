import AccountManager from './../AccountManager.js'

export default class BaseTrezorTransport {
  private accountManager: AccountManager | null = null

  async connect() {
    return Promise.resolve()
  }

  async getAccountManager(): Promise<AccountManager> {
    if (!this.accountManager) {
      this.accountManager = new AccountManager()
    }

    return this.accountManager
  }
}
