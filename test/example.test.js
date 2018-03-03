describe('Example tests...', () => {
  test('true should equal true', () => {
    expect(true).toBe(true);
  });

  test('null should be null', () => {
    expect(null).toBe(null);
  });

  test('"react starter" should contain "start"', () => {
    expect('react starter').toContain('start');
  });
});
