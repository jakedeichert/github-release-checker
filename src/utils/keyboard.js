export const keyCodes = {
  enter: 13,
  space: 32,
};

export const wasKey = (e, ...codes) => codes.includes(e.keyCode);

/**
 * Listens for Spacebar or Enter key up events. This is useful when adding
 * click events to non-interactive elements. Important for accessibility.
 * @param {Function} cb - The function to call if either Enter or Space was pressed.
 */
export const onFocusKeyUp = cb => {
  return e => {
    if (wasKey(e, keyCodes.enter, keyCodes.space)) cb(e);
  };
};
