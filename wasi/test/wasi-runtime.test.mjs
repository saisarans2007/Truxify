import assert from 'node:assert/strict';
import test from 'node:test';
import wasiRuntime, { parseWasiJsonOutput } from '../wasi-runtime.js';

test('WASI runtime can be imported without evaluating an undefined stdout value', () => {
  assert.equal(typeof wasiRuntime.validateUrl, 'function');
});

test('WASI JSON output parser ignores runtime noise', () => {
  assert.deepEqual(
    parseWasiJsonOutput('runtime warning\n{"ok":true}\n'),
    { ok: true },
  );
});

test('WASI HTTP allowlist rejects loopback destinations', () => {
  assert.throws(() => wasiRuntime.validateUrl('http://localhost:8080/metadata'));
  assert.throws(() => wasiRuntime.validateUrl('http://127.0.0.1:8080/metadata'));
  assert.throws(() => wasiRuntime.validateUrl('http://api.truxify.com.evil.example/'));
});

test('WASI HTTP allowlist accepts the configured API host', () => {
  assert.doesNotThrow(() => wasiRuntime.validateUrl('https://api.truxify.com/v1/status'));
});
