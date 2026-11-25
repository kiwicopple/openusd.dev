import {test} from 'node:test';import assert from 'node:assert/strict';
import {meaningfulText,compare} from './source-utils.mjs';
test('source checker ignores script and navigation churn but flags substantive text',()=>{assert.equal(meaningfulText('<nav>new menu</nav><main>API coming soon</main><script>ignore()</script>'),'API coming soon');assert.equal(compare('API coming soon','API available').status,'review_needed');assert.equal(compare('same','same').status,'unchanged');assert.equal(compare(undefined,'new').status,'baseline_needed');});
