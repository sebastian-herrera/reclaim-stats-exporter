export type RouteType = 'planner' | 'focus';

const ROUTE_PATTERNS: Record<RouteType, RegExp> = {
  planner: /^\/planner(\/|$)/,
  focus: /^\/focus(\/|$)/,
};

export function isValidRoute(path: string): boolean {
  const normalized = path.replace(/\/+$/, '');
  return Object.values(ROUTE_PATTERNS).some((pattern) =>
    pattern.test(normalized),
  );
}

export function getRouteType(path: string): RouteType | null {
  const normalized = path.replace(/\/+$/, '');
  for (const [route, pattern] of Object.entries(ROUTE_PATTERNS)) {
    if (pattern.test(normalized)) {
      return route as RouteType;
    }
  }
  return null;
}

let currentRoute: RouteType | null = null;

export function getCurrentRoute(): RouteType | null {
  return currentRoute;
}

export function updateCurrentRoute(path: string): void {
  currentRoute = getRouteType(path);
}

export function createLocationChangeListener(
  onRouteChange?: (route: RouteType | null) => void,
): () => void {
  const handler = (event: CustomEvent) => {
    const { url } = event.detail;
    const path = new URL(url).pathname;
    const previousRoute = currentRoute;
    updateCurrentRoute(path);

    if (currentRoute !== previousRoute && onRouteChange) {
      onRouteChange(currentRoute);
    }
  };

  window.addEventListener('wxt:locationchange', handler as EventListener);
  updateCurrentRoute(window.location.pathname);

  return () => {
    window.removeEventListener('wxt:locationchange', handler as EventListener);
  };
}
