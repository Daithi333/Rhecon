export class UserAuth {
  constructor(
    public userId: number,
    public userTypeId: number,
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

  get expiresAt() {
    return this._expiresAt;
  }

}
