import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

if (!process.env.CF_PAGES) process.exit(0);

const build = path.resolve('build');
const archive = path.join(os.tmpdir(), 'docs-build.tar.gz');
execFileSync('tar', ['-czf', archive, '-C', build, '.']);
fs.copyFileSync(archive, path.join(build, 'docs-build.tar.gz'));
fs.writeFileSync(path.join(build, 'docs-build.json'), `${JSON.stringify({
    commit: process.env.CF_PAGES_COMMIT_SHA || null,
    branch: process.env.CF_PAGES_BRANCH || null
})}\n`);
console.log(`Packed ${build} into docs-build.tar.gz (${fs.statSync(archive).size} bytes)`);
