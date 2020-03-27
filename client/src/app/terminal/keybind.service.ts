import { Injectable } from '@angular/core';

/**
 * A class that gives the keybinds for certain tasks
 */
@Injectable({
  providedIn: 'root'
})
export class KeybindService {
  /**
   * The map that connects the keybinding value with what triggers it
   */
  private keybinding: {[lookup: number]: Keytype};

  constructor() {
    // TODO setup population
    this.keybinding = {};
    this.setKeybinding(KeybindValue.CTRL_C, {keyCode: 67, ctrlKey: true});
  }

  public setKeybinding(key: KeybindValue, value: Keytype) {
    this.keybinding[key] = value;
  }


  getKeybindingFilter(lookup: KeybindValue) {
    return (event: KeyboardEvent) => {
      let value = this.keybinding[lookup];
      const keyCode = event.keyCode || event.which;
      return keyCode == value.keyCode
        && event.altKey == !!value.altKey
        && event.ctrlKey == !!value.ctrlKey
        && event.metaKey == !!value.metaKey
        && event.shiftKey == !!value.shiftKey;
    }
  }

}

class Keytype {
  keyCode: number;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
}

export enum KeybindValue {
  CTRL_C
}