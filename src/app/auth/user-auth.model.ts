export class UserAuth {
  constructor(
    public userId: number,
    public email: string,
    private _token: string,
    private _expiresAt: Date
  ) {}

  get token() {
    if (!this._expiresAt || this._expiresAt <= new Date()) {
      return null;
    }
    return this._token;
  }

  get expiryDate() {
    return this._expiresAt;
  }

}
