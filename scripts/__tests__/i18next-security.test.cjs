const test = require('node:test');
const assert = require('node:assert/strict');
const i18next = require('i18next');

test('untrusted failed loads and language codes do not grow i18next caches without bound', async () => {
  const instance = i18next.createInstance();
  instance.use({
    type: 'backend',
    init() {},
    read(_language, _namespace, done) { done(new Error('Unavailable test resource'), false); },
  });
  await instance.init({initAsync: false, lng: 'en', fallbackLng: false, maxRetries: 0});

  for (let index = 0; index < 1100; index++) {
    await new Promise(resolve => {
      instance.services.backendConnector.load(['en'], [`missing-${index}`], () => resolve());
    });
    const language = `en-x-${index.toString(36).padStart(4, '0')}`;
    instance.services.languageUtils.toResolveHierarchy(language);
    instance.services.pluralResolver.getRule(language);
  }

  assert.ok(Object.keys(instance.services.backendConnector.state).length <= 1000);
  assert.ok(Object.keys(instance.services.languageUtils.resolveHierarchyCache).length <= 1000);
  assert.ok(Object.keys(instance.services.pluralResolver.pluralRulesCache).length <= 1000);
});

test('cache eviction retains offline translations, interpolation and custom country language IDs', async () => {
  const instance = i18next.createInstance();
  await instance.init({
    initAsync: false, lng: 'UZkaa', cleanCode: false,
    returnEmptyString: true, fallbackLng: ['dev'],
    resources: {
      dev: {translation: {greeting: 'Hello {{name}}', fallback: 'Available offline', empty: ''}},
      UZkaa: {translation: {greeting: 'Sálem {{name}}'}},
      ALsq: {translation: {greeting: 'Përshëndetje {{name}}'}},
      KGky: {translation: {greeting: 'Салам {{name}}'}},
    },
  });
  for (let index = 0; index < 1100; index++) {
    const language = `en-x-${index.toString(36).padStart(4, '0')}`;
    instance.services.languageUtils.toResolveHierarchy(language);
    instance.services.pluralResolver.getRule(language);
  }
  for (const [language, greeting] of [['UZkaa', 'Sálem'], ['ALsq', 'Përshëndetje'], ['KGky', 'Салам']]) {
    await instance.changeLanguage(language);
    assert.equal(instance.t('greeting', {name: 'Ada'}), `${greeting} Ada`);
    assert.equal(instance.t('fallback'), 'Available offline');
    assert.equal(instance.t('empty'), '');
  }
});
