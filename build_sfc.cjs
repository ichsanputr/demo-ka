const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'public', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const appTag = '<div id="app" v-cloak>';
const appStart = html.indexOf(appTag);
if (appStart === -1) {
    console.error('Could not find appTag!');
    process.exit(1);
}
const appTagEnd = appStart + appTag.length;
const scriptStart = html.lastIndexOf('<script>');
const scriptEnd = html.lastIndexOf('</script>');

let template = html.substring(appTagEnd, scriptStart).trim();
if (template.endsWith('</div>')) {
    template = template.substring(0, template.lastIndexOf('</div>')).trim();
}

let js = html.substring(scriptStart + '<script>'.length, scriptEnd).trim();
js = js.replace(/const\s*\{\s*createApp[^}]*\}\s*=\s*Vue;?/, '');
const setupIdx = js.indexOf('setup() {');
const mountIdx = js.lastIndexOf('}).mount');

let consts = js.substring(0, setupIdx).trim();
let setupFunc = js.substring(setupIdx, mountIdx).trim();

const vueSfc = `<template>
  <div class="min-h-screen flex flex-col font-sans bg-[#f8fafc] text-slate-800">
${template}
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';

${consts}

export default {
  name: 'App',
  ${setupFunc}
};
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

.modal-overlay {
    background-color: rgba(15, 23, 42, 0.72);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    transition: opacity 0.25s ease-out;
}
.modal-dialog-content {
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    animation: modalPop 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes modalPop {
    0% { opacity: 0; transform: scale(0.96) translateY(6px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
`;

fs.writeFileSync(path.join(__dirname, 'src', 'App.vue'), vueSfc, 'utf8');
console.log('Successfully wrote vendor_app/src/App.vue! Length:', vueSfc.length);
