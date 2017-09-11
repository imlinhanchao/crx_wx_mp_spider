#!/usr/bin/env nodejs
const rpc = require('./rpc');
const program = require('commander');
const fs = require('fs');

let data = {};
let index = 0;
const timeInterval = 20000;

async function download() {
	let link = data[index].link;
	let sn = link.match(/&sn=([^&]*?)&/)[1];
	try {
		rsp = await rpc.get(link);
	} catch (e) {
		console.error(e);
		setTimeout(function() {
			download();
		}, timeInterval);
		return ;
	}
	fs.writeFile("files/" + sn + ".html", rsp.body);
	console.log(`index:${index}, link: ${link}, sn: ${sn}`);
	if(++index < data.length) {
		setTimeout(function() {
			download();
		}, timeInterval);
	}
}

function main() {
	program
	  .version('0.1.0')
	  .option('-i, --index <n>', 'Start Index', parseInt)
	  .option('-f, --file <name>', 'Sync Files')
	  .parse(process.argv);
	  
	let path = program.file || "data.json";
	path = require('path').resolve(__dirname, path);
	fs.stat(path, function(err) {
		if(err) {
			console.error(`${program.file} is not existed`);
			return;
		}
		data = require(path);
		index = program.index || 0;
		download();
	});
}

if (!module.parent) {
	main();
} else {
	module.export.run = main;
}



