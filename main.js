const core = require('@actions/core');
const exec = require('@actions/exec');
const tc = require('@actions/tool-cache');

const baseDownloadURL = "https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar"

async function downloadWpCli() {
    console.log("Platform: " + process.platform);
    if (process.platform === 'linux') {
        core.debug("Try to download " + baseDownloadURL);
        await tc.downloadTool(`${baseDownloadURL}`, 'wp-cli-tmp/wp-cli');
        return Promise.resolve('wp-cli-tmp');
    }
    core.setFailed('Platform unknown: ' + process.platform);
}

async function run() {
    try {
        var version = '1.0';
        var path = tc.find("wp-cli", version);

        if (!path) {
            const installPath = await downloadWpCli();
            path = await tc.cacheDir(installPath, 'wp-cli', version);
        }
        core.addPath(path);
        core.info(`>>> wp-cli version v${version} installed to ${path}`);

        await exec.exec(`chmod u+x ${path}/wp-cli`);
        await exec.exec(`wp-cli --info`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
