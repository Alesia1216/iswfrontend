import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
// more info: https://www.npmjs.com/package/crypto-js

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

constructor() { }

  getHashSHA256(data: string): string {
    return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
  }
}
