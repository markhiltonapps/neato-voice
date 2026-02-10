const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Path to package.json
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = require(packageJsonPath);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log(`\n🚀  NEATO VOICE RELEASE AUTOMATION  🚀`);
console.log(`Current Version: ${packageJson.version}`);

rl.question('\nSelect release type:\n1. Patch (x.x.X) - Bug fixes\n2. Minor (x.X.x) - New features\n3. Major (X.x.x) - Breaking changes\n\nSelection [1]: ', (answer) => {
    let type = 'patch';
    if (answer.trim() === '2') type = 'minor';
    if (answer.trim() === '3') type = 'major';

    const newVersion = getNewVersion(packageJson.version, type);
    console.log(`\nPreparing to release version: ${newVersion}`);

    rl.question('Press ENTER to confirm and start building... (Ctrl+C to cancel)', () => {
        rl.close();
        startRelease(newVersion);
    });
});

function getNewVersion(current, type) {
    const parts = current.split('.').map(Number);
    if (type === 'major') {
        parts[0]++; parts[1] = 0; parts[2] = 0;
    } else if (type === 'minor') {
        parts[1]++; parts[2] = 0;
    } else {
        parts[2]++;
    }
    return parts.join('.');
}

function startRelease(version) {
    try {
        // 1. Update package.json
        console.log(`\n📝 Updating package.json to ${version}...`);
        packageJson.version = version;
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

        // 2. Build
        console.log(`\n🔨 Building application (this takes ~2-3 mins)...`);
        console.log(`   Running: npm run build -- --publish always`);

        // Ensure GH_TOKEN is present in environment variables
        if (!process.env.GH_TOKEN) {
            console.warn(`\n⚠️  WARNING: GH_TOKEN is not found in your environment variables!`);
            console.warn(`   Auto-upload to GitHub might fail unless you have configured it in .env or system env.`);
        }

        execSync('npm run build -- --publish always', {
            stdio: 'inherit',
            cwd: path.join(__dirname, '..'),
            env: { ...process.env } // Pass through current env vars
        });

        console.log(`\n✅ Release Successful!`);
        console.log(`   - Version ${version} built.`);
        console.log(`   - Uploaded to GitHub Releases.`);
        console.log(`   - Auto-Update will trigger for users shortly.`);

    } catch (error) {
        console.error(`\n❌ RELEASE FAILED`);
        console.error(error.message);
        // revert version change? maybe not necessary as user can manually fix
        process.exit(1);
    }
}
