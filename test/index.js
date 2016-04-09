const Mocha = require('mocha');
const fs = require('fs');
const path = require('path');

const spawn = require('child_process').spawn;

const mocha = new Mocha();

const casePath = path.join(__dirname, 'cases');
fs.readdirSync(casePath).filter(function(file){
    return file.substr(-3) === '.js';
}).forEach(function(file){
    mocha.addFile(path.join(casePath, file));
});


var serverP = spawn('node', [path.join(__dirname, '..', 'index.js')], {
	stdio: [0, 1, 2],
	detached: false
});

setTimeout(function () {
	// Run the tests.
	mocha.run(function(failures){
		process.kill(serverP.pid);
		process.exit();
	});
}, 1000);