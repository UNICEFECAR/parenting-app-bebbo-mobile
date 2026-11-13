import {diagnosticBreadcrumb, diagnosticError} from '../diagnostics';
test('manual errors retain actionable frames/class without child values, tokens or free text', () => {
  const original = new TypeError('Weight for child Fatima 12 kg; DOB 2024-01-01');
  original.stack = 'TypeError: Weight for child Fatima 12 kg\n    at saveProfile (https://example.test/app.bundle?token=secret:12:5)';
  const safe = diagnosticError(original);
  expect(safe.name).toBe('TypeError');
  expect(safe.stack).toContain('saveProfile');
  expect(safe.stack).not.toMatch(/Fatima|Weight|12 kg|2024-01-01|secret/);
  expect(original.message).toContain('Fatima');
});
test('breadcrumbs redact URLs, emails, profile UUIDs and dates', () => {
  const value = diagnosticBreadcrumb('API https://example.test?token=secret user@example.test 2024-01-01 1a1a1a1a-1234-1234-1234-123456789abc');
  expect(value).not.toMatch(/secret|user@|2024-01-01|123456789abc/);
  expect(diagnosticBreadcrumb('x'.repeat(1000))).toHaveLength(512);
});
