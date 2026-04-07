import { describe, expect, it } from 'vitest';
import { getRouteType, isValidRoute } from '../router';

describe('Route Matchers', () => {
  describe('isValidRoute', () => {
    it('should return true for /planner', () => {
      expect(isValidRoute('/planner')).toBe(true);
    });

    it('should return true for /focus', () => {
      expect(isValidRoute('/focus')).toBe(true);
    });
  });

  describe('getRouteType', () => {
    it('should return "planner" for /planner', () => {
      expect(getRouteType('/planner')).toBe('planner');
    });

    it('should return "focus" for /focus', () => {
      expect(getRouteType('/focus')).toBe('focus');
    });

    it('should return null for unknown routes', () => {
      expect(getRouteType('/')).toBeNull();
      expect(getRouteType('/settings')).toBeNull();
    });

    it('should handle trailing slashes', () => {
      expect(getRouteType('/planner/')).toBe('planner');
      expect(getRouteType('/focus/')).toBe('focus');
    });

    it('should handle paths with subpaths', () => {
      expect(getRouteType('/planner/123')).toBe('planner');
      expect(getRouteType('/focus/abc')).toBe('focus');
    });
  });
});
