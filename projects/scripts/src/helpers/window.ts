export const isTopWindow = (window: Window) => {
  try {
    return window === window.top;
  } catch {
    return false;
  }
}
