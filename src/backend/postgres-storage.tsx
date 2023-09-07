import type { JSONValue } from "replicache";
import type { Storage } from "replicache-transaction";
import { delEntry, getEntries, getEntry, putEntry } from "./data";
import type { Executor } from "./pg";

// Implements the Storage interface required by replicache-transaction in terms
// of our Postgres database.
export class PostgresStorage implements Storage {
  private _version: number;
  private _executor: Executor;
  private _spaceId: string;

  constructor(version: number, executor: Executor, spaceId: string) {
    this._version = version;
    this._executor = executor;
    this._spaceId = spaceId;
  }

  putEntry(key: string, value: JSONValue): Promise<void> {
    return putEntry(this._executor, key, value, this._version, this._spaceId);
  }

  async hasEntry(key: string): Promise<boolean> {
    const v = await this.getEntry(key);
    return v !== undefined;
  }

  getEntry(key: string): Promise<JSONValue | undefined> {
    return getEntry(this._executor, key, this._spaceId);
  }

  getEntries(fromKey: string): AsyncIterable<readonly [string, JSONValue]> {
    return getEntries(this._executor, fromKey, this._spaceId);
  }

  delEntry(key: string): Promise<void> {
    return delEntry(this._executor, key, this._version, this._spaceId);
  }
}
